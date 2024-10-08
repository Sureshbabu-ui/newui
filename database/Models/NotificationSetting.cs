using BeSureApi.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class NotificationSetting
    {
        public int Id { get; set; }
        [ForeignKey("BusinessEventId")]
        public int BusinessEventId { get; set; }
        public BusinessEvent? BusinessEvent { get; set; }
        [ForeignKey("RoleId")]
        public int RoleId { get; set; }
        public Role? Role { get; set; }
        public bool Email { get; set; }
    }
}