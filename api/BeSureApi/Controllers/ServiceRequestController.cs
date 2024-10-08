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
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Services;
using BeSureApi.Helpers;
using System.Transactions;
using System.Data.Common;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Collections.ObjectModel;
using static BeSureApi.Models.PartIndent;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;

namespace BeSureApi.Controllers
{
    [Route("api/servicerequest")]
    [ApiController]
    public class ServiceRequestController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IPdfService _pdfService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly JobQueueHelper _jobQueueHelper;
        public ServiceRequestController(IConfiguration config, ILogService logService, IPdfService pdfService, IWebHostEnvironment hostingEnvironment)
        {
            _config = config;
            _logService = logService;
            _pdfService = pdfService;
            _hostingEnvironment = hostingEnvironment;
            _jobQueueHelper = new JobQueueHelper(config);
        }
        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(ServiceRequestBusinessFunctionCode.SERVICE_REQUEST_CREATE)]
        public async Task<object> CreateServiceRequest(ServiceRequestCreate serviceRequest)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();
            using (var transaction = connection.BeginTransaction())
            {
                try
                {
                    int? assetId = null;
                    var procedure = "";
                    var parameters = new DynamicParameters();
                    if (serviceRequest.IsInterimCaseId == true && serviceRequest.IsFinanceApproval == false && serviceRequest.IsPreAmcApproval == false)
                    {
                        procedure = "contractinterimasset_create";
                        parameters.Add("ContractId", serviceRequest.ContractId);
                        parameters.Add("CustomerSiteId", serviceRequest.CustomerSiteId);
                        parameters.Add("ProductCategoryId", serviceRequest.ProductCategoryId);
                        parameters.Add("ProductMakeId", serviceRequest.ProductMakeId);
                        parameters.Add("ProductModelId", serviceRequest.ProductModelNumber);
                        parameters.Add("ProductSerialNumber", serviceRequest.ProductSerialNumber);
                        parameters.Add("InterimAssetStatus", "IAS_PRVW");
                        parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                        parameters.Add("ContractInterimAssetId", dbType: DbType.Int32, direction: ParameterDirection.Output);
                        await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                        int contractInterimAssetId = parameters.Get<int>("ContractInterimAssetId");
                        if (contractInterimAssetId == null)
                        {
                            throw new CustomException("validation_error_create_interim_asset_failed");
                        }
                        // Assigning contractInterimAssetId to assetId
                        assetId = contractInterimAssetId;
                    }
                    if (serviceRequest.TicketNumber != null)
                    {
                        procedure = "common_is_existing";
                        parameters = new DynamicParameters();
                        parameters.Add("TableName", "ServiceRequest");
                        parameters.Add("ColumnName", "TicketNumber");
                        parameters.Add("Value", serviceRequest.TicketNumber);
                        parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                        var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                        int count = parameters.Get<int>("Count");
                        if (count > 0)
                        {
                            ModelState.AddModelError("TicketNumber", "Ticket Number already exists.");
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
                    }
                    procedure = "servicerequest_create";
                    parameters = new DynamicParameters();
                    parameters.Add("IsInterimCaseId", serviceRequest.IsInterimCaseId);
                    parameters.Add("IsFinanceApproval", serviceRequest.IsFinanceApproval);
                    parameters.Add("IsPreAmcApproval", serviceRequest.IsPreAmcApproval);
                    parameters.Add("ContractId", serviceRequest.ContractId);
                    parameters.Add("IncidentId", serviceRequest.IncidentId);
                    parameters.Add("CaseStatusId", serviceRequest.CallStatusId);
                    parameters.Add("TicketNumber", serviceRequest.TicketNumber);
                    parameters.Add("CustomerReportedIssue", serviceRequest.CustomerReportedIssue);
                    parameters.Add("CaseReportedCustomerEmployeeName", serviceRequest.CaseReportedCustomerEmployeeName);
                    parameters.Add("CaseReportedOn", serviceRequest.CaseReportedOn);
                    parameters.Add("CustomerInfoId", serviceRequest.CustomerInfoId);
                    parameters.Add("CustomerSiteId", serviceRequest.CustomerSiteId);
                    parameters.Add("ContractAssetId", serviceRequest.ContractAssetId);
                    parameters.Add("ContractInterimAssetId", assetId);
                    parameters.Add("EndUserName", serviceRequest.EndUserName);
                    parameters.Add("EndUserPhone", serviceRequest.EndUserPhone);
                    parameters.Add("EndUserEmail", serviceRequest.EndUserEmail);
                    parameters.Add("CallTypeId", serviceRequest.CallTypeId);
                    parameters.Add("RepairReason", serviceRequest.RepairReason);
                    parameters.Add("CallCenterRemarks", serviceRequest.CallCenterRemarks);
                    parameters.Add("OptedForRemoteSupport", serviceRequest.OptedForRemoteSupport);
                    parameters.Add("RemoteSupportNotOptedReason", serviceRequest.RemoteSupportNotOptedReason);
                    parameters.Add("CustomerContactTypeId", serviceRequest.CustomerContactTypeId);
                    parameters.Add("CallSourceId", serviceRequest.CallSourceId);
                    parameters.Add("CustomerServiceAddress", serviceRequest.CustomerServiceAddress);
                    parameters.Add("CallSeverityLevelId", serviceRequest.CallSeverityLevelId);
                    parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                    parameters.Add("IsServiceRequestCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    parameters.Add("IsInterimRequestCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    parameters.Add("ServiceRequestId", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                    int isServiceRequestCreated = parameters.Get<int>("IsServiceRequestCreated");
                    int isInterimRequestCreated = parameters.Get<int>("IsInterimRequestCreated");
                    int ServiceRequestId = parameters.Get<int>("ServiceRequestId");
                    if (isServiceRequestCreated == 0)
                    {
                        throw new Exception();
                    }
                    if (serviceRequest.IsInterimCaseId == false)
                    {
                        var isWorkOrderNumberGenerated = await generateWorkOrderNum(connection, ServiceRequestId, transaction: transaction);
                        if (isWorkOrderNumberGenerated == 0)
                        {
                            throw new Exception();
                        }
                        if (isWorkOrderNumberGenerated == 1)
                        {
                            parameters = new DynamicParameters();
                            procedure = "servicerequest_details_for_email";
                            parameters.Add("ServiceRequestId", ServiceRequestId);
                            var callDetails = await connection.QueryAsync<ServiceRequestDetailsForEmail>(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                            string caseId = callDetails?.FirstOrDefault()?.CaseId;
                            string workorderNo = callDetails?.FirstOrDefault()?.WorkOrderNumber;
                            var mail = new EmailDto()
                            {
                                To = callDetails?.FirstOrDefault()?.PrimaryContactEmail,
                                Subject = $"Service Request Created Successfully - Case ID : {caseId} - Work Order Number : {workorderNo} ",
                            };
                            string templatePath = Path.Combine(_hostingEnvironment.ContentRootPath, "EmailTemplates", "CallCreatedEmail.html");
                            string template = "";
                            if (System.IO.File.Exists(templatePath))
                            {
                                template = System.IO.File.ReadAllText(templatePath);
                            }
                            mail.Body = string.Format(template,
                                callDetails?.FirstOrDefault()?.CustomerName,
                                callDetails?.FirstOrDefault()?.CaseId,
                                callDetails?.FirstOrDefault()?.WorkOrderNumber,
                                callDetails?.FirstOrDefault()?.CaseStatus,
                                callDetails?.FirstOrDefault()?.ProductSupportType,
                                callDetails?.FirstOrDefault()?.CustomerName,
                                callDetails?.FirstOrDefault()?.ModelName,
                                callDetails?.FirstOrDefault()?.ProductSerialNumber
                                );
                            await _jobQueueHelper.AddMailToJobQueue( mail );
                        }
                    }                 

                    if (serviceRequest.RemotelyClose == true && serviceRequest.IsInterimCaseId == false)
                    {
                        parameters = new DynamicParameters();
                        procedure = "servicerequest_close_call";
                        parameters.Add("ClosureRemarks", serviceRequest.ClosureRemarks);
                        parameters.Add("CaseStatusCode", "SRS_RCLD");
                        parameters.Add("HoursSpent", serviceRequest.HoursSpent);
                        parameters.Add("IsSlaBreached", false);
                        parameters.Add("ServiceRequestId", ServiceRequestId);
                        parameters.Add("ClosedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                        await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);

                        parameters = new DynamicParameters();
                        procedure = "servicerequest_customer_details";
                        parameters.Add("ServiceRequestId", ServiceRequestId);
                        var callClosureDetails = await connection.QueryAsync<CallClosureDetails>(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);

                        parameters = new DynamicParameters();
                        procedure = "servicerequest_details_for_email";
                        parameters.Add("ServiceRequestId", ServiceRequestId);
                        var callDetails = await connection.QueryAsync<ServiceRequestDetailsForEmail>(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                        string CaseId = callDetails?.FirstOrDefault()?.CaseId;
                        string CreatedOn = callDetails?.FirstOrDefault()?.CreatedOn;

                        var mail = new EmailDto()
                        {
                            To = callClosureDetails?.FirstOrDefault()?.PrimaryContactEmail,
                            Subject = "Closure of Your Service Request Call",
                        };
                        string templatePath = Path.Combine(_hostingEnvironment.ContentRootPath, "EmailTemplates", "CallClosureEmail.html");
                        string template = "";
                        if (System.IO.File.Exists(templatePath))
                        {
                            template = System.IO.File.ReadAllText(templatePath);
                        }
                        mail.Body = string.Format(template, callDetails?.FirstOrDefault()?.CustomerName, CaseId, CreatedOn);
                        await _jobQueueHelper.AddMailToJobQueue(mail);
                    }
                    transaction.Commit();
                    return Ok(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status200OK,
                        data = new
                        {
                            IsCreated = Convert.ToBoolean(isServiceRequestCreated),
                            IsInterimRequest = Convert.ToBoolean(isInterimRequestCreated)
                        }
                    }));
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return BadRequest(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status400BadRequest,
                        errors = new
                        {
                            Message = new[] {
                                new ExceptionHandler(ex,"service_request_create_failed_message", _logService).GetMessage()
                            }
                        }
                    }));
                }
            }
        }

        private async Task<Int16> generateWorkOrderNum(SqlConnection Connection, int ServiceRequestId, SqlTransaction? transaction)
        {
            var procedure = "servicerequest_workordernumber_generate";
            var parameters = new DynamicParameters();
            parameters.Add("ServiceRequestId", ServiceRequestId);
            parameters.Add("@IsWorkOrderNumberGenerated", dbType: DbType.Int16, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
            return parameters.Get<Int16>("@IsWorkOrderNumberGenerated");
        }


        [HttpGet]
        [Route("get/interim/assetdetails")]
        public async Task<ActionResult> GetServiceRequestInterimAssetDetails(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "service_request_interim_asset_details";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var assetDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        AssetDetails = assetDetails.First()
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
                            new ExceptionHandler(ex,"service_request_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("call/close")]
        public async Task<object> CallClosure(CallClosure CallClosure)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();
            using (var transaction = connection.BeginTransaction())
                try
                {
                    var parameters = new DynamicParameters();
                    var procedure = "servicerequest_close_call";
                    parameters.Add("ClosureRemarks", CallClosure.ClosureRemarks);
                    parameters.Add("SlaBreachedReason", CallClosure.SlaBreachedReason);
                    parameters.Add("IsSlaBreached", CallClosure.IsSlaBreached);
                    parameters.Add("CaseStatusCode", CallClosure.CaseStatusCode);
                    parameters.Add("HoursSpent", CallClosure.HoursSpent);
                    parameters.Add("ServiceRequestId", CallClosure.ServiceRequestId);
                    parameters.Add("ClosedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                    await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);

                    parameters = new DynamicParameters();
                    procedure = "servicerequest_customer_details";
                    parameters.Add("ServiceRequestId", CallClosure.ServiceRequestId);
                    var callClosureDetails = await connection.QueryAsync<CallClosureDetails>(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);

                    parameters = new DynamicParameters();
                    procedure = "servicerequest_details_for_email";
                    parameters.Add("ServiceRequestId", CallClosure.ServiceRequestId);
                    var callDetails = await connection.QueryAsync<ServiceRequestDetailsForEmail>(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                    string CaseId = callDetails?.FirstOrDefault()?.CaseId;
                    string CreatedOn = callDetails?.FirstOrDefault()?.CreatedOn;

                    var mail = new EmailDto()
                    {
                        To = callDetails?.FirstOrDefault()?.PrimaryContactEmail,
                        Subject = "Closure of Your Service Request Call",
                    };
                    string templatePath = Path.Combine(_hostingEnvironment.ContentRootPath, "EmailTemplates", "CallClosureEmail.html");
                    string template = "";
                    if (System.IO.File.Exists(templatePath))
                    {
                        template = System.IO.File.ReadAllText(templatePath);
                    }
                    mail.Body = string.Format(template, callDetails?.FirstOrDefault()?.CustomerName, CaseId, CreatedOn);
                    await _jobQueueHelper.AddMailToJobQueue(mail);
                    //_emailService.SendEmail(mail);

                    transaction.Commit();

                    return Ok(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status200OK,
                        data = new
                        {
                            ServiceRequestClosed = true
                        }
                    }));
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return BadRequest(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status400BadRequest,
                        errors = new
                        {
                            Message = new[] {
                    new ExceptionHandler(ex,"service_request_close_failed_message", _logService).GetMessage()
                }
                        }
                    }));
                }
        }


        [HttpGet]
        [Route("get/listbyassignees")]
        public async Task<ActionResult<MobesureServiceRequestList>> GetServiceRequestListByAssignees(int JobStatus)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequest_list_by_assignee";
                var parameters = new DynamicParameters();
                parameters.Add("JobStatus", JobStatus);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var serviceRequestList = await connection.QueryAsync<MobesureServiceRequestList>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceRequestList = serviceRequestList,
                        TotalRows = serviceRequestList.Count()
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
                            new ExceptionHandler(ex,"service_request_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/assignee/jobcount")]
        public async Task<object> GetServiceRequestAssigneeJobCount()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequest_assignee_job_count";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var pendingJobCount = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        JobCounts = pendingJobCount.First()
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
                            new ExceptionHandler(ex,"service_request_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("previous/tickets")]
        public async Task<object> PreviousTickets(int? AssetId, int? ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PreviousTickets> previousTickets = await GetPreviousTickets(connection, AssetId, ServiceRequestId);
                int totalRows = await GetPreviousTicketsCount(connection, AssetId, ServiceRequestId);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PreviousTickets = previousTickets,
                        TotalRows = totalRows,
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
                            new ExceptionHandler(ex,"service_request_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<PreviousTickets>> GetPreviousTickets(SqlConnection Connection, int? AssetId, int? ServiceRequestId)
        {
            var procedure = "previoustickets_list";
            var parameters = new DynamicParameters();
            parameters.Add("AssetId", AssetId);
            parameters.Add("ServiceRequestId", ServiceRequestId);
            var ticketList = await Connection.QueryAsync<PreviousTickets>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return ticketList;
        }

        private async Task<int> GetPreviousTicketsCount(SqlConnection Connection, int? AssetId, int? ServiceRequestId)
        {
            var procedure = "previoustickets_count";
            var parameters = new DynamicParameters();
            parameters.Add("AssetId", AssetId);
            parameters.Add("ServiceRequestId", ServiceRequestId);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpPost, Authorize()]
        [Route("interim/asset/approve")]
        public async Task<object> InterimRequestApprove(ContractInterimAssetDetails interimRequestReviewDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();
            using (var transaction = connection.BeginTransaction())
                try
                {
                    int? ContractAssetId = null;
                    if (interimRequestReviewDetails.ServiceRequestId != null)
                    {
                        interimRequestReviewDetails.CallType = 1001;
                        List<ContractInterimAssetDetails> assetDetailsList = new List<ContractInterimAssetDetails> { interimRequestReviewDetails };
                        string assetaddedmode = "AAM_INTR";
                        string userId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;

                        var (isProductCountExceeded, assetId) = await ContractInterimAssetHelper.CreateContractInterimAsset(connection, assetDetailsList, assetaddedmode, userId, interimRequestReviewDetails.ContractId, transaction);
                        if (isProductCountExceeded == null && assetId == null)
                        {
                            throw new Exception();
                        }
                        if (isProductCountExceeded == true && assetId == null)
                        {
                            throw new CustomException("validation_error_create_asset_productcount_exceeded");
                        }
                        ContractAssetId = assetId;
                    }

                    var procedure = "servicerequest_interim_asset_review";
                    var parameters = new DynamicParameters();
                    parameters.Add("ContractAssetId", ContractAssetId);
                    parameters.Add("ServiceRequestId", interimRequestReviewDetails.ServiceRequestId);
                    parameters.Add("InterimReviewRemarks", interimRequestReviewDetails.ReviewRemarks);
                    parameters.Add("ReviewedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                    parameters.Add("IsFinanceApprovalNeeded", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                    await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                    bool isFinanceApprovalNeeded =  parameters.Get<bool>("@IsFinanceApprovalNeeded");
                    if (isFinanceApprovalNeeded == false)
                    {
                        await generateWorkOrderNum(connection, interimRequestReviewDetails.ServiceRequestId, transaction);
                    }
                    transaction.Commit();
                    return Ok(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status200OK,
                        data = new
                        {
                            IsInterimRequestReviewed = true
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
                            new ExceptionHandler(ex,"service_request_interim_review_failed_message", _logService).GetMessage()
                        }
                        }
                    }));
                }
        }

        [HttpGet]
        [Route("get/interim/details")]
        public async Task<ActionResult> GetInterimServiceRequestDetails(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "service_request_interim_details";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", ServiceRequestId);
                var interimServiceRequestDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        InterimServiceRequestDetails = interimServiceRequestDetails.First()
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
                            new ExceptionHandler(ex,"service_request_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet,Authorize()]
        [Route("get/detailsforengineer")]
        public async Task<ActionResult> GetServiceRequestDetailsForEngineer(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequest_details_for_engineer";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", ServiceRequestId);
                parameters.Add("LoggedUserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var serviceRequestDetails = await connection.QueryAsync<MobesureServiceRequestDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = serviceRequestDetails.First()
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
                            new ExceptionHandler(ex,"service_request_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost]
        [Route("accept")]
        public async Task<object> ServiceRequesAccept(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "service_request_accept";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", ServiceRequestId);
                parameters.Add("AcceptedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsAccepted = true
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
                            new ExceptionHandler(ex,"service_request_accept_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("contract/count")]
        public async Task<ActionResult> GetContractServiceRequestCount(int ContractId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                (int openServiceRequestCount, int closedServiceRequestCount, int totalServiceRequestCount) = await GetServiceRequestCount(Connection, ContractId);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractServiceRequestCount = new
                        {
                            OpenServiceRequestCount = openServiceRequestCount,
                            ClosedServiceRequestCount = closedServiceRequestCount,
                            TotalServiceRequestCount = totalServiceRequestCount
                        }
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
                            new ExceptionHandler(ex,"service_request_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<(int Open, int Closed, int TotalCount)> GetServiceRequestCount(SqlConnection connection, int contractId)
        {
            var procedure = "contract_servicerequest_count";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", contractId);
            parameters.Add("Open", dbType: DbType.Int32, direction: ParameterDirection.Output);
            parameters.Add("Closed", dbType: DbType.Int32, direction: ParameterDirection.Output);
            parameters.Add("TotalCount", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await connection.ExecuteAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            int openServiceRequestCount = parameters.Get<int>("@Open");
            int closedServiceRequestCount = parameters.Get<int>("@Closed");
            int totalServiceRequestCount = parameters.Get<int>("@TotalCount");

            return (openServiceRequestCount, closedServiceRequestCount, totalServiceRequestCount);
        }

        [HttpGet]
        [Route("calls/count")]
        public async Task<object> GetCallCount(int IsInterimCase)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "service_request_get_call_count";
                var parameters = new DynamicParameters();
                parameters.Add("@InterimCallCount", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("@RegularCallCount", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var regularCallTotalCount = parameters.Get<int>("@RegularCallCount");
                var interimCallTotalCount = parameters.Get<int>("@InterimCallCount");
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        RegularCallTotalCount = regularCallTotalCount,
                        InterimCallTotalCount = interimCallTotalCount
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
                            new ExceptionHandler(ex,"service_request_load_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet("summary/generatepdf")]
        public async Task<object> GenerateServiceRequestSummary(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var serviceRequestDetails = await GetServiceRequestSummary(connection, ServiceRequestId);
                var serviceRequestPartIndent = await ServiceRequestPartIndentList(connection, ServiceRequestId);
                byte[] serviceRequestPdf = _pdfService.GeneratePdf(container => PdfTemplates.ServiceRequestSummaryPdfTemplate.Create(container, serviceRequestDetails.FirstOrDefault(), serviceRequestPartIndent));
                return File(serviceRequestPdf, "application/pdf", "serviceRequestPdf.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        message = new[] {
                            new ExceptionHandler(ex,"service_request_no_files", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<PartIndentRequestList>> ServiceRequestPartIndentList(SqlConnection Connection, int ServiceRequestId)
        {
            var procedure = "partindentrequest_list";
            var parameters = new DynamicParameters();
            parameters.Add("ServiceRequestId", ServiceRequestId);
            var partIndentList = await Connection.QueryAsync<PartIndentRequestList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return partIndentList;
        }

        [HttpGet]
        [Route("get/summary/details")]
        public async Task<ActionResult<ServiceRequestSummary>> GetServiceRequestSummaryInfo(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var serviceRequestDetails = await GetServiceRequestSummary(connection, ServiceRequestId);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceRequestSummary = serviceRequestDetails.FirstOrDefault(),
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
                            new ExceptionHandler(ex,"service_request_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<ServiceRequestSummary>> GetServiceRequestSummary(SqlConnection connection, int ServiceRequestId)
        {
            var procedure = "servicerequest_summary_details";
            var parameters = new DynamicParameters();
            parameters.Add("ServiceRequestId", ServiceRequestId);
            return await connection.QueryAsync<ServiceRequestSummary>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

        [HttpPut, Authorize()]
        [Route("interim/reject")]
        public async Task<object> InterimRequestReject(InterimRequestReviewDetails interimRequestReviewDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequest_close_call";
                var parameters = new DynamicParameters();
                parameters.Add("CaseStatusCode", "SRS_CLSD");
                parameters.Add("InterimAssetStatus", interimRequestReviewDetails.InterimAssetStatus);
                parameters.Add("ServiceRequestId", interimRequestReviewDetails.ServiceRequestId);
                parameters.Add("InterimReviewRemarks", interimRequestReviewDetails.ReviewRemarks);
                parameters.Add("ClosedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceRequestClosed = true
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
                            new ExceptionHandler(ex,"service_request_close_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/interim/assetinfo")]
        public async Task<ActionResult> GetInterimAssetDetails(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequest_interim_asset_detail";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", ServiceRequestId);
                var assetDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        InterimAssetDetails = assetDetails.First()
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
                            new ExceptionHandler(ex,"service_request_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("interim/finance/approve")]
        public async Task<object> InterimFinanceApprove(InterimRequestReviewDetails interimRequestReviewDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();
            using (var transaction = connection.BeginTransaction())
            try
            {
                var procedure = "servicerequest_interim_finance_review";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", interimRequestReviewDetails.ServiceRequestId);
                parameters.Add("InterimReviewRemarks", interimRequestReviewDetails.ReviewRemarks);
                parameters.Add("ReviewedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsAssetApprovalNeeded", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                bool? isAssetApprovalNeeded = parameters.Get<bool?>("@IsAssetApprovalNeeded");
                if(isAssetApprovalNeeded != true)
                {
                    await generateWorkOrderNum(connection, interimRequestReviewDetails.ServiceRequestId, transaction);
                }
                transaction.Commit();
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsInterimRequestReviewed = true
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
                        new ExceptionHandler(ex,"service_request_close_failed_message", _logService).GetMessage()
                    }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("edit/details")]
        public async Task<ActionResult<ServiceRequestEditDetails>> GetServiceRequestEditDetails(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequest_edit_details";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", Id);
                var serviceRequestDetails = await connection.QueryAsync<ServiceRequestEditDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceRequestDetails = serviceRequestDetails.First()
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
                            new ExceptionHandler(ex,"servicerequest_details_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost, Authorize()]
        [Route("update")]
        public async Task<ActionResult> UpdateServiceRequest(ServiceRequestUpdate serviceRequest)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();
            using (var transaction = connection.BeginTransaction())
            {
                try
                {
                    var procedure = "servicerequest_update";
                    var parameters = new DynamicParameters();
                    parameters.Add("ServiceRequestId", serviceRequest.Id);
                    parameters.Add("IncidentId", serviceRequest.IncidentId);
                    parameters.Add("TicketNumber", serviceRequest.TicketNumber);
                    parameters.Add("CustomerReportedIssue", serviceRequest.CustomerReportedIssue);
                    parameters.Add("CaseReportedCustomerEmployeeName", serviceRequest.CaseReportedCustomerEmployeeName);
                    parameters.Add("CaseStatusId", serviceRequest.CallStatusId);
                    parameters.Add("EndUserName", serviceRequest.EndUserName);
                    parameters.Add("EndUserPhone", serviceRequest.EndUserPhone);
                    parameters.Add("EndUserEmail", serviceRequest.EndUserEmail);
                    parameters.Add("CallTypeId", serviceRequest.CallTypeId);
                    parameters.Add("RepairReason", serviceRequest.RepairReason);
                    parameters.Add("CallCenterRemarks", serviceRequest.CallCenterRemarks);
                    parameters.Add("OptedForRemoteSupport", serviceRequest.OptedForRemoteSupport);
                    parameters.Add("RemoteSupportNotOptedReason", serviceRequest.RemoteSupportNotOptedReason);
                    parameters.Add("CustomerContactTypeId", serviceRequest.CustomerContactTypeId);
                    parameters.Add("CallSourceId", serviceRequest.CallSourceId);
                    parameters.Add("CallSeverityLevelId", serviceRequest.CallSeverityLevelId);
                    parameters.Add("CustomerServiceAddress", serviceRequest.CustomerServiceAddress);
                    parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                    await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);

                    if (serviceRequest.IsInterimCaseId == false)
                    {
                        var isWorkOrderNumberGenerated = await generateWorkOrderNum(connection, serviceRequest.Id, transaction: transaction);
                        if (isWorkOrderNumberGenerated == 0)
                        {
                            throw new Exception();
                        }
                    }
                    if (serviceRequest.RemotelyClose == true && serviceRequest.IsInterimCaseId == false)
                    {
                        parameters = new DynamicParameters();
                        procedure = "servicerequest_close_call";
                        parameters.Add("ClosureRemarks", serviceRequest.ClosureRemarks);
                        parameters.Add("CaseStatusCode", "SRS_RCLD");
                        parameters.Add("HoursSpent", serviceRequest.HoursSpent);
                        parameters.Add("ServiceRequestId", serviceRequest.Id);
                        parameters.Add("ClosedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                        await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);

                        parameters = new DynamicParameters();
                        procedure = "servicerequest_customer_details";
                        parameters.Add("ServiceRequestId", serviceRequest.Id);
                        var callClosureDetails = await connection.QueryAsync<CallClosureDetails>(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);

                        var mail = new EmailDto()
                        {
                            To = callClosureDetails?.FirstOrDefault()?.PrimaryContactEmail,
                            Subject = "Closure of Your Service Request Call",
                        };
                        string templatePath = Path.Combine(_hostingEnvironment.ContentRootPath, "EmailTemplates", "CallClosureEmail.html");
                        string template = "";
                        if (System.IO.File.Exists(templatePath))
                        {
                            template = System.IO.File.ReadAllText(templatePath);
                        }
                        mail.Body = string.Format(template, callClosureDetails?.FirstOrDefault()?.CustomerName);
                        await _jobQueueHelper.AddMailToJobQueue(mail);
                    }
                    transaction.Commit();
                    return Ok(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status200OK,
                        data = new
                        {
                            IsUpdated = true
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
                            new ExceptionHandler(ex,"servicerequest_update_failed_message", _logService).GetMessage()
                            }
                        }
                    }));
                }
            }
        }

        [HttpGet, Authorize()]
        [Route("callcentre/list")]
        [HasPermission(ServiceRequestBusinessFunctionCode.SERVICE_REQUEST_LIST)]
        public async Task<ActionResult<CallCentreServiceRequest>> GetCallCentreServiceRequestList(int Page, string? Search, string? SearchWith, string? filterWith)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<CallCentreServiceRequest> callList = await GetCallCentreServiceRequestList(connection, Page, Search, SearchWith, filterWith);
                int totalRows = await GetCallCentreServiceRequestCount(connection, Search, SearchWith, filterWith);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceRequestList = callList,
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
                            new ExceptionHandler(ex,"service_request_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<CallCentreServiceRequest>> GetCallCentreServiceRequestList(SqlConnection Connection, int Page, string? Search, string? SearchWith, string? filterWith)
        {
            var procedure = "callcentre_servicerequest_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("filterWith", filterWith);
            var callList = await Connection.QueryAsync<CallCentreServiceRequest>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return callList;
        }

        private async Task<int> GetCallCentreServiceRequestCount(SqlConnection Connection, string? Search, string? SearchWith, string? filterWith)
        {
            var procedure = "callcentre_servicerequest_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("filterWith", filterWith);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet, Authorize()]
        [Route("callcordinator/list")]
        [HasPermission(ServiceRequestBusinessFunctionCode.SERVICE_REQUEST_LIST)]
        public async Task<ActionResult<CallCordinatorServiceRequest>> GetCallCordinatorServiceRequests(int Page, string StatusCode, string? Search, string? SearchWith)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<CallCordinatorServiceRequest> callList = await GetCallCordinatorServiceRequestList(connection, Page, StatusCode, Search,SearchWith);
                int totalRows = await GetCallCordinatorServiceRequestCount(connection, StatusCode, Search, SearchWith);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceRequestList = callList,
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
                            new ExceptionHandler(ex,"service_request_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<CallCordinatorServiceRequest>> GetCallCordinatorServiceRequestList(SqlConnection Connection, int Page, string StatusCode, string? Search, string? SearchWith)
        {
            var procedure = "callcordinator_servicerequest_list";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("StatusCode", StatusCode.ToString());
            var callList = await Connection.QueryAsync<CallCordinatorServiceRequest>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return callList;
        }

        private async Task<int> GetCallCordinatorServiceRequestCount(SqlConnection Connection, string StatusCode, string? Search, string? SearchWith)
        {
            var procedure = "callcordinator_servicerequest_count";
            var parameters = new DynamicParameters();
            parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("StatusCode", StatusCode.ToString());
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("callcentre/calldetails")]
        public async Task<ActionResult<CallCentreServiceRequestDetails>> GetCallCentreServiceRequestDetails(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequest_callcentre_calldetails";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", ServiceRequestId);
                var ServiceRequestDetails = await connection.QueryAsync<CallCentreServiceRequestDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceRequestDetails = ServiceRequestDetails.First()
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
                            new ExceptionHandler(ex,"service_request_details_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("callcordinator/calldetails")]
        public async Task<ActionResult<CallCordinatorServiceRequestDetails>> GetCallCordinatorServiceRequestDetails(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequest_callcordinator_calldetails";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", ServiceRequestId);
                var ServiceRequestDetails = await connection.QueryAsync<CallCordinatorServiceRequestDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceRequestDetails = ServiceRequestDetails.First()
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
                            new ExceptionHandler(ex,"service_request_details_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("asset/interim/list")]
        [HasPermission(ServiceRequestBusinessFunctionCode.SERVICE_REQUEST_ASSET_INTERIM_LIST)]
        public async Task<object> GetPreAmcInterimServiceRequests(int Page, string? Filters, string? SearchWith)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<InterimServiceRequest> callList = await GetInterimServiceRequestList(connection, Page, Filters, SearchWith,true,null);
                int totalRows = await GetInterimServiceRequestCount(connection, Filters, SearchWith, true,null);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceRequestList = callList,
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
                            new ExceptionHandler(ex,"service_request_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("finance/interim/list")]
        [HasPermission(ServiceRequestBusinessFunctionCode.SERVICE_REQUEST_FINANCE_INTERIM_LIST)]
        public async Task<object> GetFinanceInterimServiceRequests(int Page, string? Filters, string? SearchWith)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<InterimServiceRequest> callList = await GetInterimServiceRequestList(connection, Page, Filters, SearchWith, null, true);
                int totalRows = await GetInterimServiceRequestCount(connection, Filters, SearchWith, null,true);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceRequestList = callList,
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
                            new ExceptionHandler(ex,"service_request_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<InterimServiceRequest>> GetInterimServiceRequestList(SqlConnection Connection, int Page, string? Filters, string? SearchWith,bool? IsAssetRequest, bool? IsFinanceRequest)
        {
            var procedure = "servicerequest_interim_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("IsAssetRequest", IsAssetRequest); 
            parameters.Add("IsFinanceRequest", IsFinanceRequest);
            parameters.Add("Filters", Filters);
            parameters.Add("SearchWith", SearchWith);
            var callList = await Connection.QueryAsync<InterimServiceRequest>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return callList;
        }

        private async Task<int> GetInterimServiceRequestCount(SqlConnection Connection, string? Filters, string? SearchWith, bool? IsAssetRequest, bool? IsFinanceRequest)
        {
            var procedure = "servicerequest_interim_count";
            var parameters = new DynamicParameters();
            parameters.Add("Filters", Filters);
            parameters.Add("IsAssetRequest", IsAssetRequest);
            parameters.Add("IsFinanceRequest", IsFinanceRequest);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("get/previouscalllistbyassignee")]
        public async Task<ActionResult<MobesurePreviousCallList>> GetPreviousCallListByAssignees()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequest_previouscalllist_by_assignee";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var previousCallList = await connection.QueryAsync<MobesureServiceRequestList>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PreviousCalls = previousCallList,
                        TotalRows = previousCallList.Count()
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
                            new ExceptionHandler(ex,"previouscalllist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("get/previouscalldetailforengineer")]
        public async Task<ActionResult> GetPreviousCallDetailForEngineer(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequest_previouscall_detail";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", ServiceRequestId);
                parameters.Add("LoggedUserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var previousCallDetail = await connection.QueryAsync<MobesureServiceRequestDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = previousCallDetail.First()
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
                            new ExceptionHandler(ex,"previouscalldetail_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Authorize()]
        [Route("callstatus/reportdetails")]
        public async Task<object> GetCallStatusReportDetails(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var UserId =User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                CallStatusDetails singleDetails = await GetCallStatusSingleDetails(connection, ServiceRequestId, UserId);
                IEnumerable<CallStatusPartIndentRequestDetails> partIndentRequest = await GetCallStatusPartIndentRequestDetails(connection, ServiceRequestId);
                IEnumerable<CallStatusPartAllocationDetails> partAllocationDetails = await GetCallStatusPartAllocationDetails(connection, ServiceRequestId);
                IEnumerable<CallStatusServiceEngineerVisitsClosureDetails> serviceEngineerVisitsDetails = await GetCallStatusServiceEngineerVisitsDetails(connection, ServiceRequestId);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CallStatusReportDetails = singleDetails,
                        PartIndentRequest = partIndentRequest,
                        PartAllocationDetails = partAllocationDetails,
                        ServiceEngineerVisitsDetails = serviceEngineerVisitsDetails
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
             new ExceptionHandler(ex,"call_status_report_details_nodata", _logService).GetMessage()
         }
                    }
                }));
            }
        }

        private async Task<CallStatusDetails> GetCallStatusSingleDetails(SqlConnection connection, int serviceRequestId,string UserId)
        {
            var procedure = "servicerequest_callstatus_details";
            var parameters = new DynamicParameters();
            parameters.Add("ServiceRequestId", serviceRequestId);
            parameters.Add("UserId", UserId);
            var callDetails = await connection.QueryFirstOrDefaultAsync<CallStatusDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
            if (callDetails == null)
            {
                throw new CustomException("call_status_report_details_nodata");
            }
            return callDetails;
        }

        private async Task<IEnumerable<CallStatusPartIndentRequestDetails>> GetCallStatusPartIndentRequestDetails(SqlConnection connection, int serviceRequestId)
        {
            var procedure = "servicerequest_callstatus_partindentrequest_details";
            var parameters = new DynamicParameters();
            parameters.Add("ServiceRequestId", serviceRequestId);
            var partIndentRequest = await connection.QueryAsync<CallStatusPartIndentRequestDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return partIndentRequest;
        }

        private async Task<IEnumerable<CallStatusPartAllocationDetails>> GetCallStatusPartAllocationDetails(SqlConnection connection, int serviceRequestId)
        {
            var procedure = "servicerequest_callstatus_partallocation_details";
            var parameters = new DynamicParameters();
            parameters.Add("ServiceRequestId", serviceRequestId);
            var partAllocationList = await connection.QueryAsync<CallStatusPartAllocationDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return partAllocationList;
        }

        private async Task<IEnumerable<CallStatusServiceEngineerVisitsClosureDetails>> GetCallStatusServiceEngineerVisitsDetails(SqlConnection connection, int serviceRequestId)
        {
            var procedure = "serviceengineervisit_and_closure_details";
            var parameters = new DynamicParameters();
            parameters.Add("ServiceRequestId", serviceRequestId);
            var serviceEngineerVisitDetails = await connection.QueryAsync<CallStatusServiceEngineerVisitsClosureDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return serviceEngineerVisitDetails;
        }

        [HttpGet]
        [Route("generatepdf")]
        [Authorize()]
        public async Task<object> GenerateCallStatusReport(int ServiceRequestId,string TimeZone)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try

            {
                var UserId =User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                CallStatusDetails callDetails = await GetCallStatusSingleDetails(connection, ServiceRequestId,UserId);
                IEnumerable<CallStatusPartIndentRequestDetails> partIndentRequests = await GetCallStatusPartIndentRequestDetails(connection, ServiceRequestId);
                IEnumerable<CallStatusPartAllocationDetails> partAllocationDetails = await GetCallStatusPartAllocationDetails(connection, ServiceRequestId);
                IEnumerable<CallStatusServiceEngineerVisitsClosureDetails> serviceEngineerVisitsDetails = await GetCallStatusServiceEngineerVisitsDetails(connection, ServiceRequestId);
                byte[] callStatusPdf = _pdfService.GeneratePdf(container => PdfTemplates.CallStatusPdfTemplate.Create(container,callDetails,partIndentRequests,partAllocationDetails,serviceEngineerVisitsDetails,TimeZone));
                return File(callStatusPdf, "application/pdf", "callStatusReportPdf.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        message = new[] {
                     new ExceptionHandler(ex,"purchase_order_generate_pdf_failed_message", _logService).GetMessage()
                 }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("assetdetails/forcallcordinator")]
        public async Task<ActionResult<ServiceRequestAssetDetails>> GetAssetDetailsForCallCordinator(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequest_assetdetailsforcallcordinator";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", ServiceRequestId);
                var AssetDetails = await connection.QueryAsync<ServiceRequestAssetDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        AssetDetails = AssetDetails.FirstOrDefault()
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
                            new ExceptionHandler(ex,"service_request_details_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet, Authorize()]
        [Route("countsforcallcordinator")]
        public async Task<ActionResult> GetServiceRequestCountsForCallCordintor(string StatusCode)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var serviceRequestCounts = new CallCordinatorServiceRequestCounts();
                var procedure = "servicerequest_countsforcallcordinator";
                var parameters = new DynamicParameters();
                parameters.Add("StatusCode", StatusCode);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("TotalCalls", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("NewCalls", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("CallResolved", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("VisitClosed", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("EngAccepted", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("EngNotAccepted", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("VisitStarted", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("OnsiteClosed", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("RemotelyClosed", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync<CallCordinatorServiceRequestCounts>(procedure, parameters, commandType: CommandType.StoredProcedure);
                serviceRequestCounts.TotalCalls = parameters.Get<int?>("TotalCalls");
                serviceRequestCounts.NewCalls = parameters.Get<int?>("NewCalls");
                serviceRequestCounts.CallResolved = parameters.Get<int?>("CallResolved");
                serviceRequestCounts.VisitClosed = parameters.Get<int?>("VisitClosed");
                serviceRequestCounts.EngAccepted = parameters.Get<int?>("EngAccepted");
                serviceRequestCounts.EngNotAccepted = parameters.Get<int?>("EngNotAccepted");
                serviceRequestCounts.VisitStarted = parameters.Get<int?>("VisitStarted");
                serviceRequestCounts.OnsiteClosed = parameters.Get<int?>("OnsiteClosed");
                serviceRequestCounts.RemotelyClosed = parameters.Get<int?>("RemotelyClosed");

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceRequestCounts = serviceRequestCounts
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
                            new ExceptionHandler(ex,"service_request_details_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("partcategorylist/byservicerequest")]
        public async Task<ActionResult<PartCategoryList>> GetPartCategoryListByServiceRequest(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partcategory_list_by_servicerequest";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", ServiceRequestId);
                var PartCategoryList = await connection.QueryAsync<PartCategoryList>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartCategories = PartCategoryList
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
                            new ExceptionHandler(ex,"partcategory_list_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("partsubcategorylist/byservicerequest")]
        public async Task<ActionResult<PartSubCategoryList>> GetPartSubCategoryListByServiceRequest(int AssetProductCategoryId, int PartCategoryId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partsubcategory_list_by_servicerequest";
                var parameters = new DynamicParameters();
                parameters.Add("AssetProductCategoryId", AssetProductCategoryId);
                parameters.Add("PartCategoryId", PartCategoryId);
                var PartSubCategoryList = await connection.QueryAsync<PartSubCategoryList>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartSubCategories = PartSubCategoryList
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
                            new ExceptionHandler(ex,"partsubcategory_list_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("list/forsme")]
        public async Task<ActionResult<ServiceRequestDetailsListForSme>> GetServiceRequestListForSme(int Page, string SearchWith, string Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequest_list_for_sme";
                var parameters = new DynamicParameters();
                parameters.Add("SearchWith", SearchWith);
                parameters.Add("Search", Search);
                var ServiceRequestListForSme = await connection.QueryAsync<ServiceRequestDetailsListForSme>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int totalRows = await GetSmeViewServiceRequestCount(connection, Search, SearchWith);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceRequestListDetailsForSme = ServiceRequestListForSme,
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
                            new ExceptionHandler(ex,"servicerequest_forsme_list_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<int> GetSmeViewServiceRequestCount(SqlConnection Connection, string? Search, string? SearchWith)
        {
            var procedure = "servicerequest_list_for_sme_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpPost, Authorize()]
        [Route("interim/preamcasset/approve")]
        public async Task<object> InterimPreAmcAssetApprove(InterimPreAmcAssetDetail interimRequestReviewDetails)
        {
        using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
        connection.Open();
        using (var transaction = connection.BeginTransaction())
            try
            {
                var procedure = "servicerequest_interim_preamcasset_review";
                var parameters = new DynamicParameters();
                parameters.Add("IsPreAmcCompleted", interimRequestReviewDetails.IsPreAmcCompleted);
                parameters.Add("PreAmcCompletedDate", interimRequestReviewDetails.PreAmcCompletedDate);
                parameters.Add("PreAmcCompletedBy", interimRequestReviewDetails.PreAmcCompletedBy);
                parameters.Add("ServiceRequestId", interimRequestReviewDetails.ServiceRequestId);
                parameters.Add("InterimReviewRemarks", interimRequestReviewDetails.ReviewRemarks);
                parameters.Add("ReviewedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsFinanceApprovalNeeded", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                bool isFinanceApprovalNeeded = parameters.Get<bool>("@IsFinanceApprovalNeeded");
                if (isFinanceApprovalNeeded == false)
                {
                    await generateWorkOrderNum(connection, interimRequestReviewDetails.ServiceRequestId, transaction);
                }
                transaction.Commit();
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsInterimRequestReviewed = true
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
                        new ExceptionHandler(ex,"service_request_interim_review_failed_message", _logService).GetMessage()
                    }
                    }
                }));
            }
        }
    }
}