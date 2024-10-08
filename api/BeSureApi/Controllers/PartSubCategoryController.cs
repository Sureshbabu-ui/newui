using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Services.ExcelService;
using BeSureApi.Services.LogService;
using Microsoft.AspNetCore.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/partsubcategory")]
    [ApiController]
    public class PartSubCategoryController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public PartSubCategoryController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpGet,Authorize()]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTSUBCATEGORY_VIEW)]
        public async Task<object> GetPartSubCategories(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PartSubCategory> partSubCategoryList = await GetPartSubCategoryList(connection, Page, Search);
                int totalRows = await GetPartSubCategoryCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartSubCategories = partSubCategoryList,
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
                            new ExceptionHandler(ex,"part_subcategory_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTSUBCATEGORY_MANAGE)]
        public async Task<object> CreatePartSubCategory(PartSubCategoryCreate PartSubCategory)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "PartSubCategory");
                parameters.Add("ColumnName", "Name");
                parameters.Add("Value", PartSubCategory.PartSubCategoryName);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    throw new CustomException("partsubcategorycreate_name_exists_message");
                }
                procedure = "partsubcategory_create";
                parameters = new DynamicParameters();
                parameters.Add("PartProductCategoryToPartCategoryMappingId", PartSubCategory.PartProductCategoryToPartCategoryMappingId);
                parameters.Add("PartSubCategoryName", PartSubCategory.PartSubCategoryName);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPartSubCategoryCreated = true
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
                            new ExceptionHandler(ex,"partsubcategory_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PartSubCategory>> GetPartSubCategoryList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "partsubcategory_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var partSubCategoryList = await Connection.QueryAsync<PartSubCategory>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return partSubCategoryList;
        }
        private async Task<int> GetPartSubCategoryCount(SqlConnection Connection, string? Search)
        {
            var procedure = "partsubcategory_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpPost, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTSUBCATEGORY_MANAGE)]
        public async Task<ActionResult> UpdatePartSubCategory(UpdatedPartSubCategory partSubCategory)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partsubcategory_update";
                var parameters = new DynamicParameters();
                parameters.Add("RoleId", partSubCategory.Id);
                parameters.Add("Name", partSubCategory.Name);
                parameters.Add("IsActive", partSubCategory.IsActive);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { IsPartSubCategoryUpdated = true } };
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
                            new ExceptionHandler(ex,"partsubcategory_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("get/names/by/categorymapping")]
        public async Task<ActionResult<List<PartCategoryNames>>> GetPartSubCategoryNamesByMapping(int PartProductCategoryToPartCategoryMappingId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partsubcategory_get_names_by_categorymapping";
                var parameters = new DynamicParameters();
                parameters.Add("PartProductCategoryToPartCategoryMappingId", PartProductCategoryToPartCategoryMappingId);
                var partSubCategoryDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartSubCategoryDetails = partSubCategoryDetails
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
                            new ExceptionHandler(ex,"partsubcategorylist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.PARTSUBCATEGORY_MANAGE)]
        public async Task<object> DeletePartSubCategory(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partsubcategory_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("partsubcategory_delete_restricted_message");
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
                           new ExceptionHandler(ex,"partsubcategory_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}