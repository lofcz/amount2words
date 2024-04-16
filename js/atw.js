var atw = {
    getLang: (lang) => {
        return lang.toLowerCase() === "cs" || lang.toLowerCase() === "cz" ? "cz" : "en";
    },
    i18n: {
        en: {
            currencies: {
                czk: ["Czech crowns", "Czech crown", "Czech crowns", "hallers", "haller", "hallers"],
                eur: ["Euro", "Euro", "Euro", "cents", "cent", "cents"],
                usd: ["U.S. dollars", "U.S. dollar", "U.S. dollars", "cents", "cent", "cents"],
                gbp: ["pounds", "pound", "pounds", "pence", "penny", "pence"]
            }
        },
        cz: {
            currencies: {
                czk: ["korun českých", "koruna česká", "koruny české", "haléřů", "haléř", "haléře"],
                eur: ["eur", "euro", "eura", "centů", "cent", "centy"],
                usd: ["amerických dolarů", "americký dolar", "americké dolary", "centů", "cent", "centy"],
                gbp: ["britských liber", "britská libra", "britské libry", "pencí", "pence", "pence"]
            }
        }
    },
    amountToWords: (amount, lang = "cz", curr = "czk") => {
        amount = amount.toString();
        curr = curr.toLowerCase();
        lang = lang.toLowerCase();
        
        var number = atw.round_float(parseFloat(amount), 2);
        var decimalStr = "";
        var decimal = (amount.split(".")[1]) ? parseInt((amount.split(".")[1] + "0000").substring(0, 2), 10) : 0;
        var value = Math.floor(number);
        var valueStr = value + "";
        var result;
        var currencyStr = "";
        var currenciesStr = atw.i18n[atw.getLang(lang)].currencies[curr];
        
        if (value < 0) {
            result = "";
        } else if (value === 0 && parseFloat(decimal.toString()) !== 0) {
            result = "";
        } else if (value < 100) {
            currencyStr = currenciesStr[0];
            
            if (value === 1) {
                currencyStr = currenciesStr[1];
            } else if (value > 1 && value <= 4) {
                currencyStr = currenciesStr[2];
            }
            
            result = atw.firstupper(atw.decimalFn(valueStr.substring(valueStr.length - 2, valueStr.length), false, lang)) + " " + currencyStr;
            
            if (value === 1 && lang !== "en") {
                if (curr === "czk" || curr === "gbp") {
                    result = "jedna" + " " + currencyStr;
                } else if (curr === "eur") {
                    result = "jedno" + " " + currencyStr;
                } else if (curr === "usd") {
                    result = "jeden" + " " + currencyStr;
                }
            } else if (value === 2 && lang !== "en") {
                if (curr === "czk" || curr === "eur" || curr === "gbp") {
                    result = "dvě" + " " + currencyStr;
                } else if (curr === "usd") {
                    result = "dva" + " " + currencyStr;
                }
            }
            
        } else if (value < 1000) {
            result = atw.firstupper(atw.hundredsFn(valueStr.substring(valueStr.length - 3, valueStr.length), lang)) + " " + currenciesStr[0];
        } else if (value < 1000000) {
            result = atw.firstupper(atw.thousandsFn(valueStr.substring(valueStr.length - 6, valueStr.length), lang)) + " " + currenciesStr[0];
        } else if (value < 1000000000) {
            result = atw.firstupper(atw.millionsFn(valueStr.substring(valueStr.length - 9, valueStr.length), lang)) + " " + currenciesStr[0];
        } else if (value < 1000000000000) {
            result = atw.firstupper(atw.milliardsFn(valueStr.substring(valueStr.length - 12, valueStr.length), lang)) + " " + currenciesStr[0];
        } else {
            result = "";
        }
        
        if (decimal !== 0) {
            decimalStr = atw.decimalFn(decimal, true, lang);
            
            var cents = currenciesStr[3];
            
            if (decimal === 1) {
                cents = currenciesStr[4];
            } else if (decimal > 1 && decimal <= 4) {
                cents = currenciesStr[5];
            }
            
            result = result + " " + decimalStr + " " + cents;
        }
        return result;
    },
    decimalFn: (value, men, lang) => {
        var valStr = value.toString();
        var units;
        var decimals;
        
        if (lang === "en") {
            units = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
            decimals = ["zero", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
        } else {
            units = ["nula", men ? "jeden" : "jedna", "dva", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět", "deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct"];
            decimals = ["nula", "deset", "dvacet", "třicet", "čtyřicet", "padesát", "šedesát", "sedmdesát", "osmdesát", "devadesát"];
        }
        
        if (value === 0) {
            return units[parseInt(value, 10)];;
        }
        
        if (value < 20) {
            return units[parseInt(value, 10)];
        }

        var value1 = valStr.substring(valStr.length - 1, valStr.length);
        var value2 = valStr.substring(valStr.length - 2, 1);
        
        return parseInt(value1) === 0 ? decimals[parseInt(value2, 10)] : decimals[parseInt(value2, 10)] + " " + units[parseInt(value1, 10)];
    },
    hundredsFn: (value, lang) => {
        var valueStr = value.toString();
        var str = "";
        var units;
        var hundreds;
        
        if (lang === "en") {
            units = "one hundred";
            hundreds = ["zero", "hundred", "two hundred", "three hundred", "four hundred", "five hundred", "six hundred", "seven hundred", "eight hundred", "nine hundred"];
        } else {
            units = "jedno sto";
            hundreds = ["nula", "sto", "dvě sta", "tři sta", "čtyři sta", "pět set", "šest set", "sedm set", "osm set", "devět set"];
        }
        if (value < 100) {
            return atw.decimalFn(valueStr.substring(valueStr.length - 2, valueStr.length), false, lang);
        }

        var value2 = valueStr.substring(valueStr.length - 2, valueStr.length);
        var value3 = valueStr.substring(valueStr.length - 3, 1);
        
        if (parseInt(value3) === 1) {
            str = units;
        } else {
            str = hundreds[parseInt(value3, 10)];
        }
        
        return parseInt(value2) !== 0 ? str + " " + atw.decimalFn(value2, false, lang) : str;
    },
    thousandsFn: (value, lang) => {
        var valueStr = value.toString();
        var str = "";   
        var units;
        var thousands;
        
        if (lang === "en") {
            units = "one";
            thousands = ["zero", "thousand", "thousands", "thousands"];
        } else {
            units = "jeden";
            thousands = ["nula", "tisíc", "tisíce", "tisíců"];
        }
        if (value < 1000) {
            return atw.hundredsFn(valueStr.substring(valueStr.length - 3, valueStr.length), lang);
        }
        if (value < 2000) {
            str = units + " " + thousands[1];
        } else if (value < 5000) {
            str = atw.hundredsFn(valueStr.substring(0, valueStr.length - 3), lang);
            str = str + " " + thousands[2];
        } else {
            str = atw.hundredsFn(valueStr.substring(0, valueStr.length - 3), lang);
            str = str + " " + thousands[3];
        }
        
        var rem = parseInt(valueStr.substring(valueStr.length - 3, valueStr.length));

        if (rem !== 0) {
            str = str + " " + atw.hundredsFn(valueStr.substring(valueStr.length - 3, valueStr.length), lang);
        }
        return str;
    },
    millionsFn: (value, lang) => {
        var valueStr = value.toString();
        var str = "";
        var units;
        var millions;
        
        if (lang === "en") {
            units = "one";
            millions = ["zero", "million", "million", "million"];
        } else {
            units = "jeden";
            millions = ["nula", "milion", "miliony", "milionů"];
        }
        
        if (value < 1000000) {
            return atw.thousandsFn(valueStr.substring(valueStr.length - 6, valueStr.length));
        }
        
        if (value < 2000000) {
            str = units + " " + millions[1];
        } else if (value < 5000000) {
            str = atw.hundredsFn(valueStr.substring(0, valueStr.length - 6), lang);
            str = str + " " + millions[2];
        } else {
            str = atw.hundredsFn(valueStr.substring(0, valueStr.length - 6), lang);
            str = str + " " + millions[3];
        }
        
        var rem = parseInt(valueStr.substring(valueStr.length - 6, valueStr.length));
        
        if (rem !== 0) {
            str = str + " " + atw.thousandsFn(valueStr.substring(valueStr.length - 6, valueStr.length), lang);
        }
        
        return str;
    },
    milliardsFn: (value, lang) => {
        var valueStr = value.toString();
        var units;
        var str = "";
        var milliards;
        
        if (lang === "en") {
            units = "one";
            milliards = ["zero", "billion", "billions", "billions"];
        } else {
            units = "jedna";
            milliards = ["nula", "miliarda", "miliardy", "miliard"];
        }
        if (value < 1000000000) {
            return atw.millionsFn(valueStr.substring(valueStr.length - 9, valueStr.length), lang);
        }
        if (value < 2000000000) {
            str = units + " " + milliards[1];
        } else if (value === 2000000000) {
            str = "dvě" + " " + milliards[2];
        } else if (value < 5000000000) {
            str = atw.hundredsFn(valueStr.substring(0, valueStr.length - 9), lang);
            str = str + " " + milliards[2];
        } else {
            str = atw.thousandsFn(valueStr.substring(0, valueStr.length - 9), lang);
            str = str + " " + milliards[3];
        }
        if (parseInt(valueStr.substring(valueStr.length - 9, valueStr.length)) !== 0) {
            str = str + " " + atw.millionsFn(valueStr.substring(valueStr.length - 9, valueStr.length));
        }
        return str;
    },
    round_float: (x, n) => {
        if (!parseInt(n, 10))
            n = 0;
        if (!parseFloat(x))
            return 0;
        return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
    },
    firstupper: (str) => {
        return str;
    }
}