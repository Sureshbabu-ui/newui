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
using OfficeOpenXml;
using Org.BouncyCastle.Utilities;
using System.Linq;

namespace BeSureApi.Controllers
{
    [Route("api/bankcollection")]
    [ApiController]
    public class BankCollectionController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public BankCollectionController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize(),HasPermission(BankCollectionCode.BANKCOLLECTION_LIST)]
        [Route("list")]
        public async Task<object> GetBankCollections(string BankCollectionStatus, int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<BankCollectionList> collectionList = await GetBankCollectionList(connection, BankCollectionStatus, Page, Search);
                int totalRows = await GetBankCollectionCount(connection, BankCollectionStatus, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        BankCollections = collectionList,
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
                            new ExceptionHandler(ex,"bankcollectionlist_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<BankCollectionList>> GetBankCollectionList(SqlConnection Connection,string BankCollectionStatus, int Page, string? Search)
        {
            var procedure = "bankcollection_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("BankCollectionStatus", BankCollectionStatus);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var collectionList = await Connection.QueryAsync<BankCollectionList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return collectionList;
        }
        private async Task<int> GetBankCollectionCount(SqlConnection Connection,string BankCollectionStatus, string? Search)
        {
            var procedure = "bankcollection_count";
            var parameters = new DynamicParameters();
            parameters.Add("BankCollectionStatus", BankCollectionStatus);
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost("upload"),Authorize(), HasPermission(BankCollectionCode.BANKCOLLECTION_UPLOAD)]
        public async Task<IActionResult> UploadBankCollection([FromForm] BankCollectionUpload BankCollection)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                using var stream = BankCollection?.BankCollectionFile?.OpenReadStream();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var excelDetails = new ExcelPackage(stream);
                var worksheet = excelDetails.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;
                var columnCount = worksheet.Dimension.Columns;

                var expectedHeaders = new List<string> { "Tran Date", "Particulars" ,"Tran Type","Deposit"};

                //Taking the headers in excel to list
                var rowHeaders =new List<string>();
                for (int col =1 ; col<= columnCount; col++)
                {
                    rowHeaders.Add(worksheet.Cells[1, col]?.Value?.ToString()??"");
                }

                //Checking whether all expected headers are in excel sheet
                for (int col = 0; col < expectedHeaders.Count; col++)
                {
                    if (!rowHeaders.Contains(expectedHeaders[col]))
                        {
                            throw new CustomException("Invalid Excel");
                        }
                }

                var BankCollectionList = new List<Dictionary<string, object>>();

                for (int row = 2; row <= rowCount; row++)
                {
                    
                    var collectionRow = new Dictionary<string, object>();
                    collectionRow["Particulars"] = worksheet.Cells[row, rowHeaders.IndexOf("Particulars")+1].Value;
                    collectionRow["TransactionDate"] = DateTime.FromOADate(Convert.ToDouble(worksheet.Cells[row, rowHeaders.IndexOf("Tran Date")+1 ].Value));
                    collectionRow["Deposit"] = worksheet.Cells[row, rowHeaders.IndexOf( "Deposit")+1 ].Value;
                    if(collectionRow["Particulars"]!=null && collectionRow["TransactionDate"]!=null && collectionRow["Deposit"] !=null)
                        BankCollectionList.Add(collectionRow);
                }

                var procedure = "bankcollection_upload";
                var parameters = new DynamicParameters();
                parameters.Add("TenantBankAccountId",int.Parse(BankCollection.TenantBankAccountId)); 
                parameters.Add("BankCollections", JsonSerializer.Serialize(BankCollectionList));
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
               await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCollectionUploaded = true,
                    }
                })) ;
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                        new ExceptionHandler(ex, "bankcollectionupload_upload_failed_failed_message", _logService).GetMessage()
                       }
                     }
                }));
            }
        }

        [HttpPost, Authorize(), HasPermission(BankCollectionCode.BANKCOLLECTION_PROCESS)]
        [Route("process")]
        public async Task<object> ProcessCollection(BankCollectionProcessWithDetail CollectionData)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bankcollection_process";
                var parameters = new DynamicParameters();
                parameters.Add("BankCollectionId", CollectionData.BankCollection.Id);
                parameters.Add("TransactionDate", CollectionData.BankCollection.TransactionDate);
                parameters.Add("CustomerInfoId", CollectionData.BankCollection.CustomerInfoId);
                parameters.Add("PaymentMethodId", CollectionData.BankCollection.PaymentMethodId);
                parameters.Add("TransactionReferenceNumber", CollectionData.BankCollection.TransactionReferenceNumber);
                parameters.Add("TenantBankAccountId", CollectionData.BankCollection.TenantBankAccountId);
                parameters.Add("TransactionAmount", CollectionData.BankCollection.TransactionAmount);
                parameters.Add("InvoiceReceiptDetail", JsonSerializer.Serialize(CollectionData.InvoiceReceiptDetails));
                parameters.Add("ClaimedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<BankCollectionProcessWithDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
                  return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCollectionProcessed = true
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
                            new ExceptionHandler(ex,"bankcollectionprocess_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }


        [HttpGet, Authorize()]
        [Route("get/dashboard/detail")]
        public async Task<ActionResult> GetContractCustomerDetails()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bankcollection_dashboard_detail";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var collectionDashboardDetail = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = collectionDashboardDetail.First()
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
                            new ExceptionHandler(ex,"bankcollectionlist_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPut("{BankCollectionId}/ignore")]
        public async Task<ActionResult> UpdateItem(int BankCollectionId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bankcollection_ignore";
                var parameters = new DynamicParameters();
                parameters.Add("BankCollectionId", BankCollectionId);
                parameters.Add("IgnoredBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCollectionIgnored = true
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
                            new ExceptionHandler(ex,"bankcollectionignore_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost("chequeupload"), Authorize(), HasPermission(BankCollectionCode.BANKCOLLECTION_UPLOAD)]
        public async Task<IActionResult> UploadChequeCollection([FromForm] ChequeCollectionUpload ChequeCollection)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                using var stream = ChequeCollection?.ChequeCollectionFile?.OpenReadStream();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var excelDetails = new ExcelPackage(stream);
                var worksheet = excelDetails.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;
                var columnCount = worksheet.Dimension.Columns;

                var expectedHeaders = new List<string> { "Cheque Date", "Cheque Number", "Cheque Amount", "Cheque Realized On", "Cheque Returned On","Cheque Returned Reason" ,"Cheque Bank"};

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
                        throw new CustomException("Invalid Excel 2");
                    }
                }

                var ChequeCollectionList = new List<Dictionary<string, object>>();

                for (int row = 2; row <= rowCount; row++)
                {

                    var collectionRow = new Dictionary<string, object>();
                    collectionRow["Particulars"] = worksheet.Cells[row, rowHeaders.IndexOf("Cheque Number") + 1].Value;
                    collectionRow["TransactionDate"] = DateTime.FromOADate(Convert.ToDouble(worksheet.Cells[row, rowHeaders.IndexOf("Cheque Date") + 1].Value));
                    collectionRow["Deposit"] = worksheet.Cells[row, rowHeaders.IndexOf("Cheque Amount") + 1].Value;
                    collectionRow["ChequeRealizedOn"] = worksheet.Cells[row, rowHeaders.IndexOf("Cheque Realized On") + 1].Value!=null? DateTime.FromOADate(Convert.ToDouble(worksheet.Cells[row, rowHeaders.IndexOf("Cheque Realized On") + 1].Value)):null;
                    collectionRow["ChequeReturnedOn"] = worksheet.Cells[row, rowHeaders.IndexOf("Cheque Returned On") + 1].Value !=null? DateTime.FromOADate(Convert.ToDouble(worksheet.Cells[row, rowHeaders.IndexOf("Cheque Returned On") + 1].Value)):null;
                    collectionRow["ChequeReturnedReason"] = worksheet.Cells[row, rowHeaders.IndexOf("Cheque Returned Reason") + 1].Value;
                    collectionRow["CustomerBankName"] = worksheet.Cells[row, rowHeaders.IndexOf("Cheque Bank") + 1].Value;

                    if (collectionRow["Particulars"] != null && collectionRow["TransactionDate"] != null && collectionRow["Deposit"] != null && collectionRow["CustomerBankName"] != null)
                        ChequeCollectionList.Add(collectionRow);
                }

                var procedure = "bankcollection_cheque_upload";
                var parameters = new DynamicParameters();
                parameters.Add("TenantBankAccountId", int.Parse(ChequeCollection.TenantBankAccountId));
                parameters.Add("ChequeCollections", JsonSerializer.Serialize(ChequeCollectionList));
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
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
                        new ExceptionHandler(ex, "bankcollectionupload_cheque_upload_failed_failed_message", _logService).GetMessage()
                       }
                    }
                }));
            }
        }

        [HttpPost, Authorize(), HasPermission(BankCollectionCode.BANKCOLLECTION_UPLOAD)]
        [Route("cancel/claim")]
        public async Task<object> CancelClaim(BankCollectionCancelClaim CollectionCancelData)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bankcollection_cancel_claim";
                var parameters = new DynamicParameters();
                parameters.Add("BankCollectionId", CollectionCancelData.Id);
                parameters.Add("CancelReason", CollectionCancelData.CancelReason);
                parameters.Add("CancelledBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<BankCollectionProcessWithDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsClaimCancelled = true
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
                            new ExceptionHandler(ex,"bankcollectioncanclclaim_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/details")]
        public async Task<ActionResult<BankCollectionDetailWithReceiptList>> GetBankCollectionDetailWithReceiptList(int BankCollectionId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bankcollection_detail";
                var parameters = new DynamicParameters();
                parameters.Add("BankCollectionId", BankCollectionId);
                var collectionDetail = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                IEnumerable<CollectionReceiptList> receiptList = await GetReceiptListByBankCollection(connection, BankCollectionId);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        BankCollectionDetail = collectionDetail.FirstOrDefault(),
                        CollectionReceiptList = receiptList
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
                            new ExceptionHandler(ex,"bankcollectiondetail_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<CollectionReceiptList>> GetReceiptListByBankCollection(SqlConnection Connection, int BankCollectionId)
        {
            var procedure = "receipt_list_by_bankcollection";
            var parameters = new DynamicParameters();
            parameters.Add("BankCollectionId", BankCollectionId);
            return await Connection.QueryAsync<CollectionReceiptList>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }
    }
}