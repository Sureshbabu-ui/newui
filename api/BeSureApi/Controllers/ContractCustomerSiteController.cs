using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using static BeSureApi.Models.CustomerSite;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/contract/customersite")]
    [ApiController]
    public class ContractCustomerSiteController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public ContractCustomerSiteController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_CUSTOMER_SITE_CREATE)]
        public async Task<object> CreateContractCustomerSite(ContractCustomerSiteCreate CustomerSite)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_customer_site_create";
                var parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("ContractId", CustomerSite.ContractId);
                parameters.Add("CustomerSiteId", CustomerSite.CustomerSiteId);
                parameters.Add("IsContractCustomerSiteCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync<ContractCustomerSiteCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isContractCustomerSiteCreated = parameters.Get<int>("IsContractCustomerSiteCreated");
                if (isContractCustomerSiteCreated == 0)
                {
                    throw new CustomException("contract_customer_site_sitecount_exceeded");
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCustomerSiteCreated = Convert.ToBoolean(isContractCustomerSiteCreated)
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
                            new ExceptionHandler(ex,"contract_customer_site_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet,Authorize()]
        [Route("list")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_CUSTOMER_SITE_CREATE)]
        public async Task<ActionResult> GetCustomerSiteList(int Page, string? Search, int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<CustomerSiteList> customerSiteList = await GetCustomerSiteList(connection, Page, Search, ContractId);
                int totalRows = await GetCustomerSiteCount(connection, Page, Search, ContractId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CustomerSiteList = customerSiteList,
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
                            new ExceptionHandler(ex,"contract_customer_site_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<CustomerSiteList>> GetCustomerSiteList(SqlConnection Connection, int Page, string? Search, int ContractId)
        {
            var procedure = "contract_customer_site_list";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var customerSiteList = await Connection.QueryAsync<CustomerSiteList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return customerSiteList;
        }
        private async Task<int> GetCustomerSiteCount(SqlConnection Connection, int Page, string? Search, int ContractId)
        {
            var procedure = "contract_customer_site_count";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("get/all")]
        public async Task<ActionResult> GetContractCustomerSites(int ContractId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_customer_sites";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var contractcustomersites = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                var response = new { status = StatusCodes.Status200OK, data = new { ContractCustomerSites = contractcustomersites } };
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
                            new ExceptionHandler(ex,"contract_customer_site_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("count")]
        public async Task<ActionResult> GetContractCustomerSiteCount(int ContractId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_customer_site_count";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count =  parameters.Get<int>("@TotalRows");

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        contractcustomersitecount = count
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
                            new ExceptionHandler(ex,"customersite_count_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}