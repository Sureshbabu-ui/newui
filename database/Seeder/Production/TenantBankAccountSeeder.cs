using Bogus;
using database.Models;

namespace database.Seeder.Staging
{
    public class TenantBankAccountSeeder
    {
        public IEnumerable<TenantBankAccount> GetData()
        {
            return new List<TenantBankAccount>
            {  
                new TenantBankAccount()
                {
                    Id = 1,
                    TenantId = 1,
                    BankBranchInfoId = 1,
                    RelationshipManager = "Vasudevan",
                    ContactNumber = "7998545158",
                    Email="tmvasu@accelits.com",   
                    BankAccountTypeId = 65,
                    AccountNumber="12330200030812",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    IsDeleted = true,
                }
            };
        }
    }
}