var atw = {
    amountToWords: (amount, lang = "cz", curr = "czk") => {
        amount = amount.toString();
        var number = atw.round_float(parseFloat(amount), 2);
        var desetine_str = '';
        var desetine = (amount.split('.')[1]) ? parseInt((amount.split('.')[1] + '0000').substring(0, 2), 10) : 0;
        var value = Math.floor(number, true);
        var value_str = value + '';
        var cods = {};
        var result = '';
        curr = curr.toUpperCase();
        lang = lang.toLowerCase();

        if (lang == 'en') {
            cods['CZK'] = ['Czech crowns', 'Czech crown', 'Czech crowns', 'haléřů', 'haléř', 'haléře'];
            cods['EUR'] = ['Euro', 'Euro', 'Euro', 'cents', 'cent', 'cents'];
            cods['USD'] = ['U.S. dollars', 'U.S. dollar', 'U.S. dollars', 'cents', 'cent', 'cents'];
            cods['GBP'] = ['pounds', 'pound', 'pounds', 'pence', 'penny', 'pence'];
        } else {
            cods['CZK'] = ['korun českých', 'koruna česká', 'koruny českách', 'haléřů', 'haléř', 'haléře'];
            cods['EUR'] = ['eur', 'euro', 'eura', 'centů', 'cent', 'centy'];
            cods['USD'] = ['amerických dolarů', 'americký dolar', 'americké dolary', 'centů', 'cent', 'centy'];
            cods['GBP'] = ['britských liber', 'britská libra', 'britské libry', 'pencí­', 'pence', 'pence'];
        }
        var codestr = cods[curr];
        var cstring = '';
        if (value < 0) {
            result = '';
        } else if (value == 0 && parseFloat(desetine) != 0) {
            result = '';
        } else if (value < 100) {
            cstring = codestr[0];
            if (value == 1) {
                cstring = codestr[1];
            } else if (value > 1 && value <= 4) {
                cstring = codestr[2];
            }
            result = atw.firstupper(atw.jednotkyAdesitky(value_str.substring(value_str.length - 2, value_str.length), false, lang)) + ' ' + cstring;
            if (value == 1 && lang != 'en') {
                if (curr == 'CZK' || curr == 'GBP') {
                    result = 'jedna' + ' ' + cstring;
                } else if (curr == 'EUR') {
                    result = 'jedno' + ' ' + cstring;
                } else if (curr == 'USD' || curr == 'CHF') {
                    result = 'jeden' + ' ' + cstring;
                }
            } else if (value == 2 && lang != 'en') {
                if (curr == 'CZK' || curr == 'EUR' || curr == 'GBP') {
                    result = 'dvě' + ' ' + cstring;
                } else if (curr == 'USD' || curr == 'CHF') {
                    result = 'dva' + ' ' + cstring;
                }
            }
        } else if (value < 1000) {
            result = atw.firstupper(atw.stovky_fn(value_str.substring(value_str.length - 3, value_str.length), lang)) + ' ' + codestr[0];
        } else if (value < 1000000) {
            result = atw.firstupper(atw.tisice_fn(value_str.substring(value_str.length - 6, value_str.length), lang)) + ' ' + codestr[0];
        } else if (value < 1000000000) {
            result = atw.firstupper(atw.miliony_fn(value_str.substring(value_str.length - 9, value_str.length), lang)) + ' ' + codestr[0];
        } else if (value < 1000000000000) {
            result = atw.firstupper(atw.miliardy_fn(value_str.substring(value_str.length - 12, value_str.length), lang)) + ' ' + codestr[0];
        } else {
            result = '';
        }
        if (desetine != 0) {
            desetine_str = atw.jednotkyAdesitky(desetine, true, lang);
            var cents = codestr[3];
            if (desetine == 1) {
                cents = codestr[4];
            } else if (desetine > 1 && desetine <= 4) {
                cents = codestr[5];
            }
            result = result + ' ' + desetine_str + ' ' + cents;
        }
        return result;
    },
    jednotkyAdesitky: (value, men, lang) => {
        var value_str = value + '';
        var jednotky = [];
        var desitky = [];
        if (lang == 'en') {
            jednotky = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
            desitky = ["nula", "ten", "twenty", "thirty", "fourty", "fifty", "sixty", "seventy", "eighty", "ninety"];
        } else {
            jednotky = ["nula", "jedna", "dva", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět", "deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct"];
            desitky = ["nula", "deset", "dvacet", "třicet", "čtyřicet", "padesát", "šedesát", "sedmdesát", "osmdesát", "devadesát"];
            if (men) {
                jednotky[1] = 'jeden';
            }
        }
        if (value == 0) {
            return jednotky[parseInt(value, 10)];;
        }
        if (value < 20) {
            return jednotky[parseInt(value, 10)];
        }
        value2 = value_str.substring(value_str.length - 2, 1);
        value1 = value_str.substring(value_str.length - 1, value_str.length);
        if (value1 == 0) {
            return desitky[parseInt(value2, 10)];
        }
        return desitky[parseInt(value2, 10)] + ' ' + jednotky[parseInt(value1, 10)];
    },
    stovky_fn: (value, lang) => {
        var value_str = value + '';
        var str = '';
        var jednotk = '';
        var stovky = [];
        if (lang == 'en') {
            jednotk = 'one hundred ';
            stovky = ["zero", "hundred", "two hundred", "three hundred", "four hundred", "five hundred", "six hundred", "seven hundred", "eight hundred", "nine hundred"];
        } else {
            jednotk = 'jedno sto';
            stovky = ["nula", "sto", "dvě sta", "tři sta", "čtyři sta", "pět set", "šest set", "sedm set", "osm set", "devět set"];
        }
        if (value < 100) {
            return atw.jednotkyAdesitky(value_str.substring(value_str.length - 2, value_str.length), false, lang);
        }
        value3 = value_str.substring(value_str.length - 3, 1);
        value2 = value_str.substring(value_str.length - 2, value_str.length);
        if (value3 == 1) {
            str = jednotk;
        } else {
            str = stovky[parseInt(value3, 10)];
        }
        if (value2 != 0)
            str = str + ' ' + atw.jednotkyAdesitky(value2, false, lang);
        return str;
    },
    tisice_fn: (value, lang) => {
        var value_str = value + '';
        var str = '';
        var jednotk = '';
        var tisice = [];
        if (lang == 'en') {
            jednotk = 'one';
            tisice = ["zero", "thousand", "thousands", "thousands"];
        } else {
            jednotk = 'jeden';
            tisice = ["nula", "tisíc", "tisíce", "tisíců"];
        }
        if (value < 1000) {
            return atw.stovky_fn(value_str.substring(value_str.length - 3, value_str.length), lang);
        }
        if (value < 2000) {
            str = jednotk + ' ' + tisice[1];
        } else if (value < 5000) {
            str = atw.stovky_fn(value_str.substring(0, value_str.length - 3), lang);
            str = str + ' ' + tisice[2];
        } else {
            str = atw.stovky_fn(value_str.substring(0, value_str.length - 3), lang);
            str = str + ' ' + tisice[3];
        }
        if (value_str.substring(value_str.length - 3, value_str.length) != 0) {
            str = str + ' ' + atw.stovky_fn(value_str.substring(value_str.length - 3, value_str.length), lang);
        }
        return str;
    },
    miliony_fn: (value, lang) => {
        var value_str = value + '';
        var str = '';
        var jednotk = '';
        var miliony = [];
        if (lang == 'en') {
            jednotk = 'one';
            miliony = ["zero", "million", "million", "million"];
        } else {
            jednotk = 'jeden';
            miliony = ["nula", "milion", "miliony", "milionů"];
        }
        if (value < 1000000) {
            return tisice_fn(value_str.substring(value_str.length - 6, value_str.length));
        }
        if (value < 2000000) {
            str = jednotk + ' ' + miliony[1];
        } else if (value < 5000000) {
            str = atw.stovky_fn(value_str.substring(0, value_str.length - 6), lang);
            str = str + ' ' + miliony[2];
        } else {
            str = atw.stovky_fn(value_str.substring(0, value_str.length - 6), lang);
            str = str + ' ' + miliony[3];
        }
        if (value_str.substring(value_str.length - 6, value_str.length) != 0) {
            str = str + ' ' + atw.tisice_fn(value_str.substring(value_str.length - 6, value_str.length), lang);
        }
        return str;
    },
    miliardy_fn: (value, lang) => {
        var value_str = value + '';
        var jednotk = '';
        var str = '';
        var miliarda = [];
        if (lang == 'en') {
            jednotk = 'one';
            miliarda = ["nula", "billion", "billions", "billions"];
        } else {
            jednotk = 'jedna';
            miliarda = ["nula", "miliarda", "miliardy", "miliard"];
        }
        if (value < 1000000000) {
            return atw.miliony_fn(value_str.substring(value_str.length - 9, value_str.length), lang);
        }
        if (value < 2000000000) {
            str = jednotk + ' ' + miliarda[1];
        } else if (value == 2000000000) {
            str = 'dvě' + ' ' + miliarda[2];
        } else if (value < 5000000000) {
            str = atw.stovky_fn(value_str.substring(0, value_str.length - 9), lang);
            str = str + ' ' + miliarda[2];
        } else {
            str = atw.tisice_fn(value_str.substring(0, value_str.length - 9, lang));
            str = str + ' ' + miliarda[3];
        }
        if (value_str.substring(value_str.length - 9, value_str.length) != 0) {
            str = str + ' ' + atw.miliony_fn(value_str.substring(value_str.length - 9, value_str.length));
        }
        return str;
    },
    round_float: (x, n) => {
        if (!parseInt(n, 10))
            var n = 0;
        if (!parseFloat(x))
            return false;
        return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
    },
    firstupper: (str) => {
        return str;
    }
}