using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BeSureApi.Controllers
{
    [Route("api/appsetting")]
    [ApiController]
    public class AppSettingController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public AppSettingController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("get/details")]
        public async Task<ActionResult> GetAppSettingDetails(string AppkeyName)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "appsettings_get_details";
                var parameters = new DynamicParameters();
                parameters.Add("AppkeyName", AppkeyName);
                var appkeyvalues = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { AppKeyValues = appkeyvalues.First() } };
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
                            new ExceptionHandler(ex,"appsettings_details_no_records_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list")]
        public async Task<ActionResult> GetAppSettingList()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "appsetting_list";
                var parameters = new DynamicParameters();
                var appSettingList = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { AppSettings = appSettingList } };
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
                            new ExceptionHandler(ex,"appsettings_details_no_records_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPut]
        [Route("update")]
        public async Task<object> UpdateAppSetting(AppSettingUpdate AppSetting)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "appsetting_update";
                var parameters = new DynamicParameters();
                parameters.Add("AppKey", AppSetting.AppKey);
                parameters.Add("AppValue", AppSetting.AppValue);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                connection.Query<AppSettingUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        isUpdated =true
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
                            new ExceptionHandler(ex,"appsettings_update_failed_message", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }
    }
}
