using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using BeSureApi.Services.ExcelService;
using BeSureApi.Services.LogService;

namespace BeSureApi.Controllers

{
    [Route("api/report")]
    [ApiController]
    public class ReportController : Controller
    
    {
        private readonly IConfiguration _config;
        private readonly IExcelService _excelService;
        private readonly ILogService _logService;
        public ReportController(IConfiguration config, ILogService logService, IExcelService excelService)
        {
            _config = config;
            _excelService = excelService;
            _logService = logService;
        }

        [HttpGet]
        [Route("bookingdetail/download")]
        public async Task<ActionResult> DownloadBookingDetailReport(string? DateFrom, string? DateTo,int? ContractTypeId,int? AccelRegionId,int? AccelLocationId, int? CustomerId, int? ContractStatusId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_bookingdetails_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("ContractTypeId", ContractTypeId);
                parameters.Add("AccelRegionId", AccelRegionId);
                parameters.Add("AccelLocationId", AccelLocationId);
                parameters.Add("CustomerId", CustomerId);
                parameters.Add("ContractStatusId", ContractStatusId);

                var contractdetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var headers = new Dictionary<string, string>()
                {
                    { "ContractNumber", "Contract Number" },
                    { "CustomerName", "Customer Name" },
                    { "BilledToAddress", "Billed To Address" },
                    { "BilledToCity", "Billed To City" },
                    { "BilledToState", "Billed To State" },
                    { "BilledToPincode", "Billed To Pincode" },
                    { "OfficeName", "Office Name" },
                    { "AgreementType", "Agreement Type" },
                    { "BookingType", "Booking Type" },
                    { "BookingDate", "Booking Date" },
                    { "ContractValue", "Contract Value" },
                    { "AmcValue", "Amc Value" },
                    { "FmsValue", "Fms Value" },
                    { "QuotationReferenceNumber", "Quotation Reference Number" },
                    { "QuotationReferenceDate", "Quotation Reference Date" },
                    { "PoNumber", "Purchase Order Number" },
                    { "PoDate", "Purchase Order Date" },
                    { "StartDate", "StartDate" },
                    { "EndDate", "EndDate" },
                    { "PerformanceGuaranteeRequired", "Performance Guarantee Required" },
                    { "PerformanceGuaranteeAmount", "Performance Guarantee Amount" },
                    { "IsMultiSite", "Is MultiSite" },
                    { "SiteCount", "Site Count" },
                    { "IsPreAmcNeeded", "Is PreAmc Needed" },
                    { "ServiceMode", "Service Mode" },
                    { "PaymentType", "Payment Type" },
                    { "IsPmRequired", "Is Pm Required" },
                    { "IsSez", "Is Sez" },
                    { "CreditPeriod", "Credit Period" },
                    { "ServiceWindow", "Service Window" },
                    { "IsStandByFullUnitRequired", "IsStandBy FullUnit Required" },
                    { "IsStandByImprestStockRequired", "IsStandBy ImprestStock Required" },
                    { "ContractStatus", "Contract Status" },
                    { "ReviewComment", "Review Comment" },
                    { "SalesContactPerson", "Sales Contact Person" },
                    { "SalesContactPersonEmail", "Sales Contact Person Email" },
                    { "SalesContactPersonPhone", "Sales Contact Person Phone" },
                    { "CallExpiryDate", "Call Expiry Date" },
                    { "CallStopDate", "Call Stop Date" },
                    { "CallStopReason", "Call Stop Reason" },
                    { "ClosureNote", "Closure Note" }
                };

                var records = new List<object[]>();
                foreach (var contract in contractdetails)
                {
                    var dictionaryContract = (IDictionary<string, object>)contract;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryContract[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "contract_booking_detail.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"booking_detail_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("partreturns/download")]
        public async Task<ActionResult> DownloadPartReturnReport(string? DateFrom, string? DateTo, int? ReturnedPartTypeId, int? TenantRegionId, int? TenantOfficeId,int? ServiceEngineerId, string? IsUnderWarranty)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partreturn_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("ReturnedPartTypeId", ReturnedPartTypeId);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("ServiceEngineerId", ServiceEngineerId);
                parameters.Add("IsUnderWarranty", IsUnderWarranty);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var partreturn = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    { "ServiceEngineer", "Service Engineer" },
                    { "ReturnInitiatedOn", "Return Initiated On" },
                    { "ReturnedPartType", "Part Type" },
                    { "PartCode", "Part Code" },
                    { "PartName", "Part Name" },
                    { "SerialNumber", "Serial Number" },
                    { "HsnCode", "HSN Code" },
                    { "OemPartNumber", "OEM Part Number" },
                    { "Description", "Description" },
                    { "Barcode", "Barcode" },
                    { "StockType", "Stock Type" },
                    { "Rate", "Rate" },
                    { "PartWarrantyExpiryDate", "Part Warranty Expiry Date" },
                    { "ReceivingLocation", "Receiving Location" },
                    { "ReceivedBy", "Received By" },
                    { "ReceivedOn", "Received On" },
                    { "GrnNumber", "GRN Number" },
                    { "GrnDate", "GRN Date" },
                    { "TransactionType", "Transaction Type" }
                };

                    var records = new List<object[]>();
                    foreach (var partreturninfo in partreturn)
                    {
                        var dictionaryPartReturn = (IDictionary<string, object>)partreturninfo;
                        var record = new object[headers.Count()];
                        int index = 0;
                        foreach (var header in headers.Keys)
                        {
                            record[index++] = dictionaryPartReturn[header];
                        }
                        records.Add(record);
                    }
                    byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                    return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "part_return_detail.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"part_return_detail_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("pendingcall/download")]
        public async Task<ActionResult> DownloadPendingCallReport(string? TimeZone, string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "pendingcall_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("TimeZone", TimeZone);
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var pendingCallReport = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    { "WorkOrderNumber", "Wono" },
                    { "CaseId", "CaseId" },
                    { "RegionName", "Region" },
                    { "Location", "Location" },
                    { "ContractNumber", "ServiceContractno" },
                    { "CustomerName", "Customer" },
                    { "CustomerSiteName", "CustomerLocation" },
                    { "CategoryName", "Product" },
                    { "ModelName", "Model" },
                    { "Make", "Make" },
                    { "ProductSerialNumber", "Serialno" },
                    { "CreatedOn", "Callloggeddate" },
                    { "AGType", "AGType" },
                    { "CallStatus", "Call Status" },
                    { "ResolutionTimeInHours", "CallResolutionTime" },
                    { "EngAssignDate", "EngAssignDate" },
                    { "EngName", "EngName" },
                    { "PartCode", "PartCode" },
                    { "PartDesc", "PartDesc" },
                    { "IndentRequestNumber", "PartIndentNo" },
                    { "PartReqDate", "PartReqDate" },
                    { "DemandNumber", "PartDemandNo" },
                    { "DemandDate", "DemandDate" },
                    { "PartShippedDate", "PartShippedDate" },
                    { "PartIssuedDate", "PartIssuedDate" },
                    { "PartIssuedEngName", "PartIssuedEngName" },
                    { "Demandstatus", "Demandstatus" },
                    { "NoOfPartsDemanded", "NoOfPartsDemanded" },
                    { "NoOfPartsReceived", "NoOfPartsReceived" },
                    { "NoOfPartsIssued", "NoOfPartsIssued" },
                    { "Engtype", "Engtype" },
                    { "Ageing","Ageing" },
                    { "AgeGroup", "Age Group" },
                    { "PartIssueAgeGroup","PartIssueAgeGroup" }
                };

                var records = new List<object[]>();
                Dictionary<string, object> previousValues = new Dictionary<string, object>();
                List<string> headersToCheck = new List<string> { "CaseId", "WorkOrderNumber", "RegionName","AGType","CallStatus","ResolutionTimeInHours",
                                                    "Location", "ContractNumber", "CustomerName","CustomerSiteName",
                                                "CategoryName", "ModelName", "Make", "ProductSerialNumber","CreatedOn" };

                foreach (var pendingCallReportinfo in pendingCallReport)
                {
                    var dictionarypendingCallReport = (IDictionary<string, object>)pendingCallReportinfo;
                    var record = new object[headers.Count()];
                    int index = 0;
                    var wono = dictionarypendingCallReport["WorkOrderNumber"];
                    foreach (var header in headers.Keys)
                    {
                        var value = dictionarypendingCallReport[header];
                        if (headersToCheck.Contains(header))
                        {
                            if (previousValues.ContainsKey("WorkOrderNumber") && value != null && wono != null && wono.Equals(previousValues["WorkOrderNumber"]))
                            {
                                record[index] = null;
                            }
                            else
                            {
                                record[index] = value;
                            }
                        }
                        else
                        {
                            record[index] = value;
                        }
                        index++;
                    }
                    previousValues["WorkOrderNumber"] = wono;
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "pending_call_detail.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"pending_call_detail_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("barcode/download")]
        public async Task<ActionResult> DownloadBarcodeReport(string? DateFrom, string? DateTo,int? TenantRegionId, int? TenantOfficeId, bool? IsUnderWarranty)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "barcode_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("IsUnderWarranty", IsUnderWarranty);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var partstockinfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var records = new List<object[]>();
                var headers = new Dictionary<string, string>()
                {
                    { "TenantOffice", "Location" },
                    { "Barcode", "Barcode" },
                    { "DemandNumber", "Demand No" },
                    { "WorkOrderNumber", "Wono" },
                    { "PartCode", "Part Code" },
                    { "PartType", "Part Type" },
                    { "Description", "Description" },
                    { "PoNumber", "PO Number" },
                    { "PoDate", "PO Date" },
                    { "Vendor", "Vendor" },
                    { "PartValue", "Part Value" },
                    { "WarrantyPeriod", "Warranty" },
                    { "PartWarrantyExpiryDate","Warranty Expiry Date" },
                    { "GrnNumber", "GRN No" },
                    { "GrnDate", "GRN Date" },
                    { "ReferenceNumber", "Invoice No" },
                    { "ReferenceDate", "Invoice Date" }
                };

                foreach (var barcodereport in partstockinfo)
                {
                    var dictionaryBarcodeReport = (IDictionary<string, object>)barcodereport;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryBarcodeReport[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "barcode_detail.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"barcode_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("contract/renewaldue/download")]
        public async Task<ActionResult> DownloadContractRenewalDueReport(string? TimeZone, string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractrenewaldue_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("TimeZone", TimeZone);
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var partstockinfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                  {"RegionName","Region" },
                  {"Location", "Location"},
                  {"ContractNumber", "ContractNo"},
                  {"BookingDate", "Contract Date"},
                  {"StartDate", "Period From"},
                  {"EndDate", "Period To"},
                  {"GroupName", "Group Name"},
                  {"CustomerName", "Cust. Name"},
                  {"AgreementType", "Contract Type"},
                  {"ContractValue", "Amount"},
                  {"PaymentType", "Pay Terms"},
                  {"RenewalDate", "Renewal Date"},
                  {"OutStanding", "OutStanding"},
                  {"TotalOutStandingAmount", "OutStandingValue"},
                  {"LastUpdated", "LastStatusUpdateDate"},
                  {"Status", "Status"},
                  {"SubStatus", "SubStatus"},
                  {"BillingDate", "Billing Date"},
                  {"ProbabilityForTheMonth", "Probability For The Month"},
                  {"Remarks", "Remarks"},
                  {"ManPowerCount", "No Of RE"},
                  {"ImprestStockCount", "Imprest Avail"},
                  {"StandbyAvail", "Standby Avail"},
                  {"PendingDays", "Pending Days"}   
                };

                var records = new List<object[]>();
                foreach (var renewduereport in partstockinfo)
                {
                    var dictionaryPartStockInfo = (IDictionary<string, object>)renewduereport;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryPartStockInfo[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "contractrenewdue.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"renewduereport_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("fiat/engineer/detail/download")]
        public async Task<ActionResult> EngineerDetailsReport(string? TimeZone,string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "engineerdetail_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("TimeZone", TimeZone);
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var engineerdetailReport = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    { "EmployeeCode", "Engineer Code" },
                    { "FullName", "Engineer Name" },
                    { "EngineerType", "Engineer Type" },
                    { "LocationCode", "Location Code" },
                    { "LocationName", "Location" },
                    { "Designation", "Designation" },
                    { "ContractNumber", "Contract Number" },
                    { "JoinDate", "Date Of Join" },
                    { "ResigDate", "Date Of Resignation" },
                    { "SettlementDate", "Date Of Settlement" },
                    { "LastWorkingDate", "Last Working Date" }
                };

                var records = new List<object[]>();
                Dictionary<string, object> previousValues = new Dictionary<string, object>();
                List<string> headersToCheck = new List<string> { "EmployeeCode", "FullName", "EngineerType", "LocationCode" , "LocationName" , "Designation" };

                foreach (var engineerDetails in engineerdetailReport)
                {
                    var dictionaryengineerDetailsReport = (IDictionary<string, object>)engineerDetails;
                    var record = new object[headers.Count()];
                    int index = 0;
                    var empcode = dictionaryengineerDetailsReport["EmployeeCode"];
                    foreach (var header in headers.Keys)
                    {
                        var value = dictionaryengineerDetailsReport[header];
                        if (headersToCheck.Contains(header))
                        {
                            if (previousValues.ContainsKey("EmployeeCode") && value != null && empcode != null && empcode.Equals(previousValues["EmployeeCode"]))
                            {
                                record[index] = null;
                            }
                            else
                            {
                                record[index] = value;
                            }
                        }
                        else
                        {
                            record[index] = value;
                        }
                        index++;
                    }
                    previousValues["EmployeeCode"] = empcode;
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "fiat_engineer_detail.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"engineer_detail_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("fiat/re/count/download")]
        public async Task<ActionResult> RECountReport(string? TimeZone, string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "recount_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("TimeZone", TimeZone);
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var residentEngineerCountReport = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    { "ContractNumber", "Service Contract No" },
                    { "EngineerCount", "TOTRE" },
                    { "AgreementType", "Agreement Type" },
                    { "LocationCode", "Location" },
                    { "RECount", "RE Count" },
                    { "ContractDate", "Contract Date" },
                    { "PeriodFrom", "Period From" },
                    { "PeriodTo", "Period To" },
                    { "CustomerName", "Customer Name" },
                    { "CustomerAgreedAmount", "Amount" },
                    { "IsMultiSite", "Loc Type" },
                };

                var records = new List<object[]>();
                foreach (var residentEngineerCountInfo in residentEngineerCountReport)
                {
                    var dictionaryResidentEngineerCount = (IDictionary<string, object>)residentEngineerCountInfo;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryResidentEngineerCount[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "re_count_detail.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"recount_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("consumption/summary/download")]
        public async Task<ActionResult> DownloadConsumptionSummaryReport(string? TimeZone, string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "consumption_summary_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("TimeZone", TimeZone);
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var consumptionsummaryReport = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                  {"LocationCode","Location" },
                  {"Quantity", "Quantity"},
                  {"TotalRate", "Value"}
                };

                var records = new List<object[]>();
                foreach (var consumptionsummary in consumptionsummaryReport)
                {
                    var dictionaryConsumptionSummary= (IDictionary<string, object>)consumptionsummary;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryConsumptionSummary[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "consumption_summary.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"consumption_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("consumption/download")]
        public async Task<ActionResult> DownloadConsumptionReport(string? TimeZone, string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "consumption_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("TimeZone", TimeZone);
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var consumptionReport = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    {"LocationCode","Location"},
                    {"WorkOrderNumber","Wono"},
                    {"PartCode","PartCode"},
                    {"PartType","PartType" },
                    {"PartCategory","MasterPart" },
                    {"Description","Description"},
                    {"Quantity","Quantity"},
                    {"TotalRate","Rate"},
                    {"ContractNumber","ContractNumber"},
                    {"StartDate","Contract Period From"},
                    {"EndDate","Contract Period To"},
                    {"Customer","Customer"},
                    {"EmployeeCode","EngineerCode"},
                    {"Engineer","Engineer"},
                    {"ProductSerialNumber", "SerialNo"},
                    {"ModelName","ModelNo"},
                    {"TranDate","TranDate" },
                    {"CategoryName", "ProductCategory" },
                    {"EngType","ENGType" },
                    {"RILContractno","RILContractno" },
                    {"TAG","TAG"},
                    {"GRCRecDate","GRCRecDate" },
                    {"IssuedFromCustImp","IssuedFromCustImp" },
                    {"Tran Month & Year" ,"Tran Month & Year"}
                };

                var records = new List<object[]>();
                foreach (var consumption in consumptionReport)
                {
                    var dictionaryConsumption = (IDictionary<string, object>)consumption;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryConsumption[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "consumption.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"consumption_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        
        [HttpGet]
        [Route("demand/download")]
        public async Task<ActionResult> DownloadDemandReport(string? TimeZone,string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "demand_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TimeZone", TimeZone);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var demandReport = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    {"RegionName","Region Name"},
                    {"LocationCode","Location"},
                    {"PoNumber","PoNumber"},
                    {"PoDate","PoDate"},
                    {"Vendor","Vendor Name"},
                    {"MainCodeSol","Main Code"},
                    {"Description","Description"},
                    {"DemandType","DemandType" },
                    {"WorkOrderNumber","WoNumber"},
                    {"AssetProductCategory","Product"},
                    {"ModelName","ModelName"},
                    {"IndentDate","Indent Date"},
                    {"DemandDate","Demand Date"},
                    {"DemandNumber","Demand Number"},
                    {"StockType","Stock Type"},
                    {"DemandDisposition","DemandDisposition"},
                    {"DateOfDemandDisposition","DateOfDemandDisposition"},
                    {"DemandNoteStatus","Demand Status"},
                    {"ETD","ETD"},
                    {"GrnDate","GRN Date"},
                    {"GrnNumber","GRN Number"},
                    {"MetDate","MetDate"},
                    {"MetAt","MetAt"},
                };

                var records = new List<object[]>();
                foreach (var demandinfo in demandReport)
                {
                    var dictionary = (IDictionary<string, object>)demandinfo;
                    var dictionaryDemandReport = (IDictionary<string, object>)demandinfo;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryDemandReport[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "demand_detail.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"demand_detail_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("pmassetdetail")]
        [Authorize()]
        public async Task<ActionResult> DownloadPMAssetDetailReport(string TimeZone,string? StatusType, string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId,int? CustomerId, int? ContractId,int? CustomerSiteId, int? AssetProductCategoryId, int? ProductModelId, int? MakeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "pmassetdetail_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("TimeZone", TimeZone);
                parameters.Add("StatusType", StatusType);
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("CustomerId", CustomerId);
                parameters.Add("ContractId", ContractId);
                parameters.Add("CustomerSiteId", CustomerSiteId);
                parameters.Add("AssetProductCategoryId", AssetProductCategoryId);
                parameters.Add("MakeId", MakeId);
                parameters.Add("ProductModelId", ProductModelId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var pmDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    {"RegionName", "Region " },
                    {"BaseLocation", "Base Location" },
                    {"GroupName", "Group Name" },
                    { "CustomerName", "Customer" },
                    {"ContractNumber", "Contract Number" },
                    {"MappedLocation", "Mapped Location" },
                    { "SiteName", "Site Name" },
                    { "CategoryName", "Category" },
                    { "MakeName", "Make" },
                    { "ModelName", "Model" },
                    {"ProductSerialNumber","Serial Number" },
                    {"PmScheduledDate","PM Due Date" },
                    { "PmDate", "PM Done Date" },
                    {"EngineerName","Engineer" },
                    {"IsOutSourcingNeeded" ,"Is OutSourcing Needed"},
                    {"Vendor","Vendor" }
                  };

                var records = new List<object[]>();
                foreach (var detail in pmDetails)
                {
                    var dictionary = (IDictionary<string, object>)detail;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionary[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "contractassetpmdetail.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"contractassetpmdetail_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("pmassetsummary")]
        [Authorize()]
        public async Task<ActionResult> DownloadPMAssetSummaryReport(string TimeZone, string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId,  int? CustomerId, int? ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "pmassetsummary_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("TimeZone", TimeZone);
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("CustomerId", CustomerId);
                parameters.Add("ContractId", ContractId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var pmSummary= await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    {"RegionName", "Region " },
                    {"BaseLocation", "Base Location" },
                    {"GroupName", "Group Name" },
                    {"CustomerName", "Customer" },
                    {"ContractNumber", "Contract Number" },
                    {"MappedLocation", "Mapped Location" },
                    {"SiteName", "Site Name" },
                    {"CategoryName", "Category" },
                    {"PmScheduledDate","PM Scheduled Date" },
                    {"TotalCount","PM Due Count" },
                    {"PMNotCompletedCount", "PM Not Completed" },
                    {"PMCompletedCount","PM Completed" },
                  };

                var records = new List<object[]>();
                foreach (var detail in pmSummary)
                {
                    var dictionary = (IDictionary<string, object>)detail;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionary[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "contractassetpmsummary.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"contractassetpmsummary_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("customersite/download")]
        public async Task<ActionResult> DownloadCustomerSiteReport(string? TimeZone,int? TenantRegionId, int? TenantOfficeId, int? CustomerId, int? ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customer_site_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("CustomerId", CustomerId);
                parameters.Add("ContractId", ContractId);
                parameters.Add("TimeZone", TimeZone);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var siteReport = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    {"ContractNumber","SERVICECONTRACTNO"},
                    {"SiteName","SITENAME"},
                    {"Address","CUSTOMERADDRESS"},
                    {"SiteState","STATE"},
                    {"SiteCity","CITY"},
                    {"Pincode","PINCODE"},
                    {"Telephone","TELEPHONE"},
                    {"PrimaryContactName","CONTACTPERSONONE" },
                    {"SecondaryContactName","CONTACTPERSONTWO"},
                    {"PrimaryContactEmail","EMAILADDRESSONE"},
                    {"SecondaryContactEmail","EMAILADDRESSTWO"},
                    {"MappedLocation","MAPPEDLOCATION"},
                    {"RE","RE"}
                };

                var records = new List<object[]>();
                foreach (var siteinfo in siteReport)
                {
                    var dictionary = (IDictionary<string, object>)siteinfo;
                    var dictionarySiteReport = (IDictionary<string, object>)siteinfo;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionarySiteReport[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "site_detail.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"customersite_detail_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("preamcassetsummary")]
        [Authorize()]
        public async Task<ActionResult> DownloadContractAssetSummeryPreAmcReport(string? TimeZone, int? ContractId, 
                                        int? CustomerId, int? AssetCategryId, DateTime? DateFrom,
                                        DateTime? DateTo, int? CustomerSiteId, int? TenantRegionId,
                                        int? TenantOfficeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractassetsummary_preamc_report";
                var parameters = new DynamicParameters();
                parameters.Add("@ContractId", ContractId);
                parameters.Add("@CustomerId", CustomerId);
                parameters.Add("@AssetCategoryId", AssetCategryId);
                parameters.Add("@FilterStartDate", DateFrom);
                parameters.Add("@FilterEndDate", DateTo);
                parameters.Add("@CustomerSiteId", CustomerSiteId);
                parameters.Add("@TenantRegionId", TenantRegionId);
                parameters.Add("@TenantOfficeId", TenantOfficeId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var report = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    {"ContractNumber","Contract Number"},
                    {"CustomerName","Customer Name"},
                    {"Code","Base Location"},
                    {"CategoryName","Asset Category"},
                    {"ProductCountAtBooking","Asset Count"},
                    {"ProductCountUploaded","Assets Uploaded"},
                    {"PendingProductCountToBeUploaded","Assets Not Uploaded"},
                    {"PreAmcStartDate","PreAMC Start Date" },
                    {"PreAmcCompleteCount","PreAMC Completed Count"},
                    {"AssetsFoundInPreAmc","Assets Found in PreAMC" },
                    {"AssetsNotFoundInPreAmc","Assets Not Found in PreAMC" },
                    {"AssetsInGoodCondition","Assets In Good Condition"},
                    {"AssetsNotInGoodCondition","Assets Not In Good Condition"}
                };

                var records = new List<object[]>();
                foreach (var preamcAssetSummary in report)
                {
                    var dictionaryPreAmcSummaryReport = (IDictionary<string, object>)preamcAssetSummary;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        if (header == "PreAmcStartDate")
                        {
                            record[index++] = dictionaryPreAmcSummaryReport[header].ToString();
                        }
                        else
                        {
                            record[index++] = dictionaryPreAmcSummaryReport[header];
                        }
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "contract_asset_summary_preamc_report.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"contract_asset_summary_preamc_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("preamcassetdetail")]
        [Authorize()]
        public async Task<ActionResult> DownloadContractAssetDetailPreAmcReport(string? TimeZone, int? ContractId,
                                        int? CustomerId, int? AssetProductCategryId, DateTime? DateFrom,
                                        DateTime? DateTo, int? CustomerSiteId, int? TenantRegionId,
                                        int? TenantOfficeId,int? MakeId, int? ProductModelId,
                                        int? AssetConditionId, int? OutSourceNeeded)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractassetdetail_preamc_report";
                var parameters = new DynamicParameters();
                parameters.Add("@ContractId", ContractId);
                parameters.Add("@CustomerId", CustomerId);
                parameters.Add("@AssetCategoryId", AssetProductCategryId);
                parameters.Add("@FilterStartDate", DateFrom);
                parameters.Add("@FilterEndDate", DateTo);
                parameters.Add("@SiteId", CustomerSiteId);
                parameters.Add("@TenantRegionId", TenantRegionId);
                parameters.Add("@TenantOfficeId", TenantOfficeId);
                parameters.Add("@AssetMakeId", MakeId);
                parameters.Add("@AssetModelId", ProductModelId);
                parameters.Add("@OutSourceServiceRequired", OutSourceNeeded);
                parameters.Add("@AssetConditionId", AssetConditionId);
                parameters.Add("@TimeZone", TimeZone);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var report = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    {"BaseLocation","Base Location" },
                    {"ContractNumber","Contract Number"},
                    {"CustomerName","Customer Name"},
                    {"MappedLocation","Mapped Location"},
                    {"SiteName","Customer Site Name"},
                    {"EquipmentId","Asset Id"},
                    {"CategoryName","Assets Category Name"},
                    {"ProductMake","Product Make"},
                    {"ProductModel","Product Model" },
                    {"ProductSerialNumber","Product Serial Number"},
                    {"PreAmcCompletedDate","PreAMC Completed Date" }
                };

                var records = new List<object[]>();
                foreach (var preamcAssetSummary in report)
                {
                    var dictionaryPreAmcDetailReport = (IDictionary<string, object>)preamcAssetSummary;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        if (header == "PreAmcCompletedDate")
                        {

                            record[index++] = dictionaryPreAmcDetailReport[header].ToString();
                        }
                        else
                        {
                            record[index++] = dictionaryPreAmcDetailReport[header];
                        }
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "contract_asset_detail_preamc_report.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"contract_asset_detail_preamc_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("contract/asset/list/download")]
        public async Task<ActionResult> DownloadContractAssetListReport(string? TimeZone,int ContractId, bool? PreAmcStatus, bool? SupportType)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractassetdetail_list_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                parameters.Add("TimeZone", TimeZone);
                parameters.Add("PreAmcStatus", PreAmcStatus);
                parameters.Add("SupportType", SupportType);

                var assetReport = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    {"TenantOffice","Location"},
                    {"ContractNumber","ServiceContractNumber"},
                    {"SiteName","SiteName"},
                    {"ProductCategory","ProductCategory"},
                    {"ProductMake","Make"},
                    {"ModelName","ModelNo"},
                    {"ProductSerialNumber","SerialNo"},
                    {"AmcValue","AmcValue" },
                    {"ResolutionTimeInHours","ResolutionTimeInHours"},
                    {"ResponseTimeInHours","ResponseTimeInHours"},
                    {"StandByTimeInHours","StandByTimeInHours"},
                    {"AssetWarrantyTypeCode","CallType"},
                    {"AmcStartDate","AmcStartDate"},
                    {"AmcEndDate","AmcEndDate"},
                    {"ProductSupportType","ProductSupportType"},
                    {"IsRenewedAsset","IsRenewedAsset"},
                    {"IsPreAmcCompleted","IsPreAmcCompleted"},
                    {"WarrantyEndDate","WarrantyEndDate"},
                    {"IsEnterpriseProduct","IsEnterpriseProduct"},
                    {"IsVipProduct","IsVipProduct"},
                    {"IsOutSourcingNeeded","IsOutSourcingNeeded" },
                    {"PreAmcCompletedDate","PreAmcCompletedDate"},
                    {"AssetAddMode","AssetAddMode"},
                    {"ProductCondition","ProductCondition"},
                    {"IsPreventiveMaintenanceNeeded","IsPreventiveMaintenanceNeeded"},
                    {"PreventiveMaintenanceFrequency","PreventiveMaintenanceFrequency"},
                    {"LastPmDate","LastPmDate"},
                    {"PreAmcCompletedBy","PreAmcCompletedBy"},
                    {"MspAssetId","MspAssetId"},
                    {"CustomerAssetId","CustomerAssetId"}
                };
                var records = new List<object[]>();
                Dictionary<string, object> previousValues = new Dictionary<string, object>();
                List<string> headersToCheck = new List<string> { "ContractNumber" };

                foreach (var assetinfo in assetReport)
                {
                    var dictionaryAssetReport = (IDictionary<string, object>)assetinfo;
                    var record = new object[headers.Count()];
                    int index = 0;
                    var empcode = dictionaryAssetReport["ContractNumber"];
                    foreach (var header in headers.Keys)
                    {
                        var value = dictionaryAssetReport[header];
                        if (headersToCheck.Contains(header))
                        {
                            if (previousValues.ContainsKey("ContractNumber") && value != null && empcode != null && empcode.Equals(previousValues["ContractNumber"]))
                            {
                                record[index] = null;
                            }
                            else
                            {
                                record[index] = value;
                            }
                        }
                        else
                        {
                            record[index] = value;
                        }
                        index++;
                    }
                    previousValues["ContractNumber"] = empcode;
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "asset_list.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"asset_detail_report_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("contract/manpower/allocation/list/download")]
        public async Task<ActionResult> DownloadContractManpowerAllocationListReport(string? TimeZone, int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractmanpowerallocation_list_report_download";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                parameters.Add("TimeZone", TimeZone);
                var allocationReport = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var headers = new Dictionary<string, string>()
                {
                    {"ContractNumber","ServiceContractNumber"},
                    {"SiteName","SiteName"},
                    {"Employee","Employee"},
                    {"StartDate","StartDate"},
                    {"EndDate","EndDate"},
                    {"CustomerAgreedAmount","CustomerAgreedAmount"},
                    {"BudgetedAmount","BudgetedAmount" },
                    {"MarginAmount","MarginAmount"},
                    {"AlloctionStatus","AlloctionStatus"}
                };

                var records = new List<object[]>();
                Dictionary<string, object> previousValues = new Dictionary<string, object>();
                List<string> headersToCheck = new List<string> { "ContractNumber" };

                foreach (var allocationdata in allocationReport)
                {
                    var dictionaryAllocationReport = (IDictionary<string, object>)allocationdata;
                    var record = new object[headers.Count()];
                    int index = 0;
                    var empcode = dictionaryAllocationReport["ContractNumber"];
                    foreach (var header in headers.Keys)
                    {
                        var value = dictionaryAllocationReport[header];
                        if (headersToCheck.Contains(header))
                        {
                            if (previousValues.ContainsKey("ContractNumber") && value != null && empcode != null && empcode.Equals(previousValues["ContractNumber"]))
                            {
                                record[index] = null;
                            }
                            else
                            {
                                record[index] = value;
                            }
                        }
                        else
                        {
                            record[index] = value;
                        }
                        index++;
                    }
                    previousValues["ContractNumber"] = empcode;
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "manpowerallocation_list.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"manpowerallocation_list_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}