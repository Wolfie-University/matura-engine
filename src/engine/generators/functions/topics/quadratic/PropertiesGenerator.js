const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const SVGUtils = require("../../../../utils/SVGUtils");

class PropertiesGenerator extends BaseGenerator {
  generateValueRangeProblem() {
    const { a, b, c, p, q } = this.generateCoefficients();
    const range =
      a > 0 ? `\\langle ${q}, \\infty )` : `( -\\infty, ${q} \\rangle`;
    return this.createResponse({
      question: "Wyznacz zbiór wartości funkcji:",
      latex: `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`,
      image: SVGUtils.generateSVG({ a, b, c, p, q, highlight: "vertex" }),
      variables: { a, b, c, p, q },
      correctAnswer: range,
      distractors: [
        a > 0 ? `( -\\infty, ${q} \\rangle` : `\\langle ${q}, \\infty )`,
        `\\langle ${p}, \\infty )`,
        `\\mathbb{R}`,
      ],
      steps: [
        `Wierzchołek $$q=${q}$$`,
        `Ramiona ${a > 0 ? "w górę" : "w dół"}`,
      ],
    });
  }

  generateMonotonicityProblem() {
    const { a, b, c, p, q } = this.generateCoefficients();
    const type = MathUtils.randomElement(["rosnąca", "malejąca"]);
    let interval;
    if ((a > 0 && type === "rosnąca") || (a < 0 && type === "malejąca")) {
      interval = `\\langle ${p}, \\infty )`;
    } else {
      interval = `( -\\infty, ${p} \\rangle`;
    }

    return this.createResponse({
      question: `Funkcja kwadratowa $$f(x) = ${MathUtils.formatPolynomial(a, b, c)}$$ jest ${type} w przedziale:`,
      latex: ``,
      image: SVGUtils.generateSVG({ a, b, c, p, q, highlight: "vertex" }),
      variables: { a, p, type },
      correctAnswer: interval,
      distractors: [
        interval.includes("infty") && interval.includes("-")
          ? interval.replace("-", "")
          : `( -\\infty, ${p} \\rangle`,
        `\\langle ${q}, \\infty )`,
        `( -\\infty, ${q} \\rangle`,
      ],
      steps: [`$$p=${p}$$. Ramiona ${a > 0 ? "góra" : "dół"}.`],
    });
  }

  generateMinMaxIntervalProblem() {
    const { a, b, c, p, q } = this.generateCoefficients();
    const isPInside = MathUtils.randomElement([true, false]);
    let start, end;
    if (isPInside) {
      start = p - 1;
      end = p + 1;
    } else {
      start = p + 1;
      end = p + 3;
    }

    const f_start = a * start * start + b * start + c;
    const f_end = a * end * end + b * end + c;
    const f_p = q;

    const type = MathUtils.randomElement(["najmniejszą", "największą"]);
    const values = [f_start, f_end];
    if (start <= p && p <= end) values.push(f_p);

    const ans =
      type === "najmniejszą" ? Math.min(...values) : Math.max(...values);

    return this.createResponse({
      question: `Największą i najmniejszą wartość funkcji w przedziale $$\\langle ${start}, ${end} \\rangle$$ są odpowiednio liczby... Wskaż ${type}.`,
      latex: `f(x) = ${MathUtils.formatPolynomial(a, b, c)}`,
      image: null,
      variables: { ans },
      correctAnswer: `${ans}`,
      distractors: [`${f_start}`, `${f_end}`, `${q}`],
      steps: [
        `$$p=${p}$$ ${isPInside ? "należy" : "nie należy"} do przedziału.`,
      ],
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

module.exports = PropertiesGenerator;
