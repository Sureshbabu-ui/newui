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
    [Route("api/einvoice")]
    [ApiController]
    public class EInvoiceController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public EInvoiceController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize()]
        [Route("list")]
        public async Task<object> GetEInvoices(int Page, string? Search)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<EInvoiceList> eInvoiceList = await GetEInvoiceList(connection, Page, Search);
                int totalRows = await GetEInvoiceCount(connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        EInvoiceList = eInvoiceList,
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
                            new ExceptionHandler(ex,"einvoicelist_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<EInvoiceList>> GetEInvoiceList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "einvoice_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var collectionList = await Connection.QueryAsync<EInvoiceList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return collectionList;
        }
        private async Task<int> GetEInvoiceCount(SqlConnection Connection, string? Search)
        {
            var procedure = "einvoice_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("fetchsalesregisterreturnresponse")]
        public async Task<object> FetchSalesRegisterResponseFromGst()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();
            using var transaction = connection.BeginTransaction();
            try
            {
                var responsePendingInvoices = await getResponsePendingInvoiceNumberList(connection, transaction);
               var list= await GetSalesRegisterResponseFromGst(responsePendingInvoices);
                await InsertIntoSalesResponse(connection, transaction, list);
                transaction.Commit(); 
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsGstInvoiceFetched = true
                    }
                }));
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                    new ExceptionHandler(ex, "Failed to fetch", _logService).GetMessage()+ex
                }
                    }
                }));
            }
        }

        private async Task<String> getResponsePendingInvoiceNumberList(SqlConnection Connection, SqlTransaction transaction)
        {
            var procedure = "salesregisterheader_get_responsepending_invoicenos";
            var parameters = new DynamicParameters();
            parameters.Add("@InvoiceNos", dbType: DbType.String,size:8000, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters,transaction, commandType: CommandType.StoredProcedure);
            return parameters.Get<String>("@InvoiceNos");
        }

        private async Task<IEnumerable<SalesRegisterReturnResponse>> GetSalesRegisterResponseFromGst(string InvoiceNos)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("EInvoiceConnection"));
            var procedure = "besure_einvoice_salesregisterreturnresponse_list";
            var parameters = new DynamicParameters();
            parameters.Add("InvoiceNos", InvoiceNos);
            var collectionList = await connection.QueryAsync<SalesRegisterReturnResponse>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return collectionList;
        }

        private async Task<object> InsertIntoSalesResponse(SqlConnection connection,SqlTransaction transaction,IEnumerable<SalesRegisterReturnResponse> responseList)
        {
            var procedure = "salesregisterreturnresponse_create";
            var parameters = new DynamicParameters();
            //TODOS: Since it doesnt have authentication createdby is hard coded
            parameters.Add("CreatedBy",9);
            parameters.Add("ResponseList", JsonSerializer.Serialize(responseList.ToList()));
            await connection.QueryAsync(procedure, parameters,transaction, commandType: CommandType.StoredProcedure);
            return Ok(JsonSerializer.Serialize(new
            {
                status = StatusCodes.Status200OK,
                data = new
                {
                    IsContractInvoiceCreated = true
                }
            }));
        }
    }
}
