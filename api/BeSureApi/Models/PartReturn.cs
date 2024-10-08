using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class PartReturnCreate
    {
        public int ServiceRequestId { get; set; }
        public string? PartInfoType { get; set; }
        public string? PartInfoData { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
        public int PartId { get; set; }
        public int? PartStockId { get; set; }
        public int ReturnedPartTypeId { get; set; }
        public string? ReturnRemarks { get; set; }
    }
    public class PartReturnList
    {
        public int Id { get; set; }
        public string? SerialNumber { get; set; }
        public string PartName { get; set; }
        public string ReturnedPartType { get; set; }
        public string? ReturnRemarks { get; set; }
        public string? ReceivingLocation { get; set; }
        public DateTime? ReceivedOn { get; set; }
        public string? ReturnInitiatedBy { get; set; }
        public string? ReceivedRemarks { get; set; }
    }
    public class PartReturnListForGrn
    {
        public int Id { get; set; }
        public string WorkOrderNumber { get; set; }
        public string ReturnedPartType { get; set; }
        public string? SerialNumber { get; set; }
        public string PartName { get; set; }
        public string? ReceivingLocation { get; set; }
        public int? ReceivingLocationId { get; set; }
        public string ReturnInitiatedBy { get; set; }
        public DateTime ReturnInitiatedOn { get; set; }
    }
}
