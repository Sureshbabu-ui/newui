
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Services.LogService;
using BeSureApi.Exceptions;

namespace BeSureApi.Controllers
{
    [Route("api/contract/manpowerallocation")]
    [ApiController]
    public class ContractManpowerAlocationController : Controller
    {

        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public ContractManpowerAlocationController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpPost, Authorize()]
        [Route("create")]
        public async Task<object> CreateContractManPowerAllocation(ContractManpowerAllocationCreate Manpower)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractmanpowerallocation_create";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", Manpower.ContractId);
                parameters.Add("CustomerSiteId", Manpower.CustomerSiteId);
                parameters.Add("EmployeeId", Manpower.EmployeeId);
                parameters.Add("CustomerAgreedAmount", Manpower.CustomerAgreedAmount);
                parameters.Add("BudgetedAmount", Manpower.BudgetedAmount);
                parameters.Add("StartDate", Manpower.StartDate);
                parameters.Add("EndDate", Manpower.EndDate);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("Remarks", Manpower.Remarks);
                parameters.Add("IsManpowerAllocated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                connection.Query<ContractManpowerAllocationCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isManpowerAllocated = parameters.Get<int>("IsManpowerAllocated");
                if (isManpowerAllocated == 0)
                {
                    throw new Exception();
                }

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsManpowerAllocated = Convert.ToBoolean(isManpowerAllocated)
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
                            new ExceptionHandler(ex,"manpowermanagement_manpower_allocate_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list")]
        public async Task<ActionResult<List<ManpowerAllocationList>>> GetContractManpowerAllocations(int Page, string? Search, int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ManpowerAllocationList> contractManPowerList = await GetManpowerAllocationList(connection, Page, Search, ContractId);
                int totalRows = await GetManpowerAllocationCount(connection, Page, Search, ContractId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ManpowerAllocations = contractManPowerList,
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
                            new ExceptionHandler(ex,"manpowermanagement_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<ManpowerAllocationList>> GetManpowerAllocationList(SqlConnection Connection, int Page, string? Search, int ContractId)
        {
            var procedure = "contractmanpowerallocation_list";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var contractManpowerList = await Connection.QueryAsync<ManpowerAllocationList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractManpowerList;
        }

        private async Task<int> GetManpowerAllocationCount(SqlConnection Connection, int Page, string? Search, int ContractId)
        {
            var procedure = "contractmanpowerallocation_count";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("Search", Search);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPut, Authorize()]
        [Route("update")]
        public async Task<ActionResult> UpdateContractManPowerAllocation(ContractManpowerAllocationUpdate Manpower)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractmanpowerallocation_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Manpower.Id);
                parameters.Add("ContractId", Manpower.ContractId);
                parameters.Add("CustomerSiteId", Manpower.CustomerSiteId);
                parameters.Add("EmployeeId", Manpower.EmployeeId);
                parameters.Add("AllocationStatusId", Manpower.AllocationStatusId);
                parameters.Add("CustomerAgreedAmount", Manpower.CustomerAgreedAmount);
                parameters.Add("BudgetedAmount", Manpower.BudgetedAmount);
                parameters.Add("StartDate", Manpower.StartDate);
                parameters.Add("EndDate", Manpower.EndDate);
                parameters.Add("ModifiedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("Remarks", Manpower.Remarks);
                connection.Query<ContractManpowerAllocationUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsUpdated = true
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
                            new ExceptionHandler(ex,"manpowermanagement_manpower_allocate_update_failed_message", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("details")]
        public async Task<ActionResult<List<ManpowerAllocationDetails>>> GetAllocationDetails(int AllocationId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractmanpowerallocation_details";
                var parameters = new DynamicParameters();
                parameters.Add("@AllocationId", AllocationId);
                var allocationDetails = await connection.QueryAsync<ManpowerAllocationDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        AllocationDetails = allocationDetails.First()
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
                            new ExceptionHandler(ex,"manpowermanagement_manpower_details_not_found_message", _logService).GetMessage()
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
                            new ExceptionHandler(ex,"manpowermanagement_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}

