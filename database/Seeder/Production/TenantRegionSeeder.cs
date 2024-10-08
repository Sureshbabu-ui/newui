using database.Models;

namespace database.Seeder.Staging
{
    public class TenantRegionSeeder
    {
        public IEnumerable<TenantRegion> GetData()
        {
            return new List<TenantRegion>
            {
                new TenantRegion
                {
                    Id = 1,
                    Code = "E1",
                    RegionName="EAST",
                    TenantOfficeId = 2,
                    IsActive = true,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-08-17 15:32:00")
                 }  ,
                new TenantRegion
                {
                    Id = 2,
                    Code = "N1",
                    RegionName = "NORTH",
                    TenantOfficeId = 10,                   
                    IsActive = true,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-08-17 15:32:00")
                },
                new TenantRegion
                {
                    Id = 3,
                    Code = "S1",
                    RegionName = "SOUTH1-KER",
                    TenantOfficeId = 16,
                    IsActive = true,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-08-17 15:32:00")
                },
                new TenantRegion
                {
                    Id = 4,
                    Code = "S2",
                    RegionName = "SOUTH2-KAR",
                    TenantOfficeId = 18,
                    IsActive = true,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-08-17 15:32:00")
                },
                new TenantRegion
                {
                    Id = 5,
                    Code = "S3",
                    RegionName = "SOUTH3-TN",
                    TenantOfficeId = 20,
                    IsActive = true,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-08-17 15:32:00")
                },
                new TenantRegion
                {
                    Id = 6,
                    Code = "S4",
                    RegionName = "SOUTH4-AP&T",
                    TenantOfficeId = 25,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-08-17 15:32:00")
                },
                new TenantRegion
                {
                    Id = 7,
                    Code = "W1",
                    RegionName = "WEST",
                    TenantOfficeId = 28,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-08-17 15:32:00")
                },
            };
        }
    }
}
