using System.Data.SqlClient;
using Dapper;
using System.Data;
using BeSureApi.Services.JobService.ExecuteCommands;


namespace BeSureApi.Services.JobService
{
    public class JobExecutionService : IJobExecutionService
    {
        private SqlConnection _connection;
        private readonly IEmailService _emailService;

        public JobExecutionService(IConfiguration configuration, IEmailService emailService)
        {
            _connection = new SqlConnection(configuration.GetConnectionString("DefaultConnection"));
            _emailService = emailService;
        }

        public async Task ExecuteJobs(int retry)
        {
            IExecuteCommand _executeCommand = null;

            IEnumerable<Job> jobList= await this.GetPendingJobs();
            foreach (Job job in jobList)
            {
                // Add new switch case for newly implemented command.
                switch (job.CommandName)
                {
                    case "SendEmail":
                        _executeCommand = new SendEmailCommand(_emailService);
                        break;
                    default:
                        Console.WriteLine("Invalid command");
                        break;
                }
                if (_executeCommand != null)
                {
                    for (int i = 1; i <= retry; i++)
                    {
                        (int result, string msg) = _executeCommand.Execute(job.Params);
                        if (result == 0)
                        {
                            break;
                        }
                        else if (result == 1 && i == 3 && msg != "")
                        {
                            await AddToFailedJob(job, i, msg);
                        }
                    }
                    await DeleteFromQueue(job.Id);
                }
            }
        }

        private async Task<IEnumerable<Job>> GetPendingJobs()
        {
            var procedure = "job_get_pending_list";

            var parameters = new DynamicParameters();
            parameters.Add("@limit", 10);

            IEnumerable<Job> jobList = await _connection.QueryAsync<Job>(procedure, parameters, commandType: CommandType.StoredProcedure);
            return jobList;
        }

        private async Task AddToFailedJob(Job job, int retry, string reason)
        {
            var procedure = "failedjob_add";
            var parameters = new DynamicParameters();

            parameters.Add("@Id", job.Id);
            parameters.Add("@IsPlannedJob", job.IsPlannedob);
            parameters.Add("@Priority", job.Priority);
            parameters.Add("@CommandName", job.CommandName);
            parameters.Add("@Params", job.Params);
            parameters.Add("@FailedAttempts", retry);
            parameters.Add("@FailedReason", reason);
            parameters.Add("@LastFailedOn", DateTime.Now);
            parameters.Add("@IsCompleted", false);
            parameters.Add("@IsSuccess", false);

            var response = await _connection.QueryAsync<Job>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }

        private async Task DeleteFromQueue(int id)
        {
            var procedure = "job_delete";
            var parameters = new DynamicParameters();

            parameters.Add("@Id", id);

            var response = await _connection.QueryAsync<Job>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }
    }

}
