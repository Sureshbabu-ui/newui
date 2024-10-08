 using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Helpers;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.ApprovalWorkflow;
using BeSureApi.Models;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using System;
using BeSureApi.Helpers;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BeSureApi.Controllers
{
    [Route("api/approvalrequest/customer")]
    [ApiController]
    public class CustomerCreateApprovalRequestController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly JobQueueHelper _jobQueueHelper;
        public CustomerCreateApprovalRequestController(IConfiguration config, ILogService logService, IWebHostEnvironment hostingEnvironment)
        {
            _config = config;
            _logService = logService;
            _hostingEnvironment = hostingEnvironment;
            _jobQueueHelper = new JobQueueHelper(config);
        }

        [HttpGet("{id}")]
        [Authorize()]
        [HasPermission(ApprovalBusinessFunctionCode.APPROVAL_VIEW)]
        public async Task<ActionResult<CustomerApprovalDetailWithReview>> GetApprovalRequestCustomerDetails(int id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                var approvalRequestDetails = await GetCustomerApprovalDetailData(connection, id);
                IEnumerable<ApprovalRequestReviewDetail> approvalRequestReviewDetail = await ApprovalRequestHelper.GetApprovalReviewList(connection, LoggedUserId, "ApprovalRequestDetailId", id);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new CustomerApprovalDetailWithReview
                    {
                        CustomerDetail = approvalRequestDetails,
                        ApprovalRequestReviewList = approvalRequestReviewDetail
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
                          new ExceptionHandler(ex,"pending_approvals_message_no_records_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<CustomerApprovalDetail> GetCustomerApprovalDetailData(SqlConnection Connection, int ApprovalRequestDetailId)
        {
            var procedure = "approvalrequest_customer_detail";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestDetailId", ApprovalRequestDetailId);
            var detail = await Connection.QueryAsync<CustomerApprovalDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return detail.First();
        }

        [HttpPost, Authorize()]
        [Route("draft")]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMER_CREATE)]
        public async Task<object> CreateCustomerApprovalRequest(CustomerDraftCreate customerDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "CustomerInfo");
                parameters.Add("ColumnName", "Name");
                parameters.Add("Value", customerDetails.Name);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                    {
                        ModelState.AddModelError("Name", "customer_create_customer_name_exists_message");
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

                if (customerDetails.Name != null)
                {
                    parameters = new DynamicParameters();
                    procedure = "approvalrequest_name_exist_list";
                    parameters.Add("CustomerName", customerDetails.Name);
                    parameters.Add("ApprovalEventCode", ApprovalEventCode.AE_CUSTOMER_CREATE);
                    parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    var output = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                    int Totalcount = parameters.Get<int>("Count");
                    if (Totalcount > 0)
                    {
                        throw new CustomException("customer_create_customer_name_exists_on_approvalrequest_message");
                    }
                }
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;

                IEnumerable<ApprovalWorkflowDetailForRequest> workflowDetail = await ApprovalRequestHelper.GetNextApprovalWorkflowDetailAsync(connection, ApprovalEventCode.AE_CUSTOMER_CREATE, LoggedUserId, null, JsonSerializer.Serialize(customerDetails));   
                await ApprovalRequestHelper.CreateDraftRequest(connection, JsonSerializer.Serialize(customerDetails), workflowDetail, LoggedUserId, ApprovalEventCode.AE_CUSTOMER_CREATE);
                
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
                          new ExceptionHandler(ex,"create_customer_draft_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("")]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMER_CREATE)]
        public async Task<object> CreateCustomerApprovalRequest(CustomerCreateApproval customerDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "CustomerInfo");
                parameters.Add("ColumnName", "Name");
                parameters.Add("Value", customerDetails.Name);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    ModelState.AddModelError("Name", "customer_create_customer_name_exists_message");
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

                if (customerDetails.Name != null)
                {
                    parameters = new DynamicParameters();
                    procedure = "approvalrequest_name_exist_list";
                    parameters.Add("CustomerName", customerDetails.Name);
                    parameters.Add("ApprovalEventCode", ApprovalEventCode.AE_CUSTOMER_CREATE);
                    parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    var output = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                    int Totalcount = parameters.Get<int>("Count");
                    if (Totalcount > 0)
                    {
                        throw new CustomException("customer_create_customer_name_exists_on_approvalrequest_message");
                    }
                }
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;

                IEnumerable<ApprovalWorkflowDetailForRequest> workflowDetail = await ApprovalRequestHelper.GetNextApprovalWorkflowDetailAsync(connection, ApprovalEventCode.AE_CUSTOMER_CREATE, LoggedUserId, null, JsonSerializer.Serialize(customerDetails));
                bool IsApproved = false;
                if (workflowDetail.Count() == 0)
                {
                    await CreateCustomer(connection, customerDetails, LoggedUserId, null);
                    IsApproved = true;
                }
                else
                {
                    await ApprovalRequestHelper.CreateApprovalRequest(connection, JsonSerializer.Serialize(customerDetails), workflowDetail, LoggedUserId, ApprovalEventCode.AE_CUSTOMER_CREATE);
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCustomerCreated = true,
                        IsApproved = IsApproved
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
                          new ExceptionHandler(ex,"create_customer_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("approve")]
        [HasPermission(ApprovalBusinessFunctionCode.APPROVAL_MANAGE)]
        public async Task<ActionResult> ApproveCustomerRequest(CustomerApprove customerApprovalRequest)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                IEnumerable<ApprovalWorkflowDetailForRequest> workflowDetail = await ApprovalRequestHelper.GetNextApprovalWorkflowDetailAsync(connection, ApprovalEventCode.AE_USER_CREATE, LoggedUserId, customerApprovalRequest.ApprovalRequestDetailId, null);

                if (workflowDetail.Count() == 0)
                {
                    await ApproveCustomer(connection, customerApprovalRequest.ApprovalRequestDetailId, LoggedUserId, customerApprovalRequest.ReviewComment);
                }
                else
                {
                    await ApprovalRequestHelper.ApproveApprovalRequest(connection, customerApprovalRequest.ApprovalRequestDetailId, workflowDetail, LoggedUserId, customerApprovalRequest.ReviewComment);
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
                            new ExceptionHandler(ex,"customer_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<UserApprovalDetail> GetUserApprovalDetailData(SqlConnection Connection, int ApprovalRequestDetailId)
        {
            var procedure = "approvalrequest_user_detail";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestDetailId", ApprovalRequestDetailId);
            var detail = await Connection.QueryAsync<UserApprovalDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return detail.First();
        }

        private async Task<object> ApproveCustomer(SqlConnection connection, int? ApprovalRequestDetailId, string? LoggedUserId,string? ReviewComment)
        {
            var procedure = "customer_approve";
            var parameters = new DynamicParameters();
            parameters.Add("ReviewedBy", LoggedUserId);
            parameters.Add("ApprovalRequestDetailId", ApprovalRequestDetailId);
            parameters.Add("ReviewComment", ReviewComment);
            var result = await connection.QueryAsync<object>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return result;
        }

        private async Task<object> CreateCustomer(SqlConnection connection, CustomerCreateApproval customerApprovalRequest, string? LoggedUserId, int? ApprovalRequestId)
        {
            var procedure = "customer_create";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestId", ApprovalRequestId);
            parameters.Add("CustomerId", customerApprovalRequest.CustomerId);
            parameters.Add("Name", customerApprovalRequest.Name);
            parameters.Add("NameOnPrint", customerApprovalRequest.NameOnPrint);
            parameters.Add("CustomerGroupId", customerApprovalRequest.CustomerGroupId);
            parameters.Add("TenantOfficeId", customerApprovalRequest.TenantOfficeId);
            parameters.Add("CustomerIndustryId", customerApprovalRequest.CustomerIndustryId);
            parameters.Add("PrimaryContactName", customerApprovalRequest.PrimaryContactName);
            parameters.Add("PrimaryContactEmail", customerApprovalRequest.PrimaryContactEmail);
            parameters.Add("PrimaryContactPhone", customerApprovalRequest.PrimaryContactPhone);
            parameters.Add("SecondaryContactName", customerApprovalRequest.SecondaryContactName);
            parameters.Add("SecondaryContactEmail", customerApprovalRequest.SecondaryContactEmail);
            parameters.Add("SecondaryContactPhone", customerApprovalRequest.SecondaryContactPhone);
            parameters.Add("PanNumber", customerApprovalRequest.PanNumber);
            parameters.Add("TinNumber", customerApprovalRequest.TinNumber);
            parameters.Add("TanNumber", customerApprovalRequest.TanNumber);
            parameters.Add("CinNumber", customerApprovalRequest.CinNumber);
            parameters.Add("BilledToAddress", customerApprovalRequest.BilledToAddress);
            parameters.Add("BilledToCityId", customerApprovalRequest.BilledToCityId);
            parameters.Add("BilledToStateId", customerApprovalRequest.BilledToStateId);
            parameters.Add("BilledToCountryId", customerApprovalRequest.BilledToCountryId);
            parameters.Add("BilledToPincode", customerApprovalRequest.BilledToPincode);
            parameters.Add("BilledToGstNumber", customerApprovalRequest.BilledToGstNumber);
            parameters.Add("ShippedToAddress", customerApprovalRequest.ShippedToAddress);
            parameters.Add("ShippedToCityId", customerApprovalRequest.ShippedToCityId);
            parameters.Add("ShippedToStateId", customerApprovalRequest.ShippedToStateId);
            parameters.Add("ShippedToCountryId", customerApprovalRequest.ShippedToCountryId);
            parameters.Add("ShippedToPincode", customerApprovalRequest.ShippedToPincode);
            parameters.Add("ShippedToGstNumber", customerApprovalRequest.ShippedToGstNumber);
            parameters.Add("IsMsme", customerApprovalRequest.IsMsme);
            parameters.Add("GstTypeId", customerApprovalRequest.GstTypeId);
            parameters.Add("MsmeRegistrationNumber", customerApprovalRequest.MsmeRegistrationNumber);
            parameters.Add("IsContractCustomer", customerApprovalRequest.IsContractCustomer);
            parameters.Add("CreatedBy", customerApprovalRequest.CreatedBy);
            parameters.Add("ReviewStatus", customerApprovalRequest.ReviewStatus);
            return   connection.Query<CustomerCreateApproval>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

        [HttpPut("{Id}")]
        [Authorize()]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMER_CREATE)]

        public async Task<ActionResult> UpdatePendingCustomerApprovalRequest(CustomerCreateApproval updateCustomer, int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {

                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "CustomerInfo");
                parameters.Add("ColumnName", "Name");
                parameters.Add("Value", updateCustomer.Name);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    ModelState.AddModelError("Name", "customer_create_customer_name_exists_message");
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

                if (updateCustomer.Name != null)
                {
                    parameters = new DynamicParameters();
                    procedure = "approvalrequest_name_exist_list";
                    parameters.Add("CustomerName", updateCustomer.Name);
                    parameters.Add("ApprovalEventCode", ApprovalEventCode.AE_CUSTOMER_CREATE);
                    parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    var output = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                    int Totalcount = parameters.Get<int>("Count");
                    if (Totalcount > 0)
                    {
                        throw new CustomException("customer_create_customer_name_exists_on_approvalrequest_message");
                    }
                }
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                IEnumerable<ApprovalWorkflowDetailForRequest> workflowDetail = await ApprovalRequestHelper.GetNextApprovalWorkflowDetailAsync(connection, ApprovalEventCode.AE_USER_CREATE, LoggedUserId, null, null);

                if (workflowDetail.Count() == 0)
                {
                    await CreateCustomer(connection, updateCustomer, LoggedUserId, null);
                }
                else
                {
                    await ApprovalRequestHelper.UpdateApprovalRequest(connection, Id, LoggedUserId, workflowDetail, updateCustomer);
                }

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
                           new ExceptionHandler(ex,"approval_request_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<PendingApprovalList>> GetPendingApprovalList(SqlConnection Connection, int Page, string? ApprovalEventCode)
        {
            var procedure = "approvalrequest_pending_list";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalEventCode", ApprovalEventCode);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("LoggedUserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            var approvalRequestPendingList = await Connection.QueryAsync<PendingApprovalList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return approvalRequestPendingList;
        }

        private async Task<int> GetPendingApprovalsCount(SqlConnection Connection, string? ApprovalEventCode)
        {
            var procedure = "approvalrequest_pending_count";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalEventCode", ApprovalEventCode);
            parameters.Add("LoggedUserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet, Authorize()]
        [Route("list")]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMER_VIEW)]
        public async Task<ActionResult<List<PendingApprovals>>> GetPendingCustomerApprovalList(int Page)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PendingApprovalList> pendingApprovalsList = await GetPendingApprovalList(connection, Page, ApprovalEventCode.AE_CUSTOMER_CREATE);
                int pendingApprovalsCount = await GetPendingApprovalsCount(connection, ApprovalEventCode.AE_CUSTOMER_CREATE);
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
                           new ExceptionHandler(ex,"customer_pending_message_no_records_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("draftlist")]
        public async Task<ActionResult> GetCustomerDraftList(int Page)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<DraftList> draftCustomerList = await GetDraftList(connection, Page, ApprovalEventCode.AE_CUSTOMER_CREATE);
                int draftCustomerCount = await GetDraftListCount(connection, ApprovalEventCode.AE_CUSTOMER_CREATE);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CustomerDrafts = draftCustomerList,
                        CurrentPage = Page,
                        TotalRows = draftCustomerCount,
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
                           new ExceptionHandler(ex,"draft_approvals_no_records_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<DraftList>> GetDraftList(SqlConnection Connection, int Page, string ApprovalEventCode)
        {
            var procedure = "approvalrequest_draft_list";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalEventCode", ApprovalEventCode);
            parameters.Add("LoggedUserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            var approvalRequestPendingList = await Connection.QueryAsync<DraftList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return approvalRequestPendingList;
        }
        private async Task<int> GetDraftListCount(SqlConnection Connection,string ApprovalEventCode)
        {
            var procedure = "approvalrequest_draft_count";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalEventCode", ApprovalEventCode);
            parameters.Add("LoggedUserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet("pending/{Id}"), Authorize()]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMER_VIEW)]
        public async Task<ActionResult<CustomerApprovalDetailWithReview>> GetPendingCustomerDetails(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var approvalRequestDetail =await GetCustomerPendingDetail(connection, Id);
                var approvalRequestReviewDetail =await ApprovalRequestHelper.GetApprovalReviewList(connection,"1","ApprovalRequestId",Id);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new CustomerApprovalDetailWithReview
                    {
                        CustomerDetail=approvalRequestDetail,
                        ApprovalRequestReviewList=approvalRequestReviewDetail
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
                          new ExceptionHandler(ex,"pending_approvals_message_no_records_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<CustomerApprovalDetail> GetCustomerPendingDetail(SqlConnection Connection, int ApprovalRequestId)
        {
            var procedure = "customer_pending_detail";
            var parameters = new DynamicParameters(); 
            parameters.Add("ApprovalRequestId", ApprovalRequestId);
            var approvalRequestDetail = await Connection.QueryAsync<CustomerApprovalDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return approvalRequestDetail.FirstOrDefault();
        }

        [HttpDelete("{id}")]
        [Authorize()]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMER_CREATE)]
        public async Task<object> DeleteCustomerApprovalRequest(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                await ApprovalRequestHelper.DeleteApprovalRequest(connection, Id, LoggedUserId);
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
                           new ExceptionHandler(ex,"customerapprovalrequest_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("pending")]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMER_VIEW)]
        public async Task<ActionResult<List<CustomerPendingList>>> GetPendingCustomerApprovalList(int Page, string? SearchText, string? SearchWith)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<CustomerPendingList> pendingApprovalsList = await GetCustomerPendingList(connection, Page, ApprovalEventCode.AE_CUSTOMER_CREATE, SearchText, SearchWith);
                int pendingApprovalsCount = await GetCustomerPendingCount(connection, ApprovalEventCode.AE_CUSTOMER_CREATE, SearchText, SearchWith);
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
                           new ExceptionHandler(ex,"customer_pending_message_no_records_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<CustomerPendingList>> GetCustomerPendingList(SqlConnection Connection, int Page, string? EventCode, string? SearchText, string? SearchWith)
        {
            var procedure = "customer_pending_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("SearchText", SearchText);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("ApprovalEventCode", EventCode);
            var approvalRequestPendingList = await Connection.QueryAsync<CustomerPendingList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return approvalRequestPendingList;
        }
        private async Task<int> GetCustomerPendingCount(SqlConnection Connection, string? EventCode, string? SearchText, string? SearchWith)
        {
            var procedure = "customer_pending_count";
            var parameters = new DynamicParameters();
            parameters.Add("SearchText", SearchText);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("ApprovalEventCode", EventCode);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
    }
}
