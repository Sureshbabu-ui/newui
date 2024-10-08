using BeSureApi.Models;
using database.Models;

namespace database.Seeder.Staging
{
    public class BankBranchSeeder
    {
        public IEnumerable<BankBranch> GetData()
        {
            return new List<BankBranch>
            {
                new BankBranch
                {
                    Id= 1,
                    BankId=134,
                    BranchCode = "B04",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
            };
        }
    }
}
