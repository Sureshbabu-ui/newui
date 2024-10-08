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
    [Route("api/vendor")]
    [ApiController]
    public class VendorController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public VendorController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpPost, Authorize]
        [Route("create")]
        [HasPermission(VendorBusinessFunctionCode.VENDOR_CREATE)]
        public async Task<ActionResult<List<Vendor>>> CreateTenant(Vendor vendor)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendor_create";
                var parameters = new DynamicParameters();
                parameters.Add("TenantOfficeId", vendor.TenantOfficeId);
                parameters.Add("IsMsme", vendor.IsMsme);
                parameters.Add("Name", vendor.Name);
                parameters.Add("Address", vendor.Address);
                parameters.Add("CityId", vendor.CityId);
                parameters.Add("StateId", vendor.StateId);
                parameters.Add("CountryId", vendor.CountryId);
                parameters.Add("Pincode", vendor.Pincode);
                parameters.Add("ContactName", vendor.ContactName);
                parameters.Add("Email", vendor.Email);
                parameters.Add("ContactNumberOneCountryCode", vendor.ContactNumberOneCountryCode);
                parameters.Add("ContactNumberOne", vendor.ContactNumberOne);
                parameters.Add("ContactNumberTwoCountryCode", vendor.ContactNumberTwoCountryCode);
                parameters.Add("ContactNumberTwo", vendor.ContactNumberTwo);
                parameters.Add("CreditPeriodInDays", vendor.CreditPeriodInDays);
                parameters.Add("GstNumber", vendor.GstNumber);
                parameters.Add("GstVendorTypeId", vendor.GstVendorTypeId);
                parameters.Add("ArnNumber", vendor.ArnNumber);
                parameters.Add("EsiNumber", vendor.EsiNumber);
                parameters.Add("PanNumber", vendor.PanNumber);
                parameters.Add("PanTypeId", vendor.PanTypeId);
                parameters.Add("VendorTypeId", vendor.VendorTypeId);
                parameters.Add("TanNumber", vendor.TanNumber);
                parameters.Add("CinNumber", vendor.CinNumber);
                parameters.Add("MsmeRegistrationNumber", vendor.MsmeRegistrationNumber);
                parameters.Add("MsmeCommencementDate", vendor.MsmeCommencementDate);
                parameters.Add("MsmeExpiryDate", vendor.MsmeExpiryDate);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsVendorCreated = true
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
                            new ExceptionHandler(ex,"vendor_create_failed",_logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(VendorBusinessFunctionCode.VENDOR_LIST)]
        public async Task<ActionResult<List<VendorList>>> GetAllVendorList(int Page, string? SearchWith, string? Filters)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<VendorList> vendors = await GetVendorList(Connection, Page, SearchWith,Filters);
                int totalRows = await GetVendorsCount(Connection, Page, SearchWith, Filters);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Vendors = vendors,
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
                            new ExceptionHandler(ex,"vendor_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<VendorList>> GetVendorList(SqlConnection Connection, int Page, string? SearchWith, string? Filters)
        {
            var procedure = "vendorinfo_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("Filters", Filters);
            var vendorList = await Connection.QueryAsync<VendorList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return vendorList;
        }

        private async Task<int> GetVendorsCount(SqlConnection Connection, int Page, string? SearchWith, string? Filters)
        {
            var procedure = "vendorinfo_count";
            var parameters = new DynamicParameters();
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("Filters", Filters);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("details")]
        public async Task<ActionResult> GetVendorDetails(int VendorId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendor_editdetails";
                var parameters = new DynamicParameters();
                parameters.Add("VendorId", VendorId);
                var vendorDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        VendorDetails = vendorDetails.FirstOrDefault()
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
        [HasPermission(VendorBusinessFunctionCode.VENDOR_CREATE)]
        public async Task<object> UpdateVendor(VendorUpdate vendorUpdate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendor_update";
                var parameters = new DynamicParameters();
                parameters.Add("TenantOfficeId", vendorUpdate.TenantOfficeId);
                parameters.Add("IsActive", vendorUpdate.IsActive);
                parameters.Add("IsMsme", vendorUpdate.IsMsme);
                parameters.Add("Id", vendorUpdate.Id);
                parameters.Add("VendorId", vendorUpdate.VendorId);
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
                parameters.Add("ArnNumber", vendorUpdate.ArnNumber);
                parameters.Add("EsiNumber", vendorUpdate.EsiNumber);
                parameters.Add("PanNumber", vendorUpdate.PanNumber);
                parameters.Add("PanTypeId", vendorUpdate.PanTypeId);
                parameters.Add("VendorTypeId", vendorUpdate.VendorTypeId);
                parameters.Add("TanNumber", vendorUpdate.TanNumber);
                parameters.Add("CinNumber", vendorUpdate.CinNumber);
                parameters.Add("MsmeRegistrationNumber", vendorUpdate.MsmeRegistrationNumber);
                parameters.Add("MsmeCommencementDate", vendorUpdate.MsmeCommencementDate);
                parameters.Add("MsmeExpiryDate", vendorUpdate.MsmeExpiryDate);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsVendorUpdated = true
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
                            new ExceptionHandler(ex, "vendor_update_failed", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/selecteddetails")]
        public async Task<ActionResult> GetSelectedVendorDetails(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendor_selected_details";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                var vendorDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        VendorDetails = vendorDetails.FirstOrDefault()
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

        [HttpPost, Authorize()]
        [Route("delete")]
        [HasPermission(VendorBusinessFunctionCode.VENDOR_CREATE)]
        public async Task<object> DeleteVendor(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendor_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id",Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsDeleted", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isVendorDeleted = parameters.Get<int>("IsDeleted");
                if (isVendorDeleted == 0)
                {
                    throw new CustomException("vendor_deleted_failure_message");
                }
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
                           new ExceptionHandler(ex,"vendor_deleted_failure_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("names")]
        public async Task<ActionResult> GetVendorNames(int vendorTypeId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "vendor_names";
                var parameters = new DynamicParameters();
                parameters.Add("VendorTypeId", vendorTypeId);
                var vendornames = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { VendorNames = vendornames } };
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
                            new ExceptionHandler(ex,"vendorname_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}