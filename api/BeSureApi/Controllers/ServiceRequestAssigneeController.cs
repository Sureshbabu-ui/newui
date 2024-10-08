using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Models;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Text.Json;

namespace BeSureApi.Controllers
{
    [Route("api/servicerequestassignee")]
    [ApiController]
    public class ServiceRequestAssigneeController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ServiceRequestAssigneeController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("list")]
        public async Task<ActionResult<List<ServiceRequestAssigneeList>>> GetAllVendorList( int ServiceRequestId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ServiceRequestAssigneeList> servicerequestassignee = await GetServiceRequestAssigneeList(Connection,ServiceRequestId);
                int totalRows = await GetServiceRequestAssigneeCount(Connection, ServiceRequestId);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ServiceRequestAssignees = servicerequestassignee,
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
                        message = new[] {
                            new ExceptionHandler(ex,"assign_engineer_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<ServiceRequestAssigneeList>> GetServiceRequestAssigneeList(SqlConnection Connection,int ServiceRequestId)
        {
            var procedure = "servicerequestassignee_list";
            var parameters = new DynamicParameters();
            parameters.Add("ServiceRequestId", ServiceRequestId);
            var AssigneeList = await Connection.QueryAsync<ServiceRequestAssigneeList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return AssigneeList;
        }

        private async Task<int> GetServiceRequestAssigneeCount(SqlConnection Connection, int ServiceRequestId)
        {
            var procedure = "servicerequestassignee_count";
            var parameters = new DynamicParameters();
            parameters.Add("ServiceRequestId", ServiceRequestId);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(ServiceRequestBusinessFunctionCode.SERVICE_REQUEST_ENGINEER_ASSIGN)]
        public async Task<object> AssignEngineer(List<ServiceRequestAssigneeCreate> AssigneeCreate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequestassignee_create";
                var parameters = new DynamicParameters();
                parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("AssignmentDetails", JsonSerializer.Serialize(AssigneeCreate));
                parameters.Add("IsEngineerAssigned", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isEngineerAssigned = parameters.Get<int>("IsEngineerAssigned");
                if (isEngineerAssigned == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsEngineerAssigned = Convert.ToBoolean(isEngineerAssigned)
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
                            new ExceptionHandler(ex,"assign_engineer_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("assign/engineer")]
        [HasPermission(ServiceRequestBusinessFunctionCode.SERVICE_REQUEST_ENGINEER_ASSIGN)]
        public async Task<object> ServiceEngineerAssignment(AssigneeCreate assignee)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequestassignee_assign_engineer_to_call";
                var parameters = new DynamicParameters();
                parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("AssigneeId", assignee.AssigneeId);
                parameters.Add("Remarks", assignee.Remarks);
                parameters.Add("ServiceRequestId", assignee.ServiceRequestId);
                parameters.Add("StartsFrom", assignee.StartsFrom);
                parameters.Add("IsFirstAssignment", assignee.IsFirstAssignment);
                parameters.Add("IsEngineerAssigned", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isEngineerAssigned = parameters.Get<int>("IsEngineerAssigned");
                if (isEngineerAssigned == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsEngineerAssigned = Convert.ToBoolean(isEngineerAssigned)
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
                            new ExceptionHandler(ex,"assign_engineer_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("delete")]
        public async Task<ActionResult<List<DeleteEngineer>>> DeleteEngineer(DeleteEngineer DeleteEngineer)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "servicerequestassignee_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", DeleteEngineer.Id);
                parameters.Add("LoggedUserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsDeleted", DeleteEngineer.IsDeleted);
                parameters.Add("DeletedReason", DeleteEngineer.DeletedReason);
                connection.Query<DeleteEngineer>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        isDeleted = true
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
                            new ExceptionHandler(ex,"assign_engineer_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("assignee/avilability")]
        public async Task<ActionResult<List<ExistingShedules>>> GetExistingShedules(string AssigneeId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "assignee_avilability_check_list";
                var parameters = new DynamicParameters();
                parameters.Add("AssigneeId", AssigneeId);
                var existingShedules = await connection.QueryAsync<ExistingShedules>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ExistingShedules = existingShedules
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
                            new ExceptionHandler(ex,"assign_engineer_list_no_data", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("engineers/names")]
        public async Task<ActionResult> GetServiceEngineersNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "serviceengineers_names";
                var parameters = new DynamicParameters();
                var engineersnames = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { EngineersNames = engineersnames } };
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
                            new ExceptionHandler(ex,"assign_engineer_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
