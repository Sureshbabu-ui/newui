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
    [Route("api/partcategory")]
    [ApiController]
    public class PartCategoryController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IExcelService _excelService;
        public PartCategoryController(IConfiguration config, ILogService logService, IExcelService excelService)
        {
            _config = config;
            _logService = logService;
            _excelService = excelService;
        }
        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTCATEGORY_MANAGE)]
        public async Task<object> CreatePartCategories(PartCategoryCreate PartCategory)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "PartCategory");
                parameters.Add("ColumnName", "Name");
                parameters.Add("Value", PartCategory.Name);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    throw new CustomException("part_category_name_exists_message");
                }
                procedure = "part_category_create";
                parameters  = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("Name", PartCategory.Name);
                parameters.Add("ProductCategoryId", PartCategory.ProductCategoryId);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPartCategoryCreated = true
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
                            new ExceptionHandler(ex,"part_category_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTCATEGORY_VIEW)]
        public async Task<object> GetPartCategories(int Page, string? Search, string? SearchWith)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PartCategory> partCategoryList = await GetPartCategoryList(connection, Page, Search, SearchWith);
                int totalRows = await GetPartCategoryCount(connection, Search, SearchWith);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartCategories = partCategoryList,
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
                            new ExceptionHandler(ex,"part_category_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PartCategory>> GetPartCategoryList(SqlConnection Connection, int Page, string? Search,string? SearchWith)
        {
            var procedure = "part_category_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("SearchWith", SearchWith);
            var PartcategoryList = await Connection.QueryAsync<PartCategory>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return PartcategoryList;
        }
        private async Task<int> GetPartCategoryCount(SqlConnection Connection, string? Search, string? SearchWith)
        {
            var procedure = "part_category_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet, Authorize()]
        [Route("list/download")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTCATEGORY_VIEW)]
        public async Task<ActionResult> DownloadPartCategoryList()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partcategory_list_download";
                var parameters = new DynamicParameters();
                var partcategorydetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var headers = new Dictionary<string, string>()
                {
                    { "Code", "Code" },
                    { "CategoryName", "Category Name" },
                    {"ProductCategory","ProductCategory" }
                };

                var records = new List<object[]>();
                foreach (var part in partcategorydetails)
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
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "partcategory_list.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"partcategory_list_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTCATEGORY_MANAGE)]
        public async Task<object> EditPartCategory(PartCategoryEdit PartCategory)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "PartCategory");
                parameters.Add("ColumnName", "Name");
                parameters.Add("Value", PartCategory.Name);
                parameters.Add("Id", PartCategory.Id);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    ModelState.AddModelError("Name", "part_category_name_exists_message");
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
                procedure = "partcategory_update";
                parameters = new DynamicParameters();
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("Id", PartCategory.Id);
                parameters.Add("Name", PartCategory.Name);
                parameters.Add("MappingId", PartCategory.MappingId);
                parameters.Add("PartProductCategoryId", PartCategory.PartProductCategoryId);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPartCategoryUpdated = true
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
                            new ExceptionHandler(ex,"part_category_edit_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTCATEGORY_MANAGE)]
        public async Task<object> DeletePartCategory(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partcategory_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("partcategory_delete_restricted_message");
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
                           new ExceptionHandler(ex,"partcategory_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}