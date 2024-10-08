using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Models;
using BeSureApi.Services.ExcelService;

namespace BeSureApi.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IExcelService _excelService;

        public ProductController(IConfiguration config, ILogService logService, IExcelService excelService)
        {
            _config = config;
            _logService = logService;
            _excelService = excelService;
        }
        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.PRODUCTMODEL_MANAGE)]
        public async Task<object> CreateProducts(ProductCreate Product)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "Product");
                parameters.Add("ColumnName", "ModelName");
                parameters.Add("Value", Product.ModelName);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    throw new CustomException("product_create_name_exists_message");
                }
                procedure = "product_create";
                parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("ModelName", Product.ModelName) ;
                parameters.Add("Description", Product.Description);
                parameters.Add("CategoryId", Product.CategoryId);
                parameters.Add("MakeId", Product.MakeId);
                parameters.Add("ManufacturingYear", Product.ManufacturingYear);
                parameters.Add("AmcValue", Product.AmcValue);
                parameters.Add("IsProductCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isProductCreated = parameters.Get<int>("IsProductCreated");
                if (isProductCreated == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsProductCreated = Convert.ToBoolean(isProductCreated)
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
                            new ExceptionHandler(ex,"product_create_failed_mesasge", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut,Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.PRODUCTMODEL_MANAGE)]
        public async Task<object> UpdateProduct(ProductUpdate Product)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "product_update_unique_check";
                var parameters = new DynamicParameters();
                parameters.Add("ProductId", Product.ProductId);
                parameters.Add("ModelName", Product.ModelName);
                parameters.Add("IsModelNameExist", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isNameExist = parameters.Get<int>("@IsModelNameExist");
                if (isNameExist == 1)
                {
                    throw new CustomException("This Model Name already exists.");
                }
                procedure = "product_update";
                parameters = new DynamicParameters();
                parameters.Add("ProductId", Product.ProductId);
                parameters.Add("ModelName", Product.ModelName);
                parameters.Add("Description", Product.Description);
                parameters.Add("AssetProductCategoryId", Product.AssetProductCategoryId);
                parameters.Add("MakeId", Product.MakeId);
                parameters.Add("ManufacturingYear", Product.ManufacturingYear);
                parameters.Add("AmcValue", Product.AmcValue);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                connection.Query<ProductUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);

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
                            new ExceptionHandler(ex,"product_update_failed_mesasge", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet,Authorize()]
        [Route("details")]
        [HasPermission(MasterDataBusinessFunctionCode.PRODUCTMODEL_VIEW)]
        public async Task<ActionResult> GetProductDetails(int ProductId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "product_details";
                var parameters = new DynamicParameters();
                parameters.Add("@ProductId", ProductId);
                var productDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ProductData = productDetails.First()
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
                            new ExceptionHandler(ex,"product_details_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.PRODUCTMODEL_MANAGE)]
        public async Task<ActionResult<List<Deleteproduct>>> DeleteProduct(Deleteproduct Delete)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "product_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Delete.Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("product_delete_restricted_message");
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
                            new ExceptionHandler(ex,"product_deleted_failure_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.PRODUCTMODEL_VIEW)]
        public async Task<object> Getproducts(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<Product> productList = await GetproductList(connection, Page, Search);
                int totalRows = await GetproductCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Products = productList,
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
                            new ExceptionHandler(ex,"product_details_not_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<Product>> GetproductList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "product_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var productList = await Connection.QueryAsync<Product>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return productList;
        }
        private async Task<int> GetproductCount(SqlConnection Connection, string? Search)
        {
            var procedure = "product_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpGet,Authorize()]
        [Route("modelnames")]
        public async Task<object> GetProductModelNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "product_get_model_names";
                var modelNames = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { ModelNames = modelNames } };
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
                            new ExceptionHandler(ex,"product_details_not_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet,Authorize()]
        [Route("filtered/modelnames")]
        public async Task<ActionResult> GetAllFilteredModelNames(int CategoryId, int MakeId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "product_get_filtered_model_names";
                var parameters = new DynamicParameters();
                parameters.Add("CategoryId", CategoryId);
                parameters.Add("MakeId", MakeId);
                var modelNames = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ModelNames = modelNames
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
                            new ExceptionHandler(ex,"product_details_not_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("list/download")]
        [HasPermission(MasterDataBusinessFunctionCode.PRODUCTMODEL_VIEW)]
        public async Task<ActionResult> DownloadProductList()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "product_list_download";
                var parameters = new DynamicParameters();
                var productdetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var headers = new Dictionary<string, string>()
                {
                    { "Code", "Code" },
                    { "ModelName", "Model Name" },
                    {"Description","Description" },
                    { "Category", "Category" },
                    { "Make", "Make" },
                    {"ManufacturingYear","Manufacturing Year" },
                    {"AmcValue","AmcValue" }
                };

                var records = new List<object[]>();
                foreach (var part in productdetails)
                {
                    var dictionaryPart = (IDictionary<string, object>)part;
                    var record = new object[headers.Count()];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryPart[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "product_list.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"product_list_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}