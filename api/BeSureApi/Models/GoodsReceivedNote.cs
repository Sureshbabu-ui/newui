using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using static Org.BouncyCastle.Math.EC.ECCurve;
namespace BeSureApi.Models
{
    public class GoodsReceivedNoteList
    {
        public int Id { get; set; }
        public bool IsProcessed { get; set; }
        public string GrnNumber { get; set; }
        public DateTime GrnDate { get; set; }
        public string TransactionTypeCode { get; set; }
        public string? PoNumber { get; set; }
        public string TransactionType { get; set; }
        public string? ReferenceNumber { get; set; }
        public DateTime? ReferenceDate {  get; set; }
        public string ReceivedBy { get; set; }
        public string ReceivedLocation { get; set; }
        public string? SourceLocation { get; set; }
        public string? SourceEngineer { get; set; }
        public string? SourceVendor { get; set; }
        public string? DCNumber { get; set; }
    }
    public class GoodsReceivedNoteCreate
    {
        public int TransactionId { get; set; }
        public string TransactionTypeCode { get; set; }
        public string? ReferenceNumber { get; set; }
        [Compare("ReferenceNumber", ErrorMessage = "grn_api_passcode_reset_passcode_mismatch")]
        public string? ConfirmReferenceNumber { get; set; }
        public DateTime? ReferenceDate { get; set; }
        public int? SourceLocationId { get; set; }
        public int? SourceEngineerId { get; set; }
        public int? SourceVendorId { get; set; }
        public string? Remarks { get; set; }
        public int CreatedBy { get; set; }
    }
    public class GoodsReceivedNoteDetailCreate
    {
        public int GoodsReceivedNoteId { get; set; }
        public int PartId { get; set; }
        public int? PartStockId { get; set; }
        public string? Barcode { get; set; }
        public string? SerialNumber { get; set; }
        [Required(ErrorMessage = "stock_type_required")]
        public int StockTypeId { get; set; }
        public decimal Quantity { get; set; }
        public decimal Rate { get; set; }
    }
    public class GoodsReceivedNoteDetailList
    {
        public int Id { get; set; }
        public string? SerialNumber { get; set; }
        public string Rate { get; set; }
        public string PartName { get; set; }
        public string PartCode { get; set; }
        public string OemPartNumber { get; set; }
        public string HsnCode { get; set; }
        public string? PoNumber { get; set; }
    }
    public class GoodsReceivedNoteDetail
    {
        public GoodsReceivedNoteDetail()
        {
            Id = 0; // Set default value of Id to 0
            Quantity = 0;
        }
        public int? Id { get; set; }
        public int GoodsReceivedNoteId { get; set; }
        public int PartId { get; set; }
        public string? SerialNumber { get; set; }
        public string? Barcode { get; set; }
        public Decimal? Rate { get; set; }
        public int? StockTypeId { get; set; }
        public string PartName { get; set; }
        public string PartCode { get; set; }
        public int? Quantity { get; set; }
        public string HsnCode { get; set; }
        public string OemPartNumber { get; set; }
        public string GrnNumber { get; set; }
        public int? PartStockId { get; set; }
    }
}
