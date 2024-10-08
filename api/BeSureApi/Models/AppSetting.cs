using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class AppSettingUpdate
    {
        [Required(ErrorMessage = "validation_error_appsetting_appkey_required")]
        public string AppKey { get; set; }
        [Required(ErrorMessage = "validation_error_appsetting_appvalue_required")]
        public string AppValue { get; set; }
       
    }
}