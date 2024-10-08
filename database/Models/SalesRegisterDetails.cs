using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace database.Models
{
    public class SalesRegisterDetails
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string Invoiceno { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string? Partcode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? PartDescription { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string? HSNCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? DescofService { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string SACCode { get; set; }
        [Column(TypeName = "decimal(4,2)")]
        public decimal? Qty { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string UOM { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? RateperUnit { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? Total { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? DiscountValue { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? TaxableValue { get; set; }
        [Column(TypeName = "decimal(4,2)")]
        public decimal? CGSTRate { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? CGSTAmount { get; set; }
        [Column(TypeName = "decimal(4,2)")]
        public decimal? SGSTRate { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? SGSTAmount { get; set; }
        [Column(TypeName = "decimal(4,2)")]
        public decimal? IGSTRate { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? IGSTAmount { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string TaxType { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? TCSValue { get; set; }
        [Column(TypeName = "decimal(4,2)")]
        public decimal? TCSRate { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(256)]
        public string HeaderUniqueID { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(256)]
        public string Uniqueid { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
    }
}
