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
using static Org.BouncyCastle.Math.EC.ECCurve;
using BeSureApi.Models;

namespace BeSureApi.Controllers
{
    [Route("api/contract/assetsummary")]
    [ApiController]
    public class ContractAssetSummaryController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;

        public ContractAssetSummaryController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("list")]
        public async Task<ActionResult<List<ContractAssetSummaryList>>> GetContractAssetsSummaryList(int Page, string? Search,int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ContractAssetSummaryList> contractAssetsSummaryList = await GetAssetsSummaryList(connection, Page, Search, ContractId);
                int totalRows = await GetAssetsSummaryCount(connection, Page,Search,ContractId);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractAssetsSummaryList = contractAssetsSummaryList,
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
                            new ExceptionHandler(ex,"contract_asset_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<ContractAssetSummaryList>> GetAssetsSummaryList(SqlConnection Connection, int Page, string? Search,int ContractId)
        {
            var procedure = "contractassetsummary_list";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var contractAssetsSummaryList = await Connection.QueryAsync<ContractAssetSummaryList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractAssetsSummaryList;
        }

        private async Task<int> GetAssetsSummaryCount(SqlConnection Connection, int Page, string? Search,int ContractId)
        {
            var procedure = "contractassetsummary_count";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize()]
        [Route("create")]
        public async Task<object> CreateAssetSummary(ContractAssetSummaryCreate AssetCreate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_summaryvalue_validation";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", AssetCreate.ContractId);
                parameters.Add("SummaryType", "Asset");
                parameters.Add("SummaryValue", AssetCreate.AmcValue);
                var isValueExceeded = await connection.QueryAsync<IsAgreedAmountExceeded>(procedure, parameters, commandType: CommandType.StoredProcedure);
                if (isValueExceeded.FirstOrDefault().IsValueExceeded)
                {
                    throw new CustomException("asset_create_validation_assetvalue");
                }
                procedure = "asset_summary_exist_check";
                parameters = new DynamicParameters();
                parameters.Add("ContractId", AssetCreate.ContractId);
                parameters.Add("AssetProductCategory", AssetCreate.ProductCategoryId);
                parameters.Add("Count", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var result = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                int count = parameters.Get<int>("Count");
                if (count > 0)
                {
                    throw new CustomException("product_category_name_exists_message");
                }

                procedure = "contractassetsummary_create";
                parameters = new DynamicParameters();
                parameters.Add("ContractId", AssetCreate.ContractId);
                parameters.Add("PartCategoryId", AssetCreate.PartCategoryId);
                parameters.Add("ProductCategoryId", AssetCreate.ProductCategoryId);
                parameters.Add("ProductCount", AssetCreate.ProductCountAtBooking);
                parameters.Add("AmcValue", AssetCreate.AmcValue);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<ContractAssetSummaryCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsAssetSummaryCreated = true
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
                            new ExceptionHandler(ex,"asset_summary_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPut, Authorize()]
        [Route("update")]
        public async Task<object>UpdateAssetSummary(ContractAssetSummaryUpdate AssetUpdate)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_summaryvalue_validation";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", AssetUpdate.ContractId);
                parameters.Add("SummaryType", "Asset");
                parameters.Add("SummaryValue", AssetUpdate.AmcValue);
                parameters.Add("SummaryId", AssetUpdate.Id);
                var isValueExceeded = await connection.QueryAsync<IsAgreedAmountExceeded>(procedure, parameters, commandType: CommandType.StoredProcedure);
                if (isValueExceeded.FirstOrDefault().IsValueExceeded)
                {
                    throw new CustomException("asset_create_validation_assetvalue");
                }
                procedure = "contractassetsummary_update";
                parameters = new DynamicParameters();
                parameters.Add("Id", AssetUpdate.Id);
                parameters.Add("ContractId", AssetUpdate.ContractId);
                parameters.Add("PartCategoryList", AssetUpdate.PartCategoryList);
                parameters.Add("ProductCategoryId", AssetUpdate.ProductCategoryId);
                parameters.Add("ProductCountAtBooking", AssetUpdate.ProductCountAtBooking);
                parameters.Add("AmcValue", AssetUpdate.AmcValue);
                parameters.Add("UpdatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                await connection.QueryAsync<ContractAssetSummaryUpdate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsUpdated = true
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
                            new ExceptionHandler(ex,"asset_summary_update_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("selected/partnotcovered")]
        public async Task<ActionResult> GetContractProductCategoryPartNotCovered(int ProductCategoryId, int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractproductcategorypartsnotcovered_selected_list";
                var parameters = new DynamicParameters();
                parameters.Add("ProductCategoryId", ProductCategoryId);
                parameters.Add("ContractId", ContractId);
                var partnotCovered = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                string partsCategory = partnotCovered.Any() ? string.Join(",", partnotCovered.Select(x => x.PartCategoryList)) : "";
                string names = partnotCovered.Any() ? string.Join(",", partnotCovered.Select(x => x.PartCategoryNames)) : "";

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ProductCategoryPartnotCovered = new[] { new { PartCategoryList = partsCategory, PartCategoryNames = names } }
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
                            new ExceptionHandler(ex, "asset_summary_partnotcovered_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("productcategorypartnotcovered")]
        public async Task<ActionResult> GetProductCategoryPart(int ProductCategoryId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contract_productcategorypartnotcovered_list";
                var parameters = new DynamicParameters();
                parameters.Add("ProductCategoryId", ProductCategoryId);
                var productCategoryPartnotCovered = await connection.QueryAsync<ContractPartCategoryNames>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ProductCategoryPartnotCovered = productCategoryPartnotCovered
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
                            new ExceptionHandler(ex,"asset_summary_partnotcovered_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("details")]
        public async Task<ActionResult> GetContractAssetSummaryDetails(int Id)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure = "contractassetsummary_details";
                var parameters = new DynamicParameters();
                parameters.Add("Id", Id);
                var assetSummary = await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        AssetSummary = assetSummary.First()
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
                            new ExceptionHandler(ex,"asset_summary_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("sitewise/list")]
        public async Task<ActionResult<List<ContractAssetSummarySiteWiseList>>> GetContractAssetsSummarySiteWiseList( int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ContractAssetSummarySiteWiseList> contractAssetsSummaryList = await GetAssetsSummarySitewiseList(connection, ContractId);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        SiteWiseSummaryList = contractAssetsSummaryList,
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
                            new ExceptionHandler(ex,"contract_asset_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
        private async Task<IEnumerable<ContractAssetSummarySiteWiseList>> GetAssetsSummarySitewiseList(SqlConnection Connection, int ContractId)
        {
            var procedure = "contractassetsummary_sitewise_list";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            var contractAssetsSummaryList = await Connection.QueryAsync<ContractAssetSummarySiteWiseList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractAssetsSummaryList;
        }

    }
}