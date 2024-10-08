using BeSureApi.Services.LogService;
using BeSureApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using OfficeOpenXml;

namespace BeSureApi.Controllers
{
    [Route("api/invoicereconciliation")]
    [ApiController]
    public class InvoiceReconciliationController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public InvoiceReconciliationController(IConfiguration config, ILogService logService, IPdfService pdfService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize()]
        [Route("list")]
        [HasPermission(InvoiceReconciliationBusinessFunctionCode.INVOICERECONCILIATION_LIST)]
        public async Task<object> GetInvoiceReconciliations(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<InvoiceReconciliationList> invoiceList = await GetInvoiceReconciliationList(connection, Page, Search);
                int totalRows = await GetInvoiceReconciliationCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        InvoiceReconciliationList = invoiceList,
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
                            new ExceptionHandler(ex,"invoicereconciliationlist_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<InvoiceReconciliationList>> GetInvoiceReconciliationList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "invoicereconciliation_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var invoiceReconciliationList = await Connection.QueryAsync<InvoiceReconciliationList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return invoiceReconciliationList;
        }

        private async Task<int> GetInvoiceReconciliationCount(SqlConnection Connection, string? Search)
        {
            var procedure = "invoicereconciliation_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost("tds/upload"), Authorize(), HasPermission(InvoiceReconciliationBusinessFunctionCode.INVOICERECONCILIATION_UPDATE)]
        public async Task<IActionResult> UploadTdsCollection([FromForm] InvoiceReconciliationTdsUpload TaxDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                using var stream = TaxDetails?.CollectionFile?.OpenReadStream();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var excelDetails = new ExcelPackage(stream);
                var worksheet = excelDetails.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;
                var columnCount = worksheet.Dimension.Columns;

                var expectedHeaders = new List<string> { "LOCATION", "INVOICENO", "TDS" };

                //Taking the headers in excel to list
                var rowHeaders = new List<string>();
                for (int col = 1; col <= columnCount; col++)
                {
                    rowHeaders.Add(worksheet.Cells[1, col]?.Value?.ToString() ?? "");
                }

                //Checking whether all expected headers are in excel sheet
                for (int col = 0; col < expectedHeaders.Count; col++)
                {
                    if (!rowHeaders.Contains(expectedHeaders[col]))
                    {
                        throw new CustomException("invoicereconciliation_tds_upload_invalidexcel");
                    }
                }

                var TdsCollectionList = new List<Dictionary<string, object>>();

                for (int row = 2; row <= rowCount; row++)
                {

                    var collectionRow = new Dictionary<string, object>();
                    collectionRow["LOCATION"] = worksheet.Cells[row, rowHeaders.IndexOf("LOCATION")+1 ].Value;
                    collectionRow["InvoiceNum"] =worksheet.Cells[row, rowHeaders.IndexOf("INVOICENO")+1 ].Value;
                    collectionRow["TdsAmount"] = worksheet.Cells[row, rowHeaders.IndexOf("TDS")+1 ].Value;
                    if (collectionRow["LOCATION"] != null && collectionRow["InvoiceNum"] != null && collectionRow["TdsAmount"] != null)
                        TdsCollectionList.Add(collectionRow);
                    else
                        throw new CustomException("invoicereconciliation_tds_upload_invalidexcel");
                }

                var procedure = "invoicereconciliation_tds_upload";
                var parameters = new DynamicParameters();
                parameters.Add("InvoiceTdsDetail", JsonSerializer.Serialize(TdsCollectionList));
                parameters.Add("UploadedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCollectionUploaded = true,
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
                        new ExceptionHandler(ex, "invoicereconciliation_tds_upload_failed_message", _logService).GetMessage()
                       }
                    }
                }));
            }
        }

        [HttpPost("gsttds/upload"), Authorize(), HasPermission(InvoiceReconciliationBusinessFunctionCode.INVOICERECONCILIATION_UPDATE)]
        public async Task<IActionResult> UploadGstTdsCollection([FromForm] InvoiceReconciliationTdsUpload TaxDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                using var stream = TaxDetails?.CollectionFile?.OpenReadStream();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var excelDetails = new ExcelPackage(stream);
                var worksheet = excelDetails.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;
                var columnCount = worksheet.Dimension.Columns;

                var expectedHeaders = new List<string> { "LOCATION", "INVOICENO", "GSTTDS" };

                //Taking the headers in excel to list
                var rowHeaders = new List<string>();
                for (int col = 1; col <= columnCount; col++)
                {
                    rowHeaders.Add(worksheet.Cells[1, col]?.Value?.ToString() ?? "");
                }

                //Checking whether all expected headers are in excel sheet
                for (int col = 0; col < expectedHeaders.Count; col++)
                {
                    if (!rowHeaders.Contains(expectedHeaders[col]))
                    {
                        throw new CustomException("invoicereconciliation_gsttds_upload_invalidexcel");
                    }
                }

                var TdsCollectionList = new List<Dictionary<string, object>>();

                for (int row = 2; row <= rowCount; row++)
                {

                    var collectionRow = new Dictionary<string, object>();
                    collectionRow["LOCATION"] = worksheet.Cells[row, rowHeaders.IndexOf("LOCATION") + 1].Value;
                    collectionRow["InvoiceNum"] = worksheet.Cells[row, rowHeaders.IndexOf("INVOICENO") + 1].Value;
                    collectionRow["GstTdsPaidAmount"] = worksheet.Cells[row, rowHeaders.IndexOf("GSTTDS") + 1].Value;
                    if (collectionRow["LOCATION"] != null && collectionRow["InvoiceNum"] != null && collectionRow["GstTdsPaidAmount"] != null)
                        TdsCollectionList.Add(collectionRow);
                    else
                        throw new CustomException("invoicereconciliation_gsttds_upload_invalidexcel");
                }

                var procedure = "invoicereconciliation_gsttds_upload";
                var parameters = new DynamicParameters();
                parameters.Add("InvoiceTdsDetail", JsonSerializer.Serialize(TdsCollectionList));
                parameters.Add("UploadedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCollectionUploaded = true,
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
                        new ExceptionHandler(ex, "invoicereconciliation_gsttds_upload_failed_message", _logService).GetMessage()
                       }
                    }
                }));
            }
        }
    }
}