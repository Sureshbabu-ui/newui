using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/contractinvoiceschedule")]
    [ApiController]
    public class ContractInvoiceScheduleController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ContractInvoiceScheduleController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpPost, Authorize()]
        [Route("generate")]
        [HasPermission(ContractInvoiceBusinessFunctionCode.INVOICE_LIST)]
        public async Task<ActionResult> ContractInvoiceSchedueGenerate(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_invoice_schedule_generate";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { IsInvoiceScheduleGenerated = true } };
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
                            new ExceptionHandler(ex,"contract_invoice_generate_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(ContractInvoiceBusinessFunctionCode.INVOICE_LIST)]
        public async Task<object> GetInvoiceSchedule(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ContractInvoiceScheduleList> scheduleList = await GetInvoiceScheduleList(connection, ContractId);
                int totalRows = await GetContractInvoiceScheduleCount(connection, ContractId);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractInvoiceScheduleList = scheduleList,
                        TotalRows = totalRows,
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
                            new ExceptionHandler(ex,"contract_invoice_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<ContractInvoiceScheduleList>> GetInvoiceScheduleList(SqlConnection Connection, int ContractId)
        {
            var procedure = "contractinvoiceschedule_list";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            var scheduleList = await Connection.QueryAsync<ContractInvoiceScheduleList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return scheduleList;
        }

        private async Task<int> GetContractInvoiceScheduleCount(SqlConnection Connection, int ContractId)
        {
            var procedure = "contractinvoiceschedule_count";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("get/details")]
        [HasPermission(ContractInvoiceBusinessFunctionCode.INVOICE_LIST)]
        public async Task<ActionResult> GetContractScheduleDetails(int ContractInvoiceScheduleId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractinvoiceschedule_detail";
                var parameters = new DynamicParameters();
                parameters.Add("ContractInvoiceScheduleId", ContractInvoiceScheduleId);
                var contractInvoiceScheduleDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractInvoiceScheduleDetails = contractInvoiceScheduleDetails.FirstOrDefault()
                    }
                })); ;
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"contract_invoice_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("approve")]
        [HasPermission(ContractInvoiceBusinessFunctionCode.INVOICE_APPROVE)]
        public async Task<ActionResult> ContractInvoiceApprove(int ContractInvoiceScheduleId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractinvoice_approve";
                var parameters = new DynamicParameters();
                parameters.Add("ContractInvoiceScheduleId", ContractInvoiceScheduleId);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { 
                    status = StatusCodes.Status200OK,
                    data = new {
                        IsInvoiceScheduleApproved = true
                    } 
                };
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
                            new ExceptionHandler(ex,"contract_invioce_approve_contract_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}