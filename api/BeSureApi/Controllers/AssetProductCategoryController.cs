using BeSureApi.Exceptions;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Services.LogService;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Models;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Services.ExcelService;

namespace BeSureApi.Controllers
{
    [Route("api/assetproductcategory")]
    [ApiController]
    public class AssetProductCategoryController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IExcelService _excelService;
        public AssetProductCategoryController(IConfiguration config, ILogService logService, IExcelService excelService)
        {
            _config = config;
            _logService = logService;
            _excelService = excelService;
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.ASSETPRODUCTCATEGORY_MANAGE)]
        public async Task<object> CreateAssetProductCategories(AssetProductCategoryCreate ProductCategory)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "AssetProductCategory");
                parameters.Add("ColumnName", "CategoryName");
                parameters.Add("Value", ProductCategory.CategoryName);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    throw new CustomException("product_category_name_exists_message");
                }
                procedure = "assetproductcategory_create";
                parameters  = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("CategoryName", ProductCategory.CategoryName);
                parameters.Add("PartProductCategoryId", ProductCategory.PartProductCategoryId);
                parameters.Add("GeneralNotCovered", ProductCategory.GeneralNotCovered);
                parameters.Add("SoftwareNotCovered", ProductCategory.SoftwareNotCovered);
                parameters.Add("HardwareNotCovered", ProductCategory.HardwareNotCovered);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsProductCategoryCreated = true
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
                            new ExceptionHandler(ex,"product_category_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.ASSETPRODUCTCATEGORY_MANAGE)]
        public async Task<object> EditAssetProductCategories(AssetProductCategoryEdit assetproductcategory)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
               
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "AssetProductCategory");
                parameters.Add("ColumnName", "CategoryName");
                parameters.Add("Value", assetproductcategory.CategoryName);
                parameters.Add("Id", assetproductcategory.Id);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    ModelState.AddModelError("CategoryName", "assetproduct_category_edit_name_exists_message");
                }
                if (!ModelState.IsValid)
                {
                    return BadRequest(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status400BadRequest,
                        errors = UnprocessableEntity(ModelState).Value
                    }
                   ));
                }
                procedure = "assetproductcategory_update";
                parameters = new DynamicParameters();
                parameters.Add("Id", assetproductcategory.Id);
                parameters.Add("CategoryName", assetproductcategory.CategoryName);
                parameters.Add("PartProductCategoryId", assetproductcategory.PartProductCategoryId);
                parameters.Add("GeneralNotCovered", assetproductcategory.GeneralNotCovered);
                parameters.Add("SoftwareNotCovered", assetproductcategory.SoftwareNotCovered);
                parameters.Add("HardwareNotCovered", assetproductcategory.HardwareNotCovered);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
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
                        Message = new[]
                        {
                            new ExceptionHandler(ex,"assetproductcategory_edit_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet,Authorize()]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.ASSETPRODUCTCATEGORY_VIEW)]
        public async Task<object> GetAssetProductCategories(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<AssetProductCategory> productCategoryList = await GetAssetProductCategoryList(connection, Page, Search);
                int totalRows = await GetAssetProductCategoryCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ProductCategories = productCategoryList,
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
                            new ExceptionHandler(ex,"product_category_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<AssetProductCategory>> GetAssetProductCategoryList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "assetproductcategory_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var productcategoryList = await Connection.QueryAsync<AssetProductCategory>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return productcategoryList;
        }
        private async Task<int> GetAssetProductCategoryCount(SqlConnection Connection, string? Search)
        {
            var procedure = "assetproductcategory_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("get/names")]
        public async Task<object> GetproductCategoryName()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "assetproductcategory_get_names";
                var categoryNames = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);
                var response = new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        AssetProductCategoryNames = categoryNames
                    }
                };
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
                            new ExceptionHandler(ex,"product_category_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("get/details")]
        [HasPermission(MasterDataBusinessFunctionCode.ASSETPRODUCTCATEGORY_VIEW)]
        public async Task<ActionResult> GetProductCategoryDetails(int ProductCategoryId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "assetproductcategory_detail";
                var parameters = new DynamicParameters();
                parameters.Add("ProductCategoryId", ProductCategoryId);
                var productCategoryDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ProductCategoryDetails = productCategoryDetails.First()
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
                            new ExceptionHandler(ex,"product_category_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost, Authorize()]
        [Route("update/partsnotcovered")]
        [HasPermission(MasterDataBusinessFunctionCode.PRODUCT_CATEGORY_PARTS_NOT_COVERED_UPDATE)]
        public async Task<object> PartNotCoveredUpdate(PartNotCovered PartNotCovered)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "productcategorypartsnotcovered_update";
                var parameters = new DynamicParameters();
                parameters.Add("ProductCategoryId", PartNotCovered.ProductCategoryId);
                parameters.Add("PartCategoryData", PartNotCovered.PartCategoryData);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsPartNotCoveredUpdated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isPartNotCoveredUpdated = parameters.Get<int>("@IsPartNotCoveredUpdated");
                if (isPartNotCoveredUpdated == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPartNotCoveredUpdated = Convert.ToBoolean(isPartNotCoveredUpdated)
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
                            new ExceptionHandler(ex,"product_category_update_parts_not_covered_failed_message", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("partsnotcovered")]
        public async Task<object> GetProductCategoryPartsNotCovered(string ProductCategoryId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {

                var procedure = "productcategorypartnotcovered_list";
                var parameters = new DynamicParameters();
                parameters.Add("ProductCategoryId", ProductCategoryId);
                var productCategoryPartsNotCovered = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                string notCoveredString = string.Join(",", productCategoryPartsNotCovered.Select(x => x.ProductCategoryPartNotCovered));

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ProductCategoryPartsNotCovered = new[] { new { productCategoryPartsNotCovered = notCoveredString } }
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
                            new ExceptionHandler(ex,"product_category_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }


        [HttpGet, Authorize()]
        [Route("partcategorymapping")]
        public async Task<ActionResult<List<AssetProductCategoryPartCategoryNames>>> GetAssetProductCategoryPartCategoryNames(int AssetProductCategoryId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "assetproductcategorypartcategorymapping_get_names";
                var parameters = new DynamicParameters();
                parameters.Add("AssetProductCategoryId", AssetProductCategoryId);
                var partProductCategoryDetails = await connection.QueryAsync<AssetProductCategoryPartCategoryNames>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartProductCategoryDetails = partProductCategoryDetails
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
                            new ExceptionHandler(ex,"product_category_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.ASSETPRODUCTCATEGORY_MANAGE)]
        public async Task<object> DeleteAssetProductCategory(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "assetproductcategory_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("assetproductcategory_delete_restricted_message");
                }
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
                        Message = new[] {
                           new ExceptionHandler(ex,"assetproductcategory_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}