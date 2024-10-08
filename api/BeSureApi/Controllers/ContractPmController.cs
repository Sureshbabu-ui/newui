using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/pmschedule")]
    [ApiController]
    public class ContractPmController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ContractPmController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpGet]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.CONTRACT_PMSCHEDULE_VIEW)]
        public async Task<ActionResult> GetContractPmSchedules(int ContractId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_pmschedule_list";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var pmSchedules = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PmSchedules = pmSchedules,
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
                            new ExceptionHandler(ex,"pmschedule_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("details")]
        [HasPermission(MasterDataBusinessFunctionCode.CONTRACT_PMSCHEDULE_VIEW)]
        public async Task<ActionResult> GetContractPmScheduleDetails(int PmScheduleId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_pmschedule_details";
                var parameters = new DynamicParameters();
                parameters.Add("PmScheduleId", PmScheduleId);
                var pmScheduleDetails = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PmScheduleDetails = pmScheduleDetails
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
                            new ExceptionHandler(ex,"pmschedule_details_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}