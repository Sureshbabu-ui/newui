using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/notificationsetting")]
    [ApiController]
    public class NotificationSettingController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public NotificationSettingController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("get/eventwiselist")]
        public async Task<object> GetEventWiseList(string BusinessEventId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "notificationsetting_eventwise_list";
                var parameters = new DynamicParameters();
                parameters.Add("BusinessEventId", BusinessEventId);
                var eventWiseList = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { NotificationList = eventWiseList } };
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
                            new ExceptionHandler(ex,"eventwise_view_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/rolewiselist")]
        public async Task<object> GetGroupWiseList(string RoleId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "notificationsetting_rolewise_list";
                var parameters = new DynamicParameters();
                parameters.Add("RoleId", RoleId);
                var groupWiseList = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { NotificationList = groupWiseList } };
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
                            new ExceptionHandler(ex,"eventwise_view_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("update")]
        public async Task<object> updateEventWiseNotifications(NotificationSettingUpdateList NotificationSettings)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "notificationsetting_update";
                var parameters = new DynamicParameters();
                parameters.Add("NotificationSettings", JsonSerializer.Serialize(NotificationSettings.NotificationSettings));
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsNotificationUpdated = true
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
                            new ExceptionHandler(ex,"eventwise_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}