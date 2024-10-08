using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(AppKey), IsUnique = true)]
    public class AppSetting
    {
        public int Id { get; set; }
       
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string AppKey { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(1024)]
        public string AppValue { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
    }
}
