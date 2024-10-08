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
    [Route("api/partproductcategory")]
    [ApiController]
    public class PartProductCategoryController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IExcelService _excelService;
        public PartProductCategoryController(IConfiguration config, ILogService logService, IExcelService excelService)
        {
            _config = config;
            _logService = logService;
            _excelService = excelService;
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTPRODUCTCATEGORY_MANAGE)]
        public async Task<object> CreatePartProductCategories(PartProductCategoryCreate ProductCategory)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "PartProductCategory");
                parameters.Add("ColumnName", "CategoryName");
                parameters.Add("Value", ProductCategory.CategoryName);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    throw new CustomException("product_category_name_exists_message");
                }
                procedure = "partproduct_category_create";
                parameters  = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("CategoryName", ProductCategory.CategoryName);
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
        [HttpGet,Authorize()]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTPRODUCTCATEGORY_VIEW)]
        public async Task<object> GetPartProductCategories(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PartProductCategory> productCategoryList = await GetPartProductCategoryList(connection, Page, Search);
                int totalRows = await GetPartProductCategoryCount(connection, Search);
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
        private async Task<IEnumerable<PartProductCategory>> GetPartProductCategoryList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "partproductcategory_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var productcategoryList = await Connection.QueryAsync<PartProductCategory>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return productcategoryList;
        }
        private async Task<int> GetPartProductCategoryCount(SqlConnection Connection, string? Search)
        {
            var procedure = "partproductcategory_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpGet,Authorize()]
        [Route("categoryname")]
        public async Task<object> GetproductCategoryName()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partproductcategory_get_names";
                var categoryNames = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);
                var response = new { 
                    status = StatusCodes.Status200OK, 
                    data = new {
                        ProductCategoryNames = categoryNames
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

        [HttpGet,Authorize()]
        [Route("partproductcategorymapping")]
        public async Task<ActionResult<List<PartCategoryNames>>> GetPartProductCategoryName(int ProductCategoryId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partproductcategorypartcategorymapping_get_names";
                var parameters = new DynamicParameters();
                parameters.Add("ProductCategoryId", ProductCategoryId);
                var partProductCategoryDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
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

        [HttpPost, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTPRODUCTCATEGORY_MANAGE)]
        public async Task<ActionResult> DeletePartProductCategory(DeleteproductCategory Delete)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partproductcategory_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Delete.Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("partproductcategory_delete_restricted_message");
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
                            new ExceptionHandler(ex,"product_category_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet, Authorize()]
        [Route("list/download")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTPRODUCTCATEGORY_VIEW)]
        public async Task<ActionResult> DownloadProductCategoryList()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partproductcategory_list_download";
                var parameters = new DynamicParameters();
                var productcategorydetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var headers = new Dictionary<string, string>()
                {
                    { "Code", "Code" },
                    { "CategoryName", "Category Name" }
                };

                var records = new List<object[]>();
                foreach (var part in productcategorydetails)
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
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "part_list.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"productcategory_list_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTPRODUCTCATEGORY_MANAGE)]
        public async Task<object> EditPartProductCategories(PartProductCategoryEdit ProductCategory)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "PartProductCategory");
                parameters.Add("ColumnName", "CategoryName");
                parameters.Add("Value", ProductCategory.CategoryName);
                parameters.Add("Id", ProductCategory.Id);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    ModelState.AddModelError("CategoryName", "partproduct_category_name_exists_message");
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
                procedure = "partproductcategory_update";
                parameters = new DynamicParameters();
                parameters.Add("Id", ProductCategory.Id);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("CategoryName", ProductCategory.CategoryName);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsProductCategoryUpdated = true
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
    }
}