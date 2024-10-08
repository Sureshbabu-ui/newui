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
    [Route("api/tenantbankaccount")]
    [ApiController]
    public class TenantBankAccountController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public TenantBankAccountController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpGet]
        [Route("list")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE_BANK)]
        public async Task<object> GetTenantBankAccount(int TenantId,int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<TenantBankAccountList> teanantBankAccountList = await GetTenantBankAccountList(connection, TenantId, Page, Search);
                int totalRows = await GetTenantBankAccountCount(connection,TenantId, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantBankAccounts = teanantBankAccountList,
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
                            new ExceptionHandler(ex,"tenantbankaccount_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<TenantBankAccountList>> GetTenantBankAccountList(SqlConnection Connection,int TenantId, int Page, string? Search)
        {
            var procedure = "tenantbankaccount_list";
            var parameters = new DynamicParameters();
            parameters.Add("TenantId", TenantId);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var tenantBankAccountList = await Connection.QueryAsync<TenantBankAccountList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return tenantBankAccountList;
        }

        private async Task<int> GetTenantBankAccountCount(SqlConnection Connection,int TenantId, string? Search)
        {
            var procedure = "tenantbankaccount_count";
            var parameters = new DynamicParameters();
            parameters.Add("TenantId", TenantId);
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE_BANK)]
        public async Task<object> CreateTenantBankAccount(TenantBankAccountCreate tenantBankAccount)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantbankaccount_create";
                var parameters = new DynamicParameters();
                parameters.Add("TenantId", tenantBankAccount.TenantId);
                parameters.Add("BankBranchInfoId", tenantBankAccount.BankBranchInfoId);
                parameters.Add("BankAccountTypeId", tenantBankAccount.BankAccountTypeId);
                parameters.Add("ContactNumber", tenantBankAccount.ContactNumber);
                parameters.Add("AccountNumber", tenantBankAccount.AccountNumber);
                parameters.Add("RelationshipManager", tenantBankAccount.RelationshipManager);
                parameters.Add("Email", tenantBankAccount.Email);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsTenantBankAccountCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                connection.Query<ContractCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int IsTenantBankAccountCreated = parameters.Get<int>("IsTenantBankAccountCreated");
                if (IsTenantBankAccountCreated == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsTenantBankAccountCreated = Convert.ToBoolean(IsTenantBankAccountCreated)
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
                            new ExceptionHandler(ex,"tenantbankaccountcreate_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/details")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE_BANK)]
        public async Task<ActionResult<TenantBankAccountDetails>> GetTenantBankAccountDetails(int TenantBankAccountId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantbankaccount_details";
                var parameters = new DynamicParameters();
                parameters.Add("Id", TenantBankAccountId);
                var tenantBankAccountDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = tenantBankAccountDetails.FirstOrDefault()
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
                            new ExceptionHandler(ex,"tenantbankaccount_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/names")]
        public async Task<ActionResult<List<TenantBankAccountNames>>> GetTenantBankAccountNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantbankaccount_get_names";
                var parameters = new DynamicParameters();
                var bankList = await Connection.QueryAsync<TenantBankAccountNames>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantBankAccounts = bankList,
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
                            new ExceptionHandler(ex,"tenantbankaccount_list_no_bank", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("delete")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE_BANK)]
        public async Task<object> DeleteTenantBankAccount(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantbankaccount_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsDeleted = true
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
                           new ExceptionHandler(ex, "tenantbankaccount_delete_failed", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
