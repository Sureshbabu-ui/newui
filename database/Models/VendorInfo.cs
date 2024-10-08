using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Bogus.DataSets;
using System.ComponentModel;

namespace database.Models
{
    public class VendorInfo
    {
        public int Id { get; set; }
        [ForeignKey("VendorId")]
        public int VendorId { get; set; }
        public Vendor Vendor { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int TenantOfficeId { get; set; }
        public TenantOffice? TenantOffice { get; set; }
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
        public int CreditPeriodInDays { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? GstNumber { get; set; }
        public int GstVendorTypeId { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? ArnNumber { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(17)]
        public string? EsiNumber { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(10)]
        public string? PanNumber { get; set; }
        [ForeignKey("MasterEntityData")]
        public int? PanTypeId { get; set; }
        public MasterEntityData? PanType { get; set; }
        [ForeignKey("MasterEntityData")]
        public int? VendorTypeId { get; set; }
        public MasterEntityData? VendorType { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(10)]
        public string? TanNumber { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(21)]
        public string? CinNumber { get; set; }
        public bool IsMsme { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? MsmeRegistrationNumber { get; set; }
        public DateTime? MsmeCommencementDate { get; set; }
        public DateTime? MsmeExpiryDate { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
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
