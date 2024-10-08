using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class PreAmcInspectionScheduleUser
    {
        public int Id { get; set; }
        [ForeignKey("PreAmcScheduleId")]
        public int PreAmcScheduleId { get; set; }
        public PreAmcInspectionSchedule? PreAmcInspectionSchedule { get; set; }
        [ForeignKey("UserInfoId")]
        public int UserInfoId { get; set; }
        public UserInfo? UserInfo { get; set; }
        [Column(TypeName = "date")]
        public DateTime PlannedFrom { get; set; }
        [Column(TypeName = "date")]
        public DateTime PlannedTo { get; set; }
        [Column(TypeName = "date")]
        public DateTime? ExecutedFrom { get; set; }
        [Column(TypeName = "date")]
        public DateTime? ExecutedTo { get; set; }
        public bool IsAccepted { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
