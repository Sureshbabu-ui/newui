using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/businessevent")]
    [ApiController]
    public class BusinessEventController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public BusinessEventController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpGet,Authorize()]
        [Route("get/titles")]
        public async Task<ActionResult> GetBusinessEventTitles()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "businessevent_get_names";
                var parameters = new DynamicParameters();
                var businesseventtitles = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { BusinessEventTitle = businesseventtitles } };
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
                            new ExceptionHandler(ex,"businessevent_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        
        [HttpGet, Authorize()]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.BUSINESSEVENT_VIEW)]
        public async Task<object> GetBusinessEvents(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<BusinessEvent> eventList = await GetBusinessEventList(connection, Page, Search);
                int totalRows = await GetBusinessEventCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        BusinessEvent = eventList,
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
                            new ExceptionHandler(ex,"businessevent_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<BusinessEvent>> GetBusinessEventList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "businessevent_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var eventList = await Connection.QueryAsync<BusinessEvent>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return eventList;
        }
        private async Task<int> GetBusinessEventCount(SqlConnection Connection, string? Search)
        {
            var procedure = "businessevent_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
    }
}