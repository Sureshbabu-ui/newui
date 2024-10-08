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

namespace BeSureApi.Controllers
{
    [Route("api/deliverychallan")]
    [ApiController]
    public class DeliveryChallanController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public DeliveryChallanController(IConfiguration config, ILogService logService, IWebHostEnvironment hostingEnvironment)
        {
            _config = config;
            _logService = logService;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(DeliveryChallanBusinessFunctionCode.DELIVERYCHALLAN_CREATE)]
        public async Task<object> CreateDeliveryChallan(DeliveryChallan dc)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "deliverychallan_create";
                var parameters = new DynamicParameters();
                parameters.Add("DcTypeId", dc.DcTypeId);
                parameters.Add("PartIndentDemandNumber", dc.PartIndentDemandNumber);
                parameters.Add("DestinationTenantOfficeId", dc.DestinationTenantOfficeId);
                parameters.Add("DestinationVendorId", dc.DestinationVendorId);
                parameters.Add("DestinationEmployeeId", dc.DestinationEmployeeId);
                parameters.Add("DestinationCustomerSiteId", dc.DestinationCustomerSiteId);
                parameters.Add("LogisticsVendorId", dc.LogisticsVendorId);
                parameters.Add("LogisticsReceiptDate", dc.LogisticsReceiptDate);
                parameters.Add("LogisticsReceiptNumber", dc.LogisticsReceiptNumber);
                parameters.Add("ModeOfTransport", dc.ModeOfTransport);
                parameters.Add("TrackingId", dc.TrackingId);
                parameters.Add("PartStockData", JsonSerializer.Serialize(dc.partstocks));
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("@DeliveryChallanId", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync<DeliveryChallan>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int DeliveryChallanId = parameters.Get<int>("@DeliveryChallanId");

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsDCCreated = true
                        , DeliveryChallanId
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
                            new ExceptionHandler(ex, "failed_to_create_deliverychallan", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize]
        [Route("list")]
        [HasPermission(DeliveryChallanBusinessFunctionCode.DELIVERYCHALLAN_VIEW)]

        public async Task<ActionResult<List<DeliveryChallanList>>> GetAllDeliveryChallan(int Page, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<DeliveryChallanList> dclist = await GetDeliveryChallanList(Connection, Page, Search);
                int totalRows = await GetDeliveryChallanCount(Connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        DeliveryChallanList = dclist,
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
                            new ExceptionHandler(ex,"dc_list_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<DeliveryChallanList>> GetDeliveryChallanList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "deliverychallan_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var polist = await Connection.QueryAsync<DeliveryChallanList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return polist;
        }
        private async Task<int> GetDeliveryChallanCount(SqlConnection Connection, string? Search)
        {
            var procedure = "deliverychallan_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("details")]
        [HasPermission(DeliveryChallanBusinessFunctionCode.DELIVERYCHALLAN_VIEW)]

        public async Task<ActionResult> GetDeliveryChallanDetails (int DCId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "deliverychallan_details";
                var parameters = new DynamicParameters();
                parameters.Add("DCId", DCId);
                var dcinfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        DeliveryChallanDetails = dcinfo.First()
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
                            new ExceptionHandler(ex,"deliverychallan_details_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
