using database.Models;

namespace database.Seeder.Production
{
    public class ApprovalWorkflowSeeder
    {
        public IEnumerable<ApprovalWorkflow> GetData()
        {
            return new List<ApprovalWorkflow>
            {
                new ApprovalWorkflow {Id =1, Name="User Create",Description="Configure the multilevel approval system for user creation to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
                new ApprovalWorkflow {Id =2, Name="User Edit",Description="Configure the multilevel approval system for user edit to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
                new ApprovalWorkflow {Id =3, Name="Part",Description="Configure the multilevel approval system for part creation to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
                new ApprovalWorkflow {Id =4, Name="Bank Create",Description="Configure the multilevel approval system for bank creation to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
                new ApprovalWorkflow {Id =5, Name="Bank Edit",Description="Configure the multilevel approval system for bank edit to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10},
                new ApprovalWorkflow {Id =6, Name="Customer Create",Description="Configure the multilevel approval system for bank edit to ensure thorough review and authorization at each stage. Customize the approval hierarchy and criteria to match your organizational needs",IsActive = true,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),CreatedBy = 10}
            };
        }
    }
}
