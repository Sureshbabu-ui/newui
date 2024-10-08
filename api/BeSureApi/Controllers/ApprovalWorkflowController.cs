using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace BeSureApi.Controllers
{
    [Route("api/approvalworkflow")]
    [ApiController]

    public class ApprovalWorkflowController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ApprovalWorkflowController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize(), HasPermission(ApprovalBusinessFunctionCode.APPROVALWORKFLOW_VIEW)]
        [Route("list")]
        public async Task<object> GetApprovalWorkflows(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ApprovalWorkflowList> workflowList = await GetApprovalWorkflowList(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ApprovalWorkflows = workflowList,
                        TotalRows = workflowList.Count(),
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
                            new ExceptionHandler(ex,"approvalworkflowlist_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<ApprovalWorkflowList>> GetApprovalWorkflowList(SqlConnection Connection, string? Search)
        {
            var procedure = "approvalworkflow_list";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            return await Connection.QueryAsync<ApprovalWorkflowList>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }
 
        [HttpGet, Authorize(), HasPermission(ApprovalBusinessFunctionCode.APPROVALWORKFLOW_VIEW)]
        [Route("detail/{ApprovalWorkflowId}")]
        public async Task<object> GetApprovalWorkflowDetails(int ApprovalWorkflowId, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var workflowList = await GetApprovalWorkflowDetailList(connection,ApprovalWorkflowId, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ApprovalWorkflowDetails = workflowList.ApprovalWorkflowDetail,
                        ApprovalWorkflow = workflowList.ApprovalWorkflow,
                        TotalRows = workflowList.ApprovalWorkflowDetail.Count(),
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
                            new ExceptionHandler(ex,"approvalworkflowlist_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<ApprovalWorkflowDetailResult> GetApprovalWorkflowDetailList(SqlConnection connection, int approvalWorkflowId, string? search)
        {
            var procedure = "approvalworkflowdetail_list";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalWorkflowId", approvalWorkflowId);
            parameters.Add("Search", search);

            using (var multi = await connection.QueryMultipleAsync(procedure, parameters, commandType: CommandType.StoredProcedure))
            {
                var approvalWorkflow = await multi.ReadFirstOrDefaultAsync<ApprovalWorkflowList>();
                var approvalWorkflowDetails = await multi.ReadAsync<ApprovalWorkflowDetail>();

                return new ApprovalWorkflowDetailResult
                {
                    ApprovalWorkflow = approvalWorkflow,
                    ApprovalWorkflowDetail = approvalWorkflowDetails
                };
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(ApprovalBusinessFunctionCode.APPROVALWORKFLOW_MANAGE)]
        public async Task<object> EditApprovalWorkflow(ApprovalWorkflowEdit Workflow)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "approvalworkflow_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Workflow.Id);
                parameters.Add("Name", Workflow.Name);
                parameters.Add("Description",Workflow.Description);
                parameters.Add("IsActive", Workflow.IsActive);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsApprovalWorkflowUpdated = true
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
                            new ExceptionHandler(ex,"approvalworkflow_edit_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(ApprovalBusinessFunctionCode.APPROVALWORKFLOW_MANAGE)]
        public async Task<object> CreateApprovalWorkflow(ApprovalWorkflowCreate Workflow)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "ApprovalWorkflow");
                parameters.Add("ColumnName", "Name");
                parameters.Add("Value", Workflow.Name);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    ModelState.AddModelError("Name", "Name already exists");
                }
                if (!ModelState.IsValid)
                {
                    return BadRequest(JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status400BadRequest,
                        errors = UnprocessableEntity(ModelState).Value
                    }
                   ));
                }

                procedure = "approvalworkflow_create";
                parameters = new DynamicParameters();
                parameters.Add("Name", Workflow.Name);
                parameters.Add("Description", Workflow.Description);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsApprovalWorkflowCreated = true
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
                            new ExceptionHandler(ex,"approvalworkflowcreate_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }


        [HttpPost, Authorize()]
        [Route("detail/create")]
        [HasPermission(ApprovalBusinessFunctionCode.APPROVALWORKFLOW_MANAGE)]
        public async Task<object> CreateApprovalWorkflowDetail(ApprovalWorkflowDetailCreate Workflow)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "approvalworkflowdetail_create";
                var parameters = new DynamicParameters();
                parameters.Add("ApprovalWorkflowId", Workflow.ApprovalWorkflowId);
                parameters.Add("Sequence", Workflow.Sequence);
                parameters.Add("ApproverRoleId", Workflow.ApproverRoleId);
                parameters.Add("ApproverUserId", Workflow.ApproverUserId);
                parameters.Add("IsActive", Workflow.IsActive);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsApprovalWorkflowDetailCreated = true
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
                            new ExceptionHandler(ex,"approvalworkflowdetail_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("detail/update")]
        [HasPermission(ApprovalBusinessFunctionCode.APPROVALWORKFLOW_MANAGE)]
        public async Task<object> EditApprovalWorkflowDetail(ApprovalWorkflowDetailEdit Workflow)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "approvalworkflowdetail_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Workflow.Id);
                parameters.Add("Sequence", Workflow.Sequence);
                parameters.Add("ApproverRoleId", Workflow.ApproverRoleId);
                parameters.Add("ApproverUserId", Workflow.ApproverUserId);
                parameters.Add("IsActive", Workflow.IsActive);
                parameters.Add("ModifiedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsApprovalWorkflowDetailUpdated = true
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
                            new ExceptionHandler(ex,"approvalworkflowdetail_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Authorize()]
        [Route("get/names")]
        public async Task<ActionResult> GetWorkflowNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "approvalworkflow_get_names";
                var workflows = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);
                var response = new {
                    status = StatusCodes.Status200OK, 
                    data = new { MasterData = workflows }
                };
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
                            new ExceptionHandler(ex,"approvalworkflowlist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
