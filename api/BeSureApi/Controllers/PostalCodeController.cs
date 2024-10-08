using BeSureApi.Exceptions;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using BeSureApi.Services.LogService;

namespace BeSureApi.Controllers
{
    [Route("api/postalcode")]
    [ApiController]
    public class PostalCodeController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogService _logService;

        public PostalCodeController(IConfiguration configuration,ILogService logService)
        {
            _configuration = configuration;
            _logService = logService;
        }

        [HttpGet]
        [Route("get/filtered/list")]
        public async Task<ActionResult> GetFilteredPostalCodeList(string Pincode)
        {
            using var Connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "postalcode_filtered_list";
                var parameters = new DynamicParameters();
                parameters.Add("Pincode", Pincode);
                var postalCodeList = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PostalCodeList = postalCodeList
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
                            new ExceptionHandler(ex,"postalcode_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
