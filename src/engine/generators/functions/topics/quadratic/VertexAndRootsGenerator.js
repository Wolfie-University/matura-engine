const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const SVGUtils = require("../../../../utils/SVGUtils");

class VertexAndRootsGenerator extends BaseGenerator {
  generateVertexProblem() {
    const { a, b, c, p, q } = this.generateCoefficients();
    const formula = `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`;
    return this.createResponse({
      question:
        "Wyznacz współrzędne wierzchołka paraboli będącej wykresem funkcji:",
      latex: formula,
      image: SVGUtils.generateSVG({ a, b, c, p, q, highlight: "vertex" }),
      variables: { a, b, c, p, q },
      correctAnswer: `W(${p}, ${q})`,
      distractors: [`W(${-p}, ${q})`, `W(${q}, ${p})`, `W(${p}, ${c})`],
      steps: [`$$p = \\frac{-b}{2a} = ${p}$$`, `$$q = f(p) = ${q}$$`],
    });
  }

  generateRootsProblem() {
    const x1 = MathUtils.randomInt(-6, 6);
    let x2 = MathUtils.randomInt(-6, 6);
    while (x1 === x2) x2 = MathUtils.randomInt(-6, 6);
    const a = MathUtils.randomInt(-2, 2) || 1;
    const b = -a * (x1 + x2);
    const c = a * x1 * x2;
    const roots = [x1, x2].sort((n1, n2) => n1 - n2);
    const p = (x1 + x2) / 2;
    const q = a * p * p + b * p + c;

    return this.createResponse({
      question: "Wyznacz miejsca zerowe funkcji:",
      latex: `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`,
      image: SVGUtils.generateSVG({
        a,
        b,
        c,
        p,
        q,
        x1,
        x2,
        highlight: "roots",
      }),
      variables: { a, b, c, x1, x2 },
      correctAnswer: `x_1 = ${roots[0]}, x_2 = ${roots[1]}`,
      distractors: [
        `x_1 = ${-roots[0]}, x_2 = ${-roots[1]}`,
        `x_1 = ${roots[0]}, x_2 = ${-roots[1]}`,
        `x_1 = 0, x_2 = ${c}`,
      ],
      steps: [`$$\\Delta = ...$$`, `$$x_1, x_2$$`],
    });
  }

  generateCanonicalProblem() {
    const { a, b, c, p, q } = this.generateCoefficients();
    const pStr = p > 0 ? `(x - ${p})^2` : `(x + ${Math.abs(p)})^2`;
    const ans = `${a === 1 ? "" : a === -1 ? "-" : a}${p === 0 ? "x^2" : pStr} ${q > 0 ? `+ ${q}` : q < 0 ? `- ${Math.abs(q)}` : ""}`;
    return this.createResponse({
      question: "Postać kanoniczna:",
      latex: `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`,
      image: SVGUtils.generateSVG({ a, b, c, p, q, highlight: "vertex" }),
      variables: { a, b, c },
      correctAnswer: `f(x) = ${ans}`,
      distractors: [
        `f(x) = ${a}(x-${q})^2+${p}`,
        `f(x) = ${a}(x+${p})^2+${q}`,
        `f(x) = (x-${p})^2+${q}`,
      ],
      steps: [`$$p=${p}, q=${q}$$`, `$$f(x)=a(x-p)^2+q$$`],
    });
  }

  generateSymmetryAxisProblem() {
    const { a, b, c, p } = this.generateCoefficients();
    return this.createResponse({
      question: `Osią symetrii wykresu funkcji $$f(x) = ${MathUtils.formatPolynomial(a, b, c)}$$ jest prosta:`,
      latex: ``,
      image: SVGUtils.generateSVG({ a, b, c, p, q: 0, highlight: "axis" }),
      variables: { a, b, c, p },
      correctAnswer: `x = ${p}`,
      distractors: [`x = ${-p}`, `y = ${p}`, `x = ${b}`],
      steps: [`Oś symetrii: $$x = p = ${p}$$`],
    });
  }

  generateCoefficients() {
    const p = MathUtils.randomInt(-4, 4);
    const q = MathUtils.randomInt(-4, 4);
    const a = MathUtils.randomElement([-2, -1, 1, 2]);
    const b = -2 * a * p;
    const c = a * (p * p) + q;
    return { a, b, c, p, q };
  }
}

module.exports = VertexAndRootsGenerator;
