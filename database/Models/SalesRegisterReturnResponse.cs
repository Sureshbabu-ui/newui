using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class SalesRegisterReturnResponse
    {
        public int Id { get; set; } 
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string InvoiceNo { get; set; }
        [Column(TypeName = "varchar")]
        [MaxLength(64)]     
        public string? AckNo { get; set; }
        public DateTime? AckDate { get; set; }
        public Guid? UUID { get; set; }
        public DateTime? Create_Date { get; set; }
        public DateTime? CancelDate { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(512)]
        public string? IRN { get; set; }
        [StringLength(8000)]
        public string? SignedQRCode { get; set; }
        [Column(TypeName = "nvarchar(MAX)")]
        public string? SignedInvoice { get; set; }
        [MaxLength(512)]
        public string? SignedQrCodeImgUrl { get; set; }
        public bool QRImgSaved { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? QRImgName { get; set; }
        [StringLength(32)]
        public string? ewb_number { get; set; }
        public DateTime? ewb_date { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? Status { get; set; }
        public DateTime? EwbValidTill { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? irn_status { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? ewb_status { get; set; }
        [StringLength(128)]
        public string? irp { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? ErrorCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(1024)]
        public string? ErrorMessage { get; set; }
        public Guid? HeaderUniqueID { get; set; }
        public DateTime? UpdatedDateTime { get; set; }
    }
}
