using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class City
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(5)]
        public string Code { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string Name { get; set; }
        [ForeignKey("StateId")]
        public int StateId { get; set; }
        public State? State { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int? TenantOfficeId { get; set; }
        public TenantOffice TenantOffice { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [DefaultValue(1)]
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
