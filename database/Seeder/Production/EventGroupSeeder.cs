using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using database.Models;

namespace database.Seeder.Production
{
    public class EventGroupSeeder
    {
        public IEnumerable<EventGroup> GetData()
        {
            return new List<EventGroup>
            {
                new EventGroup
               {
                     Id= 1,
                     EventGroupName="Bank",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
               },        
                new EventGroup
               {
                     Id= 2,
                     EventGroupName="Contract",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                },          
                new EventGroup
                     {
                     Id= 3,
                     EventGroupName="Customer",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                     },
                new EventGroup
                {
                     Id= 4,
                     EventGroupName="Part",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                }, 
                new EventGroup
                {
                     Id= 5,
                     EventGroupName="User",
                     IsActive=true,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                     CreatedBy = 10
                }
            };
        }
    }
}
