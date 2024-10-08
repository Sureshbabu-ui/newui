using database.Models;

namespace database.Seeder.Production
{
    public class ApprovalEventSeeder
    {
        public IEnumerable<ApprovalEvent> GetData()
        {
            return new List<ApprovalEvent>
            {
                new ApprovalEvent { Id = 1, EventGroupId = 1, EventCode = "AE_BANK_CREATE", EventName = "Bank Create", IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new ApprovalEvent { Id = 2, EventGroupId = 1, EventCode = "AE_BANK_EDIT", EventName = "Bank Edit", IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new ApprovalEvent { Id = 3, EventGroupId = 2, EventCode = "AE_CONTRACT_CREATE", EventName = "Contract Create", IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new ApprovalEvent { Id = 4, EventGroupId = 2, EventCode = "AE_CONTRACT_EDIT", EventName = "Contract Edit", IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new ApprovalEvent { Id = 5, EventGroupId = 3, EventCode = "AE_CUSTOMER_CREATE", EventName = "Customer Create", IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new ApprovalEvent { Id = 6, EventGroupId = 3, EventCode = "AE_CUSTOMER_EDIT", EventName = "Customer Edit", IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new ApprovalEvent { Id = 7, EventGroupId = 4, EventCode = "AE_PART_CREATE", EventName = "Part Create", IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new ApprovalEvent { Id = 8, EventGroupId = 4, EventCode = "AE_PART_EDIT", EventName = "Part Edit", IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new ApprovalEvent { Id = 9, EventGroupId = 5, EventCode = "AE_USER_CREATE", EventName = "User Create", IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new ApprovalEvent { Id = 10, EventGroupId = 5, EventCode = "AE_USER_EDIT", EventName = "User Edit", IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
            };
        }
    }
}
