using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class StateCreate 
    {
        [Required(ErrorMessage = "validation_error_state_create_code_required")]
        [Range(2, int.MaxValue, ErrorMessage = "validation_error_state_create_code_max")]
        public string Code { get; set; }
        public string Name { get; set; }
        public int CountryId { get; set; }
        public string GstStateCode { get; set; }
        public string GstStateName { get; set; }
    }

    public class StateUpdate
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CountryId { get; set; }
        public string GstStateCode { get; set; }
        public string GstStateName { get; set; }
    }
}
