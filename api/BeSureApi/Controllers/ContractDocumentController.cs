using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Services.LogService;
using BeSureApi.Exceptions;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;

namespace BeSureApi.Controllers
{
    [Route("api/contract/document")]
    [ApiController]
    public class ContractDocumentController:Controller
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ContractDocumentController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        [HttpGet]
        [Route("list")]
        public async Task<object> GetContractDocumentList(int Page, string? Search, int ContractId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                IEnumerable<ContractDocument> contractDocumentList = await GetDocumentList(connection, Page, Search, ContractId);
                int totalRows = await GetDocumentCount(connection,ContractId, Search);
                int perPage = int.Parse(_config.GetSection("Pagination:PerPage").Value);

                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        ContractDocumentList = contractDocumentList,
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
                            new ExceptionHandler(ex,"contract_document_list_no_data", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        private async Task<IEnumerable<ContractDocument>> GetDocumentList(SqlConnection Connection, int Page, string? Search, int ContractId)
        {
            var procedure = "contract_document_list";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("Page", Page);
            parameters.Add("PerPage", _config.GetSection("Pagination:PerPage").Value);
            parameters.Add("Search", Search);
            var contractDocumentList = await Connection.QueryAsync<ContractDocument>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractDocumentList;
        }

        private async Task<int> GetDocumentCount(SqlConnection Connection,int ContractId, string? Search)
        {
            var procedure = "contract_document_count";
            var parameters = new DynamicParameters();
            parameters.Add("ContractId", ContractId);
            parameters.Add("Search", Search);
            parameters.Add("@TotalRows", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await Connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@TotalRows");
        }

        [HttpPost, Authorize()]
        [Route("create")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_CREATE)]
        public async Task<ActionResult> CreateContractDocument([FromForm] ContractDocumentCreate ContractDocument)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                if (ContractDocument.DocumentFile == null)
                {
                    throw new CustomException("contract_document_create_upload_file");
                }
                int totalRows = await GetDocumentCount(connection, ContractDocument.ContractId,null);
                if (totalRows >= int.Parse(_config.GetSection("ContractDocuments:MaximumCount").Value))
                {
                    throw new CustomException("contract_document_create_total_file_exceed_message");
                }
                // Create an instance of FileController and pass the IConfiguration dependency
                var fileController = new FileController(_config);
                string fileName = await fileController.SaveContractDocument(ContractDocument);

                var procedure = "contract_document_create";
                var parameters = new DynamicParameters();
                parameters.Add("ContractId", ContractDocument.ContractId);
                //TODOS : The hardcoded url should be replaced by the url of the file location in s3
                // parameters.Add("DocumentUrl", _config.GetSection("ContractDocuments:DownloadPath").Value + fileName);
                parameters.Add("DocumentUrl", _config.GetSection("ContractDocuments:DownloadPath").Value + fileName);
                parameters.Add("DocumentType", Path.GetExtension(ContractDocument.DocumentFile?.FileName));
                parameters.Add("DocumentSize", ContractDocument.DocumentFile?.Length);
                parameters.Add("DocumentUploadedName",ContractDocument.DocumentFile?.FileName);
                parameters.Add("DocumentCategoryId", ContractDocument.DocumentCategoryId);
                parameters.Add("DocumentDescription", ContractDocument.DocumentDescription);
                parameters.Add("CreatedBy", User.Claims.Where(c => c.Type == "LoggedUserId").First().Value);
                parameters.Add("IsDocumentCreated", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync<ContractDocumentCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
                int isContractDocumentCreated = parameters.Get<int>("IsDocumentCreated");
                if (isContractDocumentCreated == 0)
                {
                    throw new Exception();
                }
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        IsContractDocumentCreated = Convert.ToBoolean(isContractDocumentCreated)
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
                            new ExceptionHandler(ex,"contract_document_create_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpGet]
        [Route("download")]
        [HasPermission(ContractBusinessFunctionCode.CONTRACT_CREATE)]
        public  async Task<ActionResult>  DownloadContractDocument(int DocumentId)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            try
            {
                var procedure   = "contract_document_details";
                var parameters  = new DynamicParameters();
                parameters.Add("DocumentId", DocumentId);
                var contractDocumenDetails  = await connection.QueryAsync<ContractDocument>(procedure, parameters, commandType: CommandType.StoredProcedure);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,
                    data = new
                    {
                        DocumentUrl = contractDocumenDetails.First().DocumentUrl
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
                            new ExceptionHandler(ex,"contract_document_details_failed_message", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}