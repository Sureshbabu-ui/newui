using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Services.ExcelService;
using BeSureApi.Models;

namespace BeSureApi.Controllers
{
    [Route("api/part")]
    [ApiController]
    public class PartController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IExcelService _excelService;
        public PartController(IConfiguration config, ILogService logService, IExcelService excelService)
        {
            _config = config;
            _logService = logService;
            _excelService = excelService;
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.PART_MANAGE)]
        public async Task<object> CreatePart(PartCreate Part)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "Part");
                parameters.Add("ColumnName", "PartName");
                parameters.Add("Value", Part.PartName);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    throw new CustomException("part_create_name_exists_message");
                }
                procedure = "part_create";
                parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("ProductCategoryId", Part.ProductCategoryId);
                parameters.Add("PartCategoryId", Part.PartCategoryId);
                parameters.Add("PartSubCategoryId", Part.PartSubCategoryId);
                parameters.Add("MakeId", Part.MakeId);
                parameters.Add("PartName", Part.PartName);
                parameters.Add("HsnCode", Part.HsnCode);
                parameters.Add("OemPartNumber", Part.OemPartNumber);
                parameters.Add("IsPartCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isPartCreated = parameters.Get<int>("@IsPartCreated");
                if (isPartCreated == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPartCreated = Convert.ToBoolean(isPartCreated)
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
                            new ExceptionHandler(ex,"part_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("edit")]
        [HasPermission(MasterDataBusinessFunctionCode.PART_MANAGE)]
        public async Task<object> EditPart(PartEdit Part)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "part_update_unique_check";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Part.Id);
                parameters.Add("PartName", Part.PartName);
                parameters.Add("IsPartNameExist", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isNameExist = parameters.Get<int>("@IsPartNameExist");
                if (isNameExist == 1)
                {
                    throw new CustomException("validation_error_part_name_exist");
                }
                procedure = "part_update";
                parameters = new DynamicParameters();
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("PartName", Part.PartName);
                parameters.Add("HsnCode", Part.HsnCode);
                parameters.Add("Id", Part.Id);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPartUpdated = true
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
                            new ExceptionHandler(ex,"part_edit_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.PART_VIEW)]
        public async Task<object> GetParts(int Page, string? Search, string? SearchWith)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<Part> partList = await GetPartList(connection, Page, Search, SearchWith);
                int totalRows = await GetPartCount(connection, Search, SearchWith);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Parts = partList,
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
                            new ExceptionHandler(ex,"part_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<Part>> GetPartList(SqlConnection Connection, int Page, string? Search, string? SearchWith)
        {
            var procedure = "part_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("SearchWith", SearchWith);
            var PartList = await Connection.QueryAsync<Part>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return PartList;
        }
        private async Task<int> GetPartCount(SqlConnection Connection, string? Search, string? SearchWith)
        {
            var procedure = "part_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("get/names")]
        public async Task<ActionResult> GetPartsName(int PartCategoryId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "part_get_names";
                var parameters = new DynamicParameters();
                parameters.Add("PartCategoryId", PartCategoryId);
                var partsNames = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartsNames = partsNames
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
                            new ExceptionHandler(ex,"part_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("list/by/servicerequest"), HasPermission(PartIndentBusinessFunctionCode.PARTINDENT_CREATE)]
        public async Task<ActionResult<PartListForCall>> GetServiceRequestParts(int ContractId, int? AssetProductCategoryId, int Page, string? Search, string? SearchWith,int? partCategoryId,int? partSubCategoryId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PartListForCall> partList = await GetServiceRequestPartList(connection, ContractId, AssetProductCategoryId, Page, Search, SearchWith, partCategoryId, partSubCategoryId);
                int totalRows = await GetServiceRequestPartCount(connection, ContractId, AssetProductCategoryId, Page, Search, SearchWith, partCategoryId, partSubCategoryId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Parts = partList,
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
                            new ExceptionHandler(ex,"part_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PartListForCall>> GetServiceRequestPartList(SqlConnection Connection,int ContractId, int? AssetProductCategoryId, int Page, string? Search, string? SearchWith,int? partCategoryId,int? partSubCategoryId)
        {
            var procedure = "part_list_by_servicerequest";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("AssetProductCategoryId", AssetProductCategoryId);
            parameters.Add("ContractId", ContractId);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("partCategoryId", partCategoryId);
            parameters.Add("partSubCategoryId", partSubCategoryId);
            var PartList = await Connection.QueryAsync<PartListForCall>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return PartList;
        }
        private async Task<int> GetServiceRequestPartCount(SqlConnection Connection, int ContractId, int? AssetProductCategoryId, int Page, string? Search, string? SearchWith, int? partCategoryId, int? partSubCategoryId)
        {
            var procedure = "part_count_by_servicerequest";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("AssetProductCategoryId", AssetProductCategoryId);
            parameters.Add("ContractId", ContractId);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("partCategoryId", partCategoryId);
            parameters.Add("partSubCategoryId", partSubCategoryId);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("details")]
        public async Task<ActionResult> GetSelectedPartDetails(int PartId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "part_detail";
                var parameters = new DynamicParameters();
                parameters.Add("PartId", PartId);
                var partdetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Partdetails = partdetails.First()
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
                            new ExceptionHandler(ex,"part_detail_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet, Authorize()]
        [Route("list/download")]
        [HasPermission(MasterDataBusinessFunctionCode.PART_VIEW)]
        public async Task<ActionResult> DownloadPartList()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "part_list_download";
                var parameters = new DynamicParameters();
                var partdetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var headers = new Dictionary<string, string>()
                {
                    { "PartCode", "Part Code" },
                    { "PartName", "Part Name" },
                    { "ProductCategoryName", "Product Category Name" },
                    {"PartCategoryName","Part Category Name" },
                    {"Description","Description" },
                    {"MakeName","Make Name" },
                    {"HsnCode","Hsn Code" },
                    {"OemPartNumber" ,"Oem Part Number"}
                };

                var records = new List<object[]>();
                foreach (var part in partdetails)
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
                            new ExceptionHandler(ex,"part_list_download_api_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("get/detailsbycode")]
        public async Task<ActionResult> GetPartDeatilsByCode(string PartCode)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "part_detail_by_partcode";
                var parameters = new DynamicParameters();
                parameters.Add("PartCode", PartCode);
                var partDetails = await connection.QueryAsync<PartDetailByCode>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartDetails = partDetails.FirstOrDefault()
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
                            new ExceptionHandler(ex,"part_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("get/names/by/servicerequest")]
        public async Task<object> GetServiceRequestPartNames(int ServiceRequestId, int Page, string? Search, string? SearchWith)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "part_get_names_by_servicerequest";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", ServiceRequestId);
                var partList = await  connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
             
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        MasterData = partList
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
                            new ExceptionHandler(ex,"part_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize()]
        [Route("list/by/partproductcategory")]
        [HasPermission(PurchaseOrderBusinessFunctionCode.IMPRESTPURCHASEORDER_MANAGE)]
        public async Task<object> GetPartsByPartProductCategory(int? ProductCategoryId, int? PartCategoryId, int? PartSubCategoryId,  int? MakeId, int Page, string? Search, string? SearchWith)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PartListForPO> partList = await GetPartProductCategoryPartList(connection, ProductCategoryId,PartCategoryId, PartSubCategoryId,MakeId ,Page, Search, SearchWith);
                int totalRows = await GetPartProductCategoryPartCount(connection, ProductCategoryId,PartCategoryId, PartSubCategoryId,MakeId, Search, SearchWith);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Parts = partList,
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
                            new ExceptionHandler(ex,"part_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PartListForPO>> GetPartProductCategoryPartList(SqlConnection Connection, int? ProductCategoryId, int? PartCategoryId, int? PartSubCategoryId ,  int? MakeId, int Page, string? Search, string? SearchWith)
        {
            var procedure = "part_list_by_partproductcategory";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("ProductCategoryId", ProductCategoryId);
            parameters.Add("PartSubCategoryId", PartSubCategoryId);
            parameters.Add("PartCategoryId", PartCategoryId);
            parameters.Add("MakeId", MakeId);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("SearchWith", SearchWith);
            var PartList = await Connection.QueryAsync<PartListForPO>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return PartList;
        }
        private async Task<int> GetPartProductCategoryPartCount(SqlConnection Connection, int? ProductCategoryId, int? PartCategoryId, int? PartSubCategoryId, int? MakeId, string? Search, string? SearchWith)
        {
            var procedure = "part_count_by_partproductcategory";
            var parameters = new DynamicParameters();
            parameters.Add("ProductCategoryId", ProductCategoryId);
            parameters.Add("PartSubCategoryId", PartSubCategoryId);
            parameters.Add("PartCategoryId", PartCategoryId);
            parameters.Add("MakeId", MakeId); parameters.Add("Search", Search);
            parameters.Add("SearchWith", SearchWith);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("details/for/edit")]
        public async Task<ActionResult> GetSelectedPartDetailsForEdit(int PartId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "part_details_for_edit";
                var parameters = new DynamicParameters();
                parameters.Add("PartId", PartId);
                var partdetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Partdetails = partdetails.First()
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
                            new ExceptionHandler(ex,"part_detail_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.PART_MANAGE)]
        public async Task<object> DeletePart(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "part_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("part_delete_restricted_message");
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
                           new ExceptionHandler(ex,"part_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}