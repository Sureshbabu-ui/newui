using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Services.LogService;
using BeSureApi.Exceptions;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using static BeSureApi.Models.StockBin;

namespace BeSureApi.Controllers
{
        [Route("api/stockroom")]
        [ApiController]
        public class StockRoomController : Controller
        {
            private readonly IConfiguration _config;
            private readonly ILogService _logService;

            public StockRoomController(IConfiguration config, ILogService logService)
            {
                _config = config;
                _logService = logService;
            }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.STOCKROOM_MANAGE)]
        public async Task<object> CreateStockRoom(StockRoomCreate StockRoom)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "stockroom_create";
                var parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("RoomName", StockRoom.RoomName);
                parameters.Add("RoomCode", StockRoom.RoomCode);
                parameters.Add("Description", StockRoom.Description);
                parameters.Add("IsActive", StockRoom.IsActive);
                await connection.QueryAsync<StockRoomCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsStockRoomCreated = true
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
                            new ExceptionHandler(ex,"stockroom_api_stockroomcreate_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        
        [HttpGet, Authorize()]
        [Route("get/list")]
        [HasPermission(MasterDataBusinessFunctionCode.STOCKROOM_VIEW)]
        public async Task<object> GetStockRooms(string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<StockRoomList> stockRoomList = await GetStockRoomList(connection, Search);
                int totalRows = await GetStockRoomCount(connection, Search);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        StockRooms = stockRoomList,
                        TotalRows = totalRows,
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
                            new ExceptionHandler(ex,"stockroom_api_no_records_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<StockRoomList>> GetStockRoomList(SqlConnection Connection,string? Search)
        {
            var procedure = "stockroom_list";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            var stockRooms = await Connection.QueryAsync<StockRoomList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return stockRooms;
        }

        private async Task<int> GetStockRoomCount(SqlConnection Connection, string? Search)
        {
            var procedure = "stockroom_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet, Authorize()]
        [Route("names")]
        public async Task<object> GetStockRoomNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "stockroom_names";
                var stockrooms = await Connection.QueryAsync(procedure,commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { StockRooms = stockrooms } };
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
                            new ExceptionHandler(ex,"stockroom_list_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.STOCKROOM_MANAGE)]
        public async Task<object> EditStockBin(StockRoomEdit room)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "stockroom_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", room.Id);
                parameters.Add("Description", room.Description);
                parameters.Add("RoomName", room.RoomName);
                parameters.Add("IsActive", room.IsActive);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<StockRoomEdit>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsStockRoomUpdated = true
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
                            new ExceptionHandler(ex,"stockroom_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.STOCKROOM_MANAGE)]
        public async Task<object> DeleteStockRoom(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "stockroom_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("stockroom_delete_restricted_message");
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
                           new ExceptionHandler(ex,"stockroom_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
