using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using static Org.BouncyCastle.Math.EC.ECCurve;
using BeSureApi.Models;
using System;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Diagnostics.Contracts;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Routing.Template;
//using Org.BouncyCastle.Bcpg;
using BeSureApi.Helpers;

namespace BeSureApi.Controllers
{
    [Route("api/approvalrequests")]
    [ApiController]
    public class ApprovalRequestsController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly JobQueueHelper _jobQueueHelper;
        public ApprovalRequestsController(IConfiguration config, ILogService logService, IWebHostEnvironment hostingEnvironment)
        {
            _config     = config;
            _logService = logService;
            _hostingEnvironment = hostingEnvironment;
            _jobQueueHelper = new JobQueueHelper(config);
        }

        [HttpPost, Authorize()]
        [Route("create/partcodification")]
        public async Task<object> CreatePartCodificationApprovalRequest(PartCodificationApprovalCreate PartDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "Part");
                parameters.Add("ColumnName", "PartName");
                parameters.Add("Value", PartDetails.PartName);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    throw new CustomException("mobesure_partcodificationcreate_partname_exist");
                }
                procedure = "approvalrequest_partcodification_create";
                parameters = new DynamicParameters();
                parameters.Add("Content", JsonSerializer.Serialize(PartDetails));
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsUnique", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isUnique = parameters.Get<int>("IsUnique");
                if (isUnique == 0)
                {
                    throw new CustomException("mobesure_partcodificationcreate_partname_exist_inapproval");
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPartCodificationCreated = true
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
                          new ExceptionHandler(ex,"mobesure_partcodificationcreate_failedmessage", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("create/customer/approval")]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMER_CREATE)]
        public async Task<object> CreateCustomerApprovalRequest(CustomerCreateApproval customerDetails)
         {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var parameters = new DynamicParameters();
                var procedure = "";
                if (customerDetails.CustomerId == null)
                {
                    parameters = new DynamicParameters();
                    procedure = "common_is_existing";
                    parameters.Add("TableName", "CustomerInfo");
                    parameters.Add("ColumnName", "Name");
                    parameters.Add("Value", customerDetails.Name);
                    parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                    int count = parameters.Get<int>("Count");
                    if (count > 0)
                    {
                        throw new CustomException("customer_create_customer_name_exists_message");
                    }
                }
                if(customerDetails.Name !=null) {
                    parameters = new DynamicParameters();
                    procedure = "approvalrequest_customername_exist_list";
                    parameters.Add("CustomerName", customerDetails.Name);
                    parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                    int count = parameters.Get<int>("Count");
                    if (count > 0)
                    {
                        throw new CustomException("customer_create_customer_name_exists_on_approvalrequest_message");
                    }
                }
                procedure = "customer_approvalrequest_create";
                parameters = new DynamicParameters();
                parameters.Add("Content", JsonSerializer.Serialize(customerDetails));
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("CaseId", 0);
                parameters.Add("IsUnique", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isUnique = parameters.Get<int>("IsUnique");
                if (isUnique == 0)
                {
                    throw new CustomException("customer_create_customer_name_exists_message");
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCustomerCreated = true
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
                          new ExceptionHandler(ex,"create_bank_customer_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    
        private async Task<IEnumerable<PendingApprovalList>> GetPendingApprovalList(SqlConnection Connection,string? LoggedUserId, int Page, string? ApprovalEventCode)
        {
            var procedure = "approvalrequest_pending_list";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalEventCode", ApprovalEventCode);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("LoggedUserId", LoggedUserId);
            var approvalRequestPendingList = await Connection.QueryAsync<PendingApprovalList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return approvalRequestPendingList;
        }

        private async Task<int> GetPendingApprovalsCount(SqlConnection Connection,string? LoggedUserId, string? ApprovalEventCode)
        {
            var procedure = "approvalrequest_pending_count";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalEventCode", ApprovalEventCode);
            parameters.Add("LoggedUserId", LoggedUserId);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        
        /// <summary>
        /// Get all approval requests
        /// </summary>
        [HttpGet, Authorize()]
        [Route("get/all")]
        [HasPermission(MasterDataBusinessFunctionCode.APPROVAL_VIEW)]
        public async Task<ActionResult<List<PendingApprovalList>>> GetPendingAllApprovalList(int Page, string? TableName)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;

                IEnumerable<PendingApprovalList> pendingApprovalsList  = await GetPendingApprovalList(connection, LoggedUserId, Page, TableName);
                int pendingApprovalsCount                           = await GetPendingApprovalsCount(connection, LoggedUserId, TableName);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                return Ok(JsonSerializer.Serialize(new
                {
                    status  = StatusCodes.Status200OK,
                    data    = new {
                        PendingList = pendingApprovalsList,
                        CurrentPage = Page,
                        TotalRows   = pendingApprovalsCount,
                        PerPage     = perPage
                    }
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new {
                        Message = new[] {
                           new ExceptionHandler(ex,"banks_approved_message_no_records_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("disable")]
        [HasPermission(MasterDataBusinessFunctionCode.APPROVAL_DELETE)]
        public async Task<object> DiasbleApprovalRequest(ApprovalRequestDetails ApprovalDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure   = "approvalrequest_delete";
                var parameters  = new DynamicParameters();
                parameters.Add("Id", ApprovalDetails.Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status  = StatusCodes.Status200OK,
                    data    = new {
                        IsUpdated = true
                    }
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new {
                    status = StatusCodes.Status400BadRequest,
                    errors = new {
                        Message = new[] {
                           new ExceptionHandler(ex,"pending_approvals_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut]
        [Route("requestchange")]
        [Authorize()]
        [HasPermission(ApprovalBusinessFunctionCode.APPROVAL_MANAGE)]
        public async Task<ActionResult> RequstChangeApprovalRequest(RequestChangeApprovalRequest ApprovalRequest)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {

                var procedure = "approvalrequest_request_change";
                var parameters = new DynamicParameters();
                parameters.Add("ReviewedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("ReviewComment", ApprovalRequest.ReviewComment);
                parameters.Add("ReviewStatus", ApprovalRequest.ReviewStatus);
                parameters.Add("ApprovalRequestDetailId", ApprovalRequest.ApprovalRequestDetailId);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsChangeRequested = true
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
                            new ExceptionHandler(ex,"banks_approve_approval_change_failed", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet, Authorize()]
        [Route("get/details")]
        public async Task<ActionResult<List<PendingApprovals>>> GetApprovalRequestDetails(int ApprovalRequestId , string TableName)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PendingApprovalDetail> approvalRequestDetails = await GetApprovalDetail(connection,  TableName, ApprovalRequestId);

                  return Ok(JsonSerializer.Serialize(new { 
                    status  = StatusCodes.Status200OK, 
                    data    = new { 
                        ApprovalRequestDetails = approvalRequestDetails.First()
                    } 
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new { 
                    status = StatusCodes.Status400BadRequest, 
                    errors = new { 
                        Message = new[] {
                          new ExceptionHandler(ex,"pending_approvals_message_no_records_found", _logService).GetMessage()                          
                        } 
                    } 
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("get/part/details")]
        public async Task<ActionResult<List<PartApprovalDetail>>> GetApprovalRequestPartDetails(int ApprovalRequestId, string TableName)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "approvalrequest_part_detail";
                var parameters = new DynamicParameters();
                parameters.Add("ApprovalRequestId", ApprovalRequestId);
                parameters.Add("TableName", TableName);
                var approvalRequestDetails = await connection.QueryAsync<PartApprovalDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data =  approvalRequestDetails.First()
                    
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
                          new ExceptionHandler(ex,"pending_approvals_message_no_records_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<PendingApprovalDetail>> GetApprovalDetail(SqlConnection Connection, string TableName, int ApprovalRequestId)
        {
            var procedure = "approvalrequest_details";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestId", ApprovalRequestId);
            parameters.Add("TableName", TableName);
            var approvalDetail = await Connection.QueryAsync<PendingApprovalDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return approvalDetail;
        }

        [HttpPut]
        [Route("reject")]
        public async Task<ActionResult> RejectApprovalRequest(RejectApprovalRequest ApprovalRequest)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;

                await ApprovalRequestHelper.RejectApprovalRequest(connection, ApprovalRequest.ApprovalRequestDetailId, LoggedUserId, ApprovalRequest.ReviewComment);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsRejected = true
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
                            new ExceptionHandler(ex,"banks_approve_bank_approval_reject_failed", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("get/partcodification")]
        public async Task<ActionResult<List<PendingApprovals>>> GetPendingPartCodificationrApprovalList(int Page)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PendingApprovals> pendingApprovalsList = await GetApprovalPartCodificationList(connection, Page, "Part");
                int pendingApprovalsCount = await GetApprovalPartCodificationCount(connection, "Part");
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PendingList = pendingApprovalsList,
                        CurrentPage = Page,
                        TotalRows = pendingApprovalsCount,
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
                           new ExceptionHandler(ex,"approvalrequest_partcodification_message_no_records_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<PendingApprovals>> GetApprovalPartCodificationList(SqlConnection Connection, int Page, string? TableName)
        {
            var procedure = "approvalrequest_partcodification_list";
            var parameters = new DynamicParameters();
            parameters.Add("TableName", TableName);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            var approvalRequestPendingList = await Connection.QueryAsync<PendingApprovals>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return approvalRequestPendingList;
        }
        private async Task<int> GetApprovalPartCodificationCount(SqlConnection Connection, string? TableName)
        {
            var procedure = "approvalrequest_partcodification_count";
            var parameters = new DynamicParameters();
            parameters.Add("TableName", TableName);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize()]
        [Route("approve/part")]
        [HasPermission(MasterDataBusinessFunctionCode.PART_MANAGE)]
        public async Task<object> ApprovePartRequest(PartApprovalRequest PartApprovalRequest)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                if (PartApprovalRequest.ContentParsed.CaseId == "") 
                {
                    //Retreiving approvalRequest for getting UpdatedOn value of the approvalRequest
                    var procedure = "approvalrequest_details";
                    var parameters = new DynamicParameters();
                    parameters.Add("ApprovalRequestId", PartApprovalRequest.ContentParsed.ApprovalFlowId);
                    parameters.Add("TableName", "Part");
                    var approvalRequestDetails = await connection.QueryAsync<ApprovedBankDetailsWithModifiedDate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                    //TODOS: Implement encryption of FetchTime
                    if ((approvalRequestDetails.First().UpdatedOn ?? DateTime.MinValue) < DateTime.Parse(PartApprovalRequest.FetchTime))
                    {
                        procedure = "part_create";
                        parameters = new DynamicParameters();
                        parameters.Add("ApprovalRequestId", PartApprovalRequest.ContentParsed.ApprovalFlowId);
                        parameters.Add("PartName", PartApprovalRequest.ContentParsed.PartName);
                        parameters.Add("ProductCategoryId", PartApprovalRequest.ContentParsed.ProductCategoryId);
                        parameters.Add("PartCategoryId", PartApprovalRequest.ContentParsed.PartCategoryId);
                        parameters.Add("PartSubCategoryId", PartApprovalRequest.ContentParsed.PartSubCategoryId);
                        parameters.Add("MakeId", PartApprovalRequest.ContentParsed.MakeId);
                        parameters.Add("PartName", PartApprovalRequest.ContentParsed.PartName);
                        parameters.Add("HsnCode", PartApprovalRequest.ReviewDetails.HsnCode);
                        parameters.Add("OemPartNumber", PartApprovalRequest.ReviewDetails.OemPartNumber);
                        parameters.Add("CreatedBy", PartApprovalRequest.ContentParsed.CreatedBy);
                        parameters.Add("CreatedOn", PartApprovalRequest.ContentParsed.CreatedOn);
                        parameters.Add("ApprovedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                        parameters.Add("ReviewComment", PartApprovalRequest.ReviewDetails.ReviewComment);
                        parameters.Add("ReviewStatus", PartApprovalRequest.ReviewStatus);
                        await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                    }
                    else
                    {
                        throw new CustomException("partapprove_reload_page_again_message");
                    }
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsApproved = true
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
                            new ExceptionHandler(ex,"part_approve_part_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
  

        [HttpGet]
        [Route("selected/businessunits")]
        public async Task<ActionResult> GetSelectedBusinessUnits(int ApprovalRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "approvalrequest_user_businessunits";
                var parameters = new DynamicParameters();
                parameters.Add("ApprovalRequestId", ApprovalRequestId);
                var businessunits = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        SelectedBusinessUnits = businessunits
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
                            new ExceptionHandler(ex,"usermanagement_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }


        
        
    }
}
