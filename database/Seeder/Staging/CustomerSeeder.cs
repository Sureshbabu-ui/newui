using BeSureApi.Models;
using Bogus;
using database.Models;

namespace database.Seeder.Staging
{
    public class CustomerSeeder
    {
        public IEnumerable<Customer> GetData()
        {
            return new List<Customer>
            { 
                new Customer 
                {
                    Id = 1,
                    CustomerCode = "BHU00001",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new Customer
                {
                    Id = 2,
                    CustomerCode = "BHU00002",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new Customer
                {
                    Id = 3,
                    CustomerCode = "BHU00003",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new Customer
                {
                    Id = 4,
                    CustomerCode = "COC00004",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new Customer
                {
                    Id = 5,
                    CustomerCode = "BHU00005",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new Customer
                {
                    Id = 6,
                    CustomerCode = "BHU00006",
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                }
            };
        }
    };

}
