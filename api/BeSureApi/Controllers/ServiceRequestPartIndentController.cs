using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Models;
using Microsoft.VisualBasic;
using BeSureApi.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;

namespace BeSureApi.Controllers
{
    [Route("api/servicerequest/partindent")]
    [ApiController]
    public class ServiceRequestPartIndentController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ServiceRequestPartIndentController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet,Authorize()]
        [Route("list"),HasPermission(ServiceRequestBusinessFunctionCode.SERVICE_REQUEST_DETAILS)]
        public async Task<ActionResult<List<PartIndentRequestList>>> GetPartIndentRequestList(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentrequest_list";
                var parameters = new DynamicParameters();
                parameters.Add("@ServiceRequestId", ServiceRequestId);
                var partrequestInfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    { 
                        PartIndentRequestList = partrequestInfo
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
                            new ExceptionHandler(ex,"part_request_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize]
        [Route("create"), HasPermission(PartIndentBusinessFunctionCode.PARTINDENT_CREATE)]
        public async Task<ActionResult<PartIndentRequestCreate>> CreatePartRequest(PartIndentRequestCreate PartIndent)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentrequest_create";
                var parameters = new DynamicParameters();
                parameters.Add("PartIndentDetail", JsonSerializer.Serialize(PartIndent.partInfoList));
                parameters.Add("ServiceRequestId", PartIndent.ServiceRequestId);
                parameters.Add("TenantOfficeId", PartIndent.TenantOfficeId);
                parameters.Add("RequestedBy", (PartIndent.RequestedBy!=null)?PartIndent.RequestedBy:User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("Remarks", PartIndent.Remarks);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsPartRequestCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var tenantdata = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isPartRequestCreated = parameters.Get<int>("IsPartRequestCreated");
                if (isPartRequestCreated == 0)
                { throw new Exception(); }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPartRequestCreated = Convert.ToBoolean(isPartRequestCreated)
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
                            new ExceptionHandler(ex,"part_request_create_failed_message",_logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }
        [HttpGet,Authorize]
        [Route("detail"),HasPermission(ServiceRequestBusinessFunctionCode.SERVICE_REQUEST_DETAILS)]
        public async Task<ActionResult<List<PartIndentDetails>>> GetRequestDetails(int PartIndentRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentrequest_detail";
                var parameters = new DynamicParameters();
                parameters.Add("@PartIndentRequestId", PartIndentRequestId);
                var partrequestInfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data =  partrequestInfo                   
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
                            new ExceptionHandler(ex,"part_request_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet,Authorize]
        [Route("requestable")]
        public async Task<ActionResult> IsPartRequestable(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var isPartRequestable = new RequestableDetails();
                var procedure = "servicerequest_partindent_requestable";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", ServiceRequestId);
                parameters.Add("IsComprehensive", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsUnderWarranty", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("WorkOrderNumber", dbType: DbType.String, direction: ParameterDirection.Output,size:16);
                parameters.Add("IsRequestClosed", dbType: DbType.Boolean, direction: ParameterDirection.Output,size:8);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                isPartRequestable.IsComprehensive = parameters.Get<bool>("IsComprehensive");
                isPartRequestable.IsUnderWarranty = parameters.Get<bool>("IsUnderWarranty");
                isPartRequestable.WorkOrderNumber = parameters.Get<string>("WorkOrderNumber");
                isPartRequestable.IsRequestClosed = parameters.Get<bool>("IsRequestClosed");
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPartRequestable = isPartRequestable
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
                            new ExceptionHandler(ex,"part_request_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize]
        [Route("sme/approved/detail")]
        public async Task<ActionResult<List<SmeApprovedPartIndentDetails>>> GetSmeApprovedRequestDetails(int PartIndentRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentrequest_sme_approved_detail";
                var parameters = new DynamicParameters();
                parameters.Add("@PartIndentRequestId", PartIndentRequestId);
                var partrequestInfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = partrequestInfo
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
                            new ExceptionHandler(ex,"part_request_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("accepted/stocks")]
        public async Task<ActionResult<object>> GetServieRequestAcceptedPartIndentStocks(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentrequestdetail_accepted_stocks";
                var parameters = new DynamicParameters();
                parameters.Add("@ServiceRequestId", ServiceRequestId);
                var partindents = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IndentList = partindents
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
                            new ExceptionHandler(ex,"partreturn_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
