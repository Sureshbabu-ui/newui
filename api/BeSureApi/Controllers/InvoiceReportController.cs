using BeSureApi.Exceptions;
using BeSureApi.Services.ExcelService;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using System.Xml.Linq;
using Microsoft.AspNetCore.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/report/invoice")]
    [ApiController]
    public class InvoiceReportController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IExcelService _excelService;
        private readonly ILogService _logService;
        public InvoiceReportController(IConfiguration config, ILogService logService, IExcelService excelService)
        {
            _config = config;
            _excelService = excelService;
            _logService = logService;
        }

        [HttpGet]
        [Route("collection")]
        [Authorize()]
        public async Task<ActionResult> DownloadCollectionReport(string? DateFrom, string? DateTo,  int? TenantRegionId, int? TenantOfficeId, int? CustomerGroupId, int? CustomerId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "invoicecollection_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("CustomerGroupId", CustomerGroupId);
                parameters.Add("CustomerId", CustomerId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var invoiceColletion = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    {"OfficeName", "Location" },
                    {"RegionName", "Region " },
                    {"GroupName", "Group Name" },
                    {"InvoiceNumber", "Invoice Number" },
                    { "InvoiceDate", "Invoice Date" },
                    { "NetInvoiceAmount", "Invoice Amount" },
                    {"PoNumber","PO Number" },
                    {"ContractNumber","Contract Number" },
                    { "NameOnPrint", "Customer" },
                    { "ReceiptDate", "Receipt Date" },
                    { "PaymentMethod", "Payment Mode" },
                    { "CollectedAmount", "Amount Received" },
                    { "TdsPaidAmount", "TDS" },
                    { "GstTdsPaidAmount", "GST TDS" },
                    {"TotalCollection","Total Collcetion" },
                    { "TransactionReferenceNumber", "CardNo/UTRNo/ChequeNo" },
                    {"TransactionDate","CardDate/UTRDate/ChequeDate" },
                    {"ChequeRealizedOn","Cheque Realized On" },
                    {"CustomerBankName","Customer Bank Name" },
                    { "ClaimedBy", "Executive" },
                  };

                var records = new List<object[]>();
                foreach (var collectionInfo in invoiceColletion)
                {
                    var dictionaryCollection = (IDictionary<string, object>)collectionInfo;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryCollection[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "invoicecollection_detail.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"invoicecollection_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("outstandingpayment")]
        [Authorize()]
        public async Task<ActionResult> DownloadOutstandingPaymentReport(string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId, int? CustomerGroupId, int? CustomerId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "outstandingpayment_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("CustomerGroupId", CustomerGroupId);
                parameters.Add("CustomerId", CustomerId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var outstandingPayment = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    {"OfficeName", "Location" },
                    {"RegionName", "Region " },
                    {"GroupName", "Group Name" },
                    {"InvoiceNumber", "Invoice Number" },
                    { "InvoiceDate", "Invoice Date" },
                    {"PoNumber","PO Number" },
                    {"ContractNumber","Contract Number" },
                    { "NameOnPrint", "Customer" },
                    { "NetInvoiceAmount", "Invoice Amount" },
                    {"TotalCollection","Total Collcetion" },
                    { "OutstandingAmount", "Outstanding Amount" },
                    { "SalesPerson", "Executive" },
                  };

                var records = new List<object[]>();
                foreach (var paymentInfo in outstandingPayment)
                {
                    var dictionaryPayment = (IDictionary<string, object>)paymentInfo;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryPayment[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "outstanding_detail.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"outstandingpayment_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("revenuedue")]
        [Authorize()]
        public async Task<ActionResult> DownloadRevenueDueReport(string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId, int? CustomerGroupId,int? CustomerId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "revenuedue_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("CustomerGroupId", CustomerGroupId);
                parameters.Add("CustomerId", CustomerId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var outstandingPayment = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {                   
                    {"RegionName", "Region " },
                    {"OfficeName", "Location" },
                    {"ContractNumber","Contract Number" },
                    { "BookingDate", "Contract Date" },
                    { "StartDate", "Period From" },
                    { "EndDate", "Period To" },
                    {"GroupName", "Group Name" },
                    { "NameOnPrint", "Customer Name" },
                    {"DueDate","Due Date" },
                    {"PaymentPeriodFrom" ,"Payment Period From"},
                    {"PaymentPeriodTo" ,"Payment Period To"},
                    {"ScheduledInvoiceAmount","Amount Due" },
                    {"BookingType","Type" },
                    {"PaymentType","Pay Terms" },
                    {"InvoiceBlocked","Invoice Blocked" },
                    {"PoNumber","PO Number" },
                    {"OutStanding","OutStanding" },
                    { "TotalOutStandingAmount", "Outstanding Value" },
                    {"InvoiceSubmitType","Invoice Submit Type" },
                    {"LastStatusDate","Last Status Date" },
                    {"StatusUpdate","StatusUpdate" }
                  };

                var records = new List<object[]>();
                foreach (var paymentInfo in outstandingPayment)
                {
                    var dictionaryPayment = (IDictionary<string, object>)paymentInfo;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryPayment[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "revenuedue.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"revenuedue_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("billingdetail")]
        [Authorize()]
        public async Task<ActionResult> DownloadBillingDetailReport(string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId, int? CustomerGroupId, int? CustomerId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "billingdetail_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("CustomerGroupId", CustomerGroupId);
                parameters.Add("CustomerId", CustomerId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var outstandingPayment = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    {"RegionName", "Region " },
                    {"OfficeName", "Location" },
                    {"GroupName", "Group Name" },
                    { "NameOnPrint", "Customer Name" },
                    {"ContractNumber","Contract Number" },
                    {"BookingType","Type" },
                    {"InvoiceNumber","Invoice Number" },
                    {"DueDate","Due Date" },
                    {"InvoiceDate","Invoice Date" },
                    {"PaymentPeriodFrom" ,"Payment Period From"},
                    {"PaymentPeriodTo" ,"Payment Period To"},
                    {"NetInvoiceAmount","Revenue" },
                    {"Gst","Gst" },
                    {"ScheduledInvoiceAmount","Accel Share" },
                  };

                var records = new List<object[]>();
                foreach (var paymentInfo in outstandingPayment)
                {
                    var dictionaryPayment = (IDictionary<string, object>)paymentInfo;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryPayment[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "billingdetail.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"billingdetail_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
