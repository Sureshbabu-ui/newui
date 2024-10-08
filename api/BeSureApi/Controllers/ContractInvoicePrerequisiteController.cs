using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace BeSureApi.Controllers
{
    [Route("api/contractinvoiceprerequisite")]
    [ApiController]
    public class ContractInvoicePrerequisiteController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ContractInvoicePrerequisiteController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("get/all")]
        public async Task<ActionResult> GetInvoicePrerequisites(int ContractId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_invoice_prerequisite_list";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var contractInvoicePrerequisites = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { ContractInvoicePrerequisites = contractInvoicePrerequisites } };
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
                            new ExceptionHandler(ex, "contract_invoice_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}