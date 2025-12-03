const BaseGenerator = require("../../../core/BaseGenerator");
const MathUtils = require("../../../utils/MathUtils");

class NumbersGenerator extends BaseGenerator {
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

  generatePercentRelations() {
    const scenarios = [
      { p: 25, b_frac: "0.8" },
      { p: 50, b_frac: "\\frac{2}{3}" },
      { p: 60, b_frac: "0.625" },
      { p: 100, b_frac: "0.5" },
      { p: 150, b_frac: "0.4" },
    ];
    const s = MathUtils.randomElement(scenarios);

    return this.createResponse({
      question: `Liczba $$x$$ jest o $$${s.p}\\%$$ większa od liczby $$y$$. Wynika stąd, że:`,
      latex: `x = y + ${s.p}\\%y`,
      image: null,
      variables: { p: s.p },
      correctAnswer: `y = ${s.b_frac}x`,
      distractors: [
        `y = ${1 + s.p / 100}x`,
        `y = ${1 - s.p / 100}x`,
        `y = ${s.p / 100}x`,
      ],
      steps: [
        `$$x = ${1 + s.p / 100}y$$`,
        `$$y = x : ${1 + s.p / 100} = ${s.b_frac}x$$`,
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

  generateGcdLcm() {
    const common = MathUtils.randomElement([2, 3, 4, 5, 6, 8, 10, 12]);
    const m1 = MathUtils.randomInt(1, 5);
    const m2 = MathUtils.randomInt(1, 5);
    const a = common * m1 * MathUtils.randomInt(1, 2);
    const b = common * m2 * MathUtils.randomInt(2, 3);
    const gcdVal = this.getGCD(a, b);
    const lcmVal = this.getLCM(a, b);
    const mode = MathUtils.randomElement(["gcd", "lcm"]);
    const symbol = mode === "gcd" ? "NWD" : "NWW";
    const result = mode === "gcd" ? gcdVal : lcmVal;

    return this.createResponse({
      question: `Oblicz $$${symbol}(${a}, ${b})$$.`,
      latex: `${symbol}(${a}, ${b})`,
      image: null,
      variables: { a, b, mode },
      correctAnswer: `${result}`,
      distractors: [
        `${mode === "gcd" ? lcmVal : gcdVal}`,
        `${mode === "gcd" ? 1 : a * b}`,
        `${mode === "gcd" ? Math.min(a, b) : Math.max(a, b)}`,
      ],
      steps: [
        `Rozkładamy na czynniki i stosujemy algorytm Euklidesa lub własność $$NWD \\cdot NWW = a \\cdot b$$.`,
      ],
    });
  }

  // Helpers
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
}

module.exports = NumbersGenerator;
