using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Services.LogService;
using BeSureApi.Exceptions;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Threading.Tasks;

namespace BeSureApi.Controllers
{
    [Route("api/masterdata")]
    [ApiController]
    public class MasterDataController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public MasterDataController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("get/tablenames")]
        [HasPermission(MasterDataBusinessFunctionCode.LOOKUPDATA_VIEW)]
        public async Task<ActionResult> GetTableNames(int Page, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<TableName> tableNames = await GetTableNamesList(Connection, Page, Search);
                int totalRows = await GetTableNamesCount(Connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                var response = new { status = StatusCodes.Status200OK, 
                    data = new { 
                    EntitiesLists = tableNames,
                    CurrentPage = Page,
                    TotalRows = totalRows,
                    PerPage = perPage
                } };
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
                            new ExceptionHandler(ex,"masterdata_api_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<TableName>> GetTableNamesList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "masterentity_get_table_names";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var tableNames = await Connection.QueryAsync<TableName>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return tableNames;
        }
        private async Task<int> GetTableNamesCount(SqlConnection Connection, string? Search)
        {
            var procedure = "masterentity_get_table_names_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
        [HttpGet]
        [Route("get/selectedtable")]
        [HasPermission(MasterDataBusinessFunctionCode.LOOKUPDATA_VIEW)]
        public async Task<ActionResult<List<SelectedTable>>> GetSelectedTable(int EntityId,string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "masterentitydata_get_table_details";
                var parameters = new DynamicParameters();
                parameters.Add("EntityId", EntityId);
                parameters.Add("Search", Search);
                var selectedTableDetails = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { selectedTableDetails = selectedTableDetails } };
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
                            new ExceptionHandler(ex,"masterdata_api_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.LOOKUPDATA_MANAGE)]
        public async Task<ActionResult<CreateMasterEntityData>> CreateMasterData(CreateMasterEntityData createmasterdetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "masterentitydata_create";
                var parameters = new DynamicParameters();
                parameters.Add("EntityId", createmasterdetails.EntityId);
                parameters.Add("Code", createmasterdetails.Code);
                parameters.Add("Name", createmasterdetails.Name);
                parameters.Add("IsActive", createmasterdetails.IsActive);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                connection.Query(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { IsCreated = true } };
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
                            new ExceptionHandler(ex,"masterdata_api_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.LOOKUPDATA_MANAGE)]
        public async Task<ActionResult<UpdateMasterEntityData>> UpdateMasterData(UpdateMasterEntityData updatedetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "masterentitydata_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", updatedetails.Id);
                parameters.Add("Name", updatedetails.Name);
                parameters.Add("IsActive", updatedetails.IsActive);
                parameters.Add("ModifiedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                connection.Query(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { IsUpdated = true } };
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
                            new ExceptionHandler(ex,"masterdata_api_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list")]
        public async Task<ActionResult> GetAllLookupData()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "lookupdata_list";
                var parameters = new DynamicParameters(); ;
                var bsMasterData = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                // Group the data by EntityType
                var groupedData = bsMasterData
                    .GroupBy(item => item.EntityType)
                    .ToDictionary(
                        group => group.Key,
                        group => group.Select(item => new
                        {
                            Id = item.Id,
                            Code = item.Code,
                            Name = item.Name
                        }).ToList()
                    );

                // Return the JSON response
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = groupedData
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
                            new ExceptionHandler(ex,"No masterdata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.LOOKUPDATA_MANAGE)]
        public async Task<object> DeleteMasterEntityData(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "masterentitydata_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("masterentitydata_delete_restricted_message");
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
                           new ExceptionHandler(ex,"masterentitydata_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
[Route("get/basetablenames")]
public async Task<ActionResult> GetBaseTableNames()
{
    using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
    try
    {
        var procedure = "get_all_basetable_names";
        var baseTableNames = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

        return Ok(JsonSerializer.Serialize(new
        {
            status = StatusCodes.Status200OK,
            data = new
            {
                TableNames = baseTableNames,
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
                    new ExceptionHandler(ex,"basetable_list_no_data", _logService).GetMessage()
                }
            }
        }));
    }
}
    }
}
