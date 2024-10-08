using BeSureApi.Models;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata.Ecma335;
using System.Numerics;
using System;
using Microsoft.OpenApi.Any;
using BeSureApi.Services.LogService;
using BeSureApi.Exceptions;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Org.BouncyCastle.Utilities;
using Microsoft.Extensions.Hosting.Internal;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Services.ExcelService;
using BeSureApi.Helpers;

namespace BeSureApi.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IExcelService _excelService;
        private readonly JobQueueHelper _jobQueueHelper;


        public UserController(IConfiguration config,ILogService logService, IWebHostEnvironment hostingEnvironment, IExcelService excelService)
        {
            _config         = config;
            _logService     = logService;
            _hostingEnvironment = hostingEnvironment;
            _excelService = excelService;
            _jobQueueHelper = new JobQueueHelper(config);
        }

        [HttpGet,Authorize()]
        [Route("list")]
        [HasPermission(UserBusinessFunctionCode.USER_VIEW)]
        public async Task<ActionResult<List<UsersList>>> GetAllUsers(int Page, string? SearchText,string? SearchWith)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<UsersList> Users    = await GetUsersList(Connection, Page, SearchText, SearchWith);
                int TotalRows                   = await GetUsersCount(Connection, Page, SearchText, SearchWith);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new { 
                    status  = StatusCodes.Status200OK, 
                    data    = new { 
                        users       = Users, 
                        currentPage = Page, 
                        totalRows   = TotalRows, 
                        PerPage     = perPage
                    } 
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new { 
                    status = StatusCodes.Status400BadRequest, 
                    errors = new { 
                        message = new[] {
                            new ExceptionHandler(ex,"usermanagement_list_no_data", _logService).GetMessage()
                        } 
                    } 
                }));
            }
        }

        private async Task<IEnumerable<UsersList>> GetUsersList(SqlConnection Connection, int Page, string? SearchText, string? SearchWith)
        {
            var procedure   = "user_list";
            var parameters  = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("SearchText", SearchText);
            parameters.Add("SearchWith", SearchWith);
            var usersList = await Connection.QueryAsync<UsersList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return usersList;
        }

        private async Task<int> GetUsersCount(SqlConnection Connection, int Page, string? SearchText, string? SearchWith)
        {
            var procedure   = "users_count";
            var parameters  = new DynamicParameters();
            parameters.Add("SearchText", SearchText);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("count")]
        public async Task<ActionResult<List<User>>> GetUserCount(int Page, string? Search, string? SearchWith)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
               
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                       totalRows = await GetUsersCount(Connection, Page, Search, SearchWith)
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
                            new ExceptionHandler(ex,"usermanagement_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize]
        [Route("profile")]
        public async Task<ActionResult<List<Profile>>> GetUserProfile()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure   = "user_profile";
                var parameters  = new DynamicParameters();
                parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var profile     = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new { 
                    status  = StatusCodes.Status200OK, 
                    data    = new { 
                        user = profile 
                    } 
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new { 
                    status = StatusCodes.Status400BadRequest, 
                    errors = new { 
                        message = new[] {
                            new ExceptionHandler(ex,"usermanagement_list_profile_not_found", _logService).GetMessage()
                        } 
                    } 
                }));
            }
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

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(UserBusinessFunctionCode.USER_MANAGE)]
        public async Task<ActionResult<UserUpdate>> UpdateUsers([FromForm] UserUpdate UserInfo)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                if(UserInfo.DocumentFile != null)
                {
                    // Delete old file if DocumentFile is provided 
                    if (UserInfo.DocumentUrl != null)
                    {
                        string configPath = _config.GetSection("UserDocuments:Path").Value;
                        string filePathToDelete = Path.Combine(configPath, Path.GetFileName(UserInfo.DocumentUrl));
                        System.IO.File.Delete(filePathToDelete);
                    }

                    string? fileName = UserInfo.EmployeeCode + Path.GetExtension(UserInfo.DocumentFile?.FileName);

                    UserInfo.DocumentUrl = _config.GetSection("UserDocuments:DownloadPath").Value + fileName;
                    await new FileController(_config).SaveUserDocument(UserInfo.DocumentFile, fileName);
                }

                //updating user
                var procedure   = "userinfo_update";
                var parameters  = new DynamicParameters();
                parameters.Add("UserInfoId", UserInfo.Id);
                parameters.Add("Fullname", UserInfo.FullName);
                parameters.Add("Email", UserInfo.Email);
                parameters.Add("Phone", UserInfo.Phone);
                parameters.Add("UserRoleRevoked", UserInfo.UserRoleRevoked);
                parameters.Add("UserRoles", UserInfo.UserRoles);
                parameters.Add("UserCategoryId", UserInfo.UserCategoryId);
                parameters.Add("TenantOfficeId", UserInfo.TenantOfficeId);
                parameters.Add("DepartmentId", UserInfo.DepartmentId);
                parameters.Add("DesignationId", UserInfo.DesignationId);
                parameters.Add("DivisionId", UserInfo.DivisionId);
                parameters.Add("BusinessUnits", UserInfo.BusinessUnits); 
                parameters.Add("BusinessUnitsRevoked", UserInfo.BusinessUnitsRevoked);
                parameters.Add("EngagementTypeId", UserInfo.EngagementTypeId);
                parameters.Add("ReportingManagerId", UserInfo.ReportingManagerId);
                parameters.Add("GenderId", UserInfo.GenderId);
                parameters.Add("EngineerCategory", UserInfo.EngineerCategory);
                parameters.Add("EngineerLevel", UserInfo.EngineerLevel);
                parameters.Add("EngineerType", UserInfo.EngineerType);
                parameters.Add("EngineerGeolocation", UserInfo.EngineerGeolocation);
                parameters.Add("EngineerAddress", UserInfo.EngineerAddress);
                parameters.Add("EngineerPincode", UserInfo.EngineerPincode);
                parameters.Add("EngineerStateId", UserInfo.EngineerStateId);
                parameters.Add("EngineerCityId", UserInfo.EngineerCityId);
                parameters.Add("EngineerCountryId", UserInfo.EngineerCountryId);
                parameters.Add("IsConcurrentLoginAllowed", UserInfo.IsConcurrentLoginAllowed);
                parameters.Add("BudgetedAmount", UserInfo.BudgetedAmount);
                parameters.Add("EndDate", UserInfo.EndDate);
                parameters.Add("StartDate", UserInfo.StartDate);
                parameters.Add("CustomerAgreedAmount", UserInfo.CustomerAgreedAmount);
                parameters.Add("CustomerSiteId", UserInfo.CustomerSiteId);
                parameters.Add("ContractId", UserInfo.ContractId);
                parameters.Add("DocumentUrl", UserInfo.DocumentUrl);
                parameters.Add("DocumentSize", UserInfo.DocumentFile != null ? UserInfo.DocumentFile.Length : UserInfo.DocumentSize);
                parameters.Add("UserGradeId", UserInfo.UserGradeId);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<UserUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new { 
                    status  = StatusCodes.Status200OK,
                    data= new
                    {
                        isUpdated = true
                    }
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new { 
                    status = StatusCodes.Status400BadRequest, 
                    errors = new { 
                        Message = new[] {                         
                            new ExceptionHandler(ex,"usermanagement_update_failed_message", _logService).GetMessage()
                        } 
                    } 
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("toggle/status")]
        [HasPermission(UserBusinessFunctionCode.USER_MANAGE)]
        public async Task<ActionResult<List<User>>> ToggleUserStatus(UserStatus UserStatus)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure   = "user_toggle_status";
                var parameters  = new DynamicParameters();
                parameters.Add("Id", UserStatus.Id);
                parameters.Add("LoggedUserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsActive", UserStatus.IsActive);
                connection.Query<UserUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new { 
                    status  = StatusCodes.Status200OK, 
                    data    = new { 
                        isUpdated = true 
                    } 
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new { 
                    status = StatusCodes.Status400BadRequest, 
                    errors = new { 
                        message = new[] {                            
                            new ExceptionHandler(ex,"usermanagement_update_status_failed_message", _logService).GetMessage()
                        } 
                    } 
                }));
            }
        }

        /// <summary>
        /// Get the last 10 records of the logged-in user
        /// </summary>
        /// Authorize(Policy = "userNotDisabled") TODO: delete this once policy is integrated
        [HttpGet,Authorize()]
        [Route("loginhistory")]
        public async Task<ActionResult<List<Profile>>> GetLoggedUserLoginHistory()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure       = "user_get_login_history";
                var parameters      = new DynamicParameters();
                parameters.Add("LoggedUserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var loginHistory    = await Connection.QueryAsync<UserLoginHistory>(procedure, parameters, commandType: CommandType.StoredProcedure);

                var response = new { 
                    status  = StatusCodes.Status200OK, 
                    data    = new { 
                        history = loginHistory 
                    } 
                };
                return Ok(JsonSerializer.Serialize(response));
            }
            catch (Exception ex)
            {
                var response = new { 
                    status = StatusCodes.Status400BadRequest, 
                    errors = new { 
                        Message = new[] {
                            new ExceptionHandler(ex,"usermanagement_list_no_data", _logService).GetMessage()
                        } 
                    } 
                };
                return BadRequest(JsonSerializer.Serialize(response));
            }
        }

        [HttpGet, Authorize()]
        [Route("userloginhistory")]
        public async Task<ActionResult<List<Profile>>> GetUserLoginHistory(int UserId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "user_get_login_history";
                var parameters = new DynamicParameters();
                parameters.Add("LoggedUserId",UserId);
                var loginHistory = await Connection.QueryAsync<UserLoginHistory>(procedure, parameters, commandType: CommandType.StoredProcedure);

                var response = new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        history = loginHistory
                    }
                };
                return Ok(JsonSerializer.Serialize(response));
            }
            catch (Exception ex)
            {
                var response = new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"usermanagement_list_no_data", _logService).GetMessage()
                        }
                    }
                };
                return BadRequest(JsonSerializer.Serialize(response));
            }
        }

        [HttpGet, Authorize()]
        [Route("passcodevaliditycheck")]
        public async Task<ActionResult<List<User>>> ValidateExpiry()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure   = "user_passcode_validate_expiry";
                var parameters  = new DynamicParameters();
                parameters.Add("LoggedUserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsPasscodeExpired", dbType: DbType.Int32, direction: ParameterDirection.Output);
                Connection.Query(procedure, parameters, commandType: CommandType.StoredProcedure);
                int IsPasscodeExpired = parameters.Get<int>("IsPasscodeExpired");

                return Ok(JsonSerializer.Serialize(new { 
                    status  = StatusCodes.Status200OK, 
                    data    = new { 
                        isExpired = Convert.ToBoolean(IsPasscodeExpired)
                    } 
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new { 
                    status = StatusCodes.Status400BadRequest, 
                    errors = new { 
                        User = new[] {
                            new ExceptionHandler(ex,"usermanagement_list_no_data", _logService).GetMessage()                           
                        } 
                    } 
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("changeuserpasscode")]
        [HasPermission(UserBusinessFunctionCode.USER_MANAGE)]
        public async Task<ActionResult<Object>> UserPasswordReset(ChangeUserPasscode ChangePasswordData)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {       
                var procedure = "user_passcode_is_in_recent_list";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", ChangePasswordData.UserId);
                IEnumerable<UserPasscodeHistory> recentPasscodes = await connection.QueryAsync<UserPasscodeHistory>(procedure, parameters, commandType: CommandType.StoredProcedure);
                foreach (var recentPasscode in recentPasscodes)
                {
                    bool isFound = VerifyPassCode(recentPasscode.Passcode, ChangePasswordData.NewPasscode);
                    if (isFound)
                    {
                        _logService.CreateAuthenticationLog(new AuthenticationLog()
                        {
                            LoggedUserId = Convert.ToInt32(User.Claims.Where(c => c.Type == "LoggedUserId").First().Value),
                            Browser = ChangePasswordData.Details.Browser,
                            TimeZone = ChangePasswordData.Details.TimeZone,
                            Locale = "",
                            Message = "user password change failed for the user since the password is in the recent list. " + ChangePasswordData.UserId
                        });
                        throw new CustomException("usermanagement_similar_password_message");
                    } 
                }

                procedure = "user_passcode_update";
                parameters = new DynamicParameters();
                parameters.Add("UserId", ChangePasswordData.UserId);
                parameters.Add("IsActive", ChangePasswordData.IsActive);
                parameters.Add("Passcode", CreateHashedPassCode(ChangePasswordData.NewPasscode));
                connection.Query<PasscodeUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);

                procedure = "user_profile";
                parameters = new DynamicParameters();
                parameters.Add("UserInfoId",ChangePasswordData.UserId);
                var profile = connection.QuerySingle<Profile>(procedure, parameters, commandType: CommandType.StoredProcedure);
                if (!string.IsNullOrEmpty(profile.Email))
                {
                    var mail = new EmailDto
                    {
                        To = profile.Email,
                        Subject = "Password Changed"
                    };
                   // string template = System.IO.File.ReadAllText(@"./EmailTemplates/PasswordChangedSuccessfully.html");
                    string templatePath = Path.Combine(_hostingEnvironment.ContentRootPath, "EmailTemplates", "PasswordChangedSuccessfully.html");
                    string template = "";
                    if (System.IO.File.Exists(templatePath))
                    {
                        template = System.IO.File.ReadAllText(templatePath);
                    }
                    mail.Body = string.Format(template, profile.FullName);
                    await _jobQueueHelper.AddMailToJobQueue(mail);
                }

                _logService.CreateAuthenticationLog(new AuthenticationLog()
                {
                    LoggedUserId = Convert.ToInt32(User.Claims.Where(c => c.Type == "LoggedUserId").First().Value),
                    Browser = ChangePasswordData.Details.Browser,
                    TimeZone = ChangePasswordData.Details.TimeZone,
                    IpAddress = ChangePasswordData.Details.IpAddress,
                    Locale = "",
                    Message = "User password update Success",
                });

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPasswordUpdated = true
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
                          new ExceptionHandler(ex,"usermanagement_password_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private bool VerifyPassCode(string hasedPassCode, string password)
        {
            var passwordAndHash = hasedPassCode.Split(':');
            if (passwordAndHash == null || passwordAndHash.Length != 2)
            {
                return false;
            }
            byte[] salt = Convert.FromBase64String(passwordAndHash[1]);
            byte[] hashedPassword = KeyDerivation.Pbkdf2(password: password, salt: salt, prf: KeyDerivationPrf.HMACSHA256, iterationCount: 100000, numBytesRequested: 256 / 8);
            return (hashedPassword.SequenceEqual(Convert.FromBase64String(passwordAndHash[0]))) ? true : false;
        }

        [HttpGet,Authorize()]
        [Route("get/details")]
        //[HasPermission(UserBusinessFunctionCode.USER_MANAGE)]
        public async Task<ActionResult<List<SelectedUser>>> GetProfileDetails(int UserId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "selected_user_profile";
                var parameters = new DynamicParameters();
                parameters.Add("@UserId", UserId);
                var userInfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        UserDetails = userInfo
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
                            new ExceptionHandler(ex,"usermanagement_list_profile_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("getuserbyrole")]
        public async Task<ActionResult> GetMarketingExicutives(int TenantOfficeId, string Role)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "user_get_by_roles";
                var parameters = new DynamicParameters();
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("Role", Role);
                var roleusers = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { Roleusers = roleusers } };
                return Ok(JsonSerializer.Serialize(response));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"usermanagement_list_no_data", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }


        [HttpGet]
        [Route("status")]
        public async Task<ActionResult> GetUserStatus(int UserId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "user_status";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", UserId);
                var status = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        UserStatus = status
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
                            new ExceptionHandler(ex,"usermanagement_list_status_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("profile/details")]
        public async Task<ActionResult<List<Profile>>> GetUserProfileDetails()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "selected_user_profile";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var profile = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        UserDetails = profile
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
                            new ExceptionHandler(ex,"usermanagement_list_profile_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("details")]
        //[HasPermission(UserBusinessFunctionCode.USER_MANAGE)]
        public async Task<ActionResult> GetUserDetails(int UserId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "selected_user_details";
                var parameters = new DynamicParameters();
                parameters.Add("@UserId", UserId);
                var userDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                       UserDetails = userDetails
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
        [HttpGet]
        [Route("selected/roles")]
        public async Task<ActionResult> GetSelectedUserRoles(int UserId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "selected_user_roles";
                var parameters = new DynamicParameters();
                parameters.Add("@UserId", UserId);
                var userroles = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                string userRolesString = string.Join(",", userroles.Select(x => x.UserRoles));
                string rolesString = string.Join(",", userroles.Select(x => x.RoleNames));

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        SelectedUserRoles = new[] { new { UserRoles = userRolesString, RoleNames = rolesString } }
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
                            new ExceptionHandler(ex,"usermanagement_list_no_data", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("managers")]
        public async Task<ActionResult> GetManagersList()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "managers_list";
                var parameters = new DynamicParameters();
                var managers = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { Managers = managers } };
                return Ok(JsonSerializer.Serialize(response));
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

        [HttpGet]
        [Route("names")]
        public async Task<ActionResult> GetUsersName()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "user_get_names";
                var parameters = new DynamicParameters();
                var usernames = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { UsersNames = usernames } };
                return Ok(JsonSerializer.Serialize(response));
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

        [HttpGet]
        [Route("allnames")]
        public async Task<ActionResult> GetAllUsersName()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "user_get_all_names";
                var parameters = new DynamicParameters();
                var usernames = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { UsersNames = usernames } };
                return Ok(JsonSerializer.Serialize(response));
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

        [HttpGet]
        [Route("region/tenantoffice/list")]
        public async Task<ActionResult> GetUserRegionTenantOfficeList()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "user_region_tenant_office_list";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var tenantOfficeName = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantOfficeName = tenantOfficeName
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
        [HttpGet]
        [Route("category/tenantoffice/list")]
        public async Task<ActionResult> GetUserCategoryTenantOfficeList()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "user_category_tenant_office_list";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var tenantOfficeName = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantOfficeName = tenantOfficeName
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

        [HttpGet, Authorize()]
        [Route("category/filtered/tenantoffice/list")]
        public async Task<ActionResult> GetUserCategoryFilteredTenantOfficeList(string UserCategoryCode)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "filtered_user_category_tenant_office_list";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("UserCategoryCode", UserCategoryCode);
                var tenantOfficeName = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure); return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantOfficeName = tenantOfficeName
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
                            new ExceptionHandler(ex,"state_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("usersloginhistory")]
        public async Task<ActionResult<List<UsersLoginHistoryList>>> GetAllUsersLoginHistory(int Page,int? userId, string? dateFrom, string? dateTo)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                int TotalRows = await GetUsersLoginHistoryCount(Connection, userId, dateFrom, dateTo);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                var procedure = "loginhistory_list";
                var parameters = new DynamicParameters();
                parameters.Add("Page", Page);
                parameters.Add("UserId", userId);
                parameters.Add("DateFrom", dateFrom);
                parameters.Add("DateTo", dateTo);
                var loginDetails = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        usersLoginHistory = loginDetails,
                        currentPage = Page,
                        totalRows = TotalRows,
                        perPage = perPage
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
                            new ExceptionHandler(ex,"userloginhistory_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<int> GetUsersLoginHistoryCount(SqlConnection Connection, int? userId, string? dateFrom, string? dateTo)
        {
            var procedure = "loginhistory_count";
            var parameters = new DynamicParameters();
            parameters.Add("UserId", userId);
            parameters.Add("DateFrom", dateFrom);
            parameters.Add("DateTo", dateTo);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpGet,Authorize()]
        [Route("loginhistory/download")]
        [HasPermission(UserBusinessFunctionCode.ALL_USER_LOGIN_HISTORY)]
        public async Task<ActionResult> DownloadLoginHistory(string? TimeZone, int? userId, string? dateFrom, string? dateTo)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "userloginhistory_list_download";
                var parameters = new DynamicParameters();
                parameters.Add("TimeZone", TimeZone);
                parameters.Add("UserId", userId);
                parameters.Add("DateFrom", dateFrom);
                parameters.Add("DateTo", dateTo);
                var logindetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var headers = new Dictionary<string, string>()
                {
                    { "EmployeeName", "Employee Name" },
                    { "EmployeeCode", "User ID" },
                    {"Designation","Designation"},
                    {"Location","Location"},
                    {"LoginDate", "Login Date"},
                    {"LoggedOutOn","Logout Time" }
                };

                var records = new List<object[]>();
                foreach (var history in logindetails)
                {
                    var dictionaryPart = (IDictionary<string, object>)history;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryPart[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "userloginhistory_list.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"part_list_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize]
        [Route("location/details/for/report")]
        public async Task<ActionResult> GetUserLocationInfo()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "userinfo_location_details_for_report";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var locationinfo = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        userLocationInfo = locationinfo.FirstOrDefault()
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
                            new ExceptionHandler(ex,"user_location_info_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("categorywise/se/list")]
        public async Task<ActionResult> GetServiceEngineersCategoryWiseList()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "userinfo_usercategory_wise_servicengineers_names";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var selist = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { ServiceEngineers = selist } };
                return Ok(JsonSerializer.Serialize(response));
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

        [HttpGet]
        [Route("regionwise/se/list")]
        public async Task<ActionResult> GetServiceEngineersRegionWiseList()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "userinfo_serviceengineers_names_by_region";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var selist = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { ServiceEngineers = selist } };
                return Ok(JsonSerializer.Serialize(response));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"usermanagement_service_engineers_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("delete")]
        [HasPermission(UserBusinessFunctionCode.USER_MANAGE)]
        public async Task<object> DeleteMultipleUsers(usersStatusUpdate usersId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "user_delete";
                var parameters = new DynamicParameters();
                parameters.Add("UserIdList", usersId.useridList);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

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
                           new ExceptionHandler(ex,"delete_users_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("passcode/expiry/notice")]
        public async Task<ActionResult<List<User>>> UserPasscodeExpiryNotice()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "userlogin_passcode_expiry_notice";
                var parameters = new DynamicParameters();
                parameters.Add("LoggedUserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var expiryinfo = Connection.Query(procedure, parameters, commandType: CommandType.StoredProcedure);
                
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ExpiryInfo = expiryinfo.FirstOrDefault()
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
                        User = new[] {
                            new ExceptionHandler(ex,"usermanagement_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        
        [HttpPost, Authorize()]
        [Route("disble/status")]
        [HasPermission(UserBusinessFunctionCode.USER_MANAGE)]
        public async Task<ActionResult> DisableMultipleUsers(usersStatusUpdate UserStatus)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bulk_user_disable";
                var parameters = new DynamicParameters();
                parameters.Add("UserIdList", UserStatus.useridList);
                parameters.Add("LoggedUserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                connection.Query<usersStatusUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsDisabled = true
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
                            new ExceptionHandler(ex,"usermanagement_update_status_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        
        [HttpGet]
        [Route("selected/businessunits")]
        public async Task<ActionResult> GetSelectedBusinessUnits(int UserId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "selected_business_units";
                var parameters = new DynamicParameters();
                parameters.Add("@UserId", UserId);
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

        [HttpGet]
        [Route("contractwise/customersite/list")]
        public async Task<ActionResult> GetContractWiseCustomerSiteList(int ContractId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customer_site_names_contractid_wise";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var customerSite = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CustomerSite = customerSite
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
                            new ExceptionHandler(ex,"customersite_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}