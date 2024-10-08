using BeSureApi.Models;
using database.Models;

namespace database.Seeder.Staging
{
    public class ContractAssetDetailSeeder
    {
        public IEnumerable<ContractAssetDetail> GetData()
        {
            return new List<ContractAssetDetail>
            {
                new ContractAssetDetail
                {
                    Id = 1,
                    ContractId = 1,
                    AssetId = 1,
                    ResponseTimeInHours = 2,
                    ResolutionTimeInHours = 1,
                    StandByTimeInHours = 1,
                    AssetWarrantyTypeCode = "1001",
                    IsEnterpriseProduct = false,
                    IsVipProduct = false,
                    AmcValue = 2529,
                    IsOutSourcingNeeded = false,
                    PreAmcCompletedDate = DateTime.Parse("2023-04-06 15:32:00").Date,
                    PreAmcCompletedBy = 1,
                    IsPreAmcCompleted = false,
                    AssetAddModeId = 17,
                    ProductConditionId = 130,
                    IsPreventiveMaintenanceNeeded = true,
                    PreventiveMaintenanceFrequencyId = 18,
                    ProductSupportTypeId = 128,
                    LastPmDate = DateTime.Parse("2023-04-06 15:32:00").Date,
                    AmcStartDate = DateTime.Parse("2023-04-06 15:32:00"),
                    AmcEndDate = DateTime.Parse("2023-04-06 15:32:00"),
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    ModifiedBy = 10,
                    ModifiedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    IsActive = true
                },
                new ContractAssetDetail
                {
                    Id = 2,
                    ContractId = 2,
                    AssetId = 2,
                    IsEnterpriseProduct = false,
                    ResponseTimeInHours = 4,
                    ResolutionTimeInHours = 1,
                    StandByTimeInHours = 1,
                    AssetWarrantyTypeCode = "1001",
                    IsVipProduct = false,
                    AmcValue = 5612,
                    IsOutSourcingNeeded = false,
                    PreAmcCompletedDate = DateTime.Parse("2023-04-06 15:32:00").Date,
                    PreAmcCompletedBy = 1,
                    AssetAddModeId = 177,
                    IsPreAmcCompleted = false,
                    ProductConditionId = 130,
                    IsPreventiveMaintenanceNeeded = true,
                    PreventiveMaintenanceFrequencyId = 18,
                    ProductSupportTypeId = 128,
                    LastPmDate = DateTime.Parse("2023-04-06 15:32:00").Date,
                    AmcStartDate = DateTime.Parse("2023-04-06 15:32:00"),
                    AmcEndDate = DateTime.Parse("2023-04-06 15:32:00"),
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    ModifiedBy = 10,
                    ModifiedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    IsActive = true
                },
                new ContractAssetDetail
                {
                    Id = 3,
                    ContractId = 3,
                    AssetId = 3,
                    IsEnterpriseProduct = false,
                    ResponseTimeInHours = 4,
                    ResolutionTimeInHours = 1,
                    StandByTimeInHours = 1,
                    AssetWarrantyTypeCode = "1001",
                    IsVipProduct = false,
                    AmcValue = 8745,
                    IsOutSourcingNeeded = false,
                    PreAmcCompletedDate = DateTime.Parse("2023-04-06 15:32:00").Date,
                    PreAmcCompletedBy = 1,
                    AssetAddModeId = 17,
                    IsPreAmcCompleted = false,
                    ProductConditionId = 130,
                    IsPreventiveMaintenanceNeeded = true,
                    PreventiveMaintenanceFrequencyId = 18,
                    ProductSupportTypeId = 18,
                    LastPmDate = DateTime.Parse("2023-04-06 15:32:00").Date,
                    AmcStartDate = DateTime.Parse("2023-04-06 15:32:00"),
                    AmcEndDate = DateTime.Parse("2023-04-06 15:32:00"),
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    ModifiedBy = 10,
                    ModifiedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    IsActive = true
                },
            };
        }
    };
}
