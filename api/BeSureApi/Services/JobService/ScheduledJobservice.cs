
using Dapper;
using HarfBuzzSharp;
using System.Data;
using System.Data.SqlClient;
using System.Runtime.CompilerServices;
using NCrontab;

namespace BeSureApi.Services.JobService
{
    public class ScheduledJobservice : IScheduledJobService
    {
        private SqlConnection _connection;
        public ScheduledJobservice(IConfiguration configuration)
        {
            _connection = new SqlConnection(configuration.GetConnectionString("DefaultConnection"));
        }
        public async Task CheckAndMoveScheduledJob()
        {
            IEnumerable<PlannedJob> scheduledJobs = await GetAllScheduledJobs();

            foreach (PlannedJob job in scheduledJobs)
            {
                if(IsTimeToExecute(job.Schedule, job.LastRunOn))
                {
                    await MoveToJobQueue(job);
                    await UpdateScheduledJob(job.Id);
                }
            }
        }

        private async Task UpdateScheduledJob(int id)
        {
            var procedure = "plannedjob_update";
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            var resp = await _connection.QueryAsync<PlannedJob>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

        private async Task<IEnumerable<PlannedJob>> GetAllScheduledJobs()
        {
            var procedure = "plannedjob_get_list";

            IEnumerable<PlannedJob> scheduledJobs = await _connection.QueryAsync<PlannedJob>(procedure, commandType: CommandType.StoredProcedure);
            return scheduledJobs;
        }

        private bool IsTimeToExecute(string expression, DateTime lastRunOn)
        {
            if (string.IsNullOrWhiteSpace(expression))
            {
                return false;
            }
            CrontabSchedule schedule = CrontabSchedule.Parse(expression);
            DateTime now = DateTime.Now;

            DateTime nextOccurrence = schedule.GetNextOccurrence(now);
            DateTime secondNextOccurrence = schedule.GetNextOccurrence(nextOccurrence);

            if ((nextOccurrence - lastRunOn) >= (secondNextOccurrence - nextOccurrence))
            {
                return true;
            }
            return false; 
        }

        private async Task<int> MoveToJobQueue(PlannedJob job)
        {
            var procedure = "job_add";
            var parameters = new DynamicParameters();

            parameters.Add("@IsPlannedJob", true);
            parameters.Add("@Priority", 1);
            parameters.Add("@CommandName", job.CommandName);
            parameters.Add("@Params", job.Params);
            parameters.Add("@FailedAttempts", 0);
            parameters.Add("@FailedReason", "not failed");
            parameters.Add("@LastFailedOn", null);
            parameters.Add("@IsCompleted", false);
            parameters.Add("@IsSuccess", false);

            var resp = await _connection.QueryAsync<Job>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return 0;
        }
    }
}
