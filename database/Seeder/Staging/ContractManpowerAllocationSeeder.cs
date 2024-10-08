using Bogus;
using database.Models;

namespace database.Seeder.Staging
{
    public class ContractManpowerAllocationSeeder
    {
        public IEnumerable<ContractManpowerAllocation> GetData()
        {
            return new List<ContractManpowerAllocation>
            {
                new ContractManpowerAllocation {Id = 1,ContractId = 1,CustomerSiteId = 3,EmployeeId = 8,AllocationStatusId=78,Remarks ="Remarks",CreatedBy = 10,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),IsDeleted=true},
                new ContractManpowerAllocation {Id = 2,ContractId = 2,CustomerSiteId = 3,EmployeeId = 8,AllocationStatusId=78,Remarks ="Remarks",CreatedBy = 10,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),IsDeleted=true},
                new ContractManpowerAllocation {Id = 3,ContractId = 3,CustomerSiteId = 3,EmployeeId = 8,AllocationStatusId=78,Remarks ="Remarks",CreatedBy = 10,CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),IsDeleted=true},
            };
        }
    }
}
