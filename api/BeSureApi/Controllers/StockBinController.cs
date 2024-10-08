using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using static BeSureApi.Models.StockBin;

namespace BeSureApi.Controllers
{
    [Route("api/stockbin")]
    [ApiController]
    public class StockBinController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public StockBinController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.STOCKBIN_MANAGE)]
        public async Task<object> CreateStockBin(StockBinCreate StockBin)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "stockbin_create";
                var parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("BinName", StockBin.BinName);
                parameters.Add("BinCode", StockBin.BinCode);
                parameters.Add("IsActive", StockBin.IsActive);
                await connection.QueryAsync<StockBinCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsStockBinCreated = true
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
                            new ExceptionHandler(ex,"stockbin_api_stockbincreate_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.STOCKBIN_MANAGE)]
        public async Task<object> UpdateStockBin(StockBinEdit StockBin)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "stockbin_update";
                var parameters = new DynamicParameters();
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("BinName", StockBin.BinName);
                parameters.Add("Id", StockBin.Id);
                parameters.Add("IsActive", StockBin.IsActive);
                await connection.QueryAsync<StockBinCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsStockBinUpdated = true
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
                            new ExceptionHandler(ex,"stockbin_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("get/list")]
        [HasPermission(MasterDataBusinessFunctionCode.STOCKBIN_VIEW)]
        public async Task<object> GetStockBins(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<StockBinList> stockBinList = await GetStockBinList(connection, Page, Search);
                int totalRows = await GetStockBinCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        StockBins = stockBinList,
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
                            new ExceptionHandler(ex,"stockbin_api_no_records_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<StockBinList>> GetStockBinList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "stockbin_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var stockBins = await Connection.QueryAsync<StockBinList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return stockBins;
        }

        private async Task<int> GetStockBinCount(SqlConnection Connection, string? Search)
        {
            var procedure = "stockbin_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.STOCKBIN_MANAGE)]
        public async Task<object> DeleteStockBin(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "stockbin_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("stockbin_delete_restricted_message");
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
                           new ExceptionHandler(ex,"stockbin_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
