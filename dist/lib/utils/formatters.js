function trim(number) {
    let parts = number.split('.');
    if (!parts[0])
        parts[0] = '0';
    while (parts[0][0] == '0' && parts[0].length > 1)
        parts[0] = parts[0].substring(1);
    return parts[0] + (parts[1] ? ('.' + parts[1]) : '');
}
function validate(number) {
    if (number) {
        number = number.toString();
        if (isNaN(number))
            throw Error("Parameter is not a number: " + number);
        if (number[0] == '+')
            number = number.substring(1);
    }
    else
        number = '0';
    //handle missing leading zero
    if (number.startsWith('.'))
        number = '0' + number;
    else if (number.startsWith('-.'))
        number = '-0' + number.substr(1);
    //handle exponentiation
    if (/e/i.test(number)) {
        let [mantisa, exponent] = number.split(/[eE]/);
        mantisa = trim(mantisa);
        let sign = '';
        if (mantisa[0] == '-') {
            sign = '-';
            mantisa = mantisa.substring(1);
        }
        if (mantisa.indexOf('.') >= 0) {
            exponent = parseInt(exponent) + mantisa.indexOf('.');
            mantisa = mantisa.replace('.', '');
        }
        else {
            exponent = parseInt(exponent) + mantisa.length;
        }
        if (mantisa.length < exponent) {
            number = sign + mantisa + (new Array(exponent - mantisa.length + 1)).join('0');
        }
        else if (mantisa.length >= exponent && exponent > 0) {
            number = sign + trim(mantisa.substring(0, exponent)) +
                ((mantisa.length > exponent) ? ('.' + mantisa.substring(exponent)) : '');
        }
        else {
            number = sign + '0.' + (new Array(-exponent + 1)).join('0') + mantisa;
        }
    }
    return number;
}
export function getPrettyValue(number, digits = 3, separator = ",") {
    if (!(digits || separator)) {
        digits = 3;
        separator = ',';
    }
    else if (!(digits && separator)) {
        throw Error('Illegal Arguments. Should pass both digits and separator or pass none');
    }
    number = validate(number);
    let neg = number.charAt(0) == '-';
    if (neg)
        number = number.substring(1);
    var len = number.indexOf('.');
    len = len > 0 ? len : (number.length);
    var temp = '';
    for (var i = len; i > 0;) {
        if (i < digits) {
            digits = i;
            i = 0;
        }
        else
            i -= digits;
        temp = number.substring(i, i + digits) + ((i < (len - digits) && i >= 0) ? separator : '') + temp;
    }
    return (neg ? '-' : '') + temp + number.substring(len);
}
var RoundingModes;
(function (RoundingModes) {
    RoundingModes[RoundingModes["CEILING"] = 0] = "CEILING";
    RoundingModes[RoundingModes["DOWN"] = 1] = "DOWN";
    RoundingModes[RoundingModes["FLOOR"] = 2] = "FLOOR";
    RoundingModes[RoundingModes["HALF_DOWN"] = 3] = "HALF_DOWN";
    RoundingModes[RoundingModes["HALF_EVEN"] = 4] = "HALF_EVEN";
    RoundingModes[RoundingModes["HALF_UP"] = 5] = "HALF_UP";
    RoundingModes[RoundingModes["UNNECESSARY"] = 6] = "UNNECESSARY";
    RoundingModes[RoundingModes["UP"] = 7] = "UP";
})(RoundingModes || (RoundingModes = {}));
function roundOff(input, n = 0, mode = RoundingModes.HALF_EVEN) {
    if (mode === RoundingModes.UNNECESSARY) {
        throw new Error("UNNECESSARY Rounding Mode has not yet been implemented");
    }
    if (typeof (input) == 'number' || typeof (input) == 'bigint')
        input = input.toString();
    let neg = false;
    if (input[0] === '-') {
        neg = true;
        input = input.substring(1);
    }
    let parts = input.split('.'), partInt = parts[0], partDec = parts[1];
    //handle case of -ve n: roundOff(12564,-2)=12600
    if (n < 0) {
        n = -n;
        if (partInt.length <= n)
            return '0';
        else {
            let prefix = partInt.substr(0, partInt.length - n);
            input = prefix + '.' + partInt.substr(partInt.length - n) + partDec;
            prefix = roundOff(input, 0, mode);
            return (neg ? '-' : '') + prefix + (new Array(n + 1).join('0'));
        }
    }
    // handle case when integer output is desired
    if (n == 0) {
        let l = partInt.length;
        if (greaterThanFive(parts[1], partInt, neg, mode)) {
            partInt = increment(partInt);
        }
        return (neg && parseInt(partInt) ? '-' : '') + partInt;
    }
    // handle case when n>0
    if (!parts[1]) {
        return (neg ? '-' : '') + partInt + '.' + (new Array(n + 1).join('0'));
    }
    else if (parts[1].length < n) {
        return (neg ? '-' : '') + partInt + '.' + parts[1] + (new Array(n - parts[1].length + 1).join('0'));
    }
    partDec = parts[1].substring(0, n);
    let rem = parts[1].substring(n);
    if (rem && greaterThanFive(rem, partDec, neg, mode)) {
        partDec = increment(partDec);
        if (partDec.length > n) {
            return (neg ? '-' : '') + increment(partInt, parseInt(partDec[0])) + '.' + partDec.substring(1);
        }
    }
    return (neg && parseInt(partInt) ? '-' : '') + partInt + '.' + partDec;
}
function greaterThanFive(part, pre, neg, mode) {
    if (!part || part === new Array(part.length + 1).join('0'))
        return false;
    // #region UP, DOWN, CEILING, FLOOR 
    if (mode === RoundingModes.DOWN || (!neg && mode === RoundingModes.FLOOR) ||
        (neg && mode === RoundingModes.CEILING))
        return false;
    if (mode === RoundingModes.UP || (neg && mode === RoundingModes.FLOOR) ||
        (!neg && mode === RoundingModes.CEILING))
        return true;
    // #endregion
    // case when part !== five
    let five = '5' + (new Array(part.length).join('0'));
    if (part > five)
        return true;
    else if (part < five)
        return false;
    // case when part === five
    switch (mode) {
        case RoundingModes.HALF_DOWN: return false;
        case RoundingModes.HALF_UP: return true;
        case RoundingModes.HALF_EVEN:
        default: return (parseInt(pre[pre.length - 1]) % 2 == 1);
    }
}
function increment(part, c = 0) {
    if (!c)
        c = 1;
    if (typeof (part) == 'number')
        part.toString();
    let l = part.length - 1, s = '';
    for (let i = l; i >= 0; i--) {
        let x = parseInt(part[i]) + c;
        if (x == 10) {
            c = 1;
            x = 0;
        }
        else {
            c = 0;
        }
        s += x;
    }
    if (c)
        s += c;
    return s.split('').reverse().join('');
}
export function round(number, precision = 0, mode = RoundingModes.HALF_EVEN) {
    number = validate(number);
    // console.log(number)
    if (isNaN(precision))
        throw Error("Precision is not a number: " + precision);
    return roundOff(number, precision, mode);
}
