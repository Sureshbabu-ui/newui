using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Models;
using System.Xml.Linq;

namespace BeSureApi.Controllers
{
    [Route("api/designation")]
    [ApiController]
    public class DesignationController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public DesignationController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize()]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.DESIGNATION_VIEW)]
        public async Task<object> GetDesignations(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<Designation> designationList = await GetDesignationList(connection, Page, Search);
                int totalRows = await GetDesignationCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Designations = designationList,
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
                            new ExceptionHandler(ex,"designation_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<Designation>> GetDesignationList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "designation_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var designationList = await Connection.QueryAsync<Designation>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return designationList;
        }

        private async Task<int> GetDesignationCount(SqlConnection Connection, string? Search)
        {
            var procedure = "designation_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.DESIGNATION_MANAGE)]
        public async Task<object> CreateDesignation(DesignationCreate DesignationObj)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var parameters = new DynamicParameters();
                var procedure = "common_is_existing";
                    parameters.Add("TableName", "Designation");
                    parameters.Add("ColumnName", "Code");
                    parameters.Add("Value", DesignationObj.Code);
                    parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                    int count = parameters.Get<int>("Count");
                    if (count > 0)
                    {
                        throw new CustomException("designation_create_code_exists_message");
                    }
                procedure = "designation_create";
                parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("Code", DesignationObj.Code);
                parameters.Add("Name", DesignationObj.Name);
                parameters.Add("IsActive", DesignationObj.IsActive == "true" ? true : false);
                parameters.Add("IsDesignationCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync<Designation>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isDesignationCreated = parameters.Get<int>("IsDesignationCreated");
                if (isDesignationCreated == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsDesignationCreated = Convert.ToBoolean(isDesignationCreated)
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
                            new ExceptionHandler(ex,"designation_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/names")]
        public async Task<ActionResult> GetDesignationNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "designation_get_names";
                var designations = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { Designations = designations } };
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
                            new ExceptionHandler(ex,"designation_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.DESIGNATION_MANAGE)]
        public async Task<object> EditCountry(DesignationEdit DesignationObj)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
            var procedure = "common_is_existing";
            var parameters = new DynamicParameters();
            parameters.Add("TableName", "Designation");
            parameters.Add("ColumnName", "Name");
            parameters.Add("Value", DesignationObj.Name);
            parameters.Add("Id", DesignationObj.Id);
            parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
            var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            int count = parameters.Get<int>("Count");
            if (count > 0)
            {
                ModelState.AddModelError("Name", "designation_name_exists_message");
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
            procedure = "designation_update";
                parameters = new DynamicParameters();
                parameters.Add("Id", DesignationObj.Id);
                parameters.Add("Name", DesignationObj.Name);
                parameters.Add("IsActive", DesignationObj.IsActive);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<CountryEdit>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsDesignationUpdated = true
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
                            new ExceptionHandler(ex,"designation_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.DESIGNATION_MANAGE)]
        public async Task<object> DeleteDesignation(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "designation_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("designation_delete_restricted_message");
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
                           new ExceptionHandler(ex,"designation_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
