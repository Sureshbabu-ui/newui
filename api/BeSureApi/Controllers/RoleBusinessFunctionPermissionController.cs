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
    [Route("api/rolefunctionpermission")]
    [ApiController]
    public class RoleBusinessFunctionPermissionController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public RoleBusinessFunctionPermissionController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("get/rolewiselist")]
        [HasPermission(MasterDataBusinessFunctionCode.ROLEPERMISSION_VIEW)]
        public async Task<object> GetRoleWiseList(string RoleId,string BusinessFunctionType, int? BusinessModuleId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "rolebusinessfunctionpermission_rolewise_list";
                var parameters = new DynamicParameters();
                parameters.Add("RoleId", RoleId);
                parameters.Add("BusinessFunctionType", BusinessFunctionType);
                parameters.Add("BusinessModuleId", BusinessModuleId);
                var roleWiseList = await Connection.QueryAsync<RoleBusinessFunctionPermissionRoleWiseList>(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new {
                    status = StatusCodes.Status200OK, 
                    data = new {
                        RoleFunctionPermissionList = roleWiseList
                    } 
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
                            new ExceptionHandler(ex,"role_business_function_permission_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.ROLEPERMISSION_MANAGE)]

        public async Task<object> updateRoleWisePermissions(RoleBusinessFunctionPermissionUpdateList RoleFunctionPermissions)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "rolebusinessfunctionpermission_update";
                var parameters = new DynamicParameters();
                parameters.Add("RoleFunctionPermissions", JsonSerializer.Serialize(RoleFunctionPermissions.RoleFunctionPermissions));
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsRoleFunctionPermissionUpdated = true
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
                            new ExceptionHandler(ex,"role_business_function_permission_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
