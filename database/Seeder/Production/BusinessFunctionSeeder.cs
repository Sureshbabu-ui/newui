using database.Models;

namespace database.Seeder.Production
{
    public class BusinessFunctionSeeder
    {
        public IEnumerable<BusinessFunction> GetData()
        {
            return new List<BusinessFunction>
            {
                 new BusinessFunction
                 {
                     Id = 1,
                     BusinessFunctionCode = "CONTRACT_CREATE",
                     BusinessFunctionName = "Contract Create",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 2,
                     BusinessFunctionCode = "CONTRACT_VIEW",
                     BusinessFunctionName = "Contract List",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 3,
                     BusinessFunctionCode = "CONTRACT_REVIEW",
                     BusinessFunctionName = "Contract Review",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 4,
                     BusinessFunctionCode = "CONTRACT_ASSET",
                     BusinessFunctionName = "Contract Asset",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },

                 new BusinessFunction
                 {
                     Id = 5,
                     BusinessFunctionCode = "CONTRACT_CUSTOMER_SITE_CREATE",
                     BusinessFunctionName = "Contract Customer Site",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 6,
                     BusinessFunctionCode = "CONTRACT_ACCOUNTS",
                     BusinessFunctionName = "Contract Accounts",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {

                     Id = 7,
                     BusinessFunctionCode = "BANK_MANAGE",
                     BusinessFunctionName = "Bank Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 8,
                     BusinessFunctionCode = "BANK_VIEW",
                     BusinessFunctionName = "Bank View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 9,
                     BusinessFunctionCode = "LOOKUPDATA_MANAGE",
                     BusinessFunctionName = "Lookupdata Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 10,
                     BusinessFunctionCode = "BUSINESSDIVISION_VIEW",
                     BusinessFunctionName = "Business Division View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 11,
                     BusinessFunctionCode = "BANKBRANCH_VIEW",
                     BusinessFunctionName = "Bank Branch VIEW",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 12,
                     BusinessFunctionCode = "ASSETPRODUCTCATEGORY_VIEW",
                     BusinessFunctionName = "Asset Product Category View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 13,
                     BusinessFunctionCode = "PRODUCT_CATEGORY_PARTS_NOT_COVERED_UPDATE",
                     BusinessFunctionName = "Product Category Parts Not Covered",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 14,
                     BusinessFunctionCode = "MAKE_VIEW",
                     BusinessFunctionName = "Make View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 15,
                     BusinessFunctionCode = "PRODUCTMODEL_MANAGE",
                     BusinessFunctionName = "Product Model Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },

                 new BusinessFunction
                 {
                     Id = 16,
                     BusinessFunctionCode = "PRODUCTMODEL_VIEW",
                     BusinessFunctionName = "Product Model View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 17,
                     BusinessFunctionCode = "PARTCATEGORY_VIEW",
                     BusinessFunctionName = "Part Category View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 18,
                     BusinessFunctionCode = "PART_VIEW",
                     BusinessFunctionName = "Part View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 19,
                     BusinessFunctionCode = "DESIGNATION_VIEW",
                     BusinessFunctionName = "Designation View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 20,
                     BusinessFunctionCode = "ROLE_VIEW",
                     BusinessFunctionName = "Role View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 21,
                     BusinessFunctionCode = "CUSTOMERGROUP_MANAGE",
                     BusinessFunctionName = "Customer Group Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 22,
                     BusinessFunctionCode = "CUSTOMERGROUP_VIEW",
                     BusinessFunctionName = "Customer Group View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 23,
                     BusinessFunctionCode = "PAYMENTFREQUENCY_VIEW",
                     BusinessFunctionName = "Payment Frequency VIEW",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 24,
                     BusinessFunctionCode = "USER_MANAGE",
                     BusinessFunctionName = "User Create",
                     BusinessModuleId = 4,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 25,
                     BusinessFunctionCode = "APPROVAL_VIEW",
                     BusinessFunctionName = "Approval View",
                     BusinessModuleId = 6,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 26,
                     BusinessFunctionCode = "CUSTOMER_CREATE",
                     BusinessFunctionName = "Customer Create",
                     BusinessModuleId = 7,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                 {
                     Id = 27,
                     BusinessFunctionCode = "CUSTOMER_LIST",
                     BusinessFunctionName = "Customer List",
                     BusinessModuleId = 7,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 28,
                     BusinessFunctionCode = "CUSTOMER_VIEW",
                     BusinessFunctionName = "Customer View",
                     BusinessModuleId = 7,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 29,
                     BusinessFunctionCode = "CUSTOMER_PROFILE_DETAILS",
                     BusinessFunctionName = "Customer Profile Details",
                     BusinessModuleId = 7,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 30,
                     BusinessFunctionCode = "CUSTOMERS_CUSTOMER_SITE_CREATE",
                     BusinessFunctionName = "Customers Customer Site Create",
                     BusinessModuleId = 7,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                 {
                     Id = 31,
                     BusinessFunctionCode = "CUSTOMER_SITE_UPLOAD",
                     BusinessFunctionName = "Customer Site Upload",
                     BusinessModuleId = 7,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                 {
                     Id = 32,
                     BusinessFunctionCode = "SERVICE_REQUEST_CREATE",
                     BusinessFunctionName = "Service Request Create",
                     BusinessModuleId = 2,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 33,
                     BusinessFunctionCode = "SERVICE_REQUEST_LIST",
                     BusinessFunctionName = "Service Request List",
                     BusinessModuleId = 2,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 34,
                     BusinessFunctionCode = "SERVICE_REQUEST_DETAILS",
                     BusinessFunctionName = "Service Request Details",
                     BusinessModuleId = 2,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 35,
                     BusinessFunctionCode = "SERVICE_REQUEST_CUSTOMER_DETAILS",
                     BusinessFunctionName = "Service Request Customer Details",
                     BusinessModuleId = 2,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 36,
                     BusinessFunctionCode = "SERVICE_REQUEST_ENGINEER_ASSIGN",
                     BusinessFunctionName = "Service Request Engineer Assign",
                     BusinessModuleId = 2,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 37,
                     BusinessFunctionCode = "ACCEL_MANAGE",
                     BusinessFunctionName = "Accel Manage",
                     BusinessModuleId = 8,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 38,
                     BusinessFunctionCode = "ACCEL_MANAGE_BANK",
                     BusinessFunctionName = "Accel Manage Bank",
                     BusinessModuleId = 8,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 39,
                     BusinessFunctionCode = "APPROVAL_MANAGE",
                     BusinessFunctionName = "Approval Manage", 
                     BusinessModuleId = 6,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 40,
                     BusinessFunctionCode = "USER_VIEW",
                     BusinessFunctionName = "User View",
                     BusinessModuleId = 4,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 41,
                     BusinessFunctionCode = "VENDOR_CREATE",
                     BusinessFunctionName = "Vendor Create",
                     BusinessModuleId = 3,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 42,
                     BusinessFunctionCode = "VENDOR_LIST",
                     BusinessFunctionName = "Vendor List",
                     BusinessModuleId = 3,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 43,
                     BusinessFunctionCode = "CONTRACT_PRE_AMC",
                     BusinessFunctionName = "Contract Pre-Amc",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 44,
                     BusinessFunctionCode = "CONTRACT_BANK_GUARANTEE_EDIT",
                     BusinessFunctionName = "Contract Bank Guarntee Edit",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 45,
                     BusinessFunctionCode = "CONTRACT_BANK_GUARANTEE_CREATE",
                     BusinessFunctionName = "Contract Bank Guarntee Create",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 46,
                     BusinessFunctionCode = "CONTRACT_BANK_GUARANTEE_LIST",
                     BusinessFunctionName = "Contract Bank Guarntee List",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 47,
                     BusinessFunctionCode = "CONTRACT_RENEW",
                     BusinessFunctionName = "Contract Renew",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 48,
                     BusinessFunctionCode = "INVOICEPREREQUISITE_VIEW",
                     BusinessFunctionName = "Invoice Prerequisite View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                 {
                     Id = 49,
                     BusinessFunctionCode = "INVOICEPREREQUISITE_MANAGE",
                     BusinessFunctionName = "Invoice Prerequisite Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                    new BusinessFunction
                 {
                     Id = 50,
                     BusinessFunctionCode = "BANKCOLLECTION_UPLOAD",
                     BusinessFunctionName = "Bank Collection Upload",
                     BusinessModuleId = 9,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                      new BusinessFunction
                 {
                     Id = 51,
                     BusinessFunctionCode = "BANKCOLLECTION_LIST",
                     BusinessFunctionName = "Bank Collection List",
                     BusinessModuleId = 9,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                           new BusinessFunction
                 {
                     Id = 52,
                     BusinessFunctionCode = "BANKCOLLECTION_PROCESS",
                     BusinessFunctionName = "Bank Collection Process",
                     BusinessModuleId = 9,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                              new BusinessFunction
                 {
                     Id = 53,
                     BusinessFunctionCode = "RECEIPT_LIST",
                     BusinessFunctionName = "Receipt List",
                     BusinessModuleId = 10,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                 {
                     Id = 54,
                     BusinessFunctionCode = "RECEIPT_CREATE",
                     BusinessFunctionName = "Receipt Create",
                     BusinessModuleId = 10,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 55,
                     BusinessFunctionCode = "INVOICERECONCILIATION_LIST",
                     BusinessFunctionName = "Invoice Reconciliation List",
                     BusinessModuleId = 11,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 56,
                     BusinessFunctionCode = "STOCKROOM_MANAGE",
                     BusinessFunctionName = "Stock Room Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 57,
                     BusinessFunctionCode = "STOCKROOM_VIEW",
                     BusinessFunctionName = "Stock Room View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 58,
                     BusinessFunctionCode = "STOCKBIN_MANAGE",
                     BusinessFunctionName = "Stock Bin Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 59,
                     BusinessFunctionCode = "STOCKBIN_VIEW",
                     BusinessFunctionName = "Stock Bin View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 60,
                     BusinessFunctionCode = "PARTSTOCK_LIST",
                     BusinessFunctionName = "Part Stock List",
                     BusinessModuleId = 12,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 61,
                     BusinessFunctionCode = "PARTSTOCK_CREATE",
                     BusinessFunctionName = "Part Stock Create",
                     BusinessModuleId = 12,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 62,
                     BusinessFunctionCode = "PARTINDENT_CREATE",
                     BusinessFunctionName = "Part Indent Create",
                     BusinessModuleId = 13,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 63,
                     BusinessFunctionCode = "PARTINDENT_APPROVAL",
                     BusinessFunctionName = "Part Indent Approval",
                     BusinessModuleId = 13,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },    new BusinessFunction
                 {
                     Id = 64,
                     BusinessFunctionCode = "INVOICERECONCILIATION_UPDATE",
                     BusinessFunctionName = "Invoice Reconciliation Update",
                     BusinessModuleId = 11,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 } ,  new BusinessFunction
                 {
                     Id = 65,
                     BusinessFunctionCode = "VENDORBRANCH_CREATE",
                     BusinessFunctionName = "Vendor Branch Create",
                     BusinessModuleId = 3,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 }, new BusinessFunction
                 {
                     Id = 66,
                     BusinessFunctionCode = "VENDORBRANCH_LIST",
                     BusinessFunctionName = "Vendor Branch View",
                     BusinessModuleId = 3,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 }, new BusinessFunction
                 {
                     Id = 67,
                     BusinessFunctionCode = "VENDORBANKACCOUNT_LIST",
                     BusinessFunctionName = "Vendor Bank Account View",
                     BusinessModuleId = 3,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 }, new BusinessFunction
                 {
                     Id = 68,
                     BusinessFunctionCode = "VENDORBANKACCOUNT_CREATE",
                     BusinessFunctionName = "Vendor Bank Account Manage",
                     BusinessModuleId = 3,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                     new BusinessFunction
                 {
                     Id = 69,
                     BusinessFunctionCode = "REVENUERECOGNITION_LIST",
                     BusinessFunctionName = "Revenue Recognition List",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 70,
                     BusinessFunctionCode = "PARTINDENTDEMAND_LIST_FOR_LOGISTICS",
                     BusinessFunctionName = "Part Indent Demands - Logistics",
                     BusinessModuleId = 14,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 71,
                     BusinessFunctionCode = "PARTINDENTDEMAND_CREATE_GIN",
                     BusinessFunctionName = "Part Indent Demand Gin Creation",
                     BusinessModuleId = 14,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                 {
                     Id = 72,
                     BusinessFunctionCode = "PARTINDENTDEMAND_VIEW",
                     BusinessFunctionName = "Part Indent Demand View",
                     BusinessModuleId = 14,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                   new BusinessFunction
                 {
                     Id = 73,
                     BusinessFunctionCode = "PARTINDENTDEMAND_REQUESTPO",
                     BusinessFunctionName = "Request Purchase Order",
                     BusinessModuleId = 14,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                     new BusinessFunction
                 {
                     Id = 74,
                     BusinessFunctionCode = "PARTINDENTDEMAND_CREATEPO",
                     BusinessFunctionName = "Create Purchase Order",
                     BusinessModuleId = 14,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 75,
                     BusinessFunctionCode = "PARTINDENTDEMAND_DOWNLOADPO",
                     BusinessFunctionName = "Download Purchase Order",
                     BusinessModuleId = 14,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                 {
                     Id = 76,
                     BusinessFunctionCode = "PARTINDENTDEMAND_LIST_WAITING_FOR_CWH_ATTENTION",
                     BusinessFunctionName = "Part Indent Demands - CWH",
                     BusinessModuleId = 14,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 77,
                     BusinessFunctionCode = "INVOICE_LIST",
                     BusinessFunctionName = "Invoice List",
                     BusinessModuleId = 15,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },new BusinessFunction
                 {
                     Id = 78,
                     BusinessFunctionCode = "INVOICE_APPROVE",
                     BusinessFunctionName = "Invoice Approve",
                     BusinessModuleId = 15,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                new BusinessFunction
                 {
                     Id = 79,
                     BusinessFunctionCode = "INVOICE_CREATE",
                     BusinessFunctionName = "Invoice Create",
                     BusinessModuleId = 15,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 80,
                     BusinessFunctionCode = "GOODSRECEIVEDNOTE_VIEW",
                     BusinessFunctionName = "Goods Received Note List",
                     BusinessModuleId = 16,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 81,
                     BusinessFunctionCode = "GOODSRECEIVEDNOTE_CREATE",
                     BusinessFunctionName = "Goods Received Note Create",
                     BusinessModuleId = 16,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 82,
                     BusinessFunctionCode = "SERVICE_REQUEST_FINANCE_INTERIM_LIST",
                     BusinessFunctionName = "Finance Interim Calls",
                     BusinessModuleId = 2,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 83,
                     BusinessFunctionCode = "SERVICE_REQUEST_ASSET_INTERIM_LIST",
                     BusinessFunctionName = "Asset Interim Calls",
                     BusinessModuleId = 2,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                 {
                     Id = 84,
                     BusinessFunctionCode = "DELIVERYCHALLAN_CREATE",
                     BusinessFunctionName = "Create Delivery Challan",
                     BusinessModuleId = 17,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                {
                    Id = 85,
                    BusinessFunctionCode = "ALL_USER_LOGIN_HISTORY",
                    BusinessFunctionName = "Users Login History",
                    BusinessModuleId = 4,
                    BusinessFunctionTypeId=275, IsActive =true,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                 new BusinessFunction
                 {
                     Id = 86,
                     BusinessFunctionCode = "BANKBRANCH_MANAGE",
                     BusinessFunctionName = "Bank Branch MANAGE",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                     new BusinessFunction
                 {
                     Id = 87,
                     BusinessFunctionCode = "ASSETPRODUCTCATEGORY_MANAGE",
                     BusinessFunctionName = "Asset Product Category Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                 {
                     Id = 88,
                     BusinessFunctionCode = "BUSINESSDIVISION_MANAGE",
                     BusinessFunctionName = "Business Division Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },

                new BusinessFunction
                 {
                     Id = 89,
                     BusinessFunctionCode = "BUSINESSFUNCTION_VIEW",
                     BusinessFunctionName = "Business Function View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                        new BusinessFunction
                 {
                     Id = 90,
                     BusinessFunctionCode = "BUSINESSMODULE_VIEW",
                     BusinessFunctionName = "Business Module View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                            new BusinessFunction
                 {
                     Id = 91,
                     BusinessFunctionCode = "CITY_VIEW",
                     BusinessFunctionName = "City View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                              new BusinessFunction
                 {
                     Id = 92,
                     BusinessFunctionCode = "DESIGNATION_MANAGE",
                     BusinessFunctionName = "Designation Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                                 new BusinessFunction
                 {
                     Id = 93,
                     BusinessFunctionCode = "LOOKUPDATA_VIEW",
                     BusinessFunctionName = "Lookupdata View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                 {
                     Id = 94,
                     BusinessFunctionCode = "MAKE_MANAGE",
                     BusinessFunctionName = "Make Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                      new BusinessFunction
                 {
                     Id = 95,
                     BusinessFunctionCode = "PART_MANAGE",
                     BusinessFunctionName = "Part Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                        new BusinessFunction
                 {
                     Id = 96,
                     BusinessFunctionCode = "PARTCATEGORY_MANAGE",
                     BusinessFunctionName = "Part Category Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                              new BusinessFunction
                 {
                     Id = 97,
                     BusinessFunctionCode = "PARTPRODUCTCATEGORY_MANAGE",
                     BusinessFunctionName = "Part Product Category Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                     new BusinessFunction
                 {
                     Id = 98,
                     BusinessFunctionCode = "PARTPRODUCTCATEGORY_VIEW",
                     BusinessFunctionName = "Part Product Category View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 99,
                     BusinessFunctionCode = "PAYMENTFREQUENCY_MANAGE",
                     BusinessFunctionName = "Payment Frequency Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 100,
                     BusinessFunctionCode = "ROLE_MANAGE",
                     BusinessFunctionName = "Role Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 101,
                     BusinessFunctionCode = "ROLEPERMISSION_VIEW",
                     BusinessFunctionName = "Role Permission View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 102,
                     BusinessFunctionCode = "ROLEPERMISSION_MANAGE",
                     BusinessFunctionName = "Role Permission Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 103,
                     BusinessFunctionCode = "STATE_VIEW",
                     BusinessFunctionName = "State View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },       new BusinessFunction
                 {
                     Id = 104,
                     BusinessFunctionCode = "BUSINESSEVENT_MANAGE",
                     BusinessFunctionName = "Business Event Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                        new BusinessFunction
                 {
                     Id = 105,
                     BusinessFunctionCode = "BUSINESSEVENT_VIEW",
                     BusinessFunctionName = "Business Event View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                                    new BusinessFunction
                 {
                     Id = 106,
                     BusinessFunctionCode = "PARTSUBCATEGORY_VIEW",
                     BusinessFunctionName = "Part Sub Category View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },            new BusinessFunction
                 {
                     Id = 107,
                     BusinessFunctionCode = "PARTSUBCATEGORY_MANAGE",
                     BusinessFunctionName = "Part Sub Category Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                new BusinessFunction
                 {
                     Id = 108,
                     BusinessFunctionCode = "DELIVERYCHALLAN_VIEW",
                     BusinessFunctionName = "Delivery Challan List",
                     BusinessModuleId = 17,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                new BusinessFunction
                 {
                     Id = 109,
                     BusinessFunctionCode = "PURCHASEORDER_VIEW",
                     BusinessFunctionName = "Purchase Order List",
                     BusinessModuleId = 18,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                new BusinessFunction
                {
                    Id = 110,
                    BusinessFunctionCode = "SERVICEREQUEST_CALLCORDINATOR_VIEW",
                    BusinessFunctionName = "Service Request Call Cordiantor View",
                    BusinessModuleId = 2,
                    BusinessFunctionTypeId=275, IsActive =true,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new BusinessFunction
                {
                    Id = 111,
                    BusinessFunctionCode = "SERVICEREQUEST_CALLCENTRE_VIEW",
                    BusinessFunctionName = "Service Request Call Centre View",
                    BusinessModuleId = 2,
                    BusinessFunctionTypeId=275, IsActive =true,
                    CreatedBy = 10,
                    CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                },
                new BusinessFunction
                 {
                     Id = 112,
                     BusinessFunctionCode = "IMPRESTPURCHASEORDER_MANAGE",
                     BusinessFunctionName = "Bulk Purchase Order Manage",
                     BusinessModuleId = 18,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                new BusinessFunction
                 {
                     Id = 113,
                     BusinessFunctionCode = "IMPRESTSTOCK_MANAGE",
                     BusinessFunctionName = "Imprest Stock Manage",
                     BusinessModuleId = 19,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 114,
                     BusinessFunctionCode = "CITY_MANAGE",
                     BusinessFunctionName = "City Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 115,
                     BusinessFunctionCode = "COUNTRY_MANAGE",
                     BusinessFunctionName = "Country Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 116,
                     BusinessFunctionCode = "COUNTRY_VIEW",
                     BusinessFunctionName = "Country View",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 117,
                     BusinessFunctionCode = "STATE_MANAGE",
                     BusinessFunctionName = "State Manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 118,
                     BusinessFunctionCode = "APPROVALWORKFLOW_VIEW",
                     BusinessFunctionName = "Approval Workflow View",
                     BusinessModuleId = 6,
                     BusinessFunctionTypeId=275, 
                     IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                 {
                     Id = 119,
                     BusinessFunctionCode = "APPROVALWORKFLOW_MANAGE",
                     BusinessFunctionName = "Approval Workflow Manage",
                     BusinessModuleId = 6,
                     BusinessFunctionTypeId=275,
                     IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },

                 new BusinessFunction
                 {
                     Id = 120,
                     BusinessFunctionCode = "CONTRACT_DASHBOARD_BOOKINGDETAIL_VIEW",
                     BusinessFunctionName = "Contract Booked Total Count",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 121,
                     BusinessFunctionCode = "CONTRACT_DASHBOARD_INVOICECOLLECTION_MADE_VIEW",
                     BusinessFunctionName = "Contract Invoice Total Collected Amount",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                 {
                     Id = 122,
                     BusinessFunctionCode = "CONTRACT_DASHBOARD_INVOICECOLLECTION_PENDING_VIEW",
                     BusinessFunctionName = "Contract Invoice Collection Pending Count",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 123,
                     BusinessFunctionCode = "CONTRACT_DASHBOARD_INVOICES_RAISED_VIEW",
                     BusinessFunctionName = "Contract Total Raised Invoices",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessFunction
                 {
                     Id = 124,
                     BusinessFunctionCode = "CONTRACT_DASHBOARD_REVENUERECOGNITION_VIEW",
                     BusinessFunctionName = "Contracts Revenue Recognition Value",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 125,
                     BusinessFunctionCode = "CONTRACT_ACCOUNTS",
                     BusinessFunctionName = "Contract Accounts",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 }, 
                new BusinessFunction
                 {
                     Id = 126,
                     BusinessFunctionCode = "GSTRATE_VIEW",
                     BusinessFunctionName = "GST rate view",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                new BusinessFunction
                 {
                     Id = 127,
                     BusinessFunctionCode = "GSTRATE_MANAGE",
                     BusinessFunctionName = "GST rate manage",
                     BusinessModuleId = 5,
                     BusinessFunctionTypeId=275,
                     IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                      new BusinessFunction
                 {
                     Id = 128,
                     BusinessFunctionCode = "CONTRACT_FUTUREUPDATES_MANAGE",
                     BusinessFunctionName = "Manage Contract Future Updates",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 129,
                     BusinessFunctionCode = "CONTRACT_FUTUREUPDATES_VIEW",
                     BusinessFunctionName = "Contract Future Updates View",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 130,
                     BusinessFunctionCode = "DOCUMENTNUMBERSERIES_VIEW",
                     BusinessFunctionName = "View Document Number Series",
                     BusinessModuleId = 20,
                     BusinessFunctionTypeId=275,
                     IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 131,
                     BusinessFunctionCode = "DOCUMENTNUMBERFORMAT_MANAGE",
                     BusinessFunctionName = "Manage Document Number Format",
                     BusinessModuleId = 20,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 132,
                     BusinessFunctionCode = "DOCUMENTNUMBERFORMAT_VIEW",
                     BusinessFunctionName = "View Document Number Format",
                     BusinessModuleId = 20,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessFunction
                 {
                     Id = 133,
                     BusinessFunctionCode = "CONTRACT_PMSCHEDULE_VIEW",
                     BusinessFunctionName = "Contract PM Schedule",
                     BusinessModuleId = 1,
                     BusinessFunctionTypeId=275, IsActive =true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
            };
        }
    }
}