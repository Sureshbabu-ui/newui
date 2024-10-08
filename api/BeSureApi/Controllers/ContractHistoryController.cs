using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace BeSureApi.Controllers
{
    [Route("api/contracthistory")]
    [ApiController]
    public class ContractHistoryController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public ContractHistoryController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpGet]
        [Route("list")]
        public async Task<ActionResult<List<ContractHistory>>> GetContractHistoryList(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ContractHistory> contractHistoryList = await GetHistoryList(connection,ContractId);
                int totalRows = await GetHistoryCount(connection, ContractId);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractVersions = contractHistoryList,
                        TotalRows = totalRows
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
                            new ExceptionHandler(ex,"contracthistory_list_no_data", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<ContractHistory>> GetHistoryList(SqlConnection Connection,int ContractId)
        {
            var procedure = "contracthistory_list";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            var contractHistoryList = await Connection.QueryAsync<ContractHistory>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractHistoryList;
        }

        private async Task<int> GetHistoryCount(SqlConnection Connection,int ContractId)
        {
            var procedure = "contracthistory_count";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }
    }
}
