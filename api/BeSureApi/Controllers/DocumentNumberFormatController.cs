using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Services.ExcelService;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/documentnumberformat")]
    [ApiController]
    public class DocumentNumberFormatController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public DocumentNumberFormatController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(SettingsBusinessFunctionCode.DOCUMENTNUMBERFORMAT_VIEW)]

        public async Task<object> GetDocumentNumberFormat(int Page, int? DocumentTypeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<DocumentNumFormatList> DocumentNumFormat = await GetDocumentNumberFormatList(connection, Page, DocumentTypeId);
                int totalRows = await GetDocumentNumberFormatCount(connection, DocumentTypeId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        DocumentNumFormatList = DocumentNumFormat,
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
                            new ExceptionHandler(ex,"documentnumberFormat_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<DocumentNumFormatList>> GetDocumentNumberFormatList(SqlConnection Connection, int Page, int? DocumentTypeId)
        {
            var procedure = "documentnumberformat_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("DocumentTypeId", DocumentTypeId);
            var DocumentNumFormat = await Connection.QueryAsync<DocumentNumFormatList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return DocumentNumFormat;
        }
        private async Task<int> GetDocumentNumberFormatCount(SqlConnection Connection, int? DocumentTypeId)
        {
            var procedure = "documentnumberformat_count";
            var parameters = new DynamicParameters();
            parameters.Add("DocumentTypeId", DocumentTypeId);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize]
        [Route("create")]
        [HasPermission(SettingsBusinessFunctionCode.DOCUMENTNUMBERFORMAT_MANAGE)]
        public async Task<ActionResult<DocumentNumFormat>> CreateDocumentNumberFormat(DocumentNumFormat numberformat)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "documentnumberformat_create";
                var parameters = new DynamicParameters();
                parameters.Add("DocumentTypeId", numberformat.DocumentTypeId);
                parameters.Add("NumberPadding", numberformat.NumberPadding);
                parameters.Add("Format", numberformat.Format);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCreated = true
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
                            new ExceptionHandler(ex,"documentnumberformat_create_failed",_logService).GetMessage()
                        }
                    }
                }));
            }
        }


        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(SettingsBusinessFunctionCode.DOCUMENTNUMBERFORMAT_MANAGE)]
        public async Task<ActionResult<DocumentNumFormatEdit>> EditDocumentNumberFormat(DocumentNumFormatEdit numberformat)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "documentnumberformat_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", numberformat.Id);
                parameters.Add("DocumentTypeId", numberformat.DocumentTypeId);
                parameters.Add("NumberPadding", numberformat.NumberPadding);
                parameters.Add("Format", numberformat.Format);
                parameters.Add("ModifiedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<DocumentNumFormatEdit>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsNumberFormatUpdated = true
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
                            new ExceptionHandler(ex,"documentnumberformat_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
