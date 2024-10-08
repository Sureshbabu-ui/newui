using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class UserLoginHistory
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public UserInfo? UserInfo { get; set; }
        [Column(TypeName = "nvarchar")]
        [StringLength(256)]
        public string ClientInfo { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        [DefaultValue(0)]
        public int? TokenVersion { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? LoggedOutOn { get; set; }
    }
}
