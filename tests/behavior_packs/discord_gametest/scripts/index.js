import * as __WEBPACK_EXTERNAL_MODULE__minecraft_server_fb7572af__ from "@minecraft/server";
import * as __WEBPACK_EXTERNAL_MODULE__minecraft_server_net_e9d6053a__ from "@minecraft/server-net";
import * as __WEBPACK_EXTERNAL_MODULE__minecraft_server_admin_65ac06b4__ from "@minecraft/server-admin";
/******/ var __webpack_modules__ = ({

/***/ 4736:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;var bigInt = (function (undefined) {
    "use strict";

    var BASE = 1e7,
        LOG_BASE = 7,
        MAX_INT = 9007199254740992,
        MAX_INT_ARR = smallToArray(MAX_INT),
        DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

    var supportsNativeBigInt = typeof BigInt === "function";

    function Integer(v, radix, alphabet, caseSensitive) {
        if (typeof v === "undefined") return Integer[0];
        if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
        return parseValue(v);
    }

    function BigInteger(value, sign) {
        this.value = value;
        this.sign = sign;
        this.isSmall = false;
    }
    BigInteger.prototype = Object.create(Integer.prototype);

    function SmallInteger(value) {
        this.value = value;
        this.sign = value < 0;
        this.isSmall = true;
    }
    SmallInteger.prototype = Object.create(Integer.prototype);

    function NativeBigInt(value) {
        this.value = value;
    }
    NativeBigInt.prototype = Object.create(Integer.prototype);

    function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
    }

    function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
        if (n < 1e7)
            return [n];
        if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
    }

    function arrayToSmall(arr) { // If BASE changes this function may need to change
        trim(arr);
        var length = arr.length;
        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length) {
                case 0: return 0;
                case 1: return arr[0];
                case 2: return arr[0] + arr[1] * BASE;
                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
        }
        return arr;
    }

    function trim(v) {
        var i = v.length;
        while (v[--i] === 0);
        v.length = i + 1;
    }

    function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
        var x = new Array(length);
        var i = -1;
        while (++i < length) {
            x[i] = 0;
        }
        return x;
    }

    function truncate(n) {
        if (n > 0) return Math.floor(n);
        return Math.ceil(n);
    }

    function add(a, b) { // assumes a and b are arrays with a.length >= b.length
        var l_a = a.length,
            l_b = b.length,
            r = new Array(l_a),
            carry = 0,
            base = BASE,
            sum, i;
        for (i = 0; i < l_b; i++) {
            sum = a[i] + b[i] + carry;
            carry = sum >= base ? 1 : 0;
            r[i] = sum - carry * base;
        }
        while (i < l_a) {
            sum = a[i] + carry;
            carry = sum === base ? 1 : 0;
            r[i++] = sum - carry * base;
        }
        if (carry > 0) r.push(carry);
        return r;
    }

    function addAny(a, b) {
        if (a.length >= b.length) return add(a, b);
        return add(b, a);
    }

    function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
        var l = a.length,
            r = new Array(l),
            base = BASE,
            sum, i;
        for (i = 0; i < l; i++) {
            sum = a[i] - base + carry;
            carry = Math.floor(sum / base);
            r[i] = sum - carry * base;
            carry += 1;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    BigInteger.prototype.add = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.subtract(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall) {
            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
        }
        return new BigInteger(addAny(a, b), this.sign);
    };
    BigInteger.prototype.plus = BigInteger.prototype.add;

    SmallInteger.prototype.add = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.subtract(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            if (isPrecise(a + b)) return new SmallInteger(a + b);
            b = smallToArray(Math.abs(b));
        }
        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
    };
    SmallInteger.prototype.plus = SmallInteger.prototype.add;

    NativeBigInt.prototype.add = function (v) {
        return new NativeBigInt(this.value + parseValue(v).value);
    }
    NativeBigInt.prototype.plus = NativeBigInt.prototype.add;

    function subtract(a, b) { // assumes a and b are arrays with a >= b
        var a_l = a.length,
            b_l = b.length,
            r = new Array(a_l),
            borrow = 0,
            base = BASE,
            i, difference;
        for (i = 0; i < b_l; i++) {
            difference = a[i] - borrow - b[i];
            if (difference < 0) {
                difference += base;
                borrow = 1;
            } else borrow = 0;
            r[i] = difference;
        }
        for (i = b_l; i < a_l; i++) {
            difference = a[i] - borrow;
            if (difference < 0) difference += base;
            else {
                r[i++] = difference;
                break;
            }
            r[i] = difference;
        }
        for (; i < a_l; i++) {
            r[i] = a[i];
        }
        trim(r);
        return r;
    }

    function subtractAny(a, b, sign) {
        var value;
        if (compareAbs(a, b) >= 0) {
            value = subtract(a, b);
        } else {
            value = subtract(b, a);
            sign = !sign;
        }
        value = arrayToSmall(value);
        if (typeof value === "number") {
            if (sign) value = -value;
            return new SmallInteger(value);
        }
        return new BigInteger(value, sign);
    }

    function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
        var l = a.length,
            r = new Array(l),
            carry = -b,
            base = BASE,
            i, difference;
        for (i = 0; i < l; i++) {
            difference = a[i] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            r[i] = difference < 0 ? difference + base : difference;
        }
        r = arrayToSmall(r);
        if (typeof r === "number") {
            if (sign) r = -r;
            return new SmallInteger(r);
        } return new BigInteger(r, sign);
    }

    BigInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.add(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall)
            return subtractSmall(a, Math.abs(b), this.sign);
        return subtractAny(a, b, this.sign);
    };
    BigInteger.prototype.minus = BigInteger.prototype.subtract;

    SmallInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.add(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            return new SmallInteger(a - b);
        }
        return subtractSmall(b, Math.abs(a), a >= 0);
    };
    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

    NativeBigInt.prototype.subtract = function (v) {
        return new NativeBigInt(this.value - parseValue(v).value);
    }
    NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;

    BigInteger.prototype.negate = function () {
        return new BigInteger(this.value, !this.sign);
    };
    SmallInteger.prototype.negate = function () {
        var sign = this.sign;
        var small = new SmallInteger(-this.value);
        small.sign = !sign;
        return small;
    };
    NativeBigInt.prototype.negate = function () {
        return new NativeBigInt(-this.value);
    }

    BigInteger.prototype.abs = function () {
        return new BigInteger(this.value, false);
    };
    SmallInteger.prototype.abs = function () {
        return new SmallInteger(Math.abs(this.value));
    };
    NativeBigInt.prototype.abs = function () {
        return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
    }


    function multiplyLong(a, b) {
        var a_l = a.length,
            b_l = b.length,
            l = a_l + b_l,
            r = createArray(l),
            base = BASE,
            product, carry, i, a_i, b_j;
        for (i = 0; i < a_l; ++i) {
            a_i = a[i];
            for (var j = 0; j < b_l; ++j) {
                b_j = b[j];
                product = a_i * b_j + r[i + j];
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
                r[i + j + 1] += carry;
            }
        }
        trim(r);
        return r;
    }

    function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
        var l = a.length,
            r = new Array(l),
            base = BASE,
            carry = 0,
            product, i;
        for (i = 0; i < l; i++) {
            product = a[i] * b + carry;
            carry = Math.floor(product / base);
            r[i] = product - carry * base;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    function shiftLeft(x, n) {
        var r = [];
        while (n-- > 0) r.push(0);
        return r.concat(x);
    }

    function multiplyKaratsuba(x, y) {
        var n = Math.max(x.length, y.length);

        if (n <= 30) return multiplyLong(x, y);
        n = Math.ceil(n / 2);

        var b = x.slice(n),
            a = x.slice(0, n),
            d = y.slice(n),
            c = y.slice(0, n);

        var ac = multiplyKaratsuba(a, c),
            bd = multiplyKaratsuba(b, d),
            abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim(product);
        return product;
    }

    // The following function is derived from a surface fit of a graph plotting the performance difference
    // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
    function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
    }

    BigInteger.prototype.multiply = function (v) {
        var n = parseValue(v),
            a = this.value, b = n.value,
            sign = this.sign !== n.sign,
            abs;
        if (n.isSmall) {
            if (b === 0) return Integer[0];
            if (b === 1) return this;
            if (b === -1) return this.negate();
            abs = Math.abs(b);
            if (abs < BASE) {
                return new BigInteger(multiplySmall(a, abs), sign);
            }
            b = smallToArray(abs);
        }
        if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
            return new BigInteger(multiplyKaratsuba(a, b), sign);
        return new BigInteger(multiplyLong(a, b), sign);
    };

    BigInteger.prototype.times = BigInteger.prototype.multiply;

    function multiplySmallAndArray(a, b, sign) { // a >= 0
        if (a < BASE) {
            return new BigInteger(multiplySmall(b, a), sign);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
    }
    SmallInteger.prototype._multiplyBySmall = function (a) {
        if (isPrecise(a.value * this.value)) {
            return new SmallInteger(a.value * this.value);
        }
        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
    };
    BigInteger.prototype._multiplyBySmall = function (a) {
        if (a.value === 0) return Integer[0];
        if (a.value === 1) return this;
        if (a.value === -1) return this.negate();
        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
    };
    SmallInteger.prototype.multiply = function (v) {
        return parseValue(v)._multiplyBySmall(this);
    };
    SmallInteger.prototype.times = SmallInteger.prototype.multiply;

    NativeBigInt.prototype.multiply = function (v) {
        return new NativeBigInt(this.value * parseValue(v).value);
    }
    NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;

    function square(a) {
        //console.assert(2 * BASE * BASE < MAX_INT);
        var l = a.length,
            r = createArray(l + l),
            base = BASE,
            product, carry, i, a_i, a_j;
        for (i = 0; i < l; i++) {
            a_i = a[i];
            carry = 0 - a_i * a_i;
            for (var j = i; j < l; j++) {
                a_j = a[j];
                product = 2 * (a_i * a_j) + r[i + j] + carry;
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
            }
            r[i + l] = carry;
        }
        trim(r);
        return r;
    }

    BigInteger.prototype.square = function () {
        return new BigInteger(square(this.value), false);
    };

    SmallInteger.prototype.square = function () {
        var value = this.value * this.value;
        if (isPrecise(value)) return new SmallInteger(value);
        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
    };

    NativeBigInt.prototype.square = function (v) {
        return new NativeBigInt(this.value * this.value);
    }

    function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
        var a_l = a.length,
            b_l = b.length,
            base = BASE,
            result = createArray(b.length),
            divisorMostSignificantDigit = b[b_l - 1],
            // normalization
            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
            remainder = multiplySmall(a, lambda),
            divisor = multiplySmall(b, lambda),
            quotientDigit, shift, carry, borrow, i, l, q;
        if (remainder.length <= a_l) remainder.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base - 1;
            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
                quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            // quotientDigit <= base - 1
            carry = 0;
            borrow = 0;
            l = divisor.length;
            for (i = 0; i < l; i++) {
                carry += quotientDigit * divisor[i];
                q = Math.floor(carry / base);
                borrow += remainder[shift + i] - (carry - q * base);
                carry = q;
                if (borrow < 0) {
                    remainder[shift + i] = borrow + base;
                    borrow = -1;
                } else {
                    remainder[shift + i] = borrow;
                    borrow = 0;
                }
            }
            while (borrow !== 0) {
                quotientDigit -= 1;
                carry = 0;
                for (i = 0; i < l; i++) {
                    carry += remainder[shift + i] - base + divisor[i];
                    if (carry < 0) {
                        remainder[shift + i] = carry + base;
                        carry = 0;
                    } else {
                        remainder[shift + i] = carry;
                        carry = 1;
                    }
                }
                borrow += carry;
            }
            result[shift] = quotientDigit;
        }
        // denormalization
        remainder = divModSmall(remainder, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder)];
    }

    function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
        // Performs faster than divMod1 on larger input sizes.
        var a_l = a.length,
            b_l = b.length,
            result = [],
            part = [],
            base = BASE,
            guess, xlen, highx, highy, check;
        while (a_l) {
            part.unshift(a[--a_l]);
            trim(part);
            if (compareAbs(part, b) < 0) {
                result.push(0);
                continue;
            }
            xlen = part.length;
            highx = part[xlen - 1] * base + part[xlen - 2];
            highy = b[b_l - 1] * base + b[b_l - 2];
            if (xlen > b_l) {
                highx = (highx + 1) * base;
            }
            guess = Math.ceil(highx / highy);
            do {
                check = multiplySmall(b, guess);
                if (compareAbs(check, part) <= 0) break;
                guess--;
            } while (guess);
            result.push(guess);
            part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
    }

    function divModSmall(value, lambda) {
        var length = value.length,
            quotient = createArray(length),
            base = BASE,
            i, q, remainder, divisor;
        remainder = 0;
        for (i = length - 1; i >= 0; --i) {
            divisor = remainder * base + value[i];
            q = truncate(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i] = q | 0;
        }
        return [quotient, remainder | 0];
    }

    function divModAny(self, v) {
        var value, n = parseValue(v);
        if (supportsNativeBigInt) {
            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
        }
        var a = self.value, b = n.value;
        var quotient;
        if (b === 0) throw new Error("Cannot divide by zero");
        if (self.isSmall) {
            if (n.isSmall) {
                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [Integer[0], self];
        }
        if (n.isSmall) {
            if (b === 1) return [self, Integer[0]];
            if (b == -1) return [self.negate(), Integer[0]];
            var abs = Math.abs(b);
            if (abs < BASE) {
                value = divModSmall(a, abs);
                quotient = arrayToSmall(value[0]);
                var remainder = value[1];
                if (self.sign) remainder = -remainder;
                if (typeof quotient === "number") {
                    if (self.sign !== n.sign) quotient = -quotient;
                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
                }
                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs);
        }
        var comparison = compareAbs(a, b);
        if (comparison === -1) return [Integer[0], self];
        if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

        // divMod1 is faster on smaller input sizes
        if (a.length + b.length <= 200)
            value = divMod1(a, b);
        else value = divMod2(a, b);

        quotient = value[0];
        var qSign = self.sign !== n.sign,
            mod = value[1],
            mSign = self.sign;
        if (typeof quotient === "number") {
            if (qSign) quotient = -quotient;
            quotient = new SmallInteger(quotient);
        } else quotient = new BigInteger(quotient, qSign);
        if (typeof mod === "number") {
            if (mSign) mod = -mod;
            mod = new SmallInteger(mod);
        } else mod = new BigInteger(mod, mSign);
        return [quotient, mod];
    }

    BigInteger.prototype.divmod = function (v) {
        var result = divModAny(this, v);
        return {
            quotient: result[0],
            remainder: result[1]
        };
    };
    NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;


    BigInteger.prototype.divide = function (v) {
        return divModAny(this, v)[0];
    };
    NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function (v) {
        return new NativeBigInt(this.value / parseValue(v).value);
    };
    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

    BigInteger.prototype.mod = function (v) {
        return divModAny(this, v)[1];
    };
    NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function (v) {
        return new NativeBigInt(this.value % parseValue(v).value);
    };
    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

    BigInteger.prototype.pow = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value,
            value, x, y;
        if (b === 0) return Integer[1];
        if (a === 0) return Integer[0];
        if (a === 1) return Integer[1];
        if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.sign) {
            return Integer[0];
        }
        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
        if (this.isSmall) {
            if (isPrecise(value = Math.pow(a, b)))
                return new SmallInteger(truncate(value));
        }
        x = this;
        y = Integer[1];
        while (true) {
            if (b & 1 === 1) {
                y = y.times(x);
                --b;
            }
            if (b === 0) break;
            b /= 2;
            x = x.square();
        }
        return y;
    };
    SmallInteger.prototype.pow = BigInteger.prototype.pow;

    NativeBigInt.prototype.pow = function (v) {
        var n = parseValue(v);
        var a = this.value, b = n.value;
        var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
        if (b === _0) return Integer[1];
        if (a === _0) return Integer[0];
        if (a === _1) return Integer[1];
        if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.isNegative()) return new NativeBigInt(_0);
        var x = this;
        var y = Integer[1];
        while (true) {
            if ((b & _1) === _1) {
                y = y.times(x);
                --b;
            }
            if (b === _0) break;
            b /= _2;
            x = x.square();
        }
        return y;
    }

    BigInteger.prototype.modPow = function (exp, mod) {
        exp = parseValue(exp);
        mod = parseValue(mod);
        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
        var r = Integer[1],
            base = this.mod(mod);
        if (exp.isNegative()) {
            exp = exp.multiply(Integer[-1]);
            base = base.modInv(mod);
        }
        while (exp.isPositive()) {
            if (base.isZero()) return Integer[0];
            if (exp.isOdd()) r = r.multiply(base).mod(mod);
            exp = exp.divide(2);
            base = base.square().mod(mod);
        }
        return r;
    };
    NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

    function compareAbs(a, b) {
        if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
        }
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    }

    BigInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) return 1;
        return compareAbs(a, b);
    };
    SmallInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = Math.abs(this.value),
            b = n.value;
        if (n.isSmall) {
            b = Math.abs(b);
            return a === b ? 0 : a > b ? 1 : -1;
        }
        return -1;
    };
    NativeBigInt.prototype.compareAbs = function (v) {
        var a = this.value;
        var b = parseValue(v).value;
        a = a >= 0 ? a : -a;
        b = b >= 0 ? b : -b;
        return a === b ? 0 : a > b ? 1 : -1;
    }

    BigInteger.prototype.compare = function (v) {
        // See discussion about comparison with Infinity:
        // https://github.com/peterolson/BigInteger.js/issues/61
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (this.sign !== n.sign) {
            return n.sign ? 1 : -1;
        }
        if (n.isSmall) {
            return this.sign ? -1 : 1;
        }
        return compareAbs(a, b) * (this.sign ? -1 : 1);
    };
    BigInteger.prototype.compareTo = BigInteger.prototype.compare;

    SmallInteger.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) {
            return a == b ? 0 : a > b ? 1 : -1;
        }
        if (a < 0 !== n.sign) {
            return a < 0 ? -1 : 1;
        }
        return a < 0 ? 1 : -1;
    };
    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

    NativeBigInt.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }
        var a = this.value;
        var b = parseValue(v).value;
        return a === b ? 0 : a > b ? 1 : -1;
    }
    NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;

    BigInteger.prototype.equals = function (v) {
        return this.compare(v) === 0;
    };
    NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

    BigInteger.prototype.notEquals = function (v) {
        return this.compare(v) !== 0;
    };
    NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

    BigInteger.prototype.greater = function (v) {
        return this.compare(v) > 0;
    };
    NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

    BigInteger.prototype.lesser = function (v) {
        return this.compare(v) < 0;
    };
    NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

    BigInteger.prototype.greaterOrEquals = function (v) {
        return this.compare(v) >= 0;
    };
    NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

    BigInteger.prototype.lesserOrEquals = function (v) {
        return this.compare(v) <= 0;
    };
    NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

    BigInteger.prototype.isEven = function () {
        return (this.value[0] & 1) === 0;
    };
    SmallInteger.prototype.isEven = function () {
        return (this.value & 1) === 0;
    };
    NativeBigInt.prototype.isEven = function () {
        return (this.value & BigInt(1)) === BigInt(0);
    }

    BigInteger.prototype.isOdd = function () {
        return (this.value[0] & 1) === 1;
    };
    SmallInteger.prototype.isOdd = function () {
        return (this.value & 1) === 1;
    };
    NativeBigInt.prototype.isOdd = function () {
        return (this.value & BigInt(1)) === BigInt(1);
    }

    BigInteger.prototype.isPositive = function () {
        return !this.sign;
    };
    SmallInteger.prototype.isPositive = function () {
        return this.value > 0;
    };
    NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;

    BigInteger.prototype.isNegative = function () {
        return this.sign;
    };
    SmallInteger.prototype.isNegative = function () {
        return this.value < 0;
    };
    NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;

    BigInteger.prototype.isUnit = function () {
        return false;
    };
    SmallInteger.prototype.isUnit = function () {
        return Math.abs(this.value) === 1;
    };
    NativeBigInt.prototype.isUnit = function () {
        return this.abs().value === BigInt(1);
    }

    BigInteger.prototype.isZero = function () {
        return false;
    };
    SmallInteger.prototype.isZero = function () {
        return this.value === 0;
    };
    NativeBigInt.prototype.isZero = function () {
        return this.value === BigInt(0);
    }

    BigInteger.prototype.isDivisibleBy = function (v) {
        var n = parseValue(v);
        if (n.isZero()) return false;
        if (n.isUnit()) return true;
        if (n.compareAbs(2) === 0) return this.isEven();
        return this.mod(n).isZero();
    };
    NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

    function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit()) return false;
        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
        if (n.lesser(49)) return true;
        // we don't know if it's prime: let the other functions figure it out
    }

    function millerRabinTest(n, a) {
        var nPrev = n.prev(),
            b = nPrev,
            r = 0,
            d, t, i, x;
        while (b.isEven()) b = b.divide(2), r++;
        next: for (i = 0; i < a.length; i++) {
            if (n.lesser(a[i])) continue;
            x = bigInt(a[i]).modPow(b, n);
            if (x.isUnit() || x.equals(nPrev)) continue;
            for (d = r - 1; d != 0; d--) {
                x = x.square().mod(n);
                if (x.isUnit()) return false;
                if (x.equals(nPrev)) continue next;
            }
            return false;
        }
        return true;
    }

    // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
    BigInteger.prototype.isPrime = function (strict) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined) return isPrime;
        var n = this.abs();
        var bits = n.bitLength();
        if (bits <= 64)
            return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
        var logN = Math.log(2) * bits.toJSNumber();
        var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt(i + 2));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

    BigInteger.prototype.isProbablePrime = function (iterations, rng) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined) return isPrime;
        var n = this.abs();
        var t = iterations === undefined ? 5 : iterations;
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt.randBetween(2, n.minus(2), rng));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

    BigInteger.prototype.modInv = function (n) {
        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.isZero()) {
            q = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q.multiply(newT));
            newR = lastR.subtract(q.multiply(newR));
        }
        if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t.compare(0) === -1) {
            t = t.add(n);
        }
        if (this.isNegative()) {
            return t.negate();
        }
        return t;
    };

    NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

    BigInteger.prototype.next = function () {
        var value = this.value;
        if (this.sign) {
            return subtractSmall(value, 1, this.sign);
        }
        return new BigInteger(addSmall(value, 1), this.sign);
    };
    SmallInteger.prototype.next = function () {
        var value = this.value;
        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
        return new BigInteger(MAX_INT_ARR, false);
    };
    NativeBigInt.prototype.next = function () {
        return new NativeBigInt(this.value + BigInt(1));
    }

    BigInteger.prototype.prev = function () {
        var value = this.value;
        if (this.sign) {
            return new BigInteger(addSmall(value, 1), true);
        }
        return subtractSmall(value, 1, this.sign);
    };
    SmallInteger.prototype.prev = function () {
        var value = this.value;
        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
        return new BigInteger(MAX_INT_ARR, true);
    };
    NativeBigInt.prototype.prev = function () {
        return new NativeBigInt(this.value - BigInt(1));
    }

    var powersOfTwo = [1];
    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

    function shift_isSmall(n) {
        return Math.abs(n) <= BASE;
    }

    BigInteger.prototype.shiftLeft = function (v) {
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftRight(-n);
        var result = this;
        if (result.isZero()) return result;
        while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
    };
    NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

    BigInteger.prototype.shiftRight = function (v) {
        var remQuo;
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
            if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
    };
    NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

    function bitwise(x, y, fn) {
        y = parseValue(y);
        var xSign = x.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x.not() : x,
            yRem = ySign ? y.not() : y;
        var xDigit = 0, yDigit = 0;
        var xDivMod = null, yDivMod = null;
        var result = [];
        while (!xRem.isZero() || !yRem.isZero()) {
            xDivMod = divModAny(xRem, highestPower2);
            xDigit = xDivMod[1].toJSNumber();
            if (xSign) {
                xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
            }

            yDivMod = divModAny(yRem, highestPower2);
            yDigit = yDivMod[1].toJSNumber();
            if (ySign) {
                yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
            }

            xRem = xDivMod[0];
            yRem = yDivMod[0];
            result.push(fn(xDigit, yDigit));
        }
        var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
        for (var i = result.length - 1; i >= 0; i -= 1) {
            sum = sum.multiply(highestPower2).add(bigInt(result[i]));
        }
        return sum;
    }

    BigInteger.prototype.not = function () {
        return this.negate().prev();
    };
    NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;

    BigInteger.prototype.and = function (n) {
        return bitwise(this, n, function (a, b) { return a & b; });
    };
    NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;

    BigInteger.prototype.or = function (n) {
        return bitwise(this, n, function (a, b) { return a | b; });
    };
    NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;

    BigInteger.prototype.xor = function (n) {
        return bitwise(this, n, function (a, b) { return a ^ b; });
    };
    NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;

    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
    function roughLOB(n) { // get lowestOneBit (rough)
        // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
        // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
        var v = n.value,
            x = typeof v === "number" ? v | LOBMASK_I :
                typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
                    v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
    }

    function integerLogarithm(value, base) {
        if (base.compareTo(value) <= 0) {
            var tmp = integerLogarithm(value, base.square(base));
            var p = tmp.p;
            var e = tmp.e;
            var t = p.multiply(base);
            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
        }
        return { p: bigInt(1), e: 0 };
    }

    BigInteger.prototype.bitLength = function () {
        var n = this;
        if (n.compareTo(bigInt(0)) < 0) {
            n = n.negate().subtract(bigInt(1));
        }
        if (n.compareTo(bigInt(0)) === 0) {
            return bigInt(0);
        }
        return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
    }
    NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

    function max(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
    }
    function min(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
    }
    function gcd(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b)) return a;
        if (a.isZero()) return b;
        if (b.isZero()) return a;
        var c = Integer[1], d, t;
        while (a.isEven() && b.isEven()) {
            d = min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
        }
        while (a.isEven()) {
            a = a.divide(roughLOB(a));
        }
        do {
            while (b.isEven()) {
                b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
                t = b; b = a; a = t;
            }
            b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
    }
    function lcm(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
    }
    function randBetween(a, b, rng) {
        a = parseValue(a);
        b = parseValue(b);
        var usedRNG = rng || Math.random;
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low).add(1);
        if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
        var digits = toBase(range, BASE).value;
        var result = [], restricted = true;
        for (var i = 0; i < digits.length; i++) {
            var top = restricted ? digits[i] + (i + 1 < digits.length ? digits[i + 1] / BASE : 0) : BASE;
            var digit = truncate(usedRNG() * top);
            result.push(digit);
            if (digit < digits[i]) restricted = false;
        }
        return low.add(Integer.fromArray(result, BASE, false));
    }

    var parseBase = function (text, base, alphabet, caseSensitive) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        text = String(text);
        if (!caseSensitive) {
            text = text.toLowerCase();
            alphabet = alphabet.toLowerCase();
        }
        var length = text.length;
        var i;
        var absBase = Math.abs(base);
        var alphabetValues = {};
        for (i = 0; i < alphabet.length; i++) {
            alphabetValues[alphabet[i]] = i;
        }
        for (i = 0; i < length; i++) {
            var c = text[i];
            if (c === "-") continue;
            if (c in alphabetValues) {
                if (alphabetValues[c] >= absBase) {
                    if (c === "1" && absBase === 1) continue;
                    throw new Error(c + " is not a valid digit in base " + base + ".");
                }
            }
        }
        base = parseValue(base);
        var digits = [];
        var isNegative = text[0] === "-";
        for (i = isNegative ? 1 : 0; i < text.length; i++) {
            var c = text[i];
            if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
            else if (c === "<") {
                var start = i;
                do { i++; } while (text[i] !== ">" && i < text.length);
                digits.push(parseValue(text.slice(start + 1, i)));
            }
            else throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
    };

    function parseBaseFromArray(digits, base, isNegative) {
        var val = Integer[0], pow = Integer[1], i;
        for (i = digits.length - 1; i >= 0; i--) {
            val = val.add(digits[i].times(pow));
            pow = pow.times(base);
        }
        return isNegative ? val.negate() : val;
    }

    function stringify(digit, alphabet) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        if (digit < alphabet.length) {
            return alphabet[digit];
        }
        return "<" + digit + ">";
    }

    function toBase(n, base) {
        base = bigInt(base);
        if (base.isZero()) {
            if (n.isZero()) return { value: [0], isNegative: false };
            throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
            if (n.isZero()) return { value: [0], isNegative: false };
            if (n.isNegative())
                return {
                    value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
                        .map(Array.prototype.valueOf, [1, 0])
                    ),
                    isNegative: false
                };

            var arr = Array.apply(null, Array(n.toJSNumber() - 1))
                .map(Array.prototype.valueOf, [0, 1]);
            arr.unshift([1]);
            return {
                value: [].concat.apply([], arr),
                isNegative: false
            };
        }

        var neg = false;
        if (n.isNegative() && base.isPositive()) {
            neg = true;
            n = n.abs();
        }
        if (base.isUnit()) {
            if (n.isZero()) return { value: [0], isNegative: false };

            return {
                value: Array.apply(null, Array(n.toJSNumber()))
                    .map(Number.prototype.valueOf, 1),
                isNegative: neg
            };
        }
        var out = [];
        var left = n, divmod;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
            divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
                digit = base.minus(digit).abs();
                left = left.next();
            }
            out.push(digit.toJSNumber());
        }
        out.push(left.toJSNumber());
        return { value: out.reverse(), isNegative: neg };
    }

    function toBaseString(n, base, alphabet) {
        var arr = toBase(n, base);
        return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
            return stringify(x, alphabet);
        }).join('');
    }

    BigInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    SmallInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    NativeBigInt.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    BigInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined) radix = 10;
        if (radix !== 10) return toBaseString(this, radix, alphabet);
        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
        while (--l >= 0) {
            digit = String(v[l]);
            str += zeros.slice(digit.length) + digit;
        }
        var sign = this.sign ? "-" : "";
        return sign + str;
    };

    SmallInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined) radix = 10;
        if (radix != 10) return toBaseString(this, radix, alphabet);
        return String(this.value);
    };

    NativeBigInt.prototype.toString = SmallInteger.prototype.toString;

    NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); }

    BigInteger.prototype.valueOf = function () {
        return parseInt(this.toString(), 10);
    };
    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

    SmallInteger.prototype.valueOf = function () {
        return this.value;
    };
    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
    NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function () {
        return parseInt(this.toString(), 10);
    }

    function parseStringValue(v) {
        if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
                return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
            throw new Error("Invalid integer: " + v);
        }
        var sign = v[0] === "-";
        if (sign) v = v.slice(1);
        var split = v.split(/e/i);
        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
            var exp = split[1];
            if (exp[0] === "+") exp = exp.slice(1);
            exp = +exp;
            if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            var text = split[0];
            var decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
                exp -= text.length - decimalPlace - 1;
                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
            text += (new Array(exp + 1)).join("0");
            v = text;
        }
        var isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid) throw new Error("Invalid integer: " + v);
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(sign ? "-" + v : v));
        }
        var r = [], max = v.length, l = LOG_BASE, min = max - l;
        while (max > 0) {
            r.push(+v.slice(min, max));
            min -= l;
            if (min < 0) min = 0;
            max -= l;
        }
        trim(r);
        return new BigInteger(r, sign);
    }

    function parseNumberValue(v) {
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(v));
        }
        if (isPrecise(v)) {
            if (v !== truncate(v)) throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
    }

    function parseValue(v) {
        if (typeof v === "number") {
            return parseNumberValue(v);
        }
        if (typeof v === "string") {
            return parseStringValue(v);
        }
        if (typeof v === "bigint") {
            return new NativeBigInt(v);
        }
        return v;
    }
    // Pre-define numbers in range [-999,999]
    for (var i = 0; i < 1000; i++) {
        Integer[i] = parseValue(i);
        if (i > 0) Integer[-i] = parseValue(-i);
    }
    // Backwards compatibility
    Integer.one = Integer[1];
    Integer.zero = Integer[0];
    Integer.minusOne = Integer[-1];
    Integer.max = max;
    Integer.min = min;
    Integer.gcd = gcd;
    Integer.lcm = lcm;
    Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt; };
    Integer.randBetween = randBetween;

    Integer.fromArray = function (digits, base, isNegative) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
    };

    return Integer;
})();

// Node.js check
if ( true && module.hasOwnProperty("exports")) {
    module.exports = bigInt;
}

//amd check
if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
        return bigInt;
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}


/***/ }),

/***/ 2305:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=common.js.map

/***/ }),

/***/ 4228:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Types extracted from https://discord.com/developers/docs/topics/gateway
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GatewayDispatchEvents = exports.GatewayIntentBits = exports.GatewayCloseCodes = exports.GatewayOpcodes = exports.GatewayVersion = void 0;
__exportStar(__webpack_require__(2305), exports);
exports.GatewayVersion = '9';
/**
 * https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes
 */
var GatewayOpcodes;
(function (GatewayOpcodes) {
    /**
     * An event was dispatched
     */
    GatewayOpcodes[GatewayOpcodes["Dispatch"] = 0] = "Dispatch";
    /**
     * A bidirectional opcode to maintain an active gateway connection.
     * Fired periodically by the client, or fired by the gateway to request an immediate heartbeat from the client.
     */
    GatewayOpcodes[GatewayOpcodes["Heartbeat"] = 1] = "Heartbeat";
    /**
     * Starts a new session during the initial handshake
     */
    GatewayOpcodes[GatewayOpcodes["Identify"] = 2] = "Identify";
    /**
     * Update the client's presence
     */
    GatewayOpcodes[GatewayOpcodes["PresenceUpdate"] = 3] = "PresenceUpdate";
    /**
     * Used to join/leave or move between voice channels
     */
    GatewayOpcodes[GatewayOpcodes["VoiceStateUpdate"] = 4] = "VoiceStateUpdate";
    /**
     * Resume a previous session that was disconnected
     */
    GatewayOpcodes[GatewayOpcodes["Resume"] = 6] = "Resume";
    /**
     * You should attempt to reconnect and resume immediately
     */
    GatewayOpcodes[GatewayOpcodes["Reconnect"] = 7] = "Reconnect";
    /**
     * Request information about offline guild members in a large guild
     */
    GatewayOpcodes[GatewayOpcodes["RequestGuildMembers"] = 8] = "RequestGuildMembers";
    /**
     * The session has been invalidated. You should reconnect and identify/resume accordingly
     */
    GatewayOpcodes[GatewayOpcodes["InvalidSession"] = 9] = "InvalidSession";
    /**
     * Sent immediately after connecting, contains the `heartbeat_interval` to use
     */
    GatewayOpcodes[GatewayOpcodes["Hello"] = 10] = "Hello";
    /**
     * Sent in response to receiving a heartbeat to acknowledge that it has been received
     */
    GatewayOpcodes[GatewayOpcodes["HeartbeatAck"] = 11] = "HeartbeatAck";
})(GatewayOpcodes = exports.GatewayOpcodes || (exports.GatewayOpcodes = {}));
/**
 * https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes
 */
var GatewayCloseCodes;
(function (GatewayCloseCodes) {
    /**
     * We're not sure what went wrong. Try reconnecting?
     */
    GatewayCloseCodes[GatewayCloseCodes["UnknownError"] = 4000] = "UnknownError";
    /**
     * You sent an invalid Gateway opcode or an invalid payload for an opcode. Don't do that!
     *
     * See https://discord.com/developers/docs/topics/gateway-events#payload-structure
     */
    GatewayCloseCodes[GatewayCloseCodes["UnknownOpcode"] = 4001] = "UnknownOpcode";
    /**
     * You sent an invalid payload to us. Don't do that!
     *
     * See https://discord.com/developers/docs/topics/gateway#sending-events
     */
    GatewayCloseCodes[GatewayCloseCodes["DecodeError"] = 4002] = "DecodeError";
    /**
     * You sent us a payload prior to identifying
     *
     * See https://discord.com/developers/docs/topics/gateway-events#identify
     */
    GatewayCloseCodes[GatewayCloseCodes["NotAuthenticated"] = 4003] = "NotAuthenticated";
    /**
     * The account token sent with your identify payload is incorrect
     *
     * See https://discord.com/developers/docs/topics/gateway-events#identify
     */
    GatewayCloseCodes[GatewayCloseCodes["AuthenticationFailed"] = 4004] = "AuthenticationFailed";
    /**
     * You sent more than one identify payload. Don't do that!
     */
    GatewayCloseCodes[GatewayCloseCodes["AlreadyAuthenticated"] = 4005] = "AlreadyAuthenticated";
    /**
     * The sequence sent when resuming the session was invalid. Reconnect and start a new session
     *
     * See https://discord.com/developers/docs/topics/gateway-events#resume
     */
    GatewayCloseCodes[GatewayCloseCodes["InvalidSeq"] = 4007] = "InvalidSeq";
    /**
     * Woah nelly! You're sending payloads to us too quickly. Slow it down! You will be disconnected on receiving this
     */
    GatewayCloseCodes[GatewayCloseCodes["RateLimited"] = 4008] = "RateLimited";
    /**
     * Your session timed out. Reconnect and start a new one
     */
    GatewayCloseCodes[GatewayCloseCodes["SessionTimedOut"] = 4009] = "SessionTimedOut";
    /**
     * You sent us an invalid shard when identifying
     *
     * See https://discord.com/developers/docs/topics/gateway#sharding
     */
    GatewayCloseCodes[GatewayCloseCodes["InvalidShard"] = 4010] = "InvalidShard";
    /**
     * The session would have handled too many guilds - you are required to shard your connection in order to connect
     *
     * See https://discord.com/developers/docs/topics/gateway#sharding
     */
    GatewayCloseCodes[GatewayCloseCodes["ShardingRequired"] = 4011] = "ShardingRequired";
    /**
     * You sent an invalid version for the gateway
     */
    GatewayCloseCodes[GatewayCloseCodes["InvalidAPIVersion"] = 4012] = "InvalidAPIVersion";
    /**
     * You sent an invalid intent for a Gateway Intent. You may have incorrectly calculated the bitwise value
     *
     * See https://discord.com/developers/docs/topics/gateway#gateway-intents
     */
    GatewayCloseCodes[GatewayCloseCodes["InvalidIntents"] = 4013] = "InvalidIntents";
    /**
     * You sent a disallowed intent for a Gateway Intent. You may have tried to specify an intent that you have not
     * enabled or are not whitelisted for
     *
     * See https://discord.com/developers/docs/topics/gateway#gateway-intents
     *
     * See https://discord.com/developers/docs/topics/gateway#privileged-intents
     */
    GatewayCloseCodes[GatewayCloseCodes["DisallowedIntents"] = 4014] = "DisallowedIntents";
})(GatewayCloseCodes = exports.GatewayCloseCodes || (exports.GatewayCloseCodes = {}));
/**
 * https://discord.com/developers/docs/topics/gateway#list-of-intents
 */
var GatewayIntentBits;
(function (GatewayIntentBits) {
    GatewayIntentBits[GatewayIntentBits["Guilds"] = 1] = "Guilds";
    GatewayIntentBits[GatewayIntentBits["GuildMembers"] = 2] = "GuildMembers";
    GatewayIntentBits[GatewayIntentBits["GuildBans"] = 4] = "GuildBans";
    GatewayIntentBits[GatewayIntentBits["GuildEmojisAndStickers"] = 8] = "GuildEmojisAndStickers";
    GatewayIntentBits[GatewayIntentBits["GuildIntegrations"] = 16] = "GuildIntegrations";
    GatewayIntentBits[GatewayIntentBits["GuildWebhooks"] = 32] = "GuildWebhooks";
    GatewayIntentBits[GatewayIntentBits["GuildInvites"] = 64] = "GuildInvites";
    GatewayIntentBits[GatewayIntentBits["GuildVoiceStates"] = 128] = "GuildVoiceStates";
    GatewayIntentBits[GatewayIntentBits["GuildPresences"] = 256] = "GuildPresences";
    GatewayIntentBits[GatewayIntentBits["GuildMessages"] = 512] = "GuildMessages";
    GatewayIntentBits[GatewayIntentBits["GuildMessageReactions"] = 1024] = "GuildMessageReactions";
    GatewayIntentBits[GatewayIntentBits["GuildMessageTyping"] = 2048] = "GuildMessageTyping";
    GatewayIntentBits[GatewayIntentBits["DirectMessages"] = 4096] = "DirectMessages";
    GatewayIntentBits[GatewayIntentBits["DirectMessageReactions"] = 8192] = "DirectMessageReactions";
    GatewayIntentBits[GatewayIntentBits["DirectMessageTyping"] = 16384] = "DirectMessageTyping";
    GatewayIntentBits[GatewayIntentBits["GuildScheduledEvents"] = 65536] = "GuildScheduledEvents";
    GatewayIntentBits[GatewayIntentBits["AutoModerationConfiguration"] = 1048576] = "AutoModerationConfiguration";
    GatewayIntentBits[GatewayIntentBits["AutoModerationExecution"] = 2097152] = "AutoModerationExecution";
})(GatewayIntentBits = exports.GatewayIntentBits || (exports.GatewayIntentBits = {}));
/**
 * https://discord.com/developers/docs/topics/gateway-events#receive-events
 */
var GatewayDispatchEvents;
(function (GatewayDispatchEvents) {
    GatewayDispatchEvents["ApplicationCommandPermissionsUpdate"] = "APPLICATION_COMMAND_PERMISSIONS_UPDATE";
    GatewayDispatchEvents["ChannelCreate"] = "CHANNEL_CREATE";
    GatewayDispatchEvents["ChannelDelete"] = "CHANNEL_DELETE";
    GatewayDispatchEvents["ChannelPinsUpdate"] = "CHANNEL_PINS_UPDATE";
    GatewayDispatchEvents["ChannelUpdate"] = "CHANNEL_UPDATE";
    GatewayDispatchEvents["GuildBanAdd"] = "GUILD_BAN_ADD";
    GatewayDispatchEvents["GuildBanRemove"] = "GUILD_BAN_REMOVE";
    GatewayDispatchEvents["GuildCreate"] = "GUILD_CREATE";
    GatewayDispatchEvents["GuildDelete"] = "GUILD_DELETE";
    GatewayDispatchEvents["GuildEmojisUpdate"] = "GUILD_EMOJIS_UPDATE";
    GatewayDispatchEvents["GuildIntegrationsUpdate"] = "GUILD_INTEGRATIONS_UPDATE";
    GatewayDispatchEvents["GuildMemberAdd"] = "GUILD_MEMBER_ADD";
    GatewayDispatchEvents["GuildMemberRemove"] = "GUILD_MEMBER_REMOVE";
    GatewayDispatchEvents["GuildMembersChunk"] = "GUILD_MEMBERS_CHUNK";
    GatewayDispatchEvents["GuildMemberUpdate"] = "GUILD_MEMBER_UPDATE";
    GatewayDispatchEvents["GuildRoleCreate"] = "GUILD_ROLE_CREATE";
    GatewayDispatchEvents["GuildRoleDelete"] = "GUILD_ROLE_DELETE";
    GatewayDispatchEvents["GuildRoleUpdate"] = "GUILD_ROLE_UPDATE";
    GatewayDispatchEvents["GuildStickersUpdate"] = "GUILD_STICKERS_UPDATE";
    GatewayDispatchEvents["GuildUpdate"] = "GUILD_UPDATE";
    GatewayDispatchEvents["IntegrationCreate"] = "INTEGRATION_CREATE";
    GatewayDispatchEvents["IntegrationDelete"] = "INTEGRATION_DELETE";
    GatewayDispatchEvents["IntegrationUpdate"] = "INTEGRATION_UPDATE";
    GatewayDispatchEvents["InteractionCreate"] = "INTERACTION_CREATE";
    GatewayDispatchEvents["InviteCreate"] = "INVITE_CREATE";
    GatewayDispatchEvents["InviteDelete"] = "INVITE_DELETE";
    GatewayDispatchEvents["MessageCreate"] = "MESSAGE_CREATE";
    GatewayDispatchEvents["MessageDelete"] = "MESSAGE_DELETE";
    GatewayDispatchEvents["MessageDeleteBulk"] = "MESSAGE_DELETE_BULK";
    GatewayDispatchEvents["MessageReactionAdd"] = "MESSAGE_REACTION_ADD";
    GatewayDispatchEvents["MessageReactionRemove"] = "MESSAGE_REACTION_REMOVE";
    GatewayDispatchEvents["MessageReactionRemoveAll"] = "MESSAGE_REACTION_REMOVE_ALL";
    GatewayDispatchEvents["MessageReactionRemoveEmoji"] = "MESSAGE_REACTION_REMOVE_EMOJI";
    GatewayDispatchEvents["MessageUpdate"] = "MESSAGE_UPDATE";
    GatewayDispatchEvents["PresenceUpdate"] = "PRESENCE_UPDATE";
    GatewayDispatchEvents["StageInstanceCreate"] = "STAGE_INSTANCE_CREATE";
    GatewayDispatchEvents["StageInstanceDelete"] = "STAGE_INSTANCE_DELETE";
    GatewayDispatchEvents["StageInstanceUpdate"] = "STAGE_INSTANCE_UPDATE";
    GatewayDispatchEvents["Ready"] = "READY";
    GatewayDispatchEvents["Resumed"] = "RESUMED";
    GatewayDispatchEvents["ThreadCreate"] = "THREAD_CREATE";
    GatewayDispatchEvents["ThreadDelete"] = "THREAD_DELETE";
    GatewayDispatchEvents["ThreadListSync"] = "THREAD_LIST_SYNC";
    GatewayDispatchEvents["ThreadMembersUpdate"] = "THREAD_MEMBERS_UPDATE";
    GatewayDispatchEvents["ThreadMemberUpdate"] = "THREAD_MEMBER_UPDATE";
    GatewayDispatchEvents["ThreadUpdate"] = "THREAD_UPDATE";
    GatewayDispatchEvents["TypingStart"] = "TYPING_START";
    GatewayDispatchEvents["UserUpdate"] = "USER_UPDATE";
    GatewayDispatchEvents["VoiceServerUpdate"] = "VOICE_SERVER_UPDATE";
    GatewayDispatchEvents["VoiceStateUpdate"] = "VOICE_STATE_UPDATE";
    GatewayDispatchEvents["WebhooksUpdate"] = "WEBHOOKS_UPDATE";
    GatewayDispatchEvents["GuildScheduledEventCreate"] = "GUILD_SCHEDULED_EVENT_CREATE";
    GatewayDispatchEvents["GuildScheduledEventUpdate"] = "GUILD_SCHEDULED_EVENT_UPDATE";
    GatewayDispatchEvents["GuildScheduledEventDelete"] = "GUILD_SCHEDULED_EVENT_DELETE";
    GatewayDispatchEvents["GuildScheduledEventUserAdd"] = "GUILD_SCHEDULED_EVENT_USER_ADD";
    GatewayDispatchEvents["GuildScheduledEventUserRemove"] = "GUILD_SCHEDULED_EVENT_USER_REMOVE";
    GatewayDispatchEvents["AutoModerationRuleCreate"] = "AUTO_MODERATION_RULE_CREATE";
    GatewayDispatchEvents["AutoModerationRuleUpdate"] = "AUTO_MODERATION_RULE_UPDATE";
    GatewayDispatchEvents["AutoModerationRuleDelete"] = "AUTO_MODERATION_RULE_DELETE";
    GatewayDispatchEvents["AutoModerationActionExecution"] = "AUTO_MODERATION_ACTION_EXECUTION";
})(GatewayDispatchEvents = exports.GatewayDispatchEvents || (exports.GatewayDispatchEvents = {}));
// #endregion Shared
//# sourceMappingURL=v9.js.map

/***/ }),

/***/ 3839:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormattingPatterns = void 0;
/**
 * https://discord.com/developers/docs/reference#message-formatting-formats
 */
exports.FormattingPatterns = {
    /**
     * Regular expression for matching a user mention, strictly without a nickname
     *
     * The `id` group property is present on the `exec` result of this expression
     */
    User: /<@(?<id>\d{17,20})>/,
    /**
     * Regular expression for matching a user mention, strictly with a nickname
     *
     * The `id` group property is present on the `exec` result of this expression
     * @deprecated Passing `!` in user mentions is no longer necessary / supported, and future message contents won't have it
     */
    UserWithNickname: /<@!(?<id>\d{17,20})>/,
    /**
     * Regular expression for matching a user mention, with or without a nickname
     *
     * The `id` group property is present on the `exec` result of this expression
     * @deprecated Passing `!` in user mentions is no longer necessary / supported, and future message contents won't have it
     */
    UserWithOptionalNickname: /<@!?(?<id>\d{17,20})>/,
    /**
     * Regular expression for matching a channel mention
     *
     * The `id` group property is present on the `exec` result of this expression
     */
    Channel: /<#(?<id>\d{17,20})>/,
    /**
     * Regular expression for matching a role mention
     *
     * The `id` group property is present on the `exec` result of this expression
     */
    Role: /<@&(?<id>\d{17,20})>/,
    /**
     * Regular expression for matching a application command mention
     *
     * The `fullName` (possibly including `name`, `subcommandOrGroup` and `subcommand`) and `id` group properties are present on the `exec` result of this expression
     */
    SlashCommand: /<\/(?<fullName>(?<name>[-_\p{Letter}\p{Number}\p{sc=Deva}\p{sc=Thai}]{1,32})(?: (?<subcommandOrGroup>[-_\p{Letter}\p{Number}\p{sc=Deva}\p{sc=Thai}]{1,32}))?(?: (?<subcommand>[-_\p{Letter}\p{Number}\p{sc=Deva}\p{sc=Thai}]{1,32}))?):(?<id>\d{17,20})>/u,
    /**
     * Regular expression for matching a custom emoji, either static or animated
     *
     * The `animated`, `name` and `id` group properties are present on the `exec` result of this expression
     */
    Emoji: /<(?<animated>a)?:(?<name>\w{2,32}):(?<id>\d{17,20})>/,
    /**
     * Regular expression for matching strictly an animated custom emoji
     *
     * The `animated`, `name` and `id` group properties are present on the `exec` result of this expression
     */
    AnimatedEmoji: /<(?<animated>a):(?<name>\w{2,32}):(?<id>\d{17,20})>/,
    /**
     * Regular expression for matching strictly a static custom emoji
     *
     * The `name` and `id` group properties are present on the `exec` result of this expression
     */
    StaticEmoji: /<:(?<name>\w{2,32}):(?<id>\d{17,20})>/,
    /**
     * Regular expression for matching a timestamp, either default or custom styled
     *
     * The `timestamp` and `style` group properties are present on the `exec` result of this expression
     */
    Timestamp: /<t:(?<timestamp>-?\d{1,13})(:(?<style>[tTdDfFR]))?>/,
    /**
     * Regular expression for matching strictly default styled timestamps
     *
     * The `timestamp` group property is present on the `exec` result of this expression
     */
    DefaultStyledTimestamp: /<t:(?<timestamp>-?\d{1,13})>/,
    /**
     * Regular expression for matching strictly custom styled timestamps
     *
     * The `timestamp` and `style` group properties are present on the `exec` result of this expression
     */
    StyledTimestamp: /<t:(?<timestamp>-?\d{1,13}):(?<style>[tTdDfFR])>/,
};
/**
 * Freezes the formatting patterns
 * @internal
 */
Object.freeze(exports.FormattingPatterns);
//# sourceMappingURL=globals.js.map

/***/ }),

/***/ 8194:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PermissionFlagsBits = void 0;
/**
 * https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
 *
 * These flags are exported as `BigInt`s and NOT numbers. Wrapping them in `Number()`
 * may cause issues, try to use BigInts as much as possible or modules that can
 * replicate them in some way
 */
exports.PermissionFlagsBits = {
    CreateInstantInvite: 1n << 0n,
    KickMembers: 1n << 1n,
    BanMembers: 1n << 2n,
    Administrator: 1n << 3n,
    ManageChannels: 1n << 4n,
    ManageGuild: 1n << 5n,
    AddReactions: 1n << 6n,
    ViewAuditLog: 1n << 7n,
    PrioritySpeaker: 1n << 8n,
    Stream: 1n << 9n,
    ViewChannel: 1n << 10n,
    SendMessages: 1n << 11n,
    SendTTSMessages: 1n << 12n,
    ManageMessages: 1n << 13n,
    EmbedLinks: 1n << 14n,
    AttachFiles: 1n << 15n,
    ReadMessageHistory: 1n << 16n,
    MentionEveryone: 1n << 17n,
    UseExternalEmojis: 1n << 18n,
    ViewGuildInsights: 1n << 19n,
    Connect: 1n << 20n,
    Speak: 1n << 21n,
    MuteMembers: 1n << 22n,
    DeafenMembers: 1n << 23n,
    MoveMembers: 1n << 24n,
    UseVAD: 1n << 25n,
    ChangeNickname: 1n << 26n,
    ManageNicknames: 1n << 27n,
    ManageRoles: 1n << 28n,
    ManageWebhooks: 1n << 29n,
    ManageEmojisAndStickers: 1n << 30n,
    UseApplicationCommands: 1n << 31n,
    RequestToSpeak: 1n << 32n,
    ManageEvents: 1n << 33n,
    ManageThreads: 1n << 34n,
    CreatePublicThreads: 1n << 35n,
    CreatePrivateThreads: 1n << 36n,
    UseExternalStickers: 1n << 37n,
    SendMessagesInThreads: 1n << 38n,
    UseEmbeddedActivities: 1n << 39n,
    ModerateMembers: 1n << 40n,
};
/**
 * Freeze the object of bits, preventing any modifications to it
 * @internal
 */
Object.freeze(exports.PermissionFlagsBits);
//# sourceMappingURL=common.js.map

/***/ }),

/***/ 7184:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=attachment.js.map

/***/ }),

/***/ 3550:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=base.js.map

/***/ }),

/***/ 2087:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=boolean.js.map

/***/ }),

/***/ 531:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=channel.js.map

/***/ }),

/***/ 6493:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=integer.js.map

/***/ }),

/***/ 6412:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=mentionable.js.map

/***/ }),

/***/ 3411:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=number.js.map

/***/ }),

/***/ 3975:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=role.js.map

/***/ }),

/***/ 3674:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApplicationCommandOptionType = void 0;
/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
 */
var ApplicationCommandOptionType;
(function (ApplicationCommandOptionType) {
    ApplicationCommandOptionType[ApplicationCommandOptionType["Subcommand"] = 1] = "Subcommand";
    ApplicationCommandOptionType[ApplicationCommandOptionType["SubcommandGroup"] = 2] = "SubcommandGroup";
    ApplicationCommandOptionType[ApplicationCommandOptionType["String"] = 3] = "String";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Integer"] = 4] = "Integer";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Boolean"] = 5] = "Boolean";
    ApplicationCommandOptionType[ApplicationCommandOptionType["User"] = 6] = "User";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Channel"] = 7] = "Channel";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Role"] = 8] = "Role";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Mentionable"] = 9] = "Mentionable";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Number"] = 10] = "Number";
    ApplicationCommandOptionType[ApplicationCommandOptionType["Attachment"] = 11] = "Attachment";
})(ApplicationCommandOptionType = exports.ApplicationCommandOptionType || (exports.ApplicationCommandOptionType = {}));
//# sourceMappingURL=shared.js.map

/***/ }),

/***/ 8518:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=string.js.map

/***/ }),

/***/ 9904:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=subcommand.js.map

/***/ }),

/***/ 615:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=subcommandGroup.js.map

/***/ }),

/***/ 9144:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=user.js.map

/***/ }),

/***/ 6384:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(7184), exports);
__exportStar(__webpack_require__(3550), exports);
__exportStar(__webpack_require__(2087), exports);
__exportStar(__webpack_require__(531), exports);
__exportStar(__webpack_require__(6493), exports);
__exportStar(__webpack_require__(6412), exports);
__exportStar(__webpack_require__(3411), exports);
__exportStar(__webpack_require__(3975), exports);
__exportStar(__webpack_require__(3674), exports);
__exportStar(__webpack_require__(8518), exports);
__exportStar(__webpack_require__(9904), exports);
__exportStar(__webpack_require__(615), exports);
__exportStar(__webpack_require__(9144), exports);
//# sourceMappingURL=chatInput.js.map

/***/ }),

/***/ 9723:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=contextMenu.js.map

/***/ }),

/***/ 6386:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.APIApplicationCommandPermissionsConstant = exports.ApplicationCommandPermissionType = void 0;
/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permission-type
 */
var ApplicationCommandPermissionType;
(function (ApplicationCommandPermissionType) {
    ApplicationCommandPermissionType[ApplicationCommandPermissionType["Role"] = 1] = "Role";
    ApplicationCommandPermissionType[ApplicationCommandPermissionType["User"] = 2] = "User";
    ApplicationCommandPermissionType[ApplicationCommandPermissionType["Channel"] = 3] = "Channel";
})(ApplicationCommandPermissionType = exports.ApplicationCommandPermissionType || (exports.ApplicationCommandPermissionType = {}));
/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-constants
 */
exports.APIApplicationCommandPermissionsConstant = {
    Everyone: (guildId) => String(guildId),
    AllChannels: (guildId) => String(BigInt(guildId) - 1n),
};
//# sourceMappingURL=permissions.js.map

/***/ }),

/***/ 8644:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApplicationCommandType = void 0;
__exportStar(__webpack_require__(6384), exports);
__exportStar(__webpack_require__(9723), exports);
__exportStar(__webpack_require__(6386), exports);
/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types
 */
var ApplicationCommandType;
(function (ApplicationCommandType) {
    ApplicationCommandType[ApplicationCommandType["ChatInput"] = 1] = "ChatInput";
    ApplicationCommandType[ApplicationCommandType["User"] = 2] = "User";
    ApplicationCommandType[ApplicationCommandType["Message"] = 3] = "Message";
})(ApplicationCommandType = exports.ApplicationCommandType || (exports.ApplicationCommandType = {}));
//# sourceMappingURL=applicationCommands.js.map

/***/ }),

/***/ 1146:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=autocomplete.js.map

/***/ }),

/***/ 5286:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=base.js.map

/***/ }),

/***/ 5733:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=messageComponents.js.map

/***/ }),

/***/ 2591:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=modalSubmit.js.map

/***/ }),

/***/ 9191:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=ping.js.map

/***/ }),

/***/ 4086:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InteractionResponseType = exports.InteractionType = void 0;
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
 */
var InteractionType;
(function (InteractionType) {
    InteractionType[InteractionType["Ping"] = 1] = "Ping";
    InteractionType[InteractionType["ApplicationCommand"] = 2] = "ApplicationCommand";
    InteractionType[InteractionType["MessageComponent"] = 3] = "MessageComponent";
    InteractionType[InteractionType["ApplicationCommandAutocomplete"] = 4] = "ApplicationCommandAutocomplete";
    InteractionType[InteractionType["ModalSubmit"] = 5] = "ModalSubmit";
})(InteractionType = exports.InteractionType || (exports.InteractionType = {}));
/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type
 */
var InteractionResponseType;
(function (InteractionResponseType) {
    /**
     * ACK a `Ping`
     */
    InteractionResponseType[InteractionResponseType["Pong"] = 1] = "Pong";
    /**
     * Respond to an interaction with a message
     */
    InteractionResponseType[InteractionResponseType["ChannelMessageWithSource"] = 4] = "ChannelMessageWithSource";
    /**
     * ACK an interaction and edit to a response later, the user sees a loading state
     */
    InteractionResponseType[InteractionResponseType["DeferredChannelMessageWithSource"] = 5] = "DeferredChannelMessageWithSource";
    /**
     * ACK a button interaction and update it to a loading state
     */
    InteractionResponseType[InteractionResponseType["DeferredMessageUpdate"] = 6] = "DeferredMessageUpdate";
    /**
     * ACK a button interaction and edit the message to which the button was attached
     */
    InteractionResponseType[InteractionResponseType["UpdateMessage"] = 7] = "UpdateMessage";
    /**
     * For autocomplete interactions
     */
    InteractionResponseType[InteractionResponseType["ApplicationCommandAutocompleteResult"] = 8] = "ApplicationCommandAutocompleteResult";
    /**
     * Respond to an interaction with an modal for a user to fill-out
     */
    InteractionResponseType[InteractionResponseType["Modal"] = 9] = "Modal";
})(InteractionResponseType = exports.InteractionResponseType || (exports.InteractionResponseType = {}));
//# sourceMappingURL=responses.js.map

/***/ }),

/***/ 1628:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/resources/application
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApplicationRoleConnectionMetadataType = exports.ApplicationFlags = void 0;
/**
 * https://discord.com/developers/docs/resources/application#application-object-application-flags
 */
var ApplicationFlags;
(function (ApplicationFlags) {
    ApplicationFlags[ApplicationFlags["EmbeddedReleased"] = 2] = "EmbeddedReleased";
    ApplicationFlags[ApplicationFlags["ManagedEmoji"] = 4] = "ManagedEmoji";
    ApplicationFlags[ApplicationFlags["GroupDMCreate"] = 16] = "GroupDMCreate";
    ApplicationFlags[ApplicationFlags["RPCHasConnected"] = 2048] = "RPCHasConnected";
    ApplicationFlags[ApplicationFlags["GatewayPresence"] = 4096] = "GatewayPresence";
    ApplicationFlags[ApplicationFlags["GatewayPresenceLimited"] = 8192] = "GatewayPresenceLimited";
    ApplicationFlags[ApplicationFlags["GatewayGuildMembers"] = 16384] = "GatewayGuildMembers";
    ApplicationFlags[ApplicationFlags["GatewayGuildMembersLimited"] = 32768] = "GatewayGuildMembersLimited";
    ApplicationFlags[ApplicationFlags["VerificationPendingGuildLimit"] = 65536] = "VerificationPendingGuildLimit";
    ApplicationFlags[ApplicationFlags["Embedded"] = 131072] = "Embedded";
    ApplicationFlags[ApplicationFlags["GatewayMessageContent"] = 262144] = "GatewayMessageContent";
    ApplicationFlags[ApplicationFlags["GatewayMessageContentLimited"] = 524288] = "GatewayMessageContentLimited";
    ApplicationFlags[ApplicationFlags["EmbeddedFirstParty"] = 1048576] = "EmbeddedFirstParty";
    ApplicationFlags[ApplicationFlags["ApplicationCommandBadge"] = 8388608] = "ApplicationCommandBadge";
})(ApplicationFlags = exports.ApplicationFlags || (exports.ApplicationFlags = {}));
/**
 * https://discord.com/developers/docs/resources/application-role-connection-metadata#application-role-connection-metadata-object-application-role-connection-metadata-type
 */
var ApplicationRoleConnectionMetadataType;
(function (ApplicationRoleConnectionMetadataType) {
    /**
     * The metadata value (`integer`) is less than or equal to the guild's configured value (`integer`)
     */
    ApplicationRoleConnectionMetadataType[ApplicationRoleConnectionMetadataType["IntegerLessThanOrEqual"] = 1] = "IntegerLessThanOrEqual";
    /**
     * The metadata value (`integer`) is greater than or equal to the guild's configured value (`integer`)
     */
    ApplicationRoleConnectionMetadataType[ApplicationRoleConnectionMetadataType["IntegerGreaterThanOrEqual"] = 2] = "IntegerGreaterThanOrEqual";
    /**
     * The metadata value (`integer`) is equal to the guild's configured value (`integer`)
     */
    ApplicationRoleConnectionMetadataType[ApplicationRoleConnectionMetadataType["IntegerEqual"] = 3] = "IntegerEqual";
    /**
     * The metadata value (`integer`) is not equal to the guild's configured value (`integer`)
     */
    ApplicationRoleConnectionMetadataType[ApplicationRoleConnectionMetadataType["IntegerNotEqual"] = 4] = "IntegerNotEqual";
    /**
     * The metadata value (`ISO8601 string`) is less than or equal to the guild's configured value (`integer`; days before current date)
     */
    ApplicationRoleConnectionMetadataType[ApplicationRoleConnectionMetadataType["DatetimeLessThanOrEqual"] = 5] = "DatetimeLessThanOrEqual";
    /**
     * The metadata value (`ISO8601 string`) is greater than or equal to the guild's configured value (`integer`; days before current date)
     */
    ApplicationRoleConnectionMetadataType[ApplicationRoleConnectionMetadataType["DatetimeGreaterThanOrEqual"] = 6] = "DatetimeGreaterThanOrEqual";
    /**
     * The metadata value (`integer`) is equal to the guild's configured value (`integer`; `1`)
     */
    ApplicationRoleConnectionMetadataType[ApplicationRoleConnectionMetadataType["BooleanEqual"] = 7] = "BooleanEqual";
    /**
     * The metadata value (`integer`) is not equal to the guild's configured value (`integer`; `1`)
     */
    ApplicationRoleConnectionMetadataType[ApplicationRoleConnectionMetadataType["BooleanNotEqual"] = 8] = "BooleanNotEqual";
})(ApplicationRoleConnectionMetadataType = exports.ApplicationRoleConnectionMetadataType || (exports.ApplicationRoleConnectionMetadataType = {}));
//# sourceMappingURL=application.js.map

/***/ }),

/***/ 9100:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/resources/audit-log
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditLogOptionsType = exports.AuditLogEvent = void 0;
/**
 * https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-events
 */
var AuditLogEvent;
(function (AuditLogEvent) {
    AuditLogEvent[AuditLogEvent["GuildUpdate"] = 1] = "GuildUpdate";
    AuditLogEvent[AuditLogEvent["ChannelCreate"] = 10] = "ChannelCreate";
    AuditLogEvent[AuditLogEvent["ChannelUpdate"] = 11] = "ChannelUpdate";
    AuditLogEvent[AuditLogEvent["ChannelDelete"] = 12] = "ChannelDelete";
    AuditLogEvent[AuditLogEvent["ChannelOverwriteCreate"] = 13] = "ChannelOverwriteCreate";
    AuditLogEvent[AuditLogEvent["ChannelOverwriteUpdate"] = 14] = "ChannelOverwriteUpdate";
    AuditLogEvent[AuditLogEvent["ChannelOverwriteDelete"] = 15] = "ChannelOverwriteDelete";
    AuditLogEvent[AuditLogEvent["MemberKick"] = 20] = "MemberKick";
    AuditLogEvent[AuditLogEvent["MemberPrune"] = 21] = "MemberPrune";
    AuditLogEvent[AuditLogEvent["MemberBanAdd"] = 22] = "MemberBanAdd";
    AuditLogEvent[AuditLogEvent["MemberBanRemove"] = 23] = "MemberBanRemove";
    AuditLogEvent[AuditLogEvent["MemberUpdate"] = 24] = "MemberUpdate";
    AuditLogEvent[AuditLogEvent["MemberRoleUpdate"] = 25] = "MemberRoleUpdate";
    AuditLogEvent[AuditLogEvent["MemberMove"] = 26] = "MemberMove";
    AuditLogEvent[AuditLogEvent["MemberDisconnect"] = 27] = "MemberDisconnect";
    AuditLogEvent[AuditLogEvent["BotAdd"] = 28] = "BotAdd";
    AuditLogEvent[AuditLogEvent["RoleCreate"] = 30] = "RoleCreate";
    AuditLogEvent[AuditLogEvent["RoleUpdate"] = 31] = "RoleUpdate";
    AuditLogEvent[AuditLogEvent["RoleDelete"] = 32] = "RoleDelete";
    AuditLogEvent[AuditLogEvent["InviteCreate"] = 40] = "InviteCreate";
    AuditLogEvent[AuditLogEvent["InviteUpdate"] = 41] = "InviteUpdate";
    AuditLogEvent[AuditLogEvent["InviteDelete"] = 42] = "InviteDelete";
    AuditLogEvent[AuditLogEvent["WebhookCreate"] = 50] = "WebhookCreate";
    AuditLogEvent[AuditLogEvent["WebhookUpdate"] = 51] = "WebhookUpdate";
    AuditLogEvent[AuditLogEvent["WebhookDelete"] = 52] = "WebhookDelete";
    AuditLogEvent[AuditLogEvent["EmojiCreate"] = 60] = "EmojiCreate";
    AuditLogEvent[AuditLogEvent["EmojiUpdate"] = 61] = "EmojiUpdate";
    AuditLogEvent[AuditLogEvent["EmojiDelete"] = 62] = "EmojiDelete";
    AuditLogEvent[AuditLogEvent["MessageDelete"] = 72] = "MessageDelete";
    AuditLogEvent[AuditLogEvent["MessageBulkDelete"] = 73] = "MessageBulkDelete";
    AuditLogEvent[AuditLogEvent["MessagePin"] = 74] = "MessagePin";
    AuditLogEvent[AuditLogEvent["MessageUnpin"] = 75] = "MessageUnpin";
    AuditLogEvent[AuditLogEvent["IntegrationCreate"] = 80] = "IntegrationCreate";
    AuditLogEvent[AuditLogEvent["IntegrationUpdate"] = 81] = "IntegrationUpdate";
    AuditLogEvent[AuditLogEvent["IntegrationDelete"] = 82] = "IntegrationDelete";
    AuditLogEvent[AuditLogEvent["StageInstanceCreate"] = 83] = "StageInstanceCreate";
    AuditLogEvent[AuditLogEvent["StageInstanceUpdate"] = 84] = "StageInstanceUpdate";
    AuditLogEvent[AuditLogEvent["StageInstanceDelete"] = 85] = "StageInstanceDelete";
    AuditLogEvent[AuditLogEvent["StickerCreate"] = 90] = "StickerCreate";
    AuditLogEvent[AuditLogEvent["StickerUpdate"] = 91] = "StickerUpdate";
    AuditLogEvent[AuditLogEvent["StickerDelete"] = 92] = "StickerDelete";
    AuditLogEvent[AuditLogEvent["GuildScheduledEventCreate"] = 100] = "GuildScheduledEventCreate";
    AuditLogEvent[AuditLogEvent["GuildScheduledEventUpdate"] = 101] = "GuildScheduledEventUpdate";
    AuditLogEvent[AuditLogEvent["GuildScheduledEventDelete"] = 102] = "GuildScheduledEventDelete";
    AuditLogEvent[AuditLogEvent["ThreadCreate"] = 110] = "ThreadCreate";
    AuditLogEvent[AuditLogEvent["ThreadUpdate"] = 111] = "ThreadUpdate";
    AuditLogEvent[AuditLogEvent["ThreadDelete"] = 112] = "ThreadDelete";
    AuditLogEvent[AuditLogEvent["ApplicationCommandPermissionUpdate"] = 121] = "ApplicationCommandPermissionUpdate";
    AuditLogEvent[AuditLogEvent["AutoModerationRuleCreate"] = 140] = "AutoModerationRuleCreate";
    AuditLogEvent[AuditLogEvent["AutoModerationRuleUpdate"] = 141] = "AutoModerationRuleUpdate";
    AuditLogEvent[AuditLogEvent["AutoModerationRuleDelete"] = 142] = "AutoModerationRuleDelete";
    AuditLogEvent[AuditLogEvent["AutoModerationBlockMessage"] = 143] = "AutoModerationBlockMessage";
    AuditLogEvent[AuditLogEvent["AutoModerationFlagToChannel"] = 144] = "AutoModerationFlagToChannel";
    AuditLogEvent[AuditLogEvent["AutoModerationUserCommunicationDisabled"] = 145] = "AutoModerationUserCommunicationDisabled";
})(AuditLogEvent = exports.AuditLogEvent || (exports.AuditLogEvent = {}));
var AuditLogOptionsType;
(function (AuditLogOptionsType) {
    AuditLogOptionsType["Role"] = "0";
    AuditLogOptionsType["Member"] = "1";
})(AuditLogOptionsType = exports.AuditLogOptionsType || (exports.AuditLogOptionsType = {}));
//# sourceMappingURL=auditLog.js.map

/***/ }),

/***/ 7657:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/resources/auto-moderation
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AutoModerationActionType = exports.AutoModerationRuleEventType = exports.AutoModerationRuleKeywordPresetType = exports.AutoModerationRuleTriggerType = void 0;
/**
 * https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-trigger-types
 */
var AutoModerationRuleTriggerType;
(function (AutoModerationRuleTriggerType) {
    /**
     * Check if content contains words from a user defined list of keywords (Maximum of 3 per guild)
     */
    AutoModerationRuleTriggerType[AutoModerationRuleTriggerType["Keyword"] = 1] = "Keyword";
    /**
     * Check if content represents generic spam (Maximum of 1 per guild)
     */
    AutoModerationRuleTriggerType[AutoModerationRuleTriggerType["Spam"] = 3] = "Spam";
    /**
     * Check if content contains words from internal pre-defined wordsets (Maximum of 1 per guild)
     */
    AutoModerationRuleTriggerType[AutoModerationRuleTriggerType["KeywordPreset"] = 4] = "KeywordPreset";
    /**
     * Check if content contains more mentions than allowed (Maximum of 1 per guild)
     */
    AutoModerationRuleTriggerType[AutoModerationRuleTriggerType["MentionSpam"] = 5] = "MentionSpam";
})(AutoModerationRuleTriggerType = exports.AutoModerationRuleTriggerType || (exports.AutoModerationRuleTriggerType = {}));
/**
 * https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-keyword-preset-types
 */
var AutoModerationRuleKeywordPresetType;
(function (AutoModerationRuleKeywordPresetType) {
    /**
     * Words that may be considered forms of swearing or cursing
     */
    AutoModerationRuleKeywordPresetType[AutoModerationRuleKeywordPresetType["Profanity"] = 1] = "Profanity";
    /**
     * Words that refer to sexually explicit behavior or activity
     */
    AutoModerationRuleKeywordPresetType[AutoModerationRuleKeywordPresetType["SexualContent"] = 2] = "SexualContent";
    /**
     * Personal insults or words that may be considered hate speech
     */
    AutoModerationRuleKeywordPresetType[AutoModerationRuleKeywordPresetType["Slurs"] = 3] = "Slurs";
})(AutoModerationRuleKeywordPresetType = exports.AutoModerationRuleKeywordPresetType || (exports.AutoModerationRuleKeywordPresetType = {}));
/**
 * https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-event-types
 */
var AutoModerationRuleEventType;
(function (AutoModerationRuleEventType) {
    /**
     * When a member sends or edits a message in the guild
     */
    AutoModerationRuleEventType[AutoModerationRuleEventType["MessageSend"] = 1] = "MessageSend";
})(AutoModerationRuleEventType = exports.AutoModerationRuleEventType || (exports.AutoModerationRuleEventType = {}));
/**
 * https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-action-object-action-types
 */
var AutoModerationActionType;
(function (AutoModerationActionType) {
    /**
     * Blocks the content of a message according to the rule
     */
    AutoModerationActionType[AutoModerationActionType["BlockMessage"] = 1] = "BlockMessage";
    /**
     * Logs user content to a specified channel
     */
    AutoModerationActionType[AutoModerationActionType["SendAlertMessage"] = 2] = "SendAlertMessage";
    /**
     * Timeout user for specified duration, this action type can be set if the bot has `MODERATE_MEMBERS` permission
     */
    AutoModerationActionType[AutoModerationActionType["Timeout"] = 3] = "Timeout";
})(AutoModerationActionType = exports.AutoModerationActionType || (exports.AutoModerationActionType = {}));
//# sourceMappingURL=autoModeration.js.map

/***/ }),

/***/ 3652:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/resources/channel
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChannelFlags = exports.TextInputStyle = exports.ButtonStyle = exports.ComponentType = exports.AllowedMentionsTypes = exports.EmbedType = exports.ThreadMemberFlags = exports.ThreadAutoArchiveDuration = exports.OverwriteType = exports.MessageFlags = exports.MessageActivityType = exports.MessageType = exports.VideoQualityMode = exports.ChannelType = exports.ForumLayoutType = exports.SortOrderType = void 0;
/**
 * https://discord.com/developers/docs/resources/channel/#channel-object-sort-order-types
 */
var SortOrderType;
(function (SortOrderType) {
    /**
     * Sort forum posts by activity
     */
    SortOrderType[SortOrderType["LatestActivity"] = 0] = "LatestActivity";
    /**
     * Sort forum posts by creation time (from most recent to oldest)
     */
    SortOrderType[SortOrderType["CreationDate"] = 1] = "CreationDate";
})(SortOrderType = exports.SortOrderType || (exports.SortOrderType = {}));
/**
 * https://discord.com/developers/docs/resources/channel/#channel-object-forum-layout-types
 */
var ForumLayoutType;
(function (ForumLayoutType) {
    /**
     * No default has been set for forum channel
     */
    ForumLayoutType[ForumLayoutType["NotSet"] = 0] = "NotSet";
    /**
     * Display posts as a list
     */
    ForumLayoutType[ForumLayoutType["ListView"] = 1] = "ListView";
    /**
     * Display posts as a collection of tiles
     */
    ForumLayoutType[ForumLayoutType["GalleryView"] = 2] = "GalleryView";
})(ForumLayoutType = exports.ForumLayoutType || (exports.ForumLayoutType = {}));
/**
 * https://discord.com/developers/docs/resources/channel#channel-object-channel-types
 */
var ChannelType;
(function (ChannelType) {
    /**
     * A text channel within a guild
     */
    ChannelType[ChannelType["GuildText"] = 0] = "GuildText";
    /**
     * A direct message between users
     */
    ChannelType[ChannelType["DM"] = 1] = "DM";
    /**
     * A voice channel within a guild
     */
    ChannelType[ChannelType["GuildVoice"] = 2] = "GuildVoice";
    /**
     * A direct message between multiple users
     */
    ChannelType[ChannelType["GroupDM"] = 3] = "GroupDM";
    /**
     * An organizational category that contains up to 50 channels
     *
     * See https://support.discord.com/hc/articles/115001580171
     */
    ChannelType[ChannelType["GuildCategory"] = 4] = "GuildCategory";
    /**
     * A channel that users can follow and crosspost into their own guild
     *
     * See https://support.discord.com/hc/articles/360032008192
     */
    ChannelType[ChannelType["GuildAnnouncement"] = 5] = "GuildAnnouncement";
    /**
     * A temporary sub-channel within a Guild Announcement channel
     */
    ChannelType[ChannelType["AnnouncementThread"] = 10] = "AnnouncementThread";
    /**
     * A temporary sub-channel within a Guild Text or Guild Forum channel
     */
    ChannelType[ChannelType["PublicThread"] = 11] = "PublicThread";
    /**
     * A temporary sub-channel within a Guild Text channel that is only viewable by those invited and those with the Manage Threads permission
     */
    ChannelType[ChannelType["PrivateThread"] = 12] = "PrivateThread";
    /**
     * A voice channel for hosting events with an audience
     *
     * See https://support.discord.com/hc/articles/1500005513722
     */
    ChannelType[ChannelType["GuildStageVoice"] = 13] = "GuildStageVoice";
    /**
     * The channel in a Student Hub containing the listed servers
     *
     * See https://support.discord.com/hc/articles/4406046651927
     */
    ChannelType[ChannelType["GuildDirectory"] = 14] = "GuildDirectory";
    /**
     * A channel that can only contain threads
     */
    ChannelType[ChannelType["GuildForum"] = 15] = "GuildForum";
    // EVERYTHING BELOW THIS LINE SHOULD BE OLD NAMES FOR RENAMED ENUM MEMBERS
    /**
     * A channel that users can follow and crosspost into their own guild
     *
     * @deprecated This is the old name for {@apilink ChannelType#GuildAnnouncement}
     *
     * See https://support.discord.com/hc/articles/360032008192
     */
    ChannelType[ChannelType["GuildNews"] = 5] = "GuildNews";
    /**
     * A temporary sub-channel within a Guild Announcement channel
     *
     * @deprecated This is the old name for {@apilink ChannelType#AnnouncementThread}
     */
    ChannelType[ChannelType["GuildNewsThread"] = 10] = "GuildNewsThread";
    /**
     * A temporary sub-channel within a Guild Text channel
     *
     * @deprecated This is the old name for {@apilink ChannelType#PublicThread}
     */
    ChannelType[ChannelType["GuildPublicThread"] = 11] = "GuildPublicThread";
    /**
     * A temporary sub-channel within a Guild Text channel that is only viewable by those invited and those with the Manage Threads permission
     *
     * @deprecated This is the old name for {@apilink ChannelType#PrivateThread}
     */
    ChannelType[ChannelType["GuildPrivateThread"] = 12] = "GuildPrivateThread";
})(ChannelType = exports.ChannelType || (exports.ChannelType = {}));
var VideoQualityMode;
(function (VideoQualityMode) {
    /**
     * Discord chooses the quality for optimal performance
     */
    VideoQualityMode[VideoQualityMode["Auto"] = 1] = "Auto";
    /**
     * 720p
     */
    VideoQualityMode[VideoQualityMode["Full"] = 2] = "Full";
})(VideoQualityMode = exports.VideoQualityMode || (exports.VideoQualityMode = {}));
/**
 * https://discord.com/developers/docs/resources/channel#message-object-message-types
 */
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Default"] = 0] = "Default";
    MessageType[MessageType["RecipientAdd"] = 1] = "RecipientAdd";
    MessageType[MessageType["RecipientRemove"] = 2] = "RecipientRemove";
    MessageType[MessageType["Call"] = 3] = "Call";
    MessageType[MessageType["ChannelNameChange"] = 4] = "ChannelNameChange";
    MessageType[MessageType["ChannelIconChange"] = 5] = "ChannelIconChange";
    MessageType[MessageType["ChannelPinnedMessage"] = 6] = "ChannelPinnedMessage";
    MessageType[MessageType["UserJoin"] = 7] = "UserJoin";
    MessageType[MessageType["GuildBoost"] = 8] = "GuildBoost";
    MessageType[MessageType["GuildBoostTier1"] = 9] = "GuildBoostTier1";
    MessageType[MessageType["GuildBoostTier2"] = 10] = "GuildBoostTier2";
    MessageType[MessageType["GuildBoostTier3"] = 11] = "GuildBoostTier3";
    MessageType[MessageType["ChannelFollowAdd"] = 12] = "ChannelFollowAdd";
    MessageType[MessageType["GuildDiscoveryDisqualified"] = 14] = "GuildDiscoveryDisqualified";
    MessageType[MessageType["GuildDiscoveryRequalified"] = 15] = "GuildDiscoveryRequalified";
    MessageType[MessageType["GuildDiscoveryGracePeriodInitialWarning"] = 16] = "GuildDiscoveryGracePeriodInitialWarning";
    MessageType[MessageType["GuildDiscoveryGracePeriodFinalWarning"] = 17] = "GuildDiscoveryGracePeriodFinalWarning";
    MessageType[MessageType["ThreadCreated"] = 18] = "ThreadCreated";
    MessageType[MessageType["Reply"] = 19] = "Reply";
    MessageType[MessageType["ChatInputCommand"] = 20] = "ChatInputCommand";
    MessageType[MessageType["ThreadStarterMessage"] = 21] = "ThreadStarterMessage";
    MessageType[MessageType["GuildInviteReminder"] = 22] = "GuildInviteReminder";
    MessageType[MessageType["ContextMenuCommand"] = 23] = "ContextMenuCommand";
    MessageType[MessageType["AutoModerationAction"] = 24] = "AutoModerationAction";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
/**
 * https://discord.com/developers/docs/resources/channel#message-object-message-activity-types
 */
var MessageActivityType;
(function (MessageActivityType) {
    MessageActivityType[MessageActivityType["Join"] = 1] = "Join";
    MessageActivityType[MessageActivityType["Spectate"] = 2] = "Spectate";
    MessageActivityType[MessageActivityType["Listen"] = 3] = "Listen";
    MessageActivityType[MessageActivityType["JoinRequest"] = 5] = "JoinRequest";
})(MessageActivityType = exports.MessageActivityType || (exports.MessageActivityType = {}));
/**
 * https://discord.com/developers/docs/resources/channel#message-object-message-flags
 */
var MessageFlags;
(function (MessageFlags) {
    /**
     * This message has been published to subscribed channels (via Channel Following)
     */
    MessageFlags[MessageFlags["Crossposted"] = 1] = "Crossposted";
    /**
     * This message originated from a message in another channel (via Channel Following)
     */
    MessageFlags[MessageFlags["IsCrosspost"] = 2] = "IsCrosspost";
    /**
     * Do not include any embeds when serializing this message
     */
    MessageFlags[MessageFlags["SuppressEmbeds"] = 4] = "SuppressEmbeds";
    /**
     * The source message for this crosspost has been deleted (via Channel Following)
     */
    MessageFlags[MessageFlags["SourceMessageDeleted"] = 8] = "SourceMessageDeleted";
    /**
     * This message came from the urgent message system
     */
    MessageFlags[MessageFlags["Urgent"] = 16] = "Urgent";
    /**
     * This message has an associated thread, which shares its id
     */
    MessageFlags[MessageFlags["HasThread"] = 32] = "HasThread";
    /**
     * This message is only visible to the user who invoked the Interaction
     */
    MessageFlags[MessageFlags["Ephemeral"] = 64] = "Ephemeral";
    /**
     * This message is an Interaction Response and the bot is "thinking"
     */
    MessageFlags[MessageFlags["Loading"] = 128] = "Loading";
    /**
     * This message failed to mention some roles and add their members to the thread
     */
    MessageFlags[MessageFlags["FailedToMentionSomeRolesInThread"] = 256] = "FailedToMentionSomeRolesInThread";
})(MessageFlags = exports.MessageFlags || (exports.MessageFlags = {}));
var OverwriteType;
(function (OverwriteType) {
    OverwriteType[OverwriteType["Role"] = 0] = "Role";
    OverwriteType[OverwriteType["Member"] = 1] = "Member";
})(OverwriteType = exports.OverwriteType || (exports.OverwriteType = {}));
var ThreadAutoArchiveDuration;
(function (ThreadAutoArchiveDuration) {
    ThreadAutoArchiveDuration[ThreadAutoArchiveDuration["OneHour"] = 60] = "OneHour";
    ThreadAutoArchiveDuration[ThreadAutoArchiveDuration["OneDay"] = 1440] = "OneDay";
    ThreadAutoArchiveDuration[ThreadAutoArchiveDuration["ThreeDays"] = 4320] = "ThreeDays";
    ThreadAutoArchiveDuration[ThreadAutoArchiveDuration["OneWeek"] = 10080] = "OneWeek";
})(ThreadAutoArchiveDuration = exports.ThreadAutoArchiveDuration || (exports.ThreadAutoArchiveDuration = {}));
var ThreadMemberFlags;
(function (ThreadMemberFlags) {
})(ThreadMemberFlags = exports.ThreadMemberFlags || (exports.ThreadMemberFlags = {}));
/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-types
 * @deprecated *Embed types should be considered deprecated and might be removed in a future API version*
 */
var EmbedType;
(function (EmbedType) {
    /**
     * Generic embed rendered from embed attributes
     */
    EmbedType["Rich"] = "rich";
    /**
     * Image embed
     */
    EmbedType["Image"] = "image";
    /**
     * Video embed
     */
    EmbedType["Video"] = "video";
    /**
     * Animated gif image embed rendered as a video embed
     */
    EmbedType["GIFV"] = "gifv";
    /**
     * Article embed
     */
    EmbedType["Article"] = "article";
    /**
     * Link embed
     */
    EmbedType["Link"] = "link";
    /**
     * Auto moderation alert embed
     *
     * @unstable This embed type is currently not documented by Discord, but it is returned in the auto moderation system messages.
     */
    EmbedType["AutoModerationMessage"] = "auto_moderation_message";
})(EmbedType = exports.EmbedType || (exports.EmbedType = {}));
/**
 * https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mention-types
 */
var AllowedMentionsTypes;
(function (AllowedMentionsTypes) {
    /**
     * Controls @everyone and @here mentions
     */
    AllowedMentionsTypes["Everyone"] = "everyone";
    /**
     * Controls role mentions
     */
    AllowedMentionsTypes["Role"] = "roles";
    /**
     * Controls user mentions
     */
    AllowedMentionsTypes["User"] = "users";
})(AllowedMentionsTypes = exports.AllowedMentionsTypes || (exports.AllowedMentionsTypes = {}));
/**
 * https://discord.com/developers/docs/interactions/message-components#component-object-component-types
 */
var ComponentType;
(function (ComponentType) {
    /**
     * Action Row component
     */
    ComponentType[ComponentType["ActionRow"] = 1] = "ActionRow";
    /**
     * Button component
     */
    ComponentType[ComponentType["Button"] = 2] = "Button";
    /**
     * Select menu for picking from defined text options
     */
    ComponentType[ComponentType["StringSelect"] = 3] = "StringSelect";
    /**
     * Text Input component
     */
    ComponentType[ComponentType["TextInput"] = 4] = "TextInput";
    /**
     * Select menu for users
     */
    ComponentType[ComponentType["UserSelect"] = 5] = "UserSelect";
    /**
     * Select menu for roles
     */
    ComponentType[ComponentType["RoleSelect"] = 6] = "RoleSelect";
    /**
     * Select menu for users and roles
     */
    ComponentType[ComponentType["MentionableSelect"] = 7] = "MentionableSelect";
    /**
     * Select menu for channels
     */
    ComponentType[ComponentType["ChannelSelect"] = 8] = "ChannelSelect";
    // EVERYTHING BELOW THIS LINE SHOULD BE OLD NAMES FOR RENAMED ENUM MEMBERS //
    /**
     * Select menu for picking from defined text options
     *
     * @deprecated This is the old name for {@apilink ComponentType#StringSelect}
     */
    ComponentType[ComponentType["SelectMenu"] = 3] = "SelectMenu";
})(ComponentType = exports.ComponentType || (exports.ComponentType = {}));
/**
 * https://discord.com/developers/docs/interactions/message-components#button-object-button-styles
 */
var ButtonStyle;
(function (ButtonStyle) {
    ButtonStyle[ButtonStyle["Primary"] = 1] = "Primary";
    ButtonStyle[ButtonStyle["Secondary"] = 2] = "Secondary";
    ButtonStyle[ButtonStyle["Success"] = 3] = "Success";
    ButtonStyle[ButtonStyle["Danger"] = 4] = "Danger";
    ButtonStyle[ButtonStyle["Link"] = 5] = "Link";
})(ButtonStyle = exports.ButtonStyle || (exports.ButtonStyle = {}));
/**
 * https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-styles
 */
var TextInputStyle;
(function (TextInputStyle) {
    TextInputStyle[TextInputStyle["Short"] = 1] = "Short";
    TextInputStyle[TextInputStyle["Paragraph"] = 2] = "Paragraph";
})(TextInputStyle = exports.TextInputStyle || (exports.TextInputStyle = {}));
/**
 * https://discord.com/developers/docs/resources/channel#channel-object-channel-flags
 */
var ChannelFlags;
(function (ChannelFlags) {
    /**
     * This thread is pinned to the top of its parent forum channel
     */
    ChannelFlags[ChannelFlags["Pinned"] = 2] = "Pinned";
    /**
     * Whether a tag is required to be specified when creating a thread in a forum channel.
     * Tags are specified in the `applied_tags` field
     */
    ChannelFlags[ChannelFlags["RequireTag"] = 16] = "RequireTag";
})(ChannelFlags = exports.ChannelFlags || (exports.ChannelFlags = {}));
//# sourceMappingURL=channel.js.map

/***/ }),

/***/ 5110:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/resources/emoji
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=emoji.js.map

/***/ }),

/***/ 8290:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from
 *  - https://discord.com/developers/docs/topics/gateway
 *  - https://discord.com/developers/docs/topics/gateway-events
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActivityFlags = exports.ActivityType = exports.ActivityPlatform = exports.PresenceUpdateStatus = void 0;
var PresenceUpdateStatus;
(function (PresenceUpdateStatus) {
    PresenceUpdateStatus["Online"] = "online";
    PresenceUpdateStatus["DoNotDisturb"] = "dnd";
    PresenceUpdateStatus["Idle"] = "idle";
    /**
     * Invisible and shown as offline
     */
    PresenceUpdateStatus["Invisible"] = "invisible";
    PresenceUpdateStatus["Offline"] = "offline";
})(PresenceUpdateStatus = exports.PresenceUpdateStatus || (exports.PresenceUpdateStatus = {}));
/**
 * @unstable This enum is currently not documented by Discord but has known values which we will try to keep up to date.
 * Values might be added or removed without a major version bump.
 */
var ActivityPlatform;
(function (ActivityPlatform) {
    ActivityPlatform["Desktop"] = "desktop";
    ActivityPlatform["Xbox"] = "xbox";
    ActivityPlatform["Samsung"] = "samsung";
    ActivityPlatform["IOS"] = "ios";
    ActivityPlatform["Android"] = "android";
    ActivityPlatform["Embedded"] = "embedded";
    ActivityPlatform["PS4"] = "ps4";
    ActivityPlatform["PS5"] = "ps5";
})(ActivityPlatform = exports.ActivityPlatform || (exports.ActivityPlatform = {}));
/**
 * https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types
 */
var ActivityType;
(function (ActivityType) {
    /**
     * Playing {game}
     */
    ActivityType[ActivityType["Playing"] = 0] = "Playing";
    /**
     * Streaming {details}
     */
    ActivityType[ActivityType["Streaming"] = 1] = "Streaming";
    /**
     * Listening to {name}
     */
    ActivityType[ActivityType["Listening"] = 2] = "Listening";
    /**
     * Watching {details}
     */
    ActivityType[ActivityType["Watching"] = 3] = "Watching";
    /**
     * {emoji} {details}
     */
    ActivityType[ActivityType["Custom"] = 4] = "Custom";
    /**
     * Competing in {name}
     */
    ActivityType[ActivityType["Competing"] = 5] = "Competing";
})(ActivityType = exports.ActivityType || (exports.ActivityType = {}));
/**
 * https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-flags
 */
var ActivityFlags;
(function (ActivityFlags) {
    ActivityFlags[ActivityFlags["Instance"] = 1] = "Instance";
    ActivityFlags[ActivityFlags["Join"] = 2] = "Join";
    ActivityFlags[ActivityFlags["Spectate"] = 4] = "Spectate";
    ActivityFlags[ActivityFlags["JoinRequest"] = 8] = "JoinRequest";
    ActivityFlags[ActivityFlags["Sync"] = 16] = "Sync";
    ActivityFlags[ActivityFlags["Play"] = 32] = "Play";
    ActivityFlags[ActivityFlags["PartyPrivacyFriends"] = 64] = "PartyPrivacyFriends";
    ActivityFlags[ActivityFlags["PartyPrivacyVoiceChannel"] = 128] = "PartyPrivacyVoiceChannel";
    ActivityFlags[ActivityFlags["Embedded"] = 256] = "Embedded";
})(ActivityFlags = exports.ActivityFlags || (exports.ActivityFlags = {}));
//# sourceMappingURL=gateway.js.map

/***/ }),

/***/ 8099:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/resources/guild
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MembershipScreeningFieldType = exports.GuildWidgetStyle = exports.IntegrationExpireBehavior = exports.GuildFeature = exports.GuildSystemChannelFlags = exports.GuildHubType = exports.GuildPremiumTier = exports.GuildVerificationLevel = exports.GuildNSFWLevel = exports.GuildMFALevel = exports.GuildExplicitContentFilter = exports.GuildDefaultMessageNotifications = void 0;
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level
 */
var GuildDefaultMessageNotifications;
(function (GuildDefaultMessageNotifications) {
    GuildDefaultMessageNotifications[GuildDefaultMessageNotifications["AllMessages"] = 0] = "AllMessages";
    GuildDefaultMessageNotifications[GuildDefaultMessageNotifications["OnlyMentions"] = 1] = "OnlyMentions";
})(GuildDefaultMessageNotifications = exports.GuildDefaultMessageNotifications || (exports.GuildDefaultMessageNotifications = {}));
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level
 */
var GuildExplicitContentFilter;
(function (GuildExplicitContentFilter) {
    GuildExplicitContentFilter[GuildExplicitContentFilter["Disabled"] = 0] = "Disabled";
    GuildExplicitContentFilter[GuildExplicitContentFilter["MembersWithoutRoles"] = 1] = "MembersWithoutRoles";
    GuildExplicitContentFilter[GuildExplicitContentFilter["AllMembers"] = 2] = "AllMembers";
})(GuildExplicitContentFilter = exports.GuildExplicitContentFilter || (exports.GuildExplicitContentFilter = {}));
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-mfa-level
 */
var GuildMFALevel;
(function (GuildMFALevel) {
    GuildMFALevel[GuildMFALevel["None"] = 0] = "None";
    GuildMFALevel[GuildMFALevel["Elevated"] = 1] = "Elevated";
})(GuildMFALevel = exports.GuildMFALevel || (exports.GuildMFALevel = {}));
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level
 */
var GuildNSFWLevel;
(function (GuildNSFWLevel) {
    GuildNSFWLevel[GuildNSFWLevel["Default"] = 0] = "Default";
    GuildNSFWLevel[GuildNSFWLevel["Explicit"] = 1] = "Explicit";
    GuildNSFWLevel[GuildNSFWLevel["Safe"] = 2] = "Safe";
    GuildNSFWLevel[GuildNSFWLevel["AgeRestricted"] = 3] = "AgeRestricted";
})(GuildNSFWLevel = exports.GuildNSFWLevel || (exports.GuildNSFWLevel = {}));
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-verification-level
 */
var GuildVerificationLevel;
(function (GuildVerificationLevel) {
    /**
     * Unrestricted
     */
    GuildVerificationLevel[GuildVerificationLevel["None"] = 0] = "None";
    /**
     * Must have verified email on account
     */
    GuildVerificationLevel[GuildVerificationLevel["Low"] = 1] = "Low";
    /**
     * Must be registered on Discord for longer than 5 minutes
     */
    GuildVerificationLevel[GuildVerificationLevel["Medium"] = 2] = "Medium";
    /**
     * Must be a member of the guild for longer than 10 minutes
     */
    GuildVerificationLevel[GuildVerificationLevel["High"] = 3] = "High";
    /**
     * Must have a verified phone number
     */
    GuildVerificationLevel[GuildVerificationLevel["VeryHigh"] = 4] = "VeryHigh";
})(GuildVerificationLevel = exports.GuildVerificationLevel || (exports.GuildVerificationLevel = {}));
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-premium-tier
 */
var GuildPremiumTier;
(function (GuildPremiumTier) {
    GuildPremiumTier[GuildPremiumTier["None"] = 0] = "None";
    GuildPremiumTier[GuildPremiumTier["Tier1"] = 1] = "Tier1";
    GuildPremiumTier[GuildPremiumTier["Tier2"] = 2] = "Tier2";
    GuildPremiumTier[GuildPremiumTier["Tier3"] = 3] = "Tier3";
})(GuildPremiumTier = exports.GuildPremiumTier || (exports.GuildPremiumTier = {}));
var GuildHubType;
(function (GuildHubType) {
    GuildHubType[GuildHubType["Default"] = 0] = "Default";
    GuildHubType[GuildHubType["HighSchool"] = 1] = "HighSchool";
    GuildHubType[GuildHubType["College"] = 2] = "College";
})(GuildHubType = exports.GuildHubType || (exports.GuildHubType = {}));
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags
 */
var GuildSystemChannelFlags;
(function (GuildSystemChannelFlags) {
    /**
     * Suppress member join notifications
     */
    GuildSystemChannelFlags[GuildSystemChannelFlags["SuppressJoinNotifications"] = 1] = "SuppressJoinNotifications";
    /**
     * Suppress server boost notifications
     */
    GuildSystemChannelFlags[GuildSystemChannelFlags["SuppressPremiumSubscriptions"] = 2] = "SuppressPremiumSubscriptions";
    /**
     * Suppress server setup tips
     */
    GuildSystemChannelFlags[GuildSystemChannelFlags["SuppressGuildReminderNotifications"] = 4] = "SuppressGuildReminderNotifications";
    /**
     * Hide member join sticker reply buttons
     */
    GuildSystemChannelFlags[GuildSystemChannelFlags["SuppressJoinNotificationReplies"] = 8] = "SuppressJoinNotificationReplies";
})(GuildSystemChannelFlags = exports.GuildSystemChannelFlags || (exports.GuildSystemChannelFlags = {}));
/**
 * https://discord.com/developers/docs/resources/guild#guild-object-guild-features
 */
var GuildFeature;
(function (GuildFeature) {
    /**
     * Guild has access to set an animated guild banner image
     */
    GuildFeature["AnimatedBanner"] = "ANIMATED_BANNER";
    /**
     * Guild has access to set an animated guild icon
     */
    GuildFeature["AnimatedIcon"] = "ANIMATED_ICON";
    /**
     * Guild is using the old permissions configuration behavior
     *
     * See https://discord.com/developers/docs/change-log#upcoming-application-command-permission-changes
     */
    GuildFeature["ApplicationCommandPermissionsV2"] = "APPLICATION_COMMAND_PERMISSIONS_V2";
    /**
     * Guild has set up auto moderation rules
     */
    GuildFeature["AutoModeration"] = "AUTO_MODERATION";
    /**
     * Guild has access to set a guild banner image
     */
    GuildFeature["Banner"] = "BANNER";
    /**
     * Guild can enable welcome screen, Membership Screening and discovery, and receives community updates
     */
    GuildFeature["Community"] = "COMMUNITY";
    /*
     * Guild has been set as a support server on the App Directory
     */
    GuildFeature["DeveloperSupportServer"] = "DEVELOPER_SUPPORT_SERVER";
    /**
     * Guild is able to be discovered in the directory
     */
    GuildFeature["Discoverable"] = "DISCOVERABLE";
    /**
     * Guild is able to be featured in the directory
     */
    GuildFeature["Featurable"] = "FEATURABLE";
    /**
     * Guild is listed in a directory channel
     */
    GuildFeature["HasDirectoryEntry"] = "HAS_DIRECTORY_ENTRY";
    /**
     * Guild is a Student Hub
     *
     * See https://support.discord.com/hc/articles/4406046651927
     *
     * @unstable This feature is currently not documented by Discord, but has known value
     */
    GuildFeature["Hub"] = "HUB";
    /**
     * Guild has disabled invite usage, preventing users from joining
     */
    GuildFeature["InvitesDisabled"] = "INVITES_DISABLED";
    /**
     * Guild has access to set an invite splash background
     */
    GuildFeature["InviteSplash"] = "INVITE_SPLASH";
    /**
     * Guild is in a Student Hub
     *
     * See https://support.discord.com/hc/articles/4406046651927
     *
     * @unstable This feature is currently not documented by Discord, but has known value
     */
    GuildFeature["LinkedToHub"] = "LINKED_TO_HUB";
    /**
     * Guild has enabled Membership Screening
     */
    GuildFeature["MemberVerificationGateEnabled"] = "MEMBER_VERIFICATION_GATE_ENABLED";
    /**
     * Guild has enabled monetization
     */
    GuildFeature["MonetizationEnabled"] = "MONETIZATION_ENABLED";
    /**
     * Guild has increased custom sticker slots
     */
    GuildFeature["MoreStickers"] = "MORE_STICKERS";
    /**
     * Guild has access to create news channels
     */
    GuildFeature["News"] = "NEWS";
    /**
     * Guild is partnered
     */
    GuildFeature["Partnered"] = "PARTNERED";
    /**
     * Guild can be previewed before joining via Membership Screening or the directory
     */
    GuildFeature["PreviewEnabled"] = "PREVIEW_ENABLED";
    /**
     * Guild has access to create private threads
     */
    GuildFeature["PrivateThreads"] = "PRIVATE_THREADS";
    GuildFeature["RelayEnabled"] = "RELAY_ENABLED";
    /**
     * Guild is able to set role icons
     */
    GuildFeature["RoleIcons"] = "ROLE_ICONS";
    /**
     * Guild has enabled ticketed events
     */
    GuildFeature["TicketedEventsEnabled"] = "TICKETED_EVENTS_ENABLED";
    /**
     * Guild has access to set a vanity URL
     */
    GuildFeature["VanityURL"] = "VANITY_URL";
    /**
     * Guild is verified
     */
    GuildFeature["Verified"] = "VERIFIED";
    /**
     * Guild has access to set 384kbps bitrate in voice (previously VIP voice servers)
     */
    GuildFeature["VIPRegions"] = "VIP_REGIONS";
    /**
     * Guild has enabled the welcome screen
     */
    GuildFeature["WelcomeScreenEnabled"] = "WELCOME_SCREEN_ENABLED";
})(GuildFeature = exports.GuildFeature || (exports.GuildFeature = {}));
/**
 * https://discord.com/developers/docs/resources/guild#integration-object-integration-expire-behaviors
 */
var IntegrationExpireBehavior;
(function (IntegrationExpireBehavior) {
    IntegrationExpireBehavior[IntegrationExpireBehavior["RemoveRole"] = 0] = "RemoveRole";
    IntegrationExpireBehavior[IntegrationExpireBehavior["Kick"] = 1] = "Kick";
})(IntegrationExpireBehavior = exports.IntegrationExpireBehavior || (exports.IntegrationExpireBehavior = {}));
/**
 * https://discord.com/developers/docs/resources/guild#get-guild-widget-image-widget-style-options
 */
var GuildWidgetStyle;
(function (GuildWidgetStyle) {
    /**
     * Shield style widget with Discord icon and guild members online count
     */
    GuildWidgetStyle["Shield"] = "shield";
    /**
     * Large image with guild icon, name and online count. "POWERED BY DISCORD" as the footer of the widget
     */
    GuildWidgetStyle["Banner1"] = "banner1";
    /**
     * Smaller widget style with guild icon, name and online count. Split on the right with Discord logo
     */
    GuildWidgetStyle["Banner2"] = "banner2";
    /**
     * Large image with guild icon, name and online count. In the footer, Discord logo on the left and "Chat Now" on the right
     */
    GuildWidgetStyle["Banner3"] = "banner3";
    /**
     * Large Discord logo at the top of the widget. Guild icon, name and online count in the middle portion of the widget
     * and a "JOIN MY SERVER" button at the bottom
     */
    GuildWidgetStyle["Banner4"] = "banner4";
})(GuildWidgetStyle = exports.GuildWidgetStyle || (exports.GuildWidgetStyle = {}));
var MembershipScreeningFieldType;
(function (MembershipScreeningFieldType) {
    /**
     * Server Rules
     */
    MembershipScreeningFieldType["Terms"] = "TERMS";
})(MembershipScreeningFieldType = exports.MembershipScreeningFieldType || (exports.MembershipScreeningFieldType = {}));
//# sourceMappingURL=guild.js.map

/***/ }),

/***/ 2497:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GuildScheduledEventPrivacyLevel = exports.GuildScheduledEventStatus = exports.GuildScheduledEventEntityType = void 0;
/**
 * https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-entity-types
 */
var GuildScheduledEventEntityType;
(function (GuildScheduledEventEntityType) {
    GuildScheduledEventEntityType[GuildScheduledEventEntityType["StageInstance"] = 1] = "StageInstance";
    GuildScheduledEventEntityType[GuildScheduledEventEntityType["Voice"] = 2] = "Voice";
    GuildScheduledEventEntityType[GuildScheduledEventEntityType["External"] = 3] = "External";
})(GuildScheduledEventEntityType = exports.GuildScheduledEventEntityType || (exports.GuildScheduledEventEntityType = {}));
/**
 * https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-status
 */
var GuildScheduledEventStatus;
(function (GuildScheduledEventStatus) {
    GuildScheduledEventStatus[GuildScheduledEventStatus["Scheduled"] = 1] = "Scheduled";
    GuildScheduledEventStatus[GuildScheduledEventStatus["Active"] = 2] = "Active";
    GuildScheduledEventStatus[GuildScheduledEventStatus["Completed"] = 3] = "Completed";
    GuildScheduledEventStatus[GuildScheduledEventStatus["Canceled"] = 4] = "Canceled";
})(GuildScheduledEventStatus = exports.GuildScheduledEventStatus || (exports.GuildScheduledEventStatus = {}));
/**
 * https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-privacy-level
 */
var GuildScheduledEventPrivacyLevel;
(function (GuildScheduledEventPrivacyLevel) {
    /**
     * The scheduled event is only accessible to guild members
     */
    GuildScheduledEventPrivacyLevel[GuildScheduledEventPrivacyLevel["GuildOnly"] = 2] = "GuildOnly";
})(GuildScheduledEventPrivacyLevel = exports.GuildScheduledEventPrivacyLevel || (exports.GuildScheduledEventPrivacyLevel = {}));
//# sourceMappingURL=guildScheduledEvent.js.map

/***/ }),

/***/ 7624:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(8194), exports);
__exportStar(__webpack_require__(1628), exports);
__exportStar(__webpack_require__(9100), exports);
__exportStar(__webpack_require__(7657), exports);
__exportStar(__webpack_require__(3652), exports);
__exportStar(__webpack_require__(5110), exports);
__exportStar(__webpack_require__(8290), exports);
__exportStar(__webpack_require__(8099), exports);
__exportStar(__webpack_require__(2497), exports);
__exportStar(__webpack_require__(8532), exports);
__exportStar(__webpack_require__(8121), exports);
__exportStar(__webpack_require__(4475), exports);
__exportStar(__webpack_require__(6930), exports);
__exportStar(__webpack_require__(6469), exports);
__exportStar(__webpack_require__(9889), exports);
__exportStar(__webpack_require__(6500), exports);
__exportStar(__webpack_require__(9284), exports);
__exportStar(__webpack_require__(3117), exports);
__exportStar(__webpack_require__(4732), exports);
__exportStar(__webpack_require__(5586), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8532:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(8644), exports);
__exportStar(__webpack_require__(1146), exports);
__exportStar(__webpack_require__(5286), exports);
__exportStar(__webpack_require__(5733), exports);
__exportStar(__webpack_require__(2591), exports);
__exportStar(__webpack_require__(9191), exports);
__exportStar(__webpack_require__(4086), exports);
//# sourceMappingURL=interactions.js.map

/***/ }),

/***/ 8121:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/resources/invite
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InviteTargetType = void 0;
/**
 * https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types
 */
var InviteTargetType;
(function (InviteTargetType) {
    InviteTargetType[InviteTargetType["Stream"] = 1] = "Stream";
    InviteTargetType[InviteTargetType["EmbeddedApplication"] = 2] = "EmbeddedApplication";
})(InviteTargetType = exports.InviteTargetType || (exports.InviteTargetType = {}));
//# sourceMappingURL=invite.js.map

/***/ }),

/***/ 4475:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/topics/oauth2
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OAuth2Scopes = void 0;
var OAuth2Scopes;
(function (OAuth2Scopes) {
    /**
     * For oauth2 bots, this puts the bot in the user's selected guild by default
     */
    OAuth2Scopes["Bot"] = "bot";
    /**
     * Allows [/users/@me/connections](https://discord.com/developers/docs/resources/user#get-user-connections)
     * to return linked third-party accounts
     *
     * See https://discord.com/developers/docs/resources/user#get-user-connections
     */
    OAuth2Scopes["Connections"] = "connections";
    /**
     * Allows your app to see information about the user's DMs and group DMs - requires Discord approval
     */
    OAuth2Scopes["DMChannelsRead"] = "dm_channels.read";
    /**
     * Enables [/users/@me](https://discord.com/developers/docs/resources/user#get-current-user) to return an `email`
     *
     * See https://discord.com/developers/docs/resources/user#get-current-user
     */
    OAuth2Scopes["Email"] = "email";
    /**
     * Allows [/users/@me](https://discord.com/developers/docs/resources/user#get-current-user) without `email`
     *
     * See https://discord.com/developers/docs/resources/user#get-current-user
     */
    OAuth2Scopes["Identify"] = "identify";
    /**
     * Allows [/users/@me/guilds](https://discord.com/developers/docs/resources/user#get-current-user-guilds)
     * to return basic information about all of a user's guilds
     *
     * See https://discord.com/developers/docs/resources/user#get-current-user-guilds
     */
    OAuth2Scopes["Guilds"] = "guilds";
    /**
     * Allows [/guilds/{guild.id}/members/{user.id}](https://discord.com/developers/docs/resources/guild#add-guild-member)
     * to be used for joining users to a guild
     *
     * See https://discord.com/developers/docs/resources/guild#add-guild-member
     */
    OAuth2Scopes["GuildsJoin"] = "guilds.join";
    /**
     * Allows /users/@me/guilds/{guild.id}/member to return a user's member information in a guild
     *
     * See https://discord.com/developers/docs/resources/user#get-current-user-guild-member
     */
    OAuth2Scopes["GuildsMembersRead"] = "guilds.members.read";
    /**
     * Allows your app to join users to a group dm
     *
     * See https://discord.com/developers/docs/resources/channel#group-dm-add-recipient
     */
    OAuth2Scopes["GroupDMJoins"] = "gdm.join";
    /**
     * For local rpc server api access, this allows you to read messages from all client channels
     * (otherwise restricted to channels/guilds your app creates)
     */
    OAuth2Scopes["MessagesRead"] = "messages.read";
    /**
     * Allows your app to update a user's connection and metadata for the app
     */
    OAuth2Scopes["RoleConnectionsWrite"] = "role_connections.write";
    /**
     * For local rpc server access, this allows you to control a user's local Discord client - requires Discord approval
     */
    OAuth2Scopes["RPC"] = "rpc";
    /**
     * For local rpc server api access, this allows you to receive notifications pushed out to the user - requires Discord approval
     */
    OAuth2Scopes["RPCNotificationsRead"] = "rpc.notifications.read";
    /**
     * This generates a webhook that is returned in the oauth token response for authorization code grants
     */
    OAuth2Scopes["WebhookIncoming"] = "webhook.incoming";
    /**
     * Allows your app to connect to voice on user's behalf and see all the voice members - requires Discord approval
     */
    OAuth2Scopes["Voice"] = "voice";
    /**
     * Allows your app to upload/update builds for a user's applications - requires Discord approval
     */
    OAuth2Scopes["ApplicationsBuildsUpload"] = "applications.builds.upload";
    /**
     * Allows your app to read build data for a user's applications
     */
    OAuth2Scopes["ApplicationsBuildsRead"] = "applications.builds.read";
    /**
     * Allows your app to read and update store data (SKUs, store listings, achievements, etc.) for a user's applications
     */
    OAuth2Scopes["ApplicationsStoreUpdate"] = "applications.store.update";
    /**
     * Allows your app to read entitlements for a user's applications
     */
    OAuth2Scopes["ApplicationsEntitlements"] = "applications.entitlements";
    /**
     * Allows your app to know a user's friends and implicit relationships - requires Discord approval
     */
    OAuth2Scopes["RelationshipsRead"] = "relationships.read";
    /**
     * Allows your app to fetch data from a user's "Now Playing/Recently Played" list - requires Discord approval
     */
    OAuth2Scopes["ActivitiesRead"] = "activities.read";
    /**
     * Allows your app to update a user's activity - requires Discord approval (NOT REQUIRED FOR GAMESDK ACTIVITY MANAGER)
     *
     * See https://discord.com/developers/docs/game-sdk/activities
     */
    OAuth2Scopes["ActivitiesWrite"] = "activities.write";
    /**
     * Allows your app to use Application Commands in a guild
     *
     * See https://discord.com/developers/docs/interactions/application-commands
     */
    OAuth2Scopes["ApplicationsCommands"] = "applications.commands";
    /**
     * Allows your app to update its Application Commands via this bearer token - client credentials grant only
     *
     * See https://discord.com/developers/docs/interactions/application-commands
     */
    OAuth2Scopes["ApplicationsCommandsUpdate"] = "applications.commands.update";
    /**
     * Allows your app to update permissions for its commands using a Bearer token - client credentials grant only
     *
     * See https://discord.com/developers/docs/interactions/application-commands
     */
    OAuth2Scopes["ApplicationCommandsPermissionsUpdate"] = "applications.commands.permissions.update";
})(OAuth2Scopes = exports.OAuth2Scopes || (exports.OAuth2Scopes = {}));
//# sourceMappingURL=oauth2.js.map

/***/ }),

/***/ 6930:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/topics/permissions
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=permissions.js.map

/***/ }),

/***/ 6469:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StageInstancePrivacyLevel = void 0;
/**
 * https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-privacy-level
 */
var StageInstancePrivacyLevel;
(function (StageInstancePrivacyLevel) {
    /**
     * The stage instance is visible publicly, such as on stage discovery
     * @deprecated
     */
    StageInstancePrivacyLevel[StageInstancePrivacyLevel["Public"] = 1] = "Public";
    /**
     * The stage instance is visible to only guild members
     */
    StageInstancePrivacyLevel[StageInstancePrivacyLevel["GuildOnly"] = 2] = "GuildOnly";
})(StageInstancePrivacyLevel = exports.StageInstancePrivacyLevel || (exports.StageInstancePrivacyLevel = {}));
//# sourceMappingURL=stageInstance.js.map

/***/ }),

/***/ 9889:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/resources/sticker
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StickerFormatType = exports.StickerType = void 0;
/**
 * https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-types
 */
var StickerType;
(function (StickerType) {
    /**
     * An official sticker in a pack, part of Nitro or in a removed purchasable pack
     */
    StickerType[StickerType["Standard"] = 1] = "Standard";
    /**
     * A sticker uploaded to a guild for the guild's members
     */
    StickerType[StickerType["Guild"] = 2] = "Guild";
})(StickerType = exports.StickerType || (exports.StickerType = {}));
/**
 * https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-format-types
 */
var StickerFormatType;
(function (StickerFormatType) {
    StickerFormatType[StickerFormatType["PNG"] = 1] = "PNG";
    StickerFormatType[StickerFormatType["APNG"] = 2] = "APNG";
    StickerFormatType[StickerFormatType["Lottie"] = 3] = "Lottie";
})(StickerFormatType = exports.StickerFormatType || (exports.StickerFormatType = {}));
//# sourceMappingURL=sticker.js.map

/***/ }),

/***/ 6500:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/topics/teams
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TeamMemberMembershipState = void 0;
/**
 * https://discord.com/developers/docs/topics/teams#data-models-membership-state-enum
 */
var TeamMemberMembershipState;
(function (TeamMemberMembershipState) {
    TeamMemberMembershipState[TeamMemberMembershipState["Invited"] = 1] = "Invited";
    TeamMemberMembershipState[TeamMemberMembershipState["Accepted"] = 2] = "Accepted";
})(TeamMemberMembershipState = exports.TeamMemberMembershipState || (exports.TeamMemberMembershipState = {}));
//# sourceMappingURL=teams.js.map

/***/ }),

/***/ 9284:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/resources/guild-template
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=template.js.map

/***/ }),

/***/ 3117:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/resources/user
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConnectionVisibility = exports.ConnectionService = exports.UserPremiumType = exports.UserFlags = void 0;
/**
 * https://discord.com/developers/docs/resources/user#user-object-user-flags
 */
var UserFlags;
(function (UserFlags) {
    /**
     * Discord Employee
     */
    UserFlags[UserFlags["Staff"] = 1] = "Staff";
    /**
     * Partnered Server Owner
     */
    UserFlags[UserFlags["Partner"] = 2] = "Partner";
    /**
     * HypeSquad Events Member
     */
    UserFlags[UserFlags["Hypesquad"] = 4] = "Hypesquad";
    /**
     * Bug Hunter Level 1
     */
    UserFlags[UserFlags["BugHunterLevel1"] = 8] = "BugHunterLevel1";
    /**
     * House Bravery Member
     */
    UserFlags[UserFlags["HypeSquadOnlineHouse1"] = 64] = "HypeSquadOnlineHouse1";
    /**
     * House Brilliance Member
     */
    UserFlags[UserFlags["HypeSquadOnlineHouse2"] = 128] = "HypeSquadOnlineHouse2";
    /**
     * House Balance Member
     */
    UserFlags[UserFlags["HypeSquadOnlineHouse3"] = 256] = "HypeSquadOnlineHouse3";
    /**
     * Early Nitro Supporter
     */
    UserFlags[UserFlags["PremiumEarlySupporter"] = 512] = "PremiumEarlySupporter";
    /**
     * User is a [team](https://discord.com/developers/docs/topics/teams)
     */
    UserFlags[UserFlags["TeamPseudoUser"] = 1024] = "TeamPseudoUser";
    /**
     * Bug Hunter Level 2
     */
    UserFlags[UserFlags["BugHunterLevel2"] = 16384] = "BugHunterLevel2";
    /**
     * Verified Bot
     */
    UserFlags[UserFlags["VerifiedBot"] = 65536] = "VerifiedBot";
    /**
     * Early Verified Bot Developer
     */
    UserFlags[UserFlags["VerifiedDeveloper"] = 131072] = "VerifiedDeveloper";
    /**
     * Moderator Programs Alumni
     */
    UserFlags[UserFlags["CertifiedModerator"] = 262144] = "CertifiedModerator";
    /**
     * Bot uses only [HTTP interactions](https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction) and is shown in the online member list
     */
    UserFlags[UserFlags["BotHTTPInteractions"] = 524288] = "BotHTTPInteractions";
    /**
     * User has been identified as spammer
     *
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     */
    UserFlags[UserFlags["Spammer"] = 1048576] = "Spammer";
    /**
     * User is an [Active Developer](https://support-dev.discord.com/hc/articles/10113997751447)
     */
    UserFlags[UserFlags["ActiveDeveloper"] = 4194304] = "ActiveDeveloper";
    /**
     * User's account has been [quarantined](https://support.discord.com/hc/articles/6461420677527) based on recent activity
     *
     * @unstable This user flag is currently not documented by Discord but has a known value which we will try to keep up to date.
     *
     * @privateRemarks
     *
     * This value would be 1 << 44, but bit shifting above 1 << 30 requires bigints
     */
    UserFlags[UserFlags["Quarantined"] = 17592186044416] = "Quarantined";
})(UserFlags = exports.UserFlags || (exports.UserFlags = {}));
/**
 * https://discord.com/developers/docs/resources/user#user-object-premium-types
 */
var UserPremiumType;
(function (UserPremiumType) {
    UserPremiumType[UserPremiumType["None"] = 0] = "None";
    UserPremiumType[UserPremiumType["NitroClassic"] = 1] = "NitroClassic";
    UserPremiumType[UserPremiumType["Nitro"] = 2] = "Nitro";
    UserPremiumType[UserPremiumType["NitroBasic"] = 3] = "NitroBasic";
})(UserPremiumType = exports.UserPremiumType || (exports.UserPremiumType = {}));
var ConnectionService;
(function (ConnectionService) {
    ConnectionService["BattleNet"] = "battlenet";
    ConnectionService["eBay"] = "ebay";
    ConnectionService["EpicGames"] = "epicgames";
    ConnectionService["Facebook"] = "facebook";
    ConnectionService["GitHub"] = "github";
    ConnectionService["LeagueOfLegends"] = "leagueoflegends";
    ConnectionService["PlayStationNetwork"] = "playstation";
    ConnectionService["Reddit"] = "reddit";
    ConnectionService["RiotGames"] = "riotgames";
    ConnectionService["PayPal"] = "paypal";
    ConnectionService["Spotify"] = "spotify";
    ConnectionService["Skype"] = "skype";
    ConnectionService["Steam"] = "steam";
    ConnectionService["Twitch"] = "twitch";
    ConnectionService["Twitter"] = "twitter";
    ConnectionService["Xbox"] = "xbox";
    ConnectionService["YouTube"] = "youtube";
})(ConnectionService = exports.ConnectionService || (exports.ConnectionService = {}));
var ConnectionVisibility;
(function (ConnectionVisibility) {
    /**
     * Invisible to everyone except the user themselves
     */
    ConnectionVisibility[ConnectionVisibility["None"] = 0] = "None";
    /**
     * Visible to everyone
     */
    ConnectionVisibility[ConnectionVisibility["Everyone"] = 1] = "Everyone";
})(ConnectionVisibility = exports.ConnectionVisibility || (exports.ConnectionVisibility = {}));
//# sourceMappingURL=user.js.map

/***/ }),

/***/ 4732:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/resources/voice
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=voice.js.map

/***/ }),

/***/ 5586:
/***/ ((__unused_webpack_module, exports) => {


/**
 * Types extracted from https://discord.com/developers/docs/resources/webhook
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebhookType = void 0;
var WebhookType;
(function (WebhookType) {
    /**
     * Incoming Webhooks can post messages to channels with a generated token
     */
    WebhookType[WebhookType["Incoming"] = 1] = "Incoming";
    /**
     * Channel Follower Webhooks are internal webhooks used with Channel Following to post new messages into channels
     */
    WebhookType[WebhookType["ChannelFollower"] = 2] = "ChannelFollower";
    /**
     * Application webhooks are webhooks used with Interactions
     */
    WebhookType[WebhookType["Application"] = 3] = "Application";
})(WebhookType = exports.WebhookType || (exports.WebhookType = {}));
//# sourceMappingURL=webhook.js.map

/***/ }),

/***/ 2345:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Locale = exports.RESTJSONErrorCodes = void 0;
/**
 * https://discord.com/developers/docs/topics/opcodes-and-status-codes#json-json-error-codes
 */
var RESTJSONErrorCodes;
(function (RESTJSONErrorCodes) {
    RESTJSONErrorCodes[RESTJSONErrorCodes["GeneralError"] = 0] = "GeneralError";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownAccount"] = 10001] = "UnknownAccount";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownApplication"] = 10002] = "UnknownApplication";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownChannel"] = 10003] = "UnknownChannel";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownGuild"] = 10004] = "UnknownGuild";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownIntegration"] = 10005] = "UnknownIntegration";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownInvite"] = 10006] = "UnknownInvite";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownMember"] = 10007] = "UnknownMember";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownMessage"] = 10008] = "UnknownMessage";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownPermissionOverwrite"] = 10009] = "UnknownPermissionOverwrite";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownProvider"] = 10010] = "UnknownProvider";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownRole"] = 10011] = "UnknownRole";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownToken"] = 10012] = "UnknownToken";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownUser"] = 10013] = "UnknownUser";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownEmoji"] = 10014] = "UnknownEmoji";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownWebhook"] = 10015] = "UnknownWebhook";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownWebhookService"] = 10016] = "UnknownWebhookService";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownSession"] = 10020] = "UnknownSession";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownBan"] = 10026] = "UnknownBan";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownSKU"] = 10027] = "UnknownSKU";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownStoreListing"] = 10028] = "UnknownStoreListing";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownEntitlement"] = 10029] = "UnknownEntitlement";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownBuild"] = 10030] = "UnknownBuild";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownLobby"] = 10031] = "UnknownLobby";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownBranch"] = 10032] = "UnknownBranch";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownStoreDirectoryLayout"] = 10033] = "UnknownStoreDirectoryLayout";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownRedistributable"] = 10036] = "UnknownRedistributable";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownGiftCode"] = 10038] = "UnknownGiftCode";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownStream"] = 10049] = "UnknownStream";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownPremiumServerSubscribeCooldown"] = 10050] = "UnknownPremiumServerSubscribeCooldown";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownGuildTemplate"] = 10057] = "UnknownGuildTemplate";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownDiscoverableServerCategory"] = 10059] = "UnknownDiscoverableServerCategory";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownSticker"] = 10060] = "UnknownSticker";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownInteraction"] = 10062] = "UnknownInteraction";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownApplicationCommand"] = 10063] = "UnknownApplicationCommand";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownVoiceState"] = 10065] = "UnknownVoiceState";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownApplicationCommandPermissions"] = 10066] = "UnknownApplicationCommandPermissions";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownStageInstance"] = 10067] = "UnknownStageInstance";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownGuildMemberVerificationForm"] = 10068] = "UnknownGuildMemberVerificationForm";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownGuildWelcomeScreen"] = 10069] = "UnknownGuildWelcomeScreen";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownGuildScheduledEvent"] = 10070] = "UnknownGuildScheduledEvent";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownGuildScheduledEventUser"] = 10071] = "UnknownGuildScheduledEventUser";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnknownTag"] = 10087] = "UnknownTag";
    RESTJSONErrorCodes[RESTJSONErrorCodes["BotsCannotUseThisEndpoint"] = 20001] = "BotsCannotUseThisEndpoint";
    RESTJSONErrorCodes[RESTJSONErrorCodes["OnlyBotsCanUseThisEndpoint"] = 20002] = "OnlyBotsCanUseThisEndpoint";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ExplicitContentCannotBeSentToTheDesiredRecipient"] = 20009] = "ExplicitContentCannotBeSentToTheDesiredRecipient";
    RESTJSONErrorCodes[RESTJSONErrorCodes["NotAuthorizedToPerformThisActionOnThisApplication"] = 20012] = "NotAuthorizedToPerformThisActionOnThisApplication";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ActionCannotBePerformedDueToSlowmodeRateLimit"] = 20016] = "ActionCannotBePerformedDueToSlowmodeRateLimit";
    RESTJSONErrorCodes[RESTJSONErrorCodes["TheMazeIsntMeantForYou"] = 20017] = "TheMazeIsntMeantForYou";
    RESTJSONErrorCodes[RESTJSONErrorCodes["OnlyTheOwnerOfThisAccountCanPerformThisAction"] = 20018] = "OnlyTheOwnerOfThisAccountCanPerformThisAction";
    RESTJSONErrorCodes[RESTJSONErrorCodes["AnnouncementEditLimitExceeded"] = 20022] = "AnnouncementEditLimitExceeded";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UnderMinimumAge"] = 20024] = "UnderMinimumAge";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ChannelSendRateLimit"] = 20028] = "ChannelSendRateLimit";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ServerSendRateLimit"] = 20029] = "ServerSendRateLimit";
    RESTJSONErrorCodes[RESTJSONErrorCodes["StageTopicServerNameServerDescriptionOrChannelNamesContainDisallowedWords"] = 20031] = "StageTopicServerNameServerDescriptionOrChannelNamesContainDisallowedWords";
    RESTJSONErrorCodes[RESTJSONErrorCodes["GuildPremiumSubscriptionLevelTooLow"] = 20035] = "GuildPremiumSubscriptionLevelTooLow";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfGuildsReached"] = 30001] = "MaximumNumberOfGuildsReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfFriendsReached"] = 30002] = "MaximumNumberOfFriendsReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfPinsReachedForTheChannel"] = 30003] = "MaximumNumberOfPinsReachedForTheChannel";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfRecipientsReached"] = 30004] = "MaximumNumberOfRecipientsReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfGuildRolesReached"] = 30005] = "MaximumNumberOfGuildRolesReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfWebhooksReached"] = 30007] = "MaximumNumberOfWebhooksReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfEmojisReached"] = 30008] = "MaximumNumberOfEmojisReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfReactionsReached"] = 30010] = "MaximumNumberOfReactionsReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfGuildChannelsReached"] = 30013] = "MaximumNumberOfGuildChannelsReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfAttachmentsInAMessageReached"] = 30015] = "MaximumNumberOfAttachmentsInAMessageReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfInvitesReached"] = 30016] = "MaximumNumberOfInvitesReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfAnimatedEmojisReached"] = 30018] = "MaximumNumberOfAnimatedEmojisReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfServerMembersReached"] = 30019] = "MaximumNumberOfServerMembersReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfServerCategoriesReached"] = 30030] = "MaximumNumberOfServerCategoriesReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["GuildAlreadyHasTemplate"] = 30031] = "GuildAlreadyHasTemplate";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfApplicationCommandsReached"] = 30032] = "MaximumNumberOfApplicationCommandsReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumThreadParticipantsReached"] = 30033] = "MaximumThreadParticipantsReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumDailyApplicationCommandCreatesReached"] = 30034] = "MaximumDailyApplicationCommandCreatesReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfNonGuildMemberBansHasBeenExceeded"] = 30035] = "MaximumNumberOfNonGuildMemberBansHasBeenExceeded";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfBanFetchesHasBeenReached"] = 30037] = "MaximumNumberOfBanFetchesHasBeenReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfUncompletedGuildScheduledEventsReached"] = 30038] = "MaximumNumberOfUncompletedGuildScheduledEventsReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfStickersReached"] = 30039] = "MaximumNumberOfStickersReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfPruneRequestsHasBeenReached"] = 30040] = "MaximumNumberOfPruneRequestsHasBeenReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfGuildWidgetSettingsUpdatesHasBeenReached"] = 30042] = "MaximumNumberOfGuildWidgetSettingsUpdatesHasBeenReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfEditsToMessagesOlderThanOneHourReached"] = 30046] = "MaximumNumberOfEditsToMessagesOlderThanOneHourReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfPinnedThreadsInForumHasBeenReached"] = 30047] = "MaximumNumberOfPinnedThreadsInForumHasBeenReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumNumberOfTagsInForumHasBeenReached"] = 30048] = "MaximumNumberOfTagsInForumHasBeenReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["BitrateIsTooHighForChannelOfThisType"] = 30052] = "BitrateIsTooHighForChannelOfThisType";
    RESTJSONErrorCodes[RESTJSONErrorCodes["Unauthorized"] = 40001] = "Unauthorized";
    RESTJSONErrorCodes[RESTJSONErrorCodes["VerifyYourAccount"] = 40002] = "VerifyYourAccount";
    RESTJSONErrorCodes[RESTJSONErrorCodes["OpeningDirectMessagesTooFast"] = 40003] = "OpeningDirectMessagesTooFast";
    RESTJSONErrorCodes[RESTJSONErrorCodes["SendMessagesHasBeenTemporarilyDisabled"] = 40004] = "SendMessagesHasBeenTemporarilyDisabled";
    RESTJSONErrorCodes[RESTJSONErrorCodes["RequestEntityTooLarge"] = 40005] = "RequestEntityTooLarge";
    RESTJSONErrorCodes[RESTJSONErrorCodes["FeatureTemporarilyDisabledServerSide"] = 40006] = "FeatureTemporarilyDisabledServerSide";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UserBannedFromThisGuild"] = 40007] = "UserBannedFromThisGuild";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ConnectionHasBeenRevoked"] = 40012] = "ConnectionHasBeenRevoked";
    RESTJSONErrorCodes[RESTJSONErrorCodes["TargetUserIsNotConnectedToVoice"] = 40032] = "TargetUserIsNotConnectedToVoice";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ThisMessageWasAlreadyCrossposted"] = 40033] = "ThisMessageWasAlreadyCrossposted";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ApplicationCommandWithThatNameAlreadyExists"] = 40041] = "ApplicationCommandWithThatNameAlreadyExists";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ApplicationInteractionFailedToSend"] = 40043] = "ApplicationInteractionFailedToSend";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotSendAMessageInAForumChannel"] = 40058] = "CannotSendAMessageInAForumChannel";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InteractionHasAlreadyBeenAcknowledged"] = 40060] = "InteractionHasAlreadyBeenAcknowledged";
    RESTJSONErrorCodes[RESTJSONErrorCodes["TagNamesMustBeUnique"] = 40061] = "TagNamesMustBeUnique";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ThereAreNoTagsAvailableThatCanBeSetByNonModerators"] = 40066] = "ThereAreNoTagsAvailableThatCanBeSetByNonModerators";
    RESTJSONErrorCodes[RESTJSONErrorCodes["TagRequiredToCreateAForumPostInThisChannel"] = 40067] = "TagRequiredToCreateAForumPostInThisChannel";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MissingAccess"] = 50001] = "MissingAccess";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidAccountType"] = 50002] = "InvalidAccountType";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotExecuteActionOnDMChannel"] = 50003] = "CannotExecuteActionOnDMChannel";
    RESTJSONErrorCodes[RESTJSONErrorCodes["GuildWidgetDisabled"] = 50004] = "GuildWidgetDisabled";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotEditMessageAuthoredByAnotherUser"] = 50005] = "CannotEditMessageAuthoredByAnotherUser";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotSendAnEmptyMessage"] = 50006] = "CannotSendAnEmptyMessage";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotSendMessagesToThisUser"] = 50007] = "CannotSendMessagesToThisUser";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotSendMessagesInNonTextChannel"] = 50008] = "CannotSendMessagesInNonTextChannel";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ChannelVerificationLevelTooHighForYouToGainAccess"] = 50009] = "ChannelVerificationLevelTooHighForYouToGainAccess";
    RESTJSONErrorCodes[RESTJSONErrorCodes["OAuth2ApplicationDoesNotHaveBot"] = 50010] = "OAuth2ApplicationDoesNotHaveBot";
    RESTJSONErrorCodes[RESTJSONErrorCodes["OAuth2ApplicationLimitReached"] = 50011] = "OAuth2ApplicationLimitReached";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidOAuth2State"] = 50012] = "InvalidOAuth2State";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MissingPermissions"] = 50013] = "MissingPermissions";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidToken"] = 50014] = "InvalidToken";
    RESTJSONErrorCodes[RESTJSONErrorCodes["NoteWasTooLong"] = 50015] = "NoteWasTooLong";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ProvidedTooFewOrTooManyMessagesToDelete"] = 50016] = "ProvidedTooFewOrTooManyMessagesToDelete";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidMFALevel"] = 50017] = "InvalidMFALevel";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MessageCanOnlyBePinnedInTheChannelItWasSentIn"] = 50019] = "MessageCanOnlyBePinnedInTheChannelItWasSentIn";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InviteCodeInvalidOrTaken"] = 50020] = "InviteCodeInvalidOrTaken";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotExecuteActionOnSystemMessage"] = 50021] = "CannotExecuteActionOnSystemMessage";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotExecuteActionOnThisChannelType"] = 50024] = "CannotExecuteActionOnThisChannelType";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidOAuth2AccessToken"] = 50025] = "InvalidOAuth2AccessToken";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MissingRequiredOAuth2Scope"] = 50026] = "MissingRequiredOAuth2Scope";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidWebhookToken"] = 50027] = "InvalidWebhookToken";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidRole"] = 50028] = "InvalidRole";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidRecipients"] = 50033] = "InvalidRecipients";
    RESTJSONErrorCodes[RESTJSONErrorCodes["OneOfTheMessagesProvidedWasTooOldForBulkDelete"] = 50034] = "OneOfTheMessagesProvidedWasTooOldForBulkDelete";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidFormBodyOrContentType"] = 50035] = "InvalidFormBodyOrContentType";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InviteAcceptedToGuildWithoutTheBotBeingIn"] = 50036] = "InviteAcceptedToGuildWithoutTheBotBeingIn";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidActivityAction"] = 50039] = "InvalidActivityAction";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidAPIVersion"] = 50041] = "InvalidAPIVersion";
    RESTJSONErrorCodes[RESTJSONErrorCodes["FileUploadedExceedsMaximumSize"] = 50045] = "FileUploadedExceedsMaximumSize";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidFileUploaded"] = 50046] = "InvalidFileUploaded";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotSelfRedeemThisGift"] = 50054] = "CannotSelfRedeemThisGift";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidGuild"] = 50055] = "InvalidGuild";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidMessageType"] = 50068] = "InvalidMessageType";
    RESTJSONErrorCodes[RESTJSONErrorCodes["PaymentSourceRequiredToRedeemGift"] = 50070] = "PaymentSourceRequiredToRedeemGift";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotModifyASystemWebhook"] = 50073] = "CannotModifyASystemWebhook";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotDeleteChannelRequiredForCommunityGuilds"] = 50074] = "CannotDeleteChannelRequiredForCommunityGuilds";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotEditStickersWithinMessage"] = 50080] = "CannotEditStickersWithinMessage";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidStickerSent"] = 50081] = "InvalidStickerSent";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidActionOnArchivedThread"] = 50083] = "InvalidActionOnArchivedThread";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidThreadNotificationSettings"] = 50084] = "InvalidThreadNotificationSettings";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ParameterEarlierThanCreation"] = 50085] = "ParameterEarlierThanCreation";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CommunityServerChannelsMustBeTextChannels"] = 50086] = "CommunityServerChannelsMustBeTextChannels";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ServerNotAvailableInYourLocation"] = 50095] = "ServerNotAvailableInYourLocation";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ServerNeedsMonetizationEnabledToPerformThisAction"] = 50097] = "ServerNeedsMonetizationEnabledToPerformThisAction";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ServerNeedsMoreBoostsToPerformThisAction"] = 50101] = "ServerNeedsMoreBoostsToPerformThisAction";
    RESTJSONErrorCodes[RESTJSONErrorCodes["RequestBodyContainsInvalidJSON"] = 50109] = "RequestBodyContainsInvalidJSON";
    RESTJSONErrorCodes[RESTJSONErrorCodes["OwnershipCannotBeMovedToABotUser"] = 50132] = "OwnershipCannotBeMovedToABotUser";
    RESTJSONErrorCodes[RESTJSONErrorCodes["FailedToResizeAssetBelowTheMinimumSize"] = 50138] = "FailedToResizeAssetBelowTheMinimumSize";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UploadedFileNotFound"] = 50146] = "UploadedFileNotFound";
    RESTJSONErrorCodes[RESTJSONErrorCodes["YouDoNotHavePermissionToSendThisSticker"] = 50600] = "YouDoNotHavePermissionToSendThisSticker";
    RESTJSONErrorCodes[RESTJSONErrorCodes["TwoFactorAuthenticationIsRequired"] = 60003] = "TwoFactorAuthenticationIsRequired";
    RESTJSONErrorCodes[RESTJSONErrorCodes["NoUsersWithDiscordTagExist"] = 80004] = "NoUsersWithDiscordTagExist";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ReactionWasBlocked"] = 90001] = "ReactionWasBlocked";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ApplicationNotYetAvailable"] = 110001] = "ApplicationNotYetAvailable";
    RESTJSONErrorCodes[RESTJSONErrorCodes["APIResourceOverloaded"] = 130000] = "APIResourceOverloaded";
    RESTJSONErrorCodes[RESTJSONErrorCodes["TheStageIsAlreadyOpen"] = 150006] = "TheStageIsAlreadyOpen";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotReplyWithoutPermissionToReadMessageHistory"] = 160002] = "CannotReplyWithoutPermissionToReadMessageHistory";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ThreadAlreadyCreatedForMessage"] = 160004] = "ThreadAlreadyCreatedForMessage";
    RESTJSONErrorCodes[RESTJSONErrorCodes["ThreadLocked"] = 160005] = "ThreadLocked";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumActiveThreads"] = 160006] = "MaximumActiveThreads";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MaximumActiveAnnouncementThreads"] = 160007] = "MaximumActiveAnnouncementThreads";
    RESTJSONErrorCodes[RESTJSONErrorCodes["InvalidJSONForUploadedLottieFile"] = 170001] = "InvalidJSONForUploadedLottieFile";
    RESTJSONErrorCodes[RESTJSONErrorCodes["UploadedLottiesCannotContainRasterizedImages"] = 170002] = "UploadedLottiesCannotContainRasterizedImages";
    RESTJSONErrorCodes[RESTJSONErrorCodes["StickerMaximumFramerateExceeded"] = 170003] = "StickerMaximumFramerateExceeded";
    RESTJSONErrorCodes[RESTJSONErrorCodes["StickerFrameCountExceedsMaximumOf1000Frames"] = 170004] = "StickerFrameCountExceedsMaximumOf1000Frames";
    RESTJSONErrorCodes[RESTJSONErrorCodes["LottieAnimationMaximumDimensionsExceeded"] = 170005] = "LottieAnimationMaximumDimensionsExceeded";
    RESTJSONErrorCodes[RESTJSONErrorCodes["StickerFramerateIsTooSmallOrTooLarge"] = 170006] = "StickerFramerateIsTooSmallOrTooLarge";
    RESTJSONErrorCodes[RESTJSONErrorCodes["StickerAnimationDurationExceedsMaximumOf5Seconds"] = 170007] = "StickerAnimationDurationExceedsMaximumOf5Seconds";
    RESTJSONErrorCodes[RESTJSONErrorCodes["CannotUpdateAFinishedEvent"] = 180000] = "CannotUpdateAFinishedEvent";
    RESTJSONErrorCodes[RESTJSONErrorCodes["FailedToCreateStageNeededForStageEvent"] = 180002] = "FailedToCreateStageNeededForStageEvent";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MessageWasBlockedByAutomaticModeration"] = 200000] = "MessageWasBlockedByAutomaticModeration";
    RESTJSONErrorCodes[RESTJSONErrorCodes["TitleWasBlockedByAutomaticModeration"] = 200001] = "TitleWasBlockedByAutomaticModeration";
    RESTJSONErrorCodes[RESTJSONErrorCodes["WebhooksPostedToForumChannelsMustHaveAThreadNameOrThreadId"] = 220001] = "WebhooksPostedToForumChannelsMustHaveAThreadNameOrThreadId";
    RESTJSONErrorCodes[RESTJSONErrorCodes["WebhooksPostedToForumChannelsCannotHaveBothAThreadNameAndThreadId"] = 220002] = "WebhooksPostedToForumChannelsCannotHaveBothAThreadNameAndThreadId";
    RESTJSONErrorCodes[RESTJSONErrorCodes["WebhooksCanOnlyCreateThreadsInForumChannels"] = 220003] = "WebhooksCanOnlyCreateThreadsInForumChannels";
    RESTJSONErrorCodes[RESTJSONErrorCodes["WebhookServicesCannotBeUsedInForumChannels"] = 220004] = "WebhookServicesCannotBeUsedInForumChannels";
    RESTJSONErrorCodes[RESTJSONErrorCodes["MessageBlockedByHarmfulLinksFilter"] = 240000] = "MessageBlockedByHarmfulLinksFilter";
})(RESTJSONErrorCodes = exports.RESTJSONErrorCodes || (exports.RESTJSONErrorCodes = {}));
/**
 * https://discord.com/developers/docs/reference#locales
 */
var Locale;
(function (Locale) {
    Locale["Indonesian"] = "id";
    Locale["EnglishUS"] = "en-US";
    Locale["EnglishGB"] = "en-GB";
    Locale["Bulgarian"] = "bg";
    Locale["ChineseCN"] = "zh-CN";
    Locale["ChineseTW"] = "zh-TW";
    Locale["Croatian"] = "hr";
    Locale["Czech"] = "cs";
    Locale["Danish"] = "da";
    Locale["Dutch"] = "nl";
    Locale["Finnish"] = "fi";
    Locale["French"] = "fr";
    Locale["German"] = "de";
    Locale["Greek"] = "el";
    Locale["Hindi"] = "hi";
    Locale["Hungarian"] = "hu";
    Locale["Italian"] = "it";
    Locale["Japanese"] = "ja";
    Locale["Korean"] = "ko";
    Locale["Lithuanian"] = "lt";
    Locale["Norwegian"] = "no";
    Locale["Polish"] = "pl";
    Locale["PortugueseBR"] = "pt-BR";
    Locale["Romanian"] = "ro";
    Locale["Russian"] = "ru";
    Locale["SpanishES"] = "es-ES";
    Locale["Swedish"] = "sv-SE";
    Locale["Thai"] = "th";
    Locale["Turkish"] = "tr";
    Locale["Ukrainian"] = "uk";
    Locale["Vietnamese"] = "vi";
})(Locale = exports.Locale || (exports.Locale = {}));
//# sourceMappingURL=common.js.map

/***/ }),

/***/ 2903:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=application.js.map

/***/ }),

/***/ 1624:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=auditLog.js.map

/***/ }),

/***/ 4844:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=autoModeration.js.map

/***/ }),

/***/ 3594:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=channel.js.map

/***/ }),

/***/ 9907:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=emoji.js.map

/***/ }),

/***/ 2316:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=gateway.js.map

/***/ }),

/***/ 2605:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=guild.js.map

/***/ }),

/***/ 7505:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=guildScheduledEvent.js.map

/***/ }),

/***/ 8119:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OAuth2Routes = exports.RouteBases = exports.ImageFormat = exports.CDNRoutes = exports.StickerPackApplicationId = exports.Routes = exports.APIVersion = void 0;
__exportStar(__webpack_require__(2345), exports);
__exportStar(__webpack_require__(2903), exports);
__exportStar(__webpack_require__(1624), exports);
__exportStar(__webpack_require__(4844), exports);
__exportStar(__webpack_require__(3594), exports);
__exportStar(__webpack_require__(9907), exports);
__exportStar(__webpack_require__(2316), exports);
__exportStar(__webpack_require__(2605), exports);
__exportStar(__webpack_require__(7505), exports);
__exportStar(__webpack_require__(5441), exports);
__exportStar(__webpack_require__(8824), exports);
__exportStar(__webpack_require__(9102), exports);
__exportStar(__webpack_require__(9662), exports);
__exportStar(__webpack_require__(4579), exports);
__exportStar(__webpack_require__(6368), exports);
__exportStar(__webpack_require__(9128), exports);
__exportStar(__webpack_require__(5799), exports);
__exportStar(__webpack_require__(5091), exports);
exports.APIVersion = '9';
exports.Routes = {
    /**
     * Route for:
     * - GET `/applications/{application.id}/role-connections/metadata`
     * - PUT `/applications/{application.id}/role-connections/metadata`
     */
    applicationRoleConnectionMetadata(applicationId) {
        return `/applications/${applicationId}/role-connections/metadata`;
    },
    /**
     * Route for:
     * - GET  `/guilds/{guild.id}/auto-moderation/rules`
     * - POST `/guilds/{guild.id}/auto-moderation/rules`
     */
    guildAutoModerationRules(guildId) {
        return `/guilds/${guildId}/auto-moderation/rules`;
    },
    /**
     * Routes for:
     * - GET    `/guilds/{guild.id}/auto-moderation/rules/{rule.id}`
     * - PATCH  `/guilds/{guild.id}/auto-moderation/rules/{rule.id}`
     * - DELETE `/guilds/{guild.id}/auto-moderation/rules/{rule.id}`
     */
    guildAutoModerationRule(guildId, ruleId) {
        return `/guilds/${guildId}/auto-moderation/rules/${ruleId}`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/audit-logs`
     */
    guildAuditLog(guildId) {
        return `/guilds/${guildId}/audit-logs`;
    },
    /**
     * Route for:
     * - GET    `/channels/{channel.id}`
     * - PATCH  `/channels/{channel.id}`
     * - DELETE `/channels/{channel.id}`
     */
    channel(channelId) {
        return `/channels/${channelId}`;
    },
    /**
     * Route for:
     * - GET  `/channels/{channel.id}/messages`
     * - POST `/channels/{channel.id}/messages`
     */
    channelMessages(channelId) {
        return `/channels/${channelId}/messages`;
    },
    /**
     * Route for:
     * - GET    `/channels/{channel.id}/messages/{message.id}`
     * - PATCH  `/channels/{channel.id}/messages/{message.id}`
     * - DELETE `/channels/{channel.id}/messages/{message.id}`
     */
    channelMessage(channelId, messageId) {
        return `/channels/${channelId}/messages/${messageId}`;
    },
    /**
     * Route for:
     * - POST `/channels/{channel.id}/messages/{message.id}/crosspost`
     */
    channelMessageCrosspost(channelId, messageId) {
        return `/channels/${channelId}/messages/${messageId}/crosspost`;
    },
    /**
     * Route for:
     * - PUT    `/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me`
     * - DELETE `/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/@me`
     *
     * **Note**: You need to URL encode the emoji yourself
     */
    channelMessageOwnReaction(channelId, messageId, emoji) {
        return `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`;
    },
    /**
     * Route for:
     * - DELETE `/channels/{channel.id}/messages/{message.id}/reactions/{emoji}/{user.id}`
     *
     * **Note**: You need to URL encode the emoji yourself
     */
    channelMessageUserReaction(channelId, messageId, emoji, userId) {
        return `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/${userId}`;
    },
    /**
     * Route for:
     * - GET    `/channels/{channel.id}/messages/{message.id}/reactions/{emoji}`
     * - DELETE `/channels/{channel.id}/messages/{message.id}/reactions/{emoji}`
     *
     * **Note**: You need to URL encode the emoji yourself
     */
    channelMessageReaction(channelId, messageId, emoji) {
        return `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`;
    },
    /**
     * Route for:
     * - DELETE `/channels/{channel.id}/messages/{message.id}/reactions`
     */
    channelMessageAllReactions(channelId, messageId) {
        return `/channels/${channelId}/messages/${messageId}/reactions`;
    },
    /**
     * Route for:
     * - POST `/channels/{channel.id}/messages/bulk-delete`
     */
    channelBulkDelete(channelId) {
        return `/channels/${channelId}/messages/bulk-delete`;
    },
    /**
     * Route for:
     * - PUT    `/channels/{channel.id}/permissions/{overwrite.id}`
     * - DELETE `/channels/{channel.id}/permissions/{overwrite.id}`
     */
    channelPermission(channelId, overwriteId) {
        return `/channels/${channelId}/permissions/${overwriteId}`;
    },
    /**
     * Route for:
     * - GET  `/channels/{channel.id}/invites`
     * - POST `/channels/{channel.id}/invites`
     */
    channelInvites(channelId) {
        return `/channels/${channelId}/invites`;
    },
    /**
     * Route for:
     * - POST `/channels/{channel.id}/followers`
     */
    channelFollowers(channelId) {
        return `/channels/${channelId}/followers`;
    },
    /**
     * Route for:
     * - POST `/channels/{channel.id}/typing`
     */
    channelTyping(channelId) {
        return `/channels/${channelId}/typing`;
    },
    /**
     * Route for:
     * - GET `/channels/{channel.id}/pins`
     */
    channelPins(channelId) {
        return `/channels/${channelId}/pins`;
    },
    /**
     * Route for:
     * - PUT    `/channels/{channel.id}/pins/{message.id}`
     * - DELETE `/channels/{channel.id}/pins/{message.id}`
     */
    channelPin(channelId, messageId) {
        return `/channels/${channelId}/pins/${messageId}`;
    },
    /**
     * Route for:
     * - PUT    `/channels/{channel.id}/recipients/{user.id}`
     * - DELETE `/channels/{channel.id}/recipients/{user.id}`
     */
    channelRecipient(channelId, userId) {
        return `/channels/${channelId}/recipients/${userId}`;
    },
    /**
     * Route for:
     * - GET  `/guilds/{guild.id}/emojis`
     * - POST `/guilds/{guild.id}/emojis`
     */
    guildEmojis(guildId) {
        return `/guilds/${guildId}/emojis`;
    },
    /**
     * Route for:
     * - GET    `/guilds/{guild.id}/emojis/{emoji.id}`
     * - PATCH  `/guilds/{guild.id}/emojis/{emoji.id}`
     * - DELETE `/guilds/{guild.id}/emojis/{emoji.id}`
     */
    guildEmoji(guildId, emojiId) {
        return `/guilds/${guildId}/emojis/${emojiId}`;
    },
    /**
     * Route for:
     * - POST `/guilds`
     */
    guilds() {
        return '/guilds';
    },
    /**
     * Route for:
     * - GET    `/guilds/{guild.id}`
     * - PATCH  `/guilds/{guild.id}`
     * - DELETE `/guilds/{guild.id}`
     */
    guild(guildId) {
        return `/guilds/${guildId}`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/preview`
     */
    guildPreview(guildId) {
        return `/guilds/${guildId}/preview`;
    },
    /**
     * Route for:
     * - GET   `/guilds/{guild.id}/channels`
     * - POST  `/guilds/{guild.id}/channels`
     * - PATCH `/guilds/{guild.id}/channels`
     */
    guildChannels(guildId) {
        return `/guilds/${guildId}/channels`;
    },
    /**
     * Route for:
     * - GET    `/guilds/{guild.id}/members/{user.id}`
     * - PUT    `/guilds/{guild.id}/members/{user.id}`
     * - PATCH  `/guilds/{guild.id}/members/@me`
     * - PATCH  `/guilds/{guild.id}/members/{user.id}`
     * - DELETE `/guilds/{guild.id}/members/{user.id}`
     */
    guildMember(guildId, userId = '@me') {
        return `/guilds/${guildId}/members/${userId}`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/members`
     */
    guildMembers(guildId) {
        return `/guilds/${guildId}/members`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/members/search`
     */
    guildMembersSearch(guildId) {
        return `/guilds/${guildId}/members/search`;
    },
    /**
     * Route for:
     * - PATCH `/guilds/{guild.id}/members/@me/nick`
     * @deprecated Use {@link Routes.guildMember} instead.
     */
    guildCurrentMemberNickname(guildId) {
        return `/guilds/${guildId}/members/@me/nick`;
    },
    /**
     * Route for:
     * - PUT    `/guilds/{guild.id}/members/{user.id}/roles/{role.id}`
     * - DELETE `/guilds/{guild.id}/members/{user.id}/roles/{role.id}`
     */
    guildMemberRole(guildId, memberId, roleId) {
        return `/guilds/${guildId}/members/${memberId}/roles/${roleId}`;
    },
    /**
     * Route for:
     * - POST `/guilds/{guild.id}/mfa`
     */
    guildMFA(guildId) {
        return `/guilds/${guildId}/mfa`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/bans`
     */
    guildBans(guildId) {
        return `/guilds/${guildId}/bans`;
    },
    /**
     * Route for:
     * - GET    `/guilds/{guild.id}/bans/{user.id}`
     * - PUT    `/guilds/{guild.id}/bans/{user.id}`
     * - DELETE `/guilds/{guild.id}/bans/{user.id}`
     */
    guildBan(guildId, userId) {
        return `/guilds/${guildId}/bans/${userId}`;
    },
    /**
     * Route for:
     * - GET   `/guilds/{guild.id}/roles`
     * - POST  `/guilds/{guild.id}/roles`
     * - PATCH `/guilds/{guild.id}/roles`
     */
    guildRoles(guildId) {
        return `/guilds/${guildId}/roles`;
    },
    /**
     * Route for:
     * - PATCH  `/guilds/{guild.id}/roles/{role.id}`
     * - DELETE `/guilds/{guild.id}/roles/{role.id}`
     */
    guildRole(guildId, roleId) {
        return `/guilds/${guildId}/roles/${roleId}`;
    },
    /**
     * Route for:
     * - GET  `/guilds/{guild.id}/prune`
     * - POST `/guilds/{guild.id}/prune`
     */
    guildPrune(guildId) {
        return `/guilds/${guildId}/prune`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/regions`
     */
    guildVoiceRegions(guildId) {
        return `/guilds/${guildId}/regions`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/invites`
     */
    guildInvites(guildId) {
        return `/guilds/${guildId}/invites`;
    },
    /**
     * Route for:
     * - GET  `/guilds/{guild.id}/integrations`
     */
    guildIntegrations(guildId) {
        return `/guilds/${guildId}/integrations`;
    },
    /**
     * Route for:
     * - DELETE `/guilds/{guild.id}/integrations/{integration.id}`
     */
    guildIntegration(guildId, integrationId) {
        return `/guilds/${guildId}/integrations/${integrationId}`;
    },
    /**
     * Route for:
     * - GET   `/guilds/{guild.id}/widget`
     * - PATCH `/guilds/{guild.id}/widget`
     */
    guildWidgetSettings(guildId) {
        return `/guilds/${guildId}/widget`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/widget.json`
     */
    guildWidgetJSON(guildId) {
        return `/guilds/${guildId}/widget.json`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/vanity-url`
     */
    guildVanityUrl(guildId) {
        return `/guilds/${guildId}/vanity-url`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/widget.png`
     */
    guildWidgetImage(guildId) {
        return `/guilds/${guildId}/widget.png`;
    },
    /**
     * Route for:
     * - GET    `/invites/{invite.code}`
     * - DELETE `/invites/{invite.code}`
     */
    invite(code) {
        return `/invites/${code}`;
    },
    /**
     * Route for:
     * - GET  `/guilds/templates/{template.code}`
     * - POST `/guilds/templates/{template.code}`
     */
    template(code) {
        return `/guilds/templates/${code}`;
    },
    /**
     * Route for:
     * - GET  `/guilds/{guild.id}/templates`
     * - POST `/guilds/{guild.id}/templates`
     */
    guildTemplates(guildId) {
        return `/guilds/${guildId}/templates`;
    },
    /**
     * Route for:
     * - PUT    `/guilds/{guild.id}/templates/{template.code}`
     * - PATCH  `/guilds/{guild.id}/templates/{template.code}`
     * - DELETE `/guilds/{guild.id}/templates/{template.code}`
     */
    guildTemplate(guildId, code) {
        return `/guilds/${guildId}/templates/${code}`;
    },
    /**
     * Route for:
     * - POST `/channels/{channel.id}/threads`
     * - POST `/channels/{channel.id}/messages/{message.id}/threads`
     */
    threads(parentId, messageId) {
        const parts = ['', 'channels', parentId];
        if (messageId)
            parts.push('messages', messageId);
        parts.push('threads');
        return parts.join('/');
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/threads/active`
     */
    guildActiveThreads(guildId) {
        return `/guilds/${guildId}/threads/active`;
    },
    /**
     * Route for:
     * - GET `/channels/{channel.id}/threads/active`
     * 	 (deprecated, removed in API v10, use [List Active Guild Threads](https://discord.com/developers/docs/resources/guild#list-active-threads) instead.)
     * - GET `/channels/{channel.id}/threads/archived/public`
     * - GET `/channels/{channel.id}/threads/archived/private`
     */
    channelThreads(channelId, archived) {
        const parts = ['', 'channels', channelId, 'threads'];
        if (archived)
            parts.push('archived', archived);
        else
            parts.push('active');
        return parts.join('/');
    },
    /**
     * Route for:
     * - GET `/channels/{channel.id}/users/@me/threads/archived/prviate`
     */
    channelJoinedArchivedThreads(channelId) {
        return `/channels/${channelId}/users/@me/threads/archived/private`;
    },
    /**
     * Route for:
     * - GET    `/channels/{thread.id}/thread-members`
     * - GET    `/channels/{thread.id}/thread-members/{user.id}`
     * - PUT    `/channels/{thread.id}/thread-members/@me`
     * - PUT    `/channels/{thread.id}/thread-members/{user.id}`
     * - DELETE `/channels/{thread.id}/thread-members/@me`
     * - DELETE `/channels/{thread.id}/thread-members/{user.id}`
     */
    threadMembers(threadId, userId) {
        const parts = ['', 'channels', threadId, 'thread-members'];
        if (userId)
            parts.push(userId);
        return parts.join('/');
    },
    /**
     * Route for:
     * - GET   `/users/@me`
     * - GET   `/users/{user.id}`
     * - PATCH `/users/@me`
     *
     * @param [userId='@me'] The user ID, defaulted to `@me`
     */
    user(userId = '@me') {
        return `/users/${userId}`;
    },
    /**
     * Route for:
     * - GET `/users/@me/applications/{application.id}/role-connection`
     * - PUT `/users/@me/applications/{application.id}/role-connection`
     */
    userApplicationRoleConnection(applicationId) {
        return `/users/@me/applications/${applicationId}/role-connection`;
    },
    /**
     * Route for:
     * - GET `/users/@me/guilds`
     */
    userGuilds() {
        return `/users/@me/guilds`;
    },
    /**
     * Route for:
     * - GET `/users/@me/guilds/{guild.id}/member`
     */
    userGuildMember(guildId) {
        return `/users/@me/guilds/${guildId}/member`;
    },
    /**
     * Route for:
     * - DELETE `/users/@me/guilds/{guild.id}`
     */
    userGuild(guildId) {
        return `/users/@me/guilds/${guildId}`;
    },
    /**
     * Route for:
     * - POST `/users/@me/channels`
     */
    userChannels() {
        return `/users/@me/channels`;
    },
    /**
     * Route for:
     * - GET `/users/@me/connections`
     */
    userConnections() {
        return `/users/@me/connections`;
    },
    /**
     * Route for:
     * - GET `/voice/regions`
     */
    voiceRegions() {
        return `/voice/regions`;
    },
    /**
     * Route for:
     * - GET  `/channels/{channel.id}/webhooks`
     * - POST `/channels/{channel.id}/webhooks`
     */
    channelWebhooks(channelId) {
        return `/channels/${channelId}/webhooks`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/webhooks`
     */
    guildWebhooks(guildId) {
        return `/guilds/${guildId}/webhooks`;
    },
    /**
     * Route for:
     * - GET    `/webhooks/{webhook.id}`
     * - GET    `/webhooks/{webhook.id}/{webhook.token}`
     * - PATCH  `/webhooks/{webhook.id}`
     * - PATCH  `/webhooks/{webhook.id}/{webhook.token}`
     * - DELETE `/webhooks/{webhook.id}`
     * - DELETE `/webhooks/{webhook.id}/{webhook.token}`
     * - POST   `/webhooks/{webhook.id}/{webhook.token}`
     *
     * - POST   `/webhooks/{application.id}/{interaction.token}`
     */
    webhook(webhookId, webhookToken) {
        const parts = ['', 'webhooks', webhookId];
        if (webhookToken)
            parts.push(webhookToken);
        return parts.join('/');
    },
    /**
     * Route for:
     * - GET    `/webhooks/{webhook.id}/{webhook.token}/messages/@original`
     * - GET    `/webhooks/{webhook.id}/{webhook.token}/messages/{message.id}`
     * - PATCH  `/webhooks/{webhook.id}/{webhook.token}/messages/@original`
     * - PATCH  `/webhooks/{webhook.id}/{webhook.token}/messages/{message.id}`
     * - DELETE `/webhooks/{webhook.id}/{webhook.token}/messages/@original`
     * - DELETE `/webhooks/{webhook.id}/{webhook.token}/messages/{message.id}`
     *
     * - PATCH  `/webhooks/{application.id}/{interaction.token}/messages/@original`
     * - PATCH  `/webhooks/{application.id}/{interaction.token}/messages/{message.id}`
     * - DELETE `/webhooks/{application.id}/{interaction.token}/messages/{message.id}`
     *
     * @param [messageId='@original'] The message ID to change, defaulted to `@original`
     */
    webhookMessage(webhookId, webhookToken, messageId = '@original') {
        return `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`;
    },
    /**
     * Route for:
     * - POST `/webhooks/{webhook.id}/{webhook.token}/github`
     * - POST `/webhooks/{webhook.id}/{webhook.token}/slack`
     */
    webhookPlatform(webhookId, webhookToken, platform) {
        return `/webhooks/${webhookId}/${webhookToken}/${platform}`;
    },
    /**
     * Route for:
     * - GET `/gateway`
     */
    gateway() {
        return `/gateway`;
    },
    /**
     * Route for:
     * - GET `/gateway/bot`
     */
    gatewayBot() {
        return `/gateway/bot`;
    },
    /**
     * Route for:
     * - GET `/oauth2/applications/@me`
     */
    oauth2CurrentApplication() {
        return `/oauth2/applications/@me`;
    },
    /**
     * Route for:
     * - GET `/oauth2/@me`
     */
    oauth2CurrentAuthorization() {
        return `/oauth2/@me`;
    },
    /**
     * Route for:
     * - GET `/oauth2/authorize`
     */
    oauth2Authorization() {
        return `/oauth2/authorize`;
    },
    /**
     * Route for:
     * - POST `/oauth2/token`
     */
    oauth2TokenExchange() {
        return `/oauth2/token`;
    },
    /**
     * Route for:
     * - POST `/oauth2/token/revoke`
     */
    oauth2TokenRevocation() {
        return `/oauth2/token/revoke`;
    },
    /**
     * Route for:
     * - GET  `/applications/{application.id}/commands`
     * - PUT  `/applications/{application.id}/commands`
     * - POST `/applications/{application.id}/commands`
     */
    applicationCommands(applicationId) {
        return `/applications/${applicationId}/commands`;
    },
    /**
     * Route for:
     * - GET    `/applications/{application.id}/commands/{command.id}`
     * - PATCH  `/applications/{application.id}/commands/{command.id}`
     * - DELETE `/applications/{application.id}/commands/{command.id}`
     */
    applicationCommand(applicationId, commandId) {
        return `/applications/${applicationId}/commands/${commandId}`;
    },
    /**
     * Route for:
     * - GET  `/applications/{application.id}/guilds/{guild.id}/commands`
     * - PUT  `/applications/{application.id}/guilds/{guild.id}/commands`
     * - POST `/applications/{application.id}/guilds/{guild.id}/commands`
     */
    applicationGuildCommands(applicationId, guildId) {
        return `/applications/${applicationId}/guilds/${guildId}/commands`;
    },
    /**
     * Route for:
     * - GET    `/applications/{application.id}/guilds/{guild.id}/commands/{command.id}`
     * - PATCH  `/applications/{application.id}/guilds/{guild.id}/commands/{command.id}`
     * - DELETE `/applications/{application.id}/guilds/{guild.id}/commands/{command.id}`
     */
    applicationGuildCommand(applicationId, guildId, commandId) {
        return `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`;
    },
    /**
     * Route for:
     * - POST `/interactions/{interaction.id}/{interaction.token}/callback`
     */
    interactionCallback(interactionId, interactionToken) {
        return `/interactions/${interactionId}/${interactionToken}/callback`;
    },
    /**
     * Route for:
     * - GET   `/guilds/{guild.id}/member-verification`
     * - PATCH `/guilds/{guild.id}/member-verification`
     */
    guildMemberVerification(guildId) {
        return `/guilds/${guildId}/member-verification`;
    },
    /**
     * Route for:
     * - PATCH `/guilds/{guild.id}/voice-states/@me`
     * - PATCH `/guilds/{guild.id}/voice-states/{user.id}`
     */
    guildVoiceState(guildId, userId = '@me') {
        return `/guilds/${guildId}/voice-states/${userId}`;
    },
    /**
     * Route for:
     * - GET `/applications/{application.id}/guilds/{guild.id}/commands/permissions`
     * - PUT `/applications/{application.id}/guilds/{guild.id}/commands/permissions`
     */
    guildApplicationCommandsPermissions(applicationId, guildId) {
        return `/applications/${applicationId}/guilds/${guildId}/commands/permissions`;
    },
    /**
     * Route for:
     * - GET `/applications/{application.id}/guilds/{guild.id}/commands/{command.id}/permissions`
     * - PUT `/applications/{application.id}/guilds/{guild.id}/commands/{command.id}/permissions`
     */
    applicationCommandPermissions(applicationId, guildId, commandId) {
        return `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`;
    },
    /**
     * Route for:
     * - GET   `/guilds/{guild.id}/welcome-screen`
     * - PATCH `/guilds/{guild.id}/welcome-screen`
     */
    guildWelcomeScreen(guildId) {
        return `/guilds/${guildId}/welcome-screen`;
    },
    /**
     * Route for:
     * - POST `/stage-instances`
     */
    stageInstances() {
        return `/stage-instances`;
    },
    /**
     * Route for:
     * - GET `/stage-instances/{channel.id}`
     * - PATCH `/stage-instances/{channel.id}`
     * - DELETE `/stage-instances/{channel.id}`
     */
    stageInstance(channelId) {
        return `/stage-instances/${channelId}`;
    },
    /**
     * Route for:
     * - GET `/stickers/{sticker.id}`
     */
    sticker(stickerId) {
        return `/stickers/${stickerId}`;
    },
    /**
     * Route for:
     * - GET `/sticker-packs`
     */
    nitroStickerPacks() {
        return '/sticker-packs';
    },
    /**
     * Route for:
     * - GET  `/guilds/{guild.id}/stickers`
     * - POST `/guilds/{guild.id}/stickers`
     */
    guildStickers(guildId) {
        return `/guilds/${guildId}/stickers`;
    },
    /**
     * Route for:
     * - GET    `/guilds/{guild.id}/stickers/{sticker.id}`
     * - PATCH  `/guilds/{guild.id}/stickers/{sticker.id}`
     * - DELETE `/guilds/{guild.id}/stickers/{sticker.id}`
     */
    guildSticker(guildId, stickerId) {
        return `/guilds/${guildId}/stickers/${stickerId}`;
    },
    /**
     * Route for:
     * - GET  `/guilds/{guild.id}/scheduled-events`
     * - POST `/guilds/{guild.id}/scheduled-events`
     */
    guildScheduledEvents(guildId) {
        return `/guilds/${guildId}/scheduled-events`;
    },
    /**
     * Route for:
     * - GET  `/guilds/{guild.id}/scheduled-events/{guildScheduledEvent.id}`
     * - PATCH `/guilds/{guild.id}/scheduled-events/{guildScheduledEvent.id}`
     * - DELETE `/guilds/{guild.id}/scheduled-events/{guildScheduledEvent.id}`
     */
    guildScheduledEvent(guildId, guildScheduledEventId) {
        return `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/scheduled-events/{guildScheduledEvent.id}/users`
     */
    guildScheduledEventUsers(guildId, guildScheduledEventId) {
        return `/guilds/${guildId}/scheduled-events/${guildScheduledEventId}/users`;
    },
};
exports.StickerPackApplicationId = '710982414301790216';
exports.CDNRoutes = {
    /**
     * Route for:
     * - GET `/emojis/{emoji.id}.{png|jpeg|webp|gif}`
     *
     * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
     *
     * This route supports the extensions: PNG, JPEG, WebP, GIF
     */
    emoji(emojiId, format) {
        return `/emojis/${emojiId}.${format}`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/icons/{guild.id}.{png|jpeg|webp|gif}`
     *
     * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
     *
     * This route supports the extensions: PNG, JPEG, WebP, GIF
     */
    guildIcon(guildId, guildIcon, format) {
        return `icons/${guildId}/${guildIcon}.${format}`;
    },
    /**
     * Route for:
     * - GET `/splashes/{guild.id}/{guild.splash}.{png|jpeg|webp}`
     *
     * This route supports the extensions: PNG, JPEG, WebP
     */
    guildSplash(guildId, guildSplash, format) {
        return `/splashes/${guildId}/${guildSplash}.${format}`;
    },
    /**
     * Route for:
     * - GET `/discovery-splashes/{guild.id}/{guild.discovery_splash}.{png|jpeg|webp}`
     *
     * This route supports the extensions: PNG, JPEG, WebP
     */
    guildDiscoverySplash(guildId, guildDiscoverySplash, format) {
        return `/discovery-splashes/${guildId}/${guildDiscoverySplash}.${format}`;
    },
    /**
     * Route for:
     * - GET `/banners/{guild.id}/{guild.banner}.{png|jpeg|webp|gif}`
     *
     * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
     *
     * This route supports the extensions: PNG, JPEG, WebP, GIF
     */
    guildBanner(guildId, guildBanner, format) {
        return `/banners/${guildId}/${guildBanner}.${format}`;
    },
    /**
     * Route for:
     * - GET `/banners/{user.id}/{user.banner}.{png|jpeg|webp|gif}`
     *
     * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
     *
     * This route supports the extensions: PNG, JPEG, WebP, GIF
     */
    userBanner(userId, userBanner, format) {
        return `/banners/${userId}/${userBanner}.${format}`;
    },
    /**
     * Route for:
     * - GET `/embed/avatars/{user.discriminator % 5}.png`
     *
     * The `userDiscriminator` parameter should be the user discriminator modulo 5 (e.g. 1337 % 5 = 2)
     *
     * This route supports the extension: PNG
     */
    defaultUserAvatar(userDiscriminator) {
        return `/embed/avatars/${userDiscriminator}.png`;
    },
    /**
     * Route for:
     * - GET `/avatars/{user.id}/{user.avatar}.{png|jpeg|webp|gif}`
     *
     * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
     *
     * This route supports the extensions: PNG, JPEG, WebP, GIF
     */
    userAvatar(userId, userAvatar, format) {
        return `/avatars/${userId}/${userAvatar}.${format}`;
    },
    /**
     * Route for:
     * - GET `/guilds/{guild.id}/users/{user.id}/{guild_member.avatar}.{png|jpeg|webp|gif}`
     *
     * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
     *
     * This route supports the extensions: PNG, JPEG, WebP, GIF
     */
    guildMemberAvatar(guildId, userId, memberAvatar, format) {
        return `/guilds/${guildId}/users/${userId}/avatars/${memberAvatar}.${format}`;
    },
    /**
     * Route for:
     * - GET `/app-icons/{application.id}/{application.icon}.{png|jpeg|webp}`
     *
     * This route supports the extensions: PNG, JPEG, WebP
     */
    applicationIcon(applicationId, applicationIcon, format) {
        return `/app-icons/${applicationId}/${applicationIcon}.${format}`;
    },
    /**
     * Route for:
     * - GET `/app-icons/{application.id}/{application.cover_image}.{png|jpeg|webp}`
     *
     * This route supports the extensions: PNG, JPEG, WebP
     */
    applicationCover(applicationId, applicationCoverImage, format) {
        return `/app-icons/${applicationId}/${applicationCoverImage}.${format}`;
    },
    /**
     * Route for:
     * - GET `/app-icons/{application.id}/{application.asset_id}.{png|jpeg|webp}`
     *
     * This route supports the extensions: PNG, JPEG, WebP
     */
    applicationAsset(applicationId, applicationAssetId, format) {
        return `/app-icons/${applicationId}/${applicationAssetId}.${format}`;
    },
    /**
     * Route for:
     * - GET `/app-assets/{application.id}/achievements/{achievement.id}/icons/{achievement.icon}.{png|jpeg|webp}`
     *
     * This route supports the extensions: PNG, JPEG, WebP
     */
    achievementIcon(applicationId, achievementId, achievementIconHash, format) {
        return `/app-assets/${applicationId}/achievements/${achievementId}/icons/${achievementIconHash}.${format}`;
    },
    /**
     * Route for:
     * - GET `/app-assets/710982414301790216/store/{sticker_pack.banner.asset_id}.{png|jpeg|webp}`
     *
     * This route supports the extensions: PNG, JPEG, WebP
     */
    stickerPackBanner(stickerPackBannerAssetId, format) {
        return `/app-assets/${exports.StickerPackApplicationId}/store/${stickerPackBannerAssetId}.${format}`;
    },
    /**
     * Route for:
     * - GET `team-icons/{team.id}/{team.icon}.{png|jpeg|webp}`
     *
     * This route supports the extensions: PNG, JPEG, WebP
     */
    teamIcon(teamId, teamIcon, format) {
        return `/team-icons/${teamId}/${teamIcon}.${format}`;
    },
    /**
     * Route for:
     * - GET `/stickers/{sticker.id}.{png|json}`
     *
     * This route supports the extensions: PNG, Lottie
     */
    sticker(stickerId, format) {
        return `/stickers/${stickerId}.${format}`;
    },
    /**
     * Route for:
     * - GET `/role-icons/{role.id}/{role.icon}.{png|jpeg|webp}`
     *
     * This route supports the extensions: PNG, JPEG, WebP
     */
    roleIcon(roleId, roleIcon, format) {
        return `/role-icons/${roleId}/${roleIcon}.${format}`;
    },
    /**
     * Route for:
     * - GET `/guild-events/{guild_scheduled_event.id}/{guild_scheduled_event.image}.{png|jpeg|webp}`
     *
     * This route supports the extensions: PNG, JPEG, WebP
     */
    guildScheduledEventCover(guildScheduledEventId, guildScheduledEventCoverImage, format) {
        return `/guild-events/${guildScheduledEventId}/${guildScheduledEventCoverImage}.${format}`;
    },
    /**
     * Route for:
     * - GET `/guilds/${guild.id}/users/${user.id}/banners/${guild_member.banner}.{png|jpeg|webp|gif}`
     *
     * This route supports the extensions: PNG, JPEG, WebP, GIF
     */
    guildMemberBanner(guildId, userId, guildMemberBanner, format) {
        return `/guilds/${guildId}/users/${userId}/banners/${guildMemberBanner}.${format}`;
    },
};
var ImageFormat;
(function (ImageFormat) {
    ImageFormat["JPEG"] = "jpeg";
    ImageFormat["PNG"] = "png";
    ImageFormat["WebP"] = "webp";
    ImageFormat["GIF"] = "gif";
    ImageFormat["Lottie"] = "json";
})(ImageFormat = exports.ImageFormat || (exports.ImageFormat = {}));
exports.RouteBases = {
    api: `https://discord.com/api/v${exports.APIVersion}`,
    cdn: 'https://cdn.discordapp.com',
    invite: 'https://discord.gg',
    template: 'https://discord.new',
    gift: 'https://discord.gift',
    scheduledEvent: 'https://discord.com/events',
};
// Freeze bases object
Object.freeze(exports.RouteBases);
exports.OAuth2Routes = {
    authorizationURL: `${exports.RouteBases.api}${exports.Routes.oauth2Authorization()}`,
    tokenURL: `${exports.RouteBases.api}${exports.Routes.oauth2TokenExchange()}`,
    /**
     * See https://tools.ietf.org/html/rfc7009
     */
    tokenRevocationURL: `${exports.RouteBases.api}${exports.Routes.oauth2TokenRevocation()}`,
};
// Freeze OAuth2 route object
Object.freeze(exports.OAuth2Routes);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5441:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=interactions.js.map

/***/ }),

/***/ 8824:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=invite.js.map

/***/ }),

/***/ 9102:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=oauth2.js.map

/***/ }),

/***/ 9662:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=stageInstance.js.map

/***/ }),

/***/ 4579:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=sticker.js.map

/***/ }),

/***/ 6368:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=template.js.map

/***/ }),

/***/ 9128:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=user.js.map

/***/ }),

/***/ 5799:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=voice.js.map

/***/ }),

/***/ 5091:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=webhook.js.map

/***/ }),

/***/ 8525:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RPCCloseEventCodes = exports.RPCErrorCodes = void 0;
/**
 * https://discord.com/developers/docs/topics/opcodes-and-status-codes#rpc-rpc-error-codes
 */
var RPCErrorCodes;
(function (RPCErrorCodes) {
    RPCErrorCodes[RPCErrorCodes["UnknownError"] = 1000] = "UnknownError";
    RPCErrorCodes[RPCErrorCodes["InvalidPayload"] = 4000] = "InvalidPayload";
    RPCErrorCodes[RPCErrorCodes["InvalidCommand"] = 4002] = "InvalidCommand";
    RPCErrorCodes[RPCErrorCodes["InvalidGuild"] = 4003] = "InvalidGuild";
    RPCErrorCodes[RPCErrorCodes["InvalidEvent"] = 4004] = "InvalidEvent";
    RPCErrorCodes[RPCErrorCodes["InvalidChannel"] = 4005] = "InvalidChannel";
    RPCErrorCodes[RPCErrorCodes["InvalidPermissions"] = 4006] = "InvalidPermissions";
    RPCErrorCodes[RPCErrorCodes["InvalidClientId"] = 4007] = "InvalidClientId";
    RPCErrorCodes[RPCErrorCodes["InvalidOrigin"] = 4008] = "InvalidOrigin";
    RPCErrorCodes[RPCErrorCodes["InvalidToken"] = 4009] = "InvalidToken";
    RPCErrorCodes[RPCErrorCodes["InvalidUser"] = 4010] = "InvalidUser";
    RPCErrorCodes[RPCErrorCodes["OAuth2Error"] = 5000] = "OAuth2Error";
    RPCErrorCodes[RPCErrorCodes["SelectChannelTimedOut"] = 5001] = "SelectChannelTimedOut";
    RPCErrorCodes[RPCErrorCodes["GetGuildTimedOut"] = 5002] = "GetGuildTimedOut";
    RPCErrorCodes[RPCErrorCodes["SelectVoiceForceRequired"] = 5003] = "SelectVoiceForceRequired";
    RPCErrorCodes[RPCErrorCodes["CaptureShortcutAlreadyListening"] = 5004] = "CaptureShortcutAlreadyListening";
})(RPCErrorCodes = exports.RPCErrorCodes || (exports.RPCErrorCodes = {}));
/**
 * https://discord.com/developers/docs/topics/opcodes-and-status-codes#rpc-rpc-close-event-codes
 */
var RPCCloseEventCodes;
(function (RPCCloseEventCodes) {
    RPCCloseEventCodes[RPCCloseEventCodes["InvalidClientId"] = 4000] = "InvalidClientId";
    RPCCloseEventCodes[RPCCloseEventCodes["InvalidOrigin"] = 4001] = "InvalidOrigin";
    RPCCloseEventCodes[RPCCloseEventCodes["RateLimited"] = 4002] = "RateLimited";
    RPCCloseEventCodes[RPCCloseEventCodes["TokenRevoked"] = 4003] = "TokenRevoked";
    RPCCloseEventCodes[RPCCloseEventCodes["InvalidVersion"] = 4004] = "InvalidVersion";
    RPCCloseEventCodes[RPCCloseEventCodes["InvalidEncoding"] = 4005] = "InvalidEncoding";
})(RPCCloseEventCodes = exports.RPCCloseEventCodes || (exports.RPCCloseEventCodes = {}));
//# sourceMappingURL=common.js.map

/***/ }),

/***/ 8489:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(8525), exports);
//# sourceMappingURL=v9.js.map

/***/ }),

/***/ 1429:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isContextMenuApplicationCommandInteraction = exports.isChatInputApplicationCommandInteraction = exports.isMessageComponentSelectMenuInteraction = exports.isMessageComponentButtonInteraction = exports.isMessageComponentInteraction = exports.isInteractionButton = exports.isLinkButton = exports.isMessageComponentGuildInteraction = exports.isMessageComponentDMInteraction = exports.isApplicationCommandGuildInteraction = exports.isApplicationCommandDMInteraction = exports.isGuildInteraction = exports.isDMInteraction = void 0;
const index_1 = __webpack_require__(7624);
// Interactions
/**
 * A type-guard check for DM interactions
 * @param interaction The interaction to check against
 * @returns A boolean that indicates if the interaction was received in a DM channel
 */
function isDMInteraction(interaction) {
    return Reflect.has(interaction, 'user');
}
exports.isDMInteraction = isDMInteraction;
/**
 * A type-guard check for guild interactions
 * @param interaction The interaction to check against
 * @returns A boolean that indicates if the interaction was received in a guild
 */
function isGuildInteraction(interaction) {
    return Reflect.has(interaction, 'guild_id');
}
exports.isGuildInteraction = isGuildInteraction;
// ApplicationCommandInteractions
/**
 * A type-guard check for DM application command interactions
 * @param interaction The application command interaction to check against
 * @returns A boolean that indicates if the application command interaction was received in a DM channel
 */
function isApplicationCommandDMInteraction(interaction) {
    return isDMInteraction(interaction);
}
exports.isApplicationCommandDMInteraction = isApplicationCommandDMInteraction;
/**
 * A type-guard check for guild application command interactions
 * @param interaction The interaction to check against
 * @returns A boolean that indicates if the application command interaction was received in a guild
 */
function isApplicationCommandGuildInteraction(interaction) {
    return isGuildInteraction(interaction);
}
exports.isApplicationCommandGuildInteraction = isApplicationCommandGuildInteraction;
// MessageComponentInteractions
/**
 * A type-guard check for DM message component interactions
 * @param interaction The message component interaction to check against
 * @returns A boolean that indicates if the message component interaction was received in a DM channel
 */
function isMessageComponentDMInteraction(interaction) {
    return isDMInteraction(interaction);
}
exports.isMessageComponentDMInteraction = isMessageComponentDMInteraction;
/**
 * A type-guard check for guild message component interactions
 * @param interaction The interaction to check against
 * @returns A boolean that indicates if the message component interaction was received in a guild
 */
function isMessageComponentGuildInteraction(interaction) {
    return isGuildInteraction(interaction);
}
exports.isMessageComponentGuildInteraction = isMessageComponentGuildInteraction;
// Buttons
/**
 * A type-guard check for buttons that have a `url` attached to them.
 * @param component The button to check against
 * @returns A boolean that indicates if the button has a `url` attached to it
 */
function isLinkButton(component) {
    return component.style === index_1.ButtonStyle.Link;
}
exports.isLinkButton = isLinkButton;
/**
 * A type-guard check for buttons that have a `custom_id` attached to them.
 * @param button The button to check against
 * @returns A boolean that indicates if the button has a `custom_id` attached to it
 */
function isInteractionButton(component) {
    return component.style !== index_1.ButtonStyle.Link;
}
exports.isInteractionButton = isInteractionButton;
// Message Components
/**
 * A type-guard check for message component interactions
 * @param interaction The interaction to check against
 * @returns A boolean that indicates if the interaction is a message component
 */
function isMessageComponentInteraction(interaction) {
    return interaction.type === index_1.InteractionType.MessageComponent;
}
exports.isMessageComponentInteraction = isMessageComponentInteraction;
/**
 * A type-guard check for button message component interactions
 * @param interaction The message component interaction to check against
 * @returns A boolean that indicates if the message component is a button
 */
function isMessageComponentButtonInteraction(interaction) {
    return interaction.data.component_type === index_1.ComponentType.Button;
}
exports.isMessageComponentButtonInteraction = isMessageComponentButtonInteraction;
/**
 * A type-guard check for select menu message component interactions
 * @param interaction The message component interaction to check against
 * @returns A boolean that indicates if the message component is a select menu
 */
function isMessageComponentSelectMenuInteraction(interaction) {
    return [
        index_1.ComponentType.StringSelect,
        index_1.ComponentType.UserSelect,
        index_1.ComponentType.RoleSelect,
        index_1.ComponentType.MentionableSelect,
        index_1.ComponentType.ChannelSelect,
    ].includes(interaction.data.component_type);
}
exports.isMessageComponentSelectMenuInteraction = isMessageComponentSelectMenuInteraction;
// Application Commands
/**
 * A type-guard check for chat input application commands.
 * @param interaction The interaction to check against
 * @returns A boolean that indicates if the interaction is a chat input application command
 */
function isChatInputApplicationCommandInteraction(interaction) {
    return interaction.data.type === index_1.ApplicationCommandType.ChatInput;
}
exports.isChatInputApplicationCommandInteraction = isChatInputApplicationCommandInteraction;
/**
 * A type-guard check for context menu application commands.
 * @param interaction The interaction to check against
 * @returns A boolean that indicates if the interaction is a context menu application command
 */
function isContextMenuApplicationCommandInteraction(interaction) {
    return (interaction.data.type === index_1.ApplicationCommandType.Message || interaction.data.type === index_1.ApplicationCommandType.User);
}
exports.isContextMenuApplicationCommandInteraction = isContextMenuApplicationCommandInteraction;
//# sourceMappingURL=v9.js.map

/***/ }),

/***/ 5835:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Utils = void 0;
__exportStar(__webpack_require__(4228), exports);
__exportStar(__webpack_require__(3839), exports);
__exportStar(__webpack_require__(7624), exports);
__exportStar(__webpack_require__(8119), exports);
__exportStar(__webpack_require__(8489), exports);
exports.Utils = __webpack_require__(1429);
//# sourceMappingURL=v9.js.map

/***/ }),

/***/ 9593:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



// A linked list to keep track of recently-used-ness
const Yallist = __webpack_require__(4411)

const MAX = Symbol('max')
const LENGTH = Symbol('length')
const LENGTH_CALCULATOR = Symbol('lengthCalculator')
const ALLOW_STALE = Symbol('allowStale')
const MAX_AGE = Symbol('maxAge')
const DISPOSE = Symbol('dispose')
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet')
const LRU_LIST = Symbol('lruList')
const CACHE = Symbol('cache')
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet')

const naiveLength = () => 1

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options }

    if (!options)
      options = {}

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))
    }

    this[CACHE] = new Map() // hash of items by key
    this[LRU_LIST] = new Yallist() // list of items in order of use recency
    this[LENGTH] = 0 // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE]

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0
    const len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const node = this[CACHE].get(key)
      const item = node.value

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value)
      }

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail
    if (!node)
      return null

    del(this, node)
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key))
  }

  load (arr) {
    // reset the cache
    this.reset()

    const now = Date.now()
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l]
      const expiresAt = hit.e || 0
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge)
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (node) {
    const hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now()
        self[LRU_LIST].unshiftNode(node)
      }
    }
    return hit.value
  }
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
}

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

const del = (self, node) => {
  if (node) {
    const hit = node.value
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value)

    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE])
      hit = undefined
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache


/***/ }),

/***/ 2587:
/***/ ((module) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};


/***/ }),

/***/ 2361:
/***/ ((module) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).map(function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (Array.isArray(obj[k])) {
        return obj[k].map(function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).filter(Boolean).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};


/***/ }),

/***/ 7673:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;


__webpack_unused_export__ = /* unused reexport */ __webpack_require__(2587);
__webpack_unused_export__ = exports.stringify = __webpack_require__(2361);


/***/ }),

/***/ 2257:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false,
      }
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    const sameDirectionIncreasing =
      (this.operator === '>=' || this.operator === '>') &&
      (comp.operator === '>=' || comp.operator === '>')
    const sameDirectionDecreasing =
      (this.operator === '<=' || this.operator === '<') &&
      (comp.operator === '<=' || comp.operator === '<')
    const sameSemVer = this.semver.version === comp.semver.version
    const differentDirectionsInclusive =
      (this.operator === '>=' || this.operator === '<=') &&
      (comp.operator === '>=' || comp.operator === '<=')
    const oppositeDirectionsLessThan =
      cmp(this.semver, '<', comp.semver, options) &&
      (this.operator === '>=' || this.operator === '>') &&
        (comp.operator === '<=' || comp.operator === '<')
    const oppositeDirectionsGreaterThan =
      cmp(this.semver, '>', comp.semver, options) &&
      (this.operator === '<=' || this.operator === '<') &&
        (comp.operator === '>=' || comp.operator === '>')

    return (
      sameDirectionIncreasing ||
      sameDirectionDecreasing ||
      (sameSemVer && differentDirectionsInclusive) ||
      oppositeDirectionsLessThan ||
      oppositeDirectionsGreaterThan
    )
  }
}

module.exports = Comparator

const parseOptions = __webpack_require__(2893)
const { re, t } = __webpack_require__(5765)
const cmp = __webpack_require__(7539)
const debug = __webpack_require__(4225)
const SemVer = __webpack_require__(6376)
const Range = __webpack_require__(6902)


/***/ }),

/***/ 6902:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions(options)

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.format()
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First, split based on boolean or ||
    this.raw = range
    this.set = range
      .split('||')
      // map the range to a 2d array of comparators
      .map(r => this.parseRange(r.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${range}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0]
      this.set = this.set.filter(c => !isNullSet(c[0]))
      if (this.set.length === 0) {
        this.set = [first]
      } else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c]
            break
          }
        }
      }
    }

    this.format()
  }

  format () {
    this.range = this.set
      .map((comps) => {
        return comps.join(' ').trim()
      })
      .join('||')
      .trim()
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    range = range.trim()

    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts = Object.keys(this.options).join(',')
    const memoKey = `parseRange:${memoOpts}:${range}`
    const cached = cache.get(memoKey)
    if (cached) {
      return cached
    }

    const loose = this.options.loose
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range)

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)

    // normalize spaces
    range = range.split(/\s+/).join(' ')

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    let rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))

    if (loose) {
      // in loose mode, throw out any that are not valid comparators
      rangeList = rangeList.filter(comp => {
        debug('loose invalid filter', comp, this.options)
        return !!comp.match(re[t.COMPARATORLOOSE])
      })
    }
    debug('range list', rangeList)

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const rangeMap = new Map()
    const comparators = rangeList.map(comp => new Comparator(comp, this.options))
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp]
      }
      rangeMap.set(comp.value, comp)
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
      rangeMap.delete('')
    }

    const result = [...rangeMap.values()]
    cache.set(memoKey, result)
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}
module.exports = Range

const LRU = __webpack_require__(9593)
const cache = new LRU({ max: 1000 })

const parseOptions = __webpack_require__(2893)
const Comparator = __webpack_require__(2257)
const debug = __webpack_require__(4225)
const SemVer = __webpack_require__(6376)
const {
  re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace,
} = __webpack_require__(5765)

const isNullSet = c => c.value === '<0.0.0-0'
const isAny = c => c.value === ''

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options) =>
  comp.trim().split(/\s+/).map((c) => {
    return replaceTilde(c, options)
  }).join(' ')

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options) =>
  comp.trim().split(/\s+/).map((c) => {
    return replaceCaret(c, options)
  }).join(' ')

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map((c) => {
    return replaceXRange(c, options)
  }).join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<') {
        pr = '-0'
      }

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp.trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return (`${from} ${to}`).trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}


/***/ }),

/***/ 6376:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const debug = __webpack_require__(4225)
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __webpack_require__(3295)
const { re, t } = __webpack_require__(5765)

const parseOptions = __webpack_require__(2893)
const { compareIdentifiers } = __webpack_require__(6742)
class SemVer {
  constructor (version, options) {
    options = parseOptions(options)

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier)
        this.inc('pre', identifier)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier)
        }
        this.inc('pre', identifier)
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre':
        if (this.prerelease.length === 0) {
          this.prerelease = [0]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            this.prerelease.push(0)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0]
            }
          } else {
            this.prerelease = [identifier, 0]
          }
        }
        break

      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.format()
    this.raw = this.version
    return this
  }
}

module.exports = SemVer


/***/ }),

/***/ 3507:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const parse = __webpack_require__(3959)
const clean = (version, options) => {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}
module.exports = clean


/***/ }),

/***/ 7539:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const eq = __webpack_require__(8718)
const neq = __webpack_require__(1194)
const gt = __webpack_require__(1312)
const gte = __webpack_require__(5903)
const lt = __webpack_require__(1544)
const lte = __webpack_require__(2056)

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a === b

    case '!==':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp


/***/ }),

/***/ 9038:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(6376)
const parse = __webpack_require__(3959)
const { re, t } = __webpack_require__(5765)

const coerce = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  let match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next
    while ((next = re[t.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
}
module.exports = coerce


/***/ }),

/***/ 8880:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(6376)
const compareBuild = (a, b, loose) => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
module.exports = compareBuild


/***/ }),

/***/ 7880:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(6269)
const compareLoose = (a, b) => compare(a, b, true)
module.exports = compareLoose


/***/ }),

/***/ 6269:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(6376)
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),

/***/ 2378:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const parse = __webpack_require__(3959)
const eq = __webpack_require__(8718)

const diff = (version1, version2) => {
  if (eq(version1, version2)) {
    return null
  } else {
    const v1 = parse(version1)
    const v2 = parse(version2)
    const hasPre = v1.prerelease.length || v2.prerelease.length
    const prefix = hasPre ? 'pre' : ''
    const defaultResult = hasPre ? 'prerelease' : ''
    for (const key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}
module.exports = diff


/***/ }),

/***/ 8718:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(6269)
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq


/***/ }),

/***/ 1312:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(6269)
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt


/***/ }),

/***/ 5903:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(6269)
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte


/***/ }),

/***/ 253:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(6376)

const inc = (version, release, options, identifier) => {
  if (typeof (options) === 'string') {
    identifier = options
    options = undefined
  }

  try {
    return new SemVer(
      version instanceof SemVer ? version.version : version,
      options
    ).inc(release, identifier).version
  } catch (er) {
    return null
  }
}
module.exports = inc


/***/ }),

/***/ 1544:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(6269)
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt


/***/ }),

/***/ 2056:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(6269)
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte


/***/ }),

/***/ 8679:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(6376)
const major = (a, loose) => new SemVer(a, loose).major
module.exports = major


/***/ }),

/***/ 7789:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(6376)
const minor = (a, loose) => new SemVer(a, loose).minor
module.exports = minor


/***/ }),

/***/ 1194:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(6269)
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq


/***/ }),

/***/ 3959:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { MAX_LENGTH } = __webpack_require__(3295)
const { re, t } = __webpack_require__(5765)
const SemVer = __webpack_require__(6376)

const parseOptions = __webpack_require__(2893)
const parse = (version, options) => {
  options = parseOptions(options)

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  const r = options.loose ? re[t.LOOSE] : re[t.FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

module.exports = parse


/***/ }),

/***/ 2358:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(6376)
const patch = (a, loose) => new SemVer(a, loose).patch
module.exports = patch


/***/ }),

/***/ 7559:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const parse = __webpack_require__(3959)
const prerelease = (version, options) => {
  const parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}
module.exports = prerelease


/***/ }),

/***/ 9795:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(6269)
const rcompare = (a, b, loose) => compare(b, a, loose)
module.exports = rcompare


/***/ }),

/***/ 3657:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compareBuild = __webpack_require__(8880)
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
module.exports = rsort


/***/ }),

/***/ 5712:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Range = __webpack_require__(6902)
const satisfies = (version, range, options) => {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}
module.exports = satisfies


/***/ }),

/***/ 1100:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compareBuild = __webpack_require__(8880)
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
module.exports = sort


/***/ }),

/***/ 6397:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const parse = __webpack_require__(3959)
const valid = (version, options) => {
  const v = parse(version, options)
  return v ? v.version : null
}
module.exports = valid


/***/ }),

/***/ 1249:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// just pre-load all the stuff that index.js lazily exports
const internalRe = __webpack_require__(5765)
const constants = __webpack_require__(3295)
const SemVer = __webpack_require__(6376)
const identifiers = __webpack_require__(6742)
const parse = __webpack_require__(3959)
const valid = __webpack_require__(6397)
const clean = __webpack_require__(3507)
const inc = __webpack_require__(253)
const diff = __webpack_require__(2378)
const major = __webpack_require__(8679)
const minor = __webpack_require__(7789)
const patch = __webpack_require__(2358)
const prerelease = __webpack_require__(7559)
const compare = __webpack_require__(6269)
const rcompare = __webpack_require__(9795)
const compareLoose = __webpack_require__(7880)
const compareBuild = __webpack_require__(8880)
const sort = __webpack_require__(1100)
const rsort = __webpack_require__(3657)
const gt = __webpack_require__(1312)
const lt = __webpack_require__(1544)
const eq = __webpack_require__(8718)
const neq = __webpack_require__(1194)
const gte = __webpack_require__(5903)
const lte = __webpack_require__(2056)
const cmp = __webpack_require__(7539)
const coerce = __webpack_require__(9038)
const Comparator = __webpack_require__(2257)
const Range = __webpack_require__(6902)
const satisfies = __webpack_require__(5712)
const toComparators = __webpack_require__(1042)
const maxSatisfying = __webpack_require__(5775)
const minSatisfying = __webpack_require__(1657)
const minVersion = __webpack_require__(5316)
const validRange = __webpack_require__(9042)
const outside = __webpack_require__(6826)
const gtr = __webpack_require__(7606)
const ltr = __webpack_require__(32)
const intersects = __webpack_require__(2937)
const simplifyRange = __webpack_require__(7908)
const subset = __webpack_require__(799)
module.exports = {
  parse,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers,
}


/***/ }),

/***/ 3295:
/***/ ((module) => {

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

module.exports = {
  SEMVER_SPEC_VERSION,
  MAX_LENGTH,
  MAX_SAFE_INTEGER,
  MAX_SAFE_COMPONENT_LENGTH,
}


/***/ }),

/***/ 4225:
/***/ ((module) => {

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug


/***/ }),

/***/ 6742:
/***/ ((module) => {

const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers,
}


/***/ }),

/***/ 2893:
/***/ ((module) => {

// parse out just the options we care about so we always get a consistent
// obj with keys in a consistent order.
const opts = ['includePrerelease', 'loose', 'rtl']
const parseOptions = options =>
  !options ? {}
  : typeof options !== 'object' ? { loose: true }
  : opts.filter(k => options[k]).reduce((o, k) => {
    o[k] = true
    return o
  }, {})
module.exports = parseOptions


/***/ }),

/***/ 5765:
/***/ ((module, exports, __webpack_require__) => {

const { MAX_SAFE_COMPONENT_LENGTH } = __webpack_require__(3295)
const debug = __webpack_require__(4225)
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const src = exports.src = []
const t = exports.t = {}
let R = 0

const createToken = (name, value, isGlobal) => {
  const index = R++
  debug(name, index, value)
  t[name] = index
  src[index] = value
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*')

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+')

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$')


/***/ }),

/***/ 7606:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Determine if version is greater than all the versions possible in the range.
const outside = __webpack_require__(6826)
const gtr = (version, range, options) => outside(version, range, '>', options)
module.exports = gtr


/***/ }),

/***/ 2937:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Range = __webpack_require__(6902)
const intersects = (r1, r2, options) => {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}
module.exports = intersects


/***/ }),

/***/ 32:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const outside = __webpack_require__(6826)
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside(version, range, '<', options)
module.exports = ltr


/***/ }),

/***/ 5775:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(6376)
const Range = __webpack_require__(6902)

const maxSatisfying = (versions, range, options) => {
  let max = null
  let maxSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}
module.exports = maxSatisfying


/***/ }),

/***/ 1657:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(6376)
const Range = __webpack_require__(6902)
const minSatisfying = (versions, range, options) => {
  let min = null
  let minSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}
module.exports = minSatisfying


/***/ }),

/***/ 5316:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(6376)
const Range = __webpack_require__(6902)
const gt = __webpack_require__(1312)

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let setMin = null
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt(compver, setMin)) {
            setMin = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    })
    if (setMin && (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}
module.exports = minVersion


/***/ }),

/***/ 6826:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(6376)
const Comparator = __webpack_require__(2257)
const { ANY } = Comparator
const Range = __webpack_require__(6902)
const satisfies = __webpack_require__(5712)
const gt = __webpack_require__(1312)
const lt = __webpack_require__(1544)
const lte = __webpack_require__(2056)
const gte = __webpack_require__(5903)

const outside = (version, range, hilo, options) => {
  version = new SemVer(version, options)
  range = new Range(range, options)

  let gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisfies the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let high = null
    let low = null

    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

module.exports = outside


/***/ }),

/***/ 7908:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __webpack_require__(5712)
const compare = __webpack_require__(6269)
module.exports = (versions, range, options) => {
  const set = []
  let first = null
  let prev = null
  const v = versions.sort((a, b) => compare(a, b, options))
  for (const version of v) {
    const included = satisfies(version, range, options)
    if (included) {
      prev = version
      if (!first) {
        first = version
      }
    } else {
      if (prev) {
        set.push([first, prev])
      }
      prev = null
      first = null
    }
  }
  if (first) {
    set.push([first, null])
  }

  const ranges = []
  for (const [min, max] of set) {
    if (min === max) {
      ranges.push(min)
    } else if (!max && min === v[0]) {
      ranges.push('*')
    } else if (!max) {
      ranges.push(`>=${min}`)
    } else if (min === v[0]) {
      ranges.push(`<=${max}`)
    } else {
      ranges.push(`${min} - ${max}`)
    }
  }
  const simplified = ranges.join(' || ')
  const original = typeof range.raw === 'string' ? range.raw : String(range)
  return simplified.length < original.length ? simplified : range
}


/***/ }),

/***/ 799:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Range = __webpack_require__(6902)
const Comparator = __webpack_require__(2257)
const { ANY } = Comparator
const satisfies = __webpack_require__(5712)
const compare = __webpack_require__(6269)

// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true

const subset = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true
  }

  sub = new Range(sub, options)
  dom = new Range(dom, options)
  let sawNonNull = false

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options)
      sawNonNull = sawNonNull || isSub !== null
      if (isSub) {
        continue OUTER
      }
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull) {
      return false
    }
  }
  return true
}

const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true
  }

  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true
    } else if (options.includePrerelease) {
      sub = [new Comparator('>=0.0.0-0')]
    } else {
      sub = [new Comparator('>=0.0.0')]
    }
  }

  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true
    } else {
      dom = [new Comparator('>=0.0.0')]
    }
  }

  const eqSet = new Set()
  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      eqSet.add(c.semver)
    }
  }

  if (eqSet.size > 1) {
    return null
  }

  let gtltComp
  if (gt && lt) {
    gtltComp = compare(gt.semver, lt.semver, options)
    if (gtltComp > 0) {
      return null
    } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
      return null
    }
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies(eq, String(gt), options)) {
      return null
    }

    if (lt && !satisfies(eq, String(lt), options)) {
      return null
    }

    for (const c of dom) {
      if (!satisfies(eq, String(c), options)) {
        return false
      }
    }

    return true
  }

  let higher, lower
  let hasDomLT, hasDomGT
  // if the subset has a prerelease, we need a comparator in the superset
  // with the same tuple and a prerelease, or it's not a subset
  let needDomLTPre = lt &&
    !options.includePrerelease &&
    lt.semver.prerelease.length ? lt.semver : false
  let needDomGTPre = gt &&
    !options.includePrerelease &&
    gt.semver.prerelease.length ? gt.semver : false
  // exception: <1.2.3-0 is the same as <1.2.3
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
      lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false
  }

  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomGTPre.major &&
            c.semver.minor === needDomGTPre.minor &&
            c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false
        }
      }
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options)
        if (higher === c && higher !== gt) {
          return false
        }
      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
        return false
      }
    }
    if (lt) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomLTPre.major &&
            c.semver.minor === needDomLTPre.minor &&
            c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false
        }
      }
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options)
        if (lower === c && lower !== lt) {
          return false
        }
      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
        return false
      }
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0) {
      return false
    }
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0) {
    return false
  }

  if (lt && hasDomGT && !gt && gtltComp !== 0) {
    return false
  }

  // we needed a prerelease range in a specific tuple, but didn't get one
  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
  // because it includes prereleases in the 1.2.3 tuple
  if (needDomGTPre || needDomLTPre) {
    return false
  }

  return true
}

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
}

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
}

module.exports = subset


/***/ }),

/***/ 1042:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Range = __webpack_require__(6902)

// Mostly just for testing and legacy API reasons
const toComparators = (range, options) =>
  new Range(range, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '))

module.exports = toComparators


/***/ }),

/***/ 9042:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Range = __webpack_require__(6902)
const validRange = (range, options) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}
module.exports = validRange


/***/ }),

/***/ 9602:
/***/ ((module) => {


module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}


/***/ }),

/***/ 4411:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  __webpack_require__(9602)(Yallist)
} catch (er) {}


/***/ }),

/***/ 9205:
/***/ ((module) => {

var x = y => { var x = {}; __webpack_require__.d(x, y); return x; }
var y = x => () => x
module.exports = __WEBPACK_EXTERNAL_MODULE__minecraft_server_fb7572af__;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		loaded: false,
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Flag the module as loaded
/******/ 	module.loaded = true;
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/node module decorator */
/******/ (() => {
/******/ 	__webpack_require__.nmd = (module) => {
/******/ 		module.paths = [];
/******/ 		if (!module.children) module.children = [];
/******/ 		return module;
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: ./src/factory/debug.ts
/** @internal */
class Debug {
    get date() {
        return DateParse(new Date());
    }
    ;
    log(...arg) {
        console.log(`[${this.date}][${this.category}]`, ...arg);
    }
    ;
    warn(...arg) {
        console.warn(`[${this.date}][${this.category}]`, ...arg);
    }
    ;
    error(...arg) {
        console.error(`[${this.date}][${this.category}]`, ...arg);
    }
    ;
    constructor(category) {
        this.category = category;
    }
    ;
}
;
function DateParse(date) {
    let isoString = date.toISOString();
    isoString = isoString.replace('T', ' ');
    isoString = isoString.replace('Z', '');
    return isoString;
}
;

;// CONCATENATED MODULE: ./src/factory/Constants.ts
/**
 * @internal
 */

/**
 * Discord API version used for the wrapper
 */
const API_VERSION = 9;
/**
 * @internal
 */
const BASE_URL = "/api/v" + API_VERSION;
/**
 * @internal
 */
const CDN_URL = "https://cdn.discordapp.com";
/**
 * @internal
 */
const CLIENT_URL = "https://discord.com";
/**
 * NPM Package version
 */
const version = '1.0.5';
/**
 * discord-api submodule version
 */
const moduleVersion = '0.0.5';
/**
 * @internal
 */
const Constants_packageName = 'minecraft-extra';
/**
 * @internal
 */
const Constants_Package = { homepage: "https://www.npmjs.com/package/" + Constants_packageName, version, };
/**
 * @internal
 */
const UserAgent = { ag: 'cpprestsdk', version: '2.9.0' };
/**
 * @internal
 */
const ServerNetDebug = new Debug('server-net');
/**
 * @internal
 */
const NodeDebug = new Debug('node');
/**
 * @internal
 */
const npmDebug = new Debug('npm');
var Constants_HttpRequestMethod;
(function (HttpRequestMethod) {
    /**
     * The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.
     */
    HttpRequestMethod["GET"] = "GET";
    /**
     * The POST method submits an entity to the specified resource, often causing a change in state or side effects on the server.
     */
    HttpRequestMethod["POST"] = "POST";
    /**
     * The PUT method replaces all current representations of the target resource with the request payload.
     */
    HttpRequestMethod["PUT"] = "PUT";
    /**
     * The DELETE method deletes the specified resource.
     */
    HttpRequestMethod["DELETE"] = "DELETE";
})(Constants_HttpRequestMethod || (Constants_HttpRequestMethod = {}));

;// CONCATENATED MODULE: external "@minecraft/server-net"
var x = y => { var x = {}; __webpack_require__.d(x, y); return x; }
var y = x => () => x
const server_net_namespaceObject = x({ ["HttpHeader"]: () => __WEBPACK_EXTERNAL_MODULE__minecraft_server_net_e9d6053a__.HttpHeader, ["HttpRequest"]: () => __WEBPACK_EXTERNAL_MODULE__minecraft_server_net_e9d6053a__.HttpRequest, ["HttpRequestMethod"]: () => __WEBPACK_EXTERNAL_MODULE__minecraft_server_net_e9d6053a__.HttpRequestMethod, ["http"]: () => __WEBPACK_EXTERNAL_MODULE__minecraft_server_net_e9d6053a__.http });
;// CONCATENATED MODULE: ./src/deep-copy.ts
/**
 * Clone the object using iteration
 * @param obj object
 * @internal
 */
function DeepCopy(obj) {
    if (obj === null || obj === undefined || typeof obj !== "object") {
        return obj;
    }
    if (obj instanceof Array) {
        var cloneA = [];
        for (var i = 0; i < obj.length; ++i) {
            cloneA[i] = DeepCopy(obj[i]);
        }
        return cloneA;
    }
    var cloneO = {};
    for (var e in obj) {
        cloneO[e] = DeepCopy(obj[e]);
    }
    return cloneO;
}
;

// EXTERNAL MODULE: ./node_modules/semver/index.js
var semver = __webpack_require__(1249);
;// CONCATENATED MODULE: ./src/update.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




/**
 * Check if update available for the package
 * @internal
 */
function getUpdate() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = Constants_Package.homepage;
        const response = yield server_net_namespaceObject.http.get(url);
        if (response.status !== 200) {
            ServerNetDebug.error(`Failed to ${server_net_namespaceObject.HttpRequestMethod.GET} ${url}. Response: ${JSON.stringify(DeepCopy(response))}`);
            return;
        }
        ;
        ServerNetDebug.log(`${server_net_namespaceObject.HttpRequestMethod.GET} ${url}`);
        const packument = JSON.parse(response.body);
        const LatestVersion = packument["dist-tags"].latest;
        // 0 if v1 == v2
        // 1 if v1 is greater
        // -1 if v2 is greater.
        const result = semver.compare(version, LatestVersion);
        if (result === -1) {
            const message = 'New update available. Please update the package to version ' + LatestVersion;
            npmDebug.warn(message);
            // attempt to import @minecraft/server module
            const { world } = yield Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 9205));
            world.say(message);
        }
        else
            npmDebug.log(`Current version ${version} >= latest version ${LatestVersion}`);
    });
}
;
/**
 * get package download speed
 */
function testOnly_packageDownload() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = Date.now();
        const response = yield http.get(`https://registry.npmjs.org/${packageName}/-/${packageName}-${Package.version}.tgz`);
        const timeTaken = Date.now() - startTime;
        const ContentLength = response.headers.find(({ key }) => key === 'content-length');
        return parseInt(String((_a = ContentLength.value) !== null && _a !== void 0 ? _a : 0)) / (timeTaken / 1000);
    });
}
;
getUpdate();
// (async () => {
//   const DownloadSpeed = await testOnly_packageDownload();
//   const kbps = (DownloadSpeed / 1000).toFixed(3);
//   if (DownloadSpeed < 100000) ServerNetDebug.warn(`Slow internet connectivity detected. (${kbps} kbps)`);
//   else ServerNetDebug.log('Good internet connectivity, should be able to interact with Discord API.');
// })();

;// CONCATENATED MODULE: ./src/factory/Endpoints.ts
const ORIGINAL_INTERACTION_RESPONSE = (appID, interactToken) => `/webhooks/${appID}/${interactToken}`;
const COMMAND = (applicationID, commandID) => `/applications/${applicationID}/commands/${commandID}`;
const COMMANDS = (applicationID) => `/applications/${applicationID}/commands`;
const COMMAND_PERMISSIONS = (applicationID, guildID, commandID) => `/applications/${applicationID}/guilds/${guildID}/commands/${commandID}/permissions`;
const Endpoints_CHANNEL = (chanID) => `/channels/${chanID}`;
const CHANNEL_BULK_DELETE = (chanID) => `/channels/${chanID}/messages/bulk-delete`;
const CHANNEL_CALL_RING = (chanID) => `/channels/${chanID}/call/ring`;
const CHANNEL_CROSSPOST = (chanID, msgID) => `/channels/${chanID}/messages/${msgID}/crosspost`;
const CHANNEL_FOLLOW = (chanID) => `/channels/${chanID}/followers`;
const CHANNEL_INVITES = (chanID) => `/channels/${chanID}/invites`;
const CHANNEL_MESSAGE_REACTION = (chanID, msgID, reaction) => `/channels/${chanID}/messages/${msgID}/reactions/${reaction}`;
const CHANNEL_MESSAGE_REACTION_USER = (chanID, msgID, reaction, userID) => `/channels/${chanID}/messages/${msgID}/reactions/${reaction}/${userID}`;
const CHANNEL_MESSAGE_REACTIONS = (chanID, msgID) => `/channels/${chanID}/messages/${msgID}/reactions`;
const CHANNEL_MESSAGE = (chanID, msgID) => `/channels/${chanID}/messages/${msgID}`;
const CHANNEL_MESSAGES = (chanID) => `/channels/${chanID}/messages`;
const CHANNEL_MESSAGES_SEARCH = (chanID) => `/channels/${chanID}/messages/search`;
const CHANNEL_PERMISSION = (chanID, overID) => `/channels/${chanID}/permissions/${overID}`;
const CHANNEL_PERMISSIONS = (chanID) => `/channels/${chanID}/permissions`;
const CHANNEL_PIN = (chanID, msgID) => `/channels/${chanID}/pins/${msgID}`;
const CHANNEL_PINS = (chanID) => `/channels/${chanID}/pins`;
const CHANNEL_RECIPIENT = (groupID, userID) => `/channels/${groupID}/recipients/${userID}`;
const CHANNEL_TYPING = (chanID) => `/channels/${chanID}/typing`;
const CHANNEL_WEBHOOKS = (chanID) => `/channels/${chanID}/webhooks`;
const CHANNELS = "/channels";
const CUSTOM_EMOJI_GUILD = (emojiID) => `/emojis/${emojiID}/guild`;
const DISCOVERY_CATEGORIES = "/discovery/categories";
const DISCOVERY_VALIDATION = "/discovery/valid-term";
const GATEWAY = "/gateway";
const GATEWAY_BOT = "/gateway/bot";
const GUILD = (guildID) => `/guilds/${guildID}`;
const GUILD_AUDIT_LOGS = (guildID) => `/guilds/${guildID}/audit-logs`;
const GUILD_BAN = (guildID, memberID) => `/guilds/${guildID}/bans/${memberID}`;
const GUILD_BANS = (guildID) => `/guilds/${guildID}/bans`;
const GUILD_CHANNELS = (guildID) => `/guilds/${guildID}/channels`;
const GUILD_COMMAND = (applicationID, guildID, commandID) => `/applications/${applicationID}/guilds/${guildID}/commands/${commandID}`;
const GUILD_COMMAND_PERMISSIONS = (applicationID, guildID) => `/applications/${applicationID}/guilds/${guildID}/commands/permissions`;
const GUILD_COMMANDS = (applicationID, guildID) => `/applications/${applicationID}/guilds/${guildID}/commands`;
const GUILD_DISCOVERY = (guildID) => `/guilds/${guildID}/discovery-metadata`;
const GUILD_DISCOVERY_CATEGORY = (guildID, categoryID) => `/guilds/${guildID}/discovery-categories/${categoryID}`;
const GUILD_EMOJI = (guildID, emojiID) => `/guilds/${guildID}/emojis/${emojiID}`;
const GUILD_EMOJIS = (guildID) => `/guilds/${guildID}/emojis`;
const GUILD_INTEGRATION = (guildID, inteID) => `/guilds/${guildID}/integrations/${inteID}`;
const GUILD_INTEGRATION_SYNC = (guildID, inteID) => `/guilds/${guildID}/integrations/${inteID}/sync`;
const GUILD_INTEGRATIONS = (guildID) => `/guilds/${guildID}/integrations`;
const GUILD_INVITES = (guildID) => `/guilds/${guildID}/invites`;
const GUILD_VANITY_URL = (guildID) => `/guilds/${guildID}/vanity-url`;
const GUILD_MEMBER = (guildID, memberID) => `/guilds/${guildID}/members/${memberID}`;
const GUILD_MEMBER_NICK = (guildID, memberID) => `/guilds/${guildID}/members/${memberID}/nick`;
const GUILD_MEMBER_ROLE = (guildID, memberID, roleID) => `/guilds/${guildID}/members/${memberID}/roles/${roleID}`;
const GUILD_MEMBERS = (guildID) => `/guilds/${guildID}/members`;
const GUILD_MEMBERS_SEARCH = (guildID) => `/guilds/${guildID}/members/search`;
const GUILD_MESSAGES_SEARCH = (guildID) => `/guilds/${guildID}/messages/search`;
const GUILD_PREVIEW = (guildID) => `/guilds/${guildID}/preview`;
const GUILD_PRUNE = (guildID) => `/guilds/${guildID}/prune`;
const GUILD_ROLE = (guildID, roleID) => `/guilds/${guildID}/roles/${roleID}`;
const GUILD_ROLES = (guildID) => `/guilds/${guildID}/roles`;
const GUILD_SCHEDULED_EVENT = (guildID, scheduledEventID) => `/guilds/${guildID}/scheduled-events/${scheduledEventID}`;
const GUILD_SCHEDULED_EVENT_USERS = (guildID, scheduledEventID) => `/guilds/${guildID}/scheduled-events/${scheduledEventID}/users`;
const GUILD_SCHEDULED_EVENTS = (guildID) => `/guilds/${guildID}/scheduled-events`;
const GUILD_STICKER = (guildID, stickerID) => `/guilds/${guildID}/stickers/${stickerID}`;
const GUILD_STICKERS = (guildID) => `/guilds/${guildID}/stickers`;
const GUILD_TEMPLATE = (code) => `/guilds/templates/${code}`;
const GUILD_TEMPLATES = (guildID) => `/guilds/${guildID}/templates`;
const GUILD_TEMPLATE_GUILD = (guildID, code) => `/guilds/${guildID}/templates/${code}`;
const GUILD_VOICE_REGIONS = (guildID) => `/guilds/${guildID}/regions`;
const GUILD_WEBHOOKS = (guildID) => `/guilds/${guildID}/webhooks`;
const GUILD_WELCOME_SCREEN = (guildID) => `/guilds/${guildID}/welcome-screen`;
const GUILD_WIDGET = (guildID) => `/guilds/${guildID}/widget.json`;
const GUILD_WIDGET_SETTINGS = (guildID) => `/guilds/${guildID}/widget`;
const GUILD_VOICE_STATE = (guildID, user) => `/guilds/${guildID}/voice-states/${user}`;
const GUILDS = "/guilds";
const INTERACTION_RESPOND = (interactID, interactToken) => `/interactions/${interactID}/${interactToken}/callback`;
const INVITE = (inviteID) => `/invites/${inviteID}`;
const OAUTH2_APPLICATION = (appID) => `/oauth2/applications/${appID}`;
const STAGE_INSTANCE = (channelID) => `/stage-instances/${channelID}`;
const STAGE_INSTANCES = "/stage-instances";
const STICKER = (stickerID) => `/stickers/${stickerID}`;
const STICKER_PACKS = "/sticker-packs";
const THREAD_MEMBER = (channelID, userID) => `/channels/${channelID}/thread-members/${userID}`;
const THREAD_MEMBERS = (channelID) => `/channels/${channelID}/thread-members`;
const THREAD_WITH_MESSAGE = (channelID, msgID) => `/channels/${channelID}/messages/${msgID}/threads`;
const THREAD_WITHOUT_MESSAGE = (channelID) => `/channels/${channelID}/threads`;
const THREADS_ACTIVE = (channelID) => `/channels/${channelID}/threads/active`;
const THREADS_ARCHIVED = (channelID, type) => `/channels/${channelID}/threads/archived/${type}`;
const THREADS_ARCHIVED_JOINED = (channelID) => `/channels/${channelID}/users/@me/threads/archived/private`;
const THREADS_GUILD_ACTIVE = (guildID) => `/guilds/${guildID}/threads/active`;
const USER = (userID) => `/users/${userID}`;
const USER_BILLING = (userID) => `/users/${userID}/billing`;
const USER_BILLING_PAYMENTS = (userID) => `/users/${userID}/billing/payments`;
const USER_BILLING_PREMIUM_SUBSCRIPTION = (userID) => `/users/${userID}/billing/premium-subscription`;
const USER_CHANNELS = (userID) => `/users/${userID}/channels`;
const USER_CONNECTIONS = (userID) => `/users/${userID}/connections`;
const USER_CONNECTION_PLATFORM = (userID, platform, id) => `/users/${userID}/connections/${platform}/${id}`;
const USER_GUILD = (userID, guildID) => `/users/${userID}/guilds/${guildID}`;
const USER_GUILDS = (userID) => `/users/${userID}/guilds`;
const USER_MFA_CODES = (userID) => `/users/${userID}/mfa/codes`;
const USER_MFA_TOTP_DISABLE = (userID) => `/users/${userID}/mfa/totp/disable`;
const USER_MFA_TOTP_ENABLE = (userID) => `/users/${userID}/mfa/totp/enable`;
const USER_NOTE = (userID, targetID) => `/users/${userID}/note/${targetID}`;
const USER_PROFILE = (userID) => `/users/${userID}/profile`;
const USER_RELATIONSHIP = (userID, relID) => `/users/${userID}/relationships/${relID}`;
const USER_SETTINGS = (userID) => `/users/${userID}/settings`;
const USERS = "/users";
const VOICE_REGIONS = "/voice/regions";
const WEBHOOK = (hookID) => `/webhooks/${hookID}`;
const WEBHOOK_MESSAGE = (hookID, token, msgID) => `/webhooks/${hookID}/${token}/messages/${msgID}`;
const WEBHOOK_SLACK = (hookID) => `/webhooks/${hookID}/slack`;
const WEBHOOK_TOKEN = (hookID, token) => `/webhooks/${hookID}/${token}`;
const WEBHOOK_TOKEN_SLACK = (hookID, token) => `/webhooks/${hookID}/${token}/slack`;
// CDN Endpoints
const ACHIEVEMENT_ICON = (applicationID, achievementID, icon) => `/app-assets/${applicationID}/achievements/${achievementID}/icons/${icon}`;
const APPLICATION_ASSET = (applicationID, asset) => `/app-assets/${applicationID}/${asset}`;
const APPLICATION_ICON = (applicationID, icon) => `/app-icons/${applicationID}/${icon}`;
const BANNER = (guildOrUserID, hash) => `/banners/${guildOrUserID}/${hash}`;
const CHANNEL_ICON = (chanID, chanIcon) => `/channel-icons/${chanID}/${chanIcon}`;
const CUSTOM_EMOJI = (emojiID) => `/emojis/${emojiID}`;
const DEFAULT_USER_AVATAR = (userDiscriminator) => `/embed/avatars/${userDiscriminator}`;
const GUILD_AVATAR = (guildID, userID, guildAvatar) => `/guilds/${guildID}/users/${userID}/avatars/${guildAvatar}`;
const GUILD_DISCOVERY_SPLASH = (guildID, guildDiscoverySplash) => `/discovery-splashes/${guildID}/${guildDiscoverySplash}`;
const GUILD_ICON = (guildID, guildIcon) => `/icons/${guildID}/${guildIcon}`;
const GUILD_SCHEDULED_EVENT_COVER = (eventID, eventIcon) => `/guild-events/${eventID}/${eventIcon}`;
const GUILD_SPLASH = (guildID, guildSplash) => `/splashes/${guildID}/${guildSplash}`;
const ROLE_ICON = (roleID, roleIcon) => `/role-icons/${roleID}/${roleIcon}`;
const TEAM_ICON = (teamID, teamIcon) => `/team-icons/${teamID}/${teamIcon}`;
const USER_AVATAR = (userID, userAvatar) => `/avatars/${userID}/${userAvatar}`;
// Application Endpoints
const MESSAGE_LINK = (guildID, channelID, messageID) => `/channels/${guildID}/${channelID}/${messageID}`;

// EXTERNAL MODULE: ./node_modules/querystring/index.js
var querystring = __webpack_require__(7673);
;// CONCATENATED MODULE: ./src/factory/Requests/Guilds.ts



/**
 * https://discord.com/developers/docs/resources/guild#get-guild
 * @param guildId
 * @param options
 * @param BOT_TOKEN
 * @param callback
 * @returns
 */
/** @internal */
function GetGuild(guildId, options, BOT_TOKEN, callback) {
    const method = Constants_HttpRequestMethod.GET;
    let path = GUILD(guildId);
    if (typeof options === 'object')
        path += '?' + querystring.stringify(options);
    return callback(path, method, BOT_TOKEN);
}
/**
 * Returns an audit log object for the guild.
 * Requires the {@link [VIEW_AUDIT_LOG](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)} permission.
 * @param guildId
 * @param options
 * @param BOT_TOKEN
 * @param callback
 * @returns Returns an audit log object for the guild.
 * @internal
 */
function GetGuildAuditLog(guildId, options, BOT_TOKEN, callback) {
    const method = Constants_HttpRequestMethod.GET;
    let path = GUILD_AUDIT_LOGS(guildId);
    if (typeof options === 'object')
        path += '?' + querystring.stringify(options);
    return callback(path, method, BOT_TOKEN);
}
/** @internal */
function GetChannel(channelId, BOT_TOKEN, callback) {
    const method = Constants_HttpRequestMethod.GET;
    const path = Endpoints_CHANNEL(channelId);
    return callback(path, method, BOT_TOKEN);
}
/** @internal */
function getGuildMember(guildId, userId, BOT_TOKEN, callback) {
    const method = Constants_HttpRequestMethod.GET;
    const path = GUILD_MEMBER(guildId, userId);
    return callback(path, method, BOT_TOKEN);
}
;

;// CONCATENATED MODULE: ./src/net-request.ts
var net_request_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



var HTTPResponseCode;
(function (HTTPResponseCode) {
    /*
     * The request completed successfully.
     */
    HTTPResponseCode[HTTPResponseCode["OK"] = 200] = "OK";
    /*
     * The entity was created successfully.
     */
    HTTPResponseCode[HTTPResponseCode["Created"] = 201] = "Created";
    /*
     * The request completed successfully but returned no content.
     */
    HTTPResponseCode[HTTPResponseCode["NoContent"] = 204] = "NoContent";
    /*
     * The entity was not modified (no action was taken).
     */
    HTTPResponseCode[HTTPResponseCode["NotModified"] = 304] = "NotModified";
    /*
     * The request was improperly formatted, or the server couldn't understand it.
     */
    HTTPResponseCode[HTTPResponseCode["BadRequest"] = 400] = "BadRequest";
    /*
     * The Authorization header was missing or invalid.
     */
    HTTPResponseCode[HTTPResponseCode["Unauthorized"] = 401] = "Unauthorized";
    /*
     * The Authorization token you passed did not have permission to the resource.
     */
    HTTPResponseCode[HTTPResponseCode["Forbidden"] = 403] = "Forbidden";
    /*
     * The resource at the location specified doesn't exist.
     */
    HTTPResponseCode[HTTPResponseCode["NotFound"] = 404] = "NotFound";
    /*
     * The HTTP method used is not valid for the location specified.
     */
    HTTPResponseCode[HTTPResponseCode["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    /*
     * You are being rate limited, see Rate Limits.
     */
    HTTPResponseCode[HTTPResponseCode["TooManyRequests"] = 429] = "TooManyRequests";
    /*
     * There was not a gateway available to process your request. Wait a bit and retry.
     */
    HTTPResponseCode[HTTPResponseCode["GatewayUnavailable"] = 502] = "GatewayUnavailable";
    /*
     * The server had an error processing your request (these are rare).
     */
    HTTPResponseCode[HTTPResponseCode["ServerError"] = 503] = "ServerError";
})(HTTPResponseCode || (HTTPResponseCode = {}));
;
const SuccessResponseCodes = [
    HTTPResponseCode.OK,
    HTTPResponseCode.Created,
    HTTPResponseCode.NoContent,
];
/**
 * Sends request to discord using raw HTTP requests
 * @param url
 * url after https://discord.com/api/v{version_number}, for example `/channels/{channel.id}`
 * @param body
 * JSON body, check https://discord.com/developers/docs
 * @internal
 */
function fetch(url, method, BOT_TOKEN, body) {
    return net_request_awaiter(this, void 0, void 0, function* () {
        const fetchUrl = CLIENT_URL + BASE_URL + url;
        const options = new server_net_namespaceObject.HttpRequest(fetchUrl);
        const headers = [
            new server_net_namespaceObject.HttpHeader("Authorization", "Bot " + BOT_TOKEN),
            new server_net_namespaceObject.HttpHeader("User-Agent", `DiscordBot (${Constants_Package.homepage}, ${Constants_Package.version}) ${UserAgent.ag}/${UserAgent.version}`),
            new server_net_namespaceObject.HttpHeader("Content-Type", "application/json"),
            new server_net_namespaceObject.HttpHeader("Accept-Encoding", "utf-8"),
            new server_net_namespaceObject.HttpHeader("Accept", "text/plain"),
        ];
        options.headers = headers;
        options.method = method;
        if (typeof body === "object")
            options.body = JSON.stringify(body);
        const response = yield server_net_namespaceObject.http.request(options);
        if (SuccessResponseCodes.includes(response.status)) {
            ServerNetDebug.error(`Failed to ${options.method} ${options.uri}. Response: ${JSON.stringify(DeepCopy(response))}`);
            throw new Error(`Failed to ${options.method} ${options.uri}`);
        }
        else {
            ServerNetDebug.log(`${options.method} ${options.uri}`);
            return response.body;
        }
    });
}

// EXTERNAL MODULE: ./node_modules/discord-api-types/v9.js
var v9 = __webpack_require__(5835);
;// CONCATENATED MODULE: ./node_modules/discord-api-types/v9.mjs


/* harmony default export */ const discord_api_types_v9 = ((/* unused pure expression or super */ null && (mod)));
const APIApplicationCommandPermissionsConstant = v9.APIApplicationCommandPermissionsConstant;
const APIVersion = v9.APIVersion;
const ActivityFlags = v9.ActivityFlags;
const ActivityPlatform = v9.ActivityPlatform;
const ActivityType = v9.ActivityType;
const AllowedMentionsTypes = v9.AllowedMentionsTypes;
const ApplicationCommandOptionType = v9.ApplicationCommandOptionType;
const ApplicationCommandPermissionType = v9.ApplicationCommandPermissionType;
const ApplicationCommandType = v9.ApplicationCommandType;
const ApplicationFlags = v9.ApplicationFlags;
const ApplicationRoleConnectionMetadataType = v9.ApplicationRoleConnectionMetadataType;
const AuditLogEvent = v9.AuditLogEvent;
const AuditLogOptionsType = v9.AuditLogOptionsType;
const AutoModerationActionType = v9.AutoModerationActionType;
const AutoModerationRuleEventType = v9.AutoModerationRuleEventType;
const AutoModerationRuleKeywordPresetType = v9.AutoModerationRuleKeywordPresetType;
const AutoModerationRuleTriggerType = v9.AutoModerationRuleTriggerType;
const ButtonStyle = v9.ButtonStyle;
const CDNRoutes = v9.CDNRoutes;
const ChannelFlags = v9.ChannelFlags;
const ChannelType = v9.ChannelType;
const ComponentType = v9.ComponentType;
const ConnectionService = v9.ConnectionService;
const ConnectionVisibility = v9.ConnectionVisibility;
const EmbedType = v9.EmbedType;
const FormattingPatterns = v9.FormattingPatterns;
const ForumLayoutType = v9.ForumLayoutType;
const GatewayCloseCodes = v9.GatewayCloseCodes;
const GatewayDispatchEvents = v9.GatewayDispatchEvents;
const GatewayIntentBits = v9.GatewayIntentBits;
const GatewayOpcodes = v9.GatewayOpcodes;
const GatewayVersion = v9.GatewayVersion;
const GuildDefaultMessageNotifications = v9.GuildDefaultMessageNotifications;
const GuildExplicitContentFilter = v9.GuildExplicitContentFilter;
const GuildFeature = v9.GuildFeature;
const GuildHubType = v9.GuildHubType;
const GuildMFALevel = v9.GuildMFALevel;
const GuildNSFWLevel = v9.GuildNSFWLevel;
const GuildPremiumTier = v9.GuildPremiumTier;
const GuildScheduledEventEntityType = v9.GuildScheduledEventEntityType;
const GuildScheduledEventPrivacyLevel = v9.GuildScheduledEventPrivacyLevel;
const GuildScheduledEventStatus = v9.GuildScheduledEventStatus;
const GuildSystemChannelFlags = v9.GuildSystemChannelFlags;
const GuildVerificationLevel = v9.GuildVerificationLevel;
const GuildWidgetStyle = v9.GuildWidgetStyle;
const ImageFormat = v9.ImageFormat;
const IntegrationExpireBehavior = v9.IntegrationExpireBehavior;
const InteractionResponseType = v9.InteractionResponseType;
const InteractionType = v9.InteractionType;
const InviteTargetType = v9.InviteTargetType;
const Locale = v9.Locale;
const MembershipScreeningFieldType = v9.MembershipScreeningFieldType;
const MessageActivityType = v9.MessageActivityType;
const MessageFlags = v9.MessageFlags;
const MessageType = v9.MessageType;
const OAuth2Routes = v9.OAuth2Routes;
const OAuth2Scopes = v9.OAuth2Scopes;
const OverwriteType = v9.OverwriteType;
const PermissionFlagsBits = v9.PermissionFlagsBits;
const PresenceUpdateStatus = v9.PresenceUpdateStatus;
const RESTJSONErrorCodes = v9.RESTJSONErrorCodes;
const RPCCloseEventCodes = v9.RPCCloseEventCodes;
const RPCErrorCodes = v9.RPCErrorCodes;
const RouteBases = v9.RouteBases;
const Routes = v9.Routes;
const SortOrderType = v9.SortOrderType;
const StageInstancePrivacyLevel = v9.StageInstancePrivacyLevel;
const StickerFormatType = v9.StickerFormatType;
const StickerPackApplicationId = v9.StickerPackApplicationId;
const StickerType = v9.StickerType;
const TeamMemberMembershipState = v9.TeamMemberMembershipState;
const TextInputStyle = v9.TextInputStyle;
const ThreadAutoArchiveDuration = v9.ThreadAutoArchiveDuration;
const ThreadMemberFlags = v9.ThreadMemberFlags;
const UserFlags = v9.UserFlags;
const UserPremiumType = v9.UserPremiumType;
const Utils = v9.Utils;
const VideoQualityMode = v9.VideoQualityMode;
const WebhookType = v9.WebhookType;

;// CONCATENATED MODULE: ./src/factory/Requests/Channels.ts



/** @internal */
function CreateMessage(channelId, options, BOT_TOKEN, callback) {
    const method = Constants_HttpRequestMethod.POST;
    const path = CHANNEL_MESSAGES(channelId);
    return callback(path, method, BOT_TOKEN, options);
}
;
/** @internal */
function GetChannelMessages(channelId, options, BOT_TOKEN, callback) {
    const method = Constants_HttpRequestMethod.GET;
    let path = CHANNEL_MESSAGES(channelId);
    if (typeof options === 'object')
        path += '?' + querystring.stringify(options);
    return callback(path, method, BOT_TOKEN);
}
;
/** @internal */
function DeleteChanel(channelId, BOT_TOKEN, callback) {
    const method = HttpRequestMethod.DELETE;
    const path = CHANNEL(channelId);
    return callback(path, method, BOT_TOKEN);
}
;

// EXTERNAL MODULE: ./node_modules/big-integer/BigInteger.js
var BigInteger = __webpack_require__(4736);
var BigInteger_default = /*#__PURE__*/__webpack_require__.n(BigInteger);
;// CONCATENATED MODULE: ./src/factory/Snowflake.ts

const DISCORD_EPOCH = 1420070400000;
/**
 * https://discord.com/developers/docs/reference#snowflakes
 * @param snowflake
 * @example
 * const date = SnowflakeToDate('175928847299117063');
 * console.warn(date.toUTCString()); // Sat, 30 Apr 2016 11:18:25 GMT
 * @internal
 */
function SnowflakeToDate(snowflake) {
    const SnowflakeBigInt = BigInteger_default()(snowflake);
    const binary = new Array(64 - (SnowflakeBigInt.toString(2).length - 1)).join('0') + SnowflakeBigInt.toString(2);
    const miliseconds_BINARY = binary.substring(0, 42);
    const miliseconds = parseInt(miliseconds_BINARY, 2);
    const UnixTimestamp = miliseconds + DISCORD_EPOCH;
    return new Date(UnixTimestamp);
}
;

;// CONCATENATED MODULE: ./src/factory/index.ts

/** @internal */


;// CONCATENATED MODULE: ./src/User.ts

/**
 * User Object
 */
class User {
    /**
     * When the user joined Discord
     * @returns user join dates and times in a Date object
     */
    getJoinDate() {
        return SnowflakeToDate(this.id);
    }
    ;
    /** @internal */
    constructor(response, client) {
        this.id = response.id;
        this.username = response.username;
        this.discriminator = response.discriminator;
        this.avatar = response.avatar;
        this.bot = response.bot;
        this.system = response.system;
        this.mfaEnabled = response.mfa_enabled;
        this.banner = response.banner;
        this.accentColor = response.accent_color;
        this.locale = response.locale;
        this.verified = response.verified;
        this.email = response.email;
        this.flags = response.flags;
        this.premiumType = response.premium_type;
        this.publicFlags = response.public_flags;
        this.client = client;
        this.tag = `${this.username}#${this.discriminator}`;
    }
    ;
}
class GuildMember {
    /**
     * When the user joined Discord
     * @returns user join dates and times in a Date object
     */
    getJoinDate() {
        return SnowflakeToDate(this.user.id);
    }
    ;
    /** @internal */
    constructor(response, client) {
        this.user = new User(response.user, client);
        this.nick = response.nick;
        this.avatar = response.avatar;
        this.roles = response.roles;
        this.joinedAt = response.joined_at;
        this.premiumSince = response.premium_since;
        this.deaf = response.deaf;
        this.mute = response.mute;
        this.pending = response.pending;
        this.communicationDisabledUntil = response.communication_disabled_until;
        this.client = client;
    }
    ;
}
;

;// CONCATENATED MODULE: ./src/factory/Channels.ts
//////////////////
// DM Channel API
/////////////////
class DMChannelBase {
    /** @internal */
    constructor(response) {
        this.recipients = response.recipients;
        this.lastMessageId = response.last_message_id;
        this.lastPinTimestamp = response.last_pin_timestamp;
        this.type = response.type;
        this.flags = response.flags;
        this.id = response.id;
        this.name = response.name;
    }
    ;
}
;
class GroupDMChannel extends DMChannelBase {
    /** @internal */
    constructor(response) {
        super(response);
        this.name = response.name;
        this.applicationId = response.application_id;
        this.icon = response.icon;
        this.ownerId = response.owner_id;
        this.lastMessageId = response.last_message_id;
        this.lastPinTimestamp = response.last_pin_timestamp;
        this.type = response.type;
        this.flags = response.flags;
        this.id = response.id;
        this.recipients = response.recipients;
    }
    ;
}
;
class DMChannel extends DMChannelBase {
    /** @internal */
    constructor(response) {
        super(response);
        this.name = response.name;
        this.lastMessageId = response.last_message_id;
        this.lastPinTimestamp = response.last_pin_timestamp;
        this.type = response.type;
        this.flags = response.flags;
        this.id = response.id;
        this.recipients = response.recipients;
    }
    ;
}
;
///////////////////////////
// Guild Text Channel API
///////////////////////////
/**
 * Not documented, but partial only includes id, name, and type
 */
class PartialChannel {
    /** @internal */
    constructor(response) {
        this.id = response.id;
        this.type = response.type;
        this.name = response.name;
    }
}
/**
 * This interface is used to allow easy extension for other channel types. While
 * also allowing `APIPartialChannel` to be used without breaking.
 */
class ChannelBase extends PartialChannel {
    /** @internal */
    constructor(response) {
        super(response);
        this.type = response.type;
        this.flags = response.flags;
    }
}
class TextBasedChannel extends ChannelBase {
    /** @internal */
    constructor(response) {
        super(response);
        this.lastMessageId = response.last_message_id;
        this.lastPinTimestamp = response.last_pin_timestamp;
        this.rateLimitPerUser = response.rate_limit_per_user;
    }
    ;
}
;
class GuildChannel extends ChannelBase {
    /** @internal */
    constructor(response, guild) {
        var _a;
        super(response);
        this.name = response.name;
        this.guildId = (_a = response.guild_id) !== null && _a !== void 0 ? _a : guild.id;
        this.permissionOverwrites = response.permission_overwrites;
        this.position = response.position;
        this.parentId = response.parent_id;
        this.nsfw = response.nsfw;
        this.guild = guild;
    }
    ;
}
;
class GuildTextChannel extends TextBasedChannel {
    /** @internal */
    constructor(response, guild) {
        super(response);
        this.name = response.name;
        this.guildId = response.guild_id;
        this.permissionOverwrites = response.permission_overwrites;
        this.position = response.position;
        this.parentId = response.parent_id;
        this.nsfw = response.nsfw;
        this.defaultAutoArchiveDuration = response.default_auto_archive_duration;
        this.defaultThreadRateLimitPerUser = response.default_thread_rate_limit_per_user;
        this.topic = response.topic;
        this.guild = guild;
    }
}
class TextChannel extends (/* unused pure expression or super */ null && (GuildTextChannel)) {
    constructor(response) {
        super(response);
    }
    ;
}
;
class NewsChannel extends GuildTextChannel {
    constructor(response) {
        super(response);
    }
    ;
}
;
///////////////////////////
// Guild Voice Channel API
///////////////////////////
class VoiceChannelBase extends GuildChannel {
    /** @internal */
    constructor(response) {
        super(response);
        this.bitrate = response.bitrate;
        this.userLimit = response.user_limit;
        this.rtcRegion = response.rtc_region;
    }
}
class GuildVoiceChannel extends VoiceChannelBase {
    /** @internal */
    constructor(response) {
        super(response);
        this.lastMessageId = response.last_message_id;
        this.rateLimitPerUser = response.rate_limit_per_user;
        this.videoQualityMode = response.video_quality_mode;
    }
}
class GuildStageVoiceChannel extends VoiceChannelBase {
    constructor(response) {
        super(response);
    }
    ;
}
;
class GuildCategoryChannel extends GuildChannel {
    constructor(response) {
        super(response);
    }
    ;
}
;
class ThreadChannel extends GuildChannel {
    /** @internal */
    constructor(response, guild) {
        super(response, guild);
        this.member = response.member;
        this.threadMetadata = response.thread_metadata;
        this.messageCount = response.message_count;
        this.memberCount = response.member_count;
        this.ownerId = response.owner_id;
        this.totalMessageSent = response.total_message_sent;
        this.appliedTags = response.applied_tags;
        this.lastMessageId = response.last_message_id;
        this.lastPinTimestamp = response.last_pin_timestamp;
        this.rateLimitPerUser = response.rate_limit_per_user;
    }
    ;
}
;
class GuildForumChannel extends GuildTextChannel {
    /** @internal */
    constructor(response) {
        super(response);
        this.availableTags = response.available_tags;
        this.defaultReactionEmoji = response.default_reaction_emoji;
        this.defaultSortOrder = response.default_sort_order;
        this.defaultForumLayout = response.default_forum_layout;
    }
    ;
}
;

;// CONCATENATED MODULE: ./src/Guild.ts
var Guild_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







/**
 * Guilds in Discord represent an isolated collection of users and channels,
 * and are often referred to as "servers" in the UI.
 */
class Guild {
    /**
     * Get server audit log
     * @param options Get guild audit log object
     * @returns aduit log object
     */
    getAuditLog(options) {
        return Guild_awaiter(this, void 0, void 0, function* () {
            const response = yield GetGuildAuditLog(this.id, options, this.client['token'], fetch);
            const result = JSON.parse(response);
            return result;
        });
    }
    ;
    /**
     * Send a message in a channel
     * @param channelId
     * @param options
     */
    sendMessage(channelId, options) {
        CreateMessage(channelId, options, this.client['token'], fetch).catch((err) => console.error(err));
    }
    ;
    /**
     * Get messages from a channel
     * @param channelId
     * @param options
     * @returns
     */
    getMessages(channelId, options) {
        return Guild_awaiter(this, void 0, void 0, function* () {
            const response = yield GetChannelMessages(channelId, options, this.client['token'], fetch);
            const result = JSON.parse(response);
            return result;
        });
    }
    ;
    /**
     * Get channel from current guild
     * @param channelId
     * @returns A wrapped channel class if channel exist
     */
    getChannel(channelId) {
        return Guild_awaiter(this, void 0, void 0, function* () {
            const response = yield GetChannel(channelId, this.client['token'], fetch);
            const result = JSON.parse(response);
            switch (result.type) {
                case ChannelType.GuildText:
                    return new GuildTextChannel(result);
                case ChannelType.DM:
                    return new DMChannel(result);
                case ChannelType.GuildVoice:
                    return new GuildVoiceChannel(result);
                case ChannelType.GroupDM:
                    return new GroupDMChannel(result);
                case ChannelType.GuildCategory:
                    return new GuildCategoryChannel(result);
                case ChannelType.GuildAnnouncement:
                    return new NewsChannel(result);
                case ChannelType.AnnouncementThread || ChannelType.PublicThread || ChannelType.PrivateThread:
                    return new ThreadChannel(result);
                case ChannelType.GuildStageVoice:
                    return new GuildStageVoiceChannel(result);
                case ChannelType.GuildForum:
                    return new GuildForumChannel(result);
                default:
                    ServerNetDebug.warn('Could not identify type of channel:', result.type);
                    return result;
            }
        });
    }
    ;
    getGuildMember(userId) {
        return Guild_awaiter(this, void 0, void 0, function* () {
            const response = yield getGuildMember(this.id, userId, this.client['token'], fetch);
            const result = JSON.parse(response);
            return new GuildMember(result, this.client);
        });
    }
    ;
    /** @internal */
    constructor(response, client) {
        this.client = client;
        this.id = response.id;
        this.name = response.name;
        this.icon = response.icon;
        this.iconHash = response.icon_hash;
        this.splash = response.splash;
        this.discoverySplash = response.discovery_splash;
        this.owner = response.owner;
        this.ownerId = response.owner_id;
        this.permissions = response.permissions;
        this.afkChannelId = response.afk_channel_id;
        this.afkTimeout = response.afk_timeout;
        this.widgetEnabled = response.widget_enabled;
        this.widgetChannelId = response.widget_channel_id;
        this.verificationLevel = response.verification_level;
        this.defaultMessageNotifications = response.default_message_notifications;
        this.explicitContentFilter = response.explicit_content_filter;
        this.roles = response.roles;
        this.emojis = response.emojis;
        this.features = response.features;
        this.mfaLevel = response.mfa_level;
        this.applicationId = response.application_id;
        this.systemChannelId = response.system_channel_id;
        this.systemChannelFlags = response.system_channel_flags;
        this.rulesChannelId = response.rules_channel_id;
        this.maxPresences = response.max_presences;
        this.maxMembers = response.max_members;
        this.vanityUrlCode = response.vanity_url_code;
        this.description = response.description;
        this.banner = response.banner;
        this.premiumTier = response.premium_tier;
        this.premiumSubscriptionCount = response.premium_subscription_count;
        this.preferredLocale = response.preferred_locale;
        this.publicUpdatesChannelId = response.public_updates_channel_id;
        this.maxVideoChannelUsers = response.max_video_channel_users;
        this.approximateMemberCount = response.approximate_member_count;
        this.approximatePresenceCount = response.approximate_presence_count;
        this.welcomeScreen = response.welcome_screen;
        this.nsfwLevel = response.nsfw_level;
        this.stickers = response.stickers;
        this.premiumProgressBarEnabled = response.premium_progress_bar_enabled;
        this.hubType = response.hub_type;
    }
    ;
}
;

;// CONCATENATED MODULE: ./src/Client.ts
var Client_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




/**
 * Represents a client connection that connects to Discord.
 * This class is used to authenticate and interact with the Discord API.
 */
class Client {
    /**
     * Get infomation about discord server
     * @param guildId
     * @param options get guild options
     * @returns Guild object
     */
    getGuild(guildId, options) {
        return Client_awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield GetGuild(guildId, options, this.token, fetch);
            const guildResponse = JSON.parse(rawResponse);
            return new Guild(guildResponse, this);
        });
    }
    ;
    /**
     * Send a message in a channel
     * @param channelId
     * @param options
     */
    sendMessage(channelId, options) {
        CreateMessage(channelId, options, this.token, fetch);
    }
    ;
    /**
     * Creates a client
     * @param token Discord bot token. **Do not share it with anyone.**
     */
    constructor(token) {
        this.token = token;
    }
    ;
}
;

;// CONCATENATED MODULE: ./src/index.ts
// imports

// exports





;// CONCATENATED MODULE: ./tests/src/discord-api.ts
/* Generated file, do not modify. */


;// CONCATENATED MODULE: external "@minecraft/server-admin"
var server_admin_x = y => { var x = {}; __webpack_require__.d(x, y); return x; }
var server_admin_y = x => () => x
const server_admin_namespaceObject = server_admin_x({ ["variables"]: () => __WEBPACK_EXTERNAL_MODULE__minecraft_server_admin_65ac06b4__.variables });
;// CONCATENATED MODULE: ./tests/src/config.ts


const BOT_TOKEN = server_admin_namespaceObject.variables.get('BOT_TOKEN');
const client = new Client(BOT_TOKEN);
const TEST_GUILD = server_admin_namespaceObject.variables.get('TEST_GUILD');
const TEST_USER = server_admin_namespaceObject.variables.get('TEST_USER');
const TEST_CHANNEL = server_admin_namespaceObject.variables.get('TEST_CHANNEL');

;// CONCATENATED MODULE: ./tests/src/guildTests.ts
var guildTests_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

(function getGuildMemberInfo() {
    var _a, _b;
    return guildTests_awaiter(this, void 0, void 0, function* () {
        const guild = yield client.getGuild(TEST_GUILD);
        const member = yield guild.getGuildMember(TEST_USER);
        const memberTag = `${(_a = member === null || member === void 0 ? void 0 : member.user) === null || _a === void 0 ? void 0 : _a.username}#${(_b = member === null || member === void 0 ? void 0 : member.user) === null || _b === void 0 ? void 0 : _b.discriminator}`;
        console.log(`Member ${memberTag} join date: ${member.getJoinDate().toDateString()}`);
    });
})().catch(console.error);
(function sendMessage() {
    return guildTests_awaiter(this, void 0, void 0, function* () {
        const guild = yield client.getGuild(TEST_GUILD);
        guild.sendMessage(TEST_CHANNEL, { content: "Hello World." });
        guild.sendMessage(TEST_CHANNEL, {
            content: "Hello, World!",
            tts: false,
            embeds: [
                {
                    title: "Hello, Embed!",
                    description: "This is an embedded message.",
                    image: {
                        url: 'https://media.discordapp.net/attachments/854033525546942464/1054264985037054042/Screenshot_2022-12-19-13-11-42-75_5c8300b655012b1930f2e0a7b81bf6a9.png',
                        width: 1440,
                        height: 665
                    }
                },
            ],
        });
    });
})().catch(console.error);

;// CONCATENATED MODULE: ./tests/src/index.ts


})();


//# sourceMappingURL=index.js.map