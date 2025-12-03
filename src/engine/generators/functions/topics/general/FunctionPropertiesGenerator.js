const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class FunctionPropertiesGenerator extends BaseGenerator {
  generatePointBelongsParam() {
    const type = MathUtils.randomElement(["rational", "quadratic"]);
    let formula, x0, m, stepsCalc;

    if (type === "rational") {
      const a = MathUtils.randomElement([-4, -2, 2, 3, 4, 6, 8]);
      const b = MathUtils.randomInt(-5, 5);
      const divisors = [1, -1];
      if (a % 2 === 0) divisors.push(2, -2);
      if (a % 3 === 0) divisors.push(3, -3);
      x0 = MathUtils.randomElement(divisors);
      m = a / x0 + b;
      formula = `f(x) = \\frac{${a}}{x} ${b >= 0 ? "+" : ""}${b === 0 ? "" : b}`;
      stepsCalc = `$$f(${x0}) = ${m}$$`;
    } else {
      const p = MathUtils.randomInt(-3, 3);
      const q = MathUtils.randomInt(-3, 3);
      x0 = MathUtils.randomInt(-5, 5);
      m = Math.pow(x0 - p, 2) + q;
      formula = `f(x) = (x ${p > 0 ? "-" : "+"} ${Math.abs(p)})^2 ${q >= 0 ? "+" : ""}${q}`;
      stepsCalc = `$$f(${x0}) = ${m}$$`;
    }

    return this.createResponse({
      question: `Punkt $$A = (${x0}, m)$$ należy do wykresu funkcji $$${formula}$$. Zatem:`,
      latex: `A = (${x0}, m)`,
      image: null,
      variables: { x0, m },
      correctAnswer: `m = ${m}`,
      distractors: [`m = ${m + 1}`, `m = ${-m}`, `m = 0`],
      steps: [
        `Podstawiamy $$x = ${x0}$$ i $$y = m$$.`,
        stepsCalc,
        `$$m = ${m}$$`,
      ],
    });
  }

  generateReadGraphProperties() {
    const points = [];
    let currX = -5;
    let currY = MathUtils.randomInt(-3, 3);
    points.push({ x: currX, y: currY });

    for (let i = 0; i < 4; i++) {
      currX += MathUtils.randomInt(2, 4);
      if (currX > 6) currX = 6;
      currY = MathUtils.randomInt(-4, 4);
      points.push({ x: currX, y: currY });
      if (currX === 6) break;
    }

    const ys = points.map((p) => p.y);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const range = `\\langle ${minY}, ${maxY} \\rangle`;

    return this.createResponse({
      question:
        "Na rysunku przedstawiono wykres funkcji $$y=f(x)$$. Zbiorem wartości tej funkcji jest:",
      latex: ``,
      image: this.generateSVG({ type: "polyline", points }),
      variables: { points, minY, maxY },
      correctAnswer: range,
      distractors: [
        `\\langle ${points[0].x}, ${points[points.length - 1].x} \\rangle`,
        `\\langle ${minY - 1}, ${maxY + 1} \\rangle`,
        `\\langle ${minY}, ${maxY})`,
      ],
      steps: [
        `Najmniejsza wartość: $$y_{min} = ${minY}$$`,
        `Największa wartość: $$y_{max} = ${maxY}$$`,
        `Zbiór wartości: $$${range}$$`,
      ],
    });
  }

  generateFunctionDomain() {
    const x1 = MathUtils.randomInt(-5, 5);
    let x2 = MathUtils.randomInt(-5, 5);
    while (x1 === x2) x2 = MathUtils.randomInt(-5, 5);
    const showPolynomial = MathUtils.randomElement([true, false]);
    let denominatorLatex;

    if (showPolynomial) {
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
        `\\{${Math.min(-x1, -x2)}, ${Math.max(-x1, -x2)}\\}`,
        `\\{${x1}\\}`,
        `\\mathbb{R}`,
      ],
      steps: [
        `Mianownik musi być różny od zera.`,
        `Miejsca zerowe mianownika: $$${x1}, ${x2}$$`,
      ],
    });
  }

  generateFunctionValue() {
    const a = MathUtils.randomInt(-3, 3);
    const c1 = MathUtils.randomInt(-3, 3) || 1;
    const c2 = MathUtils.randomInt(-5, 5);
    const c3 = MathUtils.randomInt(-5, 5);
    const formula = MathUtils.formatPolynomial(c1, c2, c3);
    const result = c1 * a * a + c2 * a + c3;

    return this.createResponse({
      question: `Dana jest funkcja $$f(x) = ${formula}$$. Wartość tej funkcji dla argumentu $$x=${a}$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { a, c1, c2, c3 },
      correctAnswer: `${result}`,
      distractors: [`${result + c1}`, `${-result}`, `${result - 10}`],
      steps: [`$$f(${a}) = ${result}$$`],
    });
  }

  generateSVG(params) {
    const size = 300;
    const center = size / 2;
    const scale = 20;
    let svg = `<line x1="0" y1="${center}" x2="${size}" y2="${center}" stroke="#333" stroke-width="1" /><line x1="${center}" y1="0" x2="${center}" y2="${size}" stroke="#333" stroke-width="1" /><text x="${size - 15}" y="${center + 15}">x</text><text x="${center + 10}" y="15">y</text>`;
    if (params.type === "polyline") {
      let pts = "";
      params.points.forEach((p) => {
        const sx = center + p.x * scale;
        const sy = center - p.y * scale;
        pts += `${sx},${sy} `;
        svg += `<circle cx="${sx}" cy="${sy}" r="3" fill="blue" />`;
      });
      svg += `<polyline points="${pts}" fill="none" stroke="blue" stroke-width="2" />`;
    }
    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">${svg}</svg>`;
  }
}

module.exports = FunctionPropertiesGenerator;
