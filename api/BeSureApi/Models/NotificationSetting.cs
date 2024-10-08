using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class NotificationSettings
    {
        public int BusinessEventId { get; set; }
    }
    public class EventWiseList
    {
        [Required(ErrorMessage = "BusinessEventId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "BusinessEventId is required")]
        public int BusinessEventId { get; set; }
    }

    public class NotificationSettingUpdate
    {
        public int Id { get; set; }
        public int BusinessEventId { get; set; }
        public int RoleId { get; set; }
        public bool Email { get; set; }
    }

    public class NotificationSettingUpdateList
    {
        public List<NotificationSettingUpdate> NotificationSettings { get; set; }
    }
}