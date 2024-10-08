using BeSureApi.Models;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.IO;
using BeSureApi.Exceptions;
using Microsoft.Extensions.Hosting.Internal;
using Microsoft.AspNetCore.Hosting.Server;
using System.Runtime.ConstrainedExecution;
using System;
using BeSureApi.Services.LogService;
using Org.BouncyCastle.Crypto;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Helpers;

namespace BeSureApi.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly JobQueueHelper _jobQueueHelper;
        public LoginController(IConfiguration config, ILogService logService, IWebHostEnvironment hostingEnvironment)
        {
            _config = config;
            _logService = logService;
            _hostingEnvironment = hostingEnvironment;
            _jobQueueHelper = new JobQueueHelper(config);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="LoginCredentials"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<Object>> AuthenticateUser(Credentials LoginCredentials)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "user_login";
                var parameters = new DynamicParameters();
                parameters.Add("Username", LoginCredentials.EmployeeCode);
                var userLogin = connection.QuerySingle<UserLogin>(procedure, parameters, commandType: CommandType.StoredProcedure);
                //Restricting access to mobesure for only service engineers
                var originUrl = "";
                if (Request.Headers.TryGetValue("Origin", out var origin))
                {
                    originUrl = origin.ToString();
                }
                if (originUrl == _config.GetSection("MoBeSure:Origin").Value && userLogin.HasServiceEngineerRole == false)
                {
                    throw new CustomException("No access");
                }else if (originUrl == _config.GetSection("BeSure:Origin").Value && userLogin.HasBesurePermission == false)
                {
                    throw new CustomException("No access");
                }
                if (userLogin.IsActive == 0 || userLogin.IsUserExpired)
                {
                    _logService.CreateAuthenticationLog(new AuthenticationLog()
                    {
                        LoggedUserId = userLogin.Id,
                        Browser = LoginCredentials.Details.Browser,
                        TimeZone = LoginCredentials.Details.TimeZone,
                        IpAddress = LoginCredentials.Details.IpAddress,
                        Locale = "",
                        Message = "incorrect password and account blocked",
                    });
                    throw new CustomException("login_api_login_failed_message");
                }
                bool isAuthenticated = VerifyPassCode(userLogin.Passcode, LoginCredentials.Passcode);
                if (!isAuthenticated)
                {
                    int failedAttempts = 1;
                    failedAttempts += userLogin.TotalFailedLoginAttempts;
                    if (failedAttempts == Convert.ToInt16(_config.GetSection("Configuration:MaxFailedLoginAttempts").Value))
                    {
                        UpdateUserLogin(connection, userLogin.Id, failedAttempts, 0);
                        _logService.CreateAuthenticationLog(new AuthenticationLog()
                        {
                            LoggedUserId = userLogin.Id,
                            Browser = LoginCredentials.Details.Browser,
                            TimeZone = LoginCredentials.Details.TimeZone,
                            IpAddress = LoginCredentials.Details.IpAddress,
                            Locale = "",
                            Message = "incorrect password and account blocked",
                        });
                        throw new CustomException("login_api_authenticate_failed_message");
                    }
                    else
                    {
                        UpdateUserLogin(connection, userLogin.Id, failedAttempts, 1);
                        _logService.CreateAuthenticationLog(new AuthenticationLog()
                        {
                            LoggedUserId = userLogin.Id,
                            Browser = LoginCredentials.Details.Browser,
                            TimeZone = LoginCredentials.Details.TimeZone,
                            IpAddress = LoginCredentials.Details.IpAddress,
                            Locale = "",
                            Message = "Incorrect password login",
                        });
                        throw new Exception();
                    }
                }

                // logged in user details
                procedure = "userinfo_details";
                parameters = new DynamicParameters();
                parameters.Add("EmployeeCode", LoginCredentials.EmployeeCode);
                var userInfo = connection.QuerySingle<UserInfo>(procedure, parameters, commandType: CommandType.StoredProcedure);

                if(userInfo.IsPasscodeExpired == false) { 
                    if (userLogin.TotalFailedLoginAttempts != 0)
                    {
                        UpdateUserLogin(connection, userLogin.Id, 0, 1);
                    }

                    var token = CreateToken(userInfo.Id,userInfo.CurrentTokenVersion+1);
                    // add login details to history table and log file
                    procedure = "user_create_login_history";
                    parameters = new DynamicParameters();
                    parameters.Add("UserId", userInfo.Id);
                    parameters.Add("TokenVersion", userInfo.CurrentTokenVersion+1);
                    parameters.Add("ClientInfo", JsonSerializer.Serialize(LoginCredentials.Details));
                    parameters.Add("LoginTime", dbType: DbType.DateTime, direction: ParameterDirection.Output);
                    await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                    DateTime loginTime = parameters.Get<DateTime>("LoginTime");
                    _logService.CreateAuthenticationLog(new AuthenticationLog()
                    {
                        LoggedUserId = userLogin.Id,
                        Browser = LoginCredentials.Details.Browser,
                        TimeZone = LoginCredentials.Details.TimeZone,
                        IpAddress = LoginCredentials.Details.IpAddress,
                        Locale = "",
                        Message = "User Successfully Logged In",
                    });
                    //update last login field in UserLogin
                    procedure = "update_last_login";
                    parameters = new DynamicParameters();
                    parameters.Add("UserId", userInfo.Id);
                    await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                    return Ok(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status200OK,
                        data = new
                        {
                            Token = token,
                            IsLoggedIn = isAuthenticated
                        }
                    }));
                }
                else
                {
                    var Code = RandomCode();
                    procedure = "forgot_passcode_create_reset_code";
                    parameters = new DynamicParameters();
                    parameters.Add("UserId", userInfo.Id);
                    parameters.Add("ResetCode", Code);
                    parameters.Add("ExpiryTime", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    connection.Query<int>(procedure, parameters, commandType: CommandType.StoredProcedure);
                    int expiryTime = parameters.Get<int>("ExpiryTime");

                    return BadRequest(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status401Unauthorized,
                        errors = new
                        {
                            Message = new[]
                            {
                                $"{Code}//{LoginCredentials.EmployeeCode}"
                            },
                        },
                        IsPasswordExpired = true
                    }));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                          new ExceptionHandler(ex, "login_api_invalid_credentials_message", _logService).GetMessage()
                        },
                    }
                }));
            }
        }

        private string CreateToken(int LoggedUserId, int TokenVersion)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim("LoggedUserId", LoggedUserId.ToString()),
                new Claim("TokenVersion",TokenVersion.ToString())
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(claims: claims, expires: DateTime.Now.AddDays(1), signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private bool VerifyPassCode(string hasedPassCode, string password)
        {
            // retrieve both salt and password from 'hashedPasswordWithSalt'
            var passwordAndHash = hasedPassCode.Split(':');
            if (passwordAndHash == null || passwordAndHash.Length != 2)
            {
                return false;
            }
            byte[] salt = Convert.FromBase64String(passwordAndHash[1]);
            byte[] hashedPassword = KeyDerivation.Pbkdf2(password: password, salt: salt, prf: KeyDerivationPrf.HMACSHA256, iterationCount: 100000, numBytesRequested: 256 / 8);
            return (hashedPassword.SequenceEqual(Convert.FromBase64String(passwordAndHash[0]))) ? true : false;
        }

        private void UpdateUserLogin(SqlConnection Connection, int UserLoginId, int Attempts, int IsActive)
        {
            var procedure = "user_login_failed_attempts_count";
            var parameters = new DynamicParameters();
            parameters.Add("UserLoginId", UserLoginId);
            parameters.Add("Attempts", Attempts);
            parameters.Add("IsActive", IsActive);
            Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

        [HttpPost]
        [Route("forgot")]

        public async Task<ActionResult<Object>> ForgotPassword(ForgotPasscode Forgotpassword)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "user_get_details";
                var parameters = new DynamicParameters();
                parameters.Add("EmployeeCode", Forgotpassword.EmployeeCode);
                var user = connection.QuerySingle(procedure, parameters, commandType: CommandType.StoredProcedure);

                // user found
                int isCodeCreated = 0;
                if (user != null)
                {
                    var Code = RandomCode();
                    procedure = "forgot_passcode_create_reset_code";
                    parameters = new DynamicParameters();
                    parameters.Add("UserId", user.Id);
                    parameters.Add("ResetCode", Code);
                    parameters.Add("ExpiryTime", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    connection.Query<int>(procedure, parameters, commandType: CommandType.StoredProcedure);
                    int expiryTime = parameters.Get<int>("ExpiryTime");

                    var mail = new EmailDto()
                    {
                        To = user.Email,
                        Subject = "Your Passcode Reset Code Is",
                    };

                    //string template = System.IO.File.ReadAllText(@"./EmailTemplates/ForgotPassword.html");
                    string templatePath = Path.Combine(_hostingEnvironment.ContentRootPath, "EmailTemplates", "ForgotPassword.html");
                    string template = "";
                    if (System.IO.File.Exists(templatePath))
                    {
                        template = System.IO.File.ReadAllText(templatePath);
                    }
                    mail.Body = string.Format(template, Code, expiryTime);
                    await _jobQueueHelper.AddMailToJobQueue(mail);
                }

                _logService.CreateAuthenticationLog(new AuthenticationLog()
                {
                    LoggedUserId = user != null ? user.Id : "",
                    Browser = Forgotpassword.Details.Browser,
                    TimeZone = Forgotpassword.Details.TimeZone,
                    IpAddress = Forgotpassword.Details.IpAddress,
                    Locale = "",
                    Message = (user != null) ? "Forgot passcode code successfully sented to email" : "Forgot passcode try to code generate with invalid email",
                }); ;

                // regardless of the existence of the given email, this function always return true
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCodeGenerated = true
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
                          new ExceptionHandler(ex, "login_api_forgot_password_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private int RandomCode()
        {
            Random generator = new Random();
            int r = generator.Next(100000, 1000000);
            return r;
        }

        [HttpPost]
        [Route("verifycode")]
        public async Task<ActionResult<Object>> VerifyCode(CodeVerification VerificationDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "forgot_passcode_verify_reset_code";
                var parameters = new DynamicParameters();
                parameters.Add("EmployeeCode", VerificationDetails.EmployeeCode);
                parameters.Add("Code", VerificationDetails.Code);
                parameters.Add("IsValid", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("IsExpired", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                connection.Query<int>(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isValid = parameters.Get<bool>("IsValid");
                bool isExpired = parameters.Get<bool>("IsExpired");
                _logService.CreateAuthenticationLog(new AuthenticationLog()
                {
                    LoggedUserId = 0,
                    Browser = VerificationDetails.Details.Browser,
                    TimeZone = VerificationDetails.Details.TimeZone,
                    IpAddress = VerificationDetails.Details.IpAddress,
                    Locale = "",
                    Message = (!isValid) ? "Code verification in forgot password failed with " + VerificationDetails.EmployeeCode : "Code verification in forgot password success with " + VerificationDetails.EmployeeCode
                });
                // verification failed
                if (!isValid)
                {
                    throw new CustomException("login_api_invalid_otp");
                }
                if (isValid && isExpired)
                {
                    throw new CustomException("login_api_invalid_otp_expired");
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsVerified = true
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
                          new ExceptionHandler(ex,"login_api_invalid_code_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut]
        [Route("changepassword")]
        public async Task<ActionResult<List<User>>> UpdatePassword(PasscodeUpdate Updatepasscode)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "forgot_passcode_validate_reset_code";
                var parameters = new DynamicParameters();
                parameters.Add("EmployeeCode", Updatepasscode.EmployeeCode);
                parameters.Add("Code", Updatepasscode.Code);
                parameters.Add("IsCodeValid", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync<PasscodeUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isCodeValid = parameters.Get<int>("IsCodeValid");
                if (isCodeValid == 0)
                {
                    _logService.CreateAuthenticationLog(new AuthenticationLog()
                    {
                        LoggedUserId = 0,
                        Browser = Updatepasscode.Details.Browser,
                        TimeZone = Updatepasscode.Details.TimeZone,
                        IpAddress = Updatepasscode.Details.IpAddress,
                        Locale = "",
                        Message = "forgot password, password update failed with " + Updatepasscode.EmployeeCode
                    });
                    throw new Exception();
                }

                procedure = "passcode_is_in_recent_list";
                parameters = new DynamicParameters();
                parameters.Add("EmployeeCode", Updatepasscode.EmployeeCode);
                IEnumerable<UserPasscodeHistory> recentPasscodes = await connection.QueryAsync<UserPasscodeHistory>(procedure, parameters, commandType: CommandType.StoredProcedure);
                foreach (var recentPasscode in recentPasscodes)
                {
                    bool isFound = VerifyPassCode(recentPasscode.Passcode, Updatepasscode.Passcode);
                    if (isFound)
                    {
                        _logService.CreateAuthenticationLog(new AuthenticationLog()
                        {
                            LoggedUserId = 0,
                            Browser = Updatepasscode.Details.Browser,
                            TimeZone = Updatepasscode.Details.TimeZone,
                            IpAddress = Updatepasscode.Details.IpAddress,
                            Locale = "",
                            Message = "forgot password, password update failed by using recent password with " + Updatepasscode.EmployeeCode
                        });
                        throw new CustomException("forgotpassword_similar_password_message");
                    }
                }

                procedure = "user_get_details";
                parameters = new DynamicParameters();
                parameters.Add("EmployeeCode", Updatepasscode.EmployeeCode);
                var user = connection.QuerySingle(procedure, parameters, commandType: CommandType.StoredProcedure);

                // update passcode
                procedure = "passcode_update";
                parameters = new DynamicParameters();
                parameters.Add("EmployeeCode", Updatepasscode.EmployeeCode);
                parameters.Add("Code", Updatepasscode.Code);
                parameters.Add("Passcode", CreateHashedPassCode(Updatepasscode.Passcode));
                parameters.Add("IsPasscodeUpdated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                connection.Query<PasscodeUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isPasscodeUpdated = parameters.Get<int>("IsPasscodeUpdated");
                if (isPasscodeUpdated == 1)
                {
                    var mail = new EmailDto()
                    {
                        To = user.Email,
                        Subject = "Password Changed"
                    };
                    // string template = System.IO.File.ReadAllText(@"./EmailTemplates/PasswordChangedSuccessfully.html");
                    string templatePath = Path.Combine(_hostingEnvironment.ContentRootPath, "EmailTemplates", "PasswordChangedSuccessfully.html");
                    string template = "";
                    if (System.IO.File.Exists(templatePath))
                    {
                        template = System.IO.File.ReadAllText(templatePath);
                    }
                    string body =
                    mail.Body = string.Format(template, user.FullName);
                    await _jobQueueHelper.AddMailToJobQueue(mail);
                }
                _logService.CreateAuthenticationLog(new AuthenticationLog()
                {
                    LoggedUserId = 0,
                    Browser = Updatepasscode.Details.Browser,
                    TimeZone = Updatepasscode.Details.TimeZone,
                    IpAddress = Updatepasscode.Details.IpAddress,
                    Locale = "",
                    Message = "Password update success with " + Updatepasscode.EmployeeCode
                });

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPasswordUpdated = Convert.ToBoolean(isPasscodeUpdated)
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
                          new ExceptionHandler(ex,"forgotpassword_update_password_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        // Password Change After Login

        [HttpPut, Authorize()]
        [Route("resetpasscode")]
        public async Task<ActionResult<Object>> PasswordReset(PasscodeReset ChangePasswordData)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                // validate old password
                var procedure = "user_passcode";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var userLogin = connection.QuerySingle<UserLogin>(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isAuthenticated = VerifyPassCode(userLogin.Passcode, ChangePasswordData.OldPasscode);
                if (!isAuthenticated)
                {
                    _logService.CreateAuthenticationLog(new AuthenticationLog()
                    {
                        LoggedUserId = userLogin.Id,
                        Browser = ChangePasswordData.Details.Browser,
                        TimeZone = ChangePasswordData.Details.TimeZone,
                        IpAddress = ChangePasswordData.Details.IpAddress,
                        Locale = "",
                        Message = "Self password update failed",
                    });
                    throw new CustomException("changepassword_mismatch_message");
                }

                procedure = "passcode_is_in_recent_list";
                parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                IEnumerable<UserPasscodeHistory> recentPasscodes = await connection.QueryAsync<UserPasscodeHistory>(procedure, parameters, commandType: CommandType.StoredProcedure);
                foreach (var recentPasscode in recentPasscodes)
                {
                    bool isFound = VerifyPassCode(recentPasscode.Passcode, ChangePasswordData.NewPasscode);
                    if (isFound)
                    {
                        _logService.CreateAuthenticationLog(new AuthenticationLog()
                        {
                            LoggedUserId = userLogin.Id,
                            Browser = ChangePasswordData.Details.Browser,
                            TimeZone = ChangePasswordData.Details.TimeZone,
                            Locale = "",
                            Message = "self password change failed for the user since the password is in the recent list. " + User.Claims.Where(c => c.Type == "LoggedUserId").First().Value
                        });
                        throw new CustomException("changepassword_similar_password_message");
                    }
                }

                procedure = "passcode_update";
                parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("Passcode", CreateHashedPassCode(ChangePasswordData.NewPasscode));
                parameters.Add("IsPasscodeUpdated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                connection.Query<PasscodeUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                //TODO: Value of IsPasswordUpdated should be fetched from stored procedure

                procedure = "user_profile";
                parameters = new DynamicParameters();
                parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
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
                    LoggedUserId = userLogin.Id,
                    Browser = ChangePasswordData.Details.Browser,
                    TimeZone = ChangePasswordData.Details.TimeZone,
                    IpAddress = ChangePasswordData.Details.IpAddress,
                    Locale = "",
                    Message = "Self password update Success",
                });

                //TODO: isSuccess should be changed to IsPasswordUpdated
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPasswordUpdated = isAuthenticated
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
                          new ExceptionHandler(ex,"changepassword_update_password_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private string CreateHashedPassCode(string PassCode)
        {
            byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);
            // divide by 8 to convert bits to bytes
            // derive a 256-bit subkey (use HMACSHA256 with 100,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: PassCode!,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));
            return $"{hashed}:{Convert.ToBase64String(salt)}";
        }
        //Deactivating inactive users

        [HttpGet]
        [Route("disableinactiveusers")]
        public async Task<ActionResult> DisableInactiveUsers()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "userlogin_disable_inactive_users";
                await connection.QueryAsync<PasscodeUpdate>(procedure, commandType: CommandType.StoredProcedure);

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
                          new ExceptionHandler(ex,"login_api_deactivation_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("logout")]
        public async Task<object> LogoutUser()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "user_logout";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("TokenVersion", int.Parse(User.Claims.Where(c => c.Type == "TokenVersion").First().Value));
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsLoggedOut = Convert.ToBoolean(true)
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
                            new ExceptionHandler(ex,"user_logout_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("disable/expired/users")]
        public async Task<ActionResult> DisableExpiredUsers()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "userlogin_disable_expired_users";
                await connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

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
                          new ExceptionHandler(ex,"expired_user_deactivation_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}