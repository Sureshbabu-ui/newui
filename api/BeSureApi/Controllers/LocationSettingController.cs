using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/locationsetting")]
    [ApiController]
    public class LocationSettingController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public LocationSettingController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("details")]
        public async Task<object> GetLoacationSettingDetails(int LocationId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "locationsetting_details";
                var parameters = new DynamicParameters();
                parameters.Add("LocationId",LocationId);
                var locationSettingDetails = await Connection.QueryAsync<LocationSettingDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                       // Id = locationSettingDetails.First().Id,

                        LocationSetting = locationSettingDetails.First(),
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
                            new ExceptionHandler(ex,"location_setting_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        public async Task<object> UpdateLocationSetting(LocationSettingCreate LocationSetting)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "locationsetting_update";
                var parameters = new DynamicParameters();
                parameters.Add("LocationSettingId", LocationSetting.Id);
                parameters.Add("LocationId", LocationSetting.LocationId);
                parameters.Add("LastSaleInvoiceNumber", LocationSetting.LastSaleInvoiceNumber);
                parameters.Add("LastAmcInvoiceNumber", LocationSetting.LastAmcInvoiceNumber);
                parameters.Add("LastContractNumber", LocationSetting.LastContractNumber);
                parameters.Add("LastPaidJobInvoiceNumber", LocationSetting.LastPaidJobInvoiceNumber);
                parameters.Add("LastReceiptNumber", LocationSetting.LastReceiptNumber);
                parameters.Add("LastWorkOrderNumber", LocationSetting.LastWorkOrderNumber);
                parameters.Add("IsLocationSettingUpdated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                connection.Query<LocationSettingCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        isUpdated = true
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
                            new ExceptionHandler(ex,"location_setting_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
