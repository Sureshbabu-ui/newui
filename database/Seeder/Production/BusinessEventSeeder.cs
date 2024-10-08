using database.Models;

namespace database.Seeder.Production
{
    public class BusinessEventSeeder
    {
        public IEnumerable<BusinessEvent> GetData()
        {
            return new List<BusinessEvent>
            {
                     new BusinessEvent
                     {
                     Id= 1,
                     Code="USR_CRET",
                     Name="On User Create",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     },
                     new BusinessEvent
                     {
                     Id= 2,
                     Code="USR_APRV",
                     Name="On User Approve",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     },
                     new BusinessEvent
                     {
                     Id= 3,
                     Code="CTR_APRV",
                     Name="On Contract Approval Request",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     },
                     new BusinessEvent
                     {
                     Id= 4,
                     Code="CTR_RNWL",
                     Name="On Contract Renewal",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     },
                     new BusinessEvent
                     {
                     Id= 5,
                     Code="CTR_EXPR",
                     Name="On Contract Expiry",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     },
                     new BusinessEvent
                     {
                     Id= 6,
                     Code="CTR_EDIT",
                     Name="On Contract Change",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     },
                     new BusinessEvent
                     {
                     Id= 7,
                     Code="SRR_CRET",
                     Name="On Call Create",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     },
                     new BusinessEvent
                     {
                     Id= 8,
                     Code="SRR_CLSE",
                     Name="On Call Close",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     },
                     new BusinessEvent
                     {
                     Id= 9,
                     Code="INT_FAPR",
                     Name="On Interim Finance Approve",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     },
                     new BusinessEvent
                     {
                     Id= 10,
                     Code="INT_AAPR",
                     Name="On Interim Asset Approve",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     },
                     new BusinessEvent
                     {
                     Id= 11,
                     Code="CUS_CRET",
                     Name="On Customer Create",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     },
                     new BusinessEvent
                     {
                     Id= 12,
                     Code="CUS_APRV",
                     Name="On Customer Approval Request",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     },
                     new BusinessEvent
                     {
                     Id= 13,
                     Code="BNK_APRV",
                     Name="On Bank Request Approve",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     }              
            };
        }
    }
}
