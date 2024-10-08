using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BeSureApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StateController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public StateController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("get/all/in/country")]
        public async Task<ActionResult> GetAllStatesInCountry(int CountryId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "state_get_all_in_country";
                var parameters = new DynamicParameters();
                parameters.Add("CountryId", CountryId);
                var states = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        States = states
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
                        message = new[] {
                            new ExceptionHandler(ex,"state_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.STATE_VIEW)]
        public async Task<ActionResult> GetAllStates(int Page, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                int TotalRows = await GetStateCount(Connection, Page, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                var procedure = "state_list";
                var parameters = new DynamicParameters();
                parameters.Add("Page", Page);
                parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
                parameters.Add("Search", Search);
                var states = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        States = states,
                        currentPage = Page,
                        totalRows = TotalRows,
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
                        message = new[] {
                            new ExceptionHandler(ex,"state_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<int> GetStateCount(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "state_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.STATE_MANAGE)]
        public async Task<object> CreateState(StateCreate state)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "State");
                parameters.Add("ColumnName", "Name");
                parameters.Add("Value", state.Name);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    throw new CustomException("state_name_exists_message");
                }
                procedure = "state_create";
                parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("Code", state.Code);
                parameters.Add("Name", state.Name);
                parameters.Add("CountryId", state.CountryId);
                parameters.Add("GstStateCode", state.GstStateCode);
                parameters.Add("GstStateName", state.GstStateName);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsStateCreated = true
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
                            new ExceptionHandler(ex,"state_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.STATE_MANAGE)]
        public async Task<object> UpdateEdit(StateUpdate state)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "State");
                parameters.Add("ColumnName", "Name");
                parameters.Add("Value", state.Name);
                parameters.Add("Id", state.Id);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    throw new CustomException("state_name_exists_message");
                }
                procedure = "state_update";
                parameters = new DynamicParameters();
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("Name", state.Name);
                parameters.Add("Id", state.Id);
                parameters.Add("CountryId", state.CountryId);
                parameters.Add("GstStateCode", state.GstStateCode);
                parameters.Add("GstStateName", state.GstStateName);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsStateUpdated = true
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
                            new ExceptionHandler(ex,"state_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.STATE_MANAGE)]
        public async Task<object> DeleteState(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "state_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("state_delete_restricted_message");
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
                           new ExceptionHandler(ex,"state_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
