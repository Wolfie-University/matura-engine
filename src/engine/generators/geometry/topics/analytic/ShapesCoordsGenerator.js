const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const AnalyticSVGUtils = require("./AnalyticSVGUtils");

class ShapesCoordsGenerator extends BaseGenerator {
  generateCircleProblem() {
    const S = { x: 2, y: -3 };
    const r = 4;
    return this.createResponse({
      question: "Środek i promień okręgu:",
      latex: `(x-2)^2 + (y+3)^2 = 16`,
      image: AnalyticSVGUtils.generateSVG({ type: "circle", S, r }),
      variables: { S, r },
      correctAnswer: `S=(2,-3), r=4`,
      distractors: [`S=(-2,3), r=4`, `S=(2,-3), r=16`, `S=(2,3), r=2`],
      steps: [`$$(x-a)^2+(y-b)^2=r^2$$`],
    });
  }

  generateCircleTangentToAxis() {
    const axis = MathUtils.randomElement(["Ox", "Oy"]);
    const S = { x: MathUtils.randomInt(-5, 5), y: MathUtils.randomInt(-5, 5) };
    if (S.x === 0) S.x = 2;
    if (S.y === 0) S.y = -3;
    const r = axis === "Ox" ? Math.abs(S.y) : Math.abs(S.x);
    return this.createResponse({
      question: `Okrąg o środku $$S=(${S.x}, ${S.y})$$ jest styczny do osi $$${axis}$$. Promień:`,
      latex: ``,
      image: AnalyticSVGUtils.generateSVG({ type: "circle", S, r }),
      variables: { S, axis, r },
      correctAnswer: `${r}`,
      distractors: [
        `${axis === "Ox" ? Math.abs(S.x) : Math.abs(S.y)}`,
        `${r * r}`,
        `${Math.sqrt(S.x * S.x + S.y * S.y).toFixed(1)}`,
      ],
      steps: [
        `Odległość środka od osi $$${axis}$$ jest równa promieniowi. $$r = |${axis === "Ox" ? S.y : S.x}| = ${r}$$`,
      ],
    });
  }

  generateRadiusFromEquation() {
    const rSq = MathUtils.randomElement([4, 9, 16, 25, 2, 3, 5, 8]);
    const rStr = Number.isInteger(Math.sqrt(rSq))
      ? `${Math.sqrt(rSq)}`
      : `\\sqrt{${rSq}}`;
    return this.createResponse({
      question: `Promień okręgu $$(x-1)^2 + (y+2)^2 = ${rSq}$$ wynosi:`,
      latex: ``,
      image: null,
      variables: { rSq },
      correctAnswer: rStr,
      distractors: [`${rSq}`, `${rSq / 2}`, `${rSq * 2}`],
      steps: [`$$r^2 = ${rSq} \\implies r = ${rStr}$$`],
    });
  }

  generateParallelogramVertex() {
    const A = { x: MathUtils.randomInt(-5, 5), y: MathUtils.randomInt(-5, 5) };
    const B = {
      x: A.x + MathUtils.randomInt(2, 6),
      y: A.y + MathUtils.randomInt(-2, 4),
    };
    const C = {
      x: B.x + MathUtils.randomInt(-2, 4),
      y: B.y + MathUtils.randomInt(3, 7),
    };
    const D = { x: A.x + C.x - B.x, y: A.y + C.y - B.y };
    return this.createResponse({
      question: `Wierzchołki równoległoboku ABCD: A(${A.x},${A.y}), B(${B.x},${B.y}), C(${C.x},${C.y}). Wierzchołek D:`,
      latex: ``,
      image: AnalyticSVGUtils.generateSVG({
        type: "parallelogram_points",
        A,
        B,
        C,
        D,
      }),
      variables: { D },
      correctAnswer: `(${D.x}, ${D.y})`,
      distractors: [
        `(${B.x + C.x - A.x}, ${B.y + C.y - A.y})`,
        `(${A.x + B.x - C.x}, ${A.y + B.y - C.y})`,
        `(${(A.x + C.x) / 2}, ${(A.y + C.y) / 2})`,
      ],
      steps: [
        `$$x_D = x_A + x_C - x_B = ${D.x}$$`,
        `$$y_D = y_A + y_C - y_B = ${D.y}$$`,
      ],
    });
  }

  generateTriangleAreaCoords() {
    const y_base = MathUtils.randomInt(-4, 4);
    const x1 = MathUtils.randomInt(-6, 0);
    const x2 = x1 + MathUtils.randomInt(3, 8);
    const x3 = MathUtils.randomInt(-5, 5);
    const y3 = y_base + MathUtils.randomElement([-3, -4, -5, 3, 4, 5]);
    const base = Math.abs(x2 - x1);
    const h = Math.abs(y3 - y_base);
    const area = 0.5 * base * h;
    return this.createResponse({
      question: `Pole trójkąta o wierzchołkach A(${x1},${y_base}), B(${x2},${y_base}), C(${x3},${y3}):`,
      latex: ``,
      image: AnalyticSVGUtils.generateSVG({
        type: "triangle_coords",
        A: { x: x1, y: y_base },
        B: { x: x2, y: y_base },
        C: { x: x3, y: y3 },
      }),
      variables: { area },
      correctAnswer: `${area}`,
      distractors: [`${area * 2}`, `${area + 2}`, `${base + h}`],
      steps: [
        `Podstawa AB pozioma, długość ${base}. Wysokość h=${h}. Pole = ${area}.`,
      ],
    });
  }
}

module.exports = ShapesCoordsGenerator;
