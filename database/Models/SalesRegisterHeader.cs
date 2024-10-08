

using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class SalesRegisterHeader
    {
      public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string Business { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string Invoiceno { get; set; }
        [Column(TypeName = "date")]
        public DateTime InvoiceDate { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string Type { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string SubType { get; set; }
        [DefaultValue(false)]
        public bool Cancel { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string Location { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string LocationState { get; set; }
        public int LocationStateCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string LocationGSTIN { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string CustomerName{ get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string CustomerAddress1 { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? CustomerAddress2 { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? CustomerAddress3 { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string CustomerCity { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string CustomerState { get; set; }
        public int CustomerStateCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string CustomerPincode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string CustomerGSTIN { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string CustomerShipName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string CustomerShipAddress1 { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? CustomerShipAddress2 { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? CustomerShipAddress3 { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string CustomerShipCity { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string CustomerShipState { get; set; }
        public int CustomerShipStateCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string CustomerShipPincode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string CustShipGSTIN { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? TaxableValue { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? CGSTAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? SGSTAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? IGSTAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal? NETAmount { get; set; }
        [DefaultValue(false)]
        public bool EISent { get; set; }
        [DefaultValue(false)]
        public bool EISuccess { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ArchiveDateTime{ get; set; }
      
        [Column(TypeName = "varchar")]
        [StringLength(256)]
        public string UniqueID { get; set; }
        [Column(TypeName = "varchar")] 
        [StringLength(16)]
        public string BILLTOCODE { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string SHIPTOCODE { get; set; }
        [DefaultValue(false)]
        public bool CancelEISent { get; set; }
        [DefaultValue(false)]
        public bool CancelEISuccess { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? InvoiceCancelledDateTime { get; set; }
        [DefaultValue(false)]
        public bool MoveToNav { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string RAISEDFROM { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
