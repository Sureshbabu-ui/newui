using BeSureApi.Models;

namespace database.Seeder.Production
{
    public class RoleSeeder
    {
        public IEnumerable<Role> GetData()
        {
            return new List<Role>
            {

            new Role{Id=1,Code="CEO",Name="CEO",IsActive = true,IsSystemRole=false, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=2,Code="IMSDH",Name="IMS Delivery Head",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=3,Code="RH",Name="Regional Head",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=4,Code="RCSM",Name="Regional Customer Service Manager",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=5,Code="ALM",Name="Area / Location Manager",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=6,Code="AA",Name="Application Administrator",IsActive = true,IsSystemRole=true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=7,Code="BBO",Name="BeSure Business Owner",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=8,Code="NWDAM",Name="National Wise Delivery [Assistant Manager]",IsSystemRole=false,IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=9,Code="CCL",Name="Call Coordinator Location",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=10,Code="CCE",Name="Call Center Executive",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=11,Code="LH",Name="Logistics Head",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=12,Code="LRM",Name="Logistics Regional Manager",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=13,Code="LLM",Name="Logistics Location Manager",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=14,Code="PAMC",Name="Pre AMC",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=15,Code="RSM",Name="Regional Sales Manager",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=16,Code="LSE",Name="Location Sales Executive",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=17,Code="IE",Name="Invoice Executive",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=18,Code="CE",Name="Collection Executive",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=19,Code="FM",Name="Finance Manager",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=20,Code="SE",Name="Service Engineer",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=21,Code="TRCH",Name="TRC Head",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=22,Code="TRCRM",Name="TRC Regional Manager",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=23,Code="LE",Name="Logistics Executive",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=24,Code="HRLE",Name="HR Location Executive",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=25,Code="HRH",Name="HR Head",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=26,Code="CPCA",Name="Contract PreSales Cost Analyst",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=27,Code="HMM",Name="Head Material Management",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=28,Code="SM",Name="Sales Manager",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=29,Code="BDM",Name="Business Development Manager",IsActive = true,IsSystemRole=false,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
            new Role{Id=50,Code="TSG",Name = "Technical Support Group", IsActive = true,IsSystemRole=false, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
           };
        }
    }
}
