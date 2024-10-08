using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class PartCategory
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string ProductCategory { get; set; }
        public int PartProductCategoryId { get; set; }
        public int MappingId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
    public class PartCategoryCreate
    {
        [Required(ErrorMessage = "validation_error_part_category_create_category_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_part_category_create_name_max")]
        public string Name { get; set; }
        [Required(ErrorMessage = "validation_error_part_category_create_product_category_required")]
        public string ProductCategoryId { get; set; }
    }

    public class PartCategoryEdit
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "validation_error_part_category_edit_category_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_part_category_edit_name_max")]
        public string Name { get; set; }
        [Required(ErrorMessage = "validation_error_part_category_edit_product_category_required")]
        public int PartProductCategoryId { get; set; }
        public int MappingId { get; set; }
    }
}
