using BeSureApi.Models;
using database.Models;

namespace database.Seeder.Production
{
    public class CustomerGroupSeeder
    {
        public IEnumerable<CustomerGroup> GetData()
        {
            return new List<CustomerGroup>
            {
                new CustomerGroup
                {
                    Id= 1,
                    GroupCode="CG01",
                    GroupName="SBI",
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                    CreatedBy = 10
                }
            };
        }
    }
}
