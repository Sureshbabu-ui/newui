using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    public class BankBranchInfo
    {
        public int Id { get; set; }
        public int BranchId { get; set; }
        [ForeignKey("BranchId")]
        public BankBranch? BankBranch { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string BranchName { get; set; }
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
        [StringLength(6)]
        public string Pincode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string ContactPerson { get; set; }
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
        [StringLength(64)]
        public string Email { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(11)]
        public string Ifsc { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(9)]
        public string MicrCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(11)]
        public string SwiftCode { get; set; }
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
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
