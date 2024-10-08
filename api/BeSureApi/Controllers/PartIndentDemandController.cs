using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Services.LogService;
using static BeSureApi.Models.CustomerSite;

namespace BeSureApi.Controllers
{
    [Route("api/partindentdemand")]
    [ApiController]
    public class PartIndentDemandController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public PartIndentDemandController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize]
        [Route("list/cwh/needed"), HasPermission(PartIndentDemandBusinessFunctionCode.PARTINDENTDEMAND_LIST_WAITING_FOR_CWH_ATTENTION)]
        public async Task<ActionResult<List<PartIndentDemandList>>> GetPartIndentDemandsCWHAttentionNeeded(int Page, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PartIndentDemandList> partindentdemandlist = await GetDemandsCWFAttentionNeeded(Connection, Page, Search);
                int totalRows = await GetDemandsCountCWFAttentionNeeded(Connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartIndentDemandList = partindentdemandlist,
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
                            new ExceptionHandler(ex,"partindentdemand_list_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PartIndentDemandList>> GetDemandsCWFAttentionNeeded(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "partindentdemand_cwh_attention_needed_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            var partindentdemandlist = await Connection.QueryAsync<PartIndentDemandList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return partindentdemandlist;
        }
        private async Task<int> GetDemandsCountCWFAttentionNeeded(SqlConnection Connection, string? Search)
        {
            var procedure = "partindentdemand_cwh_attention_needed_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPut, Authorize()]
        [Route("requestpo"), HasPermission(PartIndentDemandBusinessFunctionCode.PARTINDENTDEMAND_REQUESTPO)]
        public async Task<object> RequestPurchaseOrder(RequestPO requestpo)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentdemand_requestpo";
                var parameters = new DynamicParameters();
                parameters.Add("Id", requestpo.Id);
                parameters.Add("VendorId", requestpo.VendorId);
                parameters.Add("Price", requestpo.Price);
                parameters.Add("StockTypeId", requestpo.StockTypeId);
                parameters.Add("WarrantyPeriod", requestpo.WarrantyPeriod);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<RequestPO>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsUpdated = true
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
                            new ExceptionHandler(ex,"requestpo_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("details"),HasPermission(PartIndentDemandBusinessFunctionCode.PARTINDENTDEMAND_VIEW)]
        public async Task<ActionResult> GetPartIndentDemandDetails(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentdemand_detail";
                var parameters = new DynamicParameters();
                parameters.Add("@Id", Id);
                var indentdemandetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Indentdemandetails = indentdemandetails.First()
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
                            new ExceptionHandler(ex,"partindentdemand_detail_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize]
        [Route("list/cwh/not/needed"), HasPermission(PartIndentDemandBusinessFunctionCode.PARTINDENTDEMAND_LIST_FOR_LOGISTICS)]
        public async Task<ActionResult<List<PartIndentDemandLogistics>>> PartIndentDemandsCWHAttentionNotNeeded(int Page,bool IsCompleted, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PartIndentDemandLogistics> partindentdemandlist = await GetDemandsCWFAttentionNotNeeded(Connection, Page, IsCompleted, Search);
                int totalRows = await GetDemandsCountCWFAttentionNotNeeded(Connection, IsCompleted, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartIndentDemandList = partindentdemandlist,
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
                            new ExceptionHandler(ex,"partindentdemand_list_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PartIndentDemandLogistics>> GetDemandsCWFAttentionNotNeeded(SqlConnection Connection, int Page, bool IsCompleted, string? Search)
        {
            var procedure = "partindentdemand_cwh_attention_not_needed_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("IsCompleted", IsCompleted);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            var partindentdemandlist = await Connection.QueryAsync<PartIndentDemandLogistics>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return partindentdemandlist;
        }
        private async Task<int> GetDemandsCountCWFAttentionNotNeeded(SqlConnection Connection, bool IsCompleted, string? Search)
        {
            var procedure = "partindentdemand_cwh_attention_not_needed_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("IsCompleted", IsCompleted);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("unprocessed/list")]
        public async Task<ActionResult> GetUnProcessedDemands()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentdemand_unprocessed_list";
                var demandlist = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        DemandList = demandlist
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
                            new ExceptionHandler(ex,"partindentdemand_list_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("details/for/po")]
        public async Task<ActionResult> GetIndentDemandDetails(string Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentdemand_details_bulk_purchase_order";
                var parameters = new DynamicParameters();
                parameters.Add("DemandIdList", Id);
                var indentdemandetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Indentdemandetails = indentdemandetails
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
                            new ExceptionHandler(ex,"partindentdemand_detail_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
