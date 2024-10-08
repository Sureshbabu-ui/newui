using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using static Org.BouncyCastle.Math.EC.ECCurve;
using BeSureApi.Models;
using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using BeSureApi.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using Microsoft.AspNetCore.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/bank")]
    [ApiController]
    public class BankController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public BankController(IConfiguration config, ILogService logService)
        {
            _config     = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.BANK_VIEW)]
        public async Task<ActionResult<List<ApprovedBankDetails>>> GetApprovedBanksList(int Page, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ApprovedBankDetails> approvedBanks = await GetApprovedList(Connection, Page, Search);
                int totalRows   = await GetApprovedCount(Connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                return Ok(JsonSerializer.Serialize(new { 
                    status  = StatusCodes.Status200OK, 
                    data    = new { 
                        ApprovedList    = approvedBanks, 
                        CurrentPage     = Page, 
                        TotalRows       = totalRows, 
                        PerPage         = perPage
                    } 
                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new { 
                    status = StatusCodes.Status400BadRequest, 
                    errors = new { 
                        Message = new[] {                            
                            new ExceptionHandler(ex,"create_bank_list_no_data", _logService).GetMessage()
                        } 
                    } 
                }));
            }
        }
        private async Task<IEnumerable<ApprovedBankDetails>> GetApprovedList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure   = "bank_list";
            var parameters  = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);

            var bankList = await Connection.QueryAsync<ApprovedBankDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return bankList;
        }

        private async Task<int> GetApprovedCount(SqlConnection Connection, string? Search)
        {
            var procedure   = "bank_count";
            var parameters  = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("names")]
        public async Task<ActionResult<List<ApprovedBankDetails>>> GetApprovedBankNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bank_get_names";
                var parameters = new DynamicParameters();
                var bankList = await Connection.QueryAsync<ApprovedBankDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ApprovedList = bankList,
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
                            new ExceptionHandler(ex,"create_bank_list_no_banks_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("edit")]
        [HasPermission(MasterDataBusinessFunctionCode.BANK_MANAGE)]
        public async Task<object> EditBank(BankEdit bankedit)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bank_edit";
                var parameters = new DynamicParameters();
                parameters.Add("Id", bankedit.Id);
                parameters.Add("BankName", bankedit.BankName);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
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
                        Message = new[]
                        {
                            new ExceptionHandler(ex,"assetproductcategory_edit_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.BANK_MANAGE)]
        public async Task<object> DeleteBank(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bank_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("bank_delete_restricted_message");
                }
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
                           new ExceptionHandler(ex,"bank_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

       [HttpGet("pending/{Id}"), Authorize()]
        public async Task<ActionResult<BankPendingDetailWithReview>> GetPendingBankDetails(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                BankPendingDetailWithReview approvalRequestDetails = await GetPendingBankDetailList(connection,  Id);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = approvalRequestDetails

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
                          new ExceptionHandler(ex,"pending_approvals_message_no_records_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<BankPendingDetailWithReview> GetPendingBankDetailList(SqlConnection Connection,  int ApprovalRequestDetailId)
        {
            var procedure = "bank_pending_detail";
            var parameters = new DynamicParameters();
            parameters.Add("ApprovalRequestId", ApprovalRequestDetailId);
            using (var multi = await Connection.QueryMultipleAsync(procedure, parameters, commandType: CommandType.StoredProcedure))
            {
                var approvalRequest = await multi.ReadFirstOrDefaultAsync<BankPendingDetail>();
                var approvalReviewList = await multi.ReadAsync<ApprovalRequestReviewDetail>();

                return new BankPendingDetailWithReview
                {
                    BankPendingDetail = approvalRequest,
                    ApprovalRequestReviewList = approvalReviewList
                };
            }
        }

    }
}
