using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.ComponentModel;

namespace database.Models
{
    public class TenantOfficeInfo
    {
        public int Id { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int TenantOfficeId { get; set; }
        public TenantOffice? TenantOffice { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string Address { get; set; }
        [ForeignKey("CityId")]
        public int CityId { get; set; }
        public City? City { get; set; }
        [ForeignKey("StateId")]
        public int StateId { get; set; }
        public State? State { get; set; }
        [ForeignKey("CountryId")]
        public int CountryId { get; set; }
        public Country? Country { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string Pincode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string Phone { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string Email { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string Mobile { get; set; }
        public int ManagerId { get; set; }
        [ForeignKey("ManagerId")]
        public UserInfo? Manager { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string GstNumber { get; set; }
        public int GstStateId { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? Tin { get; set; }
        [DefaultValue(true)]
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
