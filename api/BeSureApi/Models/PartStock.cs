using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class PartStockList
    {
        public int Id { get; set; }
        public string PartCode { get; set; }
        public string PartName { get; set; }
        public decimal Quantity { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? Region { get; set; }
        public string? OfficeName { get; set; }
        public string? Make { get; set; }
        public string? ProductCategory { get; set; }
        public string? PartCategory { get; set; }
        public string? PartSubCategory { get; set; }
        public string? StockRoom { get; set; }
    }

    public class PartStockCreate
    {
        [Required(ErrorMessage = "validation_error_partstockcreate_part_id")]
        public int PartId { get; set; }
        [Required(ErrorMessage = "validation_error_partstockcreate_quantity")]
        public decimal Quantity { get; set; }
    }
    public class PartDetailsForSme
    {
        public string? TenantOffice { get; set; }
        public string? Barcode { get; set; }
        public string? DemandNumber { get; set; }
        public string? WarrantyPeriod { get; set; }
        public string? WorkOrderNumber { get; set; }
        public string? PartWarrantyExpiryDate { get; set; }
        public string? PoNumber { get; set; }
        public string? PoDate { get; set; }
        public string? PartCode { get; set; }
        public string? PartType { get; set; }
        public string?Description { get; set; }
        public string? Vendor { get; set; }
        public decimal? PartValue { get; set; }
        public string? GrnNumber { get; set; }
        public string? GrnDate { get; set; }
        public string? ReferenceNumber { get; set; }
        public string? ReferenceDate { get; set; }
    }
}
