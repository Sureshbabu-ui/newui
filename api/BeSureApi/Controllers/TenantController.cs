using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Text.Json;
using BeSureApi.Models;

namespace api.Controllers
{
    [Route("api/tenant")]
    [ApiController]
    public class TenantController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public TenantController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }


        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<ActionResult<List<Profile>>> CreateTenant(Tenant tenant)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var Code = RandomCode();
                var procedure = "tenant_create";
                var parameters = new DynamicParameters();
                parameters.Add("Name", tenant.Name);
                parameters.Add("NameOnPrint", tenant.NameOnPrint);
                parameters.Add("Address", tenant.Address);
                parameters.Add("TenantCode", Code);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsTenantCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var tenantdata = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isTenantCreated = parameters.Get<int>("IsTenantCreated");
                    if(isTenantCreated==0)
                { throw new Exception(); }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsTenantCreated = Convert.ToBoolean(isTenantCreated)
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
                            new ExceptionHandler(ex,"tenant_create_failed_message",_logService).GetMessage()
                        }
                    }
                }));
            }    
        }

        private int RandomCode()
        {
            Random generator = new Random();
            int r = generator.Next(100000, 1000000);
            return r;
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<ActionResult<List<TenantList>>> GetAllTenantList(int Page, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<TenantList> tenants = await GetTenantList(Connection, Page, Search);
                int totalRows = await GetTenantsCount(Connection, Page, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Tenants = tenants,
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
                            new ExceptionHandler(ex,"tenant_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<TenantList>> GetTenantList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "tenant_info_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);

            var tenantList = await Connection.QueryAsync<TenantList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return tenantList;
        }
        private async Task<int> GetTenantsCount(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "tenants_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("get/details")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<ActionResult> GetTenantDetails(int TenantId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenant_details";
                var parameters = new DynamicParameters();
                parameters.Add("TenantId", TenantId);
                var tenantDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantDetails = tenantDetails
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
                            new ExceptionHandler(ex,"tenant_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("get/update/details")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<ActionResult> GetTenanUpdatetDetails(int TenantId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenant_edit_details";
                var parameters = new DynamicParameters();
                parameters.Add("TenantId", TenantId);
                var tenantDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantDetails = tenantDetails.FirstOrDefault()
                    }
                }));;
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"tenant_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost, Authorize()]
        [Route("update")]
        [HasPermission(AccelBusinessFunctionCode.ACCEL_MANAGE)]
        public async Task<ActionResult> UpdateTenant(TenantUpdate tenantUpdate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenant_update";
                var parameters = new DynamicParameters();
                parameters.Add("Name", tenantUpdate.Name);
                parameters.Add("NameOnPrint", tenantUpdate.NameOnPrint);
                parameters.Add("CWHAddress", tenantUpdate.CWHAddress);
                parameters.Add("GRCAddress", tenantUpdate.GRCAddress);
                parameters.Add("HOAddress", tenantUpdate.HOAddress);
                parameters.Add("Address", tenantUpdate.Address);
                parameters.Add("TenantId", tenantUpdate.TenantId);
                parameters.Add("CountryId", tenantUpdate.Country);
                parameters.Add("StateId", tenantUpdate.State);
                parameters.Add("CityId", tenantUpdate.City);
                parameters.Add("Pincode", tenantUpdate.Pincode);
                parameters.Add("PanNumber", tenantUpdate.PanNumber);
                parameters.Add("TenantInfoId", tenantUpdate.Id);
                parameters.Add("CWHOfficeInfoId", tenantUpdate.CWHId);
                parameters.Add("GRCOfficeInfoId", tenantUpdate.GRCId);
                parameters.Add("HeadOfficeInfoId", tenantUpdate.HDOFId);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsTenantUpdated = true
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
                            new ExceptionHandler(ex,"tenant_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}