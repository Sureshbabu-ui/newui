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
using System.Drawing;
using BeSureApi.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BeSureApi.Controllers
{
    [Route("api/tenantlocation")]
    [ApiController]
    public class TenantOfficeController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public TenantOfficeController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("list")]
        public async Task<ActionResult> GetBaseLocations(int? TenantOfficeId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenant_office_location_name";
                var parameters = new DynamicParameters();
                parameters.Add("TenantOfficeId", TenantOfficeId);
                var tenantOfficeInfo = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

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
                            new ExceptionHandler(ex,"tenantofficedetails_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("namelist")]
        public async Task<ActionResult> GetBaseLocationNameList()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenant_office_location_name";
                var tenantOfficeName = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantOfficeName = tenantOfficeName
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
                            new ExceptionHandler(ex,"tenantofficedetails_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/list")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<ActionResult<List<TenantOfficeInfoList>>> GetAllTenantOfficeInfo(int Page,string? SearchWith)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<TenantOfficeInfoList> tenantOffices = await GetTenantOfficeList(Connection, Page, SearchWith);
                int TotalRows = await GetTenantOfficeCount(Connection, Page, SearchWith);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantOffices = tenantOffices,
                        currentPage = Page,
                        totalRows = TotalRows,
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
                            new ExceptionHandler(ex,"tenantofficedetails_no_data", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<TenantOfficeInfoList>> GetTenantOfficeList(SqlConnection Connection, int Page,string? SearchWith)
        {
            var procedure = "tenant_office_info_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("SearchWith", SearchWith);
            var tenantOffices = await Connection.QueryAsync<TenantOfficeInfoList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return tenantOffices;
        }

        private async Task<int> GetTenantOfficeCount(SqlConnection Connection, int Page, string? SearchWith)
        {
            var procedure = "tenant_office_info_count";
            var parameters = new DynamicParameters();
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize]
        [Route("create")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<ActionResult<List<TenantOfficeLocationCreate>>> CreateTenant(TenantOfficeLocationCreate tenantoffice)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var columnNames = new List<string> { "Code", "OfficeName" };
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "TenantOffice");
                foreach (var columnName in columnNames)
                {
                    parameters.Add("ColumnName", columnName);
                    if (columnName == "Code")
                    {
                        parameters.Add("Value", tenantoffice.Code);
                    }
                    else if (columnName == "OfficeName")
                    {
                        parameters.Add("Value", tenantoffice.OfficeName);
                    }
                    parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    var result = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                    int count = parameters.Get<int>("Count");
                    if (count > 0)
                    {
                        ModelState.AddModelError(columnName, "An entry with this value already exists.");
                    }
                }
                if (!ModelState.IsValid)
                {
                    return BadRequest(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status400BadRequest,
                        errors = UnprocessableEntity(ModelState).Value
                    }
                   ));
                }
                procedure = "tenantoffice_create";
                parameters = new DynamicParameters();
                parameters.Add("TenantId", tenantoffice.TenantId);
                parameters.Add("OfficeName", tenantoffice.OfficeName);
                parameters.Add("Code", tenantoffice.Code);
                parameters.Add("OfficeTypeId", tenantoffice.OfficeTypeId);
                parameters.Add("RegionId", tenantoffice.RegionId);
                parameters.Add("GeoLocation", tenantoffice.GeoLocation);
                parameters.Add("Address", tenantoffice.Address);
                parameters.Add("CityId", tenantoffice.CityId);
                parameters.Add("StateId", tenantoffice.StateId);
                parameters.Add("CountryId", tenantoffice.CountryId);
                parameters.Add("Pincode", tenantoffice.Pincode);
                parameters.Add("Phone", tenantoffice.Phone);
                parameters.Add("Email", tenantoffice.Email);
                parameters.Add("Mobile", tenantoffice.Mobile);
                parameters.Add("ManagerId", tenantoffice.ManagerId);
                parameters.Add("GstNumber", tenantoffice.GstNumber);
                parameters.Add("GstStateId", tenantoffice.GstStateId);
                parameters.Add("Tin", tenantoffice.Tin);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsTenantOfficeCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var tenantdata = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isTenantOfficeCreated = parameters.Get<int>("IsTenantOfficeCreated");
                if (isTenantOfficeCreated == 0)
                { throw new Exception(); }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsTenantOfficeCreated = Convert.ToBoolean(isTenantOfficeCreated)
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
                            new ExceptionHandler(ex,"tenantofficedetails_create_failed_message",_logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("parentoffices")]
        public async Task<ActionResult> GetManagersList()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantoffice_parentoffice_list";
                var parentoffices = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { ParentOffices = parentoffices } };
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
                            new ExceptionHandler(ex,"tenantofficedetails_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("details")]
        public async Task<ActionResult> GetLocationDetails(int TenantOfficeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantoffice_details";
                var parameters = new DynamicParameters();
                parameters.Add("@TenantOfficeId", TenantOfficeId);
                var officeInfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        LocationDetails = officeInfo.First()
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
                            new ExceptionHandler(ex,"tenantoffice_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet,Authorize()]
        [Route("destination/locations")]
        public async Task<ActionResult> GetDestinationLocationsForDC()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantoffice_destination_locations";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var tenantOfficelist = await Connection.QueryAsync(procedure, parameters,commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantOfficeInfo = tenantOfficelist
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
                            new ExceptionHandler(ex,"tenantofficelist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("regionwise/locations")]
        public async Task<ActionResult> GetRegionwiseLocation(int? RegionId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantoffice_region_wise_list";
                var parameters = new DynamicParameters();
                parameters.Add("RegionId", RegionId);
                var tenantOfficelist = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantOfficeName = tenantOfficelist
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
                            new ExceptionHandler(ex,"tenantofficelist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("regionwise/categorywise/locations")]
        public async Task<ActionResult> GetRegionandCategoryWiseLocation(int? RegionId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantoffice_region_and_category_wise_list";
                var parameters = new DynamicParameters();
                parameters.Add("RegionId", RegionId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var tenantOfficelist = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantOfficeName = tenantOfficelist
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
                            new ExceptionHandler(ex,"tenantofficelist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<object> DeleteTenantLocation(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantoffice_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsDeleted", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isTenantOfficeDeleted = parameters.Get<int>("IsDeleted");
                if (isTenantOfficeDeleted == 0)
                {
                    throw new CustomException("tenantoffice_deleted_failure_message");
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
                           new ExceptionHandler(ex,"tenantoffice_deleted_failure_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost, Authorize]
        [Route("Update")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<ActionResult<List<TenantOfficeLocationUpdate>>> UpdateTenantOfficeInfo(TenantOfficeLocationUpdate tenantoffice)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantoffice_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", tenantoffice.Id);
                parameters.Add("TenantOfficeId", tenantoffice.TenantOfficeId);
                parameters.Add("Address", tenantoffice.Address);
                parameters.Add("CityId", tenantoffice.CityId);
                parameters.Add("StateId", tenantoffice.StateId);
                parameters.Add("CountryId", tenantoffice.CountryId);
                parameters.Add("Pincode", tenantoffice.Pincode);
                parameters.Add("Phone", tenantoffice.Phone);
                parameters.Add("Email", tenantoffice.Email);
                parameters.Add("Mobile", tenantoffice.Mobile);
                parameters.Add("ManagerId", tenantoffice.ManagerId);
                parameters.Add("GstNumber", tenantoffice.GstNumber);
                parameters.Add("GstStateId", tenantoffice.GstStateId);
                parameters.Add("Tin", tenantoffice.Tin);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsTenantOfficeUpdated = true
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
                            new ExceptionHandler(ex,"tenantofficedetails_update_failed_message",_logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("update/details")]
        public async Task<ActionResult> GetLocationUpdateDetails(int TenantOfficeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantoffice_update_details";
                var parameters = new DynamicParameters();
                parameters.Add("TenantOfficeId", TenantOfficeId);
                var officeInfo = await connection.QuerySingleAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        LocationDetails = officeInfo
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
                            new ExceptionHandler(ex,"tenantoffice_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

    }
}
