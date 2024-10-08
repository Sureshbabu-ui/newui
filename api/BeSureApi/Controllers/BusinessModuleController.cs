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
using BeSureApi.Models;

namespace BeSureApi.Controllers
{
    [Route("api/businessmodule")]
    [ApiController]
    public class BusinessModuleController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public BusinessModuleController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize()]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.BUSINESSMODULE_VIEW)]
        public async Task<object> GetBusinessModules(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<BusinessModuleList> businessModuleList = await GetBusinessModuleList(connection, Page, Search);
                int totalRows = await GetBusinessModuleCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        BusinessModule = businessModuleList,
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
                            new ExceptionHandler(ex,"businessmodule_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<BusinessModuleList>> GetBusinessModuleList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "businessmodule_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var eventList = await Connection.QueryAsync<BusinessModuleList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return eventList;
        }
        private async Task<int> GetBusinessModuleCount(SqlConnection Connection, string? Search)
        {
            var procedure = "businessmodule_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpGet, Authorize()]
        [Route("listnames")]
        public async Task<object> GetBusinessModulesNames()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "businessmodule_name_list";
                var businessModuleList = await connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        BusinessModule = businessModuleList,
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
                            new ExceptionHandler(ex,"businessmodulenamelist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
