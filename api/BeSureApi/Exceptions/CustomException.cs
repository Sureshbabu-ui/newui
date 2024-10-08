using System.ComponentModel;

namespace BeSureApi.Exceptions
{
    public class CustomException: Exception
    {
        public CustomException() { }

        public CustomException(string message)
            : base(message) { }

    }
}
