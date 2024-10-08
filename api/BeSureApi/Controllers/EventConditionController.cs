using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Text.Json;
using Dapper;
using System.Data;

namespace BeSureApi.Controllers
{
    [Route("api/eventcondition")]
    [ApiController]
    public class EventConditionController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public EventConditionController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize(), HasPermission(ApprovalBusinessFunctionCode.APPROVALWORKFLOW_VIEW)]
        [Route("list/{EventId}")]
        public async Task<object> GetEventconditionList(int EventId, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var eventConditionView = await GetEventConditionListByEvent(connection, EventId, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        EventDetail = eventConditionView.EventDetail,
                        EventConditionList = eventConditionView.EventConditionList,
                        TotalRows = eventConditionView.EventConditionList.Count(),
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
                            new ExceptionHandler(ex,"eventconditionlist_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<EventConditionListView> GetEventConditionListByEvent(SqlConnection connection, int EventId, string? search)
        {
            var procedure = "eventcondition_list_by_event";
            var parameters = new DynamicParameters();
            parameters.Add("EventId", EventId);
            parameters.Add("Search", search);

            using (var multi = await connection.QueryMultipleAsync(procedure, parameters, commandType: CommandType.StoredProcedure))
            {
                var eventDetail = await multi.ReadFirstOrDefaultAsync<EventDetail>();
                var eventConditionList = await multi.ReadAsync<EventConditionList>();

                return new EventConditionListView
                {
                    EventDetail = eventDetail,
                    EventConditionList= eventConditionList
                };
            }
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(ApprovalBusinessFunctionCode.APPROVALWORKFLOW_MANAGE)]
        public async Task<object> CreatEventCondition(EventConditionCreate eventCondition)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "eventcondition_create";
                var parameters = new DynamicParameters();
                parameters.Add("ApprovalEventId", eventCondition.ApprovalEventId);
                parameters.Add("ApprovalWorkflowId", eventCondition.ApprovalWorkflowId);
                parameters.Add("ConditionName", eventCondition.ConditionName);
                parameters.Add("ConditionValue", eventCondition.ConditionValue);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<CityCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsEventConditionCreated = true
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
                            new ExceptionHandler(ex,"eventcondition_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [ Authorize()]
        [HttpPut("{EventConditionId}")]
        [HasPermission(ApprovalBusinessFunctionCode.APPROVALWORKFLOW_MANAGE)]
        public async Task<object> EditEventCondition(string EventConditionId, EventConditionEdit eventCondition)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "eventcondition_update";
                var parameters = new DynamicParameters();
                parameters.Add("EventConditionId", eventCondition.EventConditionId);
                parameters.Add("ApprovalWorkflowId", eventCondition.ApprovalWorkflowId);
                parameters.Add("ConditionName", eventCondition.ConditionName);
                parameters.Add("ConditionValue", eventCondition.ConditionValue);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<CityCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsEventConditionUpdated = true
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
                            new ExceptionHandler(ex,"eventcondition_edit_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }


        [HttpPost, Authorize(), 
        HasPermission(ApprovalBusinessFunctionCode.APPROVALWORKFLOW_MANAGE)]
        [Route("sort/{EventId}")]
        public async Task<object> SortEventconditionList(int EventId, List<EventConditionList> EventConditions)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "eventcondition_sort";
                var parameters = new DynamicParameters();
                parameters.Add("ApprovalEventId", EventId);
                parameters.Add("EventConditions", JsonSerializer.Serialize(EventConditions));
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<CityCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsEventConditionSorted = true
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
                            new ExceptionHandler(ex,"eventconditionlist_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
