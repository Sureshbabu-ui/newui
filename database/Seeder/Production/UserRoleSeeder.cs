using BeSureApi.Models;
using Bogus;
using database.Models;

namespace database.Seeder.Staging
{
    public class UserRoleSeeder
    {
        public IEnumerable<UserRole> GetData()
        {
            return new List<UserRole>
            {
                new UserRole
                {
                    Id = 8,
                    RoleId = 6,
                    UserId = 8,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")   
                },
                new UserRole
                {
                    Id = 10,
                    RoleId = 6,
                    UserId = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new UserRole
                {
                    Id = 11,
                    RoleId = 6,
                    UserId = 11,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 12,
                    RoleId = 1,
                    UserId = 12,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 13,
                    RoleId = 3,
                    UserId = 13,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 14,
                    RoleId = 19,
                    UserId = 14,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 15,
                    RoleId = 2,
                    UserId = 15,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 16,
                    RoleId = 27,
                    UserId = 16,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 18,
                    RoleId = 6,
                    UserId = 18,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 19,
                    RoleId = 6,
                    UserId = 19,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 23,
                    RoleId = 3,
                    UserId = 23,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 24,
                    RoleId = 3,
                    UserId = 24,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 25,
                    RoleId = 3,
                    UserId = 25,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 26,
                    RoleId = 28,
                    UserId = 26,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 27,
                    RoleId = 17,
                    UserId = 27,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new UserRole
                {
                    Id = 28,
                    RoleId = 18,
                    UserId = 27,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 29,
                    RoleId = 24,
                    UserId = 28,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 30,
                    RoleId = 25,
                    UserId = 28,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 31,
                    RoleId = 24,
                    UserId = 29,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new UserRole
                {
                    Id = 32,
                    RoleId = 25,
                    UserId = 29,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 33,
                    RoleId = 20,
                    UserId = 30,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 34,
                    RoleId = 20,
                    UserId = 31,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 35,
                    RoleId = 20,
                    UserId = 33,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 36,
                    RoleId = 20,
                    UserId = 34,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 37,
                    RoleId = 9,
                    UserId = 35,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 38,
                    RoleId = 9,
                    UserId = 36,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 39,
                    RoleId = 20,
                    UserId = 32,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new UserRole
                {
                    Id = 40,
                    RoleId = 4,
                    UserId = 37,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 41,
                    RoleId = 29,
                    UserId = 38,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")                },
                new UserRole
                {
                    Id = 42 ,
                    RoleId = 10,
                    UserId = 39,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new UserRole
                {
                    Id = 43 ,
                    RoleId = 14,
                    UserId = 40,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00") 
                },
                new UserRole
                {
                    Id = 44 ,
                    RoleId = 29,
                    UserId = 41,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                },
                new UserRole
                {
                    Id = 45 ,
                    RoleId = 4,
                    UserId = 42,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                },
                new UserRole
                {
                    Id = 46 ,
                    RoleId = 6,
                    UserId = 44,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                },
                new UserRole
                {
                    Id = 47 ,
                    RoleId = 11,
                    UserId = 45,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                },
                new UserRole
                {
                    Id = 48 ,
                    RoleId = 6,
                    UserId = 46,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                },new UserRole
                {
                    Id = 49 ,
                    RoleId = 15,
                    UserId = 47,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                },
                new UserRole
                {
                    Id = 50 ,
                    RoleId = 15,
                    UserId = 48,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                },
                new UserRole
                {
                    Id = 51 ,
                    RoleId = 10,
                    UserId = 1001,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                },
                new UserRole
                {
                    Id = 52 ,
                    RoleId = 10,
                    UserId = 1002,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00"),
                },
                new UserRole {Id=1001,RoleId=20, UserId=12638, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1002,RoleId=20, UserId=13048, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1003,RoleId=20, UserId=13118, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1005,RoleId=20, UserId=13242, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1006,RoleId=20, UserId=13273, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1007,RoleId=20, UserId=13274, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1008,RoleId=20, UserId=13372, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1009,RoleId=20, UserId=13490, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1010,RoleId=20, UserId=13969, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1011,RoleId=20, UserId=14027, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1012,RoleId=20, UserId=14028, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1013,RoleId=20, UserId=14029, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1014,RoleId=20, UserId=14030, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1015,RoleId=20, UserId=14168, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1016,RoleId=20, UserId=14173, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1017,RoleId=20, UserId=14174, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1018,RoleId=20, UserId=14276, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1019,RoleId=20, UserId=14327, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1020,RoleId=20, UserId=14381, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1021,RoleId=20, UserId=14502, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1024,RoleId=20, UserId=90270, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1025,RoleId=20, UserId=90391, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1026,RoleId=20, UserId=20001, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1027,RoleId=20, UserId=20002, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
                new UserRole {Id=1028,RoleId=20, UserId=20003, CreatedOn=DateTime.Parse("2023-04-06 15:32:00")},
            };
        }  
    };
 }


