const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const AnalyticSVGUtils = require("./AnalyticSVGUtils");

class PointsAndSegmentsGenerator extends BaseGenerator {
  generateMidpointProblem() {
    const A = { x: MathUtils.randomInt(-6, 6), y: MathUtils.randomInt(-6, 6) };
    const S = { x: MathUtils.randomInt(-4, 4), y: MathUtils.randomInt(-4, 4) };
    const B = { x: 2 * S.x - A.x, y: 2 * S.y - A.y };
    const lengthSquared = Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2);
    const lengthStr = Number.isInteger(Math.sqrt(lengthSquared))
      ? `${Math.sqrt(lengthSquared)}`
      : `\\sqrt{${lengthSquared}}`;
    return this.createResponse({
      question:
        "Dane są punkty $$A$$ i $$B$$. Oblicz środek i długość odcinka.",
      latex: `A=(${A.x}, ${A.y}), B=(${B.x}, ${B.y})`,
      image: AnalyticSVGUtils.generateSVG({ type: "segment", A, B, S }),
      variables: { A, B, S },
      correctAnswer: `S=(${S.x}, ${S.y}), |AB|=${lengthStr}`,
      distractors: [
        `S=(${S.x}, ${S.y}), |AB|=${lengthSquared}`,
        `S=(${B.x - A.x}, ${B.y - A.y}), |AB|=${lengthStr}`,
        `S=(${S.y}, ${S.x}), |AB|=${lengthStr}`,
      ],
      steps: [
        `$$S=(\\frac{${A.x}+${B.x}}{2}, \\frac{${A.y}+${B.y}}{2})=(${S.x}, ${S.y})$$`,
        `$$|AB|=\\sqrt{(${B.x}-${A.x})^2+(${B.y}-${A.y})^2}=${lengthStr}$$`,
      ],
    });
  }

  generateMissingEndpoint() {
    const A = { x: MathUtils.randomInt(-6, 6), y: MathUtils.randomInt(-6, 6) };
    const S = { x: MathUtils.randomInt(-4, 4), y: MathUtils.randomInt(-4, 4) };
    const B = { x: 2 * S.x - A.x, y: 2 * S.y - A.y };
    return this.createResponse({
      question: "Punkt S jest środkiem odcinka AB. Znając A i S oblicz B.",
      latex: `S=(${S.x}, ${S.y}), A=(${A.x}, ${A.y})`,
      image: AnalyticSVGUtils.generateSVG({ type: "segment", A, B, S }),
      variables: { A, B, S },
      correctAnswer: `B=(${B.x}, ${B.y})`,
      distractors: [
        `B=(${S.x - A.x}, ${S.y - A.y})`,
        `B=(\\frac{${A.x}+${S.x}}{2}, \\frac{${A.y}+${S.y}}{2})`,
        `B=(${A.x}, ${A.y})`,
      ],
      steps: [`$$x_B = 2x_S - x_A = ${B.x}$$`, `$$y_B = 2y_S - y_A = ${B.y}$$`],
    });
  }

  generateDistanceUnknownCoord() {
    const x1 = 1,
      y1 = 2;
    const triple = MathUtils.randomElement([
      [3, 4, 5],
      [6, 8, 10],
      [5, 12, 13],
    ]);
    const dx = triple[0];
    const dy = triple[1];
    const d = triple[2];
    const x2 = x1 + dx;
    const m = y1 + dy;
    return this.createResponse({
      question: `Punkty $$A=(${x1}, ${y1})$$ i $$B=(${x2}, m)$$ są odległe o $$${d}$$. Jedną z możliwych wartości $$m$$ jest:`,
      latex: `|AB|=${d}`,
      image: null,
      variables: { m, d },
      correctAnswer: `${m}`,
      distractors: [`${m + 2}`, `${y1}`, `${x2}`],
      steps: [`$$|AB| = \\sqrt{(x_2-x_1)^2 + (m-y_1)^2} = ${d}$$`],
    });
  }

  generatePointSymmetry() {
    const P = { x: MathUtils.randomInt(-6, 6), y: MathUtils.randomInt(-6, 6) };
    const type = MathUtils.randomElement(["Ox", "Oy", "(0,0)"]);
    let resX, resY;
    if (type === "Ox") {
      resX = P.x;
      resY = -P.y;
    } else if (type === "Oy") {
      resX = -P.x;
      resY = P.y;
    } else {
      resX = -P.x;
      resY = -P.y;
    }
    return this.createResponse({
      question: `Obraz punktu $$P(${P.x}, ${P.y})$$ w symetrii względem ${type}:`,
      latex: ``,
      image: null,
      variables: { P, type },
      correctAnswer: `(${resX}, ${resY})`,
      distractors: [
        `(${P.x}, ${P.y})`,
        `(${-resX}, ${-resY})`,
        `(${P.y}, ${P.x})`,
      ],
      steps: [
        type === "Ox"
          ? `Symetria OX: (x, -y)`
          : type === "Oy"
            ? `Symetria OY: (-x, y)`
            : `Symetria (0,0): (-x, -y)`,
      ],
    });
  }

  generateCollinearPoints() {
    const a_int = MathUtils.randomInt(-3, 3) || 1;
    const b_int = MathUtils.randomInt(-5, 5);
    const A2 = { x: 1, y: a_int * 1 + b_int };
    const B2 = { x: 3, y: a_int * 3 + b_int };
    const m_sol = MathUtils.randomInt(-4, 4);
    const C_val = a_int * m_sol + b_int;
    return this.createResponse({
      question: `Punkty $$A=(${A2.x}, ${A2.y})$$, $$B=(${B2.x}, ${B2.y})$$ i $$C=(m, ${C_val})$$ są współliniowe. Wynika stąd, że:`,
      latex: ``,
      image: null,
      variables: { m_sol },
      correctAnswer: `m = ${m_sol}`,
      distractors: [`m = ${m_sol + 1}`, `m = ${-m_sol}`, `m = 0`],
      steps: [
        `Wyznaczamy prostą AB: $$y = ${a_int}x ${b_int >= 0 ? "+" : ""}${b_int}$$`,
        `Podstawiamy C: $$${C_val} = ${a_int}m + ${b_int} \\implies m=${m_sol}$$`,
      ],
    });
  }
}

module.exports = PointsAndSegmentsGenerator;
