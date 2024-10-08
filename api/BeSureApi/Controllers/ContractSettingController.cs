using BeSureApi.Exceptions;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Services.LogService;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Models;

namespace BeSureApi.Controllers
{
    [Route("api/contractsetting")]
    [ApiController]
    public class ContractSettingController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ContractSettingController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpGet]
        [Route("get/details")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_CREATE)]
        public async Task<ActionResult> GetContractCallStopDetail(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_callstatus_detail";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var contractCallStopDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = contractCallStopDetails.FirstOrDefault()
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
                            new ExceptionHandler(ex,"contractsetting_details_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("get/contractexpirydetail")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_CREATE)]
        public async Task<ActionResult> GetContractExpiryDetails(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_expiry_detail";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var contractExpiryDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = contractExpiryDetails.FirstOrDefault()
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
                            new ExceptionHandler(ex,"contractsetting_contractexpirydetail_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("get/callstophistory")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_CREATE)]
        public async Task<ActionResult> GetContractCallStophistory(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_callstatus_get_history";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var contractCallStopDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data =  new
                    {
                        CallStopHistoryDetails =  contractCallStopDetails
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
                            new ExceptionHandler(ex,"contractsetting_callstophistory_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPut("{ContractId}/updatecallstatus")]
        public async Task<ActionResult> UpdateItem(int ContractId, CallStopStatusUpdate CallStopStatus)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_callstatus_update";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                parameters.Add("Status", CallStopStatus.Status);
                parameters.Add("Reason", CallStopStatus.Reason);
                parameters.Add("CallStopDate", CallStopStatus.CallStopDate);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var contractCallStopDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCallStatusUpdated = true
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
                            new ExceptionHandler(ex,"contract_setting_updatecallstatus_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPut("{ContractId}/updatecallexpiry")]
        public async Task<ActionResult> UpdateContractCallExpiry(int ContractId, string CallExpiryDate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_callexpiry_update";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                parameters.Add("CallExpiryDate", CallExpiryDate);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCallExpiryUpdated = true
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
                            new ExceptionHandler(ex,"contractsetting_updatecallexpiry_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("{ContractId}/get/close/detail")]
        public async Task<ActionResult> GetContractCustomerDetails(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_close_detail";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var contractCloseDetail = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data =  contractCloseDetail.First()
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
                            new ExceptionHandler(ex,"contractsetting_details_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("get/callstopcount")]
        public async Task<ActionResult> GetCallStopCountDetails()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var callStopCountDetails = new CallStopCountDetails();
                var procedure = "contract_callstop_count_details";
                var parameters = new DynamicParameters();
                parameters.Add("TotalCallStopped", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("Tonightcallstop", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                callStopCountDetails.TotalCallStopped = parameters.Get<int>("TotalCallStopped");
                callStopCountDetails.Tonightcallstop = parameters.Get<int>("Tonightcallstop");

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = callStopCountDetails
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
                            new ExceptionHandler(ex,"contractsetting_callstopcount_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}