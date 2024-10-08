using MailKit.Security;
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;
using BeSureApi.Models;
using System.Net.Mail;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;
using System.Text.Json;

namespace BeSureApi.Services.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public void SendEmail(EmailDto request)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_config.GetSection("EmailUserName").Value));
            //TODOS: To be uncommented in production
            //if (request.Cc != null && request.Cc.Any())
            //{
            //    foreach (var toAddress in request.Cc)
            //    {
            //        email.Cc.Add(MailboxAddress.Parse(toAddress));
            //    }
            //}
            var recipientDomain = request.To.Split('@')[1];
            var allowedDomains = new List<string> { "accelits.com", "accel-india.com" };
           if (!allowedDomains.Contains(recipientDomain))
            {
                email.To.Add(MailboxAddress.Parse("basith.aa@accelits.com"));
            }
           else
            {
                email.To.Add(MailboxAddress.Parse(request.To));
            }

            email.Subject = request.Subject;
            email.Body = new TextPart(TextFormat.Html) { Text = request.Body };

            if (request.Attachment != null)
            {
                // Add attachment
                var attachment = new MimePart
                {
                    Content = new MimeContent(new MemoryStream(request.Attachment.Content)),
                    ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                    ContentTransferEncoding = ContentEncoding.Base64,
                    FileName = request.Attachment.FileName
                };

                var multipart = new Multipart("mixed");
                multipart.Add(attachment);
                multipart.Add(email.Body);
                email.Body = multipart;
            }

            using var smtp = new SmtpClient();
            smtp.Connect(_config.GetSection("EmailHost").Value, 587, SecureSocketOptions.StartTls);
            smtp.Authenticate(_config.GetSection("EmailUserName").Value, _config.GetSection("EmailPasscode").Value);
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}




