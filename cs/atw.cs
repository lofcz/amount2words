public static class Atw
{
    public enum Languages
    {
        Cz,
        En
    }

    public enum Currencies
    {
        Czk,
        Eur,
        Usd,
        Gbp
    }
    
    public static string AmountToWords(long amount, Languages lang = Languages.Cz, Currencies curr = Currencies.Czk)
    {
        string amountStr = amount.ToString();

        //float number = float.Parse(amountStr); //RoundFloat(float.Parse(amount), 2);
        int decimalVal = amountStr.Split(".").Length > 1 ? int.Parse((amountStr.Split(".")[1] + "0000")[..2]) : 0;
        string valueStr = amount.ToString();
        string result;
        List<string> currenciesStr = CurrenciesDict[lang][curr];

        switch (amount)
        {
            case < 0:
            case 0:
                result = string.Empty;
                break;
            case < 100:
            {
                string currencyStr = amount switch
                {
                    1 => currenciesStr[1],
                    > 1 and <= 4 => currenciesStr[2],
                    _ => currenciesStr[0]
                };

                result = $"{DecimalFn(int.Parse(valueStr.Length >= 2 ? valueStr[^2..] : valueStr), false, lang)} {currencyStr}";

                switch (amount)
                {
                    case 1 when lang is not Languages.En:
                        result = curr switch
                        {
                            Currencies.Czk or Currencies.Gbp => $"jedna {currencyStr}",
                            Currencies.Eur => $"jedno {currencyStr}",
                            Currencies.Usd => $"jeden {currencyStr}",
                            _ => result
                        };
                        break;
                    case 2 when lang is not Languages.En:
                        result = curr switch
                        {
                            Currencies.Czk or Currencies.Eur or Currencies.Gbp => $"dvě {currencyStr}",
                            Currencies.Usd => $"dva {currencyStr}",
                            _ => result
                        };
                        break;
                }

                break;
            }
            case < 1000:
                result = $"{HundredsFn(int.Parse(valueStr.Length > 3 ? valueStr[^3..] : valueStr), lang)} {currenciesStr[0]}";
                break;
            case < 1000000:
                result = $"{ThousandsFn(int.Parse(valueStr.Length > 6 ? valueStr[^6..] : valueStr), lang)} {currenciesStr[0]}";
                break;
            case < 1000000000:
                result = $"{MillionsFn(int.Parse(valueStr.Length > 9 ? valueStr[^9..] : valueStr), lang)} {currenciesStr[0]}";
                break;
            case < 1000000000000:
                result = $"{MilliardsFn(int.Parse(valueStr.Length > 12 ? valueStr[^12..] : valueStr), lang)} {currenciesStr[0]}";
                break;
            default:
                result = string.Empty;
                break;
        }

        if (decimalVal is 0)
        {
            return result;
        }
        
        string decimalStr = DecimalFn(decimalVal, true, lang);

        string cents = decimalVal switch
        {
            1 => currenciesStr[4],
            > 1 and <= 4 => currenciesStr[5],
            _ => currenciesStr[3]
        };

        result = $"{result} {decimalStr} {cents}";
        return result;
    }

    private static readonly Dictionary<Languages, Dictionary<Currencies, List<string>>> CurrenciesDict = new Dictionary<Languages, Dictionary<Currencies, List<string>>>
    {
        { Languages.Cz, new Dictionary<Currencies, List<string>> {
                { Currencies.Czk, ["korun českých", "koruna česká", "koruny české", "haléřů", "haléř", "haléře"] },
                { Currencies.Eur, ["eur", "euro", "eura", "centů", "cent", "centy"] },
                { Currencies.Usd, ["amerických dolarů", "americký dolar", "americké dolary", "centů", "cent", "centy"] },
                { Currencies.Gbp, ["britských liber", "britská libra", "britské libry", "pencí", "pence", "pence"] }
            } 
        },
        { Languages.En, new Dictionary<Currencies, List<string>> {
                { Currencies.Czk, ["Czech crowns", "Czech crown", "Czech crowns", "hallers", "haller", "hallers"] },
                { Currencies.Eur, ["Eur", "Euro", "Eur", "cents", "cent", "cents"] },
                { Currencies.Usd, ["U.S. dollars", "U.S. dollar", "U.S. dollars", "cents", "cent", "cents"] },
                { Currencies.Gbp, ["pounds", "pound", "pounds", "pence", "penny", "pence"] }
            } 
        }
    };

    private static readonly Dictionary<Languages, List<string>> DecimalDecimalsDict = new Dictionary<Languages, List<string>>
    {
        { Languages.Cz, ["nula", "deset", "dvacet", "třicet", "čtyřicet", "padesát", "šedesát", "sedmdesát", "osmdesát", "devadesát"] },
        { Languages.En, ["zero", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"] }
    };

    private static readonly Dictionary<Languages, List<string>> DecimalUnitsDict = new Dictionary<Languages, List<string>>
    {
        { Languages.Cz, ["nula", "jedna", "dva", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět", "deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct"] },
        { Languages.En, ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"] }
    };
    
    private static readonly Dictionary<Languages, List<string>> DecimalUnitsDictDeclensions = new Dictionary<Languages, List<string>>
    {
        { Languages.Cz, ["nula", "jeden", "dva", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět", "deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct"] },
    };
    
    private static readonly Dictionary<Languages, List<string>> HundredsDict = new Dictionary<Languages, List<string>>
    {
        { Languages.Cz, ["nula", "sto", "dvě sta", "tři sta", "čtyři sta", "pět set", "šest set", "sedm set", "osm set", "devět set"] },
        { Languages.En, ["zero", "hundred", "two hundred", "three hundred", "four hundred", "five hundred", "six hundred", "seven hundred", "eight hundred", "nine hundred"] }
    };

    private static readonly Dictionary<Languages, string> HundredsUnitsDict = new Dictionary<Languages, string>
    {
        { Languages.Cz, "jedno sto" },
        { Languages.En, "one hundred" }
    };
    
    private static readonly Dictionary<Languages, List<string>> ThousandsDict = new Dictionary<Languages, List<string>>
    {
        { Languages.Cz, ["nula", "tisíc", "tisíce", "tisíc"] },
        { Languages.En, ["zero", "thousand", "thousands", "thousands"] }
    };
    
    private static readonly Dictionary<Languages, string> ThousandsUnitsDict = new Dictionary<Languages, string>
    {
        { Languages.Cz, "jeden tisíc" },
        { Languages.En, "one thousand" }
    };
    
    private static readonly Dictionary<Languages, List<string>> MillionsDict = new Dictionary<Languages, List<string>>
    {
        { Languages.Cz, ["nula", "milion", "miliony", "milionů"] },
        { Languages.En, ["zero", "million", "million", "million"] }
    };
    
    private static readonly Dictionary<Languages, string> MillionsUnitsDict = new Dictionary<Languages, string>
    {
        { Languages.Cz, "jeden milion" },
        { Languages.En, "one million" }
    };
    
    private static readonly Dictionary<Languages, List<string>> MilliardsDict = new Dictionary<Languages, List<string>>
    {
        { Languages.Cz, ["nula", "miliarda", "miliardy", "miliard"] },
        { Languages.En, ["zero", "billion", "billions", "billions"] }
    };
    
    private static readonly Dictionary<Languages, string> MilliardsUnitsDict = new Dictionary<Languages, string>
    {
        { Languages.Cz, "jedna miliarda" },
        { Languages.En, "one billion" }
    };
    
    private static string DecimalFn(int value, bool men, Languages lang)
    {
        string valStr = value.ToString();
        List<string> units = men && lang is Languages.Cz ? DecimalUnitsDictDeclensions[lang] : DecimalUnitsDict[lang];
        List<string> decimals = DecimalDecimalsDict[lang];

        switch (value)
        {
            case 0:
                return units[0];
            case < 20:
                return units[value];
        }

        string value2 = valStr.Substring(valStr.Length - 2, 1);
        string value1 = valStr[^1..];

        return int.Parse(value1) is 0 ? decimals[int.Parse(value2)] : $"{decimals[int.Parse(value2)]} {units[int.Parse(value1)]}";
    }

    private static string HundredsFn(int value, Languages lang)
    {
        string valueStr = value.ToString();
        string units = HundredsUnitsDict[lang];
        List<string> hundreds = HundredsDict[lang];
        
        if (value < 100)
        {
            return DecimalFn(int.Parse(valueStr.Substring(valueStr.Length - 2, valueStr.Length)), false, lang);
        }

        string value2 = valueStr[^2..];
        string value3 = valueStr.Substring(valueStr.Length - 3, 1);
        string str = int.Parse(value3) is 1 ? units : hundreds[int.Parse(value3)];

        return int.Parse(value2) is not 0 ? $"{str} {DecimalFn(int.Parse(value2), false, lang)}" : str;
    }

    private static string ThousandsFn(int value, Languages lang)
    {
        string valueStr = value.ToString();
        string? str;
        string units = ThousandsUnitsDict[lang];
        List<string> thousands = ThousandsDict[lang];

        switch (value)
        {
            case < 1000:
                return HundredsFn(int.Parse(valueStr[^3..]), lang);
            case < 2000:
                str = units;
                break;
            case < 5000:
                str = $"{HundredsFn(int.Parse(valueStr[..^3]), lang)} {thousands[2]}";
                break;
            default:
                str = $"{HundredsFn(int.Parse(valueStr[..^3]), lang)} {thousands[3]}";
                break;
        }
        
        if (int.Parse(valueStr[^3..]) is not 0)
        {
            str += $" {HundredsFn(int.Parse(valueStr[^3..]), lang)}";
        }

        return str;
    }

    private static string MillionsFn(int value, Languages lang)
    {
        string valueStr = value.ToString();
        string? str;
        string units = MillionsUnitsDict[lang];
        List<string> millions = MillionsDict[lang];
        
        switch (value)
        {
            case < 1000000:
                return ThousandsFn(int.Parse(valueStr[^6..]), lang);
            case < 2000000:
                str = units;
                break;
            case < 5000000:
                str = $"{HundredsFn(int.Parse(valueStr[..^6]), lang)} {millions[2]}";
                break;
            default:
                str = $"{HundredsFn(int.Parse(valueStr[..^6]), lang)} {millions[3]}";
                break;
        }
        
        if (int.Parse(valueStr[^6..]) is not 0)
        {
            str += $" {ThousandsFn(int.Parse(valueStr[^6..]), lang)}";
        }

        return str;
    }

    private static string MilliardsFn(int value, Languages lang)
    {
        string valueStr = value.ToString();
        string units = MilliardsUnitsDict[lang];
        List<string> milliards = MilliardsDict[lang];
        string? str;

        switch (value)
        {
            case < 1000000000:
                return MillionsFn(int.Parse(valueStr[^9..]), lang);
            case < 2000000000:
                str = units;
                break;
            case 2000000000:
                str = lang is Languages.Cz ? "dvě miliardy" : "two billions";
                break;
            default:
                str = $"{HundredsFn(int.Parse(valueStr[..^9]), lang)} {milliards[2]}";
                break;
        }

        if (int.Parse(valueStr[^9..]) is not 0)
        {
            str += $" {MillionsFn(int.Parse(valueStr[^9..]), lang)}";
        }

        return str;
    }
}