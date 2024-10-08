using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class TenantInfo
    {
        public int Id { get; set; }
        [ForeignKey("TenantId")]
        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string Name { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string NameOnPrint { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string Address { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(10)]
        public string PanNumber { get; set; }
        [DefaultValue(false)]
        [ForeignKey("CityId")]
        public int CityId { get; set; }
        public City? City { get; set; }
        [ForeignKey("StateId")]
        public int StateId { get; set; }
        public State? State { get; set; }
        [ForeignKey("CountryId")]
        public int CountryId { get; set; }
        public Country? Country { get; set; }
        [StringLength(6)]
        public string Pincode { get; set; }
        public bool IsVerified { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime EffectiveFrom { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? EffectiveTo { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
    }
}