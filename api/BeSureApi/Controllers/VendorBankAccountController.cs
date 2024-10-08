using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Models;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Text.Json;
using System.Numerics;

namespace api.Controllers
{
    [Route("api/vendor/bankaccount")]
    [ApiController]
    public class VendorBankAccountController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public VendorBankAccountController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpPost, Authorize]
        [Route("create")]
        [HasPermission(VendorBusinessFunctionCode.VENDORBANKACCOUNT_CREATE)]
        public async Task<ActionResult> CreateVendorBankAccount(VendorBankAccount vendorBankAccount)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendorbankaccount_create";
                var parameters = new DynamicParameters();
                parameters.Add("VendorId", vendorBankAccount.VendorId);
                parameters.Add("VendorBranchId", vendorBankAccount.VendorBranchId);
                parameters.Add("BankAccountTypeId", vendorBankAccount.BankAccountTypeId);
                parameters.Add("BankBranchId", vendorBankAccount.BankBranchId);
                parameters.Add("AccountNumber", vendorBankAccount.AccountNumber);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsVendorBankAccountCreated = true
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
                            new ExceptionHandler(ex,"vendorbankaccount_create_failed",_logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(VendorBusinessFunctionCode.VENDORBANKACCOUNT_LIST)]
        public async Task<ActionResult<List<VendorBankAccountList>>> GetAllVendorBankAccountList(int Page, string? Search, int VendorId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<VendorBankAccountList> vendorBankAccounts = await GetVendorBankAccountList(Connection, Page, Search, VendorId);
                int totalRows = vendorBankAccounts.Count();
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        VendorBankAccounts = vendorBankAccounts,
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
                        message = new[] {
                            new ExceptionHandler(ex,"vendorbankaccount_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<VendorBankAccountList>> GetVendorBankAccountList(SqlConnection Connection, int Page, string? Search, int VendorId)
        {
            var procedure = "vendorbankaccount_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("VendorId", VendorId);
            var vendorBankAccountList = await Connection.QueryAsync<VendorBankAccountList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return vendorBankAccountList;
        }

        [HttpGet]
        [Route("details")]
        public async Task<ActionResult> GetVendorBankAccountDetails(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendorbankaccount_editdetails";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                var vendorBankAccountDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        VendorBankAccountDetails = vendorBankAccountDetails.FirstOrDefault()
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
                            new ExceptionHandler(ex,"vendorbankaccocunt_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost]
        [Route("update")]
        [HasPermission(VendorBusinessFunctionCode.VENDORBANKACCOUNT_CREATE)]
        public async Task<object> UpdateVendorBankAccount(VendorBankAccountUpdate vendorBankAccountUpdate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendorbankaccount_update";

                var parameters = new DynamicParameters();
                parameters.Add("Id", vendorBankAccountUpdate.Id);
                parameters.Add("VendorBranchId", vendorBankAccountUpdate.VendorBranchId);
                parameters.Add("BankAccountTypeId", vendorBankAccountUpdate.BankAccountTypeId);
                parameters.Add("BankBranchId", vendorBankAccountUpdate.BankBranchId);
                parameters.Add("AccountNumber", vendorBankAccountUpdate.AccountNumber);
                parameters.Add("IsActive", vendorBankAccountUpdate.IsActive);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsVendorBankAccountUpdated = true
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
                            new ExceptionHandler(ex,"vendorbankaccount_update_failed", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("delete")]
        [HasPermission(VendorBusinessFunctionCode.VENDORBANKACCOUNT_CREATE)]
        public async Task<object> DeleteVendorBankAccount(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendorbankaccount_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id",Id);
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
                           new ExceptionHandler(ex, "vendorbankaccount_delete_failed", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}