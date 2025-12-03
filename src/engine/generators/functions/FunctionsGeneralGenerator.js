const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

class FunctionsGeneralGenerator extends BaseGenerator {
  generate() {
    const variants = [
      "linear_properties", // Monotoniczność, miejsce zerowe f. liniowej
      "function_shift", // Przesunięcie o wektor [p, q]
      "function_domain", // Dziedzina f. wymiernej
      "function_value", // Wartość funkcji dla argumentu x
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      case "function_shift":
        return this.generateFunctionShift();
      case "function_domain":
        return this.generateFunctionDomain();
      case "function_value":
        return this.generateFunctionValue();
      case "linear_properties":
      default:
        return this.generateLinearProperties();
    }
  }

  // --- WARIANT 1: WŁASNOŚCI FUNKCJI LINIOWEJ ---
  generateLinearProperties() {
    // f(x) = ax + b
    // Pytanie: Funkcja jest rosnąca/malejąca i przecina oś OY w punkcie...
    const a = MathUtils.randomInt(-5, 5) || 1;
    const b = MathUtils.randomInt(-5, 5);

    const formula = `f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}x ${b >= 0 ? "+" : ""}${b}`;

    const monotonicity = a > 0 ? "rosnąca" : a < 0 ? "malejąca" : "stała";
    const intercept = `(0, ${b})`;

    return this.createResponse({
      question: `Dana jest funkcja liniowa określona wzorem $$${formula}$$. Funkcja ta jest:`,
      latex: formula,
      image: this.generateSVG({ type: "linear", a, b }),
      variables: { a, b },
      correctAnswer: `${monotonicity} i jej wykres przecina oś $$Oy$$ w punkcie $$${intercept}$$`,
      distractors: [
        `${monotonicity} i jej wykres przecina oś $$Oy$$ w punkcie $$(0, ${-b})$$`, // Zły punkt
        `${a > 0 ? "malejąca" : "rosnąca"} i jej wykres przecina oś $$Oy$$ w punkcie $$${intercept}$$`, // Zła monotoniczność
        `${a > 0 ? "malejąca" : "rosnąca"} i jej wykres przecina oś $$Oy$$ w punkcie $$(${b}, 0)$$`, // Punkt na OX zamiast OY
      ],
      steps: [
        `Współczynnik kierunkowy $$a = ${a}$$. Ponieważ $$a ${a > 0 ? ">" : "<"} 0$$, funkcja jest ${monotonicity}.`,
        `Wyraz wolny $$b = ${b}$$. Wykres przecina oś $$Oy$$ w punkcie $$(0, b) = (0, ${b})$$.`,
      ],
    });
  }

  // --- WARIANT 2: PRZESUNIĘCIE WYKRESU (WEKTOR) ---
  generateFunctionShift() {
    // f(x) = ... przesuwamy o wektor v=[p, q] -> g(x) = f(x-p) + q
    const p = MathUtils.randomInt(-4, 4);
    const q = MathUtils.randomInt(-4, 4);

    // Bazowa funkcja (symboliczna, np. x^2 lub a^x)
    const type = MathUtils.randomElement(["quadratic", "exponential"]);
    let baseFuncLatex, shiftedFuncLatex, dist1, dist2;

    if (type === "quadratic") {
      baseFuncLatex = "f(x) = x^2";
      // g(x) = (x-p)^2 + q
      const inside =
        p === 0 ? "x" : p > 0 ? `(x - ${p})` : `(x + ${Math.abs(p)})`;
      shiftedFuncLatex = `${inside}^2 ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;

      // Dystraktory (złe znaki)
      const wrongP =
        p === 0 ? "x" : p > 0 ? `(x + ${p})` : `(x - ${Math.abs(p)})`;
      dist1 = `${wrongP}^2 ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;
      dist2 = `${inside}^2 ${q === 0 ? "" : q > 0 ? `- ${q}` : `+ ${Math.abs(q)}`}`;
    } else {
      const base = MathUtils.randomElement([2, 3]);
      baseFuncLatex = `f(x) = ${base}^x`;
      // g(x) = base^(x-p) + q
      const exponent =
        p === 0 ? "x" : p > 0 ? `x - ${p}` : `x + ${Math.abs(p)}`;
      shiftedFuncLatex = `${base}^{${exponent}} ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;

      const wrongExp =
        p === 0 ? "x" : p > 0 ? `x + ${p}` : `x - ${Math.abs(p)}`;
      dist1 = `${base}^{${wrongExp}} ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;
      dist2 = `${base}^{${exponent}} ${q === 0 ? "" : q > 0 ? `- ${q}` : `+ ${Math.abs(q)}`}`;
    }

    return this.createResponse({
      question: `Wykres funkcji $$g$$ powstał przez przesunięcie wykresu funkcji $$${baseFuncLatex}$$ o wektor $$v=[${p}, ${q}]$$. Wzór funkcji $$g$$ to:`,
      latex: `v=[${p}, ${q}]`,
      image: null,
      variables: { p, q, type },
      correctAnswer: `g(x) = ${shiftedFuncLatex}`,
      distractors: [
        `g(x) = ${dist1}`,
        `g(x) = ${dist2}`,
        `g(x) = ${shiftedFuncLatex.replace(q, -q).replace(p, -p)}`, // Wszystko na odwrót
      ],
      steps: [
        `Przesunięcie o wektor $$[p, q]$$ zmienia wzór funkcji $$f(x)$$ na $$g(x) = f(x-p) + q$$.`,
        `Mamy $$p=${p}$$ oraz $$q=${q}$$.`,
        `Wstawiamy do wzoru: zmieniamy $$x$$ na $$(x - ${p < 0 ? `(${p})` : p})$$ i dodajemy $$${q}$$ na końcu.`,
        `Otrzymujemy: $$g(x) = ${shiftedFuncLatex}$$`,
      ],
    });
  }

  // --- WARIANT 3: DZIEDZINA FUNKCJI ---
  generateFunctionDomain() {
    // f(x) = ... / (x-a)(x-b)
    const x1 = MathUtils.randomInt(-5, 5);
    let x2 = MathUtils.randomInt(-5, 5);
    while (x1 === x2) x2 = MathUtils.randomInt(-5, 5);

    // Mianownik w postaci iloczynowej lub ogólnej (x^2 + bx + c)
    const showPolynomial = MathUtils.randomElement([true, false]);

    let denominatorLatex;
    if (showPolynomial) {
      // (x-x1)(x-x2) = x^2 - (x1+x2)x + x1*x2
      const b = -(x1 + x2);
      const c = x1 * x2;
      denominatorLatex = MathUtils.formatPolynomial(1, b, c);
    } else {
      const p1 = x1 > 0 ? `(x-${x1})` : `(x+${Math.abs(x1)})`;
      const p2 = x2 > 0 ? `(x-${x2})` : `(x+${Math.abs(x2)})`;
      denominatorLatex = `${p1}${p2}`;
    }

    return this.createResponse({
      question:
        "Dziedziną funkcji $$f$$ określonej wzorem jest zbiór liczb rzeczywistych z wyłączeniem liczb:",
      latex: `f(x) = \\frac{2x+1}{${denominatorLatex}}`,
      image: null,
      variables: { x1, x2 },
      correctAnswer: `\\{${Math.min(x1, x2)}, ${Math.max(x1, x2)}\\}`,
      distractors: [
        `\\{${Math.min(-x1, -x2)}, ${Math.max(-x1, -x2)}\\}`, // Przeciwne znaki
        `\\{${x1}\\}`, // Tylko jedno
        `\\mathbb{R}`,
      ],
      steps: [
        `Dziedzina funkcji wymiernej wyklucza miejsca zerowe mianownika.`,
        `Rozwiązujemy równanie: $$${denominatorLatex} = 0$$`,
        `Rozwiązania to $$x = ${x1}$$ oraz $$x = ${x2}$$.`,
        `Te liczby musimy wyrzucić ze zbioru liczb rzeczywistych.`,
      ],
    });
  }

  // --- WARIANT 4: WARTOŚĆ FUNKCJI ---
  generateFunctionValue() {
    // Oblicz f(a) dla f(x) = -2x^2 + 3x - 1
    const a = MathUtils.randomInt(-3, 3);
    const c1 = MathUtils.randomInt(-3, 3) || 1; // coeff x^2
    const c2 = MathUtils.randomInt(-5, 5); // coeff x
    const c3 = MathUtils.randomInt(-5, 5); // const

    const formula = MathUtils.formatPolynomial(c1, c2, c3);
    const result = c1 * a * a + c2 * a + c3;

    return this.createResponse({
      question: `Dana jest funkcja $$f(x) = ${formula}$$. Wartość tej funkcji dla argumentu $$x=${a}$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { a, c1, c2, c3 },
      correctAnswer: `${result}`,
      distractors: [`${result + c1}`, `${-result}`, `${result - 10}`],
      steps: [
        `Podstawiamy $$x = ${a}$$ do wzoru funkcji.`,
        `$$f(${a}) = ${c1}\\cdot(${a})^2 ${c2 >= 0 ? "+" : ""}${c2}\\cdot(${a}) ${c3 >= 0 ? "+" : ""}${c3}$$`,
        `$$f(${a}) = ${c1}\\cdot${a * a} ${c2 * a >= 0 ? "+" : ""}${c2 * a} ${c3 >= 0 ? "+" : ""}${c3}$$`,
        `$$f(${a}) = ${result}$$`,
      ],
    });
  }

  // --- SVG ---
  generateSVG(params) {
    if (params.type === "linear") {
      const size = 300;
      const center = size / 2;
      const scale = 20;
      // Rysujemy osie
      let svg = `<line x1="0" y1="${center}" x2="${size}" y2="${center}" stroke="#aaa" stroke-width="1" />`;
      svg += `<line x1="${center}" y1="0" x2="${center}" y2="${size}" stroke="#aaa" stroke-width="1" />`;

      // Rysujemy linię y = ax + b
      // Punkty krawędziowe: x = -7, x = 7
      const x1 = -8;
      const y1 = params.a * x1 + params.b;
      const x2 = 8;
      const y2 = params.a * x2 + params.b;

      const toSVG = (x, y) => ({
        x: center + x * scale,
        y: center - y * scale,
      });
      const p1 = toSVG(x1, y1);
      const p2 = toSVG(x2, y2);

      svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="blue" stroke-width="2" />`;

      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">${svg}</svg>`;
    }
    return null;
  }
}

module.exports = FunctionsGeneralGenerator;
