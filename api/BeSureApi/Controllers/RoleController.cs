using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Services.LogService;
using BeSureApi.Exceptions;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Models;

namespace BeSureApi.Controllers
{
        [Route("api/role")]
        [ApiController]
        public class RoleController : Controller
        {
            private readonly IConfiguration _config;
            private readonly ILogService _logService;

            public RoleController(IConfiguration config, ILogService logService)
            {
                _config = config;
                _logService = logService;
            }

        [HttpGet, Authorize()]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.ROLE_VIEW)]
        public async Task<ActionResult> GetRolesList()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "role_get_names";
                var rolesList = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { Roles = rolesList } };
                return Ok(JsonSerializer.Serialize(response));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"rolelist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.ROLE_MANAGE)]
        public async Task<object> CreateRole(RoleCreate RoleObj)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var columnNames = new List<string> { "Code", "Name" };
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "Role");
                foreach (var columnName in columnNames)
                {
                    parameters.Add("ColumnName", columnName);
                    if (columnName == "Code")
                    {
                        parameters.Add("Value", RoleObj.Code);
                    }
                    else if (columnName == "Name")
                    {
                        parameters.Add("Value", RoleObj.Name);
                    }
                    parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                    int count = parameters.Get<int>("Count");
                    if (count > 0)
                    {
                        ModelState.AddModelError(columnName,  "An entry with this value already exists.");
                    }
                }
                if (!ModelState.IsValid)
                {
                     return BadRequest(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status400BadRequest,
                        errors = UnprocessableEntity(ModelState).Value   
                    }                        
                    ));
                }
                procedure = "role_create";
                parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("Name", RoleObj.Name);
                parameters.Add("Code", RoleObj.Code);
                parameters.Add("IsActive", RoleObj.IsActive == "true" ? true : false);
                parameters.Add("IsRoleCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync<Designation>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isRoleCreated = parameters.Get<int>("IsRoleCreated");
                if (isRoleCreated == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsRoleCreated = Convert.ToBoolean(isRoleCreated)
                    }
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[]
                        {
                            new ExceptionHandler(ex,"role_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.ROLE_MANAGE)]
        public async Task<ActionResult> UpdateRole(UpdatedRoleDetail updatedDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "Role");
                parameters.Add("ColumnName", "Name");
                parameters.Add("Value", updatedDetails.Name);
                parameters.Add("Id", updatedDetails.RoleId);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    ModelState.AddModelError("Name",  "role_edit_name_exists_message");
                }
                if (!ModelState.IsValid)
                {
                    return BadRequest(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status400BadRequest,
                        errors = UnprocessableEntity(ModelState).Value
                    }
                   ));
                }
                procedure = "role_update";
                parameters = new DynamicParameters();
                parameters.Add("RoleId", updatedDetails.RoleId);
                parameters.Add("Name", updatedDetails.Name);
                parameters.Add("IsActive", updatedDetails.IsActive);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("@IsRoleUpdated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                connection.Query(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isRoleUpdated = parameters.Get<int>("IsRoleUpdated");
                var response = new { status = StatusCodes.Status200OK, data = new { IsRoleUpdated = Convert.ToBoolean(isRoleUpdated) } };
                return Ok(JsonSerializer.Serialize(response));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"role_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet, Authorize()]
        [Route("get/list")]
        public async Task<object> GetRoles(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<Role> roleList = await GetRoleList(connection, Page, Search);
                int totalRows = await GetRoleCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Roles = roleList,
                        CurrentPage = Page,
                        TotalRows = totalRows,
                        PerPage = perPage
                    }
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"rolelist_no_data", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<Role>> GetRoleList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "role_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var roleList = await Connection.QueryAsync<Role>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return roleList;
        }

        private async Task<int> GetRoleCount(SqlConnection Connection, string? Search)
        {
            var procedure = "role_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet,Authorize()]
        [Route("get/titles")]
        public async Task<ActionResult> GetRoleTitles()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "role_get_names";
                var parameters = new DynamicParameters();
                var roleTitles = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { RoleTitles = roleTitles} };
                return Ok(JsonSerializer.Serialize(response));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"rolelist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.ROLE_MANAGE)]
        public async Task<object> DeleteRole(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "role_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("@IsRoleDeleted", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isRoleDeleted = parameters.Get<int>("IsRoleDeleted");
                if(isRoleDeleted == 0) {
                    throw new CustomException("validation_error_role_delete_warning");
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsDeleted = true
                    }
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                           new ExceptionHandler(ex,"rolelist_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
