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
    [Route("api/tenantregion")]
    [ApiController]
    public class TenantRegionController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public TenantRegionController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<ActionResult<List<TenantRegionsList>>> TenantRegionsList(int Page, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<TenantRegionsList> tenantRegions = await GetTenantRegionsList(Connection, Page, Search);
                int TotalRows = await GetTenantRegionsCount(Connection, Page, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantRegions = tenantRegions,
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
                            new ExceptionHandler(ex,"tenantregion_list_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<TenantRegionsList>> GetTenantRegionsList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "tenantregion_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);

            var tenantRegions = await Connection.QueryAsync<TenantRegionsList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return tenantRegions;
        }

        private async Task<int> GetTenantRegionsCount(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "tenantregion_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize]
        [Route("create")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<ActionResult<TenantRegionCreate>> CreateTenantRegion(TenantRegionCreate tenantRegion)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var columnNames = new List<string> { "Code", "RegionName" };
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "TenantRegion");
                foreach (var columnName in columnNames)
                {
                    parameters.Add("ColumnName", columnName);
                    if (columnName == "Code")
                    {
                        parameters.Add("Value", tenantRegion.Code);
                    }
                    else if (columnName == "RegionName")
                    {
                        parameters.Add("Value", tenantRegion.RegionName);
                    }
                    parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    var result = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                    int count = parameters.Get<int>("Count");
                    if (count > 0)
                    {
                        ModelState.AddModelError(columnName,"An entry with this value already exists.");
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
                procedure = "tenantregion_create"; 
                parameters = new DynamicParameters();
                parameters.Add("Code", tenantRegion.Code);
                parameters.Add("RegionName", tenantRegion.RegionName);
                parameters.Add("TenantId", tenantRegion.TenantId);
                parameters.Add("OfficeName", tenantRegion.OfficeName);
                parameters.Add("GeoLocation", tenantRegion.GeoLocation);
                parameters.Add("Address", tenantRegion.Address);
                parameters.Add("CityId", tenantRegion.CityId);
                parameters.Add("StateId", tenantRegion.StateId);
                parameters.Add("CountryId", tenantRegion.CountryId);
                parameters.Add("Pincode", tenantRegion.Pincode);
                parameters.Add("Phone", tenantRegion.Phone);
                parameters.Add("Email", tenantRegion.Email);
                parameters.Add("Mobile", tenantRegion.Mobile);
                parameters.Add("ManagerId", tenantRegion.ManagerId);
                parameters.Add("GstNumber", tenantRegion.GstNumber);
                parameters.Add("GstStateId", tenantRegion.GstStateId);
                parameters.Add("Tin", tenantRegion.Tin); parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsTenantRegionCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var tenantdata = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isTenantRegionCreated = parameters.Get<int>("IsTenantRegionCreated");
                if (isTenantRegionCreated == 0)
                { throw new Exception(); }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsTenantRegionCreated = Convert.ToBoolean(isTenantRegionCreated)
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
                            new ExceptionHandler(ex,"tenantregion_create_failed_message",_logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut]
        [Route("update")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<object> UpdateTenantRegion(TenantRegionUpdate tenantRegionUpdate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantregion_update";
                var parameters = new DynamicParameters();
                parameters.Add("TenantRegionId", tenantRegionUpdate.Id);
                parameters.Add("Code", tenantRegionUpdate.Code);
                parameters.Add("RegionName", tenantRegionUpdate.RegionName);
                parameters.Add("TenantOfficeId", tenantRegionUpdate.TenantOfficeId);
                parameters.Add("TenantOfficeInfoId", tenantRegionUpdate.TenantOfficeInfoId);
                parameters.Add("Address", tenantRegionUpdate.Address);
                parameters.Add("CityId", tenantRegionUpdate.CityId);
                parameters.Add("StateId", tenantRegionUpdate.StateId);
                parameters.Add("CountryId", tenantRegionUpdate.CountryId);
                parameters.Add("Pincode", tenantRegionUpdate.Pincode);
                parameters.Add("Phone", tenantRegionUpdate.Phone);
                parameters.Add("Email", tenantRegionUpdate.Email);
                parameters.Add("Mobile", tenantRegionUpdate.Mobile);
                parameters.Add("ManagerId", tenantRegionUpdate.ManagerId);
                parameters.Add("GstNumber", tenantRegionUpdate.GstNumber);
                parameters.Add("GstStateId", tenantRegionUpdate.GstStateId);
                parameters.Add("Tin", tenantRegionUpdate.Tin); 
                parameters.Add("IsActive", tenantRegionUpdate.IsActive);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                connection.Query<TenantRegionUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        isUpdated = true
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
                            new ExceptionHandler(ex,"tenantregion_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("details")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<ActionResult> GetProfileDetails(int TenantRegionId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantregion_details";
                var parameters = new DynamicParameters();
                parameters.Add("@TenantRegionId", TenantRegionId);
                var regionInfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        RegionDetails = regionInfo.First()
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
                            new ExceptionHandler(ex,"tenantregion_list_no_region_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/names")]
        public async Task<object> GetTenantRegionNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantregion_getnames";
                var regionNames = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { RegionNames = regionNames } };
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
                            new ExceptionHandler(ex,"tenantregion_list_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet,Authorize()]
        [Route("get/categorywise/names")]
        public async Task<object> GetUserCategoryRegionNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantregion_usercategory_getnames";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var regionNames = await Connection.QueryAsync(procedure,parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { RegionNames = regionNames } };
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
                            new ExceptionHandler(ex,"tenantregion_list_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<object> DeleteTenantRegion(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenantregion_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsDeleted", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isRegionDeleted = parameters.Get<int>("IsDeleted");
                if (isRegionDeleted == 0)
                {
                    throw new CustomException("tenantregion_deleted_failure_message");
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
                           new ExceptionHandler(ex,"tenantregion_deleted_failure_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}