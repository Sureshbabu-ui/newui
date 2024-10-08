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
    [Route("api/approvalrequest/user")]
    [ApiController]
    public class UserCreateApprovalRequestController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly JobQueueHelper _jobQueueHelper;
        public UserCreateApprovalRequestController(IConfiguration config, ILogService logService, IWebHostEnvironment hostingEnvironment)
        {
            _config = config;
            _logService = logService;
            _hostingEnvironment = hostingEnvironment;
            _jobQueueHelper = new JobQueueHelper(config);
        }
       
        // GET api/<UserApprovalRequestController>/5
        [HttpGet("{id}")]
        [Authorize()]
        [HasPermission(ApprovalBusinessFunctionCode.APPROVAL_VIEW)]
        public async Task<ActionResult<UserApprovalDetailWithReview>> GetApprovalRequestUserDetails(int id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                var approvalRequestDetails = await GetUserApprovalDetailData(connection,id);
                IEnumerable<ApprovalRequestReviewDetail> approvalRequestReviewDetail = await ApprovalRequestHelper.GetApprovalReviewList(connection, LoggedUserId, "ApprovalRequestDetailId",id);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new UserApprovalDetailWithReview
                    {
                        UserDetail= approvalRequestDetails,
                        ApprovalRequestReviewList= approvalRequestReviewDetail
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
        private async Task<UserApprovalDetail> GetUserApprovalDetailData(SqlConnection Connection, int ApprovalRequestDetailId)
        {
            var procedure = "approvalrequest_user_detail";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestDetailId", ApprovalRequestDetailId);
            var detail = await Connection.QueryAsync<UserApprovalDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return detail.First();
        }

        [HttpPost, Authorize()]
        [Route("")]
        [HasPermission(UserBusinessFunctionCode.USER_MANAGE)]
        public async Task<object> CreatUserApprovalRequest([FromForm] UserCreate usercreate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "UserLogin");
                parameters.Add("ColumnName", "UserName");
                parameters.Add("Value", usercreate.EmployeeCode);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                    {
                        ModelState.AddModelError("EmployeeCode", "usermanagement_empcode_exists_message");
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
                var fileController = new FileController(_config);
                usercreate.DocumentSize = usercreate.DocumentFile.Length;
                var userCreateWithoutFile  = new UserCreateWithoutFile
                {
                    FullName = usercreate.FullName,
                    Email = usercreate.Email,
                    Phone = usercreate.Phone,
                    PassCode = "",
                    UserCategoryId = usercreate.UserCategoryId,
                    EngagementTypeId = usercreate.EngagementTypeId,
                    EmployeeCode = usercreate.EmployeeCode,
                    DivisionId = usercreate.DivisionId,
                    DepartmentId = usercreate.DepartmentId,
                    DesignationId = usercreate.DesignationId,
                    TenantOfficeId = usercreate.TenantOfficeId,
                    GenderId = usercreate.GenderId,
                    ReportingManagerId = usercreate.ReportingManagerId,
                    UserRoles = usercreate.UserRoles,
                    EngineerCategory = usercreate.EngineerCategory,
                    EngineerGeolocation = usercreate.EngineerGeolocation,
                    EngineerAddress = usercreate.EngineerAddress,
                    EngineerCityId = usercreate.EngineerCityId,
                    EngineerCountryId = usercreate.EngineerCountryId,
                    EngineerPincode = usercreate.EngineerPincode,
                    EngineerStateId = usercreate.EngineerStateId,
                    EngineerLevel = usercreate.EngineerLevel,
                    EngineerType = usercreate.EngineerType,
                    IsConcurrentLoginAllowed = usercreate.IsConcurrentLoginAllowed,
                    BusinessUnits = usercreate.BusinessUnits,
                    UserExpiryDate = usercreate.UserExpiryDate,
                    DocumentUrl = usercreate.DocumentUrl,
                    BudgetedAmount = usercreate.BudgetedAmount,
                    EndDate = usercreate.EndDate,
                    StartDate = usercreate.StartDate,
                    CustomerAgreedAmount = usercreate.CustomerAgreedAmount,
                    CustomerSiteId = usercreate.CustomerSiteId,
                    ContractId = usercreate.ContractId,
                    DocumentSize = usercreate.DocumentSize,
                    UserGradeId = usercreate.UserGradeId
                };
                string fileName = usercreate.EmployeeCode + Path.GetExtension(usercreate.DocumentFile?.FileName);

                IEnumerable<ApprovalWorkflowDetailForRequest> workflowDetail = await ApprovalRequestHelper.GetNextApprovalWorkflowDetailAsync(connection, ApprovalEventCode.AE_USER_CREATE, LoggedUserId, null, JsonSerializer.Serialize(userCreateWithoutFile));
                bool IsApproved = false;
                if (workflowDetail.Count() == 0)
                {
                    userCreateWithoutFile.DocumentUrl= _config.GetSection("UserDocuments:DownloadPath").Value + fileName;
                    string newPassCode = GenerateRandomPassword();
                    userCreateWithoutFile.PassCode = CreateHashedPassCode(newPassCode);
                    await CreateUser(connection, userCreateWithoutFile,  LoggedUserId, null);
                    await fileController.SaveUserDocument(usercreate.DocumentFile,fileName);
                    await SendMailToUserAsync(usercreate.Email, usercreate.FullName,newPassCode);
                    IsApproved = true;
                }
                else
                {
                    userCreateWithoutFile.DocumentUrl = _config.GetSection("UserApprovalDocuments:DownloadPath").Value +fileName ;
                    await ApprovalRequestHelper.CreateApprovalRequest(connection, JsonSerializer.Serialize(userCreateWithoutFile), workflowDetail, LoggedUserId, ApprovalEventCode.AE_USER_CREATE);
                    await fileController.SaveUserApprovalDocument(usercreate.DocumentFile, fileName);
                }

                // var procedure = "userinfo_get_emailnotification_list";
                //var parameters = new DynamicParameters();
                // parameters.Add("TenantOfficeId", usercreate.TenantOfficeId);
                // parameters.Add("EventCode", "USR_CRET");
                // var userEmailNotificationDetailsList = connection.Query<UserEmailNotificationDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);

                // // Load the email template once
                // var templatePath = Path.Combine(_hostingEnvironment.ContentRootPath, "EmailTemplates", "UserCreatedNotificationEmail.html");
                // var template = "";
                // if (System.IO.File.Exists(templatePath))
                // {
                //     template = System.IO.File.ReadAllText(templatePath);
                // }

                // foreach (var userNotificationDetails in userEmailNotificationDetailsList)
                // {
                //     var mail = new EmailDto()
                //     {
                //         To = userNotificationDetails.Email,
                //         Subject = "User Approval Request Created",
                //     };
                //     mail.Body = string.Format(template, userNotificationDetails.FullName, usercreate.FullName);
                //     // Send the email
                //     _emailService.SendEmail(mail);
                // }


                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsUserCreated = true,
                        IsApproved =IsApproved 
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
                          new ExceptionHandler(ex,"usermanagement_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("approve")]
        [HasPermission(ApprovalBusinessFunctionCode.APPROVAL_MANAGE)]
        public async Task<ActionResult> ApproveUserRequest(UserApprovalRequest userApprovalRequest)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                IEnumerable<ApprovalWorkflowDetailForRequest> workflowDetail = await ApprovalRequestHelper.GetNextApprovalWorkflowDetailAsync(connection, ApprovalEventCode.AE_USER_CREATE, LoggedUserId, userApprovalRequest.ApprovalRequestDetailId, null);

                if (workflowDetail.Count() == 0)
                {
                    UserApprovalDetail approvalRequestDetail = await GetUserApprovalDetailData(connection, userApprovalRequest.ApprovalRequestDetailId);
                    string documentUrl = approvalRequestDetail.DocumentUrl;
                    string configPath = _config.GetSection("UserApprovalDocuments:Path").Value;
                    var fileController = new FileController(_config);
                    IFormFile formFile = await fileController.DownloadDocumentAsFormFileAsync(documentUrl, configPath);
                    string uploadedFileName = await fileController.SaveUserDocument(formFile, formFile.FileName);
                    string newPassCode = GenerateRandomPassword();
                    await ApproveUser(connection,  userApprovalRequest.ApprovalRequestDetailId, LoggedUserId,newPassCode, userApprovalRequest.ReviewComment,_config.GetSection("UserDocuments:DownloadPath").Value+uploadedFileName);
                    await SendMailToUserAsync(approvalRequestDetail.Email,approvalRequestDetail.FullName,newPassCode);
                }
                else
                {
                    await ApprovalRequestHelper.ApproveApprovalRequest(connection, userApprovalRequest.ApprovalRequestDetailId, workflowDetail, LoggedUserId, userApprovalRequest.ReviewComment);
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
                            new ExceptionHandler(ex,"usermanagement_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }


        private async Task<object> ApproveUser(SqlConnection connection, int? ApprovalRequestDetailId, string? LoggedUserId,string PassCode, string? ReviewComment,string DocumentUrl)
        {
            var procedure = "user_approve";
            var parameters = new DynamicParameters();
            parameters.Add("ReviewedBy", LoggedUserId);
            parameters.Add("DocumentUrl", DocumentUrl);
            parameters.Add("PassCode", CreateHashedPassCode(PassCode));
            parameters.Add("ApprovalRequestDetailId", ApprovalRequestDetailId);
            parameters.Add("ReviewComment", ReviewComment);
            var result = await connection.QueryAsync<object>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return result;
        }

        private async Task<object> CreateUser(SqlConnection connection, UserCreateWithoutFile userApprovalRequest,string? LoggedUserId, int? ApprovalRequestId)
        {
            var procedure = "userinfo_create";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestId", ApprovalRequestId);
            parameters.Add("FullName", userApprovalRequest.FullName);
            parameters.Add("Email", userApprovalRequest.Email);
            parameters.Add("Phone", userApprovalRequest.Phone);
            parameters.Add("Passcode", (userApprovalRequest.PassCode));
            parameters.Add("CreatedBy", LoggedUserId);
            parameters.Add("UserCategoryId", userApprovalRequest.UserCategoryId);
            parameters.Add("TenantOfficeId", userApprovalRequest.TenantOfficeId);
            parameters.Add("DepartmentId", userApprovalRequest.DepartmentId);
            parameters.Add("DesignationId", userApprovalRequest.DesignationId);
            parameters.Add("DivisionId", userApprovalRequest.DivisionId);
            parameters.Add("EngagementTypeId", userApprovalRequest.EngagementTypeId);
            parameters.Add("BusinessUnits", userApprovalRequest.BusinessUnits);
            parameters.Add("ReportingManagerId", userApprovalRequest.ReportingManagerId);
            parameters.Add("EmployeeCode", userApprovalRequest.EmployeeCode);
            parameters.Add("GenderId", userApprovalRequest.GenderId);
            parameters.Add("UserRoles", userApprovalRequest.UserRoles);
            parameters.Add("EngineerCategory", userApprovalRequest.EngineerCategory);
            parameters.Add("EngineerLevel", userApprovalRequest.EngineerLevel);
            parameters.Add("EngineerType", userApprovalRequest.EngineerType);
            parameters.Add("EngineerGeolocation", userApprovalRequest.EngineerGeolocation);
            parameters.Add("EngineerAddress", userApprovalRequest.EngineerAddress);
            parameters.Add("EngineerCountryId", userApprovalRequest.EngineerCountryId);
            parameters.Add("EngineerStateId", userApprovalRequest.EngineerStateId);
            parameters.Add("EngineerCityId", userApprovalRequest.EngineerCityId);
            parameters.Add("EngineerPincode", userApprovalRequest.EngineerPincode);
            parameters.Add("ApprovedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("IsConcurrentLoginAllowed", userApprovalRequest.IsConcurrentLoginAllowed);
            parameters.Add("DocumentUrl", userApprovalRequest.DocumentUrl);
            parameters.Add("DocumentSize", userApprovalRequest.DocumentSize);
            parameters.Add("UserExpiryDate", userApprovalRequest.UserExpiryDate);
            parameters.Add("BudgetedAmount", userApprovalRequest.BudgetedAmount);
            parameters.Add("EndDate", userApprovalRequest.EndDate);
            parameters.Add("StartDate", userApprovalRequest.StartDate);
            parameters.Add("CustomerAgreedAmount", userApprovalRequest.CustomerAgreedAmount);
            parameters.Add("CustomerSiteId", userApprovalRequest.CustomerSiteId);
            parameters.Add("ContractId", userApprovalRequest.ContractId);
            parameters.Add("UserGradeId", userApprovalRequest.UserGradeId);
            return   connection.Query<UserCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

        [HttpPut("{Id}")]
        [Authorize()]
        [HasPermission(UserBusinessFunctionCode.USER_MANAGE)]

        public async Task<ActionResult> UpdatePendingUserApprovalRequest([FromForm] UserEditApproval updateuser, int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                string? fileName = updateuser.DocumentFile != null ? await new FileController(_config).SaveEditUserApprovalDocument(updateuser) : Path.GetFileName(updateuser.DocumentUrl);

                // Delete old file if DocumentFile is provided
                if (updateuser.DocumentFile != null)
                {
                    string configPath = _config.GetSection("UserApprovalDocuments:Path").Value;
                    string filePathToDelete = Path.Combine(configPath, Path.GetFileName(updateuser.DocumentUrl));
                    System.IO.File.Delete(filePathToDelete);
                }
                var updateuserWithoutFile = new UserCreateWithoutFile
                {
                  FullName=  updateuser.FullName,
                  Email = updateuser.Email,
                  Phone =  updateuser.Phone,
                  PassCode= "",
                  UserCategoryId=  updateuser.UserCategoryId,
                  EngagementTypeId = updateuser.EngagementTypeId,
                  EmployeeCode = updateuser.EmployeeCode,
                  DivisionId = updateuser.DivisionId,
                  DepartmentId = updateuser.DepartmentId,
                  DesignationId = updateuser.DesignationId,
                  TenantOfficeId =  updateuser.TenantOfficeId,
                  GenderId = updateuser.GenderId,
                  ReportingManagerId = updateuser.ReportingManagerId,
                  UserRoles = updateuser.UserRoles,
                  EngineerCategory =  updateuser.EngineerCategory,
                  EngineerGeolocation =  updateuser.EngineerGeolocation,
                  EngineerAddress = updateuser.EngineerAddress,
                  EngineerCityId = updateuser.EngineerCityId,
                  EngineerCountryId =  updateuser.EngineerCountryId,
                  EngineerPincode =  updateuser.EngineerPincode,
                  EngineerStateId =  updateuser.EngineerStateId,
                  EngineerLevel = updateuser.EngineerLevel,
                  EngineerType = updateuser.EngineerType,
                  IsConcurrentLoginAllowed = updateuser.IsConcurrentLoginAllowed,
                  BusinessUnits = updateuser.BusinessUnits,
                  UserExpiryDate = updateuser.UserExpiryDate,
                  BudgetedAmount = updateuser.BudgetedAmount,
                  EndDate = updateuser.EndDate,
                  StartDate =  updateuser.StartDate,
                  CustomerAgreedAmount =  updateuser.CustomerAgreedAmount,
                  CustomerSiteId =  updateuser.CustomerSiteId,
                  ContractId =  updateuser.ContractId,
                  DocumentSize = updateuser.DocumentFile != null ? updateuser.DocumentFile.Length : updateuser.DocumentSize,
                  DocumentUrl = updateuser.DocumentFile != null ? _config.GetSection("UserApprovalDocuments:DownloadPath").Value + fileName : updateuser.DocumentUrl,
                  UserGradeId = updateuser.UserGradeId,
                };

                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                var fileController = new FileController(_config);

                IEnumerable<ApprovalWorkflowDetailForRequest> workflowDetail = await ApprovalRequestHelper.GetNextApprovalWorkflowDetailAsync(connection, ApprovalEventCode.AE_USER_CREATE, LoggedUserId, null, null);

                if (workflowDetail.Count() == 0)
                {
                   updateuserWithoutFile.DocumentUrl = _config.GetSection("UserDocuments:DownloadPath").Value + fileName;
                    string newPassCode = GenerateRandomPassword();
                    updateuserWithoutFile.PassCode = newPassCode;
                   await CreateUser(connection, updateuserWithoutFile, LoggedUserId, Id);
                    string configPath = _config.GetSection("UserApprovalDocuments:Path").Value;
                    IFormFile formFile = await fileController.DownloadDocumentAsFormFileAsync(updateuserWithoutFile.DocumentUrl, configPath);
                    await fileController.SaveUserDocument(formFile, fileName);
                    await SendMailToUserAsync(updateuserWithoutFile.Email, updateuserWithoutFile.FullName,newPassCode);
                }
                else
                {
                    await ApprovalRequestHelper.UpdateApprovalRequest(connection, Id, LoggedUserId, workflowDetail, updateuserWithoutFile);
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

        // DELETE api/<UserApprovalRequestController>/5
        [HttpDelete("{id}")]
        [Authorize()]
        [HasPermission(UserBusinessFunctionCode.USER_MANAGE)]
        public async Task<object> DeleteUserApprovalRequest(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var LoggedUserId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                var userDetail = await GetUserPendingDetail(connection, Id);
                if (userDetail.DocumentUrl != null)
                {
                    string configPath = _config.GetSection("UserApprovalDocuments:Path").Value;
                    string filePathToDelete = Path.Combine(configPath, Path.GetFileName(userDetail.DocumentUrl));
                    System.IO.File.Delete(filePathToDelete);
                }
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
                           new ExceptionHandler(ex,"userapprovalrequest_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    
        [HttpGet, Authorize()]
        [Route("pending")]
        [HasPermission(UserBusinessFunctionCode.USER_VIEW)]
        public async Task<ActionResult<List<UserPendingList>>> GetPendingUserApprovalList(int Page, string? SearchText, string? SearchWith)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<UserPendingList> pendingApprovalsList = await GetUserPendingList(connection, Page, "User", SearchText, SearchWith);
                int pendingApprovalsCount = await GetUserPendingCount(connection, "User", SearchText, SearchWith);
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
                           new ExceptionHandler(ex,"user_pending_message_no_records_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<UserPendingList>> GetUserPendingList(SqlConnection Connection, int Page, string? TableName, string? SearchText, string? SearchWith)
        {
            var procedure = "user_pending_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("SearchText", SearchText);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("ApprovalEventCode", ApprovalEventCode.AE_USER_CREATE);
            var approvalRequestPendingList = await Connection.QueryAsync<UserPendingList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return approvalRequestPendingList;
        }
        private async Task<int> GetUserPendingCount(SqlConnection Connection, string? TableName, string? SearchText, string? SearchWith)
        {
            var procedure = "user_pending_count";
            var parameters = new DynamicParameters();
            parameters.Add("SearchText", SearchText);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("ApprovalEventCode", ApprovalEventCode.AE_USER_CREATE);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet("pending/{Id}"), Authorize()]
        [HasPermission(UserBusinessFunctionCode.USER_VIEW)]
        public async Task<ActionResult<UserPendingDetailWithReview>> GetPendingUserDetails(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var approvalRequestDetail =await GetUserPendingDetail(connection, Id);
                var approvalRequestReviewDetail =await ApprovalRequestHelper.GetApprovalReviewList(connection,"1","ApprovalRequestId",Id);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new UserPendingDetailWithReview
                    {
                        UserPendingDetail=approvalRequestDetail,
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

        private async Task<UserPendingDetail> GetUserPendingDetail(SqlConnection Connection, int ApprovalRequestId)
        {
            var procedure = "user_pending_detail";
            var parameters = new DynamicParameters(); 
            parameters.Add("ApprovalRequestId", ApprovalRequestId);
            var approvalRequestDetail = await Connection.QueryAsync<UserPendingDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return approvalRequestDetail.FirstOrDefault();
        }

        private string CreateHashedPassCode(string Passcode)
        {
            // divide by 8 to convert bits to bytes
            byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);
            // derive a 256-bit subkey (use HMACSHA256 with 100,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: Passcode!,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));
            return $"{hashed}:{Convert.ToBase64String(salt)}";
        }

        private async Task SendMailToUserAsync(string email, string fullName, string passCode)
        {
            var mail = new EmailDto()
            {
                To = email,
                Subject = "User created successfully",
            };

            string templatePath = Path.Combine(_hostingEnvironment.ContentRootPath, "EmailTemplates", "UserCreatedEmail.html");
            string template = "";

            if (System.IO.File.Exists(templatePath))
            {
                template = await System.IO.File.ReadAllTextAsync(templatePath);
            }
            mail.Body = string.Format(template, fullName, passCode);
            await _jobQueueHelper.AddMailToJobQueue(mail);
        }

        private  string GenerateRandomPassword(int minLength = 8, int maxLength = 16)
        {
             Random _random = new Random();
             string Lowercase = "abcdefghijklmnopqrstuvwxyz";
             string Uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
             string Digits = "0123456789";
            string SpecialCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";
            if (minLength < 8 || maxLength > 16 || minLength > maxLength)
            {
                throw new ArgumentException("Password length should be between 8 and 16 characters.");
            }
            int passwordLength = _random.Next(minLength, maxLength + 1);

            // Ensure at least one character from each required category
            char[] password = new char[passwordLength];
            password[0] = Uppercase[_random.Next(Uppercase.Length)];
            password[1] = SpecialCharacters[_random.Next(SpecialCharacters.Length)];
            password[2] = Digits[_random.Next(Digits.Length)];
            password[3] = Lowercase[_random.Next(Lowercase.Length)];

            // Fill the rest of the password with a mix of all categories
            string allCharacters = Lowercase + Uppercase + Digits + SpecialCharacters;
            for (int i = 4; i < passwordLength; i++)
            {
                password[i] = allCharacters[_random.Next(allCharacters.Length)];
            }

            // Shuffle the password array to ensure randomness
            return new string(password.OrderBy(x => _random.Next()).ToArray());
        }

    }
}
