using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class CreateMasterEntityData
    {
        [Required(ErrorMessage = "validation_error_api_masterdata_create_entitytype_required")]
        public int EntityId { get; set; }
        [Required(ErrorMessage = "validation_error_api_masterdata_create_code_required")]
        public string Code { get; set; }
        [Required(ErrorMessage = "validation_error_api_masterdata_create_name_required")]
        public string Name { get; set; }
        public int IsActive { get; set; }
        public int CreatedBy { get; set; }
    }
    public class SelectedTable
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public bool IsSystemData { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

    }

    public class SelectedEntity
    {
        public int Id { get; set; }
        public string Attributes { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }

    }
    public class UpdateMasterEntityData
    {
        public int Id { get; set; }
        public string Name {  set; get; }
        public int IsActive { get; set; }
        public int ModifiedBy { get; set; }
    }
    public class TableName
    {
        public int Id { get; set; }
        public string EntityType { get; set; }
    }
}