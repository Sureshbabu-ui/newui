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
using BeSureApi.Models;
using System.Drawing;
using System.Diagnostics.Eventing.Reader;

namespace BeSureApi.Controllers
{
    [Route("api/partstock")]
    [ApiController]
    public class PartStockController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public PartStockController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize(), HasPermission(InventoryBusinessFunctionCode.PARTSTOCK_LIST)]
        [Route("list")]
        public async Task<object> GetPartStocks(int Page, string? Search, string? TenantRegionId, string? PartType, string? TenantOfficeId, string? Make, string? ProductCategory, string? PartCategory, string? SubCategory, string? StockRoom, bool? IsUnderWarranty)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PartStockList> stockList = await GetPartStockList(connection, Page, Search, TenantRegionId, PartType, TenantOfficeId, Make, ProductCategory, PartCategory, SubCategory, StockRoom, IsUnderWarranty);
                int totalRows = await GetPartStockCount(connection, Search, TenantRegionId, PartType, TenantOfficeId, Make, ProductCategory, PartCategory, SubCategory, StockRoom, IsUnderWarranty);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartStocks = stockList,
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
                            new ExceptionHandler(ex,"part_stocklist_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PartStockList>> GetPartStockList(SqlConnection Connection, int Page, string? Search, string? TenantRegionId, string? PartType, string? TenantOfficeId, string? Make, string? ProductCategory, string? PartCategory, string? SubCategory, string? StockRoom, bool? IsUnderWarranty)
        {
            var procedure = "part_stock_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("TenantRegionId", TenantRegionId);
            parameters.Add("TenantOfficeId", TenantOfficeId);
            parameters.Add("PartType", PartType);          
            parameters.Add("Make", Make);
            parameters.Add("ProductCategory", ProductCategory);
            parameters.Add("PartCategory", PartCategory);
            parameters.Add("SubCategory", SubCategory);
            parameters.Add("StockRoom", StockRoom);
            var stockList = await Connection.QueryAsync<PartStockList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return stockList;
        }
        private async Task<int> GetPartStockCount(SqlConnection Connection, string? Search , string? TenantRegionId, string? PartType, string? TenantOfficeId, string? Make, string? ProductCategory, string? PartCategory, string? SubCategory, string? StockRoom, bool? IsUnderWarranty)
        {
            var procedure = "part_stock_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("Search", Search);
            parameters.Add("TenantRegionId", TenantRegionId);
            parameters.Add("TenantOfficeId", TenantOfficeId);
            parameters.Add("PartType", PartType);
            parameters.Add("Make", Make);
            parameters.Add("ProductCategory", ProductCategory);
            parameters.Add("PartCategory", PartCategory);
            parameters.Add("SubCategory", SubCategory);
            parameters.Add("StockRoom", StockRoom);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize(),HasPermission(InventoryBusinessFunctionCode.PARTSTOCK_CREATE)]
        [Route("create")]
        public async Task<object> CreatePartStock(PartStockCreate PartStock)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partstock_create";
                var parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("PartId", PartStock.PartId);
                parameters.Add("Quantity", PartStock.Quantity);
                parameters.Add("IsPartStockCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isPartStockCreated = parameters.Get<int>("@IsPartStockCreated");
                if (isPartStockCreated == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPartStockCreated = Convert.ToBoolean(isPartStockCreated)
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
                            new ExceptionHandler(ex,"partstock_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("selected/list/for/gin")]
        public async Task<ActionResult> GetSelectedPartstockList(int PartIndentDemandId, int? StockTypeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partstock_currentlocation_wise_list";
                var parameters = new DynamicParameters();
                parameters.Add("PartIndentDemandId", PartIndentDemandId);
                parameters.Add("@StockTypeId", StockTypeId);
                var partstockList = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        SelectPartStocks = partstockList
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
                            new ExceptionHandler(ex,"part_stock_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list/for/issue")]
        public async Task<ActionResult> GetPartstocksForIssue(int PartIndentDemandId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentdemand_issue_parts";
                var parameters = new DynamicParameters();
                parameters.Add("PartIndentDemandId", PartIndentDemandId);
                var partstockList = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        SelectPartStocks = partstockList
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
                            new ExceptionHandler(ex,"part_stock_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize(), HasPermission(InventoryBusinessFunctionCode.PARTSTOCK_LIST)]
        [Route("basketlist")]
        public async Task<object> GetPartStocksInBasket(string PartStockBasket)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partstocks_in_basket";
                var parameters = new DynamicParameters();
                parameters.Add("PartStockBasket", PartStockBasket);

                var partstocks = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartStockInBasket = partstocks
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

        [HttpGet]
        [Route("selected/list/for/partindentrequest")]
        public async Task<ActionResult> GetSelectedPartstockListForIndentRequest(int ServiceRequestId, string PartCategoryIdList)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentrequest_previous_installation_list";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", ServiceRequestId);
                parameters.Add("PartCategoryIdList", PartCategoryIdList);
                var partstockList = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        SelectPartStocks = partstockList
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
                            new ExceptionHandler(ex,"part_stock_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("details/forsme")]
        public async Task<ActionResult<PartDetailsForSme>> GetPartDetailsForSme(string BarCode)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "part_stock_details_for_sme";
                var parameters = new DynamicParameters();
                parameters.Add("BarCode", BarCode);
                var PartDetailsList = await connection.QueryAsync<PartDetailsForSme>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartDetail = PartDetailsList.FirstOrDefault()
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
                            new ExceptionHandler(ex,"partdetail_list_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
