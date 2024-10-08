using database.Models;

namespace database.Seeder.Production
{
    public class AssetProductCategoryPartNotCoveredSeeder
    {
        public IEnumerable<AssetProductCategoryPartNotCovered> GetData()
        {
            return new List<AssetProductCategoryPartNotCovered>
            {
                new AssetProductCategoryPartNotCovered { Id = 20, AssetProductCategoryId = 2, PartCategoryId = 65, IsActive =true, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-05-15 10:10:10") },
                new AssetProductCategoryPartNotCovered { Id = 21, AssetProductCategoryId = 5, PartCategoryId = 65, IsActive =true, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-05-15 10:10:10") },
                new AssetProductCategoryPartNotCovered { Id = 22, AssetProductCategoryId = 8, PartCategoryId = 65, IsActive =true, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-05-15 10:10:10") },
                new AssetProductCategoryPartNotCovered { Id = 23, AssetProductCategoryId = 9, PartCategoryId = 6, IsActive =true, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-05-15 10:10:10") },
                new AssetProductCategoryPartNotCovered { Id = 24, AssetProductCategoryId = 9, PartCategoryId = 42, IsActive =true, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-05-15 10:10:10") },
                new AssetProductCategoryPartNotCovered { Id = 25, AssetProductCategoryId = 11, PartCategoryId = 65, IsActive =true, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-05-15 10:10:10") },
                new AssetProductCategoryPartNotCovered { Id = 26, AssetProductCategoryId = 18, PartCategoryId = 65, IsActive =true, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-05-15 10:10:10") },
                new AssetProductCategoryPartNotCovered { Id = 27, AssetProductCategoryId = 19, PartCategoryId = 65, IsActive =true, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-05-15 10:10:10") },
                new AssetProductCategoryPartNotCovered { Id = 28, AssetProductCategoryId = 21, PartCategoryId = 65, IsActive =true, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-05-15 10:10:10") },
                new AssetProductCategoryPartNotCovered { Id = 29, AssetProductCategoryId = 25, PartCategoryId = 6, IsActive =true, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-05-15 10:10:10") },
                new AssetProductCategoryPartNotCovered { Id = 30, AssetProductCategoryId = 29, PartCategoryId = 6, IsActive =true, CreatedBy = 10, CreatedOn = DateTime.Parse("2024-05-15 10:10:10") },
            };
        }
    }
}
