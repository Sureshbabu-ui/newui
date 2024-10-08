using BeSureApi.Services.LogService;
using BeSureApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BeSureApi.Exceptions;
using Dapper;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/invoice")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {

        private readonly IConfiguration _config;
        private readonly ILogService _logService;
           public InvoiceController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet,Authorize()]
        [Route("list")]
        [HasPermission(ContractInvoiceBusinessFunctionCode.INVOICE_LIST)]
        public async Task<object> GetInvoiceSchedule(int Page,string? Filters, string? SearchWith)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<InvoiceScheduleList> scheduleList = await GetInvoiceScheduleList(connection,Page, Filters, SearchWith);
                int totalRows = await GetInvoiceScheduleCount(connection, Filters, SearchWith);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        InvoiceScheduleList = scheduleList,
                        TotalRows = totalRows,
                        PerPage = int.Parse(_config.GetSection("Pagination:PerPage").Value)
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
                            new ExceptionHandler(ex,"contract_invoice_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<InvoiceScheduleList>> GetInvoiceScheduleList(SqlConnection Connection,int Page,string? Filters,string? SearchWith)
        {
            var procedure = "invoiceschedule_list";
            var parameters = new DynamicParameters();
            parameters.Add("Filters", Filters);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            var scheduleList = await Connection.QueryAsync<InvoiceScheduleList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return scheduleList;
        }

        private async Task<int> GetInvoiceScheduleCount(SqlConnection Connection, string? Filters, string? SearchWith)
        {
            var procedure = "invoiceschedule_count";
            var parameters = new DynamicParameters();
            parameters.Add("Filters", Filters);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet, Authorize()]
        [Route("collection/detail")]
        [HasPermission(ContractInvoiceBusinessFunctionCode.INVOICE_LIST)]
        public async Task<ActionResult<InvoiceCollectionViewWithReceipt>> GetInvoiceCollectionDetail(int InvoiceId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<InvoiceCollectionDetail> invoiceDetail = await GetInvoiceCollectionData(connection,InvoiceId);
                IEnumerable<ReceiptListForInvoice> invoiceReceiptList = await GetInvoiceReceiptList(connection, InvoiceId);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        InvoiceDetail=invoiceDetail.FirstOrDefault(),
                        InvoiceReceiptList=invoiceReceiptList
                    },                    
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
                            new ExceptionHandler(ex,"invoicecollectiondetail_text_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<InvoiceCollectionDetail>> GetInvoiceCollectionData(SqlConnection Connection, int InvoiceId)
        {
            var procedure = "invoice_collection_detail";
            var parameters = new DynamicParameters();
            parameters.Add("InvoiceId", InvoiceId);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            var scheduleList = await Connection.QueryAsync<InvoiceCollectionDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return scheduleList;
        }

        private async Task<IEnumerable<ReceiptListForInvoice>> GetInvoiceReceiptList(SqlConnection Connection, int InvoiceId)
        {
            var procedure = "receipt_list_by_invoice";
            var parameters = new DynamicParameters();
            parameters.Add("InvoiceId", InvoiceId);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            var receiptList = await Connection.QueryAsync<ReceiptListForInvoice>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return receiptList;
        }
    }
}
