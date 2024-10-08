using BeSureApi.Exceptions;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Services.LogService;
using Microsoft.AspNetCore.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/gst")]
    [ApiController]
    public class GstRateController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public GstRateController(IConfiguration config, ILogService logService) 
        {
            _config = config;
            _logService = logService;
        }  
        [HttpGet,Authorize()]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.GSTRATE_VIEW)]
        public async Task<ActionResult> GetGstRateList(string? search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "gstrate_list";
                var parameters = new DynamicParameters();
                parameters.Add("@Search", search);
                var gstRateList = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { GstRateList = gstRateList } };
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
                            new ExceptionHandler(ex,"gstrate_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.GSTRATE_MANAGE)]
        public async Task<object> UpdateGstRate(GstRateUpdate gstRate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "gstrate_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", gstRate.Id);
                parameters.Add("TenantServiceName", gstRate.TenantServiceName);
                parameters.Add("ServiceAccountDescription", gstRate.ServiceAccountDescription);
                parameters.Add("Sgst", gstRate.Sgst);
                parameters.Add("Igst", gstRate.Igst);
                parameters.Add("Cgst", gstRate.Cgst);
                parameters.Add("IsActive", gstRate.IsActive);
                await connection.QueryAsync<PaymentFrequency>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsGstUpdated = true
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
                            new ExceptionHandler(ex,"gstrate_update_failed_message", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }
    }
}
