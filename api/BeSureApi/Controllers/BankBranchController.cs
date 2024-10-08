using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/bankbranch")]
    [ApiController]
    public class BankBranchController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public BankBranchController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize()]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.BANKBRANCH_VIEW)]
        public async Task<object> GetBankBranches(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<BankBranchList> bankBranchList = await GetBankBranchList(connection, Page, Search);
                int totalRows = await GetBankBranchCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        BankBranches = bankBranchList,
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
                            new ExceptionHandler(ex,"bankbranch_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<BankBranchList>> GetBankBranchList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "bankbranch_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var bankBranchList = await Connection.QueryAsync<BankBranchList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return bankBranchList;
        }

        private async Task<int> GetBankBranchCount(SqlConnection Connection, string? Search)
        {
            var procedure = "bankbranch_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.BANKBRANCH_MANAGE)]
        public async Task<object> CreateBankBranch(BankBranchCreate BankBranchObj)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bankbranch_create";
                var parameters = new DynamicParameters();
                parameters.Add("BankId", BankBranchObj.BankId);
                parameters.Add("BranchCode", BankBranchObj.BranchCode);
                parameters.Add("BranchName", BankBranchObj.BranchName);
                parameters.Add("Address", BankBranchObj.Address);
                parameters.Add("CityId", BankBranchObj.CityId);
                parameters.Add("StateId", BankBranchObj.StateId);
                parameters.Add("CountryId", BankBranchObj.CountryId);
                parameters.Add("Pincode", BankBranchObj.Pincode);
                parameters.Add("ContactPerson", BankBranchObj.ContactPerson);
                parameters.Add("ContactNumberOneCountryCode", BankBranchObj.ContactNumberOneCountryCode);
                parameters.Add("ContactNumberOne", BankBranchObj.ContactNumberOne);
                parameters.Add("ContactNumberTwoCountryCode", BankBranchObj.ContactNumberTwoCountryCode);
                parameters.Add("ContactNumberTwo", BankBranchObj.ContactNumberTwo);
                parameters.Add("Email", BankBranchObj.Email);
                parameters.Add("Ifsc", BankBranchObj.Ifsc);
                parameters.Add("MicrCode", BankBranchObj.MicrCode);
                parameters.Add("SwiftCode", BankBranchObj.SwiftCode);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsBankBranchCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync<BankBranchCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isBankBranchCreated = parameters.Get<int>("IsBankBranchCreated");
                if (isBankBranchCreated == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsBankBranchCreated = Convert.ToBoolean(isBankBranchCreated)
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
                            new ExceptionHandler(ex,"bankbranch_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.BANKBRANCH_MANAGE)]
        public async Task<object> EditBankBranch(BankBranchEdit bankbranchedit)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bankbranch_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", bankbranchedit.Id);
                parameters.Add("BranchId", bankbranchedit.BranchId);
                parameters.Add("BranchCode", bankbranchedit.BranchCode);
                parameters.Add("BranchName", bankbranchedit.BranchName);
                parameters.Add("Address", bankbranchedit.Address);
                parameters.Add("CityId", bankbranchedit.CityId);
                parameters.Add("StateId", bankbranchedit.StateId);
                parameters.Add("CountryId", bankbranchedit.CountryId);
                parameters.Add("Pincode", bankbranchedit.Pincode);
                parameters.Add("ContactPerson", bankbranchedit.ContactPerson);
                parameters.Add("ContactNumberOneCountryCode", bankbranchedit.ContactNumberOneCountryCode);
                parameters.Add("ContactNumberOne", bankbranchedit.ContactNumberOne);
                parameters.Add("ContactNumberTwoCountryCode", bankbranchedit.ContactNumberTwoCountryCode);
                parameters.Add("ContactNumberTwo", bankbranchedit.ContactNumberTwo);
                parameters.Add("Email", bankbranchedit.Email);
                parameters.Add("Ifsc", bankbranchedit.Ifsc);
                parameters.Add("MicrCode", bankbranchedit.MicrCode);
                parameters.Add("SwiftCode", bankbranchedit.SwiftCode);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsBankBranchUpdated = true
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
                            new ExceptionHandler(ex,"bankbranch_edit_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/all/in/bank")]
        public async Task<ActionResult> GetAllBranchesInBank(int BankId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bankbranch_get_all_in_bank";
                var parameters = new DynamicParameters();
                parameters.Add("BankId", BankId);
                var bankBranhes= await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        BankBranches = bankBranhes
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
                            new ExceptionHandler(ex,"bankbranch_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet,Authorize()]
        [Route("details")]
        [HasPermission(MasterDataBusinessFunctionCode.BANKBRANCH_VIEW)]

        public async Task<ActionResult> GetBankBranchDetails(int BankBranchInfoId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bankbranch_details";
                var parameters = new DynamicParameters();
                parameters.Add("BankBranchInfoId", BankBranchInfoId);
                var bankBranchInfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        BankBranchDetails = bankBranchInfo.First()
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
                            new ExceptionHandler(ex,"bankbranch_details_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/branchnames")]
        public async Task<ActionResult> GetAllBankBranchNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bankbranch_get_names";
                var bankBranhes = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        BankBranches = bankBranhes
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
                            new ExceptionHandler(ex,"bankbranch_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.BANKBRANCH_MANAGE)]
        public async Task<object> DeleteBankBranch(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "bankbranch_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("bankbranch_delete_restricted_message");
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
                           new ExceptionHandler(ex,"bankbranch_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
