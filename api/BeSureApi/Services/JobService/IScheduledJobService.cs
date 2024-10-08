using System.Data.SqlClient;

namespace BeSureApi.Services.JobService
{
    public interface IScheduledJobService
    {
        Task CheckAndMoveScheduledJob();
    }
}
