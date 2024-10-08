using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Models;

namespace BeSureApi.Controllers
{
    [Route("api/customer/group")]
    [ApiController]
    public class CustomerGroupController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public CustomerGroupController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.CUSTOMERGROUP_MANAGE)]
        public async Task<object> CreateCustomerGroup(CustomerGroupCreate CustomerGroup)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customer_group_unique_check";
                var parameters = new DynamicParameters();
                parameters.Add("GroupCode", CustomerGroup.GroupCode);
                parameters.Add("GroupName", CustomerGroup.GroupName);
                parameters.Add("IsGroupCodeExist", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("IsGroupNameExist", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isGroupCodeExist = parameters.Get<int>("@IsGroupCodeExist");
                int isGroupNameExist = parameters.Get<int>("@IsGroupNameExist");
                if (isGroupCodeExist == 1 && isGroupNameExist == 1)
                {
                    throw new CustomException("customer_group_code_name_exists_message");
                }
                else if (isGroupCodeExist == 1)
                {
                    throw new CustomException("customer_group_code_exists_message");
                }
                else if (isGroupNameExist == 1)
                {
                    throw new CustomException("customer_group_name_exists_message");
                }
                procedure = "customer_group_create";
                parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("GroupCode", CustomerGroup.GroupCode);
                parameters.Add("GroupName", CustomerGroup.GroupName);
                parameters.Add("IsCustomerGroupCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync<CustomerGroupCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isCustomerGroupCreated = parameters.Get<int>("IsCustomerGroupCreated");
                if (isCustomerGroupCreated == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCustomerGroupCreated = Convert.ToBoolean(isCustomerGroupCreated)
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
                            new ExceptionHandler(ex,"customer_group_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.CUSTOMERGROUP_VIEW)]
        public async Task<object> GetCustomerGroups(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<CustomerGroup> CustomerGroupList = await GetCustomerGroupList(connection, Page, Search);
                int totalRows = await GetCustomerGroupCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CustomerGroups = CustomerGroupList,
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
                            new ExceptionHandler(ex,"customer_group_no_data", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<CustomerGroup>> GetCustomerGroupList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "customer_group_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var CustomerGroupList = await Connection.QueryAsync<CustomerGroup>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return CustomerGroupList;
        }
        private async Task<int> GetCustomerGroupCount(SqlConnection Connection, string? Search)
        {
            var procedure = "customer_group_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpGet]
        [Route("name")]
        public async Task<object> GetCustomerGroupNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customer_group_get_names";
                var customerGroupNames = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { CustomerGroupNames = customerGroupNames } };
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
                            new ExceptionHandler(ex,"customer_group_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.CUSTOMERGROUP_MANAGE)]
        public async Task<object> EditCountry(CustomerGroupUpdate CustomerGroup)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "CustomerGroup");
                parameters.Add("ColumnName", "GroupName");
                parameters.Add("Value", CustomerGroup.GroupName);
                parameters.Add("Id", CustomerGroup.Id);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    ModelState.AddModelError("GroupName", "customergroup_edit_name_exists_message");
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
                procedure = "customergroup_update";
                parameters = new DynamicParameters();
                parameters.Add("Id", CustomerGroup.Id);
                parameters.Add("GroupName", CustomerGroup.GroupName);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<CountryEdit>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCustomerGroupUpdated = true
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
                            new ExceptionHandler(ex,"customer_group_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.CUSTOMERGROUP_MANAGE)]
        public async Task<object> DeleteCustomerGroup(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customergroup_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("customergroup_delete_restricted_message");
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
                           new ExceptionHandler(ex,"customergroup_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}