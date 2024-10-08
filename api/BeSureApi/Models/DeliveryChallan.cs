using static QuestPDF.Helpers.Colors;

namespace BeSureApi.Models
{
    public class DeliveryChallan
    {
        public int DcTypeId { get; set; }
        public int? DestinationEmployeeId { get; set; }
        public int? DestinationTenantOfficeId { get; set; }
        public int? DestinationCustomerSiteId { get; set; }
        public int? DestinationVendorId { get; set; }
        public DateTime? LogisticsReceiptDate { get; set; }
        public string? LogisticsReceiptNumber { get; set; }
        public int? LogisticsVendorId { get; set; }
        public int? ModeOfTransport { get; set; }
        public int[] partstocks { get; set; }
        public string? TrackingId { get; set; }
        public string? DCTypeCode { get; set;}
        public string? PartIndentDemandNumber { get; set; }
        public int CreatedBy {  get; set; }
    }

    public class DeliveryChallanList
    {
        public int Id { get; set; }
        public string DcNumber { get; set; }
        public DateTime DcDate { get; set; }
        public string DcType { get; set; }
        public string SourceTenantOffice { get; set; }
        public string IssuedEmployee { get; set; }
        public int SourceTenantOfficeId { get; set; }
        public string DestinationVendor {  get; set; }
        public string DestinationTenantOffice { get; set; }
        public string DestinationEmployee { get; set; }
        public string DcTypeCode { get;}
    }
}
