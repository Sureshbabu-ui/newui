using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class Job
    {
        public int Id { get; set; }
        [DefaultValue(false)]
        public bool IsPlannedob { get; set; }
        public int Priority { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(1024)]
        public string CommandName { get; set; }
        [Column(TypeName = "nvarchar(MAX)")]
        public string Params { get; set; }
        [DefaultValue(0)]
        public int FailedAttempts { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(1024)]
        public string FailedReason { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? LastFailedOn { get; set; }
        [DefaultValue(false)]
        public bool IsCompleted { get; set; }
        public bool IsSuccess { get; set; }
    }
}
