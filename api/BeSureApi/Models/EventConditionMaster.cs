namespace BeSureApi.Models
{
    public class EventConditionMasterColumnList
    {
        public int MasterColumnId { get; set; }
        public int MasterTableId { get; set; }
        public int ApprovalEventId { get; set; }
        public string ColumnName { get; set; }
        public string ColumnDisplayName { get; set; }
        public int ColumnSequence { get; set; }
        public string ValueType { get; set; }
        public string TableName { get; set; }
        public int TableSequence { get; set; }
    }
}
