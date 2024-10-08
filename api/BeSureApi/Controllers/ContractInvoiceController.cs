using BeSureApi.Exceptions;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Services.LogService;
using Microsoft.IdentityModel.Tokens;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using QuestPDF.Infrastructure;
using BeSureApi.Services;
using QuestPDF.Drawing;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using System.Transactions;
using BeSureApi.Models;
using MailKit.Search;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Diagnostics.Contracts;
using BeSureApi.Helpers;

namespace BeSureApi.Controllers
{
    [Route("api/contractinvoice")]
    [ApiController]
    public class ContractInvoiceController : ControllerBase

    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IPdfService _pdfService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly JobQueueHelper _jobQueueHelper;
        public ContractInvoiceController(IConfiguration config, ILogService logService, IPdfService pdfService, IWebHostEnvironment hostingEnvironment)
        {
            _config = config;
            _logService = logService;
            _pdfService = pdfService;
            _hostingEnvironment = hostingEnvironment;
            _jobQueueHelper = new JobQueueHelper(config);
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(ContractInvoiceBusinessFunctionCode.INVOICE_CREATE)]
        public async Task<object> CreateContractInvoice(ContractInvoiceWithDetail contract)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();
            using var transaction = connection.BeginTransaction(); // Start transaction

            try
            {
               var einvoiceHeadeData= await  CreateInvoice(connection, transaction, contract);
               await CreateEInvoice(contract,einvoiceHeadeData);
                transaction.Commit(); // Commit the transaction
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsContractInvoiceCreated = true
                    }
                }));
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                    new ExceptionHandler(ex, "contract_invoice_create_contract_failed_message", _logService).GetMessage()
                }
                    }
                }));
            }
        }

        private async Task<EInvoiceCreate> CreateInvoice(SqlConnection connection, SqlTransaction transaction, ContractInvoiceWithDetail contract)
        {
            var procedure = "contractinvoice_create";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", contract.ContractInvoice.ContractId);
            parameters.Add("ContractInvoiceScheduleId", contract.ContractInvoice.ContractInvoiceScheduleId);
            parameters.Add("Description", contract.ContractInvoice.Description);
            parameters.Add("InvoiceAmount", contract.ContractInvoice.InvoiceAmount);
            parameters.Add("DeductionAmount", contract.ContractInvoice.DeductionAmount);
            parameters.Add("DeductionDescription", contract.ContractInvoice.DeductionDescription);
            parameters.Add("Sgst", contract.ContractInvoice.Sgst);
            parameters.Add("Cgst", contract.ContractInvoice.Cgst);
            parameters.Add("Igst", contract.ContractInvoice.Igst);
            parameters.Add("CollectionDueDate", contract.ContractInvoice.CollectionDueDate);
            parameters.Add("InvoiceStatus", 1);
            parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("ContractInvoiceDetail", JsonSerializer.Serialize(contract.ContractInvoiceDetails));
            var result = await connection.QueryAsync<EInvoiceCreate>(procedure, parameters, transaction, commandType: CommandType.StoredProcedure);
            return result.FirstOrDefault();
        }

        private async Task<object> CreateEInvoice(ContractInvoiceWithDetail contract,EInvoiceCreate eInvoiceHeader)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("EInvoiceConnection"));
            var procedure = "besure_einvoice_gst_create";
            var parameters = new DynamicParameters();
            parameters.Add("Business",eInvoiceHeader.Business);
            parameters.Add("Invoiceno", eInvoiceHeader.Invoiceno);
            parameters.Add("InvoiceDate", eInvoiceHeader.InvoiceDate);
            parameters.Add("Type", eInvoiceHeader.Type);
            parameters.Add("SubType", eInvoiceHeader.SubType);
            parameters.Add("Location", eInvoiceHeader.Location);
            parameters.Add("LocationState", eInvoiceHeader.LocationState);
            parameters.Add("LocationStateCode", eInvoiceHeader.LocationStateCode);
            parameters.Add("LocationGSTIN", eInvoiceHeader.LocationGSTIN);
            parameters.Add("CustomerName", eInvoiceHeader.CustomerName);
            parameters.Add("CustomerAddress1", eInvoiceHeader.CustomerAddress1);
            parameters.Add("CustomerCity", eInvoiceHeader.CustomerCity);
            parameters.Add("CustomerState", eInvoiceHeader.CustomerState);
            parameters.Add("CustomerStateCode", eInvoiceHeader.CustomerStateCode);
            parameters.Add("CustomerPincode", eInvoiceHeader.CustomerPincode);
            parameters.Add("CustomerGSTIN", eInvoiceHeader.CustomerGSTIN);
            parameters.Add("CustomerShipName", eInvoiceHeader.CustomerShipName);
            parameters.Add("CustomerShipAddress1", eInvoiceHeader.CustomerShipAddress1);
            parameters.Add("CustomerShipCity", eInvoiceHeader.CustomerShipCity);
            parameters.Add("CustomerShipState", eInvoiceHeader.CustomerShipState);
            parameters.Add("CustomerShipStateCode", eInvoiceHeader.CustomerShipStateCode);
            parameters.Add("CustomerShipPincode", eInvoiceHeader.CustomerShipPincode);
            parameters.Add("CustShipGSTIN", eInvoiceHeader.CustShipGSTIN);
            parameters.Add("TaxableValue", eInvoiceHeader.TaxableValue);
            parameters.Add("NETAmt", eInvoiceHeader.NETAmount);
            parameters.Add("Sgst", eInvoiceHeader.SgstAmount);
            parameters.Add("Cgst", eInvoiceHeader.CgstAmount);
            parameters.Add("Igst", eInvoiceHeader.IgstAmount);
            parameters.Add("BILLTOCODE", eInvoiceHeader.BILLTOCODE);
            parameters.Add("SHIPTOCODE", eInvoiceHeader.SHIPTOCODE);
            parameters.Add("UniqueID", eInvoiceHeader.UniqueID);
            parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("ContractInvoiceDetail", JsonSerializer.Serialize(contract.ContractInvoiceDetails));
            await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return Ok(JsonSerializer.Serialize(new
            {
                status = StatusCodes.Status200OK,
                data = new
                {
                    IsContractInvoiceCreated = true
                }
            }));
        }

        [HttpGet,Authorize()]
        [Route("get/details")]
        public async Task<ActionResult<ContractInvoiceViewWithDetail>> GetContractInvoiceDetails(int ContractInvoiceId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var contractInvoice = await GetInvoiceDetail(connection, ContractInvoiceId);
                var InvoiceDetail = new ContractInvoiceDetailController(_config, _logService);
                IEnumerable<ContractInvoiceDetailList> invoiceDetailList = await InvoiceDetail.GetContractInvoiceDetailList(connection, ContractInvoiceId);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractInvoice = contractInvoice.FirstOrDefault(),
                        ContractInvoiceDetails = invoiceDetailList
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

        private async Task<IEnumerable<ContractInvoiceView>> GetInvoiceDetail(SqlConnection connection, int ContractInvoiceId)
        {
            var procedure = "contractinvoice_detail";
            var parameters = new DynamicParameters();
            parameters.Add("ContractInvoiceId", ContractInvoiceId);
            return await connection.QueryAsync<ContractInvoiceView>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

        [HttpGet]
        [Route("get/all/by/contract")]
        public async Task<ActionResult> GetAllInvoiceInContract(int ContractId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "invoice_get_all_by_contract";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var invoices = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractInvoices = invoices
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
                            new ExceptionHandler(ex,"contract_invoice_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("add/pendingreason")]
        [HasPermission(ContractInvoiceBusinessFunctionCode.INVOICE_LIST)]
        public async Task<object> AddContractInvoicePendingReason(ContractInvoicePendingReasonAdd contract)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractinvoice_add_pendingreason";
                var parameters = new DynamicParameters();
                parameters.Add("ContractInvoiceId", contract.ContractInvoiceId);
                parameters.Add("InvoicePendingReason", contract.InvoicePendingReason);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsInvoicePendingReason = true
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
                            new ExceptionHandler(ex,"contract_invoice_create_contract_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("pending/bargraphdetails")]
        public async Task<ActionResult> GetCollectionMadeBarGraphDetails(string StartDate, string EndDate, int? RegionId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "invoice_pending_bargraph_detail";
                var parameters = new DynamicParameters();
                parameters.Add("RegionId", RegionId);
                parameters.Add("StartDate", StartDate);
                parameters.Add("EndDate", EndDate);
                var invoicePendingBarGraphDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        InvoicePendingBarGraphDetails = invoicePendingBarGraphDetails
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
                            new ExceptionHandler(ex,"contract_invoice_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet("generatepdf"),Authorize()]
        [HasPermission(ContractInvoiceBusinessFunctionCode.INVOICE_LIST)]
        public async Task<object> GenerateInvoicePdf(int ContractInvoiceId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            { 
                byte[] invoicePdf = await InvoicePdfGenerate(connection, ContractInvoiceId);
                return File(invoicePdf, "application/pdf", "invoice.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        message = new[] {
                            new ExceptionHandler(ex,"contract_invoice_generate_pdf_files_not_found", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }


        [HttpGet]
        [Route("get/all/by/customer")]
        public async Task<ActionResult> GetAllInvoiceByCustomer(int CustomerInfoId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "invoice_get_all_by_customer";
                var parameters = new DynamicParameters();
                parameters.Add("CustomerInfoId", CustomerInfoId);
                var invoices = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractInvoices = invoices
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
                            new ExceptionHandler(ex,"contract_invoice_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet,Authorize()]
        [Route("share/info")]       
        [HasPermission(ContractInvoiceBusinessFunctionCode.INVOICE_LIST)]
        public async Task<ActionResult> GetInvoiceShareInfo(int ContractInvoiceId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractinvoice_share_info";
                var parameters = new DynamicParameters();
                parameters.Add("ContractInvoiceId", ContractInvoiceId);
                var invoiceShareInfo = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new { InvoiceShareInfo = invoiceShareInfo.FirstOrDefault() }
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
                            new ExceptionHandler(ex,"maildetails_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<byte[]> InvoicePdfGenerate(SqlConnection connection, int ContractInvoiceId)
        {
            var contractInvoiceDetails = await GetInvoiceDetail(connection, ContractInvoiceId);
            var InvoiceDetail = new ContractInvoiceDetailController(_config, _logService);
            IEnumerable<ContractInvoiceDetailList> invoiceDetailList = await InvoiceDetail.GetContractInvoiceDetailList(connection, ContractInvoiceId);
            byte[] invoicePdf = _pdfService.GeneratePdf(container => PdfTemplates.ContractInvoiceViewPdfTemplate.Create(container, contractInvoiceDetails.FirstOrDefault(), invoiceDetailList));
            return invoicePdf;
        }

        [HttpPost, Authorize()]
        [Route("share")]
        [HasPermission(ContractInvoiceBusinessFunctionCode.INVOICE_LIST)]
        public async Task<object> ShareInvoice(ShareInvoiceDetailPdf shareInvoice)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                byte[] invoicePdf = await InvoicePdfGenerate(connection, shareInvoice.Id);
                // Load the HTML template
                string templatePath = Path.Combine(_hostingEnvironment.ContentRootPath, "EmailTemplates", "InvoicePdf.html");
                string template = "";
                if (System.IO.File.Exists(templatePath))
                {
                    template = System.IO.File.ReadAllText(templatePath);
                }

                //TODOS: To be removed only when actually started to use
                var recipientDomain = shareInvoice.To.Split('@')[1];
                if (recipientDomain.ToLower() != "accelits.com")
                {
                    return BadRequest(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status400BadRequest,
                        errors = new
                        {
                            Message = new[] { "contracthshareinvoice_cant_mail" }
                        }
                    }));
                }
                // Send the email
                var mail = new EmailDto
                {
                    To = shareInvoice.To,
                    Cc = shareInvoice.Cc.Select(email => email.ToString()).ToList(),
                    Subject = "Invoice for your "+shareInvoice.ContractNumber+ ", Due "+shareInvoice.InvoiceDate,
                    Attachment = new EmailAttachment
                    {
                        Content = invoicePdf,
                        FileName = "invoice_"+ shareInvoice.InvoiceNumber+".pdf",
                        ContentType = "application/pdf"
                    }
                };
                mail.Body = string.Format(template,shareInvoice.PrimaryContactName ?? "N/A",shareInvoice.InvoiceNumber ?? "N/A", shareInvoice.InvoiceDate ??  "N/A");
                await _jobQueueHelper.AddMailToJobQueue(mail);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsShared = true
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
                            new ExceptionHandler(ex,"contract_invoice_share_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}