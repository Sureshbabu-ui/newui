using database.Models;
namespace database.Seeder.Staging
{
    public class NotificationSettingSeeder
    {
        public IEnumerable<NotificationSetting> GetData()
        {
            return new List<NotificationSetting>
            {
                     new NotificationSetting
                     {
                     Id= 1,
                     BusinessEventId=1,
                     RoleId = 3,
                     Email = true,
                     },
                       new NotificationSetting
                     {
                     Id= 2,
                     BusinessEventId=2,
                     RoleId = 24,
                     Email = true,
                     },
            };
        }
    }
}