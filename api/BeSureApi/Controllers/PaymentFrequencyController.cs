using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;

namespace BeSureApi.Controllers
{
    [Route("api/paymentfrequency")]
    [ApiController]
    public class PaymentFrequencyController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public PaymentFrequencyController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }
        
        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(MasterDataBusinessFunctionCode.PAYMENTFREQUENCY_MANAGE)]
        public async Task<object> CreatePaymentFrequency(PaymentFrequencyCreate PaymentFrequencyObj)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "paymentfrequency_create";
                var parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("Name", PaymentFrequencyObj.Name);
                parameters.Add("Code", PaymentFrequencyObj.Code);
                parameters.Add("CalendarMonths", PaymentFrequencyObj.CalendarMonths);
                parameters.Add("IsActive", PaymentFrequencyObj.IsActive == "1" ? true : false);
                await connection.QueryAsync<PaymentFrequency>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPaymentFrequencyCreated = true
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
                            new ExceptionHandler(ex,"paymentFrequency_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet]
        [Route("list")]
        [HasPermission(MasterDataBusinessFunctionCode.PAYMENTFREQUENCY_VIEW)]
        public async Task<object> GetPaymentFrequencys(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PaymentFrequency> paymentFrequencyList = await GetPaymentFrequencyList(connection, Page, Search);
                int totalRows = await GetPaymentFrequencyCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PaymentFrequencyList = paymentFrequencyList,
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
                            new ExceptionHandler(ex,"paymentfrequencylist_no_records_found_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<PaymentFrequency>> GetPaymentFrequencyList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "paymentfrequency_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var paymentFrequencyList = await Connection.QueryAsync<PaymentFrequency>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return paymentFrequencyList;
        }

        private async Task<int> GetPaymentFrequencyCount(SqlConnection Connection, string? Search)
        {
            var procedure = "paymentfrequency_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }


        [HttpGet,Authorize()]
        [Route("get/names")]
        public async Task<ActionResult> GetPaymentFrequencyNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "paymentfrequency_get_names";
                var paymentFrequencyNames = await Connection.QueryAsync(procedure, commandType: CommandType.StoredProcedure);

                var response = new { status = StatusCodes.Status200OK, data = new { PaymentFrequencies = paymentFrequencyNames } };
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
                            new ExceptionHandler(ex,"paymentfrequencylist_no_records_found_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.PAYMENTFREQUENCY_MANAGE)]
        public async Task<object> EditPaymentFrequency(PaymentFrequencyEdit PaymentFrequencyObj)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "common_is_existing";
                var parameters = new DynamicParameters();
                parameters.Add("TableName", "PaymentFrequency");
                parameters.Add("ColumnName", "Name");
                parameters.Add("Value", PaymentFrequencyObj.Name);
                parameters.Add("Id", PaymentFrequencyObj.Id);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    ModelState.AddModelError("Name", "payment_frequency_name_exists_message");
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
                procedure = "paymentfrequency_update";
                parameters = new DynamicParameters();
                parameters.Add("Id", PaymentFrequencyObj.Id);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("Name", PaymentFrequencyObj.Name);
                parameters.Add("CalendarMonths", PaymentFrequencyObj.CalendarMonths);
                parameters.Add("IsActive", PaymentFrequencyObj.IsActive == "1" ? true : false);
                await connection.QueryAsync<PaymentFrequencyEdit>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPaymentFrequencyUpdated = true
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
                            new ExceptionHandler(ex,"paymentFrequency_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.PAYMENTFREQUENCY_MANAGE)]
        public async Task<object> DeletePaymentFrequency(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "paymentfrequency_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("paymentfrequency_delete_restricted_message");
                }
                 return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPaymentFrequencyDeleted = true
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
                           new ExceptionHandler(ex,"paymentfrequency_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}