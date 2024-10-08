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
    [Route("api/documentnumberseries")]
    [ApiController]
    public class DocumentNumberSeriesController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public DocumentNumberSeriesController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(SettingsBusinessFunctionCode.DOCUMENTNUMBERSERIES_VIEW)]
        public async Task<object> GetDocumentNumberSeries(int Page, int? DocumentTypeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<DocumentNumSeriesList> DocumentNumSeries = await GetDocumentNumberSeriesList(connection, Page, DocumentTypeId);
                int totalRows = await GetDocumentNumberSeriesCount(connection, DocumentTypeId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        DNSList = DocumentNumSeries,
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
                            new ExceptionHandler(ex,"documentnumberseries_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<DocumentNumSeriesList>> GetDocumentNumberSeriesList(SqlConnection Connection, int Page, int? DocumentTypeId)
        {
            var procedure = "documentnumberseries_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("DocumentTypeId", DocumentTypeId);
            var DocumentNumSeries = await Connection.QueryAsync<DocumentNumSeriesList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return DocumentNumSeries;
        }
        private async Task<int> GetDocumentNumberSeriesCount(SqlConnection Connection, int? DocumentTypeId)
        {
            var procedure = "documentnumberseries_count";
            var parameters = new DynamicParameters();
            parameters.Add("DocumentTypeId", DocumentTypeId);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
    }
}
