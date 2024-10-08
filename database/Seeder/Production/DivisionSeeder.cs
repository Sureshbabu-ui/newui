using BeSureApi.Models;
using database.Models;

namespace database.Seeder.Production
{
    public class DivisionSeeder
    {
        public IEnumerable<Division> GetData()
        {
            return new List<Division>
            {
                     new Division
                     {
                     Id= 1,
                     Code="IMS",
                     Name="Infrastructure Management Services",
                     IsActive=true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                     },
                     new Division
                     {
                     Id= 2,
                     Code="WLMS",
                     Name="Warranty Logistics Management Services",
                     IsActive=true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                     },
                     new Division
                     {
                     Id= 3,
                     Code="SI",
                     Name="System Integration",
                     IsActive=true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                     },
                     new Division
                     {
                     Id= 4,
                     Code="MPS",
                     Name="Managed Print Services",
                     IsActive=true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                     },
                     new Division
                     {
                     Id= 5,
                     Code="CS",
                     Name="Cyber security",
                     IsActive=true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                     },
                     new Division
                     {
                     Id= 6,
                     Code="SSD",
                     Name="Software Service Division",
                     IsActive=true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                     }
            };
        }
    }
}