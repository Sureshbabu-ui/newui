using Dapper;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Models;
using BeSureApi.Services.LogService;
using BeSureApi.Exceptions;
using Microsoft.AspNetCore.Authorization;
using System.Diagnostics.Contracts;
using BeSureApi.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Helpers;

namespace BeSureApi.Controllers
{
    [Route("api/contract")]
    [ApiController]
    public class ContractController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly JobQueueHelper _jobQueueHelper;
        public ContractController(IConfiguration config, ILogService logService, IWebHostEnvironment hostingEnvironment)
        {
            _config     = config;
            _logService = logService;
            _hostingEnvironment = hostingEnvironment;
            _jobQueueHelper = new JobQueueHelper(config);
        }
        /// <summary>
        /// Create a new contract
        /// </summary>
        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_CREATE)]
        public async Task<object> CreateNewContract(ContractCreate contract)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();
            using (var transaction = connection.BeginTransaction())
            {
                try
                {
                var procedure   = "contract_create";
                var parameters  = new DynamicParameters();
                parameters.Add("AccelLocation", contract.ContractDetails.AccelLocation);
                parameters.Add("CustomerInfoId", contract.ContractDetails.CustomerInfoId);
                parameters.Add("SalesContactPerson", contract.ContractDetails.MarketingExecutive);
                parameters.Add("AgreementTypeId", contract.ContractDetails.AgreementTypeId);
                parameters.Add("ContractValue", contract.ContractDetails.ContractValue);
                parameters.Add("AmcValue", contract.ContractDetails.AmcValue);
                parameters.Add("FmsValue", contract.ContractDetails.FmsValue);
                parameters.Add("StartDate", contract.ContractDetails.StartDate);
                parameters.Add("EndDate", contract.ContractDetails.EndDate);
                parameters.Add("BookingType", contract.ContractDetails.BookingType);
                parameters.Add("BookingValueDate", contract.ContractDetails.BookingValueDate);
                parameters.Add("BookingDate", contract.ContractDetails.BookingDate);
                parameters.Add("QuotationReferenceNumber", contract.ContractDetails.QuotationReferenceNumber);
                parameters.Add("QuotationReferenceDate", contract.ContractDetails.QuotationReferenceDate);
                parameters.Add("PoNumber", contract.ContractDetails.PoNumber);
                parameters.Add("PoDate", contract.ContractDetails.PoDate);
                parameters.Add("IsPreformanceGuarentee", contract.ContractDetails.IsPerformanceGuarentee);
                parameters.Add("PerformanceGuaranteeAmount", contract.ContractDetails.PerformanceGuaranteeAmount);
                parameters.Add("IsMultiSite", contract.ContractDetails.IsMultiSite);
                parameters.Add("IsPreAmcNeeded", contract.ContractDetails.IsPAVNeeded);
                parameters.Add("SiteCount", contract.ContractDetails.SiteCount);
                parameters.Add("PaymentMode", contract.ContractDetails.PaymentMode);
                parameters.Add("PaymentFrequency", contract.ContractDetails.PaymentFrequency);
                parameters.Add("CreditPeriod", contract.ContractDetails.CreditPeriod);
                parameters.Add("ServiceMode", contract.ContractDetails.ServiceMode);
                parameters.Add("ServiceWindow", contract.ContractDetails.ServiceWindow);
                parameters.Add("IsPreventiveMaintenanceNeeded", contract.ContractDetails.IsPreventiveMaintenanceNeeded);
                parameters.Add("IsSez", contract.ContractDetails.IsSez);
                parameters.Add("IsBackToBackAllowed", contract.ContractDetails.IsBackToBackAllowed);
                parameters.Add("BackToBackScopeId", contract.ContractDetails.BackToBackScopeId);
                parameters.Add("IsStandByFullUnitRequired", contract.ContractDetails.IsStandByFullUnitRequired);
                parameters.Add("IsStandbyImpressStockRequired", contract.ContractDetails.IsStandbyImpressStockRequired);
                parameters.Add("PmFrequency", contract.ContractDetails.PmFrequency);
                parameters.Add("ContractInvoicePrerequisite", JsonSerializer.Serialize(contract.ContractInvoicePrerequisite));
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("ContractId", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure,transaction:transaction);
                int contractId = parameters.Get<int>("ContractId");
                if (contract.ContractDetails.IsPreventiveMaintenanceNeeded == true && contractId != null)
                {
                    procedure = "contract_pmschedule_generate";
                    parameters = new DynamicParameters();
                    parameters.Add("ContractId", contractId);
                    parameters.Add("StartDate", contract.ContractDetails.StartDate);
                    parameters.Add("EndDate", contract.ContractDetails.EndDate);
                    parameters.Add("PmFrequency", contract.ContractDetails.PmFrequency);
                    parameters.Add("TenantOfficeId", contract.ContractDetails.AccelLocation);
                    await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                }
                transaction.Commit();
                return Ok(JsonSerializer.Serialize(new { 
                status  = StatusCodes.Status200OK, 
                data    = new {
                    IsContractCreated = true 
                } 
                }));
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return BadRequest(JsonSerializer.Serialize(new { 
                    status = StatusCodes.Status400BadRequest, 
                    errors = new { 
                        Message = new[] {                            
                            new ExceptionHandler(ex,"create_contract_failed_message", _logService).GetMessage()
                        } 
                    } 
                }));
                }
            }
        }
        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_CREATE)]
        public async Task<object> UpdateContract(ContractUpdate contract)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_value_validation";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", contract.ContractDetails.Id);
                parameters.Add("NewFmsValue", contract.ContractDetails.FmsValue);
                parameters.Add("NewAmcValue", contract.ContractDetails.AmcValue);
                var isValueExceeded = await connection.QueryAsync<IsSummaryAmountExceeded>(procedure, parameters, commandType: CommandType.StoredProcedure);
                if (isValueExceeded.FirstOrDefault().IsAmcValueExceeded  && isValueExceeded.FirstOrDefault().IsFmsValueExceeded )
                {
                    throw new CustomException("contract_create_validation_both_value");
                }
                else if (isValueExceeded.FirstOrDefault().IsAmcValueExceeded)
                {
                    throw new CustomException("contract_create_validation_amc_value");
                }
                else if (isValueExceeded.FirstOrDefault().IsFmsValueExceeded)
                {
                    throw new CustomException("contract_create_validation_fms_value");
                }
                procedure = "contract_update";
                parameters = new DynamicParameters();
                parameters.Add("ContractId", contract.ContractDetails.Id);
                parameters.Add("AccelLocation", contract.ContractDetails.AccelLocation);
                parameters.Add("CustomerInfoId", contract.ContractDetails.CustomerInfoId);
                parameters.Add("SalesContactPersonId", contract.ContractDetails.SalesContactPersonId);
                parameters.Add("AgreementTypeId", contract.ContractDetails.AgreementTypeId);
                parameters.Add("ContractValue", contract.ContractDetails.ContractValue);
                parameters.Add("AmcValue", contract.ContractDetails.AmcValue);
                parameters.Add("FmsValue", contract.ContractDetails.FmsValue);
                parameters.Add("StartDate", contract.ContractDetails.StartDate);
                parameters.Add("EndDate", contract.ContractDetails.EndDate);
                parameters.Add("BookingTypeId", contract.ContractDetails.BookingTypeId);
                parameters.Add("BookingValueDate", contract.ContractDetails.BookingValueDate);
                parameters.Add("BookingDate", contract.ContractDetails.BookingDate);
                parameters.Add("QuotationReferenceNumber", contract.ContractDetails.QuotationReferenceNumber);
                parameters.Add("QuotationReferenceDate", contract.ContractDetails.QuotationReferenceDate);
                parameters.Add("PoNumber", contract.ContractDetails.PoNumber);
                parameters.Add("PoDate", contract.ContractDetails.PoDate);
                parameters.Add("IsPerformanceGuaranteeRequired", contract.ContractDetails.IsPerformanceGuaranteeRequired);
                parameters.Add("PerformanceGuaranteeAmount", contract.ContractDetails.PerformanceGuaranteeAmount);
                parameters.Add("IsMultiSite", contract.ContractDetails.IsMultiSite);
                parameters.Add("IsPreAmcNeeded", contract.ContractDetails.IsPAVNeeded);
                parameters.Add("SiteCount", contract.ContractDetails.SiteCount);
                parameters.Add("PaymentModeId", contract.ContractDetails.PaymentModeId);
                parameters.Add("PaymentFrequencyId", contract.ContractDetails.PaymentFrequencyId);
                parameters.Add("CreditPeriod", contract.ContractDetails.CreditPeriod);
                parameters.Add("ServiceModeId", contract.ContractDetails.ServiceModeId);
                parameters.Add("ServiceWindowId", contract.ContractDetails.ServiceWindowId);
                parameters.Add("IsPmRequired", contract.ContractDetails.IsPmRequired);
                parameters.Add("IsSez", contract.ContractDetails.IsSez);
                parameters.Add("IsBackToBackAllowed", contract.ContractDetails.IsBackToBackAllowed);
                parameters.Add("BackToBackScopeId", contract.ContractDetails.BackToBackScopeId);
                parameters.Add("IsStandByFullUnitRequired", contract.ContractDetails.IsStandByFullUnitRequired);
                parameters.Add("IsStandByImprestStockRequired", contract.ContractDetails.IsStandByImprestStockRequired);
                parameters.Add("PmFrequencyId", contract.ContractDetails.PmFrequencyId);
                parameters.Add("ContractInvoicePrerequisite", JsonSerializer.Serialize(contract.ContractInvoicePrerequisite));
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<ContractUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);

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
                            new ExceptionHandler(ex,"update_contract_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        /// <summary>
        /// Get the list of all created contracts based on status
        /// </summary>
        [HttpGet, Authorize()]
        [Route("list")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_VIEW)]
        public async Task<ActionResult<List<ContractsList>>> GetAllContracts(int Page,string? Status, string? Filters, string? SearchWith)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ContractsList> contracts    = await GetContractsList(Connection, Status, Page, Filters, SearchWith);
                int totalRows                           = await GetContractsCount(Connection,Status, Page, Filters, SearchWith);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                return Ok(JsonSerializer.Serialize(new {
                    status  = StatusCodes.Status200OK,
                    data    = new {
                        Contracts   = contracts,
                        CurrentPage = Page,
                        TotalRows   = totalRows,
                        PerPage     = perPage
                    }
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new {
                    status = StatusCodes.Status400BadRequest,
                    errors = new {
                        Message = new[] {
                            new ExceptionHandler(ex, "contract_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        } 
        private async Task<IEnumerable<ContractsList>> GetContractsList(SqlConnection Connection,string? Status, int Page, string? Filters, string? SearchWith)
        {
            var procedure   = "contract_list";
            var parameters  = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Filters", Filters);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("ContractStatus", Status);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            var contractList = await Connection.QueryAsync<ContractsList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractList;
        }
        private async Task<int> GetContractsCount(SqlConnection Connection, string?Status, int Page, string? Filters, string? SearchWith)
        {
            var procedure   = "contract_count";
            var parameters  = new DynamicParameters();
            parameters.Add("Filters", Filters);
            parameters.Add("ContractStatus", Status);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpGet]
        [Route("count")]
        public async Task<ActionResult<ContractsList>> GetContractCount(int Page, string? Filters, string?Status,string? SearchWith)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        totalRows = await GetContractsCount(Connection, Status, Page, Filters, SearchWith)
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
                            new ExceptionHandler(ex,"contract_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet,Authorize()]
        [Route("details")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_VIEW)]
        public async Task<ActionResult<ContractsDetails>> GetContractDetails(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure   = "contract_details";
                var parameters  = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var contractDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new { 
                    status  = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractDetails = contractDetails.First()
                    }
                })); 
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new { 
                    status = StatusCodes.Status400BadRequest, 
                    errors = new { 
                        Message = new[] {
                            new ExceptionHandler(ex,"contract_list_no_data", _logService).GetMessage()
                        } 
                    } 
                }));
            }
        }

        [HttpGet]
        [Route("get/edit/details")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_CREATE)]
        public async Task<ActionResult> GetContractData(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "selected_contract_details";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var contractInfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractInfo = contractInfo.First()
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
                            new ExceptionHandler(ex, "contract_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("list/salesusers")]
        public async Task<ActionResult> GetSalesContactUsers()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "sales_users_list";
                var salesusers = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { Salesusers = salesusers } };
                return Ok(JsonSerializer.Serialize(response));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"contract_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/customerdetails")]
        public async Task<ActionResult> GetContractCustomerDetails(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_customer_details";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var contractCustomerDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CustomerDetails = contractCustomerDetails.First()
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
                            new ExceptionHandler(ex,"contract_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("renew")]
        public async Task<object> RenewContract(ContractRenew contract)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_renew";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", contract.ContractDetails.Id);
                parameters.Add("AccelLocation", contract.ContractDetails.AccelLocation);
                parameters.Add("CustomerInfoId", contract.ContractDetails.CustomerInfoId);
                parameters.Add("SalesContactPersonId", contract.ContractDetails.SalesContactPersonId);
                parameters.Add("AgreementTypeId", contract.ContractDetails.AgreementTypeId);
                parameters.Add("ContractValue", contract.ContractDetails.ContractValue);
                parameters.Add("AmcValue", contract.ContractDetails.AmcValue);
                parameters.Add("FmsValue", contract.ContractDetails.FmsValue);
                parameters.Add("StartDate", contract.ContractDetails.StartDate);
                parameters.Add("EndDate", contract.ContractDetails.EndDate);
                parameters.Add("BookingTypeId", contract.ContractDetails.BookingTypeId);
                parameters.Add("BookingValueDate", contract.ContractDetails.BookingValueDate);
                parameters.Add("BookingDate", contract.ContractDetails.BookingDate);
                parameters.Add("QuotationReferenceNumber", contract.ContractDetails.QuotationReferenceNumber);
                parameters.Add("QuotationReferenceDate", contract.ContractDetails.QuotationReferenceDate);
                parameters.Add("PoNumber", contract.ContractDetails.PoNumber);
                parameters.Add("PoDate", contract.ContractDetails.PoDate);
                parameters.Add("IsPerformanceGuaranteeRequired", contract.ContractDetails.IsPerformanceGuaranteeRequired);
                parameters.Add("PerformanceGuaranteeAmount", contract.ContractDetails.PerformanceGuaranteeAmount);
                parameters.Add("IsMultiSite", contract.ContractDetails.IsMultiSite);
                parameters.Add("IsPreAmcNeeded", contract.ContractDetails.IsPAVNeeded);
                parameters.Add("SiteCount", contract.ContractDetails.SiteCount);
                parameters.Add("PaymentModeId", contract.ContractDetails.PaymentModeId);
                parameters.Add("PaymentFrequencyId", contract.ContractDetails.PaymentFrequencyId);
                parameters.Add("CreditPeriod", contract.ContractDetails.CreditPeriod);
                parameters.Add("ServiceModeId", contract.ContractDetails.ServiceModeId);
                parameters.Add("ServiceWindowId", contract.ContractDetails.ServiceWindowId);
                parameters.Add("IsPmRequired", contract.ContractDetails.IsPmRequired);
                parameters.Add("IsSez", contract.ContractDetails.IsSez);
                parameters.Add("IsBackToBackAllowed", contract.ContractDetails.IsBackToBackAllowed);
                parameters.Add("BackToBackScopeId", contract.ContractDetails.BackToBackScopeId);
                parameters.Add("IsStandByFullUnitRequired", contract.ContractDetails.IsStandByFullUnitRequired);
                parameters.Add("IsStandByImprestStockRequired", contract.ContractDetails.IsStandByImprestStockRequired);
                parameters.Add("PmFrequencyId", contract.ContractDetails.PmFrequencyId);
                parameters.Add("ContractInvoicePrerequisite", JsonSerializer.Serialize(contract.ContractInvoicePrerequisite));
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<ContractUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);

                procedure = "contract_emailnotification_details";
                parameters = new DynamicParameters();
                parameters.Add("ContractId", contract.ContractDetails.Id);
                var approverEmailNotificationDetailsList = await connection.QuerySingleAsync<ContractEmailNotificationDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);

                var approvalRequestEventCode = "CTR_RNWL";
                procedure = "userinfo_get_emailnotification_list";
                parameters = new DynamicParameters();
                parameters.Add("TenantOfficeId", approverEmailNotificationDetailsList.TenantOfficeId);
                parameters.Add("EventCode", approvalRequestEventCode);
                var emailNotificationDetailsList = await connection.QueryAsync<UserEmailNotificationDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
                if (emailNotificationDetailsList.Any())
                {
                    // Load the email template once
                    var templatePath = Path.Combine(_hostingEnvironment.ContentRootPath, "EmailTemplates", "ContractRenewal.html");
                    var template = "";
                    if (System.IO.File.Exists(templatePath))
                    {
                        template = System.IO.File.ReadAllText(templatePath);
                    }
                    foreach (var approverNotificationDetails in emailNotificationDetailsList)
                    {
                        var mail = new EmailDto()
                        {
                            To = approverNotificationDetails.Email,
                            Subject = "Contract Renewed",
                        };
                        mail.Body = string.Format(template, approverNotificationDetails.FullName, approverEmailNotificationDetailsList.ContractNumber, approverEmailNotificationDetailsList.NameOnPrint);
                        await _jobQueueHelper.AddMailToJobQueue(mail);
                    }
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsRenewed = true
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
                            new ExceptionHandler(ex,"update_contract_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost]
        [Route("delete")]
        public async Task<ActionResult> DeleteContract(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_delete";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsDeleted = true
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
                            new ExceptionHandler(ex,"delete_contract_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("get/bargraphdetails")]
        public async Task<ActionResult> GetContractBarGraphDetails(string StartDate, string EndDate, int? RegionId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_bargraph_detail";
                var parameters = new DynamicParameters();
                parameters.Add("RegionId", RegionId);
                parameters.Add("StartDate", StartDate);
                parameters.Add("EndDate", EndDate);
                var contractBarGraphDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractBarGraphDetails = contractBarGraphDetails
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
                            new ExceptionHandler(ex,"contract_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPut("{ContractId}/close")]
        public async Task<ActionResult> CloseContract(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_close";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                parameters.Add("ClosedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsContractClosed = true
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
                            new ExceptionHandler(ex,"close_contract_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("gstrate")]
        public async Task<ActionResult> GetGstActiveRates()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "gstrate_get_active_details";
                var parameters = new DynamicParameters();
                var gstrates = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Gstrates = gstrates
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
                            new ExceptionHandler(ex,"contract_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize]
        [Route("period")]
        public async Task<ActionResult> GetContractPeriod(int ContractId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_get_period";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var contractperiod = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractPeriod = contractperiod.FirstOrDefault()
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
                            new ExceptionHandler(ex,"contractperiod_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet, Authorize]
        [Route("setexpirystatus")]
        public async Task<ActionResult> ChangeContractStatus()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractexpiry_emailnotification_details";
                var parameters = new DynamicParameters();
                var contractExpiryEmailNotificationDetailsList = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var approvalRequestEventCode = "CTR_EXPR";
                procedure = "userinfo_get_emailnotification_list";
                parameters = new DynamicParameters();
                parameters.Add("EventCode", approvalRequestEventCode);
                foreach (var details in contractExpiryEmailNotificationDetailsList)
                {
                    parameters.Add("TenantOfficeId", details.TenantOfficeId);
                    var emailNotificationDetailsList = await connection.QueryAsync<UserEmailNotificationDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
                    if (emailNotificationDetailsList.Any())
                    {
                        // Load the email template once
                        var templatePath = Path.Combine(_hostingEnvironment.ContentRootPath, "EmailTemplates", "ContractExpired.html");
                        var template = "";
                        if (System.IO.File.Exists(templatePath))
                        {
                            template = System.IO.File.ReadAllText(templatePath);
                        }
                        foreach (var approverNotificationDetails in emailNotificationDetailsList)
                        {
                            var mail = new EmailDto()
                            {
                                To = approverNotificationDetails.Email,
                                Subject = "Contract Expired",
                            };
                            mail.Body = string.Format(template, approverNotificationDetails.FullName, details.ContractNumber, details.NameOnPrint);
                            await _jobQueueHelper.AddMailToJobQueue(mail);
                        }
                    }
                }
                procedure = "contract_update_status_expire";
                await connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCompleted = true
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
                            new ExceptionHandler(ex,"contract_status_not_changed", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("filter/by/customer")]
        [Authorize()]
        public async Task<ActionResult> GetContractsByCustomerFilter( int? CustomerId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_filter_by_customer";
                var parameters = new DynamicParameters();
                parameters.Add("CustomerId", CustomerId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var contracts = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { ContractNumbersByCustomer = contracts } };
                return Ok(JsonSerializer.Serialize(response));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"contract_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}