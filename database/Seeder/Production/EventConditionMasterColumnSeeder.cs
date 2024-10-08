using database.Models;

namespace database.Seeder.Production
{
    public class EventConditionMasterColumnSeeder
    {
        public IEnumerable<EventConditionMasterColumn> GetData()
        {
            return new List<EventConditionMasterColumn>
            {
                new EventConditionMasterColumn { Id = 1, EventConditionMasterTableId = 1, ColumnName = "AgreementTypeId", DisplayName = "Agreement Type", ValueType = "SELECT", Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterColumn { Id = 2, EventConditionMasterTableId = 1, ColumnName = "ContractValue", DisplayName = "Contract Value", ValueType = "NUMBER", Sequence = 2, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterColumn { Id = 3, EventConditionMasterTableId = 7, ColumnName = "DesignationId", DisplayName = "Designation", ValueType = "SELECT", Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterColumn { Id = 4, EventConditionMasterTableId = 7, ColumnName = "DivisionId", DisplayName = "Division", ValueType = "SELECT", Sequence = 2, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterColumn { Id = 5, EventConditionMasterTableId = 7, ColumnName = "TenantOfficeId", DisplayName = "Office", ValueType = "SELECT", Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterColumn { Id = 6, EventConditionMasterTableId = 7, ColumnName = "DepartmentId", DisplayName = "Department", ValueType = "SELECT", Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterColumn { Id = 7, EventConditionMasterTableId = 3, ColumnName = "TenantOfficeId", DisplayName = "Office", ValueType = "SELECT", Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
                new EventConditionMasterColumn { Id = 8, EventConditionMasterTableId = 4, ColumnName = "TenantOfficeId", DisplayName = "Office", ValueType = "SELECT", Sequence = 1, IsActive = true, CreatedOn = DateTime.Parse("2023-04-06 15:32:00"), CreatedBy = 10 },
            };
        }
    }
}
