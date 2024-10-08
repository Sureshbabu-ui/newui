using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class Part
    {
        public int Id { get; set; }
        public int PartCategoryId { get; set; }
        public string PartCode { get; set; }
        public string PartName { get; set; }
        public string ProductCategoryName { get; set; }
        public string PartCategoryName { get; set; }
        public string? PartSubCategoryName { get; set; }
        public string MakeName { get; set; }
        public string? Description { get; set; }
        public string HsnCode { get; set; }
        public string OemPartNumber { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }

    public class PartListForCall
    {
        public PartListForCall()
        {
            StockTypeId = 0; // Set default value of Id to 0
            Quantity = 0;
        }
        public int Id { get; set; }
        public int PartCategoryId { get; set; }
        public string PartCode { get; set; }
        public string PartName { get; set; }
        public string ProductCategoryName { get; set; }
        public string PartCategoryName { get; set; }
        public string? PartSubCategoryName { get; set; }
        public string MakeName { get; set; }
        public string? Description { get; set; }
        public string HsnCode { get; set; }
        public string OemPartNumber { get; set; }
        public int? StockTypeId { get; set; }
        public int? Quantity { get; set; }
        public bool? IsWarrantyReplacement { get; set; } = false; // Set default value to false
    }
    public class PartCreate
    {
        public string? CaseId { get; set; }
        public int ApprovalFlowId { get; set; }
        [Required(ErrorMessage = "validation_error_part_create_product_category_required")]
        public int ProductCategoryId { get; set; }
        [Required(ErrorMessage = "Part Category is required")]
        public int PartCategoryId { get; set; }
        public int? PartSubCategoryId { get; set; }
        [Required(ErrorMessage = "validation_error_part_create_make_required")]
        public int MakeId { get; set; }        
        public string? HsnCode { get; set; }
        [Required(ErrorMessage = "validation_error_part_create_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_part_create_name_max")]
        public string PartName { get; set; }
        public string? OemPartNumber { get; set; }
         public int CreatedBy { get; set; }
        public string CreatedOn { get; set; }
    }

    public class PartEdit
    {
        public int? Id { get; set; }
        public string? HsnCode { get; set; }
        [Required(ErrorMessage = "validation_error_part_edit_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_part_edit_name_max")]
        public string PartName { get; set; }
    }
    public class PartDetailByCode
    {
        public int? Id {  get; set; }
        public string? HsnCode { get; set; }
        public string? PartName { get; set; }
        public string? OemPartNumber { get; set; }

    }
    public class PartDownloadList
    {
        public string PartCode { get; set; }
        public string PartName { get; set; }
        public string ProductCategoryName { get; set; }
        public string PartCategoryName { get; set; }
        public string? Description { get; set; }
        public string MakeName { get; set; }
        public string HsnCode { get; set; }
        public string OemPartNumber { get; set; }
    }
    public class PartApprovalReviewDetails
    {
        public int? Id { get; set; }
        public int? UserId { get; set; }
        public string? ReviewComment { get; set; }
        public string? ReviewedBy { get; set; }
        public string? ReviewStatus { get; set; }
        public string? CreatedOn { get; set; }
        public string HsnCode { get; set; }
        public string OemPartNumber { get; set; }
    }
    public class PartListForPO
    {
        public PartListForPO()
        {
            Quantity = 0;
        }
        public int Id { get; set; }
        public string PartCode { get; set; }
        public string PartName { get; set; }
        public string? Description { get; set; }
        public string HsnCode { get; set; }
        public string OemPartNumber { get; set; }
        public decimal GstRate { get; set; }
        public int? StockTypeId { get; set; }
        public decimal? Price { get; set; }
        public decimal? Quantity { get; set; }
    }
}
