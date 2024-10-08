using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(CustomerId), nameof(SiteName), IsUnique = true)]
    public class CustomerSite
    {
        public int Id { get; set; }
        [ForeignKey("CustomerId")]
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string SiteName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(512)]
        public string Address { get; set; }
        [ForeignKey("CityId")]
        public int CityId { get; set; }
        public City? City { get; set; }
        [ForeignKey("StateId")]
        public int StateId { get; set; }
        public State? State { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(6)]
        public string Pincode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? GeoLocation { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int TenantOfficeId { get; set; }
        public TenantOffice? TenantOffice { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string PrimaryContactName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? SecondaryContactName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string PrimaryContactPhone { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? SecondaryContactPhone { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? PrimaryContactEmail { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? SecondaryContactEmail { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
        [DefaultValue(false)]
        public bool? IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
