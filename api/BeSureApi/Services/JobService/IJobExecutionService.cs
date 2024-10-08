using System.Data.SqlClient;

namespace BeSureApi.Services.JobService
{
    public interface IJobExecutionService
    {
        Task ExecuteJobs(int retry);
    }
}
