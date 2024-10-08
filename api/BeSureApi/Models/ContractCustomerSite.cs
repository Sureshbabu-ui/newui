using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class ContractCustomerSiteCreate
    {
        [Required(ErrorMessage = "validation_error_contract_customer_site_contract_id_required  ")]
        public int ContractId { get; set; }
        [Required(ErrorMessage = "validation_error_contract_customer_site_customer_name_required")]
        public string? CustomerSiteId { get; set; }
    }
}
