
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Services.LogService;
using BeSureApi.Exceptions;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace BeSureApi.Controllers
{
    [Route("api/contract/manpowersummary")]
    [ApiController]
    public class ContractManPowerController : Controller
    {

        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public ContractManPowerController(IConfiguration config, ILogService logService)
        {
            _config     = config;
            _logService = logService;
        }

        [HttpPost, Authorize()]
        [Route("create")]
        public async Task<object> CreateContractManPowerSummary(ManPowerSummaryCreate Manpower)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_summaryvalue_validation";
                var parameters = new DynamicParameters();
                parameters.Add("SummaryType", "ManPower");
                parameters.Add("ContractId", Manpower.ContractId);
                parameters.Add("SummaryValue", Manpower.CustomerAgreedAmount);
                var isValueExceeded = await connection.QueryAsync<IsAgreedAmountExceeded>(procedure, parameters, commandType: CommandType.StoredProcedure);
                if (isValueExceeded.FirstOrDefault().IsValueExceeded)
                {
                    throw new CustomException("validation_manpower_create_laborcost");
                }
                procedure   = "contractmanpower_summary_create";
                parameters  = new DynamicParameters();
                parameters.Add("ContractId", Manpower.ContractId);
                parameters.Add("CustomerSiteId", Manpower.CustomerSiteId);
                parameters.Add("TenantOfficeInfoId", Manpower.TenantOfficeInfoId);
                parameters.Add("EngineerTypeId", Manpower.EngineerTypeId);
                parameters.Add("EngineerLevelId", Manpower.EngineerLevelId);
                parameters.Add("EngineerMonthlyCost", Manpower.EngineerMonthlyCost);
                parameters.Add("EngineerCount", Manpower.EngineerCount);
                parameters.Add("DurationInMonth", Manpower.DurationInMonth);
                parameters.Add("CustomerAgreedAmount", Manpower.CustomerAgreedAmount);
                parameters.Add("Remarks", Manpower.Remarks);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsManpowerSummaryCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync<ManPowerSummaryCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isManpowerSummaryCreated = parameters.Get<int>("IsManpowerSummaryCreated");
                if (isManpowerSummaryCreated == 0)
                {
                    throw new Exception();
                }

                return Ok(JsonSerializer.Serialize(new
                {
                    status  = StatusCodes.Status200OK,
                    data    = new
                    {
                        IsManpowerSummaryCreated = Convert.ToBoolean(isManpowerSummaryCreated)
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
                            new ExceptionHandler(ex,"manpower_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list")]
        public async Task<ActionResult<List<ManPowerSummaryList>>> GetContractManpowerSummaryList(int Page, string? Search,int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ManPowerSummaryList> contractManPowerList = await GetManPowerSummaryList(connection, Page, Search,ContractId);
                int totalRows = await GetManpowerCount(connection, Page, Search, ContractId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new {
                    status  = StatusCodes.Status200OK,
                    data    = new {
                        ContractManPowerSummaryList    = contractManPowerList,
                        CurrentPage             = Page,
                        TotalRows               = totalRows,
                        PerPage                 = perPage
                    }
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new {
                    status = StatusCodes.Status400BadRequest,
                    errors = new {
                        Message = new[] {
                            new ExceptionHandler(ex,"manpower_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<ManPowerSummaryList>> GetManPowerSummaryList(SqlConnection Connection, int Page, string? Search, int ContractId)
        {
            var procedure   = "contractmanpower_summary_list";
            var parameters  = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);

            var contractManpowerList= await Connection.QueryAsync<ManPowerSummaryList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractManpowerList;
        }

        private async Task<int> GetManpowerCount(SqlConnection Connection, int Page, string? Search,int ContractId)
        {
            var procedure   = "contractmanpower_summary_count";
            var parameters  = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("Search", Search);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPut, Authorize()]
        [Route("update")]
        public async Task<ActionResult> UpdateContractManPowerSummary(ManPowerSummaryUpdate Manpower)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_summaryvalue_validation";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", Manpower.ContractId);
                parameters.Add("SummaryType", "ManPower");
                parameters.Add("SummaryValue", Manpower.CustomerAgreedAmount);
                parameters.Add("SummaryId", Manpower.Id);
                var isValueExceeded = await connection.QueryAsync<IsAgreedAmountExceeded>(procedure, parameters, commandType: CommandType.StoredProcedure);

                if (isValueExceeded.FirstOrDefault().IsValueExceeded)
                {
                    throw new CustomException("validation_manpower_create_laborcost");
                }

                procedure = "contractmanpower_summary_update";
                parameters = new DynamicParameters();
                parameters.Add("Id", Manpower.Id);
                parameters.Add("ContractId", Manpower.ContractId);
                parameters.Add("CustomerSiteId", Manpower.CustomerSiteId);
                parameters.Add("TenantOfficeInfoId", Manpower.TenantOfficeInfoId);
                parameters.Add("EngineerTypeId", Manpower.EngineerTypeId);
                parameters.Add("EngineerLevelId", Manpower.EngineerLevelId);
                parameters.Add("EngineerMonthlyCost", Manpower.EngineerMonthlyCost);
                parameters.Add("EngineerCount", Manpower.EngineerCount);
                parameters.Add("DurationInMonth", Manpower.DurationInMonth);
                parameters.Add("CustomerAgreedAmount", Manpower.CustomerAgreedAmount);
                parameters.Add("Remarks", Manpower.Remarks);
                parameters.Add("ModifiedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                connection.Query<ManPowerSummaryUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new {
                        IsUpdated = true
                    }
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new {
                        Message = new[] {                           
                            new ExceptionHandler(ex,"manpower_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list/service-engineers")]
        public async Task<ActionResult> GetServiceEngineers()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "service_engineers_list";
                var parameters = new DynamicParameters();
                var engineers = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { Engineers = engineers } };
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
                            new ExceptionHandler(ex,"manpower_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/details")]
        public async Task<ActionResult<List<ManPowerSummaryList>>> GetSelectedManpowerSummary(int ContractManpowerId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractmanpower_summary_details";
                var parameters = new DynamicParameters();
                parameters.Add("ContractManpowerId", ContractManpowerId);
                var contractManpowerSummary = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractManpowerSummary = contractManpowerSummary.First()
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
                            new ExceptionHandler(ex,"manpower_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

    }
}
            
