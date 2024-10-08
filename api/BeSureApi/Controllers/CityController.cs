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
    [Route("api/city")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public CityController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("get/all/in/state")]
        public async Task<ActionResult> GetAllCitiesInState(int StateId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "city_get_all_in_state";
                var parameters = new DynamicParameters();
                parameters.Add("StateId", StateId);
                var cities = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Cities = cities
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
                            new ExceptionHandler(ex,"city_info_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet,Authorize()]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.CITY_VIEW)]
        public async Task<ActionResult> GetAllCities(int Page, string? SearchWith, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                int TotalRows = await GetCitiesCount(Connection, Page, SearchWith,Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                var procedure = "city_list";
                var parameters = new DynamicParameters();
                parameters.Add("Page", Page);
                parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
                parameters.Add("SearchWith", SearchWith);
                parameters.Add("Search", Search);
                var cities = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Cities = cities,
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
                            new ExceptionHandler(ex,"city_info_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<int> GetCitiesCount(SqlConnection Connection, int Page, string? SearchWith, string? Search)
        {
            var procedure = "city_count";
            var parameters = new DynamicParameters();
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("Search", Search);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.CITY_MANAGE)]
        public async Task<object> CreateCity(CityCreate city)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "city_create";
                var parameters = new DynamicParameters();
                parameters.Add("Name", city.Name);
                parameters.Add("Code", city.Code);
                parameters.Add("StateId", city.StateId);
                parameters.Add("TenantOfficeId", city.TenantOfficeId);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<CityCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCityCreated = true
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
                            new ExceptionHandler(ex,"city_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }


        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.CITY_MANAGE)]
        public async Task<object>EditCity(CityEdit city)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "city_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", city.Id);
                parameters.Add("Name", city.Name);
                parameters.Add("Code", city.Code);
                parameters.Add("StateId", city.StateId);
                parameters.Add("TenantOfficeId", city.TenantOfficeId);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<CityEdit>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCityUpdated = true
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
                            new ExceptionHandler(ex,"city_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.CITY_MANAGE)]
        public async Task<object> DeleteCity(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "city_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("city_delete_restricted_message");
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
                           new ExceptionHandler(ex,"city_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
