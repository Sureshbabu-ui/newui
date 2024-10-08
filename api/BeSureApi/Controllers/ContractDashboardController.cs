using BeSureApi.Exceptions;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Services.LogService;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/contractdashboard")]
    [ApiController]
    public class ContractDashboardController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public ContractDashboardController(IConfiguration configuration,ILogService logService)
        {
            _config = configuration;
            _logService = logService;
        }

        [HttpGet]
        [Route("contractsbooked")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_DASHBOARD_BOOKINGDETAIL_VIEW)]

        public async Task<ActionResult>GetContractsBooked(string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractdashboard_contractsbooked_info";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("TotalCount", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int Count = parameters.Get<int>("TotalCount");

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TotalCount = Count
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
                            new ExceptionHandler(ex,"contract_dashboard_contracts_booked_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("collectionmade")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_DASHBOARD_INVOICECOLLECTION_MADE_VIEW)]

        public async Task<ActionResult> GetInvoiceCollectionMade(string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractdashboard_collectionmade_info";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("TotalCollectedAmount", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int TotalCollectedAmount = parameters.Get<int>("TotalCollectedAmount");

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TotalAmount = TotalCollectedAmount
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
                            new ExceptionHandler(ex,"contract_dashboard_collections_made_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("pendinginvoices")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_DASHBOARD_INVOICECOLLECTION_PENDING_VIEW)]

        public async Task<ActionResult> GetPendingInvoices(string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractdashboard_pendinginvoices_info";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int Count = parameters.Get<int>("@TotalRows");

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TotalCount = Count
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
                            new ExceptionHandler(ex,"contract_dashboard_invoices_pending_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("raisedinvoices")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_DASHBOARD_INVOICES_RAISED_VIEW)]

        public async Task<ActionResult> GetRaisedInvoices(string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractdashboard_raisedinvoices_info";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int Count = parameters.Get<int>("@TotalRows");

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TotalCount = Count
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
                            new ExceptionHandler(ex,"contract_dashboard_invoices_raised_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("collection/outstanding")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_DASHBOARD_INVOICECOLLECTION_OUTSTANDING_VIEW)]

        public async Task<ActionResult> GetInvoiceCollectionOutstanding(string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractdashboard_collectionoutstanding_info";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("TotalOutstandingAmount", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int TotalOutstandingAmount = parameters.Get<int>("TotalOutstandingAmount");

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TotalAmount = TotalOutstandingAmount
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
                            new ExceptionHandler(ex,"contract_dashboard_collections_outstanding_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("revenuerecognition")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_DASHBOARD_REVENUERECOGNITION_VIEW)]

        public async Task<ActionResult> GetRevenueRecognition(string? DateFrom, string? DateTo, int? TenantRegionId, int? TenantOfficeId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractdashboard_revenurecognition_info";
                var parameters = new DynamicParameters();
                parameters.Add("DateFrom", DateFrom);
                parameters.Add("DateTo", DateTo);
                parameters.Add("TenantRegionId", TenantRegionId);
                parameters.Add("TenantOfficeId", TenantOfficeId);
                parameters.Add("TotalValue", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int Value = parameters.Get<int>("TotalValue");

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TotalValue = Value
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
                            new ExceptionHandler(ex,"contract_dashboard_revenue_recognition_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
