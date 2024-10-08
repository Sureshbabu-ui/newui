using Bogus;
using database.Models;

namespace database.Seeder.Staging
{
    public class PartProductCategorySeeder
    {
        public IEnumerable<PartProductCategory> GetData()
        {
            return new List<PartProductCategory>
            {
                new PartProductCategory { Id=1, Code="R001", CategoryName="AIO DESKTOP", CreatedBy=10, CreatedOn=DateTime.Parse("2024-04-16 10:10:10") },
                new PartProductCategory { Id=2, Code="R002", CategoryName="DESKTOP", CreatedBy=10, CreatedOn=DateTime.Parse("2024-04-16 10:10:10") },
                new PartProductCategory { Id=3, Code="R003", CategoryName="LAPTOP", CreatedBy=10, CreatedOn=DateTime.Parse("2024-04-16 10:10:10") },
                new PartProductCategory { Id=4, Code="R004", CategoryName="NETWORKING", CreatedBy=10, CreatedOn=DateTime.Parse("2024-04-16 10:10:10") },
                new PartProductCategory { Id=5, Code="R005", CategoryName="OTHERS", CreatedBy=10, CreatedOn=DateTime.Parse("2024-04-16 10:10:10") },
                new PartProductCategory { Id=6, Code="R006", CategoryName="PLOTTER", CreatedBy=10, CreatedOn=DateTime.Parse("2024-04-16 10:10:10") },
                new PartProductCategory { Id=7, Code="R007", CategoryName="PRINTER", CreatedBy=10, CreatedOn=DateTime.Parse("2024-04-16 10:10:10") },
                new PartProductCategory { Id=8, Code="R008", CategoryName="PROJECTOR", CreatedBy=10, CreatedOn=DateTime.Parse("2024-04-16 10:10:10") },
                new PartProductCategory { Id=9, Code="R009", CategoryName="SCANNER", CreatedBy=10, CreatedOn=DateTime.Parse("2024-04-16 10:10:10") },
                new PartProductCategory { Id=10, Code="R010", CategoryName="SERVER", CreatedBy=10, CreatedOn=DateTime.Parse("2024-04-16 10:10:10") },
                new PartProductCategory { Id=11, Code="R011", CategoryName="STORAGE", CreatedBy=10, CreatedOn=DateTime.Parse("2024-04-16 10:10:10") },
                new PartProductCategory { Id=12, Code="R012", CategoryName="UPS", CreatedBy=10, CreatedOn=DateTime.Parse("2024-04-16 10:10:10") },
                new PartProductCategory { Id=13, Code="R013", CategoryName="WORKSTATION", CreatedBy=10, CreatedOn=DateTime.Parse("2024-04-16 10:10:10") },
            };
        }
    }
}