using BeSureApi.Models;
using Bogus;
using Bogus.DataSets;
using database.Models;

namespace database.Seeder.Staging
{
    public class ContractManPowerSeeder
    {
        public IEnumerable<ContractManPower> GetData()
        {
                return new List<ContractManPower>
            {
                new ContractManPower
                {
                    Id = 1,
                    ContractId =1,
                    TenantOfficeInfoId = 1,
                    CustomerSiteId = 1,
                    EngineerTypeId = 24,
                    EngineerLevelId = 29,
                    EngineerMonthlyCost=9000,
                    EngineerCount=4,
                    DurationInMonth=3,
                    CustomerAgreedAmount=150000,
                    BudgetedAmount = 108000,
                    MarginAmount=42000,
                    CreatedBy = 10,
                    CreatedOn =DateTime.Parse("2023-09-09 15:32:00"),
                    ModifiedBy = null,
                    ModifiedOn = null,
                    DeletedBy = null,
                    DeletedOn = null
                },
                new ContractManPower
                {
                    Id = 2,
                    ContractId =2,
                    TenantOfficeInfoId = 18,
                    CustomerSiteId = 5,
                    EngineerTypeId = 24,
                    EngineerLevelId = 29,
                    EngineerMonthlyCost=12000,
                    EngineerCount=6,
                    DurationInMonth=3,
                    CustomerAgreedAmount=500000,
                    BudgetedAmount = 216000,
                    MarginAmount=284000,
                    CreatedBy = 10,
                    CreatedOn =DateTime.Parse("2023-09-09 15:32:00"),
                    ModifiedBy = null,
                    ModifiedOn = null,
                    DeletedBy = null,
                    DeletedOn = null
                }
            };
        }

    };
}
