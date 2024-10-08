using BeSureApi.Exceptions;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Services.LogService;

namespace BeSureApi.Controllers
{
    [Route("api/sla")]
    [ApiController]
    public class SlaDetailsController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public SlaDetailsController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpGet]
        [Route("details")]
        public async Task<ActionResult> GetSlaDetails(int AssetId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "sla_details";
                var parameters = new DynamicParameters();
                parameters.Add("AssetId", AssetId);
                var slaDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        SlaDetails = slaDetails.First()
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
                            new ExceptionHandler(ex,"servicerequest_sladetails_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
