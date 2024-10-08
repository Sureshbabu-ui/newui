using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Dapper;
using BeSureApi.Services.LogService;
using BeSureApi.Exceptions;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using System.Runtime.InteropServices;

namespace BeSureApi.Controllers
{
    [Route("api/customer")]
    [ApiController]
    public class CustomerController:ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public CustomerController(IConfiguration config, ILogService logService)
        {
            _config     = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("get/names")]
        public async Task<ActionResult> GetContractCustomers()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_customers_list";
                var customers = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { CustomersList = customers } };
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
                            new ExceptionHandler(ex,"customer_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("names")]
        public async Task<ActionResult> GetCustomersNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customers_name_list";
                var customers = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { CustomersList = customers } };
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
                            new ExceptionHandler(ex,"customer_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("list")]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMER_LIST)]
        public async Task<ActionResult<List<CustomerList>>> GetAllCustomers(int Page, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<CustomerList> customers = await GetCustomersList(Connection, Page, Search);
                int totalRows = await GetCustomersCount(Connection, Page, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Customers   = customers,
                        CurrentPage = Page,
                        TotalRows   = totalRows,
                        PerPage     = perPage
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
                            new ExceptionHandler(ex,"customer_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<CustomerList>> GetCustomersList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "customers_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);

            var customerList = await Connection.QueryAsync<CustomerList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return customerList;
        }
        private async Task<int> GetCustomersCount(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "customers_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("get/details")]
        public async Task<ActionResult> GetCustomerDetails  (int CustomerId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customer_details";
                var parameters = new DynamicParameters();
                parameters.Add("CustomerId", CustomerId);
                var customerDetails = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CustomerDetails = customerDetails.First()
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
                            new ExceptionHandler(ex,"customer_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("customercode/isexist")]
        public async Task<ActionResult> CustomerCodeExist(string? CustomerCode)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customer_code_exist_check";
                var parameters = new DynamicParameters();
                parameters.Add("CustomerCode", CustomerCode);
                parameters.Add("CodeExist", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isCustomerCodeExist = parameters.Get<int>("CodeExist");

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsCustomerCodeExist = Convert.ToBoolean(isCustomerCodeExist)
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
                            new ExceptionHandler(ex,"customer_management_customer_code_not_found", _logService).GetMessage()+ex
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("customername/exist/list")]
        public async Task<ActionResult> GetExistingCustomerNames(string? Name)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customer_name_exist_list";
                var parameters = new DynamicParameters();
                parameters.Add("Name", Name);
                var existingCustomerDetails = await connection.QueryAsync<ExistingCustomerDetails>(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ExistingCustomerDetails = existingCustomerDetails
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
                            new ExceptionHandler(ex,"customer_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/all/customercontracts")]
        public async Task<ActionResult> GetAllCustomerContracts(int CustomerId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customer_contract_list";
                var parameters = new DynamicParameters();
                parameters.Add("CustomerId", CustomerId);
                var contracts = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        Contracts = contracts
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
                            new ExceptionHandler(ex,"customer_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("update/details")]
        public async Task<ActionResult<CustomerUpdateDetails>> GetSelectedCustomerDetails(int CustomerId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customer_edit_details";
                var parameters = new DynamicParameters();
                parameters.Add("CustomerId", CustomerId);
                var customerDetails = await connection.QueryAsync<CustomerUpdateDetails>(procedure, parameters, commandType: CommandType.StoredProcedure); return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        CustomerDetails = customerDetails.First()
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
                            new ExceptionHandler(ex,"customer_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/locationwise/names")]
        public async Task<ActionResult> GetLocationwiseContractCustomers(int TenantOfficeId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customerinfo_locationwise_getnames";
                var parameters = new DynamicParameters();
                parameters.Add("TenantOfficeId", TenantOfficeId);
                var customers = await Connection.QueryAsync(procedure,parameters, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { CustomersList = customers } };
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
                            new ExceptionHandler(ex,"customer_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/names/by/locationgroupfilter")]
        [Authorize()]
        public async Task<ActionResult> GetCustomersByRegionOfficeGroupFilter( int? TenantOfficeId, int? CustomerGroupId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customer_get_names_location_group_filter";
                var parameters = new DynamicParameters();
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("CustomerGroupId", CustomerGroupId);
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var customers = await Connection.QueryAsync(procedure,parameters, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { CustomerNamesByFilter = customers } };
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
                            new ExceptionHandler(ex,"customer_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize()]
        [Route("delete")]
        [HasPermission(CustomerBusinessFunctionCode.CUSTOMER_CREATE)]
        public async Task<object> DeleteCustomer(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "customer_delete";
                var parameters = new DynamicParameters();
                parameters.Add("CustomerId", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isRestricted = parameters.Get<int>("IsRestricted");
                if (isRestricted == 1)
                {
                    throw new CustomException("customer_deleted_transaction_failure_message");
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
                           new ExceptionHandler(ex,"customer_deleted_failure_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}