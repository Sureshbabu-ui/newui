using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace BeSureApi.Models
{
    public class ContractManpowerAllocationCreate
    {
            [Required(ErrorMessage = "validation_error_api_create_manpower_allocation_contractid_required")]
            [Range(1, int.MaxValue, ErrorMessage = "validation_error_create_manpower_allocation_contractId_required")]
            public int ContractId { get; set; }
            [Required(ErrorMessage = "validation_error_api_create_manpower_allocation_customersiteid_required")]
            [Range(1, int.MaxValue, ErrorMessage = "validation_error_api_create_manpower_allocation_customersiteid_required")]
            public int CustomerSiteId { get; set; }
            [Required(ErrorMessage = "validation_error_api_create_manpower_allocation_customersiteid_required")]
            [Range(1, int.MaxValue, ErrorMessage = "validation_error_api_create_manpower_allocation_customersiteid_required")]
            public int EmployeeId { get; set; }
            [Required(ErrorMessage = "validation_error_api_create_manpower_allocation_customer_agreed_amount_required")]
            public decimal CustomerAgreedAmount { get; set; }
            [Required(ErrorMessage = "validation_error_api_create_manpower_allocation_budgeted_amount_required")]
            public decimal BudgetedAmount { get; set; }
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public string Remarks { get; set; }
            public int CreatedBy { get; set; }
        }
    public class ContractManpowerAllocationUpdate
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public int CustomerSiteId { get; set; }
        public int EmployeeId { get; set; }
        public int AllocationStatusId { get; set; }
        public decimal CustomerAgreedAmount { get; set; }
        public decimal BudgetedAmount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Remarks { get; set; }
        public int ModifiedBy { get; set; }
    }
    public class ManpowerAllocationList
        {
            public int Id { get; set; }
            public int ContractId { get; set; }
            public string CustomerSite { get; set; }
            public string EmployeeName { get; set; }
            public string CustomerAgreedAmount { get; set; }
            public string BudgetedAmount { get; set; }
            public string MarginAmount { get; set; }
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public string AllocationStatus { get; set; }
            public string Remarks { get; set; }
        }
        public class ManpowerAllocationDetails
        {
            public int Id { get; set; }
            public int ContractId { get; set; }
            public int CustomerSiteId { get; set; }
            public int EmployeeId { get; set; }
            public decimal CustomerAgreedAmount { get; set; }
            public decimal BudgetedAmount { get; set; }
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public int AllocationStatusId { get; set; }
            public string Remarks { get; set; }           
        }
}
