using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class UserResetPasscode
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public UserInfo? UserInfo { get; set; }
        public int ResetCode { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? VerifiedOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? PasscodeUpdatedOn { get; set; }

    }
}
