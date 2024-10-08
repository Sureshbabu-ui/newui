using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Text.Json;
using Dapper;
using System.Data;
using Microsoft.AspNetCore.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/approvalevent")]
    [ApiController]
    public class ApprovalEventController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ApprovalEventController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet,Authorize()]
        [Route("list")]
        [HasPermission(ApprovalBusinessFunctionCode.APPROVALWORKFLOW_VIEW)]
        public async Task<ActionResult<List<ApprovalEventList>>> GetAllApprovalEvents(string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ApprovalEventList> events = await GetApprovalEventList(Connection, Search);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ApprovalEvents = events
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
                            new ExceptionHandler(ex,"approvalevent_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<ApprovalEventList>> GetApprovalEventList(SqlConnection Connection, string? Search)
        {
            var procedure = "approvalevent_list";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            var eventList = await Connection.QueryAsync<ApprovalEventList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return eventList;
        }

        [HttpGet,Authorize()]
        [Route("get/names")]
        public async Task<object> GetNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "approvalevent_get_names";
                var events = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);
                var response = new {
                    status = StatusCodes.Status200OK,
                    data = new { 
                    ApprovalEvents = events
                   } 
                };
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
                            new ExceptionHandler(ex,"approvalevent_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("get/names/by/user")]
        public async Task<object> GetNamesByUser()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "approvalevent_get_names_by_user";
                var parameters = new DynamicParameters();
                parameters.Add("@LoggedUserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var events = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ApprovalEvents = events
                    }
                };
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
                            new ExceptionHandler(ex,"approvalevent_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
