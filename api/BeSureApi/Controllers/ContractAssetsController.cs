using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using static Org.BouncyCastle.Math.EC.ECCurve;
using OfficeOpenXml;
using System.Text.Json.Serialization;
using System.Net.Http.Json;
using System.Text.Json.Nodes;
using BeSureApi.Models;
using System.Diagnostics.Contracts;
using static BeSureApi.Models.CustomerSite;
using Org.BouncyCastle.Bcpg.OpenPgp;
using static OfficeOpenXml.ExcelErrorValue;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Helpers;
using System.Collections.Generic;
using System;

namespace BeSureApi.Controllers
{
    [Route("api/contract/asset")]
    [ApiController]
    public class ContractAssetsController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private IEnumerable<ContractCustomerSites> _contractCustomerSites;
        private IEnumerable<string> _contractProductsSerialNumber;
        private IEnumerable<ProductCategoryDetails> _productCategoryDetails;
        private IEnumerable<ContractProductMake> _productsMake;
        private IEnumerable<ContractProduct> _productsModel;
        private IEnumerable<MasterDataNames> _productSupportTypes;
        private string _contractNumber;
        List<string> serialNumber = new List<string>();
        private IEnumerable<TenantOfficeCodes> _tenantOfficeCodes;
        private List<CountObject> categorywiseAssetsInUploadedData = new List<CountObject>();
        private int? _locationId;
        Dictionary<string, List<string>> errorCollection = new Dictionary<string, List<string>>();
        Dictionary<int, List<string>> assetValidations = new Dictionary<int, List<string>>();
        private IEnumerable<ContractAssetsSerialNumber> _contractAssetSerialNumbers;
        private IEnumerable<BackToBackVendorsList> _backtobackvendorBranches;
        private IEnumerable<PreAmcCompletedEngineers> _preamcCompletedEngineers;
        private IEnumerable<PreAmcVendorList> _preamcVendorList;
        public ContractAssetsController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpPost, Authorize()]
        [Route("create")]
        public async Task<ActionResult> CreateContractAsset(ContractAssetDetails assetDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                _contractProductsSerialNumber = await GetContractProductsSerialNumber(connection, assetDetails.ContractId);
                bool isSerialNumberExist = _contractProductsSerialNumber.Contains(assetDetails.AssetSerialNumber);
                if (isSerialNumberExist)
                {
                    throw new CustomException("validation_error_create_asset_assetserialnumber");
                }
                assetDetails.CallType = 1001;
                List<ContractAssetDetails> assetDetailsList = new List<ContractAssetDetails> { assetDetails };
                string assetaddedmode = "AAM_MNAL";
                string userId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;

                var (isProductCountExceeded, assetId) = await ContractAssetHelper.CreateContractAsset(connection, assetDetailsList, assetaddedmode, userId, assetDetails.ContractId, null);
                if (isProductCountExceeded == null && assetId == null)
                {
                    throw new Exception();
                }
                if (isProductCountExceeded == true && assetId == null)
                {
                    throw new CustomException("validation_error_create_asset_productcount_exceeded");
                }

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsAssetCreated = true,
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
                            new ExceptionHandler(ex,"contract_asset_create_failed", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost, Authorize()]
        [Route("bulk/upload")]
        public async Task<IActionResult> ContractAssetsBulkUpload(ContractAssetsBulkUpload assetDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                string assetaddedmode = "AAM_UPLD";
                string userId = User.Claims.Where(c => c.Type == "LoggedUserId").First().Value;
                var (isProductCountExceeded, assetId) = await ContractAssetHelper.CreateContractAsset(connection, assetDetails.Assets, assetaddedmode, userId, assetDetails.ContractId, null);
                if (assetId == null)
                {
                    throw new Exception();
                };
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsAssetCreated = true,
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
                        new ExceptionHandler(ex,"contract_asset_bulk_upload_failed_message", _logService).GetMessage()
                    }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("list")]
        public async Task<ActionResult<List<ContractAssetsList>>> GetAssetList(int Page, string? Search, int ContractId, string? AssetFilters)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ContractAssetsList> contractAssetsList = await GetAssetList(connection, Page, Search, ContractId, AssetFilters);
                int totalRows = await GetAssetsCount(connection, Page, Search, ContractId, AssetFilters);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractAssetsList = contractAssetsList,
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
                            new ExceptionHandler(ex,"contract_asset_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<ContractAssetsList>> GetAssetList(SqlConnection Connection, int Page, string? Search, int ContractId, string? AssetFilter)
        {
            var procedure = "contract_asset_list";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("AssetFilters", AssetFilter);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var contractAssetsList = await Connection.QueryAsync<ContractAssetsList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractAssetsList;
        }

        private async Task<int> GetAssetsCount(SqlConnection Connection, int Page, string? Search, int ContractId, string? AssetFilters)
        {
            var procedure = "contract_assets_count";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("AssetFilters", AssetFilters);
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpPut, Authorize()]
        [Route("update")]
        public async Task<ActionResult> UpdateAssets(ContractAssetsUpdate Assets)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                if(Assets.IsActive == false) {
                    var Procedure = "contractasset_deactivation_validation";
                    var Parameters = new DynamicParameters();
                    Parameters.Add("AssetIdList", Assets.Id);
                    var serialNumber = await connection.QueryAsync<AssetDeactivationValidation>(Procedure, Parameters, commandType: CommandType.StoredProcedure);
                    if (serialNumber.Any())
                    {
                        var serialNumbers = string.Join(", ", serialNumber.Select(sn => sn.ProductSerialNumber));
                        throw new CustomException($"Deactivation failed. The following assets are currently involved in active calls and cannot be deactivated: {serialNumbers}");
                    }
                }
                var procedure = "contractassetdetail_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Assets.Id);
                parameters.Add("IsActive", Assets.IsActive);
                parameters.Add("IsVipProduct", Assets.IsVipProduct);
                parameters.Add("IsPreAmcCompleted", Assets.IsPreAmcCompleted);
                parameters.Add("IsOutsourcingNeeded", Assets.IsOutsourcingNeeded);
                parameters.Add("ProductSerialNumber", Assets.ProductSerialNumber);
                parameters.Add("AmcValue", Assets.AmcValue);
                parameters.Add("PreAmcCompletedDate", Assets.PreAmcCompletedDate);
                parameters.Add("PreAmcCompletedBy", Assets.PreAmcCompletedBy);
                parameters.Add("AmcEndDate", Assets.AmcEndDate);
                parameters.Add("AmcStartDate", Assets.AmcStartDate);
                parameters.Add("ModifiedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<ContractAssetsUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsAssetUpdated = true
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
                            new ExceptionHandler(ex,"contract_asset_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost("bulk/upload/preview")]
        public async  Task<IActionResult> ContractAssetsBulkUploadPreview([FromForm] ContractAssetBulkUploadPreview AssetsDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                using var stream            = AssetsDetails.file?.OpenReadStream();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var excelDetails      = new ExcelPackage(stream);
                var worksheet               = excelDetails.Workbook.Worksheets[0];
                var rowCount                = worksheet.Dimension.Rows;
                var columnCount             = worksheet.Dimension.Columns;
                if (columnCount != Convert.ToInt16(_config.GetSection("ExcelPreview:AssetExcelColumn").Value) || (rowCount == 2 && !IsRowFilled(worksheet, 2, columnCount - 1)) || rowCount == 1)
                {
                    throw new CustomException("Invalid Excel Sheet");
                }
                bool isLastRowFilled = IsRowFilled(worksheet, rowCount, columnCount-1);

                if (!isLastRowFilled)
                {
                    for (int row = rowCount-1; row >= 2; row--)
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

                if (AssetsDetails.ContractId == null)
                {
                    var firstContractNumber = worksheet.Cells[2, 2].Value;
                    for (int row = 3; row <= rowCount; row++)
                    {
                        var contractNumber = worksheet.Cells[row, 2].Value;
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
                    AssetsDetails.ContractId = contractId;
                }

                var assetsDetails                   = new List<Dictionary<string, object>>();
                _productCategoryDetails             = await GetProductCategoryDetails(connection, AssetsDetails.ContractId??0);
                _contractCustomerSites              = await GetContractCustomerSites(connection, AssetsDetails.ContractId?? 0);
                _contractProductsSerialNumber       = await GetContractProductsSerialNumber(connection, AssetsDetails.ContractId ?? 0);
                _contractNumber                     = await GetContractNumber(connection,AssetsDetails.ContractId ?? 0);
                _productsMake                       = await GetProductsMake(connection);
                _productsModel                      = await GetProductsModel(connection);
                _productSupportTypes                = await GetProductSupportType(connection);
                _tenantOfficeCodes                  = await GetTenantOfficeCode(connection);

                // the below are the column names expected in the excel sheet. 
                // if the number of columns in the excel is different from validColumnNames.length; then the excel is considered to be invalid
                // Todo: this should be configurable from the settings table/appsettings.json

                Dictionary<string, ContractAssetColumnNamesMapping> columnNamesMapping = new Dictionary<string, ContractAssetColumnNamesMapping>
                {
                    { "LOCATION", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "Location" } },
                    { "SERVICECONTRACTNO", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "ContractNumber" } },
                    { "SITENAME", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "SiteName" } },
                    { "PRODUCTCATEGORY", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "ProductCategory" } },
                    { "MAKE", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "ProductMake" } },
                    { "MODELNO", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "Product" } },
                    { "SERIALNO", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "AssetSerialNumber" } },
                    { "UNITPRICE", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "AmcValue" } },
                    { "RESPONSETIME", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "ResponseTimeInHours" } },
                    { "RESOLUTIONTIME", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "ResolutionTimeInHours" } },
                    { "STANDBYTIME", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "StandByTimeInHours" } },
                    { "CALLTYPE", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "CallType" } },
                    { "AMCSTARTDATE", new ContractAssetColumnNamesMapping { IsMandatory = false, DbName = "AMCStartDate" } },
                    { "AMCENDDATE", new ContractAssetColumnNamesMapping { IsMandatory = false, DbName = "AMCEndDate" } },
                    { "SUPPORTTYPE", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "AssetSupportType" } },
                    { "ISPREAMCCOMPLETED", new ContractAssetColumnNamesMapping { IsMandatory = false, DbName = "IsPreAmcCompletedValue" } },
                    { "ISRENEWEDASSET", new ContractAssetColumnNamesMapping { IsMandatory = false, DbName = "IsRenewedAssetValue" } },
                    { "WARRANTYENDDATE", new ContractAssetColumnNamesMapping { IsMandatory = false, DbName = "WarrantyEndDate" } },
                };

                for (int row = 2; row <= rowCount; row++)
                {
                    var eachAsset   = new Dictionary<string, object>();
                    eachAsset["Id"] = row-1;
                    for (int col = 1; col <= columnCount; col++)
                    {
                        // get the "column name (header)" and corresponding column value in the row
                        var columnName = worksheet.Cells[1, col].Value.ToString();

                        // check if excel headers are valid
                        ContractAssetColumnNamesMapping columnMetadata = columnNamesMapping[columnName];

                        if (columnMetadata != null)
                        {
                            var columnValue = worksheet.Cells[row, col].Value;

                            eachAsset[columnMetadata.DbName] = (columnMetadata.DbName == "AMCStartDate" || columnMetadata.DbName == "AMCEndDate" || columnMetadata.DbName == "WarrantyEndDate")
                                    ? (columnValue != null && double.TryParse(columnValue.ToString(), out double doubleValue) && doubleValue != 0 ? (DateTime?)DateTime.FromOADate(doubleValue) : null)
                                    : (columnMetadata.DbName == "AmcValue" ? (columnValue != null ? columnValue.ToString().Trim() : null)
                                    : columnValue?.ToString());

                            if ((columnMetadata.DbName == "AMCStartDate" || columnMetadata.DbName == "AMCEndDate" || columnMetadata.DbName == "AmcValue") && eachAsset[columnMetadata.DbName] == null)
                            {
                                AddValidationError(row, "asset_document_upload_validationerror_" + columnMetadata.DbName.ToLower());
                            }

                            if (columnMetadata.DbName == "IsPreAmcCompletedValue" || columnMetadata.DbName == "IsRenewedAssetValue")
                            {
                                string columnKey = columnMetadata.DbName == "IsPreAmcCompletedValue" ? "IsPreAmcCompleted" : "IsRenewedAsset";

                                int processedColumnValue = 0;
                                bool isColumnValueValid = true;
                                if (columnValue?.ToString()?.Trim().ToLower() == "yes")
                                {
                                    processedColumnValue = 1;
                                }
                                else if (columnValue?.ToString()?.Trim().ToLower() == "no")
                                {
                                    processedColumnValue = 0;
                                }
                                else
                                {
                                    isColumnValueValid = false;
                                }
                                eachAsset[columnKey] = processedColumnValue;
                                eachAsset[columnKey + "Valid"] = isColumnValueValid;
                            }
                            if (columnMetadata.IsMandatory)
                            {
                                var (processedColumnName, processedColumnValue) = GetProcessedColumnValue(columnMetadata.DbName, columnValue, row);
                                eachAsset[processedColumnName] = processedColumnValue;
                            }
                        }
                        else
                        {
                            throw new CustomException("Invalid Excel Sheet");
                        }
                    }
                    assetsDetails.Add(eachAsset);
                    bool isLastRow = (row == rowCount);
                    if (isLastRow)
                    {
                        errorCollection
                        .Where(kv => kv.Value.Any())
                        .ToList()
                        .ForEach(kv =>
                        {
                            if (kv.Key == "limitExceeded")
                            {
                                ModelState.AddModelError("limitExceeded", string.Join(", ", kv.Value.Distinct()));
                            }
                            else
                            {
                                ModelState.AddModelError("notAddedInSummary", string.Join(", ", kv.Value.Distinct()));
                            }
                        });
                        if (!ModelState.IsValid)
                        {
                            return BadRequest(JsonSerializer.Serialize(new
                            {
                                status = StatusCodes.Status400BadRequest,
                                errors = UnprocessableEntity(ModelState).Value
                            }
                           ));
                        }
                    }
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        AssetDetails = assetsDetails,
                        ContractId = AssetsDetails.ContractId,
                        AssetValidations = assetValidations
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
                            new ExceptionHandler(ex, "contract_asset_preview_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        void AddValidationError(int key, string errorMessage)
        {
            if (!assetValidations.ContainsKey(key))
            {
                assetValidations[key] = new List<string>();
            }
            assetValidations[key].Add(errorMessage);
        }
        private (string? processedColumnName, dynamic? processedColumnValue) GetProcessedColumnValue(string columnName, object columnValue,int index)
        {
            string? processedColumnName = columnName + "Id";
            dynamic ? processedColumnValue  = null;

            switch (columnName)
            {
                case "SiteName":
                    ContractCustomerSites? siteName = _contractCustomerSites.FirstOrDefault(site => site?.SiteName?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower());
                    if (siteName != null)
                    {
                        processedColumnValue = siteName.TenantOfficeId == _locationId ? siteName.Id : null;
                    }
                    if (processedColumnValue == null) AddValidationError(index, "asset_document_upload_validationerror_sitename");
                    break;
                case "ContractNumber":
                    processedColumnValue = Convert.ToBoolean(_contractNumber?.ToString()?.Trim()?.ToLower() == columnValue?.ToString()?.Trim()?.ToLower() ? 1 : 0);
                    processedColumnName = "IsContractNOValid";
                    if (processedColumnValue == false) AddValidationError(index, "asset_document_upload_validationerror_cno");
                    break;
                case "Location":
                    processedColumnValue = _tenantOfficeCodes.FirstOrDefault(toc => toc?.Code?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower())?.Id ?? null;
                    if (processedColumnValue != null)
                    {
                        processedColumnValue = _contractCustomerSites?.FirstOrDefault(site => site?.TenantOfficeId == processedColumnValue)?.TenantOfficeId ?? null;
                        _locationId = processedColumnValue;
                    }
                    if (processedColumnValue == null) AddValidationError(index, "asset_document_upload_validationerror_location");
                    break;
                case "ProductCategory":
                    var category = _productCategoryDetails.FirstOrDefault(category => category?.CategoryName?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower());

                    if (category != null)
                    {
                        // product category id & count are existising in the categorywiseAssetsInUploadedData list
                        var existingObjectIndex = categorywiseAssetsInUploadedData.FindIndex(obj => obj.Id == category.ProductCategoryId);
                        if (existingObjectIndex != -1)
                        {
                            if ((category.CountDifference - categorywiseAssetsInUploadedData[existingObjectIndex].Count) > 0)
                            {
                                categorywiseAssetsInUploadedData[existingObjectIndex].Count++;
                            }
                            else
                            {
                                if (!errorCollection.ContainsKey("limitExceeded"))
                                {
                                    errorCollection["limitExceeded"] = new List<string>();
                                }
                                errorCollection["limitExceeded"].Add(category.CategoryName.ToString());
                            }
                        }
                        else
                        {
                            if(category.CountDifference != 0)
                            {
                                categorywiseAssetsInUploadedData.Add(new CountObject { Id = category.ProductCategoryId, Count = 1 });
                            }
                            else
                            {
                                if (!errorCollection.ContainsKey("limitExceeded"))
                                {
                                    errorCollection["limitExceeded"] = new List<string>();
                                }
                                errorCollection["limitExceeded"].Add(category.CategoryName.ToString());
                            }
                        }
                        processedColumnValue = category.ProductCategoryId;
                    }
                    else
                    {
                        if(columnValue != null)
                        {
                            if (!errorCollection.ContainsKey("notAdded"))
                            {
                                errorCollection["notAdded"] = new List<string>();
                            }
                            errorCollection["notAdded"].Add(columnValue.ToString());
                        }
                        else
                        {
                            processedColumnValue = null;
                        }
                    }
                    break;
                case "ProductMake":
                    processedColumnValue  = _productsMake.FirstOrDefault(make => make?.Name?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower())?.Id ?? null;

                    if (processedColumnValue == null) AddValidationError(index, "asset_document_upload_validationerror_make");
                    break;
                case "Product":
                    processedColumnValue  = _productsModel.FirstOrDefault(product => product?.ModelName?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower())?.Id??null;

                    if (processedColumnValue == null) AddValidationError(index, "asset_document_upload_validationerror_model");
                    break;
                case "AssetSupportType":
                    processedColumnValue = _productSupportTypes.FirstOrDefault(pst => pst?.Name?.ToString().Replace("-", "").ToLower() == columnValue?.ToString()?.Replace("-", "").ToLower())?.Id ?? null;

                    if (processedColumnValue == null) AddValidationError(index, "asset_document_upload_validationerror_supporttype");
                    break;
                case "AssetSerialNumber":
                    processedColumnValue  = _contractProductsSerialNumber.Contains(columnValue);
                    if (!processedColumnValue)
                    {
                        if (!serialNumber.Contains(columnValue))
                        {
                            serialNumber.Add(columnValue?.ToString());
                        }
                        else
                        {
                            processedColumnValue = true;
                        }
                    }
                    if (processedColumnValue == true) AddValidationError(index, "asset_document_upload_validationerror_serialnbr");
                    processedColumnName = "IsSerialNumberExist";
                    break;
                case "AmcValue":
                case "ResponseTimeInHours":
                case "ResolutionTimeInHours":
                case "StandByTimeInHours":
                case "CallType":
                    processedColumnName = "Is"+ columnName + "Valid";
                    processedColumnValue = !string.IsNullOrWhiteSpace(columnValue?.ToString()) && double.TryParse(columnValue?.ToString().Trim(), out _);
                    if (processedColumnValue == false) AddValidationError(index, "asset_document_upload_validationerror_"+ columnName.ToLower());
                    break;
            }
            return (processedColumnName, processedColumnValue);
        }
        private async Task<IEnumerable<ProductCategoryDetails>> GetProductCategoryDetails(SqlConnection Connection, int ContractId)
        {
            var procedure = "contract_productcategorydetails";
            var parameters = new DynamicParameters(); 
            parameters.Add("ContractId", ContractId);
            var productCategoryDetails = await Connection.QueryAsync<ProductCategoryDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return productCategoryDetails;
        }
        private async Task<IEnumerable<string>> GetContractProductsSerialNumber(SqlConnection Connection, int ContractId)
        {
            var procedure = "contract_assets_serial_number_check";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            var assetsSerialNumberList = await Connection.QueryAsync<string>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return assetsSerialNumberList;
        }
        private async Task<IEnumerable<ContractCustomerSites>> GetContractCustomerSites(SqlConnection Connection, int ContractId)
        {
            var procedure = "contract_assets_get_customer_site_id";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            var contractCustomerSites = await Connection.QueryAsync<ContractCustomerSites>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractCustomerSites;
        }
        private async Task<string> GetContractNumber(SqlConnection Connection, int ContractId)
        {
            var procedure = "contract_contractnumber_check";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            var contractNumber = await Connection.QueryFirstOrDefaultAsync<string>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractNumber;
        }
        private async Task<IEnumerable<ContractProductMake>> GetProductsMake(SqlConnection Connection)
        {
            var procedure = "make_get_names";
            var contractCustomerSites = await Connection.QueryAsync<ContractProductMake>(procedure, commandType: CommandType.StoredProcedure);
            return contractCustomerSites;
        }
        private async Task<IEnumerable<ContractProduct>> GetProductsModel(SqlConnection Connection)
        {
            var procedure = "product_get_model_names";
            var contractCustomerSites = await Connection.QueryAsync<ContractProduct>(procedure, commandType: CommandType.StoredProcedure);
            return contractCustomerSites;
        }
        private async Task<IEnumerable<MasterDataNames>> GetProductSupportType(SqlConnection Connection)
        {
            var procedure = "masterentitydata_getvalues_by_tablename";
            var parameters = new DynamicParameters();
            parameters.Add("EntityName", "ProductSupportType");
            var productSupportTypes = await Connection.QueryAsync<MasterDataNames>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return productSupportTypes;
        }
        private async Task<IEnumerable<TenantOfficeCodes>> GetTenantOfficeCode(SqlConnection Connection)
        {
            var procedure = "tenant_office_code_list";
            var tenantOfficeCode = await Connection.QueryAsync<TenantOfficeCodes>(procedure, commandType: CommandType.StoredProcedure);
            return tenantOfficeCode;
        }
        [HttpGet]
        [Route("exist/check")]
        public async Task<ActionResult> ContractAssetExistCheck(string? SearchType, string? SearchValue)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractasset_exist_check";
                var parameters = new DynamicParameters();
                parameters.Add("SearchType", SearchType);
                parameters.Add("SearchValue", SearchValue);
                var assetExistDetails = await connection.QueryAsync<AssetExistDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        AssetExistDetails = assetExistDetails.FirstOrDefault()
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
                            new ExceptionHandler(ex,"contract_asset_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("get/details")]
        public async Task<ActionResult> GetContractAssetDetails(int assetId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_asset_details";
                var parameters = new DynamicParameters();
                parameters.Add("AssetId", assetId);
                var assetDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        AssetDetails = assetDetails.FirstOrDefault()
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
                            new ExceptionHandler(ex,"contract_asset_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("details")]
        public async Task<ActionResult> GetAssetDetails(int ContractAssetId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "asset_details";
                var parameters = new DynamicParameters();
                parameters.Add("ContractAssetId", ContractAssetId);
                var assetDetails = await connection.QuerySingleOrDefaultAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        AssetDetails = assetDetails
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
                            new ExceptionHandler(ex,"contract_asset_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        
        [HttpPut, Authorize()]
        [Route("transfer")]
        public async Task<ActionResult<List<ContractAssetSiteTransfer>>> AssetSiteChange(ContractAssetSiteTransfer assetTransfer)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractassetdetail_sitetransfer";
                var parameters = new DynamicParameters();
                parameters.Add("AssetIdList", assetTransfer.AssetIdList);
                parameters.Add("CustomerSiteId", assetTransfer.CustomerSiteId);
                connection.Query<ContractAssetSiteTransfer>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        isUpdated = true
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
                            new ExceptionHandler(ex, "contract_asset_asset_transfer_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("edit/details")]
        public async Task<ActionResult<AssetEditDetails>> GetAssetEditDetails(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractassetdetail_edit_info";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                var contractAssetInfo = await connection.QueryAsync<AssetEditDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractAssetInfo = contractAssetInfo.First()
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
                            new ExceptionHandler(ex,"contract_asset_details_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("details/for/partindentrequest")]
        public async Task<ActionResult> GetAssetDetailsForSME(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractassetdetail_for_part_indent_request";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", ServiceRequestId);
                var assetdetail = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        AssetDetails = assetdetail.FirstOrDefault()
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
                            new ExceptionHandler(ex,"contract_assetdetail_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("getall/preamcpending/list")]
        public async Task<ActionResult<List<PreAmcPendingAssetList>>> GetAllPreAmcPendingAssets(int Page, string? Search, int? CustomerId, int? ContractId,int? CustomerSiteId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PreAmcPendingAssetList> contractAssetsList = await GetAllPreAmcpendingAssets(connection, Page, Search, CustomerId, ContractId, CustomerSiteId);
                int totalRows = await GetAllPreAmcPendingAssetsCount(connection, Search, CustomerId, ContractId, CustomerSiteId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractAssetsList = contractAssetsList,
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
                            new ExceptionHandler(ex,"contract_asset_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("getall/preamcpending/count")]
        public async Task<ActionResult<List<ContractAssetsList>>> GetAllPreAmcPendingAssetsCount()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                int preAmcendingAssetsCount = await GetAllPreAmcPendingAssetsCount(connection, null, null, null, null);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PreAmcPendingAssetsCount = preAmcendingAssetsCount,
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
                            new ExceptionHandler(ex,"contract_asset_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<PreAmcPendingAssetList>> GetAllPreAmcpendingAssets(SqlConnection Connection, int Page, string? Search, int? CustomerId, int? ContractId,int? CustomerSiteId)
        {
            var procedure = "contractassets_getall_preamcpending_list";
            var parameters = new DynamicParameters();
            parameters.Add("CustomerId", CustomerId);
            parameters.Add("ContractId", ContractId);
            parameters.Add("CustomerSiteId", CustomerSiteId);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("Search", Search);
            var contractAssetsList = await Connection.QueryAsync<PreAmcPendingAssetList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractAssetsList;
        }
        private async Task<int> GetAllPreAmcPendingAssetsCount(SqlConnection Connection, string? Search, int? CustomerId, int? ContractId, int? CustomerSiteId)
        {
            var procedure = "contractassets_getall_preamcpending_count";
            var parameters = new DynamicParameters();
            parameters.Add("CustomerId", CustomerId);
            parameters.Add("ContractId", ContractId);
            parameters.Add("CustomerSiteId", CustomerSiteId);
            parameters.Add("Search", Search);
            parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpGet]
        [Route("details/forsme")]
        public async Task<ActionResult<AssetDetailsForSme>> GetAssetDetailsForSme(string SerialNumber)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractassetdetail_for_sme";
                var parameters = new DynamicParameters();
                parameters.Add("SerialNumber", SerialNumber);
                var AssetDetailsList = await connection.QueryAsync<AssetDetailsForSme>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        AssetDetail = AssetDetailsList.FirstOrDefault()
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
                            new ExceptionHandler(ex,"assetdetail_list_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost, Authorize()]
        [Route("bulk/deactiation")]
        public async Task<ActionResult<List<DeactivatedAssetList>>> BulkAssetDeactivation(DeactivatedAssetList assets)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractasset_deactivation_validation";
                var parameters = new DynamicParameters();
                parameters.Add("AssetIdList", assets.AssetIdList);
                var serialNumber = await connection.QueryAsync<AssetDeactivationValidation>(procedure, parameters, commandType: CommandType.StoredProcedure);
                if (serialNumber.Any())
                {
                    var serialNumbers = string.Join(", ", serialNumber.Select(sn => sn.ProductSerialNumber));
                    throw new CustomException($"Deactivation failed. The following assets are currently involved in active calls and cannot be deactivated: {serialNumbers}");
                }
                procedure = "contractasset_bulk_deactivation";
                parameters = new DynamicParameters();
                parameters.Add("AssetIdList", assets.AssetIdList);
                parameters.Add("ModifiedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
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
                            new ExceptionHandler(ex, "contract_asset_asset_deactivation_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("preamc/contract/list")]
        public async Task<ActionResult<List<PreAmcAssetContract>>> GetAllPreAmcAssetContracts(int Page, string? Search, int? CustomerId, int? ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PreAmcAssetContract> contractList = await GetAllPreAmcContracts(connection, Page, Search, CustomerId, ContractId);
                int? totalRows = await GetAllPreAmcContractsCount(connection, Search, CustomerId, ContractId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractList = contractList,
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
                            new ExceptionHandler(ex,"preamcpending_contract_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PreAmcAssetContract>> GetAllPreAmcContracts(SqlConnection Connection, int Page, string? Search, int? CustomerId, int? ContractId)
        {
            var procedure = "preamc_contract_list";
            var parameters = new DynamicParameters();
            parameters.Add("CustomerId", CustomerId);
            parameters.Add("ContractId", ContractId);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("Search", Search);
            var contractAssetsList = await Connection.QueryAsync<PreAmcAssetContract>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractAssetsList;
        }
        private async Task<int?> GetAllPreAmcContractsCount(SqlConnection Connection, string? Search, int? CustomerId, int? ContractId)
        {
            var procedure = "preamc_contracts_count";
            var parameters = new DynamicParameters();
            parameters.Add("CustomerId", CustomerId);
            parameters.Add("ContractId", ContractId);
            parameters.Add("Search", Search);
            parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int?>("@TotalRows");
        }
        [HttpGet]
        [Route("preamc/sitenamewise/list")]
        public async Task<ActionResult<List<SiteNameWisePreAmcAssets>>> GetSiteNameWisePreAmcAssets(int Page, string? Search, int? ContractId, int? CustomerSiteId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<SiteNameWisePreAmcAssets> siteList = await GetSiteNameWisePreAmcAssetList(connection, Page, Search, ContractId, CustomerSiteId);
                int? totalRows = await GetSiteNameWisePreAmcAssetCount(connection, Search, ContractId, CustomerSiteId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        SiteList = siteList,
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
                            new ExceptionHandler(ex,"preamcpending_contract_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<SiteNameWisePreAmcAssets>> GetSiteNameWisePreAmcAssetList(SqlConnection Connection, int Page, string? Search, int? ContractId, int? CustomerSiteId)
        {
            var procedure = "preamc_sitewise_assetlist";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("CustomerSiteId", CustomerSiteId);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("Search", Search);
            var contractAssetsList = await Connection.QueryAsync<SiteNameWisePreAmcAssets>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractAssetsList;
        }
        private async Task<int?> GetSiteNameWisePreAmcAssetCount(SqlConnection Connection, string? Search, int? ContractId, int? CustomerSiteId)
        {
            var procedure = "preamc_sitewise_assetcount";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("CustomerSiteId", CustomerSiteId);
            parameters.Add("Search", Search);
            parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int?>("@TotalRows");
        }
        [HttpPut, Authorize()]
        [Route("preamc/update")]
        public async Task<ActionResult> UpdateAssetPreAmc(PreAmcUpdateDetails preAmcUpdateDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractassetpreamc_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", preAmcUpdateDetails.Id);
                parameters.Add("IsPreAmcCompleted", preAmcUpdateDetails.IsPreAmcCompleted);
                parameters.Add("PreAmcCompletedDate", preAmcUpdateDetails.PreAmcCompletedDate);
                parameters.Add("EngineerId", preAmcUpdateDetails.EngineerId);
                parameters.Add("ModifiedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsAssetUpdated = true
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
                            new ExceptionHandler(ex,"contract_asset_preamc_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost, Authorize()]
        [Route("bulk/preamcupdate")]
        public async Task<ActionResult<List<PreAmcPendingAssetList>>> BulkAssetPreAmcUpdate(BulkPreAmcUpdateAssets assetDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractasset_bulk_preamcupdate";
                var parameters = new DynamicParameters();
                parameters.Add("AssetIdList", assetDetails.AssetIdList);
                parameters.Add("PreAmcCompletedDate", assetDetails.PreAmcCompletedDate);
                parameters.Add("EngineerId", assetDetails.EngineerId);
                parameters.Add("ModifiedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
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
                            new ExceptionHandler(ex, "contract_asset_preamcupdate_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost("backtoback/bulk/upload/preview")]
        public async Task<IActionResult> BackToBackAssetsBulkUploadPreview([FromForm] ContractAssetBulkUploadPreview AssetsDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                using var stream = AssetsDetails.file?.OpenReadStream();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var excelDetails = new ExcelPackage(stream);
                var worksheet = excelDetails.Workbook.Worksheets[0];
                var rowCount = worksheet.Dimension.Rows;
                var columnCount = worksheet.Dimension.Columns;
                if (columnCount != Convert.ToInt16(_config.GetSection("ExcelPreview:BackToBackExcelColumn").Value) || (rowCount == 2 && !IsRowFilled(worksheet, 2, columnCount - 1)) || rowCount == 1)
                {
                    throw new CustomException("excelupload_validation_error");
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

                if (AssetsDetails.ContractId == null)
                {
                    var firstContractNumber = worksheet.Cells[2, 1].Value;
                    for (int row = 3; row <= rowCount; row++)
                    {
                        var contractNumber = worksheet.Cells[row, 1].Value;
                        if (!contractNumber.Equals(firstContractNumber))
                        {
                            throw new CustomException("excelupload_contractnbr_mismatch");
                        }
                    }
                    var procedure = "contract_getidbycontractnumber";
                    var parameters = new DynamicParameters();
                    parameters.Add("ContractNumber", firstContractNumber);
                    int? contractId = await connection.QuerySingleOrDefaultAsync<int?>(procedure, parameters, commandType: CommandType.StoredProcedure);
                    if (contractId == null)
                    {
                        throw new CustomException("excelupload_invalid_contractnbr");
                    }
                    AssetsDetails.ContractId = contractId;
                }

                var assetsDetails = new List<Dictionary<string, object>>();

                _contractAssetSerialNumbers = await GetContractAssetsSerialNumbers(connection, AssetsDetails.ContractId ?? 0);
                _contractNumber = await GetContractNumber(connection, AssetsDetails.ContractId ?? 0);
                _backtobackvendorBranches = await GetBackToBackVendors(connection);
                Dictionary<string, ContractAssetColumnNamesMapping> columnNamesMapping = new Dictionary<string, ContractAssetColumnNamesMapping>
                {
                    { "SERVICECONTRACTNO", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "ContractNumber" } },
                    { "SERIALNO", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "AssetSerialNumber" } },
                    { "VENDORBRANCHNAME", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "BranchName" } },
                    { "TOLLFREENO", new ContractAssetColumnNamesMapping { IsMandatory = false, DbName = "TollFreeNumber" } },
                    { "EMAIL", new ContractAssetColumnNamesMapping { IsMandatory = false, DbName = "Email" } },
                    { "VENDORCONTRACTNO", new ContractAssetColumnNamesMapping { IsMandatory = false, DbName = "VendorContractNumber" } }
                };

                for (int row = 2; row <= rowCount; row++)
                {
                    var eachAsset = new Dictionary<string, object>();
                    eachAsset["Id"] = row - 1;
                    for (int col = 1; col <= columnCount; col++)
                    {
                        var columnName = worksheet.Cells[1, col].Value.ToString();

                        ContractAssetColumnNamesMapping columnMetadata = columnNamesMapping[columnName];

                        if (columnMetadata != null)
                        {
                            var columnValue = worksheet.Cells[row, col].Value;

                            eachAsset[columnMetadata.DbName] = columnValue != null ? columnValue.ToString().Trim() : null;

                            if (columnMetadata.IsMandatory)
                            {
                                var (processedColumnName, processedColumnValue) = GetProcessedBacktoBackAssetColumnValue(columnMetadata.DbName, columnValue);
                                eachAsset[processedColumnName] = processedColumnValue;
                            }
                        }
                        else
                        {
                            throw new CustomException("excelupload_validation_error");
                        }
                    }
                    assetsDetails.Add(eachAsset);
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        AssetDetails = assetsDetails,
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
                            new ExceptionHandler(ex, "contract_asset_preview_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<ContractAssetsSerialNumber>> GetContractAssetsSerialNumbers(SqlConnection Connection, int ContractId)
        {
            var procedure = "contract_assets_serial_number_check";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            var contractAssets = await Connection.QueryAsync<ContractAssetsSerialNumber>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractAssets;
        }
        private async Task<IEnumerable<BackToBackVendorsList>> GetBackToBackVendors(SqlConnection Connection)
        {
            var procedure = "vendor_get_backtoback_vendorbranches";
            var backToBackVendors = await Connection.QueryAsync<BackToBackVendorsList>(procedure, commandType: CommandType.StoredProcedure);
            return backToBackVendors;
        }

        private (string? processedColumnName, dynamic? processedColumnValue) GetProcessedBacktoBackAssetColumnValue(string columnName, object columnValue)
        {
            string? processedColumnName = columnName + "Id";
            dynamic? processedColumnValue = null;

            switch (columnName)
            {
                case "ContractNumber":
                    processedColumnValue = Convert.ToBoolean(_contractNumber?.ToString()?.Trim()?.ToLower() == columnValue?.ToString()?.Trim()?.ToLower() ? 1 : 0);
                    processedColumnName = "IsContractNumValid";
                    break;
                case "BranchName":
                    processedColumnValue = _backtobackvendorBranches.FirstOrDefault(branch => branch?.VendorBranch?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower())?.Id ?? null;
                    processedColumnName = "VendorBranchId";
                    break;
                case "AssetSerialNumber":
                    processedColumnValue = _contractAssetSerialNumbers.FirstOrDefault(assets => assets?.ProductSerialNumber?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower())?.Id ?? null;
                    processedColumnName = "AssetId";
                    break;
            }
            return (processedColumnName, processedColumnValue);
        }
        [HttpPost, Authorize()]
        [Route("backtoback/bulk/upload")]
        public async Task<IActionResult> BackToBackAssetsBulkUpload(BackToBackAssetBulkUpload backToBackAssetDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_assets_backtoback_vendor_bulk_upload";
                var parameters = new DynamicParameters();
                parameters.Add("AssetDetails", JsonSerializer.Serialize(backToBackAssetDetails.AssetDetails));
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsAssetUpdated = true
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
                            new ExceptionHandler(ex,"backtoback_asset_bulk_upload_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost("preamcdone/bulk/upload/preview")]
        public async Task<IActionResult> PreAmcDoneAssetsBulkUploadPreview([FromForm] ContractAssetBulkUploadPreview AssetsDetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                using var stream = AssetsDetails.file?.OpenReadStream();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var excelDetails = new ExcelPackage(stream);
                var worksheet = excelDetails.Workbook.Worksheets[0];
                var rowCount = worksheet.Dimension.Rows;
                var columnCount = worksheet.Dimension.Columns;
                if (columnCount != Convert.ToInt16(_config.GetSection("ExcelPreview:PreAmcDoneExcelColumn").Value) || (rowCount == 2 && !IsRowFilled(worksheet, 2, columnCount - 1)) || rowCount == 1)
                {
                    throw new CustomException("Invalid Excel Sheet");
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

                if (AssetsDetails.ContractId == null)
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
                    AssetsDetails.ContractId = contractId;
                }

                var assetsDetails = new List<Dictionary<string, object>>();

                _contractAssetSerialNumbers = await GetContractAssetsSerialNumbers(connection, AssetsDetails.ContractId ?? 0);
                _contractNumber = await GetContractNumber(connection, AssetsDetails.ContractId ?? 0);
                _contractCustomerSites = await GetContractCustomerSites(connection, AssetsDetails.ContractId ?? 0);
                _preamcCompletedEngineers = await GetPreAmcCompletedEngineers(connection);
                _preamcVendorList = await GetVendorBranchList(connection);

                Dictionary<string, ContractAssetColumnNamesMapping> columnNamesMapping = new Dictionary<string, ContractAssetColumnNamesMapping>
                {
                    { "SERVICECONTRACTNO", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "ContractNumber" } },
                    { "SERIALNO", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "AssetSerialNumber" } },
                    { "PREAMCENGINEERNAME", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "PreAmcCompletedBy" } },
                    { "PREAMCVENDORBRANCH", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "PreAmcVendorBranch" } },
                    { "COMPLETEDDATE", new ContractAssetColumnNamesMapping { IsMandatory = true, DbName = "PreAmcCompletedDate" } },
                };

                for (int row = 2; row <= rowCount; row++)
                {
                    var eachAsset = new Dictionary<string, object>();
                    eachAsset["Id"] = row - 1;
                    for (int col = 1; col <= columnCount; col++)
                    {
                        var columnName = worksheet.Cells[1, col].Value.ToString();

                        ContractAssetColumnNamesMapping columnMetadata = columnNamesMapping[columnName];
                        if (columnMetadata != null)
                        {
                            var columnValue = worksheet.Cells[row, col].Value;

                            eachAsset[columnMetadata.DbName] = (columnMetadata.DbName == "PreAmcCompletedDate")
                                ? (columnValue != null && double.TryParse(columnValue.ToString(), out double doubleValue) && doubleValue != 0 ? (DateTime?)DateTime.FromOADate(doubleValue) : null) :
                                columnValue != null ? columnValue.ToString().Trim() : null;
                            if (columnMetadata.IsMandatory)
                            {
                                var (processedColumnName, processedColumnValue) = GetProcessedPreAmcDoneAssetColumnValue(columnMetadata.DbName, columnValue);
                                eachAsset[processedColumnName] = processedColumnValue;
                            }
                        }
                        else
                        {
                            throw new CustomException("excelupload_validation_error");
                        }
                    }
                    assetsDetails.Add(eachAsset);
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        AssetDetails = assetsDetails,
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
                            new ExceptionHandler(ex, "contract_asset_preamcdone_preview_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PreAmcCompletedEngineers>> GetPreAmcCompletedEngineers(SqlConnection Connection)
        {
            var procedure = "serviceengineers_names";
            var preAmcCompletedEngineers = await Connection.QueryAsync<PreAmcCompletedEngineers>(procedure, commandType: CommandType.StoredProcedure);
            return preAmcCompletedEngineers;
        }
        private async Task<IEnumerable<PreAmcVendorList>> GetVendorBranchList(SqlConnection Connection)
        {
            var procedure = "vendorbranches_list";
            var pmScheduleNumber = await Connection.QueryAsync<PreAmcVendorList>(procedure, commandType: CommandType.StoredProcedure);
            return pmScheduleNumber;
        }
        private (string? processedColumnName, dynamic? processedColumnValue) GetProcessedPreAmcDoneAssetColumnValue(string columnName, object columnValue)
        {
            string? processedColumnName = columnName + "Id";
            dynamic? processedColumnValue = null;

            switch (columnName)
            {
                case "ContractNumber":
                    processedColumnValue = Convert.ToBoolean(_contractNumber?.ToString()?.Trim()?.ToLower() == columnValue?.ToString()?.Trim()?.ToLower() ? 1 : 0);
                    processedColumnName = "IsContractNumValid";
                    break;
                case "PreAmcCompletedBy":
                    processedColumnValue = _preamcCompletedEngineers.FirstOrDefault(engineers => engineers?.FullName?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower())?.Id ?? null;
                    break;
                case "PreAmcVendorBranch":
                    processedColumnValue = _preamcVendorList.FirstOrDefault(vendor => vendor?.VendorBranch?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower())?.Id ?? null;
                    break;
                case "AssetSerialNumber":
                    processedColumnValue = _contractAssetSerialNumbers.FirstOrDefault(assets => assets?.ProductSerialNumber?.ToString().Trim().ToLower() == columnValue?.ToString()?.Trim().ToLower())?.Id ?? null;
                    processedColumnName = "AssetId";
                    break;
                case "PreAmcCompletedDate":
                    processedColumnValue = !(columnValue != null &&
                             double.TryParse(columnValue.ToString(), out double doubleValue) &&
                             doubleValue != 0 &&
                             DateTime.FromOADate(doubleValue) <= DateTime.Today);
                    processedColumnName = "IsCompletedDateValid";
                    break;
            }
            return (processedColumnName, processedColumnValue);
        }
        [HttpPost, Authorize()]
        [Route("preamcdone/bulk/upload")]
        public async Task<IActionResult> PreAmcDoneAssetsBulkUpload(PreAmcDoneAssetBulkUpload preAmcDoneAssetBulkUpload)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_assets_preamcdone_bulk_upload";
                var parameters = new DynamicParameters();
                parameters.Add("AssetDetails", JsonSerializer.Serialize(preAmcDoneAssetBulkUpload.AssetDetails));
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsAssetUpdated = true
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
                            new ExceptionHandler(ex,"preamcdone_asset_bulk_upload_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}