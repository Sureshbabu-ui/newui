using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Models;

namespace BeSureApi.Controllers
{
    [Route("api/generalcontract")]
    [ApiController]
    public class GeneralContractSettingController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public GeneralContractSettingController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpGet]
        [Route("get/approverlist")]
        public async Task<object> GetContractApproverList(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ContractApproverList> approverDetails = await GetApproverList(connection, Page, Search);
                int totalRows = await GetApproverCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ApproverDetails = approverDetails,
                        CurrentPage = Page,
                        TotalRows = totalRows,
                        PerPage = perPage
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
                            new ExceptionHandler(ex,"contractapproverlist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<ContractApproverList>> GetApproverList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "contract_approver_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var approverLists = await Connection.QueryAsync<ContractApproverList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return approverLists;
        }
        private async Task<int> GetApproverCount(SqlConnection Connection, string? Search)
        {
            var procedure = "contract_approver_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpPost, Authorize()]
        [Route("approvercreate")]
        public async Task<object> CreateContractApprover(ContractApproverDetails contractApproverDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_approver_create";
                var parameters = new DynamicParameters();
                parameters.Add("TenantOfficeId", contractApproverDetails.TenantOfficeId);
                parameters.Add("FirstApproverId", contractApproverDetails.FirstApproverId);
                parameters.Add("SecondApproverId", contractApproverDetails.SecondApproverId);
                parameters.Add("RenewalFirstApproverId", contractApproverDetails.RenewalFirstApproverId);
                parameters.Add("RenewalSecondApproverId", contractApproverDetails.RenewalSecondApproverId);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<Designation>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsApproverCreated = true
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
                            new ExceptionHandler(ex,"contract_approver_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("approverupdate/details")]
        public async Task<ActionResult> GetContractApproverDetail(int ApprovalFlowId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_approver_update_detail";
                var parameters = new DynamicParameters();
                parameters.Add("ApprovalFlowId", ApprovalFlowId);
                var approverUpdateDetails = await Connection.QueryAsync(procedure,parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { ApproverUpdateDetails = approverUpdateDetails.First() } };
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
                            new ExceptionHandler(ex,"contractapproverlist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost, Authorize()]
        [Route("approverupdate")]
        public async Task<ActionResult> UpdateContractApprover(ContractApproverDetails contractApproverDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_approver_update";
                var parameters = new DynamicParameters();
                parameters.Add("ApprovalFlowId", contractApproverDetails.ApprovalFlowId);
                parameters.Add("TenantOfficeId", contractApproverDetails.TenantOfficeId);
                parameters.Add("FirstApproverId", contractApproverDetails.FirstApproverId);
                parameters.Add("SecondApproverId", contractApproverDetails.SecondApproverId);
                parameters.Add("RenewalFirstApproverId", contractApproverDetails.RenewalFirstApproverId);
                parameters.Add("RenewalSecondApproverId", contractApproverDetails.RenewalSecondApproverId);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { IsApproverUpdated = true } };
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
                            new ExceptionHandler(ex,"contract_approver_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("tenantlocationexcluded/namelist")]
        public async Task<ActionResult> GetTenantLocationExcludedList()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_approver_tenant_excluded_locations";
                var tenantOfficeInfo = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantOfficeInfo = tenantOfficeInfo
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
                            new ExceptionHandler(ex,"contractapproverlist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}