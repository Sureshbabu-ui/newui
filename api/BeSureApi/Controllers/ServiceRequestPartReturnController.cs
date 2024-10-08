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
    [Route("api/servicerequest/partreturn")]
    [ApiController]
    public class ServiceRequestPartReturnController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ServiceRequestPartReturnController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet, Authorize()]
        [Route("list")]
        public async Task<ActionResult<List<PartReturnList>>> GetServieRequestPartReturnList(int ServiceRequestId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partreturn_list_by_servicerequest";
                var parameters = new DynamicParameters();
                parameters.Add("@ServiceRequestId", ServiceRequestId);
                var partreturns = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ReturnList= partreturns
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
                            new ExceptionHandler(ex,"partreturn_not_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost, Authorize]
       [Route("create")]
        public async Task<ActionResult<PartReturnCreate>> CreatePartReturn(PartReturnCreate PartReturn)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "partreturn_create";
                var parameters = new DynamicParameters();
                parameters.Add("ServiceRequestId", PartReturn.ServiceRequestId);
                parameters.Add("ReturnedPartTypeId", PartReturn.ReturnedPartTypeId);
                parameters.Add("PartId", PartReturn.PartId);
                parameters.Add("PartStockId", PartReturn.PartStockId);
                parameters.Add("SerialNumber", PartReturn.PartInfoType == "serialnumber" ? PartReturn.PartInfoData : null);
                parameters.Add("Barcode", PartReturn.PartInfoType == "barcode" ? PartReturn.PartInfoData : null);
                parameters.Add("WarrantyEndDate", PartReturn.WarrantyEndDate);
                parameters.Add("ReturnRemarks", PartReturn.ReturnRemarks);
                parameters.Add("ReturnInitiatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
             
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsPartReturnCreated = true
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
                            new ExceptionHandler(ex,"part_return_create_failed_message",_logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet,Authorize()]
        [Route("list/for/grn")]
        public async Task<ActionResult<List<PartReturnListForGrn>>> GetAllPartReturn(int Page, string? Search)
        {
            using var Connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<PartReturnListForGrn> partreturnlist = await GetPartReturnListForGrn(Connection, Page, Search);
                int totalRows = await GetPartReturnCountForGrn(Connection, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        PartReturnList = partreturnlist,
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
                            new ExceptionHandler(ex,"part_return_no_data_found", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<PartReturnListForGrn>> GetPartReturnListForGrn(SqlConnection Connection, int Page, string? Search)
        {
            var procedure = "partreturn_locationwise_list";
            var parameters = new DynamicParameters();
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            var partreturnlist = await Connection.QueryAsync<PartReturnListForGrn>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return partreturnlist;
        }
        private async Task<int> GetPartReturnCountForGrn(SqlConnection Connection, string? Search)
        {
            var procedure = "partreturn_locationwise_count";
            var parameters = new DynamicParameters();
            parameters.Add("Search", Search);
            parameters.Add("UserInfoId", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
            parameters.Add("TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

    }
}
