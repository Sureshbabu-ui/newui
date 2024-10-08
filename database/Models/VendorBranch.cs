using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Bogus.DataSets;
using System.ComponentModel;

namespace database.Models
{
    public class VendorBranch
    {
        public int Id { get; set; }
        [ForeignKey("VendorId")]
        public int VendorId { get; set; }
        public Vendor Vendor { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int TenantOfficeId { get; set; }
        public TenantOffice? TenantOffice { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string Code { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string Name { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string Address { get; set; }
        [ForeignKey("CityId")]
        public int CityId { get; set; }
        public City City { get; set; }
        [ForeignKey("StateId")]
        public int StateId { get; set; }
        public State State { get; set; }
        [ForeignKey("CountryId")]
        public int CountryId { get; set; }
        public Country Country { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(6)]
        public string Pincode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string ContactName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string Email { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string ContactNumberOneCountryCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string ContactNumberOne { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string? ContactNumberTwoCountryCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? ContactNumberTwo { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? TollfreeNumber { get; set; }
        public int CreditPeriodInDays { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string GstNumber { get; set; }
        [ForeignKey("MasterEntityData")]
        public int GstVendorTypeId { get; set; }
        public MasterEntityData? GstVendorType { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string GstArn { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? Remarks { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
