using BeSureApi.Models;
using database.Models;

namespace database.Seeder.Staging
{
    public class AssetSeeder
    {
        public IEnumerable<Asset> GetData()
        {
            return new List<Asset>
            {
                new Asset
                {
                    Id = 1,
                    TenantOfficeId = 1,
                    CustomerSiteId = 3,
                    MspAssetId = "DFER54",
                    CustomerAssetId = "HGT52",
                    AssetProductCategoryId = 3,
                    ProductMakeId = 1,
                    ProductModelId = 6,
                    ProductSerialNumber = "BRET850102",
                    WarrantyEndDate = DateTime.Parse("2024-01-05 15:32:00"),
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    ModifiedBy = 10,
                    ModifiedOn = DateTime.Parse("2023-04-06 15:32:00")
               },
                new Asset
                {
                    Id = 2,
                    TenantOfficeId = 1,
                    CustomerSiteId = 6,
                    MspAssetId = "AZXW06",
                    CustomerAssetId = "KPG23",
                    AssetProductCategoryId = 7,
                    ProductMakeId = 2,
                    ProductModelId = 7,
                    ProductSerialNumber = "QSDW006287",
                    WarrantyEndDate = DateTime.Parse("2024-01-05 15:32:00"),
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    ModifiedBy = 10,
                    ModifiedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new Asset
                {
                    Id = 3,
                    TenantOfficeId = 1,
                    CustomerSiteId = 4,
                    MspAssetId = "RETI71",
                    CustomerAssetId = "LKJ98",
                    AssetProductCategoryId = 8,
                    ProductMakeId = 3,
                    ProductModelId = 5,
                    ProductSerialNumber = "GFRE008901",
                    WarrantyEndDate = DateTime.Parse("2024-01-05 15:32:00"),
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    ModifiedBy = 10,
                    ModifiedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
            };
        }
    };
}
