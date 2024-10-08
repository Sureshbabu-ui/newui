using BeSureApi.Models;
using Bogus;
using database.Models;
using System.Diagnostics.Contracts;

namespace database.Seeder.Staging
{
    public class ContractProductCategoryPartNotCoveredSeeder
    {
        public IEnumerable<ContractProductCategoryPartNotCovered> GetData()
        {
            var ContractsProductCategoryPartNotCovered = new List<ContractProductCategoryPartNotCovered>();
            return new List<ContractProductCategoryPartNotCovered>
            {
                new ContractProductCategoryPartNotCovered{ Id =1,ContractId=1,AssetProductCategoryId=3, PartCategoryId=3,CreatedBy=10,CreatedOn=DateTime.Parse("2023-04-06 15:32:00") },
                new ContractProductCategoryPartNotCovered{ Id =2,ContractId=2,AssetProductCategoryId=3, PartCategoryId=3,CreatedBy=10,CreatedOn=DateTime.Parse("2023-04-06 15:32:00") },
                new ContractProductCategoryPartNotCovered{ Id =3,ContractId=3,AssetProductCategoryId=3, PartCategoryId=3,CreatedBy=10,CreatedOn=DateTime.Parse("2023-04-06 15:32:00") }
            };
        }
    }
}

