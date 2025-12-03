const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

class AlgebraGenerator extends BaseGenerator {
  generate() {
    const variants = [
      "power_simplify", // Potęgi: 2^3 * 4^-1...
      "log_formula", // Logarytmy: log 8 + log 2
      "short_mult_eval", // (sqrt(x) - a)^2
      "percent_calc", // Liczba a to p% liczby b
      "abs_value_inequality", // |x - a| < b (z osią liczbową!)
      "roots_simplify", // NOWOŚĆ: sqrt(50) - sqrt(8)
      "error_calc", // NOWOŚĆ: Błąd względny i bezwzględny
      "rational_simplify", // NOWOŚĆ: (x^2 - 4)/(x-2)
      "scientific_notation", // NOWOŚĆ: Notacja wykładnicza
      "interval_operations", // NOWOŚĆ: Suma/Iloczyn przedziałów (SVG)
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
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
      case "power_simplify":
      default:
        return this.generatePowerProblem();
    }
  }

  // --- 1. POTĘGI (Bez zmian) ---
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

  // --- 2. LOGARYTMY (Bez zmian) ---
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

  // --- 3. WZORY SKRÓCONEGO MNOŻENIA (Bez zmian) ---
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

  // --- 4. PROCENTY (Bez zmian) ---
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

  // --- 5. NIERÓWNOŚĆ Z WARTOŚCIĄ BEZWZGLĘDNĄ (Bez zmian) ---
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

  // --- NOWOŚĆ 6: DZIAŁANIA NA PIERWIASTKACH ---
  generateRootsProblem() {
    // Typ: sqrt(large) - k*sqrt(small) = result*sqrt(small)
    // Np. sqrt(50) - sqrt(8) = 5sqrt(2) - 2sqrt(2) = 3sqrt(2)

    const root = MathUtils.randomElement([2, 3, 5, 6, 7]); // Podstawa pierwiastka (niewymierna)
    const f1 = MathUtils.randomInt(2, 6); // czynnik pierwszy (np. 5)
    const f2 = MathUtils.randomInt(1, f1 - 1); // czynnik drugi (mniejszy, np. 2)

    const largeVal = f1 * f1 * root; // np. 25*2 = 50
    const smallVal = f2 * f2 * root; // np. 4*2 = 8

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
        `\\sqrt{${op === "-" ? largeVal - smallVal : largeVal + smallVal}}`, // Błąd: działania pod pierwiastkiem
        `${resultFactor * root}`, // Brak pierwiastka w wyniku
        `${op === "-" ? f1 + f2 : f1 - f2}\\sqrt{${root}}`, // Zły znak
      ],
      steps: [
        `Wyłączamy czynnik przed znak pierwiastka:`,
        `$$\\sqrt{${largeVal}} = \\sqrt{${f1 * f1} \\cdot ${root}} = ${f1}\\sqrt{${root}}$$`,
        `$$\\sqrt{${smallVal}} = \\sqrt{${f2 * f2} \\cdot ${root}} = ${f2}\\sqrt{${root}}$$`,
        `Wykonujemy działanie:`,
        `$$${f1}\\sqrt{${root}} ${op} ${f2}\\sqrt{${root}} = (${f1} ${op} ${f2})\\sqrt{${root}} = ${correctAnswer}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 7: BŁĄD WZGLĘDNY I BEZWZGLĘDNY ---
  generateErrorProblem() {
    // Liczba x = ... przybliżenie y = ...
    // Błąd względny = |x-y|/x

    // Generujemy "ładny" ułamek błędu, np. 1/20 (5%)
    const errorPercent = MathUtils.randomElement([1, 2, 5, 10, 20, 25]); // w procentach
    const exact = MathUtils.randomInt(20, 200); // Dokładna wartość

    // Przybliżenie (z nadmiarem lub niedomiarem)
    // error = |x-y|/x  => |x-y| = x * error
    // Musimy dobrać tak, żeby x * error było całkowite (dla prostoty) lub prostym ułamkiem

    // Zmieńmy strategię: Losujemy dokładną i przybliżoną tak, żeby błąd był prosty.
    // Np. x=20, y=21. Błąd bezwzgl = 1. Błąd wzgl = 1/20 = 5%.

    const x = MathUtils.randomElement([10, 20, 25, 40, 50, 80, 100]);
    const delta = x * (errorPercent / 100); // To będzie błąd bezwzględny

    // Losujemy czy nadmiar czy niedomiar
    const isExcess = MathUtils.randomElement([true, false]);
    const y = isExcess ? x + delta : x - delta;

    const absError = delta;
    const relErrorStr = `${errorPercent}\\%`; // np. 5%

    return this.createResponse({
      question: `Liczba $$y=${y}$$ jest przybliżeniem liczby $$x=${x}$$ z ${isExcess ? "nadmiarem" : "niedomiarem"}. Błąd względny tego przybliżenia jest równy:`,
      latex: `x=${x}, y=${y}`,
      image: null,
      variables: { x, y, absError, errorPercent },
      correctAnswer: relErrorStr,
      distractors: [
        `${absError}\\%`, // Błąd bezwzględny jako procent
        `${100 - errorPercent}\\%`,
        `${errorPercent / 10}\\%`,
      ],
      steps: [
        `Błąd bezwzględny: $$\\Delta x = |x - y| = |${x} - ${y}| = |- ${isExcess ? delta : -delta}| = ${absError}$$`,
        `Błąd względny: $$\\delta = \\frac{\\Delta x}{|x|} = \\frac{${absError}}{${x}}$$`,
        `Zamieniamy na procenty: $$\\frac{${absError}}{${x}} \\cdot 100\\% = ${errorPercent}\\%$$`,
      ],
    });
  }

  // --- NOWOŚĆ 8: WYRAŻENIA WYMIERNE (SKRACANIE) ---
  generateRationalProblem() {
    // (x^2 - a^2) / (x - a)  = x + a
    // Lub (x^2 + 2ax + a^2) / (x + a) = x + a

    const type = MathUtils.randomElement(["diff_squares", "perfect_square"]);
    const a = MathUtils.randomInt(2, 9);

    let nominator, denominator, result;

    if (type === "diff_squares") {
      nominator = `x^2 - ${a * a}`;
      denominator = `x - ${a}`;
      result = `x + ${a}`;
    } else {
      // (x+a)^2 / (x+a)
      nominator = `x^2 + ${2 * a}x + ${a * a}`;
      denominator = `x + ${a}`;
      result = `x + ${a}`;
    }

    return this.createResponse({
      question: `Wyrażenie wymierne jest określone dla $$x \\neq ${type === "diff_squares" ? a : -a}$$. Po uproszczeniu jest ono równe:`,
      latex: `\\frac{${nominator}}{${denominator}}`,
      image: null,
      variables: { a, type },
      correctAnswer: result,
      distractors: [`x - ${a}`, `x^2 + ${a}`, `\\frac{1}{x - ${a}}`],
      steps: [
        type === "diff_squares"
          ? `Licznik to różnica kwadratów: $$x^2 - ${a * a} = (x-${a})(x+${a})$$`
          : `Licznik to kwadrat sumy: $$x^2 + ${2 * a}x + ${a * a} = (x+${a})^2$$`,
        `Mianownik: $$${denominator}$$`,
        `Po skróceniu przez $$(${denominator})$$ otrzymujemy: $$${result}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 9: NOTACJA WYKŁADNICZA ---
  generateScientificProblem() {
    // (a * 10^k) / (b * 10^m)
    // Dobieramy a i b tak, żeby a/b było ładne (np. 2.4 / 0.6 = 4)

    const b_base = MathUtils.randomInt(2, 8); // np. 4
    const multiplier = MathUtils.randomElement([2, 3, 4, 1.5, 2.5]);
    const a_base = b_base * multiplier; // np. 4 * 1.5 = 6

    const k = MathUtils.randomInt(-10, 10);
    const m = MathUtils.randomInt(-10, 10);

    // Zapiszmy to jako np. 6.0 * 10^k / 4.0 * 10^m
    // Żeby było trudniej: 60 * 10^k-1

    const qL = `\\frac{${a_base} \\cdot 10^{${k}}}{${b_base} \\cdot 10^{${m}}}`;

    const mantissa = a_base / b_base;
    const exponent = k - m;

    // Formatowanie wyniku do notacji naukowej (mantysa 1-10)
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
      latex: qL,
      image: null,
      variables: { a_base, b_base, k, m },
      correctAnswer: `${finalMantissa} \\cdot 10^{${finalExponent}}`,
      distractors: [
        `${finalMantissa} \\cdot 10^{${k - m}}`, // Błąd normalizacji
        `${mantissa * 10} \\cdot 10^{${exponent}}`,
        `${a_base - b_base} \\cdot 10^{${k - m}}`,
      ],
      steps: [
        `Dzielimy liczby: $$${a_base} : ${b_base} = ${mantissa}$$`,
        `Dzielimy potęgi: $$10^{${k}} : 10^{${m}} = 10^{${k}-(${m})} = 10^{${k - m}}$$`,
        `Otrzymujemy: $$${mantissa} \\cdot 10^{${exponent}}$$`,
        mantissa !== finalMantissa
          ? `Zamieniamy na notację naukową (mantysa $$1 \\le a < 10$$): $$${finalMantissa} \\cdot 10^{${finalExponent}}$$`
          : `Liczba jest już w notacji naukowej.`,
      ],
    });
  }

  // --- NOWOŚĆ 10: PRZEDZIAŁY (SUMA/ILOCZYN) ---
  generateIntervalOpsProblem() {
    // Dane są przedziały A=(-inf, a> i B=<b, inf). Wyznacz A u B lub A n B.
    // SVG Visualization included!

    const a = MathUtils.randomInt(-5, 2);
    const b = a + MathUtils.randomInt(-2, 4); // b może być mniejsze, równe lub większe od a

    // Typy:
    // A: (-inf, a) lub (-inf, a>
    // B: (b, inf) lub <b, inf)
    const closedA = MathUtils.randomElement([true, false]);
    const closedB = MathUtils.randomElement([true, false]);

    const op = MathUtils.randomElement(["union", "intersection"]); // Suma lub część wspólna
    const opSymbol = op === "union" ? "\\cup" : "\\cap";

    const bracketA = closedA ? "\\rangle" : ")";
    const bracketB = closedB ? "\\langle" : "(";

    const setA = `(- \\infty, ${a} ${bracketA}`;
    const setB = `${bracketB} ${b}, \\infty)`;

    // Logika wyniku
    let result = "";

    // Sytuacje:
    // 1. b > a (Rozłączne) -> A n B = pusty, A u B = suma dwóch
    // 2. b <= a (Nachodzą na siebie) -> A n B = <b, a>, A u B = R

    if (b > a) {
      if (op === "intersection") result = `\\emptyset`;
      else result = `${setA} \\cup ${setB}`;
    } else {
      // Nachodzą na siebie
      if (op === "intersection") {
        // Część wspólna to od b do a. Nawiasy zależą od domknięcia.
        // Uwaga: jeśli a=b, to zależy czy oba domknięte.
        if (a === b && (!closedA || !closedB)) result = `\\emptyset`;
        else if (a === b && closedA && closedB) result = `\\{ ${a} \\}`;
        else result = `${bracketB} ${b}, ${a} ${bracketA}`;
      } else {
        // Suma to R
        result = `\\mathbb{R}`;
      }
    }

    return this.createResponse({
      question: `Dane są przedziały $$A=${setA}$$ oraz $$B=${setB}$$. Wyznacz $$A ${opSymbol} B$$.`,
      latex: `A ${opSymbol} B = ?`,
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
        op === "union"
          ? b > a
            ? `\\mathbb{R}`
            : `\\emptyset`
          : b > a
            ? `\\langle ${a}, ${b} \\rangle`
            : `\\emptyset`,
        `${bracketB} ${Math.min(a, b)}, ${Math.max(a, b)} ${bracketA}`,
      ],
      steps: [
        `Zaznaczamy oba przedziały na osi liczbowej (zobacz rysunek).`,
        `Przedział A (lewy) kończy się w $$${a}$$.`,
        `Przedział B (prawy) zaczyna się w $$${b}$$.`,
        b > a
          ? `Przedziały są rozłączne (nie mają części wspólnej).`
          : `Przedziały zachodzą na siebie (ich suma daje całą oś, a część wspólna to środek).`,
        op === "union"
          ? `Szukamy sumy (wszystkiego co zaznaczone). Odp: $$${result}$$`
          : `Szukamy części wspólnej (tam gdzie kolory się pokrywają). Odp: $$${result}$$`,
      ],
    });
  }

  generateNumberLineSVG(params) {
    const size = 300;
    const midY = 50;
    const scale = 20;
    const center = params.center || 0;
    const toSVG = (val) => size / 2 + (val - center) * scale;

    let content = "";

    if (params.type === "inequality") {
      // ... (Kod z poprzedniej wersji dla inequalities) ...
      const p1 = toSVG(params.points[0]);
      const p2 = toSVG(params.points[1]);
      const color = "blue";
      if (params.isInside) {
        content += `<line x1="${p1}" y1="${midY}" x2="${p2}" y2="${midY}" stroke="${color}" stroke-width="4" />`;
      } else {
        content += `<line x1="0" y1="${midY}" x2="${p1}" y2="${midY}" stroke="${color}" stroke-width="4" /><line x1="${p2}" y1="${midY}" x2="${size}" y2="${midY}" stroke="${color}" stroke-width="4" />`;
      }
      const fill = params.isClosed ? color : "white";
      content += `<circle cx="${p1}" cy="${midY}" r="5" fill="${fill}" stroke="${color}" stroke-width="2"/><circle cx="${p2}" cy="${midY}" r="5" fill="${fill}" stroke="${color}" stroke-width="2"/>`;
      content += `<text x="${p1 - 5}" y="${midY + 25}" font-size="14">${params.points[0]}</text><text x="${p2 - 5}" y="${midY + 25}" font-size="14">${params.points[1]}</text>`;
    } else if (params.type === "sets") {
      const { a, b, closedA, closedB } = params;
      // Rysujemy A (niebieski) i B (czerwony) z przesunięciem Y, żeby było widać

      const pA = toSVG(a);
      const pB = toSVG(b);

      // Set A: (-inf, a)
      content += `<line x1="0" y1="${midY - 10}" x2="${pA}" y2="${midY - 10}" stroke="blue" stroke-width="3" />`;
      content += `<circle cx="${pA}" cy="${midY - 10}" r="4" fill="${closedA ? "blue" : "white"}" stroke="blue" stroke-width="2"/>`;
      content += `<text x="${pA - 5}" y="${midY - 25}" font-size="12" fill="blue">${a}</text>`;

      // Set B: (b, inf)
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
