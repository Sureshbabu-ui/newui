using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class ServiceEngineerVisit
    {
        public int Id { get; set; }
        [ForeignKey("ServiceRequestAssignmentId")]
        public int ServiceRequestAssignmentId { get; set; }
        public ServiceRequestAssignee? ServiceRequestAssignment { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime StartsOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? EndsOn { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(1024)]
        public string? EngineerNote { get; set; }
        [DefaultValue(false)]
        public bool IsRemoteSupport { get; set; }
        public int? DistanceTravelled { get; set; }
        [ForeignKey("MasterEntityData")]
        public int? TravelModeId { get; set; }
        public MasterEntityData? TravelMode { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
    }
}
