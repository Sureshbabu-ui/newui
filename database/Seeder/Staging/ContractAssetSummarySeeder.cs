using BeSureApi.Models;
using Bogus;
using database.Models;

namespace database.Seeder.Staging
{
    public class ContractAssetSummarySeeder
    {
        public IEnumerable<ContractAssetSummary> GetData()
        {
            return new List<ContractAssetSummary>
            { 
                 new ContractAssetSummary
                {
                    Id = 1,
                    ContractId = 1,
                    AssetProductCategoryId = 3,
                    ProductCountAtBooking = 2,
                    ProductCount = 2,
                    AmcRate = 5000,
                    AmcValue = 850,
                    IsDeleted = false,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new ContractAssetSummary
                {
                    Id = 2,
                    ContractId = 2,
                    AssetProductCategoryId = 8,
                    ProductCountAtBooking = 2,
                    ProductCount = 2,
                    AmcRate = 5000,
                    AmcValue = 850,
                    IsDeleted = false,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new ContractAssetSummary
                {
                    Id = 3,
                    ContractId = 3,
                    AssetProductCategoryId = 3,
                    ProductCountAtBooking = 2,
                    ProductCount = 2,
                    AmcRate = 5000,
                    AmcValue = 850,
                    IsDeleted = false,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
            };
    }
};
}
