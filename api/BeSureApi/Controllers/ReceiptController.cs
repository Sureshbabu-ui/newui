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
    [Route("api/receipt")]
    [ApiController]
    public class ReceiptController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ReceiptController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize()]
        [Route("list")]
        public async Task<object> GetReceipts(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ReceiptList> receiptList = await GetReceiptList(connection, Page, Search);
                int totalRows = await GetReceiptCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Receipts = receiptList,
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
                            new ExceptionHandler(ex,"No records found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<ReceiptList>> GetReceiptList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "receipt_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            return await Connection.QueryAsync<ReceiptList>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }
        private async Task<int> GetReceiptCount(SqlConnection Connection, string? Search)
        {
            var procedure = "receipt_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("get/details")]

        public async Task<ActionResult<ReceiptViewWithDetail>> GetContractInvoiceDetails(int ReceiptId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "receipt_detail";
                var parameters = new DynamicParameters();
                parameters.Add("ReceiptId", ReceiptId);
                var contractInvoiceDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var InvoiceDetail = new ContractInvoiceDetailController(_config, _logService);
                IEnumerable<InvoiceReceiptList> invoiceDetailList = await GetInvoiceReceiptList(connection, ReceiptId);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Receipt = contractInvoiceDetails.FirstOrDefault(),
                        InvoiceReceiptList = invoiceDetailList
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
                            new ExceptionHandler(ex,"receipt_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<InvoiceReceiptList>> GetInvoiceReceiptList(SqlConnection Connection, int ReceiptId)
        {
            var procedure = "invoicereceipt_list";
            var parameters = new DynamicParameters();
            parameters.Add("ReceiptId", ReceiptId);
            return await Connection.QueryAsync<InvoiceReceiptList>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

        [HttpGet]
        [Route("get/collectionpending/bargraphdetails")]
        public async Task<ActionResult> GetCollectionPendingBarGraphDetails(string StartDate, string EndDate, int? RegionId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "collection_pending_bargraph_detail";
                var parameters = new DynamicParameters();
                parameters.Add("RegionId", RegionId);
                parameters.Add("StartDate", StartDate);
                parameters.Add("EndDate", EndDate);
                var collectionBarGraphDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CollectionBarGraphDetails = collectionBarGraphDetails
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
                            new ExceptionHandler(ex,"receipt_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/collectionmade/bargraphdetails")]
        public async Task<ActionResult> GetCollectionMadeBarGraphDetails(string StartDate, string EndDate, int? RegionId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "collection_made_bargraph_detail";
                var parameters = new DynamicParameters();
                parameters.Add("RegionId", RegionId);
                parameters.Add("StartDate", StartDate);
                parameters.Add("EndDate", EndDate);
                var collectionBarGraphDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CollectionBarGraphDetails = collectionBarGraphDetails
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
                            new ExceptionHandler(ex,"receipt_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

    }
}