using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Models;
using Microsoft.VisualBasic;
using BeSureApi.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using Microsoft.AspNetCore.Mvc.RazorPages;
using BeSureApi.Services;

namespace BeSureApi.Controllers
{
    [Route("api/goodsissuereceivednote")]
    [ApiController]
    public class GoodsIssueReceivedNoteController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IPdfService _pdfService;
        public GoodsIssueReceivedNoteController(IConfiguration config,ILogService logService, IWebHostEnvironment hostingEnvironment, IPdfService pdfService)
        {
            _config = config;
            _logService = logService;
            _hostingEnvironment = hostingEnvironment;
            _pdfService = pdfService;
        }

        [HttpPost, Authorize()]
        [Route("allocate")]
        [HasPermission(PartIndentDemandBusinessFunctionCode.PARTINDENTDEMAND_CREATE_GIN)]
        public async Task<object> PartAllocation(PartAllocation allocate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "goodsissuereceivednote_part_allocate";
                var parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("PartIndentDemandId", allocate.PartIndentDemandId);
                parameters.Add("TenantOfficeId", allocate.TenantOfficeId);
                parameters.Add("PartStockData", JsonSerializer.Serialize(allocate.PartStockData));
                await connection.QueryAsync<PartAllocation>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsAllocated = true
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
                            new ExceptionHandler(ex, "failed_to_create_gin", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("issue/parts")]
        [HasPermission(PartIndentDemandBusinessFunctionCode.PARTINDENTDEMAND_CREATE_GIN)]
        public async Task<object> IssuePartsForEngineer(IssueParts issuestocks)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();
            using (var transaction = connection.BeginTransaction())
            {
                try
                {
                    if (issuestocks.Mode == "ISM_BHND")
                    {
                        var procedure = "goodsissuereceivednote_issue_parts";
                        var parameters = new DynamicParameters();
                        parameters.Add("ModifiedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                        parameters.Add("PartIndentDemandId", issuestocks.issueparts.PartIndentDemandId);
                        parameters.Add("Remarks", issuestocks.issueparts.Remarks);
                        await connection.QueryAsync<IssueParts>(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                    }
                    else if (issuestocks.Mode == "ISM_BCER")
                    {
                        var procedure = "deliverychallan_create";
                        var parameters = new DynamicParameters();
                        parameters.Add("DcTypeId", issuestocks.deliverychallan.DcTypeId);
                        parameters.Add("PartIndentDemandNumber", issuestocks.deliverychallan.PartIndentDemandNumber);
                        parameters.Add("DestinationTenantOfficeId", issuestocks.deliverychallan.DestinationTenantOfficeId);
                        parameters.Add("DestinationVendorId", issuestocks.deliverychallan.DestinationVendorId);
                        parameters.Add("DestinationEmployeeId", issuestocks.deliverychallan.DestinationEmployeeId);
                        parameters.Add("DestinationCustomerSiteId", issuestocks.deliverychallan.DestinationCustomerSiteId);
                        parameters.Add("LogisticsVendorId", issuestocks.deliverychallan.LogisticsVendorId);
                        parameters.Add("LogisticsReceiptDate", issuestocks.deliverychallan.LogisticsReceiptDate);
                        parameters.Add("LogisticsReceiptNumber", issuestocks.deliverychallan.LogisticsReceiptNumber);
                        parameters.Add("ModeOfTransport", issuestocks.deliverychallan.ModeOfTransport);
                        parameters.Add("TrackingId", issuestocks.deliverychallan.TrackingId);
                        parameters.Add("PartStockData", JsonSerializer.Serialize(issuestocks.deliverychallan.partstocks));
                        parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                        parameters.Add("@DeliveryChallanId", dbType: DbType.Int32, direction: ParameterDirection.Output);

                        await connection.QueryAsync<DeliveryChallan>(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                        int DeliveryChallanId = parameters.Get<int>("@DeliveryChallanId");

                        if (DeliveryChallanId > 0)
                        {
                            procedure = "goodsissuereceivednote_issue_parts";
                            parameters = new DynamicParameters();
                            parameters.Add("ModifiedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                            parameters.Add("PartIndentDemandId", issuestocks.issueparts.PartIndentDemandId);
                            parameters.Add("DeliveryChallanId", DeliveryChallanId);
                            parameters.Add("Remarks", issuestocks.issueparts.Remarks);
                            await connection.QueryAsync<IssueParts>(procedure, parameters, commandType: CommandType.StoredProcedure , transaction: transaction);
                        }
                    }
                    transaction.Commit();
                    return Ok(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status200OK,
                        data = new
                        {
                            IsPartIssued = true
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
                                new ExceptionHandler(ex, "failed_to_issue_parts", _logService).GetMessage()
                            }
                        }
                    }));
                }
            }
        }

        [HttpGet]
        [Route("details"), HasPermission(PartIndentDemandBusinessFunctionCode.PARTINDENTDEMAND_CREATE_GIN)]
        public async Task<ActionResult> GetGinDetails(int PartIndentDemandId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "goodsissuereceivednote_detail";
                var parameters = new DynamicParameters();
                parameters.Add("PartIndentDemandId", PartIndentDemandId);
                var gindetail = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        GinDetails = gindetail.First()
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
                            new ExceptionHandler(ex,"gin_detail_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("accept/parts")]
        public async Task<object>AccceptPartsByEngineer(String GIRNId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "goodsissuereceivednote_accept_parts";
                var parameters = new DynamicParameters();
                parameters.Add("ReceivedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("GIRNId", GIRNId);
                await connection.QueryAsync<PartIssue>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPartAccepted = true
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
                            new ExceptionHandler(ex, "failed_to_accept_parts", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet("generatepdf"), ]
        [HasPermission(PartIndentDemandBusinessFunctionCode.PARTINDENTDEMAND_CREATE_GIN)]
        public async Task<object> GenerateGoodsIssueReceivedNote(int GinId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var gindetails = await GetGoodsIssueReceivedNoteDetails(connection, GinId);
                var ginratedetails = await GetGoodsIssueReceivedNotePartStocksDetails(connection, GinId);
                byte[] ginPdf = _pdfService.GeneratePdf(container => PdfTemplates.GoodsIssueReceivedNotePdfTemplate.Create(container, gindetails.FirstOrDefault(), ginratedetails));
                return File(ginPdf, "application/pdf", "GoodsIssueNotePdf.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        message = new[] {
                            new ExceptionHandler(ex,"goods_issue_received_note_generate_pdf_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<GoodsIssueReceivedNote>> GetGoodsIssueReceivedNoteDetails(SqlConnection connection, int GinId)
        {
            var procedure = "goodsissuereceivednote_detail_for_generatepdf";
            var parameters = new DynamicParameters();
            parameters.Add("GinId", GinId);
            return await connection.QueryAsync<GoodsIssueReceivedNote>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }
        private async Task<IEnumerable<GoodsIssueReceivedNotePartStockDetails>> GetGoodsIssueReceivedNotePartStocksDetails(SqlConnection connection, int GinId)
        {
            var procedure = "goodsissuereceiveddetail_partstock_details";
            var parameters = new DynamicParameters();
            parameters.Add("GinId", GinId);
            return await connection.QueryAsync<GoodsIssueReceivedNotePartStockDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }
    }
}
