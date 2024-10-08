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
    [Route("api/vendorbranch")]
    [ApiController]
    public class VendorBranchController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public VendorBranchController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpPost, Authorize]
        [Route("create")]
        [HasPermission(VendorBusinessFunctionCode.VENDORBRANCH_CREATE)]
        public async Task<ActionResult> CreateVendorBranch(VendorBranch vendorBranch)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendorbranch_create";
                var parameters = new DynamicParameters();
                parameters.Add("TenantOfficeId", vendorBranch.TenantOfficeId);
                parameters.Add("Code", vendorBranch.Code);
                parameters.Add("Name", vendorBranch.Name);
                parameters.Add("Address", vendorBranch.Address);
                parameters.Add("VendorId", vendorBranch.VendorId);
                parameters.Add("CityId", vendorBranch.CityId);
                parameters.Add("StateId", vendorBranch.StateId);
                parameters.Add("CountryId", vendorBranch.CountryId);
                parameters.Add("Pincode", vendorBranch.Pincode);
                parameters.Add("ContactName", vendorBranch.ContactName);
                parameters.Add("Email", vendorBranch.Email);
                parameters.Add("ContactNumberOneCountryCode", vendorBranch.ContactNumberOneCountryCode);
                parameters.Add("ContactNumberOne", vendorBranch.ContactNumberOne);
                parameters.Add("ContactNumberTwoCountryCode", vendorBranch.ContactNumberTwoCountryCode);
                parameters.Add("ContactNumberTwo", vendorBranch.ContactNumberTwo);
                parameters.Add("CreditPeriodInDays", vendorBranch.CreditPeriodInDays);
                parameters.Add("GstNumber", vendorBranch.GstNumber);
                parameters.Add("Remarks", vendorBranch.Remarks);
                parameters.Add("TollfreeNumber", vendorBranch.TollfreeNumber);
                parameters.Add("GstArn", vendorBranch.GstArn);
                parameters.Add("GstVendorTypeId", vendorBranch.GstVendorTypeId);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsVendorBranchCreated = true
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
                            new ExceptionHandler(ex,"vendorbranch_create_failed",_logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(VendorBusinessFunctionCode.VENDORBRANCH_LIST)]
        public async Task<ActionResult<List<VendorBranchList>>> GetAllVendorBranchList(int Page, string? Search, int VendorId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<VendorBranchList> vendorsBranches = await GetVendorBranchList(Connection, Page, Search, VendorId);
                int totalRows = await GetVendorBranchesCount(Connection, Search, VendorId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        VendorBranches = vendorsBranches,
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
                            new ExceptionHandler(ex,"vendorbranch_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<VendorBranchList>> GetVendorBranchList(SqlConnection Connection, int Page, string? Search, int VendorId)
        {
            var procedure = "vendorbranch_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("VendorId", VendorId);
            var vendorBranchList = await Connection.QueryAsync<VendorBranchList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return vendorBranchList;
        }

        private async Task<int> GetVendorBranchesCount(SqlConnection Connection, string? Search,int VendorId)
        {
            var procedure = "vendorbranch_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("VendorId", VendorId);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpGet]
        [Route("details")]
        public async Task<ActionResult> GetVendorBranchDetails(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendorbranch_editdetails";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                var vendorBranchDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        VendorBranchDetails = vendorBranchDetails.FirstOrDefault()
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
                            new ExceptionHandler(ex,"vendor_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost]
        [Route("update")]
        [HasPermission(VendorBusinessFunctionCode.VENDORBRANCH_CREATE)]
        public async Task<object> UpdateVendorBranch(VendorBranchUpdate vendorUpdate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendorbranch_update";
                var parameters = new DynamicParameters();
                parameters.Add("TenantOfficeId", vendorUpdate.TenantOfficeId);
                parameters.Add("Code", vendorUpdate.Code);
                parameters.Add("IsActive", vendorUpdate.IsActive);
                parameters.Add("Id", vendorUpdate.Id);
                parameters.Add("Name", vendorUpdate.Name);
                parameters.Add("Address", vendorUpdate.Address);
                parameters.Add("CityId", vendorUpdate.CityId);
                parameters.Add("StateId", vendorUpdate.StateId);
                parameters.Add("CountryId", vendorUpdate.CountryId);
                parameters.Add("Pincode", vendorUpdate.Pincode);
                parameters.Add("ContactName", vendorUpdate.ContactName);
                parameters.Add("Email", vendorUpdate.Email);
                parameters.Add("ContactNumberOneCountryCode", vendorUpdate.ContactNumberOneCountryCode);
                parameters.Add("ContactNumberOne", vendorUpdate.ContactNumberOne);
                parameters.Add("ContactNumberTwoCountryCode", vendorUpdate.ContactNumberTwoCountryCode);
                parameters.Add("ContactNumberTwo", vendorUpdate.ContactNumberTwo);
                parameters.Add("CreditPeriodInDays", vendorUpdate.CreditPeriodInDays);
                parameters.Add("GstNumber", vendorUpdate.GstNumber);
                parameters.Add("GstVendorTypeId", vendorUpdate.GstVendorTypeId);
                parameters.Add("Remarks", vendorUpdate.Remarks);
                parameters.Add("TollfreeNumber", vendorUpdate.TollfreeNumber);
                parameters.Add("GstArn", vendorUpdate.GstArn);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsVendorBranchUpdated = true
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
                            new ExceptionHandler(ex,"vendorbranch_update_failed", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("delete")]
        [HasPermission(VendorBusinessFunctionCode.VENDORBRANCH_CREATE)]
        public async Task<object> DeleteVendorBranch(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendorbranch_delete";
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
                           new ExceptionHandler(ex,"vendorbranch_delete_failed", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("get/branchnames")]
        public async Task<ActionResult> GetAllVendorBranchNames(int VendorId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendorbranch_get_names";
                var parameters = new DynamicParameters();
                parameters.Add("VendorId", VendorId);
                var vendorBranhes = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        VendorBranches = vendorBranhes
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
                            new ExceptionHandler(ex,"vendorbranch_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}