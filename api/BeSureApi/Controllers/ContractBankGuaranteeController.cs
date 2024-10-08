using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/contract/bankguarantee")]
    [ApiController]
    public class ContractBankGuaranteeController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ContractBankGuaranteeController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpGet]
        [Route("list")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_BANK_GUARANTEE_LIST)]
        public async Task<object> GetContractBankGuaranteeList(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<BankGuaranteeList> bankGuarantees = await GetBankGuaranteeList(connection, ContractId);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        BankGuarantees = bankGuarantees,
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
                            new ExceptionHandler(ex,"bankguarantee_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<BankGuaranteeList>> GetBankGuaranteeList(SqlConnection Connection,int ContractId)
        {
            var procedure = "contractbankguarantee_list";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            var bankGuaranteeDetails = await Connection.QueryAsync<BankGuaranteeList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return bankGuaranteeDetails;
        }
        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_BANK_GUARANTEE_CREATE)]
        public async Task<object> CreateContractBankGuarantee(BankGuaranteeDetails bankGuaranteeDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractbankguarantee_create";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", bankGuaranteeDetails.ContractId);
                parameters.Add("GuaranteeType", bankGuaranteeDetails.GuaranteeType);
                parameters.Add("GuaranteeNumber", bankGuaranteeDetails.GuaranteeNumber);
                parameters.Add("BankBranchInfoId", bankGuaranteeDetails.BankBranchInfoId);
                parameters.Add("GuaranteeAmount", bankGuaranteeDetails.GuaranteeAmount);
                parameters.Add("GuaranteeStartDate", bankGuaranteeDetails.GuaranteeStartDate);
                parameters.Add("GuaranteeEndDate", bankGuaranteeDetails.GuaranteeEndDate);
                parameters.Add("GuaranteeClaimPeriodInDays", bankGuaranteeDetails.GuaranteeClaimPeriodInDays);
                parameters.Add("Remarks", bankGuaranteeDetails.Remarks);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsBankGuaranteeCreated = true
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
                            new ExceptionHandler(ex,"bankguarantee_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("update/details")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_BANK_GUARANTEE_EDIT)]
        public async Task<ActionResult> GetBankGuaranteeDetails(int BankGuaranteeId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractbankguarantee_details";
                var parameters = new DynamicParameters();
                parameters.Add("BankGuaranteeId", BankGuaranteeId);
                var bankGuaranteeDetails = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { BankGuaranteeDetails = bankGuaranteeDetails.First() } };
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
                            new ExceptionHandler(ex,"bankguarantee_details_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost, Authorize()]
        [Route("update")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_BANK_GUARANTEE_EDIT)]
        public async Task<ActionResult> UpdateBankGuarantee(BankGuaranteeUpdateDetails bankGuaranteeDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractbankguarantee_update";
                var parameters = new DynamicParameters();
                parameters.Add("BankGuaranteeId", bankGuaranteeDetails.Id);
                parameters.Add("GuaranteeType", bankGuaranteeDetails.GuaranteeType);
                parameters.Add("GuaranteeNumber", bankGuaranteeDetails.GuaranteeNumber);
                parameters.Add("BankBranchInfoId", bankGuaranteeDetails.BankBranchInfoId);
                parameters.Add("GuaranteeAmount", bankGuaranteeDetails.GuaranteeAmount);
                parameters.Add("GuaranteeStartDate", bankGuaranteeDetails.GuaranteeStartDate);
                parameters.Add("GuaranteeEndDate", bankGuaranteeDetails.GuaranteeEndDate);
                parameters.Add("GuaranteeClaimPeriodInDays", bankGuaranteeDetails.GuaranteeClaimPeriodInDays);
                parameters.Add("Remarks", bankGuaranteeDetails.Remarks);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { IsBankGuaranteeUpdated = true } };
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
                            new ExceptionHandler(ex,"bankguarantee_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
