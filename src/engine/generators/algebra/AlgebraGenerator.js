const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

class AlgebraGenerator extends BaseGenerator {
  generate() {
    const variants = [
      // STARE (10)
      "power_simplify", // Potęgi: 2^3 * 4^-1...
      "log_formula", // Logarytmy: log 8 + log 2
      "short_mult_eval", // (sqrt(x) - a)^2
      "percent_calc", // Liczba a to p% liczby b
      "abs_value_inequality", // |x - a| < b (z osią liczbową!)
      "roots_simplify", // sqrt(50) - sqrt(8)
      "error_calc", // Błąd względny i bezwzględny
      "rational_simplify", // (x^2 - 4)/(x-2)
      "scientific_notation", // Notacja wykładnicza
      "interval_operations", // Suma/Iloczyn przedziałów (SVG)

      // NOWE (5)
      "algebraic_expansion", // Redukcja: (2a-3)^2 - (2a+3)^2
      "log_power_rule", // 2log 5 - log 4
      "exponent_root_conversion", // sqrt[3]{x^2} * x^(1/2)
      "percent_relations", // a jest o x% większa od b...
      "gcd_lcm", // NWD i NWW
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // STARE
      case "log_formula":
        return this.generateLogProblem();
      case "short_mult_eval":
        return this.generateShortMultProblem();
      case "percent_calc":
        return this.generatePercentProblem();
      case "abs_value_inequality":
        return this.generateAbsValueProblem();
      case "roots_simplify":
        return this.generateRootsProblem();
      case "error_calc":
        return this.generateErrorProblem();
      case "rational_simplify":
        return this.generateRationalProblem();
      case "scientific_notation":
        return this.generateScientificProblem();
      case "interval_operations":
        return this.generateIntervalOpsProblem();

      // NOWE
      case "algebraic_expansion":
        return this.generateAlgebraicExpansion();
      case "log_power_rule":
        return this.generateLogPowerRule();
      case "exponent_root_conversion":
        return this.generateExponentRootConversion();
      case "percent_relations":
        return this.generatePercentRelations();
      case "gcd_lcm":
        return this.generateGcdLcm();

      case "power_simplify":
      default:
        return this.generatePowerProblem();
    }
  }

  // =================================================================
  // NOWE METODY (V3)
  // =================================================================

  // --- NOWOŚĆ 11: REDUKCJA WYRAŻEŃ ALGEBRAICZNYCH ---
  generateAlgebraicExpansion() {
    // Typ: (ax - b)^2 - (ax + b)^2
    // To klasyk maturalny. Wynik: -4abx
    const a = MathUtils.randomInt(2, 5);
    const b = MathUtils.randomInt(2, 5);
    const variable = "x"; // lub 'a'

    const expr = `(${a}${variable} - ${b})^2 - (${a}${variable} + ${b})^2`;
    const resultVal = -4 * a * b;
    const correctAnswer = `${resultVal}${variable}`;

    // Obliczenia pośrednie
    const term1 = `(${a * a}${variable}^2 - ${2 * a * b}${variable} + ${b * b})`;
    const term2 = `(${a * a}${variable}^2 + ${2 * a * b}${variable} + ${b * b})`;

    return this.createResponse({
      question: `Dla każdej liczby rzeczywistej $$${variable}$$ wyrażenie $$${expr}$$ jest równe:`,
      latex: expr,
      image: null,
      variables: { a, b },
      correctAnswer: correctAnswer,
      distractors: [
        `0`,
        `${2 * b * b}`, // b^2 + b^2
        `${-2 * a * b}${variable}`, // błąd w dodawaniu
      ],
      steps: [
        `Stosujemy wzory skróconego mnożenia: $$(A-B)^2 = A^2 - 2AB + B^2$$ oraz $$(A+B)^2 = A^2 + 2AB + B^2$$.`,
        `Pierwszy nawias: $$(${a}${variable} - ${b})^2 = ${a * a}${variable}^2 - ${2 * a * b}${variable} + ${b * b}$$`,
        `Drugi nawias: $$(${a}${variable} + ${b})^2 = ${a * a}${variable}^2 + ${2 * a * b}${variable} + ${b * b}$$`,
        `Odejmujemy (pamiętając o zmianie znaków w drugim nawiasie):`,
        `$$(${a * a}${variable}^2 - ${2 * a * b}${variable} + ${b * b}) - (${a * a}${variable}^2 + ${2 * a * b}${variable} + ${b * b})$$`,
        `$$= ${a * a}${variable}^2 - ${2 * a * b}${variable} + ${b * b} - ${a * a}${variable}^2 - ${2 * a * b}${variable} - ${b * b}$$`,
        `Redukujemy wyrazy podobne: $$-${2 * a * b}${variable} - ${2 * a * b}${variable} = ${resultVal}${variable}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 12: LOGARYTMY Z POTĘGĄ ---
  generateLogPowerRule() {
    // k * log_a (x) - log_a (y) = log_a (x^k / y)
    // Wynik ma być całkowity, np. log_a (a^p) = p
    const base = MathUtils.randomElement([2, 3, 5]);
    const k = 2; // Najczęściej jest 2*log...
    const p = MathUtils.randomInt(1, 3); // Wynik końcowy

    // Argument x - mała liczba, np. 3, 4, 5, 10
    const x = MathUtils.randomElement([2, 3, 4, 5, 6, 10]);

    // y musi być takie, żeby x^k / y = base^p
    // y = x^k / base^p

    // Żeby y było całkowite, x^k musi być podzielne przez base^p.
    // To trudne losowo. Zróbmy Reverse:
    // Losujemy base, p (wynik), k.
    // Wyrażenie pod logarytmem końcowym: Total = base^p
    // Total = x^k / y  =>  y = x^k / Total.

    // Dobieramy x tak, żeby x^2 dzieliło się przez Total.
    // Np. base=3, p=2 (Total=9). k=2. x musi być wielokrotnością 3.
    const multiplier = MathUtils.randomInt(1, 4);
    const realX = multiplier * base; // np. 3, 6, 9...

    // x^2 = (mul*base)^2 = mul^2 * base^2
    // y = (mul^2 * base^2) / base^p.
    // Jeśli p=2, to y = mul^2.
    // Jeśli p=1, to y = mul^2 * base.

    // Generujemy zadanie: 2 log_base (realX) - log_base (y)
    const total = Math.pow(base, p);
    const y = Math.pow(realX, k) / total;

    return this.createResponse({
      question: "Wartość wyrażenia jest równa:",
      latex: `${k}\\log_{${base}} ${realX} - \\log_{${base}} ${y}`,
      image: null,
      variables: { base, k, realX, y, p },
      correctAnswer: `${p}`,
      distractors: [
        `${p + 1}`,
        `\\log_{${base}} ${realX * k - y}`,
        `${realX / y}`,
      ],
      steps: [
        `Korzystamy ze wzoru $$r \\log_a b = \\log_a b^r$$:`,
        `$$${k}\\log_{${base}} ${realX} = \\log_{${base}} ${realX}^${k} = \\log_{${base}} ${Math.pow(realX, k)}$$`,
        `Teraz odejmujemy logarytmy: $$\\log_a b - \\log_a c = \\log_a \\frac{b}{c}$$`,
        `$$\\log_{${base}} ${Math.pow(realX, k)} - \\log_{${base}} ${y} = \\log_{${base}} \\frac{${Math.pow(realX, k)}}{${y}} = \\log_{${base}} ${total}$$`,
        `$$${base}^x = ${total} \\implies x = ${p}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 13: PIERWIASTKI NA POTĘGI ---
  generateExponentRootConversion() {
    // sqrt[n]{a^m} * a^k = a^(m/n + k)
    // a^(frac)
    const a = MathUtils.randomElement([2, 3, 5, 7]);
    const n = MathUtils.randomInt(3, 5); // stopień pierwiastka
    const m = MathUtils.randomInt(2, 5); // potęga pod pierwiastkiem

    // Druga potęga: ułamek lub całkowita
    // a^(1/2) lub a^(-1)
    const k_num = 1;
    const k_den = 2; // klasyk sqrt(a)

    // Wynik wykładnika: m/n + 1/2 = (2m + n) / 2n
    const resNum = 2 * m + n;
    const resDen = 2 * n;

    // Skracanie ułamka wyniku
    const common = this.getGCD(resNum, resDen);
    const finalNum = resNum / common;
    const finalDen = resDen / common;

    return this.createResponse({
      question: `Liczbę $$\\sqrt[${n}]{${a}^${m}} \\cdot ${a}^{\\frac{1}{2}}$$ można zapisać w postaci:`,
      latex: ``,
      image: null,
      variables: { a, n, m },
      correctAnswer: `${a}^{\\frac{${finalNum}}{${finalDen}}}`,
      distractors: [
        `${a}^{\\frac{${m}}{${n + 2}}}`,
        `${a}^{\\frac{${resNum}}{${n}}}`,
        `${a}^{\\frac{${finalDen}}{${finalNum}}}`,
      ],
      steps: [
        `Zamieniamy pierwiastek na potęgę: $$\\sqrt[n]{a^m} = a^{\\frac{m}{n}}$$`,
        `$$\\sqrt[${n}]{${a}^${m}} = ${a}^{\\frac{${m}}{${n}}}$$`,
        `Mnożenie potęg o tej samej podstawie to dodawanie wykładników:`,
        `$$${a}^{\\frac{${m}}{${n}}} \\cdot ${a}^{\\frac{1}{2}} = ${a}^{\\frac{${m}}{${n}} + \\frac{1}{2}}$$`,
        `Sprowadzamy do wspólnego mianownika: $$\\frac{${m}}{${n}} + \\frac{1}{2} = \\frac{${2 * m}}{${2 * n}} + \\frac{${n}}{${2 * n}} = \\frac{${2 * m + n}}{${2 * n}}$$`,
        `$$= ${a}^{\\frac{${finalNum}}{${finalDen}}}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 14: RELACJE PROCENTOWE ---
  generatePercentRelations() {
    // a jest o p% większe od b. Zatem b to jaki ułamek a?
    // p = 25% -> a = 1.25b = 5/4 b -> b = 4/5 a = 0.8a
    // p = 60% -> a = 1.6b = 8/5 b -> b = 5/8 a = 0.625a

    const scenarios = [
      { p: 25, b_frac: "0.8" },
      { p: 50, b_frac: "\\frac{2}{3}" }, // 1.5b = 3/2b -> 2/3a
      { p: 60, b_frac: "0.625" },
      { p: 100, b_frac: "0.5" }, // 2b -> 0.5a
      { p: 150, b_frac: "0.4" }, // 2.5b = 5/2b -> 2/5a = 0.4a
    ];

    const s = MathUtils.randomElement(scenarios);

    return this.createResponse({
      question: `Liczba $$x$$ jest o $$${s.p}\\%$$ większa od liczby $$y$$. Wynika stąd, że:`,
      latex: `x = y + ${s.p}\\%y`,
      image: null,
      variables: { p: s.p },
      correctAnswer: `y = ${s.b_frac}x`,
      distractors: [
        `y = ${1 + s.p / 100}x`, // pomylone strony
        `y = ${1 - s.p / 100}x`, // o p% mniejsza
        `y = ${s.p / 100}x`,
      ],
      steps: [
        `Zapisujemy treść równaniem: $$x = y + ${s.p}\\%y = y + ${s.p / 100}y = ${1 + s.p / 100}y$$`,
        `$$x = ${1 + s.p / 100}y$$`,
        `Wyznaczamy $$y$$:`,
        `$$y = x : ${1 + s.p / 100} = \\frac{1}{${1 + s.p / 100}} x$$`,
        `Dla $$p=${s.p}$$, mnożnik to $$${s.b_frac}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 15: NWD i NWW (GCD / LCM) ---
  generateGcdLcm() {
    // NWD(a, b) lub NWW(a, b)
    // Liczby a i b powinny mieć wspólne dzielniki, żeby było ciekawie.

    const common = MathUtils.randomElement([2, 3, 4, 5, 6, 8, 10, 12]);
    const m1 = MathUtils.randomInt(1, 5);
    const m2 = MathUtils.randomInt(1, 5);
    // Upewniamy się, że m1 i m2 są względnie pierwsze, żeby common był faktycznym NWD
    // Ale dla uproszczenia: po prostu losujemy.

    const a = common * m1 * MathUtils.randomInt(1, 2);
    const b = common * m2 * MathUtils.randomInt(2, 3);

    // Obliczamy realne wartości
    const gcdVal = this.getGCD(a, b);
    const lcmVal = this.getLCM(a, b);

    const mode = MathUtils.randomElement(["gcd", "lcm"]);
    const symbol = mode === "gcd" ? "NWD" : "NWW";
    const result = mode === "gcd" ? gcdVal : lcmVal;

    return this.createResponse({
      question: `Najmniejsza wspólna wielokrotność (NWW) lub największy wspólny dzielnik (NWD). Oblicz $$${symbol}(${a}, ${b})$$.`,
      latex: `${symbol}(${a}, ${b})`,
      image: null,
      variables: { a, b, mode },
      correctAnswer: `${result}`,
      distractors: [
        `${mode === "gcd" ? lcmVal : gcdVal}`, // Odwrotność
        `${mode === "gcd" ? 1 : a * b}`,
        `${mode === "gcd" ? Math.min(a, b) : Math.max(a, b)}`,
      ],
      steps: [
        `Rozkładamy liczby na czynniki pierwsze (lub szukamy dzielników).`,
        `$$${a} = ${this.getPrimeFactors(a).join("\\cdot")}$$`,
        `$$${b} = ${this.getPrimeFactors(b).join("\\cdot")}$$`,
        mode === "gcd"
          ? `NWD to iloczyn wspólnych czynników: $$${result}$$`
          : `NWW to iloczyn wszystkich czynników w najwyższych potęgach: $$${result}$$`,
      ],
    });
  }

  // =================================================================
  // STARE METODY (V2) - ZACHOWANE I DZIAŁAJĄCE
  // =================================================================

  generatePowerProblem() {
    const base = MathUtils.randomElement([2, 3, 5]);
    const n = MathUtils.randomInt(-5, 5);
    const k = MathUtils.randomInt(-4, 4);
    const m = MathUtils.randomInt(-5, 5);
    const finalExp = n + 2 * k - m;
    const baseSq = base * base;

    return this.createResponse({
      question: "Liczba $$x$$ jest równa wartości wyrażenia. Wyznacz $$x$$.",
      latex: `x = \\frac{${base}^{${n}} \\cdot ${baseSq}^{${k}}}{${base}^{${m}}}`,
      image: null,
      variables: { base, n, k, m, finalExp },
      correctAnswer: `${base}^{${finalExp}}`,
      distractors: [
        `${base}^{${n + k - m}}`,
        `${base}^{${finalExp * -1}}`,
        `${baseSq}^{${finalExp}}`,
      ],
      steps: [
        `Sprowadzamy do podstawy $$${base}$$: $$${baseSq} = ${base}^2$$.`,
        `$$(${base}^2)^{${k}} = ${base}^{${2 * k}}$$`,
        `Licznik: $$${base}^{${n}} \\cdot ${base}^{${2 * k}} = ${base}^{${n + 2 * k}}$$`,
        `Całość: $$x = ${base}^{${n + 2 * k} - ${m}} = ${base}^{${finalExp}}$$`,
      ],
    });
  }

  generateLogProblem() {
    const base = MathUtils.randomElement([2, 3, 4, 5]);
    const result = MathUtils.randomInt(1, 2);
    const ratio = Math.pow(base, result);
    const Y = MathUtils.randomElement([2, 3, 4, 5]);
    const X = Y * ratio;

    return this.createResponse({
      question: "Wartość wyrażenia jest równa:",
      latex: `\\log_{${base}} ${X} - \\log_{${base}} ${Y}`,
      image: null,
      variables: { base, X, Y, result },
      correctAnswer: `${result}`,
      distractors: [`${result + 1}`, `\\log_{${base}} ${X + Y}`, `${X - Y}`],
      steps: [
        `$$\\log_a b - \\log_a c = \\log_a \\frac{b}{c}$$`,
        `$$\\log_{${base}} \\frac{${X}}{${Y}} = \\log_{${base}} ${X / Y} = ${result}$$`,
      ],
    });
  }

  generateShortMultProblem() {
    const a = MathUtils.randomElement([2, 3, 5, 7]);
    const b = MathUtils.randomInt(1, 5);
    const sign = MathUtils.randomElement(["-", "+"]);
    const constantPart = a + b * b;
    const rootPart = 2 * b;
    const answer = `${constantPart} ${sign} ${rootPart}\\sqrt{${a}}`;

    return this.createResponse({
      question: "Liczba jest równa:",
      latex: `(\\sqrt{${a}} ${sign} ${b})^2`,
      image: null,
      variables: { a, b, sign },
      correctAnswer: answer,
      distractors: [
        `${constantPart} ${sign === "-" ? "+" : "-"} ${rootPart}\\sqrt{${a}}`,
        `${constantPart}`,
        `${a - b * b}`,
      ],
      steps: [
        `$$(x ${sign} y)^2 = x^2 ${sign} 2xy + y^2$$`,
        `$$(\\sqrt{${a}})^2 ${sign} 2\\cdot\\sqrt{${a}}\\cdot${b} + ${b}^2 = ${a} ${sign} ${2 * b}\\sqrt{${a}} + ${b * b} = ${answer}$$`,
      ],
    });
  }

  generatePercentProblem() {
    const p = MathUtils.randomElement([10, 20, 25, 30, 40, 50]);
    const originalPrice = MathUtils.randomInt(2, 20) * 10;
    const finalPrice = originalPrice * (1 - p / 100);

    return this.createResponse({
      question: `Cena towaru została obniżona o $$${p}\\%$$. Po obniżce towar kosztuje $$${finalPrice}$$ zł. Cena początkowa wynosiła:`,
      latex: `p = ${p}\\%`,
      image: null,
      variables: { p, originalPrice, finalPrice },
      correctAnswer: `${originalPrice} zł`,
      distractors: [
        `${finalPrice * (1 + p / 100)} zł`,
        `${originalPrice - 10} zł`,
        `${finalPrice + p} zł`,
      ],
      steps: [
        `$$(100\\% - ${p}\\%)x = ${finalPrice} \\implies ${(100 - p) / 100}x = ${finalPrice} \\implies x = ${originalPrice}$$`,
      ],
    });
  }

  generateAbsValueProblem() {
    const a = MathUtils.randomInt(-5, 5);
    const b = MathUtils.randomInt(1, 6);
    const sign = MathUtils.randomElement(["<", ">", "\\le", "\\ge"]);
    const x1 = a - b;
    const x2 = a + b;
    const isInside = sign === "<" || sign === "\\le";
    const isClosed = sign === "\\le" || sign === "\\ge";
    const bL = isClosed ? "\\langle" : "(";
    const bR = isClosed ? "\\rangle" : ")";
    const interval = isInside
      ? `${bL} ${x1}, ${x2} ${bR}`
      : `(- \\infty, ${x1} ${bR} \\cup ${bL} ${x2}, \\infty)`;

    return this.createResponse({
      question:
        "Zbiór rozwiązań nierówności jest zaznaczony na osi liczbowej. Wybierz poprawny zbiór.",
      latex: `|x - (${a})| ${sign} ${b}`
        .replace("- (-", "+ ")
        .replace("- (", "- "),
      image: this.generateNumberLineSVG({
        center: a,
        points: [x1, x2],
        isInside,
        isClosed,
        type: "inequality",
      }),
      variables: { a, b, sign },
      correctAnswer: `x \\in ${interval}`,
      distractors: [
        isInside
          ? `x \\in (- \\infty, ${x1} ${bR} \\cup ${bL} ${x2}, \\infty)`
          : `x \\in ${bL} ${x1}, ${x2} ${bR}`,
        `x \\in ${bL} ${-b}, ${b} ${bR}`,
      ],
      steps: [
        `Środek $$${a}$$, promień $$${b}$$.`,
        `Odległość od $$${a}$$ ${isInside ? "mniejsza" : "większa"} niż $$${b}$$.`,
        `Odp: $$${interval}$$`,
      ],
    });
  }

  generateRootsProblem() {
    const root = MathUtils.randomElement([2, 3, 5, 6, 7]);
    const f1 = MathUtils.randomInt(2, 6);
    const f2 = MathUtils.randomInt(1, f1 - 1);
    const largeVal = f1 * f1 * root;
    const smallVal = f2 * f2 * root;
    const op = MathUtils.randomElement(["-", "+"]);
    const resultFactor = op === "-" ? f1 - f2 : f1 + f2;
    const latex = `\\sqrt{${largeVal}} ${op} \\sqrt{${smallVal}}`;
    const correctAnswer = `${resultFactor}\\sqrt{${root}}`;

    return this.createResponse({
      question: "Liczba jest równa:",
      latex: latex,
      image: null,
      variables: { root, f1, f2, largeVal, smallVal },
      correctAnswer: correctAnswer,
      distractors: [
        `\\sqrt{${op === "-" ? largeVal - smallVal : largeVal + smallVal}}`,
        `${resultFactor * root}`,
        `${op === "-" ? f1 + f2 : f1 - f2}\\sqrt{${root}}`,
      ],
      steps: [
        `$$\\sqrt{${largeVal}} = ${f1}\\sqrt{${root}}$$`,
        `$$\\sqrt{${smallVal}} = ${f2}\\sqrt{${root}}$$`,
        `Wynik: $$${correctAnswer}$$`,
      ],
    });
  }

  generateErrorProblem() {
    const errorPercent = MathUtils.randomElement([1, 2, 5, 10, 20, 25]);
    const x = MathUtils.randomElement([10, 20, 25, 40, 50, 80, 100]);
    const delta = x * (errorPercent / 100);
    const isExcess = MathUtils.randomElement([true, false]);
    const y = isExcess ? x + delta : x - delta;

    return this.createResponse({
      question: `Liczba $$y=${y}$$ jest przybliżeniem liczby $$x=${x}$$. Błąd względny wynosi:`,
      latex: `x=${x}, y=${y}`,
      image: null,
      variables: { x, y },
      correctAnswer: `${errorPercent}\\%`,
      distractors: [
        `${delta}\\%`,
        `${100 - errorPercent}\\%`,
        `${errorPercent / 10}\\%`,
      ],
      steps: [
        `Błąd bezwzględny: $$|x-y|=${delta}$$`,
        `Błąd względny: $$\\frac{${delta}}{${x}} = ${errorPercent}\\%$$`,
      ],
    });
  }

  generateRationalProblem() {
    const type = MathUtils.randomElement(["diff_squares", "perfect_square"]);
    const a = MathUtils.randomInt(2, 9);
    let nom, den, res;
    if (type === "diff_squares") {
      nom = `x^2 - ${a * a}`;
      den = `x - ${a}`;
      res = `x + ${a}`;
    } else {
      nom = `x^2 + ${2 * a}x + ${a * a}`;
      den = `x + ${a}`;
      res = `x + ${a}`;
    }

    return this.createResponse({
      question: `Wyrażenie $$${nom}$$ podzielone przez $$${den}$$ jest równe:`,
      latex: `\\frac{${nom}}{${den}}`,
      image: null,
      variables: { a, type },
      correctAnswer: res,
      distractors: [`x - ${a}`, `x^2 + ${a}`, `\\frac{1}{x - ${a}}`],
      steps: [
        `Rozkładamy licznik: ${type === "diff_squares" ? `(x-${a})(x+${a})` : `(x+${a})^2`}`,
        `Skracamy z mianownikiem. Odp: $$${res}$$`,
      ],
    });
  }

  generateScientificProblem() {
    const b_base = MathUtils.randomInt(2, 8);
    const multiplier = MathUtils.randomElement([2, 3, 4, 1.5, 2.5]);
    const a_base = b_base * multiplier;
    const k = MathUtils.randomInt(-10, 10);
    const m = MathUtils.randomInt(-10, 10);
    const mantissa = a_base / b_base;
    const exponent = k - m;
    let finalMantissa = mantissa;
    let finalExponent = exponent;
    if (finalMantissa >= 10) {
      finalMantissa /= 10;
      finalExponent += 1;
    } else if (finalMantissa < 1) {
      finalMantissa *= 10;
      finalExponent -= 1;
    }

    return this.createResponse({
      question: "Wartość wyrażenia jest równa:",
      latex: `\\frac{${a_base} \\cdot 10^{${k}}}{${b_base} \\cdot 10^{${m}}}`,
      image: null,
      variables: { a_base, b_base, k, m },
      correctAnswer: `${finalMantissa} \\cdot 10^{${finalExponent}}`,
      distractors: [
        `${finalMantissa} \\cdot 10^{${k - m}}`,
        `${mantissa * 10} \\cdot 10^{${exponent}}`,
        `${a_base - b_base} \\cdot 10^{${k - m}}`,
      ],
      steps: [
        `$$${a_base}:${b_base}=${mantissa}$$`,
        `$$10^{${k}}:10^{${m}}=10^{${k - m}}$$`,
        `Normalizacja: $$${finalMantissa} \\cdot 10^{${finalExponent}}$$`,
      ],
    });
  }

  generateIntervalOpsProblem() {
    const a = MathUtils.randomInt(-5, 2);
    const b = a + MathUtils.randomInt(-2, 4);
    const closedA = MathUtils.randomElement([true, false]);
    const closedB = MathUtils.randomElement([true, false]);
    const op = MathUtils.randomElement(["union", "intersection"]);
    const opSymbol = op === "union" ? "\\cup" : "\\cap";
    const bracketA = closedA ? "\\rangle" : ")";
    const bracketB = closedB ? "\\langle" : "(";

    let result = "";
    if (b > a) {
      if (op === "intersection") result = `\\emptyset`;
      else
        result = `(- \\infty, ${a} ${bracketA} \\cup ${bracketB} ${b}, \\infty)`;
    } else {
      if (op === "intersection") result = `${bracketB} ${b}, ${a} ${bracketA}`;
      else result = `\\mathbb{R}`;
    }

    return this.createResponse({
      question: `Wyznacz $$A ${opSymbol} B$$ dla przedziałów z rysunku.`,
      latex: `A ${opSymbol} B`,
      image: this.generateNumberLineSVG({
        type: "sets",
        a,
        b,
        closedA,
        closedB,
        op,
      }),
      variables: { a, b, op },
      correctAnswer: result,
      distractors: [
        `\\emptyset`,
        `\\mathbb{R}`,
        `(- \\infty, ${b} ${bracketB}`,
      ],
      steps: [
        `Zaznaczamy przedziały.`,
        b > a ? `Rozłączne.` : `Nachodzą na siebie.`,
        `Odp: $$${result}$$`,
      ],
    });
  }

  // --- HELPERY DLA ALGEBRY ---
  getGCD(a, b) {
    return b ? this.getGCD(b, a % b) : a;
  }
  getLCM(a, b) {
    return (a * b) / this.getGCD(a, b);
  }
  getPrimeFactors(n) {
    const factors = [];
    let d = 2;
    while (d * d <= n) {
      while (n % d === 0) {
        factors.push(d);
        n /= d;
      }
      d++;
    }
    if (n > 1) factors.push(n);
    return factors;
  }

  generateNumberLineSVG(params) {
    const size = 300;
    const midY = 50;
    const scale = 20;
    const center = params.center || 0;
    const toSVG = (val) => size / 2 + (val - center) * scale;
    let content = "";
    if (params.type === "inequality") {
      const p1 = toSVG(params.points[0]),
        p2 = toSVG(params.points[1]);
      const color = "blue";
      if (params.isInside)
        content += `<line x1="${p1}" y1="${midY}" x2="${p2}" y2="${midY}" stroke="${color}" stroke-width="4" />`;
      else
        content += `<line x1="0" y1="${midY}" x2="${p1}" y2="${midY}" stroke="${color}" stroke-width="4" /><line x1="${p2}" y1="${midY}" x2="${size}" y2="${midY}" stroke="${color}" stroke-width="4" />`;
      const fill = params.isClosed ? color : "white";
      content += `<circle cx="${p1}" cy="${midY}" r="5" fill="${fill}" stroke="${color}" stroke-width="2"/><circle cx="${p2}" cy="${midY}" r="5" fill="${fill}" stroke="${color}" stroke-width="2"/>`;
      content += `<text x="${p1 - 5}" y="${midY + 25}" font-size="14">${params.points[0]}</text><text x="${p2 - 5}" y="${midY + 25}" font-size="14">${params.points[1]}</text>`;
    } else if (params.type === "sets") {
      const { a, b, closedA, closedB } = params;
      const pA = toSVG(a),
        pB = toSVG(b);
      content += `<line x1="0" y1="${midY - 10}" x2="${pA}" y2="${midY - 10}" stroke="blue" stroke-width="3" />`;
      content += `<circle cx="${pA}" cy="${midY - 10}" r="4" fill="${closedA ? "blue" : "white"}" stroke="blue" stroke-width="2"/>`;
      content += `<text x="${pA - 5}" y="${midY - 25}" font-size="12" fill="blue">${a}</text>`;
      content += `<line x1="${pB}" y1="${midY + 10}" x2="${size}" y2="${midY + 10}" stroke="red" stroke-width="3" />`;
      content += `<circle cx="${pB}" cy="${midY + 10}" r="4" fill="${closedB ? "red" : "white"}" stroke="red" stroke-width="2"/>`;
      content += `<text x="${pB - 5}" y="${midY + 35}" font-size="12" fill="red">${b}</text>`;
    }
    return `<svg viewBox="0 0 ${size} 100" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
            <line x1="0" y1="${midY}" x2="${size}" y2="${midY}" stroke="#333" stroke-width="1" />
            <line x1="${size - 10}" y1="${midY - 5}" x2="${size}" y2="${midY}" stroke="#333" stroke-width="1" />
            <line x1="${size - 10}" y1="${midY + 5}" x2="${size}" y2="${midY}" stroke="#333" stroke-width="1" />
            ${content}
        </svg>`;
  }
}

module.exports = AlgebraGenerator;
