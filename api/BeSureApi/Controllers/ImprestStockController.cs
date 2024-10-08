using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using System.Transactions;

namespace BeSureApi.Controllers
{
    [Route("api/impreststock")]
    [ApiController]
    public class ImprestStockController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ImprestStockController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpPost, Authorize()]
        [Route("create/for/customer")]
        [HasPermission(ImprestStockBusinessFunctionCode.IMPRESTSTOCK_MANAGE)]
        public async Task<object> CreateImprestStockForCustomer(ImprestStockCreate impreststockdata)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            connection.Open();
            using (var transaction = connection.BeginTransaction())
            try
            {
                var procedure = "impreststock_create_for_customer";
                var parameters = new DynamicParameters();
                parameters.Add("CustomerId", impreststockdata.impreststock.CustomerId);
                parameters.Add("ContractId", impreststockdata.impreststock.ContractId);
                parameters.Add("CustomerSiteId", impreststockdata.impreststock.CustomerSiteId);
                parameters.Add("ServiceEngineerId", impreststockdata.impreststock.ServiceEngineerId);
                parameters.Add("PartStockIdList", JsonSerializer.Serialize(impreststockdata.impreststock.PartStockIdList));
                parameters.Add("Remarks", impreststockdata.impreststock.Remarks);
                parameters.Add("ReservedFrom", impreststockdata.impreststock.ReservedFrom);
                parameters.Add("ReservedTo", impreststockdata.impreststock.ReservedTo);
                parameters.Add("IsCustomerSite", impreststockdata.impreststock.IsCustomerSite);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<ImprestStock>(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);

                if (impreststockdata.impreststock.IsbyCourier == "ISC_BCER" && impreststockdata.deliverychallan != null)
                {
                    procedure = "deliverychallan_create";
                    parameters = new DynamicParameters();
                    parameters.Add("DcTypeId", impreststockdata.deliverychallan.DcTypeId);
                    parameters.Add("PartIndentDemandNumber", impreststockdata.deliverychallan.PartIndentDemandNumber);
                    parameters.Add("DestinationTenantOfficeId", impreststockdata.deliverychallan.DestinationTenantOfficeId);
                    parameters.Add("DestinationCustomerSiteId", impreststockdata.deliverychallan.DestinationCustomerSiteId);
                    parameters.Add("DestinationVendorId", impreststockdata.deliverychallan.DestinationVendorId);
                    parameters.Add("DestinationEmployeeId", impreststockdata.deliverychallan.DestinationEmployeeId);
                    parameters.Add("LogisticsVendorId", impreststockdata.deliverychallan.LogisticsVendorId);
                    parameters.Add("LogisticsReceiptDate", impreststockdata.deliverychallan.LogisticsReceiptDate);
                    parameters.Add("LogisticsReceiptNumber", impreststockdata.deliverychallan.LogisticsReceiptNumber);
                    parameters.Add("ModeOfTransport", impreststockdata.deliverychallan.ModeOfTransport);
                    parameters.Add("TrackingId", impreststockdata.deliverychallan.TrackingId);
                    parameters.Add("PartStockData", JsonSerializer.Serialize(impreststockdata.deliverychallan.partstocks));
                    parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                    parameters.Add("@DeliveryChallanId", dbType: DbType.Int32, direction: ParameterDirection.Output);

                    await connection.QueryAsync<DeliveryChallan>(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                    int DeliveryChallanId = parameters.Get<int>("@DeliveryChallanId");
                }
                transaction.Commit();
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsImprestStockCreated = true
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
                            new ExceptionHandler(ex, "failed_to_create_impreststock", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
