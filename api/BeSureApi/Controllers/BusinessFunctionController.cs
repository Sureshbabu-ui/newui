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
    [Route("api/businessfunction")]
    [ApiController]
    public class BusinessFunctionController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public BusinessFunctionController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize()]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.BUSINESSFUNCTION_VIEW)]
        public async Task<object> GetBusinessFunctions(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<BusinessFunctionList> functionList = await GetBusinessFunctionList(connection, Page, Search);
                int totalRows = await GetBusinessFunctionCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        BusinessFunction = functionList,
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
                            new ExceptionHandler(ex,"businessfunction_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<BusinessFunctionList>> GetBusinessFunctionList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "businessfunction_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var functionList = await Connection.QueryAsync<BusinessFunctionList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return functionList;
        }
        private async Task<int> GetBusinessFunctionCount(SqlConnection Connection, string? Search)
        {
            var procedure = "businessfunction_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

    }
}
