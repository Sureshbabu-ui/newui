using Org.BouncyCastle.Asn1.Mozilla;
using static BeSureApi.Models.CustomerSite;
using static QuestPDF.Helpers.Colors;

namespace BeSureApi.Models
{
    public class PartIndentDemandList
    {
        public int Id { get; set; }
        public DateTime DemandDate { get; set; }
        public string DemandNumber { get; set; }
        public string PartIndentRequestNumber { get; set; }
        public string Remarks { get; set; }
        public string TenantOfficeName { get; set; }
        public string UnitOfMeasurement { get; set; }
        public string CreatedBy { get; set; }
        public string WorkOrderNumber { get; set; }
        public decimal Quantity { get; set; }
        public string PartName { get; set; }
        public int PartId { get; set; }
        public int RecipientUserId { get; set; }
        public int TenantOfficeId { get; set; }
        public string PartCode { get; set; }
        public int VendorId { get; set; }
        public Decimal Price { get; set; }
        public bool IsCwhAttentionNeeded { get; set; }
        public DateTime? AllocatedOn { get; set; }
        public int? CLPartCount { get; set; }
        public string? Recipient { get; set; }
    }

    public class PartIndentDemandLogistics
    {
        public int Id { get; set; }
        public DateTime DemandDate { get; set; }
        public string DemandNumber { get; set; }
        public string PartIndentRequestNumber { get; set; }
        public string Remarks { get; set; }
        public string TenantOfficeName { get; set; }
        public string UnitOfMeasurement { get; set; }
        public string CreatedBy { get; set; }
        public string WorkOrderNumber { get; set; }
        public decimal Quantity { get; set; }
        public string PartName { get; set; }
        public int PartId { get; set; }
        public int RecipientUserId { get; set; }
        public int TenantOfficeId { get; set; }
        public string PartCode { get; set; }
        public int VendorId { get; set; }
        public Decimal Price { get; set; }
        public bool IsCwhAttentionNeeded { get; set; }
        public DateTime? AllocatedOn { get; set; }
        public int? CLPartCount { get; set; }
        public int StockTypeId { get; set; }
    }

    public class GIRNCreate
    {
        public string Remarks { get; set; }
        public List<PartstockForGIN> GoodsIssueNote { get; set; }
        public List<StockData> PartStockData { get; set; }
    }

    public class StockData
    {
        public int PartStockId { get; set; }
    }
    public class PartstockForGIN
    {
        public int PartIndentDemandId { get; set; }
        public int TenantOfficeId { get; set; }
        public int RecipientUserId { get; set; }
    }

    public class RequestPO
    {
        public int Id { get; set; }
        public int VendorId { get; set; }
        public Decimal Price { get; set; }
        public int StockTypeId { get; set; }
        public int WarrantyPeriod { get; set; }
    }

    public class PartAllocation
    {
        public int PartIndentDemandId { get; set; }
        public int TenantOfficeId { get; set; }
        public List<StockData> PartStockData { get; set; }
    }

    public class IssueParts
    {
        public DeliveryChallan? deliverychallan { get; set; }
        public PartIssue issueparts { get; set; }
        public string Mode { get; set; }
    }

    public class PartIssue
    {
        public int PartIndentDemandId { get; set; }
        public string Remarks { get; set; }
    }
}
