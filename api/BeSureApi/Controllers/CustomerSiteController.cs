using BeSureApi.Exceptions;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Services.LogService;
using static BeSureApi.Models.CustomerSite;
using OfficeOpenXml;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using System;
using System.Reflection;
using System.Linq;

namespace BeSureApi.Controllers
{
    [Route("api/customersite")]
    [ApiController]
    public class CustomerSiteController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private IEnumerable<TenantOfficeCodes> _tenantOffice;
        private ContractDetail _contractDetails;
        private IEnumerable<int> _contractCustomerSites;
        private IEnumerable<CustomerSitNames> _customerSites;
        private IEnumerable<CustomerStates> _customerStates;
        private IEnumerable<CustomerCities> _customerCities;
        Dictionary<int, List<string>> customerSiteValidations = new Dictionary<int, List<string>>();
        private int? _customerStateId;
        private int? _tenantOfficeId;
        List<string> customerSiteNames = new List<string>();
        public CustomerSiteController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpGet]
        [Route("get/all")]
        public async Task<ActionResult> GetAllCustomerSiteList(string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<CustomerSiteList> customerSiteList = await GetAllCustomerSiteList(connection,Search);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = customerSiteList
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
                            new ExceptionHandler(ex,"customer_site_management_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<CustomerSiteList>> GetAllCustomerSiteList(SqlConnection Connection, string? Search)
        {
            var procedure = "customer_site_list";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            var customerSiteList = await Connection.QueryAsync<CustomerSiteList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return customerSiteList;
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMERS_CUSTOMER_SITE_CREATE)]
        public async Task<object> CreateCustomerSite(CustomerSiteCreate CustomerSite)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customer_site_create";
                var parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("CustomerId", CustomerSite.CustomerId);
                parameters.Add("SiteName", CustomerSite.SiteName);
                parameters.Add("Address", CustomerSite.Address);
                parameters.Add("CityId", CustomerSite.CityId);
                parameters.Add("StateId", CustomerSite.StateId);
                parameters.Add("Pincode", CustomerSite.Pincode);
                parameters.Add("GeoLocation", CustomerSite.GeoLocation);
                parameters.Add("TenantOfficeId", CustomerSite.TenantOfficeId);
                parameters.Add("PrimaryContactName", CustomerSite.PrimaryContactName);
                parameters.Add("PrimaryContactPhone", CustomerSite.PrimaryContactPhone);
                parameters.Add("PrimaryContactEmail", CustomerSite.PrimaryContactEmail);
                parameters.Add("SecondaryContactName", CustomerSite.SecondaryContactName);
                parameters.Add("SecondaryContactPhone", CustomerSite.SecondaryContactPhone);
                parameters.Add("SecondaryContactEmail", CustomerSite.SecondaryContactEmail);
                parameters.Add("IsCustomerSiteCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync<CustomerSiteCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isCustomerSiteCreated = parameters.Get<int>("IsCustomerSiteCreated");
                if (isCustomerSiteCreated == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCustomerSiteCreated = Convert.ToBoolean(isCustomerSiteCreated)
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
                            new ExceptionHandler(ex, "customer_site_management_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMERS_CUSTOMER_SITE_CREATE)]
        public async Task<object> UpdaateCustomerSite(CustomerSiteUpdate CustomerSite)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customersite_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", CustomerSite.Id);
                parameters.Add("CustomerId", CustomerSite.CustomerId);
                parameters.Add("SiteName", CustomerSite.SiteName);
                parameters.Add("Address", CustomerSite.Address);
                parameters.Add("CityId", CustomerSite.CityId);
                parameters.Add("StateId", CustomerSite.StateId);
                parameters.Add("Pincode", CustomerSite.Pincode);
                parameters.Add("GeoLocation", CustomerSite.GeoLocation);
                parameters.Add("TenantOfficeId", CustomerSite.TenantOfficeId);
                parameters.Add("PrimaryContactName", CustomerSite.PrimaryContactName);
                parameters.Add("PrimaryContactPhone", CustomerSite.PrimaryContactPhone);
                parameters.Add("PrimaryContactEmail", CustomerSite.PrimaryContactEmail);
                parameters.Add("SecondaryContactName", CustomerSite.SecondaryContactName);
                parameters.Add("SecondaryContactPhone", CustomerSite.SecondaryContactPhone);
                parameters.Add("SecondaryContactEmail", CustomerSite.SecondaryContactEmail);
                parameters.Add("ModifiedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<CustomerSiteUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);
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
                            new ExceptionHandler(ex,"update_customer_site_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMER_LIST)]
        public async Task<ActionResult> GetCustomerSiteList(int Page, string? Search, int CustomerId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<CustomerSiteList> customerSiteList = await GetCustomerSiteList(connection, Page, Search, CustomerId);
                int totalRows = await GetCustomerSiteCount(connection, Page, Search, CustomerId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CustomerSiteList = customerSiteList,
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
                            new ExceptionHandler(ex, "customer_site_management_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<CustomerSiteList>> GetCustomerSiteList(SqlConnection Connection, int Page, string? Search, int CustomerId)
        {
            var procedure = "customer_site_list";
            var parameters = new DynamicParameters();
            parameters.Add("CustomerId", CustomerId);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var customerSiteList = await Connection.QueryAsync<CustomerSiteList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return customerSiteList;
        }
        private async Task<int> GetCustomerSiteCount(SqlConnection Connection, int Page, string? Search, int CustomerId)
        {
            var procedure = "customer_site_count";
            var parameters = new DynamicParameters();
            parameters.Add("CustomerId", CustomerId);
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost("bulk/upload/preview")]
        public async Task<IActionResult> CustomerSiteBulkUploadPreview([FromForm] CustomerSiteBulkUploadPreview CustomerSiteDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                using var stream = CustomerSiteDetails.file?.OpenReadStream();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var excelDetails = new ExcelPackage(stream);
                var worksheet = excelDetails.Workbook.Worksheets[0];
                var rowCount = worksheet.Dimension.Rows;
                var columnCount = worksheet.Dimension.Columns;
                if (columnCount != Convert.ToInt16(_config.GetSection("ExcelPreview:CustomerSiteExcelColumn").Value) || (rowCount == 2 && !IsRowFilled(worksheet, 2, columnCount - 1)) || rowCount == 1)
                {
                    throw new CustomException("customer_site_management_invalid_excel");
                }

                bool isLastRowFilled = IsRowFilled(worksheet, rowCount, columnCount - 1);

                if (!isLastRowFilled)
                {
                    for (int row = rowCount - 1; row >= 2; row--)
                    {
                        if (IsRowFilled(worksheet, row, columnCount - 1))
                        {
                            rowCount = row;
                            break;
                        }
                    }
                }

                bool IsRowFilled(ExcelWorksheet worksheet, int rowNumber, int lastColumnIndex)
                {
                    for (int column = 1; column <= lastColumnIndex; column++)
                    {
                        var cell = worksheet.Cells[rowNumber, column];
                        if (cell.Value != null && !string.IsNullOrWhiteSpace(cell.Value.ToString()))
                        {
                            return true;
                        }
                    }
                    return false;
                }

                if (CustomerSiteDetails.ContractId == null)
                {
                    var firstContractNumber = worksheet.Cells[2, 1].Value;
                    for (int row = 3; row <= rowCount; row++)
                    {
                        var contractNumber = worksheet.Cells[row, 1].Value;
                        if (!contractNumber.Equals(firstContractNumber))
                        {
                            throw new CustomException("customer_site_management_contractnbr_mismatch");
                        }
                    }
                    var procedure = "contract_getidbycontractnumber";
                    var parameters = new DynamicParameters();
                    parameters.Add("ContractNumber", firstContractNumber);
                    int? contractId = await connection.QuerySingleOrDefaultAsync<int?>(procedure, parameters, commandType: CommandType.StoredProcedure);
                    if (contractId == null)
                    {
                        throw new CustomException("customer_site_management_invalid_contractnbr");
                    }
                    CustomerSiteDetails.ContractId = contractId;
                }
                var customerSitesDetails = new List<Dictionary<string, object>>();

                _contractDetails = await GetContractNumber(connection, CustomerSiteDetails.ContractId ??0 );
                _customerCities = await GetAllCitiesWithState(connection);
                _tenantOffice = await GetTenantOfficeCode(connection);
                _contractCustomerSites = await GetContractCustomerSites(connection, CustomerSiteDetails.ContractId ?? 0);
                _customerSites = await GetCustomerSites(connection, _contractDetails.CustomerId);
                _customerStates = await GetAllStates(connection);

                Dictionary<string, CustomerSiteColumnNamesMapping> columnNamesMapping = new Dictionary<string, CustomerSiteColumnNamesMapping>
                {
                    { "SERVICECONTRACTNO", new CustomerSiteColumnNamesMapping { IsMandatory = true, DbName = "ContractNumber" } },
                    { "SITENAME", new CustomerSiteColumnNamesMapping { IsMandatory = false, DbName = "SiteName" } },
                    { "CUSTOMERADDRESS", new CustomerSiteColumnNamesMapping { IsMandatory = true, DbName = "Address" } },
                    { "CUSTOMERADDRESS2", new CustomerSiteColumnNamesMapping { IsMandatory = false, DbName = "AddressOne" } },
                    { "CUSTOMERADDRESS3", new CustomerSiteColumnNamesMapping { IsMandatory = false, DbName = "AddressTwo" } },
                    { "CUSTOMERADDRESS4", new CustomerSiteColumnNamesMapping { IsMandatory = false, DbName = "AddressThree" } },
                    { "CITY", new CustomerSiteColumnNamesMapping { IsMandatory = true, DbName = "City" } },
                    { "STATE", new CustomerSiteColumnNamesMapping { IsMandatory = true, DbName = "State" } },
                    { "PINCODE", new CustomerSiteColumnNamesMapping { IsMandatory = true, DbName = "Pincode" } },
                    { "TELEPHONE", new CustomerSiteColumnNamesMapping { IsMandatory = true, DbName = "Telephone" } },
                    { "CONTACTPERSONONE", new CustomerSiteColumnNamesMapping { IsMandatory = true, DbName = "ContactPersonOne" } },
                    { "CONTACTPERSONTWO", new CustomerSiteColumnNamesMapping { IsMandatory = false, DbName = "ContactPersonTwo" } },
                    { "EMAILADDRESSONE", new CustomerSiteColumnNamesMapping { IsMandatory = true, DbName = "EmailOne" } },
                    { "EMAILADDRESSTWO", new CustomerSiteColumnNamesMapping { IsMandatory = false, DbName = "EmailTwo" } },
                    { "MAPPEDLOCATION", new CustomerSiteColumnNamesMapping { IsMandatory = true, DbName = "Location" } },
                    { "RE", new CustomerSiteColumnNamesMapping { IsMandatory = false, DbName = "IsReRequired" } },
                };

                for (int row = 2; row <= rowCount; row++)
                {
                    var eachCustomersiteDetails = new Dictionary<string, object>();
                    eachCustomersiteDetails["Id"] = row - 1;
                    eachCustomersiteDetails["CustomerId"] = _contractDetails.CustomerId;
                    for (int col = 1; col <= columnCount; col++)
                    {
                        var columnName = worksheet.Cells[1, col].Value.ToString();
                        CustomerSiteColumnNamesMapping columnMetadata = columnNamesMapping[columnName.ToUpper()];

                        if (columnMetadata != null)
                        {
                            var columnValue = worksheet.Cells[row, col].Value;
                            eachCustomersiteDetails[columnMetadata.DbName] = columnMetadata.DbName == "Telephone" ? (columnValue != null ? columnValue.ToString()?.Split(',')[0]?.Replace(" ", "") : null) 
                                : columnValue?.ToString() ?? null;
                            if (columnMetadata.DbName == "SiteName")
                            {
                                int? siteId = _customerSites.FirstOrDefault(cs => cs?.SiteName?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower())?.Id;
                                bool isSiteNameExist = siteId.HasValue && _contractCustomerSites?.Contains(siteId.Value) == true;
                                if (!isSiteNameExist)
                                {
                                    if (!customerSiteNames.Contains(columnValue))
                                    {
                                        if ((_contractDetails.SiteCount - customerSiteNames.Count) <= 0) throw new CustomException("SiteName count exceeded for this contract");
                                        customerSiteNames.Add((string)columnValue);
                                    }
                                    else
                                    {
                                        isSiteNameExist = true;
                                    }
                                }
                                if (isSiteNameExist == true) AddValidationError(row, "site_document_upload_validation_sitename");
                                eachCustomersiteDetails["SiteNameId"] = siteId ?? null;
                                eachCustomersiteDetails["IsSiteNameExist"] = isSiteNameExist;
                            }

                            if(columnMetadata.DbName == "IsReRequired")
                            {
                                bool processedColumnValue = false;
                                bool isReRequiredValid = true;
                                if (columnValue?.ToString()?.Trim().ToLower() == "yes")
                                {
                                    processedColumnValue = true;
                                }
                                else if (columnValue?.ToString()?.Trim().ToLower() == "no")
                                {
                                    processedColumnValue = false;
                                }
                                else
                                {
                                    isReRequiredValid = false;
                                }
                                if (isReRequiredValid == false) AddValidationError(row, "site_document_upload_validation_isrerequired");
                                eachCustomersiteDetails["IsReRequiredId"] = processedColumnValue;
                                eachCustomersiteDetails["IsReRequiredValid"] = isReRequiredValid;
                            }

                            if (columnMetadata.IsMandatory)
                            {
                                var (processedColumnName, processedColumnValue) = GetProcessedColumnValue(columnMetadata.DbName, columnValue,row);
                                eachCustomersiteDetails[processedColumnName] = processedColumnValue;
                            }
                        }
                        else
                        {
                            throw new CustomException("Invalid Excel Sheet");
                        }
                    }
                    customerSitesDetails.Add(eachCustomersiteDetails);
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        SiteDetails = customerSitesDetails,
                        ContractId = CustomerSiteDetails.ContractId,
                        CustomerSiteValidations = customerSiteValidations
                    }
                })); ;
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                    new ExceptionHandler(ex, "customer_site_maangement_preview_customer_site_document_failed_message", _logService).GetMessage()
                }
                    }
                }));
            }
        }
        void AddValidationError(int key, string errorMessage)
        {
            if (!customerSiteValidations.ContainsKey(key))
            {
                customerSiteValidations[key] = new List<string>();
            }
            customerSiteValidations[key].Add(errorMessage);
        }
        private (string? processedColumnName, dynamic? processedColumnValue) GetProcessedColumnValue(string columnName, object columnValue,int index)
        {
            string? processedColumnName = columnName + "Id";
            dynamic? processedColumnValue = null;
            switch (columnName)
            {
                case "ContractNumber":
                        if (columnValue != null)
                        {
                            processedColumnValue = Convert.ToBoolean(_contractDetails.ContractNumber?.ToString()?.Trim()?.ToLower() == columnValue?.ToString()?.Trim()?.ToLower() ? 1 : 0);
                        }
                        else
                        {
                            processedColumnValue = true;
                        }
                    if (processedColumnValue == false) AddValidationError(index, "site_document_upload_validation_contractnumber");
                    processedColumnName = "IsContractNumValid";
                    break;
                case "State":
                        processedColumnValue = _customerStates.FirstOrDefault(cc => cc?.Name?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower())?.Id ?? null;
                        _customerStateId = processedColumnValue;
                    if (processedColumnValue == null) AddValidationError(index, "site_document_upload_validation_state");
                    break;
                case "City":
                        IEnumerable<CustomerCities>? cities = _customerCities.Where(cc => cc?.StateId == _customerStateId);
                        IEnumerable<CustomerCities>? FilterCity = cities.Where(cc => cc?.Name?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower());
                        _tenantOfficeId = FilterCity.FirstOrDefault(cc => cc?.TenantOfficeId != null).TenantOfficeId;
                        processedColumnValue = cities.FirstOrDefault(cc => cc?.Name?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower())?.Id ?? null;
                    if (processedColumnValue == null) AddValidationError(index, "site_document_upload_validation_city");
                    break;
                case "Location":
                    var tenantOfficeId = _tenantOffice.FirstOrDefault(toc => toc?.Code?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower())?.Id;
                    processedColumnValue = tenantOfficeId == _tenantOfficeId ? tenantOfficeId : null;
                    if (processedColumnValue == null)
                    {
                        AddValidationError(index, "site_document_upload_validation_location");
                    }
                    break;

                case "Pincode":
                case "Telephone":
                        processedColumnName = "Is" + columnName + "Valid";
                        string trimmedValue = columnValue?.ToString()?.Split(',')[0]?.Replace(" ", "");
                        processedColumnValue = !string.IsNullOrWhiteSpace(trimmedValue) && double.TryParse(trimmedValue, out _);
                    if (processedColumnValue == false) AddValidationError(index, "site_document_upload_validation_"+columnName.ToLower());
                    break;
            }
            return (processedColumnName, processedColumnValue);
        }

        private async Task<IEnumerable<CustomerSitNames>> GetCustomerSites(SqlConnection Connection, int CustomerId)
        {
            var procedure = "customer_site_names";
            var parameters = new DynamicParameters();
            parameters.Add("CustomerId", CustomerId);
            var customerSites = await Connection.QueryAsync<CustomerSitNames>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return customerSites;
        }
        private async Task<IEnumerable<int>> GetContractCustomerSites(SqlConnection Connection, int ContractId)
        {
            var procedure = "contract_customer_site_names";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            var customerSites = await Connection.QueryAsync<int>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return customerSites;
        }
        private async Task<IEnumerable<TenantOfficeCodes>> GetTenantOfficeCode(SqlConnection Connection)
        {
            var procedure = "tenant_office_code_list";
            var tenantOfficeCode = await Connection.QueryAsync<TenantOfficeCodes>(procedure, commandType: CommandType.StoredProcedure);
            return tenantOfficeCode;
        }
        private async Task<IEnumerable<CustomerStates>> GetAllStates(SqlConnection Connection)
        {
            var procedure = "state_get_all_in_country";
            var parameters = new DynamicParameters();
            parameters.Add("CountryId", 1);
            var states = await Connection.QueryAsync<CustomerStates>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return states;
        }
        private async Task<IEnumerable<CustomerCities>> GetAllCitiesWithState(SqlConnection Connection)
        {
            var procedure = "city_get_all_with_state";
            var cities = await Connection.QueryAsync<CustomerCities>(procedure, commandType: CommandType.StoredProcedure);
            return cities;
        }
        private async Task<ContractDetail> GetContractNumber(SqlConnection Connection, int ContractId)
        {
            var procedure = "customer_contractnumber_check";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            var contractNumber = await Connection.QueryFirstOrDefaultAsync<ContractDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractNumber;
        }

        [HttpPost, Authorize()]
        [Route("bulk/upload")]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMER_SITE_UPLOAD)]
        public async Task<IActionResult> CustomerSiteBulkUpload(CustomerSiteBulkUpload customerSitesDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customer_site_bulk_upload";
                var parameters = new DynamicParameters();
                parameters.Add("CustomerSites", JsonSerializer.Serialize(customerSitesDetails.CustomerSites));
                parameters.Add("ContractId",customerSitesDetails.ContractId);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<CustomerSiteCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCustomerSiteCreated = true
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
                            new ExceptionHandler(ex,"customer_site_management_bulk_upload_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("names")]
        public async Task<ActionResult> GetAllCustomerSitesNames(int CustomerInfoId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customersite_names";
                var parameters = new DynamicParameters();
                parameters.Add("CustomerInfoId", CustomerInfoId);
                var customersitesnames = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = customersitesnames
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
                            new ExceptionHandler(ex,"customer_site_management_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("delete")]
        public async Task<ActionResult<List<Deletesite>>> DeleteSite(Deletesite Delete)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customersite_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Delete.Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                connection.Query<Deletesite>(procedure, parameters, commandType: CommandType.StoredProcedure);

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
                            new ExceptionHandler(ex, "customer_site_management_failure_delete", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("exist/check")]
        public async Task<ActionResult> CheckActiveSite(int CustomersiteId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsSiteExist = await GetActiveCustomerSite(Connection,CustomersiteId)
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
                            new ExceptionHandler(ex,"customer_site_management_no_customer_exists_in_active_contract", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<int> GetActiveCustomerSite(SqlConnection Connection, int CustomerSiteId)
        {
            var procedure = "contractcustomersite_activesite_exist_check";
            var parameters = new DynamicParameters();
            parameters.Add("CustomerSiteId", CustomerSiteId);
            parameters.Add("IsSiteExist", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@IsSiteExist");
        }

        [HttpGet]
        [Route("update/details")]
        public async Task<ActionResult> GetCustomerSiteDetails(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customersite_edit_details";
                var parameters = new DynamicParameters();
                parameters.Add("@Id", Id);
                var customerSiteDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CustomerSiteDetails = customerSiteDetails.First()
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
                            new ExceptionHandler(ex,"customersite_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/names/by/contractfilter")]
        [Authorize()]
        public async Task<ActionResult> GetCustomerSitesByRegionOfficeGroupFilter(int? TenantRegionId, int? TenantOfficeId, int? CustomerGroupId, int? CustomerId,int? ContractId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customersite_get_names_by_customer_filter";
                var parameters = new DynamicParameters();
                  parameters.Add("ContractId", ContractId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var customersites = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { CustomerSiteNames = customersites } };
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
