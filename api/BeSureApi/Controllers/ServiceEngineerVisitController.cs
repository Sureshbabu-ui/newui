using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace BeSureApi.Controllers
{
    [Route("api/serviceengineervisit")]
    [ApiController]
    public class ServiceEngineerVisitController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ServiceEngineerVisitController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpPost, Authorize()]
        [Route("start")]
        public async Task<object> StartEngineerVisit(int ServiceRequestAssignmentId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "serviceengineervisit_start";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestAssignmentId", ServiceRequestAssignmentId);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                               
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsVisitStarted = true
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
                            new ExceptionHandler(ex,"serviceengineervisit_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut("{ServiceEngineerVisitId}/close")]
        [Authorize()]
        public async Task<ActionResult> CloseContract(int ServiceEngineerVisitId,ServiceEngineerVisitUpdate visitCloseData)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "serviceengineervisit_close";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceEngineerVisitId", ServiceEngineerVisitId);
                parameters.Add("EngineerNote", visitCloseData.EngineerNote);
                parameters.Add("EndsOn", visitCloseData.EndsOn);
                parameters.Add("IsRemoteSupport", visitCloseData.IsRemoteSupport);
                parameters.Add("DistanceTravelled", visitCloseData.DistanceTravelled);
                parameters.Add("TravelModeId", visitCloseData.TravelModeId);
                parameters.Add("ServiceRequestStatusId", visitCloseData.ServiceRequestStatusId);
                parameters.Add("PartIndents", JsonSerializer.Serialize(visitCloseData.PartIndents));
                parameters.Add("ClosedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsVisitClosed = true
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
                            new ExceptionHandler(ex,"serviceengineervisit_close_failed_message", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("list/by/request"),]
        public async Task<ActionResult<List<ServiceEngineerVisitList>>> GetPartIndentRequestList(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "serviceengineervisit_list_by_request";
                var parameters = new DynamicParameters();
                parameters.Add("@ServiceRequestId", ServiceRequestId);
                var visits= await connection.QueryAsync<ServiceEngineerVisitList>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceEngineerVisitRequestList = visits
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
                            new ExceptionHandler(ex,"serviceengineervisit_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
