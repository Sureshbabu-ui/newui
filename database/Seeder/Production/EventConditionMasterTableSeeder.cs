using database.Models;

namespace database.Seeder.Production
{
    public class EventConditionMasterTableSeeder
    {
        public IEnumerable<EventConditionMasterTable> GetData()
        {
            return new List<EventConditionMasterTable>
            {
                new EventConditionMasterTable { Id = 1, ApprovalEventId = 3, TableName = "Contract", DisplayName = "Contract",Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterTable { Id = 2, ApprovalEventId = 4, TableName = "Contract", DisplayName = "Contract",Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterTable { Id = 3, ApprovalEventId = 5, TableName = "CustomerInfo", DisplayName = "Customer",Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterTable { Id = 4, ApprovalEventId = 6, TableName = "CustomerInfo", DisplayName = "Customer",Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterTable { Id = 5, ApprovalEventId = 7, TableName = "Part", DisplayName = "Part",Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterTable { Id = 6, ApprovalEventId = 8, TableName = "Part", DisplayName = "Part",Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterTable { Id = 7, ApprovalEventId = 9, TableName = "UserInfo", DisplayName = "User Info",Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterTable { Id = 8, ApprovalEventId = 9, TableName = "UserRole", DisplayName = "User Role",Sequence = 2, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterTable { Id = 9, ApprovalEventId = 10, TableName = "UserInfo", DisplayName = "User Info",Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterTable { Id = 10, ApprovalEventId = 10, TableName = "UserRole", DisplayName = "User Role",Sequence = 2, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
            };
        }
    }
}
