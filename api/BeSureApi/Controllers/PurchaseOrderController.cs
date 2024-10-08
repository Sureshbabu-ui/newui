using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Models;
using Microsoft.VisualBasic;
using BeSureApi.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Services;
using BeSureApi.Helpers;

namespace BeSureApi.Controllers
{
    [Route("api/purchaseorder")]
    [ApiController]
    public class PurchaseOrderController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IPdfService _pdfService;

        public PurchaseOrderController(IConfiguration config, ILogService logService, IPdfService pdfService)
        {
            _config = config;
            _logService = logService;
            _pdfService = pdfService;
        }

        [HttpGet, Authorize()]
        [Route("list"), HasPermission(PurchaseOrderBusinessFunctionCode.PURCHASEORDER_VIEW)]
        public async Task<ActionResult<List<PurchaseOrders>>> GetPurchaseOrders(int Page, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PurchaseOrders> polist = await GetPurchaseOrdersList(Connection, Page, Search);
                int totalRows = await GetAllPurchaseOrdersCount(Connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PurchaseOrders = polist,
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
                        message = new[] {
                            new ExceptionHandler(ex,"purchaseorders_list_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PurchaseOrders>> GetPurchaseOrdersList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "purchaseorder_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            var polist = await Connection.QueryAsync<PurchaseOrders>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return polist;
        }
        private async Task<int> GetAllPurchaseOrdersCount(SqlConnection Connection, string? Search)
        {
            var procedure = "purchaseorder_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize]
        [Route("create"),HasPermission(PartIndentDemandBusinessFunctionCode.PARTINDENTDEMAND_CREATEPO)]
        public async Task<ActionResult<PurchaseOrderCreate>> CreatePurchaseOrder(PurchaseOrderCreate createpo)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "purchaseorder_create";
                var parameters = new DynamicParameters();
                parameters.Add("Description", createpo.Description);
                parameters.Add("TenantOfficeId", createpo.TenantOfficeId);
                parameters.Add("ShipToTenantOfficeInfoId", createpo.ShipToTenantOfficeInfoId);
                parameters.Add("ShipToCustomerSiteId", createpo.ShipToCustomerSiteId);
                parameters.Add("BillToTenantOfficeInfoId", createpo.BillToTenantOfficeInfoId);
                parameters.Add("VendorId", createpo.VendorId);
                parameters.Add("PartIndentRequestId", createpo.PartIndentRequestId);
                parameters.Add("DemandId", createpo.DemandId);
                parameters.Add("PartId", createpo.PartId);
                parameters.Add("VendorBranchId", createpo.VendorBranchId);
                parameters.Add("CgstRate", createpo.CgstRate);
                parameters.Add("SgstRate", createpo.SgstRate);
                parameters.Add("IgstRate", createpo.IgstRate);
                parameters.Add("Price", createpo.Price);
                parameters.Add("StockTypeId", createpo.StockTypeId);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await Connection.QueryAsync<PurchaseOrderCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPOCreated = true
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
                            new ExceptionHandler(ex,"purchase_order_create_failed_message",_logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet("generatepdf"),HasPermission(PartIndentDemandBusinessFunctionCode.PARTINDENTDEMAND_DOWNLOADPO)]
        public async Task<object> GeneratePurchaseOrder(int PoId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                byte[] purchaseOrderPdf = _pdfService.GeneratePdf(container => PdfTemplates.PurchaseOrderPdfTemplate.Create(container));
                return File(purchaseOrderPdf, "application/pdf", "purchaseOrderPdf.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        message = new[] {
                            new ExceptionHandler(ex,"purchase_order_generate_pdf_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        [HttpGet, Authorize]
        [Route("cwh/tenantoffice/list")]
        public async Task<ActionResult> CwhTenantOfficeList()
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "tenant_office_getnames_for_cwh";
                var parameters = new DynamicParameters();
                parameters.Add("UserId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                var tenantOfficeName = await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        TenantOfficeName = tenantOfficeName
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
                            new ExceptionHandler(ex,"usermanagement_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize]
        [Route("locationwise/list")]
        public async Task<ActionResult<List<PurchaseOrderList>>> GetLocationWisePurchaseOrders(int Page, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PurchaseOrderList> polist = await GetPurchaseOrderList(Connection, Page, Search);
                int totalRows = await GetPurchaseOrderCount(Connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PurchaseOrders = polist,
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
                        message = new[] {
                            new ExceptionHandler(ex,"purchaseorders_list_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PurchaseOrderList>> GetPurchaseOrderList(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "purchaseorder_locationwise_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            var polist = await Connection.QueryAsync<PurchaseOrderList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return polist;
        }
        private async Task<int> GetPurchaseOrderCount(SqlConnection Connection, string? Search)
        {
            var procedure = "purchaseorder_locationwise_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet, Authorize()]
        [Route("details"), HasPermission(PurchaseOrderBusinessFunctionCode.PURCHASEORDER_VIEW)]
        public async Task<ActionResult<PurchaseOrderDetail>> GetPurchaseOrderDetails(int PoId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "purchaseorder_details";
                var parameters = new DynamicParameters();
                parameters.Add("PoId", PoId);
                var podetails = await connection.QueryAsync< PurchaseOrderDetail>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PurchaseOrderDetails = podetails
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
                            new ExceptionHandler(ex,"purchaseorder_details_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize]
        [Route("imprest/create")]
        [ HasPermission(PurchaseOrderBusinessFunctionCode.IMPRESTPURCHASEORDER_MANAGE)]
        public async Task<ActionResult<ImprestPurchaseOrderCreate>> CreateImprestPurchaseOrder(ImprestPurchaseOrderCreate imprestpo)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "purchaseorder_bulk_create";
                var parameters = new DynamicParameters();
                parameters.Add("Description", imprestpo.Description);
                parameters.Add("ShipToTenantOfficeInfoId", imprestpo.ShipToTenantOfficeInfoId);
                parameters.Add("BillToTenantOfficeInfoId", imprestpo.BillToTenantOfficeInfoId);
                parameters.Add("PartList", JsonSerializer.Serialize(imprestpo.PartList));
                parameters.Add("VendorBranchId", imprestpo.VendorBranchId);
                parameters.Add("VendorId", imprestpo.VendorId);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await Connection.QueryAsync<ImprestPurchaseOrderCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPOCreated = true
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
                            new ExceptionHandler(ex,"imprest_purchase_order_create_failed_message",_logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize]
        [Route("bulk/create")]
        [HasPermission(PartIndentDemandBusinessFunctionCode.PARTINDENTDEMAND_CREATEPO)]
        public async Task<ActionResult<BulkPurchaseOrderCreate>> CreatePurchaseOrderForMultiDemands(BulkPurchaseOrderCreate imprestpo)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "purchaseorder_create_for_multi_demands";
                var parameters = new DynamicParameters();
                parameters.Add("Description", imprestpo.Description);
                parameters.Add("ShipToTenantOfficeInfoId", imprestpo.ShipToTenantOfficeInfoId);
                parameters.Add("BillToTenantOfficeInfoId", imprestpo.BillToTenantOfficeInfoId);
                parameters.Add("PartList", JsonSerializer.Serialize(imprestpo.PartList));
                parameters.Add("VendorBranchId", imprestpo.VendorBranchId);
                parameters.Add("VendorId", imprestpo.VendorId);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await Connection.QueryAsync<BulkPurchaseOrderCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPOCreated = true
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
                            new ExceptionHandler(ex,"imprest_purchase_order_create_failed_message",_logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
