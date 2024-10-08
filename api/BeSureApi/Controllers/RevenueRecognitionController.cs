using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;

namespace BeSureApi.Controllers
{
    [Route("api/revenuerecognition")]
    [ApiController]
    public class RevenueRecognitionController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public RevenueRecognitionController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("list/contract/{ContractId}")]
        [Authorize()]
        [HasPermission(ContractBusinessFunctionCode.REVENUERECOGNITION_LIST)]
        public async Task<object> GetContractRevenue(int ContractId, string? StartDate,string? EndDate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<RevenueRecognitionList> list = await GetRevenueRecognitionList(connection, ContractId, StartDate,EndDate);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        RevenueRecognitionList = list                      
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
                            new ExceptionHandler(ex,"contractrevenuerecognition_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<RevenueRecognitionList>> GetRevenueRecognitionList(SqlConnection Connection, int ContractId, string? StartDate,string?EndDate)
        {
            var procedure = "revenuerecognition_list_by_contract";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("StartDate", StartDate);
            parameters.Add("EndDate", EndDate);
            var revenueList = await Connection.QueryAsync<RevenueRecognitionList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return revenueList;
        }
    }
}
