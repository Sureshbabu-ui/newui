using Dapper;
using NumericWordsConversion;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using BeSureApi.Models;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Transactions;

namespace BeSureApi.Helpers
{
    public static class ContractAssetHelper
    {
        public static async Task<(bool? isProductCountExceeded, int? assetId)> CreateContractAsset(SqlConnection connection, List<ContractAssetDetails> assetsDetails,string assetaddedmode, string? createdBy, int contractId,SqlTransaction? transaction)
        {
            try
            {
                int? productCategoryId = null;
                if (assetsDetails.Count == 1)
                {
                    productCategoryId = assetsDetails[0].ProductCategoryId;
                }
                var procedure = "contract_assets_bulk_upload";
                var parameters = new DynamicParameters();
                parameters.Add("Assets", JsonSerializer.Serialize(assetsDetails));
                parameters.Add("AssetAddMode", assetaddedmode);
                parameters.Add("CreatedBy", createdBy);
                parameters.Add("ContractId", contractId);
                parameters.Add("AssetProductCategoryId", productCategoryId);
                parameters.Add("IsProductCountExceeded", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("ContractAssetId", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                var isProductCountExceeded = parameters.Get<bool>("IsProductCountExceeded");
                var assetId = parameters.Get<int?>("ContractAssetId");
                return (isProductCountExceeded, assetId);
            }
            catch (Exception)
            {
                return (null,null);
            }
        }
    }

    public static class ContractInterimAssetHelper
    {
        public static async Task<(bool? isProductCountExceeded, int? assetId)> CreateContractInterimAsset(SqlConnection connection, List<ContractInterimAssetDetails> assetsDetails, string assetaddedmode, string? createdBy, int contractId, SqlTransaction? transaction)
        {
            try
            {
                int? productCategoryId = null;
                if (assetsDetails.Count == 1)
                {
                    productCategoryId = assetsDetails[0].ProductCategoryId;
                }
                var procedure = "contract_assets_bulk_upload";
                var parameters = new DynamicParameters();
                parameters.Add("Assets", JsonSerializer.Serialize(assetsDetails));
                parameters.Add("AssetAddMode", assetaddedmode);
                parameters.Add("CreatedBy", createdBy);
                parameters.Add("ContractId", contractId);
                parameters.Add("AssetProductCategoryId", productCategoryId);
                parameters.Add("IsProductCountExceeded", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                parameters.Add("ContractAssetId", dbType: DbType.Int32, direction: ParameterDirection.Output);
                await connection.QueryAsync(procedure, parameters, commandType: CommandType.StoredProcedure, transaction: transaction);
                var isProductCountExceeded = parameters.Get<bool>("IsProductCountExceeded");
                var assetId = parameters.Get<int?>("ContractAssetId");
                return (isProductCountExceeded, assetId);
            }
            catch (Exception)
            {
                return (null, null);
            }
        }
    }
}