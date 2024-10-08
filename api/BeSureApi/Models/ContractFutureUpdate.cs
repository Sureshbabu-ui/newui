namespace BeSureApi.Models
{
    public class CreateContractFutureUpdate
    {
        public int ContractId {  get; set; }
        public string? TargetDate { get; set; }
        public string ProbabilityPercentage { get; set; }
        public string RenewedMergedContractNumber { get; set; }
        public int StatusId { get; set; }
        public int SubStatusId { get; set; }
    }

    public class UpdateContractFutureUpdate
    {
        public int Id { get; set; }
        public DateTime? TargetDate { get; set; }
        public int ProbabilityPercentage { get; set; }
        public int StatusId { get; set; }
        public int SubStatusId { get; set; }
    }
}
