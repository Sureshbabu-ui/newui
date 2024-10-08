using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class CustomerInfo
    {
        public int Id { get; set; }
        [StringLength(64)]
        [ForeignKey("CustomerId")]
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? Name { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? NameOnPrint { get; set; }
        public int? CustomerGroupId { get; set; }
        [ForeignKey("MasterEntityData")]
        public int CustomerIndustryId { get; set; }
        public MasterEntityData? CustomerIndustry { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int TenantOfficeId { get; set; }
        public TenantOffice? TenantOffice { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string PrimaryContactName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string PrimaryContactEmail { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string PrimaryContactPhone { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? SecondaryContactName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? SecondaryContactEmail { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? SecondaryContactPhone { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? PanNumber { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? TinNumber { get; set; }

        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? TanNumber { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(21)]
        public string? CinNumber { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string BilledToAddress { get; set; }
        public int BilledToCityId {  get; set; }
        [ForeignKey("BilledToCityId")]
        public City? BilledToCity { get; set; }
        public int BilledToStateId { get; set; }
        [ForeignKey("BilledToStateId")]
        public State? BilledToState { get; set; }
        public int BilledToCountryId { get; set; }
        [ForeignKey("BilledToCountryId")]
        public Country? BilledToCountry { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string BilledToPincode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? BilledToGstNumber { get; set; }

        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string ShippedToAddress { get; set; }
        public int ShippedToCityId { get; set; }
        [ForeignKey("ShippedToCityId")]
        public City? ShippedToCity { get; set; }
        public int ShippedToStateId { get; set; }
        [ForeignKey("ShippedToStateId")]
        public State? ShippedToState { get; set; }
        public int ShippedToCountryId { get; set; }
        [ForeignKey("ShippedToCountryId")]
        public Country? ShippedToCountry { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string ShippedToPincode { get; set; }

        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? ShippedToGstNumber { get; set; }
        public bool IsMsme { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(24)]
        public string MsmeRegistrationNumber { get; set; }
        public bool IsContractCustomer { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime EffectiveFrom { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? EffectiveTo { get; set; }
        public int GstTypeId { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        [DefaultValue(false)]
        public bool? IsDeleted { get; set; }
        [DefaultValue(true)]
        public bool IsVerified { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
