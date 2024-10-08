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
using static BeSureApi.Models.PartIndent;
using Microsoft.AspNetCore.Mvc.RazorPages;
using BeSureApi.Helpers;

namespace BeSureApi.Controllers
{
    [Route("api/partindent")]
    [ApiController]
    public class PartIndentController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public PartIndentController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("approval/list")]
        [HasPermission(PartIndentBusinessFunctionCode.PARTINDENT_APPROVAL)]
        public async Task<ActionResult<List<PartIndentList>>> GellAllApproavlPartIndentRequests(int Page, string? Search,int? AssetProductCategoryId)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PartIndentList> partIndentRequests = await GetApprovalPartIndentRequestList(Connection, Page, Search, AssetProductCategoryId);
                int totalRows = await GetApprovalPartIndentRequestCount(Connection, Search, AssetProductCategoryId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartIndentRequestList = partIndentRequests,
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
                            new ExceptionHandler(ex,"partindent_management_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PartIndentList>> GetApprovalPartIndentRequestList(SqlConnection Connection, int Page, string? Search, int? AssetProductCategoryId)
        {
            var procedure = "partindentrequest_approval_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("AssetProductCategoryId", AssetProductCategoryId);
            var partIndentList = await Connection.QueryAsync<PartIndentList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return partIndentList;
        }
        private async Task<int> GetApprovalPartIndentRequestCount(SqlConnection Connection, string? Search,int? AssetProductCategoryId)
        {
            var procedure = "partindentrequest_approval_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("AssetProductCategoryId", AssetProductCategoryId);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize()]
        [Route("sme/review"),HasPermission(PartIndentBusinessFunctionCode.PARTINDENT_APPROVAL)]
        public async Task<ActionResult> SmePartIndentApprove(SmeApproveDetails approvedetails)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentrequestdetail_for_review";
                var parameters = new DynamicParameters();
                parameters.Add("Id", approvedetails.Id);
                var partindentrequestdetail = (await connection.QueryAsync<PartIndentRequestDetail>(procedure, parameters, commandType: CommandType.StoredProcedure)).FirstOrDefault();
                if (partindentrequestdetail != null)
                {
                    procedure = "partindentrequestdetail_review";
                    parameters = new DynamicParameters();
                    parameters.Add("Id", approvedetails.Id);
                    parameters.Add("RequestStatus", approvedetails.RequestStatus);
                    parameters.Add("PartId", partindentrequestdetail.PartId);
                    parameters.Add("IndentRequestNumber", partindentrequestdetail.IndentRequestNumber);
                    parameters.Add("TenantOfficeId", partindentrequestdetail.TenantOfficeId);
                    parameters.Add("Quantity", partindentrequestdetail.Quantity);
                    parameters.Add("StockTypeId", approvedetails.StockTypeId);
                    parameters.Add("WorkOrderNumber", partindentrequestdetail.WorkOrderNumber);
                    parameters.Add("ReviewerComments", approvedetails.ReviewerComments);
                    parameters.Add("ReviewedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);

                    await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                }
                return Ok(
                    JsonSerializer.Serialize(new
                    {
                        status = StatusCodes.Status200OK,
                        data = new
                        {
                            IsReviewed = true
                        }
                    })
                  );
                }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        Message = new[] {
                            new ExceptionHandler(ex,"sme_approve_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet,Authorize()]
        [HasPermission(ServiceRequestBusinessFunctionCode.SERVICE_REQUEST_DETAILS)]
        [Route("contract/{ContractId}/get/dashboard/count")]
        public async Task<ActionResult> GetContractPartIndentSummaryCount(int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindent_summary_count_by_contract";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractId);
                var countDetail = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = countDetail.First()
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
                            new ExceptionHandler(ex,"partindent_summary_details_error", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize]
        [Route("requestdetail"), HasPermission(PartIndentBusinessFunctionCode.PARTINDENT_APPROVAL)]
        public async Task<ActionResult> GetPartRequestDetails(int PartIndentRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentrequest_detail_for_sme";
                var parameters = new DynamicParameters();
                parameters.Add("@PartIndentRequestId", PartIndentRequestId);
                var partrequestInfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                procedure = "partindentrequest_selected_detail_for_sme";
                parameters = new DynamicParameters();
                parameters.Add("@PartIndentRequestId", PartIndentRequestId);
                var selectedPartIndentInfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartRequestInfo = partrequestInfo,
                        SelectedPartIndentInfo = selectedPartIndentInfo.FirstOrDefault()
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
                            new ExceptionHandler(ex,"part_request_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet, Authorize]
        [Route("request/stock/availability"), HasPermission(PartIndentBusinessFunctionCode.PARTINDENT_APPROVAL)]
        public async Task<ActionResult> GetPartRequestStockAvailabilityDetails(int PartIndentRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentrequest_stock_availablity_locationwise";
                var parameters = new DynamicParameters();
                parameters.Add("@PartIndentRequestId", PartIndentRequestId);
                var partrequestStockLocationWiseAvailability = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);

                procedure = "partindentrequest_stock_availablity_list";
                parameters = new DynamicParameters();
                parameters.Add("@PartIndentRequestId", PartIndentRequestId);
                var PartRequestStockAvailability = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartRequestAvailability = PartRequestStockAvailability,
                        PartRequestLocationWiseAvailability = partrequestStockLocationWiseAvailability
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
                            new ExceptionHandler(ex,"part_request_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
       
        [HttpPost]
        [Route("request/update"), HasPermission(PartIndentBusinessFunctionCode.PARTINDENT_APPROVAL)]
        public async Task<object> PartIntendRequestUpdate(PartIndentRequestUpdate partIndentRequestUpdate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partintendrequest_update";
                var parameters = new DynamicParameters();
                parameters.Add("Id", partIndentRequestUpdate.Id);
                parameters.Add("PartCode", partIndentRequestUpdate.PartCode);
                parameters.Add("Quantity", partIndentRequestUpdate.Quantity);
                parameters.Add("IsWarrantyReplacement", partIndentRequestUpdate.IsWarrantyReplacement);
                parameters.Add("StockTypeId", partIndentRequestUpdate.StockTypeId);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsUpdated", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isUpdated = parameters.Get<bool>("IsUpdated");
                if (!isUpdated)
                {
                    new CustomException("partindentrequest_update_partcode_validation");
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPartRequestUpdated = isUpdated
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
                            new ExceptionHandler(ex, "partintend_update_failed", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("getalldetails")]
        public async Task<ActionResult<PartIndentRequestDetailsListForSme>> GetAllPartIndentRequestDetails(int Page,string? ReqStatus)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentrequestdetail_list_by_status";
                var parameters = new DynamicParameters();
                parameters.Add("ReqStatus", ReqStatus);
                parameters.Add("Page", Page);
                var PartIndentRequestDetails = await connection.QueryAsync<PartIndentRequestDetailsListForSme>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int totalRows = await GetAllPartIndentRequestDetailsCount(connection, ReqStatus);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartIndentRequestDetailsList = PartIndentRequestDetails,
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
                            new ExceptionHandler(ex,"partindentrequestdetail_forsme_list_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<int> GetAllPartIndentRequestDetailsCount(SqlConnection Connection,string ? ReqStatus)
        {
            var procedure = "partindentrequestdetail_count_by_status";
            var parameters = new DynamicParameters();
            parameters.Add("ReqStatus", ReqStatus);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpGet]
        [Route("getstatuscount")]
        public async Task<ActionResult<PartIndentRequestStatusCountForSme>> GetAllPartIndentRequestStatusCount()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentrequestdetail_get_status_count";
                var parameters = new DynamicParameters();
                var PartIndentRequestStatusCount = await connection.QueryAsync<PartIndentRequestStatusCountForSme>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartIndentStatusCount = PartIndentRequestStatusCount,                     
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
                            new ExceptionHandler(ex,"partindentrequeststatus_count_forsme_list_nodata", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("get/detailforsme")]
        public async Task<ActionResult> GetPartRequestCommonDetails(int PartIndentRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partindentrequest_selected_detail_for_sme";
                var parameters = new DynamicParameters();
                parameters.Add("@PartIndentRequestId", PartIndentRequestId);
                var selectedPartIndentInfo = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        SelectedPartIndentInfo = selectedPartIndentInfo.FirstOrDefault()
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
                            new ExceptionHandler(ex,"partindentrequesinfo_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

    }
}
