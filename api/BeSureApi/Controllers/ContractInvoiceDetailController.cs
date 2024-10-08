using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;

namespace BeSureApi.Controllers
{
        public class ContractInvoiceDetailController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        public ContractInvoiceDetailController(IConfiguration config, ILogService logService)
        {
            _config = config;
            _logService = logService;
        }

        public async Task<IEnumerable<ContractInvoiceDetailList>> GetContractInvoiceDetailList(SqlConnection Connection,int ContractInvoiceId)
        {
            var procedure = "contractinvoicedetail_list";
            var parameters = new DynamicParameters();
            parameters.Add("ContractInvoiceId", ContractInvoiceId);
            var  contractInvoiceDetailList = await Connection.QueryAsync<ContractInvoiceDetailList>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return contractInvoiceDetailList;
        }
    }
}