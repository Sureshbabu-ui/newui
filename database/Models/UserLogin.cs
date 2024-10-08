using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(UserName), IsUnique = true)]
    public class UserLogin
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        [Index(IsUnique = true)]
        public string UserName { get; set; }
        [Column(TypeName = "char")]
        [StringLength(500)]
        public string Passcode { get; set; }
        [DefaultValue(false)]
        public bool? IsConcurrentLoginAllowed { get; set; }
        [DefaultValue(0)]
        public int? CurrentTokenVersion { get; set; }
        [DefaultValue(0)]
        public int? TotalFailedLoginAttempts { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? LastLoginOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? PasscodeUpdatedOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [DefaultValue(true)]
        public bool? IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeactivatedOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeactivatedBy { get; set; }      
          
    }
}
