using BeSureApi.Models;
using Bogus;
using database.Models;

namespace database.Seeder.Staging
{
    public class ContractCustomerSiteSeeder
    {
        public IEnumerable<ContractCustomerSite> GetData()
        {
            return new List<ContractCustomerSite>
            { 
                new ContractCustomerSite
                {
                    Id = 1,
                    ContractId = 1,
                    CustomerSiteId = 3,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    IsReRequired = true,
                    ModifiedBy = null,
                    ModifiedOn = null,
                    IsDeleted = null,
                    DeletedBy = null,
                    DeletedOn = null
                },
                new ContractCustomerSite
                {
                    Id = 2,
                    ContractId = 2,
                    CustomerSiteId = 6,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    ModifiedBy = null,
                    ModifiedOn = null,
                    IsReRequired = true,
                    IsDeleted = null,
                    DeletedBy = null,
                    DeletedOn = null
                },
                new ContractCustomerSite
                {
                    Id = 3,
                    ContractId = 3,
                    CustomerSiteId = 4,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    ModifiedBy = null,
                    ModifiedOn = null,
                    IsReRequired = true,
                    IsDeleted = null,
                    DeletedBy = null,
                    DeletedOn = null
                }
            };
        }
    }
}