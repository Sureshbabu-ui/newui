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
using BeSureApi.Models;

namespace BeSureApi.Controllers
{
    [Route("api/invoiceprerequisite")]
    [ApiController]
    public class InvoicePrerequisiteController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public InvoicePrerequisiteController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("list")]     
        [HasPermission(MasterDataBusinessFunctionCode.INVOICEPREREQUISITE_VIEW)]
        public async Task<ActionResult<List<InvoicePrerequisiteList>>> GetInvoicePrerequisites(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<InvoicePrerequisiteList> InvoicePrerequisiteList = await GetInvoicePrerequisiteList(connection, Page, Search);
                int totalRows = await GetInvoicePrerequisiteCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        InvoicePrerequisites = InvoicePrerequisiteList,
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
                            new ExceptionHandler(ex,"invoiceprerequisitelist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<InvoicePrerequisiteList>> GetInvoicePrerequisiteList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "invoiceprerequisite_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var InvoicePrerequisiteList = await Connection.QueryAsync<InvoicePrerequisiteList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return InvoicePrerequisiteList;
        }
        private async Task<int> GetInvoicePrerequisiteCount(SqlConnection Connection, string? Search)
        {
            var procedure = "invoiceprerequisite_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize()]
        [HasPermission(MasterDataBusinessFunctionCode.INVOICEPREREQUISITE_MANAGE)]
        [Route("create")]
        public async Task<object> CreateInvoicePrerequisite(InvoicePrerequisiteCreate InvoicePrerequisiteObj)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var columns = new Dictionary<string, string>()
                {
                    { "DocumentCode", "Document Code" },
                    { "DocumentName", "Document Name" }
                };
                var uniquecheckprocedure = "common_is_existing";
                var uniquecheckparameters = new DynamicParameters();
                uniquecheckparameters.Add("TableName", "InvoicePrerequisite");
                List<string> errorMessages = new List<string>(); // Store the error messages
                foreach (var columnName in columns.Keys)
                {
                    uniquecheckparameters.Add("ColumnName", columnName);

                    if (columnName == "DocumentCode")
                    {
                        uniquecheckparameters.Add("Value", InvoicePrerequisiteObj.DocumentCode);
                    }
                    else if (columnName == "DocumentName")
                    {
                        uniquecheckparameters.Add("Value", InvoicePrerequisiteObj.DocumentName);
                    }
                    uniquecheckparameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    var result = await connection.QueryAsync(uniquecheckprocedure, uniquecheckparameters, commandType: CommandType.StoredProcedure);

                    int count = uniquecheckparameters.Get<int>("Count");
                    if (count > 0)
                    {
                        errorMessages.Add(columns[columnName] + " already exists.");
                    }
                }
                if (errorMessages.Count > 0)
                {
                    throw new CustomException(string.Join(", ", errorMessages));
                }
                var procedure = "invoiceprerequisite_create";
                var parameters = new DynamicParameters();
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("DocumentName", InvoicePrerequisiteObj.DocumentName);
                parameters.Add("DocumentCode", InvoicePrerequisiteObj.DocumentCode);
                parameters.Add("Description", InvoicePrerequisiteObj.Description);
                parameters.Add("IsActive", InvoicePrerequisiteObj.IsActive);
                await connection.QueryAsync<object>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsInvoicePrerequisiteCreated = true
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
                            new ExceptionHandler(ex,"invoiceprerequisitecreate_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/all")]
        public async Task<ActionResult> GetAllInvoicePrerequisiteNames()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "invoiceprerequisite_get_all";
                var parameters = new DynamicParameters();
                var invoicePrerequisites = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        InvoicePrerequisites = invoicePrerequisites
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
                            new ExceptionHandler(ex,"invoiceprerequisitelist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }


        [HttpPut, Authorize()]
        [Route("update")]
        [HasPermission(MasterDataBusinessFunctionCode.INVOICEPREREQUISITE_MANAGE)]
        public async Task<object> InvoicePrerequisiteUpdate(InvoicePrerequisiteUpdate invoicePrerequisite)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "invoiceprerequisite_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", invoicePrerequisite.Id);
                parameters.Add("IsActive", invoicePrerequisite.IsActive);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsInvoicePrerequisiteUpdated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isInvoicePrerequisiteUpdated = parameters.Get<int>("@IsInvoicePrerequisiteUpdated");
                if (isInvoicePrerequisiteUpdated == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsInvoicePrerequisiteUpdated = Convert.ToBoolean(isInvoicePrerequisiteUpdated)
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
                            new ExceptionHandler(ex,"invoiceprerequisitecreate_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("delete")]
        [HasPermission(MasterDataBusinessFunctionCode.INVOICEPREREQUISITE_MANAGE)]
        public async Task<object> DeleteInvoicePrerequisite(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "invoiceprerequisite_delete";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                parameters.Add("DeletedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsRestricted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isRestricted = parameters.Get<bool>("IsRestricted");
                if (isRestricted == true)
                {
                    throw new CustomException("invoiceprerequisite_delete_restricted_message");
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
                           new ExceptionHandler(ex,"invoiceprerequisite_delete_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
