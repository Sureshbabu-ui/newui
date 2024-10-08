using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/country")]
    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public CountryController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpGet]
        [Route("get/all")]
        public async Task<ActionResult> GetAllCountries()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "country_get_all";
                var countries = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Countries = countries
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
                            new ExceptionHandler(ex,"country_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }


        [HttpGet, Authorize()]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.COUNTRY_VIEW)]
        public async Task<ActionResult> GetAllCountry(int Page, string? SearchWith)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                int TotalRows = await GetCountryCount(Connection, Page, SearchWith);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                var procedure = "country_list";
                var parameters = new DynamicParameters();
                parameters.Add("Page", Page);
                parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
                parameters.Add("SearchWith", SearchWith);
                var countrylist = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CountryList = countrylist,
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
                            new ExceptionHandler(ex,"country_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<int> GetCountryCount(SqlConnection Connection, int Page, string? SearchWith)
        {
            var procedure = "country_count";
            var parameters = new DynamicParameters();
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.COUNTRY_MANAGE)]
        public async Task<object> CreateCountry(CountryCreate createcountry)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "country_create";
                var parameters = new DynamicParameters();
                parameters.Add("Name", createcountry.Name);
                parameters.Add("IsoTwoCode", createcountry.IsoTwoCode);
                parameters.Add("IsoThreeCode", createcountry.IsoThreeCode);
                parameters.Add("CallingCode", createcountry.CallingCode);
                parameters.Add("CurrencyCode", createcountry.CurrencyCode);
                parameters.Add("CurrencyName", createcountry.CurrencyName);
                parameters.Add("CurrencySymbol", createcountry.CurrencySymbol);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<CountryCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCountryCreated = true
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
                            new ExceptionHandler(ex,"country_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.COUNTRY_MANAGE)]
        public async Task<object> EditCountry(CountryEdit editcountry)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "country_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", editcountry.Id);
                parameters.Add("Name", editcountry.Name);
                parameters.Add("IsoTwoCode", editcountry.IsoTwoCode);
                parameters.Add("IsoThreeCode", editcountry.IsoThreeCode);
                parameters.Add("CallingCode", editcountry.CallingCode);
                parameters.Add("CurrencyCode", editcountry.CurrencyCode);
                parameters.Add("CurrencyName", editcountry.CurrencyName);
                parameters.Add("CurrencySymbol", editcountry.CurrencySymbol);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<CountryEdit>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCountryUpdated = true
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
                            new ExceptionHandler(ex,"country_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.COUNTRY_MANAGE)]
        public async Task<object> DeleteCountry(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "country_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("country_delete_restricted_message");
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
                           new ExceptionHandler(ex,"country_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
