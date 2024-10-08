using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace BeSureApi.Controllers
{
    [Route("api/partstockdetail")]
    [ApiController]
    public class PartStockDetailController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public PartStockDetailController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize(), HasPermission(InventoryBusinessFunctionCode.PARTSTOCK_LIST)]
        [Route("list")]
        public async Task<object> GetPartStockDetails(int? PartId,int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PartStockDetailList> stockDetailList = await GetPartStockDetailList(connection,PartId, Page, Search);
                int totalRows = await GetPartStockDetailCount(connection,PartId, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartStockDetails = stockDetailList,
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
                            new ExceptionHandler(ex,"partstocklist_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PartStockDetailList>> GetPartStockDetailList(SqlConnection Connection,int? PartId, int Page, string? Search)
        {
            var procedure = "partstockdetail_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PartId", PartId);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var stockDetailList = await Connection.QueryAsync<PartStockDetailList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return stockDetailList;
        }
        private async Task<int> GetPartStockDetailCount(SqlConnection Connection,int?PartId, string? Search)
        {
            var procedure = "partstockdetail_count";
            var parameters = new DynamicParameters();
            parameters.Add("PartId", PartId);
            parameters.Add("Search", Search);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
    }
}
