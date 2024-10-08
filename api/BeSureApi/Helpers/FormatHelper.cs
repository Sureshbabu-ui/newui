using NumericWordsConversion;

namespace BeSureApi.Helpers
{
    public class FormatHelper 
    {
        public static string ConvertToRupees(double rupee)
        {
            CurrencyWordsConverter converter = new CurrencyWordsConverter(new CurrencyWordsConversionOptions()
            {
                Culture = Culture.Hindi,
                OutputFormat = OutputFormat.English,
                CurrencyUnitSeparator = "and",
                CurrencyUnit = "Rupee",
                SubCurrencyUnit = "Paise",
                EndOfWordsMarker = ""
            });
            return converter.ToWords((decimal)rupee);
        }
    }
}
