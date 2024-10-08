using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace BeSureApi.Controllers
{
    [Route("api/eventconditionmaster")]
    [ApiController]
    public class EventConditionMasterController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public EventConditionMasterController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(ApprovalBusinessFunctionCode.APPROVALWORKFLOW_VIEW)]
        public async Task<ActionResult<List<EventConditionMasterColumnList>>> GetAllApprovalEvents(int ApprovalEventId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<EventConditionMasterColumnList> events = await GetApprovalEventList(Connection, ApprovalEventId);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        EventConditionMasters = events
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
                            new ExceptionHandler(ex,"eventconditionmaster_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<EventConditionMasterColumnList>> GetApprovalEventList(SqlConnection Connection, int ApprovalEventId)
        {
            var procedure = "eventconditionmastercolumn_list";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalEventId", ApprovalEventId);
            var eventList = await Connection.QueryAsync<EventConditionMasterColumnList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return eventList;
        }
    }
}
