const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const AnalyticSVGUtils = require("./AnalyticSVGUtils");

class LinesGenerator extends BaseGenerator {
  generateLineThroughTwoPoints() {
    const { A, B, a, b } = this.generateNiceLinePoints();
    const eq = this.formatLineEquation(a, b);
    return this.createResponse({
      question: "Równanie prostej przez punkty:",
      latex: `A=(${A.x}, ${A.y}), B=(${B.x}, ${B.y})`,
      image: AnalyticSVGUtils.generateSVG({ type: "line", A, B }),
      variables: { A, B, a, b },
      correctAnswer: `y = ${eq}`,
      distractors: [
        `y = ${this.formatLineEquation(-a, b)}`,
        `y = ${this.formatLineEquation(a, -b)}`,
        `y = ${this.formatLineEquation(b, a)}`,
      ],
      steps: [`$$a = \\frac{${B.y}-${A.y}}{${B.x}-${A.x}}$$`, `$$y = ${eq}$$`],
    });
  }

  generateParallelLine() {
    return this.generateRelativeLine("parallel");
  }
  generatePerpendicularLine() {
    return this.generateRelativeLine("perpendicular");
  }

  generateRelativeLine(mode) {
    const a1 = MathUtils.randomInt(-3, 3) || 1;
    const b1 = 2;
    const P = { x: 2, y: 3 };
    const a2 = mode === "parallel" ? a1 : -1 / a1;
    const b2 = P.y - a2 * P.x;
    const eq2 = this.formatLineEquation(a2, b2);
    return this.createResponse({
      question: `Prosta przez P ${mode === "parallel" ? "równoległa" : "prostopadła"} do k:`,
      latex: `k: y=${a1}x+${b1}, P(2,3)`,
      image: null,
      variables: { a2, b2 },
      correctAnswer: `y=${eq2}`,
      distractors: [`y=${a1}x`, `y=${-a1}x+3`, `y=x+1`],
      steps: [
        `$$a_2=${this.fractionToLatex(a2)}$$`,
        `$$b_2=${this.fractionToLatex(b2)}$$`,
      ],
    });
  }

  generateParameterMProblem() {
    const mode = MathUtils.randomElement(["parallel", "perpendicular"]);
    const m = MathUtils.randomInt(-3, 3);
    const a1_coeff = MathUtils.randomElement([2, 3]);
    const a1_const = MathUtils.randomInt(-2, 2);
    const a1 = a1_coeff * m + a1_const;
    const a2 = mode === "parallel" ? a1 : a1 !== 0 ? -1 / a1 : 1;
    return this.createResponse({
      question: `Proste są ${mode}. Oblicz m.`,
      latex: `l: y=(${a1_coeff}m ${a1_const >= 0 ? "+" : ""}${a1_const})x+1, k: y=${this.fractionToLatex(a2)}x-2`,
      image: null,
      variables: { m },
      correctAnswer: `m=${m}`,
      distractors: [`m=${m + 1}`, `m=${-m}`, `m=0`],
      steps: [
        `Warunek: $${mode === "parallel" ? "a_1=a_2" : "a_1 a_2 = -1"}$$`,
      ],
    });
  }

  generateIntersectionProblem() {
    const intX = MathUtils.randomInt(-4, 4);
    const intY = MathUtils.randomInt(-4, 4);
    const a1 = 1;
    const b1 = intY - a1 * intX;
    const a2 = -1;
    const b2 = intY - a2 * intX;
    return this.createResponse({
      question: "Punkt przecięcia prostych:",
      latex: `y=x${b1 >= 0 ? "+" : ""}${b1}, y=-x${b2 >= 0 ? "+" : ""}${b2}`,
      image: AnalyticSVGUtils.generateSVG({
        type: "lines_intersection",
        a1,
        b1,
        a2,
        b2,
        P: { x: intX, y: intY },
      }),
      variables: { intX, intY },
      correctAnswer: `(${intX}, ${intY})`,
      distractors: [`(${intY}, ${intX})`, `(0,0)`, `(${intX}, 0)`],
      steps: [
        `$$x${b1 >= 0 ? "+" : ""}${b1} = -x${b2 >= 0 ? "+" : ""}${b2} \\implies 2x=${b2 - b1} \\implies x=${intX}$$`,
      ],
    });
  }

  generateSlopeAngle() {
    const angles = [
      { ang: 30, tan: "\\frac{\\sqrt{3}}{3}", val: Math.sqrt(3) / 3 },
      { ang: 45, tan: "1", val: 1 },
      { ang: 60, tan: "\\sqrt{3}", val: Math.sqrt(3) },
      { ang: 120, tan: "-\\sqrt{3}", val: -Math.sqrt(3) },
      { ang: 135, tan: "-1", val: -1 },
      { ang: 150, tan: "-\\frac{\\sqrt{3}}{3}", val: -Math.sqrt(3) / 3 },
    ];
    const sel = MathUtils.randomElement(angles);
    const b = MathUtils.randomInt(-4, 4);
    const aStr = sel.tan;
    const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const eq =
      aStr === "1"
        ? `x ${bStr}`
        : aStr === "-1"
          ? `-x ${bStr}`
          : `${aStr}x ${bStr}`;

    return this.createResponse({
      question: `Prosta o równaniu $$y = ${eq}$$ tworzy z osią $$Ox$$ kąt $$\\alpha$$. Miara tego kąta jest równa:`,
      latex: ``,
      image: null,
      variables: { angle: sel.ang, a_latex: sel.tan },
      correctAnswer: `${sel.ang}^\\circ`,
      distractors: [
        `${180 - sel.ang}^\\circ`,
        `${90 - sel.ang}^\\circ`,
        `${sel.ang > 90 ? sel.ang - 90 : sel.ang + 30}^\\circ`,
      ],
      steps: [`$$a = \\tg\\alpha$$. Odp: $$\\alpha = ${sel.ang}^\\circ$$`],
    });
  }

  generatePointOnLineParam() {
    const a = MathUtils.randomInt(-3, 3) || 1;
    const b = MathUtils.randomInt(-5, 5);
    const x = MathUtils.randomInt(-4, 4);
    const y = a * x + b;
    const eq = this.formatLineEquation(a, b);
    return this.createResponse({
      question: `Punkt $$P=(${x}, m)$$ należy do wykresu funkcji liniowej $$y=${eq}$$. Liczba $$m$$ jest równa:`,
      latex: `y=${eq}`,
      image: null,
      variables: { a, b, x, m_val: y },
      correctAnswer: `${y}`,
      distractors: [`${-y}`, `${x}`, `${a * x}`],
      steps: [`$$m = ${a}\\cdot(${x}) ${b >= 0 ? "+" : ""}${b} = ${y}$$`],
    });
  }

  generateIntersectionWithAxes() {
    const b = MathUtils.randomInt(-6, 6);
    const root = MathUtils.randomInt(-6, 6);
    if (root === 0) return this.generateIntersectionWithAxes();
    const a = -b / root;
    if (!Number.isInteger(a)) return this.generateIntersectionWithAxes();
    const axis = MathUtils.randomElement(["Ox", "Oy"]);
    const eq = this.formatLineEquation(a, b);
    return this.createResponse({
      question: `Punkt przecięcia prostej $$y=${eq}$$ z osią $$${axis}$$ ma współrzędne:`,
      latex: ``,
      image: null,
      variables: { a, b, axis },
      correctAnswer: axis === "Oy" ? `(0, ${b})` : `(${root}, 0)`,
      distractors: [
        axis === "Oy" ? `(${b}, 0)` : `(0, ${root})`,
        `(0, 0)`,
        axis === "Oy" ? `(0, ${-b})` : `(${-root}, 0)`,
      ],
      steps: [
        axis === "Oy"
          ? `$$x=0 \\implies y=${b}$$`
          : `$$y=0 \\implies x=${root}$$`,
      ],
    });
  }

  generatePerpendicularCoeff() {
    const num = MathUtils.randomElement([1, 2, 3]);
    const den = MathUtils.randomElement([2, 3, 4, 5]);
    const sign = MathUtils.randomElement([1, -1]);
    const a1_latex =
      (sign < 0 ? "-" : "") +
      (num === 1 && den === 1 ? "1" : `\\frac{${num}}{${den}}`);
    const a2_latex = (sign < 0 ? "" : "-") + `\\frac{${den}}{${num}}`;
    return this.createResponse({
      question: `Współczynnik kierunkowy prostej prostopadłej do prostej $$y = ${a1_latex}x + 5$$ jest równy:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: a2_latex,
      distractors: [
        a1_latex,
        (sign < 0 ? "" : "-") +
          (num === 1 && den === 1 ? "1" : `\\frac{${num}}{${den}}`),
        (sign < 0 ? "-" : "") + `\\frac{${den}}{${num}}`,
      ],
      steps: [`$$a_1 \\cdot a_2 = -1$$`],
    });
  }

  generateBisector() {
    const A = { x: -2, y: 0 };
    const B = { x: 2, y: 4 };
    const S = { x: 0, y: 2 };
    const a_sym = -1;
    const b_sym = 2;
    return this.createResponse({
      question: "Symetralna odcinka AB:",
      latex: `A(-2,0), B(2,4)`,
      image: AnalyticSVGUtils.generateSVG({
        type: "bisector",
        A,
        B,
        S,
        a_sym,
        b_sym,
      }),
      variables: { S },
      correctAnswer: `y=-x+2`,
      distractors: [`y=x+2`, `y=-x`, `y=x`],
      steps: [`Środek S(0,2)`, `a_{AB}=1 \\implies a_{sym}=-1`],
    });
  }

  // Helpery
  generateNiceLinePoints() {
    const x1 = MathUtils.randomInt(-5, 5),
      y1 = MathUtils.randomInt(-5, 5);
    const dx = MathUtils.randomElement([1, 2, 3]),
      dy = MathUtils.randomInt(-4, 4);
    return {
      A: { x: x1, y: y1 },
      B: { x: x1 + dx, y: y1 + dy },
      a: dy / dx,
      b: y1 - (dy / dx) * x1,
    };
  }

  formatLineEquation(a, b) {
    const aStr = this.fractionToLatex(a);
    if (a === 0) return this.fractionToLatex(b);
    let xPart = aStr === "1" ? "x" : aStr === "-1" ? "-x" : `${aStr}x`;
    if (b === 0) return xPart;
    return `${xPart} ${b > 0 ? "+" : "-"} ${this.fractionToLatex(Math.abs(b))}`;
  }

  fractionToLatex(val) {
    if (Number.isInteger(val)) return `${val}`;
    if (Math.abs(val - 0.5) < 0.001) return "\\frac{1}{2}";
    if (Math.abs(val + 0.5) < 0.001) return "-\\frac{1}{2}";
    if (Math.abs(val - 1 / 3) < 0.001) return "\\frac{1}{3}";
    if (Math.abs(val + 1 / 3) < 0.001) return "-\\frac{1}{3}";
    return parseFloat(val.toFixed(2));
  }
}

module.exports = LinesGenerator;
