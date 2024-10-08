using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/futureupdates")]
    [ApiController]
    public class ContractFutureUpdateController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ContractFutureUpdateController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

      [HttpGet]
      [Route("list")]
      [HasPermission(MasterDataBusinessFunctionCode.CONTRACT_FUTUREUPDATES_VIEW)]  
        public async Task<ActionResult> GetAllFutureUpdates( string? Search,int ContractId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractfutureupdate_list";
                var parameters = new DynamicParameters();
                parameters.Add("Search", Search);
                parameters.Add("ContractId", ContractId);
                var futureupdates = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        FutureUpdates = futureupdates,
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
                            new ExceptionHandler(ex,"future_update_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.CONTRACT_FUTUREUPDATES_MANAGE)]
        public async Task<object> CreateContractFutureUpdate(CreateContractFutureUpdate futureUpdate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractfutureupdate_create";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", futureUpdate.ContractId);
                parameters.Add("RenewedMergedContractNumber", futureUpdate.RenewedMergedContractNumber);
                parameters.Add("StatusId", futureUpdate.StatusId);
                parameters.Add("SubStatusId", futureUpdate.SubStatusId);
                parameters.Add("ProbabilityPercentage", futureUpdate.ProbabilityPercentage);
                parameters.Add("TargetDate", futureUpdate.TargetDate);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<CreateContractFutureUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsFutureUpdateCreated = true
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
                            new ExceptionHandler(ex,"future_update_create_failed_message", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("oldcontractdetails")]
        public async Task<ActionResult> GetSelectedOldContractDetails(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_getoldcontractnumber";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                parameters.Add("OldContractNumber", dbType: DbType.String, size: 32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var OldContractNo = parameters.Get<string>("OldContractNumber");
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        oldcontractdetails = OldContractNo
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
                            new ExceptionHandler(ex,"oldcontract_detail_no_data", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }
        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.CONTRACT_FUTUREUPDATES_MANAGE)]
        public async Task<object> EditFutureUpdate(UpdateContractFutureUpdate FutureUpdate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractfutureupdate_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", FutureUpdate.Id);
                parameters.Add("TargetDate", FutureUpdate.TargetDate);
                parameters.Add("ProbabilityPercentage", FutureUpdate.ProbabilityPercentage);
                parameters.Add("StatusId", FutureUpdate.StatusId);
                parameters.Add("SubStatusId", FutureUpdate.SubStatusId);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<UpdateContractFutureUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsFutureUpdateUpdated = true
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
                            new ExceptionHandler(ex,"future_update_failed_message", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }
        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.CONTRACT_FUTUREUPDATES_MANAGE)]
        public async Task<object> DeleteFutureUpdate(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractfutureupdate_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsDeleted = true
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
                           new ExceptionHandler(ex,"future_update_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
