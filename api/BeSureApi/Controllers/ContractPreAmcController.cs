using BeSureApi.Exceptions;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Services.LogService;
using System.Text;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Models;
using System.Diagnostics.Contracts;

namespace BeSureApi.Controllers
{
    [Route("api/contract/preamc")]
    [ApiController]
    public class ContractPreAmcController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ContractPreAmcController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpGet]
        [Route("inspection/schedule/list")]
        public async Task<ActionResult> GetPreAmcInspectionSchedule(int ContractId,string CustomerSiteId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_preamc_inspection_scheduled";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                parameters.Add("ContractCustomerSiteId", CustomerSiteId);
                var preAmcSchedule = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = preAmcSchedule };
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
                        new ExceptionHandler(ex,"pre_amc_management_inspection_schedule_not_found_message", _logService).GetMessage()
                    }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("inspection/schedule/exist/check")]
        public async Task<ActionResult> GetPreAmcAssignEngineerSchedule( string EngineerId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_preamc_get_assigned_engineer_schedule_details";
                var parameters = new DynamicParameters();
                parameters.Add("EngineerId", EngineerId);
                var preAmcSchedule = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ExistingShedules = preAmcSchedule
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
                        new ExceptionHandler(ex,"pre_amc_management_inspection_schedule_not_found_message", _logService).GetMessage()
                    }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("inspection/assigned/engineer/list")]
        public async Task<ActionResult> GetPreAmcInspectionAssignedEngineers(int ContractId, string PreAmcScheduleId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_preamc_inspection_assigned_engineers";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                parameters.Add("PreAmcScheduleId", PreAmcScheduleId);
                var preAmcSchedule = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = preAmcSchedule };
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
                        new ExceptionHandler(ex,"pre_amc_management_assign_engineer_not_found_message", _logService).GetMessage()
                    }
                    }
                }));
            }
        }
        [HttpPost, Authorize()]
        [Route("inspection/schedule")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_ASSET)]

        public async Task<object> PreAmcInspectionSchedule(PreAmcInspectionSchedule PreAmcInspection)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_preamc_inspection_schedule";
                var parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("ContractId", PreAmcInspection.ContractId);
                parameters.Add("CustomerSiteId", PreAmcInspection.CustomerSiteId);
                parameters.Add("StartsOn", PreAmcInspection.StartsOn);
                parameters.Add("EndsOn", PreAmcInspection.EndsOn);
                parameters.Add("IsPreAmcScheduled", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync<PreAmcInspectionSchedule>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isPreAmcScheduled = parameters.Get<int>("IsPreAmcScheduled");
                if (isPreAmcScheduled == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPreAmcScheduled = Convert.ToBoolean(isPreAmcScheduled)
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
                        new ExceptionHandler(ex,"pre_amc_schedule_failed_message", _logService).GetMessage()
                    }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("inspection/service/engineer/list")]
        public async Task<ActionResult> GetServiceEngineers()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "serviceengineers_names";
                var engineers = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = engineers  };
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
                            new ExceptionHandler(ex,"pre_amc_management_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpPost]
        [Route("inspection/assign/engineer")]
        public async Task<object> PreAmcInspectionAssignEngineer(PreAmcInspectionAssignEngineer PreAmcInspectionEngineer)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_preamc_inspection_assign_engineer";
                var parameters = new DynamicParameters();
                parameters.Add("PreAmcScheduleId", PreAmcInspectionEngineer.PreAmcScheduleId);
                parameters.Add("EngineerId", PreAmcInspectionEngineer.EngineerId);
                parameters.Add("PlannedFrom", PreAmcInspectionEngineer.PlannedFrom);
                parameters.Add("PlannedTo", PreAmcInspectionEngineer.PlannedTo);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("@IsEngineerScheduled", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync<PreAmcInspectionSchedule>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isEngineerScheduled = parameters.Get<int>("@IsEngineerScheduled");
                if (isEngineerScheduled == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsEngineerScheduled = Convert.ToBoolean(isEngineerScheduled)
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
                        new ExceptionHandler(ex,"pre_amc_management_inspection_engineer_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("pending/count")]
        public async Task<ActionResult> GetPreAmcPendingCount()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "preamc_pending_count";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var preAmcPendingCount = await Connection.QuerySingleOrDefaultAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PreAmcPendingCount = preAmcPendingCount
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
                        new ExceptionHandler(ex,"pre_amc_pendingcount_not_found_message", _logService).GetMessage()
                    }
                    }
                }));
            }
        }
        [HttpGet,Authorize]
        [Route("pendingsites/list")]
        public async Task<ActionResult<List<PreAmcPendingSiteList>>> GetPreAmcPendingSites(int Page, string? Search, int? CustomerId, int? ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PreAmcPendingSiteList> siteList = await GetAllPreAmcPendingSites(connection, Page, Search, CustomerId, ContractId);
                int? totalRows = await GetAllPreAmcPendingCount(connection, Search, CustomerId, ContractId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CustomerSites = siteList,
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
                            new ExceptionHandler(ex,"preamcpending_contract_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PreAmcPendingSiteList>> GetAllPreAmcPendingSites(SqlConnection Connection, int Page, string? Search, int? CustomerId, int? ContractId)
        {
            var procedure = "preamc_pending_sitelist";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("CustomerId", CustomerId);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("Search", Search);
            var preAmcPendingSiteList = await Connection.QueryAsync<PreAmcPendingSiteList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return preAmcPendingSiteList;
        }
        private async Task<int?> GetAllPreAmcPendingCount(SqlConnection Connection, string? Search, int? CustomerId, int? ContractId)
        {
            var procedure = "preamc_pending_sitecount";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("CustomerId", CustomerId);
            parameters.Add("Search", Search);
            parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int?>("TotalRows");
        }
    }
}