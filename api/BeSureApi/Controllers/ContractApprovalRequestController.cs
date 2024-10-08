using Dapper;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Models;
using BeSureApi.Services.LogService;
using BeSureApi.Exceptions;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using Microsoft.AspNetCore.Routing.Template;
using BeSureApi.Helpers;

namespace BeSureApi.Controllers
{
    [Route("api/contract/approval")]
    [ApiController]
    public class ContractApprovalRequestController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly JobQueueHelper _jobQueueHelper;
        public ContractApprovalRequestController(IConfiguration config, ILogService logService, IWebHostEnvironment hostingEnvironment)
        {
            _config     = config;
            _logService = logService;
            _hostingEnvironment = hostingEnvironment;
            _jobQueueHelper = new JobQueueHelper(config);
        }
        /// <summary>
        /// Request Approval
        /// </summary>
        [HttpPost]
        [Route("request")]
        public async Task<object> ContractApprovalRequest(ContractApprovalRequestDetails approvalRequestDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var reviewedDetails = new ReviewedDetails();
                var procedure = "contract_details_review";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", approvalRequestDetails.ContractId);
                parameters.Add("IsMandatoryDetails", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsManpower", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsAssetSummary", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsContractDocuments", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsPaymentDetails", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                reviewedDetails.IsMandatoryDetails = parameters.Get<bool>("IsMandatoryDetails");
                reviewedDetails.IsManpower = parameters.Get<bool>("IsManpower");
                reviewedDetails.IsAssetSummary = parameters.Get<bool>("IsAssetSummary");
                reviewedDetails.IsContractDocuments = parameters.Get<bool>("IsContractDocuments");
                reviewedDetails.IsPaymentDetails = parameters.Get<bool>("IsPaymentDetails");

                //checking any mandatory field is misssing
                bool isValidationFailed = reviewedDetails.GetType().GetProperties().Select(prop => (bool)prop.GetValue(reviewedDetails)).Any(value => !value);
                if (isValidationFailed)
                {
                    throw new CustomException("contract_approver_request_required_fields_confirmation_messaage");
                }
                ReviewDetails targetReview = approvalRequestDetails.ReviewDetails.FirstOrDefault();
                ReviewDetails modifiedReview = null;
                if (targetReview != null)
                {
                    targetReview.UserId = Convert.ToInt16(User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                    // Create the modifiedReview instance
                    modifiedReview = new ReviewDetails
                    {
                        ReviewComment = targetReview.ReviewComment,
                        UserId = targetReview.UserId,
                        ReviewStatus = targetReview.ReviewStatus,
                    };
                    approvalRequestDetails.ReviewDetails.Remove(targetReview); // Remove the original object
                    approvalRequestDetails.ReviewDetails.Insert(0, modifiedReview);
                }
                procedure = "contract_approval_request";
                parameters = new DynamicParameters();
                parameters.Add("ApproverId", approvalRequestDetails.ApproverId);
                parameters.Add("ColumnName", approvalRequestDetails.ColumnName);
                parameters.Add("ContractId", approvalRequestDetails.ContractId);
                parameters.Add("ReviewDetails", JsonSerializer.Serialize(approvalRequestDetails.ReviewDetails));
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                procedure = "contract_emailnotification_details";
                parameters = new DynamicParameters();
                parameters.Add("ApproverId", approvalRequestDetails.ApproverId);
                parameters.Add("ContractId", approvalRequestDetails.ContractId);
                var approverEmailNotificationDetailsList = await connection.QuerySingleAsync<ContractEmailNotificationDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
                // Load the email template once
                var templatePath = Path.Combine(_hostingEnvironment.ContentRootPath, "EmailTemplates", "ContractApprovalRequest.html");
                var template = "";
                if (System.IO.File.Exists(templatePath))
                {
                    template = System.IO.File.ReadAllText(templatePath);
                }
                var mail = new EmailDto()
                {
                    To = approverEmailNotificationDetailsList.Email,
                    Subject = "Contract Approval Request",
                };
                mail.Body = string.Format(template, approverEmailNotificationDetailsList.FullName,approverEmailNotificationDetailsList.NameOnPrint);
                await _jobQueueHelper.AddMailToJobQueue(mail);

                var approvalRequestEventCode = "CTR_APRV";
                procedure = "userinfo_get_emailnotification_list";
                parameters = new DynamicParameters();
                parameters.Add("TenantOfficeId", approverEmailNotificationDetailsList.TenantOfficeId);
                parameters.Add("EventCode", approvalRequestEventCode);
                var emailNotificationDetailsList = await connection.QueryAsync<UserEmailNotificationDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
                if (emailNotificationDetailsList.Any())
                {
                    foreach (var approverNotificationDetails in emailNotificationDetailsList)
                    {
                        mail = new EmailDto()
                        {
                            To = approverNotificationDetails.Email,
                            Subject = "Contract Approval Request",
                        };
                        mail.Body = string.Format(template, approverNotificationDetails.FullName, approverEmailNotificationDetailsList.NameOnPrint);
                        await _jobQueueHelper.AddMailToJobQueue(mail);
                    }
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsApprovalRequested = true
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
                            new ExceptionHandler(ex,"contract_approver_request_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        /// <summary>
        /// Request Approve
        /// </summary>
        [HttpPost]
        [Route("request/approve")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_REVIEW)]
        public async Task<object> ContractApprove(ContractApprovalDetails approvalDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var reviewedDetails = new ReviewedDetails();
                var procedure = "contract_details_review";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", approvalDetails.ContractId);
                parameters.Add("IsMandatoryDetails", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsManpower", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsAssetSummary", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsContractDocuments", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsPaymentDetails", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                reviewedDetails.IsMandatoryDetails = parameters.Get<bool>("IsMandatoryDetails");
                reviewedDetails.IsManpower = parameters.Get<bool>("IsManpower");
                reviewedDetails.IsAssetSummary = parameters.Get<bool>("IsAssetSummary");
                reviewedDetails.IsContractDocuments = parameters.Get<bool>("IsContractDocuments");
                reviewedDetails.IsPaymentDetails = parameters.Get<bool>("IsPaymentDetails");

                //checking any mandatory field is misssing
                bool isValidationFailed = reviewedDetails.GetType().GetProperties().Select(prop => (bool)prop.GetValue(reviewedDetails)).Any(value => !value);
                if (isValidationFailed)
                {
                    throw new CustomException("contract_approver_request_required_fields_confirmation_messaage");
                }
                ReviewDetails targetReview = approvalDetails.ReviewDetails.FirstOrDefault();
                ReviewDetails modifiedReview = null;
                if (targetReview != null)
                {
                    targetReview.UserId = Convert.ToInt16(User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                    // Create the modifiedReview instance
                    modifiedReview = new ReviewDetails
                    {
                        ReviewComment = targetReview.ReviewComment,
                        UserId = targetReview.UserId,
                        ReviewStatus = targetReview.ReviewStatus,
                    };
                    approvalDetails.ReviewDetails.Remove(targetReview); // Remove the original object
                    approvalDetails.ReviewDetails.Insert(0, modifiedReview);   
                }
                procedure = "contract_approve";
                parameters = new DynamicParameters();
                parameters.Add("ColumnName", approvalDetails.ColumnName);
                parameters.Add("ContractId", approvalDetails.ContractId);
                parameters.Add("ReviewDetails", JsonSerializer.Serialize(approvalDetails.ReviewDetails));
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsContractApproved = true
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
                            new ExceptionHandler(ex,"contract_approver_contract_approve_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        /// <summary>
        /// Request Reject
        /// </summary>
        [HttpPost]
        [Route("request/reject")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_REVIEW)]
        public async Task<object> ContractReject(ContractRejectDetails rejectDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                ReviewDetails targetReview = rejectDetails.ReviewDetails.FirstOrDefault();
                ReviewDetails modifiedReview = null;
                if (targetReview != null)
                {
                    targetReview.UserId = Convert.ToInt16(User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                    // Create the modifiedReview instance
                    modifiedReview = new ReviewDetails
                    {
                        ReviewComment = targetReview.ReviewComment,
                        UserId = targetReview.UserId,
                        ReviewStatus = targetReview.ReviewStatus,
                    };
                    rejectDetails.ReviewDetails.Remove(targetReview); // Remove the original object
                    rejectDetails.ReviewDetails.Insert(0, modifiedReview);
                }
                var procedure = "contract_reject";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", rejectDetails.ContractId);
                parameters.Add("ReviewDetails", JsonSerializer.Serialize(rejectDetails.ReviewDetails));
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsContractRejected = true
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
                            new ExceptionHandler(ex,"contract_approver_contract_reject_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        /// <summary>
        /// Request Approve
        /// </summary>
        [HttpPost]
        [Route("request/requestchange")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_REVIEW)]
        public async Task<object> ContractRequestChange(ContractRequestChangeDetails requestChangeDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                ReviewDetails targetReview = requestChangeDetails.ReviewDetails.FirstOrDefault();
                ReviewDetails modifiedReview = null;
                if (targetReview != null)
                {
                    targetReview.UserId = Convert.ToInt16(User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                    // Create the modifiedReview instance
                    modifiedReview = new ReviewDetails
                    {
                        ReviewComment = targetReview.ReviewComment,
                        UserId = targetReview.UserId,
                        ReviewStatus = targetReview.ReviewStatus,
                    };
                    requestChangeDetails.ReviewDetails.Remove(targetReview); // Remove the original object
                    requestChangeDetails.ReviewDetails.Insert(0, modifiedReview);
                }

                var procedure = "contract_request_change";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", requestChangeDetails.ContractId);
                parameters.Add("ReviewDetails", JsonSerializer.Serialize(requestChangeDetails.ReviewDetails));
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsContractChangeRequested = true
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
                            new ExceptionHandler(ex,"contract_approver_contract_request_change_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("approver/details")]
        public async Task<ActionResult> GetContractApproverDetails(int TenantId, bool IsRenewalContract)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure   = "contract_approver_details";
                var parameters  = new DynamicParameters(); 
                parameters.Add("TenantId", TenantId);
                parameters.Add("IsRenewContract", IsRenewalContract);
                var approverDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ApproversDetails = approverDetails.FirstOrDefault()
                    }
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new { 
                    status = StatusCodes.Status400BadRequest, 
                    errors = new { 
                        Message = new[] {
                            new ExceptionHandler(ex,"contractapproverlist_no_data", _logService).GetMessage()
                        } 
                    } 
                }));
            }
        }
        [HttpGet]
        [Route("details/review")]
        public async Task<ActionResult> ContractDetailsReview(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var reviewedDetails = new ReviewedDetails();
                var procedure = "contract_details_review";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                parameters.Add("IsMandatoryDetails", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsManpower", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsAssetSummary", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsContractDocuments", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsPaymentDetails", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                reviewedDetails.IsMandatoryDetails = parameters.Get<bool>("IsMandatoryDetails");
                reviewedDetails.IsManpower = parameters.Get<bool>("IsManpower");
                reviewedDetails.IsAssetSummary = parameters.Get<bool>("IsAssetSummary");
                reviewedDetails.IsContractDocuments = parameters.Get<bool>("IsContractDocuments");
                reviewedDetails.IsPaymentDetails = parameters.Get<bool>("IsPaymentDetails");
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ReviewedDetails = reviewedDetails
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
                            new ExceptionHandler(ex,"contractapproverlist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}