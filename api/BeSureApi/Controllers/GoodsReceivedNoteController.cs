using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Models;
using Microsoft.VisualBasic;
using BeSureApi.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using static BeSureApi.Models.GoodsReceivedNoteList;
using Microsoft.AspNetCore.Mvc.RazorPages;
using BeSureApi.Helpers;

namespace BeSureApi.Controllers
{
    [Route("api/goodsreceivednote")]
    [ApiController]
    public class GoodsReceivedNoteController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public GoodsReceivedNoteController(IConfiguration config, ILogService logService, IWebHostEnvironment hostingEnvironment)
        {
            _config = config;
            _logService = logService;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet,Authorize()]
        [Route("list")]
        [HasPermission(GoodsReceivedNoteBusinessFunctionCode.GOODSRECEIVEDNOTE_VIEW)]
        public async Task<ActionResult<List<GoodsReceivedNoteList>>> GetAllGRNList(int Page, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<GoodsReceivedNoteList> goodsReceivedNoteList = await GetGoodsReceivedNoteList(Connection, Page, Search);
                int totalRows = await GetGoodsReceivedNoteCount(Connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        GoodsReceivedNoteList = goodsReceivedNoteList,
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
                        message = new[] {
                            new ExceptionHandler(ex,"grn_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<GoodsReceivedNoteList>> GetGoodsReceivedNoteList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "goodsreceivednote_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);

            var goodsReceivedNoteList = await Connection.QueryAsync<GoodsReceivedNoteList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return goodsReceivedNoteList;
        }
        private async Task<int> GetGoodsReceivedNoteCount(SqlConnection Connection, string? Search)
        {
            var procedure = "goodsreceivednote_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("transactiontypes")]
        public async Task<object> GetGrnTransactionTypes()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "grntransactiontype_transactiontypes";
                var transactiontypes = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { Transactiontypes = transactiontypes } };
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
                            new ExceptionHandler(ex,"transaction_types_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize]
        [Route("create")]
        [ HasPermission(GoodsReceivedNoteBusinessFunctionCode.GOODSRECEIVEDNOTE_CREATE)]
        public async Task<ActionResult<GoodsReceivedNoteCreate>> CreateGoodsReceivedNote(GoodsReceivedNoteCreate creategrn)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "goodsreceivednote_create";
                var parameters = new DynamicParameters();
                parameters.Add("TransactionId", creategrn.TransactionId);
                parameters.Add("TransactionTypeCode", creategrn.TransactionTypeCode);
                parameters.Add("SourceLocationId", creategrn.SourceLocationId);
                parameters.Add("SourceEngineerId", creategrn.SourceEngineerId);
                parameters.Add("SourceVendorId", creategrn.SourceVendorId);
                parameters.Add("ReferenceNumber", creategrn.ReferenceNumber);
                parameters.Add("ReferenceDate", creategrn.ReferenceDate);
                parameters.Add("Remarks", creategrn.Remarks);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("GoodsReceivedNoteId", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await Connection.QueryAsync<GoodsReceivedNoteCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int GoodsReceivedNoteId = parameters.Get<int>("GoodsReceivedNoteId");
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsGrnCreated = true,
                        GoodsReceivedNoteId = GoodsReceivedNoteId,
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
                            new ExceptionHandler(ex,"goodsreceivednot_create_failed_message",_logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize]
        [Route("detail/create")]
        [HasPermission(GoodsReceivedNoteBusinessFunctionCode.GOODSRECEIVEDNOTE_CREATE)]
        public async Task<ActionResult<GoodsReceivedNoteDetailCreate>> CreateGoodsReceivedNoteDetail(List<GoodsReceivedNoteDetailCreate> grndetail,int GrnId, bool IsGrnCompleted, string GrnTransactionTypeCode)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                if(GrnTransactionTypeCode == "GTT_PORD")
                {
                var procedure = "goodsreceivednotedetail_create_for_purchase_order";
                var parameters = new DynamicParameters();
                parameters.Add("PartStockList", JsonSerializer.Serialize(grndetail));
                parameters.Add("IsGrnCompleted", IsGrnCompleted);
                parameters.Add("GrnTransactionTypeCode", GrnTransactionTypeCode);
                parameters.Add("GrnId", GrnId);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await Connection.QueryAsync<List<GoodsReceivedNoteDetailCreate>>(procedure, parameters, commandType: CommandType.StoredProcedure);
                }
                else if (GrnTransactionTypeCode == "GTT_DCHN")
                {
                    var procedure = "goodsreceivednotedetail_create_for_delivery_challan";
                    var parameters = new DynamicParameters();
                    parameters.Add("PartStockList", JsonSerializer.Serialize(grndetail));
                    parameters.Add("IsGrnCompleted", IsGrnCompleted);
                    parameters.Add("GrnTransactionTypeCode", GrnTransactionTypeCode);
                    parameters.Add("GrnId", GrnId);
                    parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                    await Connection.QueryAsync<List<GoodsReceivedNoteDetailCreate>>(procedure, parameters, commandType: CommandType.StoredProcedure);
                }
                else if(GrnTransactionTypeCode == "GTT_EPRT")
                {
                    var procedure = "goodsreceivednotedetail_create_for_se_partreturn";
                    var parameters = new DynamicParameters();
                    parameters.Add("PartStockList", JsonSerializer.Serialize(grndetail));
                    parameters.Add("IsGrnCompleted", IsGrnCompleted);
                    parameters.Add("GrnTransactionTypeCode", GrnTransactionTypeCode);
                    parameters.Add("GrnId", GrnId);
                    parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                    await Connection.QueryAsync<List<GoodsReceivedNoteDetailCreate>>(procedure, parameters, commandType: CommandType.StoredProcedure);
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsGRNDetailCreated = true
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
                            new ExceptionHandler(ex,"goodsreceivednotedetail_create_failed_message",_logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("detail/list")]
        [HasPermission(GoodsReceivedNoteBusinessFunctionCode.GOODSRECEIVEDNOTE_VIEW)]
        public async Task<ActionResult<List<GoodsReceivedNoteDetailList>>> GetAllGRNDList(int Page, string? Search,int GrnId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<GoodsReceivedNoteDetailList> goodsReceivedNoteDetailList = await GetGoodsReceivedNoteDetailList(Connection, Page, Search,GrnId);
                int totalRows = await GetGoodsReceivedNoteDetailCount(Connection, Search,GrnId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        GoodsReceivedNoteDetailList = goodsReceivedNoteDetailList,
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
                        message = new[] {
                            new ExceptionHandler(ex,"grn_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<GoodsReceivedNoteDetailList>> GetGoodsReceivedNoteDetailList(SqlConnection Connection, int Page, string? Search, int GrnId)
        {
            var procedure = "goodsreceivednotedetail_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("GrnId", GrnId);
            var goodsReceivedNoteDetailList = await Connection.QueryAsync<GoodsReceivedNoteDetailList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return goodsReceivedNoteDetailList;
        }
        private async Task<int> GetGoodsReceivedNoteDetailCount(SqlConnection Connection, string? Search,int GrnId)
        {
            var procedure = "goodsreceivednotedetail_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("GrnId", GrnId);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet,Authorize()]
        [Route("detail")]
        public async Task<ActionResult<GoodsReceivedNoteDetail>> GetGRNDetailsForDC(int GoodsReceivedNoteId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "goodsreceivednote_details";
                var parameters = new DynamicParameters();
                parameters.Add("Id", GoodsReceivedNoteId);
                parameters.Add("TransactionTypeCode", dbType: DbType.String, direction: ParameterDirection.Output, size: 8); // Adjust size as per your database schema
                var goodsReceivedNote = await Connection.QueryAsync<GoodsReceivedNoteDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
                string TransactionTypeCode = parameters.Get<string>("TransactionTypeCode");
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        GoodsReceivedNote = goodsReceivedNote,
                        GrnTransactionTypeCode = TransactionTypeCode
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
                            new ExceptionHandler(ex,"grn_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
