using System.Text.Json;
using System;

namespace BeSureApi.Services.JobService.ExecuteCommands
{
    public class SendEmailCommand : IExecuteCommand
    {
        private readonly IEmailService _emailService;
        public SendEmailCommand(IEmailService emailService)
        {
            _emailService = emailService;
        }
        public (int, string) Execute(string param)
        {
            try
            {
                var emailData = new EmailDto();

                emailData = JsonSerializer.Deserialize<EmailDto>(param);
                _emailService.SendEmail(emailData);
                return (0, "");
            }
            catch (Exception ex)
            {

                return (1, ex.Message);
            }
        }
    }
}
