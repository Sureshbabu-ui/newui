using database.Models;

namespace database.Seeder.Production
{
    public class BusinessModuleSeeder
    {
        public IEnumerable<BusinessModule> GetData()
        {
            return new List<BusinessModule>
            {
                 new BusinessModule
                 {
                     Id = 1,
                     BusinessModuleName = "Contract",
                     Description = "Contracts module is designed to assist users in managing contracts efficiently with Accel customers. Listing of the contracts are purely based on the logged user category.",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessModule
                 {
                     Id = 2,
                     BusinessModuleName = "Service Request",
                     Description = "Support requests from customers are listed here. Those who haven't an active contract or the requested asset details are not existing in the database, additional approvals needed from the higher authority.",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessModule
                 {
                     Id = 3,
                     BusinessModuleName = "Vendor",
                     Description = "Details about all vendors in the system. Each vendor will have their branches, bank accounts, services list and rate cards",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessModule
                 {
                     Id = 4,
                     BusinessModuleName = "User",
                     Description = "Module to manage all application users. Manage user details, roles, user category, passwords, login history etc. from here.",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessModule
                 {
                     Id = 5,
                     BusinessModuleName = "Master Data",
                     Description = "All master data in the system are managed here. Each master data will have it's own code, name and active status.",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },              
                  new BusinessModule
                 {
                     Id = 6,
                     BusinessModuleName = "Approval",
                     Description = "Approval systems in software streamline and formalize the process of granting authorization for data, enhancing accountability and ensuring compliance by avoiding erroneous or duplicate data.",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessModule
                 {
                     Id = 7,
                     BusinessModuleName = "Customer",
                     Description = "The customer module serves as the centralized database for managing customer information and their business details like sites, contracts etc.",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessModule
                 {
                     Id = 8,
                     BusinessModuleName = "Accel",
                     Description = "Details about Accel regions, locations and basic company information that helps in other modules",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessModule
                 {
                     Id = 9,
                     BusinessModuleName = "Bank Collection",
                     Description = "Manage to upload and map financial collections received in Accel bank accounts as part of the raised contract invoices",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessModule
                 {
                     Id = 10,
                     BusinessModuleName = "Receipt",
                     Description = "Displays receipt generated as part of invoice collections received, processed and mapped  by the finance department",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessModule
                 {
                     Id = 11,
                     BusinessModuleName = "Invoice Reconciliation",
                     Description = "Manages to compare and match invoices with corresponding payments from the customer side",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
      
                 new BusinessModule
                 {
                     Id = 12,
                     BusinessModuleName = "Inventory",
                     Description = "Module to manage the stock of goods or materials that a business holds for production, sale, or distribution",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessModule
                 {
                     Id = 13,
                     BusinessModuleName = "Part Indent",
                     Description = "Manages the creation and listing of specific part requests in a service request to the warehouse.",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessModule
                 {
                     Id = 14,
                     BusinessModuleName = "Part Indent Demand",
                      Description = "Manages the creation and listing of specific part indent demands in a service request to the warehouse.",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessModule
                 {
                     Id = 15,
                     BusinessModuleName = "Contract Invoice",
                     Description = "Manages the approval,creation and listing of contract invoices.",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessModule
                 {
                     Id = 16,
                     BusinessModuleName = "Goods Received Note",
                     Description = "Manages the creation and listing of specific goods received notes and its details",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                  new BusinessModule
                 {
                     Id = 17,
                     BusinessModuleName = "Delivery Challan",
                     Description = "Manages the creation and listing of specific delivery challan and its details",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessModule
                 {
                     Id = 18,
                     BusinessModuleName = "Purchase Order",
                     Description = "Manages the creation and listing of specific purchaseorder and its details",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                 new BusinessModule
                 {
                     Id = 19,
                     BusinessModuleName = "Imprest Stock",
                     Description = "Manages the creation and listing of specific imprest stock and its details",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
                   new BusinessModule
                 {
                     Id = 20,
                     BusinessModuleName = "Settings",
                     Description = "Manages the creation and listing of specific settings and its details",
                     IsActive = true,
                     CreatedBy = 10,
                     CreatedOn = DateTime.Parse("2023-04-06 15:32:00")
                 },
             };
        }
    }
}
