using BeSureApi.Models;
using database.Models;
using System.Runtime.ConstrainedExecution;
using System.Text.Json;

namespace database.Seeder.Production
{
    public class MasterEntitySeeder
    {
        public IEnumerable<MasterEntity> GetData()
        {
            return new List<MasterEntity>
        {
            new MasterEntity { Id = 1,EntityType = "AgreementType",Description = "Agreement Type List",CreatedBy = 10,CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 2, EntityType = "BookingType", Description = "Booking Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 3, EntityType = "ServiceMode", Description = "Service Modes", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 4, EntityType = "PaymentMode", Description = "Payment Modes", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 5, EntityType = "PreventiveMaintenanceFrequency", Description = "Preventive Maintenance Frequency List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 6, EntityType = "Gender", Description = "Gender List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 7, EntityType = "DistanceUnit", Description = "Distance Units", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 8, EntityType = "EngineerType", Description = "Engineer Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 9, EntityType = "EngineerLevel", Description = "Engineer Level List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 10, EntityType = "EngagementType", Description = "Engagement Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 11, EntityType = "ApprovalRequestReviewStatus", Description = "Approval Request Review Status List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 12, EntityType = "Department", Description = "Department List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 13, EntityType = "UserCategory", Description = "User Category List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 14, EntityType = "StockType", Description = "Stock Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 15, EntityType = "SLAType", Description = "SLA Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 16, EntityType = "BankAccountType", Description = "Bank Account Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 17, EntityType = "ContractStatus", Description = "Contract Status List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 18, EntityType = "ServiceWindow", Description = "Service Window List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 19, EntityType = "ManpowerAllocationStatus", Description = "Manpower Allocation Status List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 20, EntityType = "BusinessConstitutionType", Description = "Business Constitution Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 21, EntityType = "BackToBackScope", Description = "Back To Back Scope List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 22, EntityType = "CallType", Description = "Call Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 23, EntityType = "CallSource", Description = "Call Source List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 24, EntityType = "CallStatus", Description = "Call Status List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 25, EntityType = "CustomerContactType", Description = "Customer Contact Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 26, EntityType = "CustomerReportedIssue", Description = "Call Problem Query Nature List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 27, EntityType = "RemoteSupportRejectReason", Description = "Reason For Not Opting Remote Support List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 28, EntityType = "CallCenterReasonForRepair", Description = "Call Center Reason For Repair List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 29, EntityType = "TenantOfficeType", Description = "Tenant Office Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 30, EntityType = "ContractDocumentCategory", Description = "Contract Document Category List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 31, EntityType = "ProductSupportType", Description = "Product Support Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 32, EntityType = "ProductPreAmcCondition", Description = "Product PreAmc Condition List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 33, EntityType = "ContractInvoiceStatus", Description = "Contract Invoice Status List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 34, EntityType = "PanType", Description = "Pan Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 35, EntityType = "PartRequestStatus", Description = "Part Request Status List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 36, EntityType = "InvoiceType", Description = "Invoice Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 37, EntityType = "PaymentMethod", Description = "Payment Method List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 38, EntityType = "GuaranteeType", Description = "Guarantee Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 39, EntityType = "GuaranteeStatus", Description = "Guarantee Status List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 40, EntityType = "CreditPeriod", Description = "Credit Period List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 41, EntityType = "InterimCaseReason", Description = "InterimCase Reason List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 42, EntityType = "BankCollectionStatus", Description = "Bank Collection Status List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 43, EntityType = "AssetAddMode", Description = "Asset Add Modes", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 44, EntityType = "InterimAssetStatus", Description = "Interim Asset Status List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 45, EntityType = "GSTVendorType", Description = "GST Vendor Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 46, EntityType = "UnitOfMeasurement", Description = "Unit Of Measurement List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 47, EntityType = "DemandNoteStatus", Description = "Demand Note Status List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 48, EntityType = "TravelMode", Description = "Travel Mode", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 49, EntityType = "PurchaseOrderStatus", Description = "Purchase Order Status List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 51, EntityType = "PoPaymentTerm", Description = "Purchase Order Payment Terms", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 52, EntityType = "PoShipmentMode", Description = "Purchase Order Shipment Modes", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 53, EntityType = "PoPaymentMode", Description = "Purchase Order Payment Modes", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 54, EntityType = "PoPartDeliveryTerm", Description = "Purchase Order Part Delivery Term", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 55, EntityType = "EngineerCategory", Description = "Engineer Category", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 56, EntityType = "CustomerIndustry", Description = "Customer Industry", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 57, EntityType = "DCType", Description = "Delivery Challan Types", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 58, EntityType = "TransportationMode", Description = "Transportation Modes", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 59, EntityType = "ReturnedPartType", Description = "Returned Part Types", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 60, EntityType = "BusinessUnit", Description = "Business Units", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 61, EntityType = "BusinessFunctionType", Description = "Business Function Types", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 62, EntityType = "VendorType", Description = "Vendor Types", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 63, EntityType = "DocumentType", Description = "Document Types", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 64, EntityType = "CallSeverityLevel", Description = "Call Severity Levels", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 65, EntityType = "ContractFutureUpdateStatus", Description = "Contract Future Update Status", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 66, EntityType = "ContractFutureUpdateSubStatus", Description = "Contract Future Update Sub Status", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 67, EntityType = "UserGrade", Description = "User grades", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")},
            new MasterEntity { Id = 68, EntityType = "GSTType", Description = "Customer Gst Type List", CreatedBy = 10, CreatedOn = DateTime.Parse("2023-04-06 15:32:00")}
            };
        }
    }
}