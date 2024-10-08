using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using BeSureApi.Services.ExcelService;

namespace BeSureApi.Controllers
{
    [Route("api/auditlog")]
    [ApiController]
    public class AuditLogController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IExcelService _excelService;
        private readonly ILogService _logService;
        public AuditLogController(IConfiguration config, ILogService logService, IExcelService excelService)
        {
            _config = config;
            _excelService = excelService;
            _logService = logService;
        }

        [HttpGet]
        [Route("download/list")]
        public async Task<ActionResult> GetAuditLog(string? TimeZone,string? TableName, string? StartDate, string? EndDate, string? Action)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "audit_log_list_download";
                var parameters = new DynamicParameters();
                parameters.Add("TargetTimeZone", TimeZone);
                parameters.Add("TableName", TableName);
                parameters.Add("StartDate", StartDate);
                parameters.Add("EndDate", EndDate);
                parameters.Add("Action", Action);
                var auditlog = (await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure)).ToList();
                Dictionary<string, string> headers = new Dictionary<string, string>();

                if (auditlog.Any())
                {
                    var firstRecord = (IDictionary<string, object>)auditlog.First();
                    headers = firstRecord.Keys.ToDictionary(key => key, key => key);
                }
                else
                {              
                    headers = new Dictionary<string, string>
                  {{ "No Data Available", "No Data Available" }};
                }
                var records = new List<object[]>();
                foreach (var auditloginfo in auditlog)
                {
                    var dictionaryPartReturn = (IDictionary<string, object>)auditloginfo;
                    var record = new object[headers.Count];
                    int index = 0;
                    foreach (var header in headers.Keys)
                    {
                        record[index++] = dictionaryPartReturn[header];
                    }
                    records.Add(record);
                }
                byte[] excelFile = _excelService.GenerateExcelFile(headers, records);
                return File(excelFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "audit_log_detail.xlsx");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                    new ExceptionHandler(ex,"audit_log_detail_report_download_api_failed_message", _logService).GetMessage()
                }
                    }
                }));
            }
        }
    }
}
