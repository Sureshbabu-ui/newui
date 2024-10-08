using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using System.Data;
using BeSureApi.Helpers;
using BeSureApi.ApprovalWorkflow;

namespace BeSureApi.Controllers
{
    [Route("api/approvalrequest/bank")]
    [ApiController]
    public class BankApprovalRequestController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly ILogService _logService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public BankApprovalRequestController(IConfiguration config, IEmailService emailService, ILogService logService, IWebHostEnvironment hostingEnvironment)
        {
            _config = config;
            _logService = logService;
            _emailService = emailService;
            _hostingEnvironment = hostingEnvironment;
        }
   
        [HttpPost,Authorize()]
        [Route("")]
        [HasPermission(MasterDataBusinessFunctionCode.BANK_MANAGE)]
        public async Task<object> CreateBankApprovalRequest(BankCreate Bankdetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var columnNames = new List<string> { "BankCode", "BankName" };
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "Bank");

                List<string> errorMessages = new List<string>(); // Store the error messages

                foreach (var columnName in columnNames)
                {
                    parameters.Add("ColumnName", columnName);

                    if (columnName == "BankCode")
                    {
                        parameters.Add("Value", Bankdetails.BankCode);
                    }
                    else if (columnName == "BankName")
                    {
                        parameters.Add("Value", Bankdetails.BankName);
                    }
                    parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                    int count = parameters.Get<int>("Count");
                    if (count > 0)
                    {
                        ModelState.AddModelError(columnName, columnName + " already exists.");
                    }
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
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;

                IEnumerable<ApprovalWorkflowDetailForRequest> workflowDetail = await ApprovalRequestHelper.GetNextApprovalWorkflowDetailAsync(connection, ApprovalEventCode.AE_BANK_CREATE, LoggedUserId, null,null );
                if (workflowDetail.Count() == 0)
                {
                    await CreateBank(connection, Bankdetails, null, LoggedUserId, null);
                }
                else
                {
                    await ApprovalRequestHelper.CreateApprovalRequest(connection, JsonSerializer.Serialize(Bankdetails), workflowDetail, LoggedUserId, ApprovalEventCode.AE_BANK_CREATE);
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsInserted = true
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
                          new ExceptionHandler(ex,"create_bank_approval_request_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("pending")]
        [HasPermission(MasterDataBusinessFunctionCode.BANK_VIEW)]
        public async Task<ActionResult<List<PendingApprovals>>> GetPendingBankApprovalList(int Page)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                IEnumerable<PendingApprovalList> pendingApprovalsList = await GetPendingApprovalList(connection,LoggedUserId, Page, ApprovalEventCode.AE_BANK_CREATE);
                int pendingApprovalsCount = await GetPendingApprovalsCount(connection,LoggedUserId, ApprovalEventCode.AE_BANK_CREATE);
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
                           new ExceptionHandler(ex,"banks_approved_message_no_records_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<PendingApprovalList>> GetPendingApprovalList(SqlConnection Connection,string? LoggedUserId, int Page, string? TableName)
        {
            var procedure = "bank_pending_list";
            var parameters = new DynamicParameters();
            parameters.Add("TableName", TableName);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("LoggedUserId", LoggedUserId);
            var approvalRequestPendingList = await Connection.QueryAsync<PendingApprovalList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return approvalRequestPendingList;
        }
        private async Task<int> GetPendingApprovalsCount(SqlConnection Connection, string? LoggedUserId, string? TableName)
        {
            var procedure = "bank_pending_count";
            var parameters = new DynamicParameters();
            parameters.Add("TableName", TableName);
            parameters.Add("LoggedUserId", LoggedUserId);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet("{Id}"), Authorize()]        
        public async Task<ActionResult<List<ApprovalRequestDetailWithReview>>> GetApprovalRequestDetails(int Id, string TableName)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                ApprovalRequestDetailWithReview approvalRequestDetails = await GetApprovalDetailList(connection,LoggedUserId, TableName, Id);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data =  approvalRequestDetails
                    
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
        private async Task<ApprovalRequestDetailWithReview> GetApprovalDetailList(SqlConnection Connection,string? LoggedUserId, string ApprovalWorkflowCode, int ApprovalRequestDetailId)
        {
            var procedure = "approvalrequest_details";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestDetailId", ApprovalRequestDetailId);
            parameters.Add("ApprovalWorkflowCode", ApprovalWorkflowCode);
            parameters.Add("LoggedUserId", LoggedUserId);
            using (var multi = await Connection.QueryMultipleAsync(procedure, parameters, commandType: CommandType.StoredProcedure))
            {
                var approvalRequest = await multi.ReadFirstOrDefaultAsync<PendingApprovalDetail>();
                var approvalReviewList = await multi.ReadAsync<ApprovalRequestReviewDetail>();

                return new ApprovalRequestDetailWithReview
                {
                    ApprovalRequestDetail = approvalRequest,
                    ApprovalRequestReviewList = approvalReviewList
                };
            }
        }

        [HttpPost, Authorize()]
        [Route("approve")]
        public async Task<object> ApproveBankRequest(BankApprovalRequest BankApprovalRequest)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                //  Retreiving approvalRequest for getting UpdatedOn value of the approvalRequest
               // var procedure = "approvalrequest_details";
              //  var parameters = new DynamicParameters();
              //  parameters.Add("ApprovalRequestId", BankApprovalRequest.ApprovalRequestDetailId);
             //   parameters.Add("TableName", "Bank");
                //var approvalRequestDetails = await connection.QueryAsync<ApprovedBankDetailsWithModifiedDate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                ////TODOS: Implement encryption of FetchTime
                //if ((approvalRequestDetails.First().UpdatedOn ?? DateTime.MinValue) < DateTime.Parse(BankApprovalRequest.FetchTime))
                //{
                //    // bank records are added to the Bank table for the first time
                //}
                //else
                //{
                //    throw new CustomException("banks_approve_reload_page_again_message");
                //}

                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                    IEnumerable<ApprovalWorkflowDetailForRequest> workflowDetail = await ApprovalRequestHelper.GetNextApprovalWorkflowDetailAsync(connection, "AWF_BANK_CREATE", LoggedUserId,BankApprovalRequest.ApprovalRequestDetailId,  null);

                if (workflowDetail.Count()==0)
                    {
                    await CreateBank(connection, null,BankApprovalRequest.ApprovalRequestDetailId, LoggedUserId, BankApprovalRequest.ReviewComment);
                    }
                    else
                    {
                        await ApprovalRequestHelper.ApproveApprovalRequest(connection,BankApprovalRequest.ApprovalRequestDetailId,workflowDetail, LoggedUserId, BankApprovalRequest.ReviewComment);
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
                            new ExceptionHandler(ex,"banks_approve_bank_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<object> CreateBank(SqlConnection connection,BankCreate BankData,int? ApprovalRequestDetailId, string? UserId, string? ReviewComment)
        {
            var procedure = "bank_create";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestDetailId", ApprovalRequestDetailId);
            parameters.Add("UserId", UserId);
            parameters.Add("BankCode", BankData?.BankCode??null);
            parameters.Add("BankName", BankData?.BankName??null);
            parameters.Add("ReviewComment", ReviewComment);
            return await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
        }


        // DELETE api/<BankApprovalRequestController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
       


        [HttpPut("{Id}")]
        [Authorize()]
        public async Task<ActionResult> UpdatePendingApprovalRequest(int Id,BankApprovalRequestEdit BankDetail)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;

                IEnumerable<ApprovalWorkflowDetailForRequest> WorkflowDetail = await ApprovalRequestHelper.GetNextApprovalWorkflowDetailAsync(connection, ApprovalEventCode.AE_BANK_CREATE, LoggedUserId, null, null);

                await ApprovalRequestHelper.UpdateApprovalRequest(connection,Id, LoggedUserId,WorkflowDetail, BankDetail);

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
    }
}
