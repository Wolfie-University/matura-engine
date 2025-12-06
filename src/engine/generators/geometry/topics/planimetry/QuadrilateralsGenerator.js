const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const PlanimetrySVGUtils = require("./PlanimetrySVGUtils");

class QuadrilateralsGenerator extends BaseGenerator {
  generateRhombus() {
    let range;
    if (this.difficulty === "easy") range = [4, 8];
    else if (this.difficulty === "hard") range = [9, 15];
    else range = [6, 12];

    const d1 = MathUtils.randomInt(range[0], range[1]);
    const d2 = MathUtils.randomInt(range[0], range[1]);

    const d1_final = this.difficulty === "easy" && d1 % 2 !== 0 ? d1 + 1 : d1;
    const d2_final = this.difficulty === "easy" && d2 % 2 !== 0 ? d2 + 1 : d2;

    const area = (d1_final * d2_final) / 2;
    const areaStr = Number.isInteger(area) ? `${area}` : area.toFixed(1);

    return this.createResponse({
      question: `Pole rombu o przekątnych $$${d1_final}$$ i $$${d2_final}$$ wynosi:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "rhombus",
        d1: d1_final,
        d2: d2_final,
      }),
      variables: { d1: d1_final, d2: d2_final },
      correctAnswer: areaStr,
      distractors: [
        `${d1_final * d2_final}`,
        `${d1_final + d2_final}`,
        `${area * 2}`,
      ],
      steps: [
        `$$P = \\frac{d_1 d_2}{2} = \\frac{${d1_final} \\cdot ${d2_final}}{2} = ${areaStr}$$`,
      ],
      questionType: "closed",
    });
  }

  generateRhombusAngles() {
    let angle;
    if (this.difficulty === "easy") angle = MathUtils.randomInt(2, 6) * 10;
    else angle = MathUtils.randomInt(15, 75);

    const obtuse = 180 - 2 * angle;

    return this.createResponse({
      question: `Kąt między dłuższą przekątną a bokiem rombu ma miarę $$${angle}^\\circ$$. Oblicz kąt rozwarty tego rombu.`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "rhombus_angles",
        alpha: angle,
      }),
      variables: { alpha: angle, obtuse },
      correctAnswer: `${obtuse}^\\circ`,
      distractors: [
        `${2 * angle}^\\circ`,
        `${90 + angle}^\\circ`,
        `${180 - angle}^\\circ`,
      ],
      steps: [
        `Przekątna jest dwusieczną kąta ostrego. Cały kąt ostry: $$2 \\cdot ${angle}^\\circ = ${2 * angle}^\\circ$$.`,
        `Suma kątów przy ramieniu to $$180^\\circ$$. Kąt rozwarty: $$180^\\circ - ${2 * angle}^\\circ = ${obtuse}^\\circ$$`,
      ],
      questionType: "open",
      answerFormat: "α=angle^\\circ",
    });
  }

  generateParallelogramNeighbor() {
    let alpha;
    if (this.difficulty === "easy") alpha = MathUtils.randomInt(4, 8) * 10;
    else alpha = MathUtils.randomInt(35, 85);

    const beta = 180 - alpha;
    return this.createResponse({
      question: `Kąt ostry równoległoboku ma miarę $$${alpha}^\\circ$$. Miara kąta rozwartego tego równoległoboku jest równa:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "parallelogram",
        angle: alpha,
      }),
      variables: { alpha, beta },
      correctAnswer: `${beta}^\\circ`,
      distractors: [
        `${90 - alpha > 0 ? 90 - alpha : alpha + 10}^\\circ`,
        `${alpha}^\\circ`,
        `${2 * alpha}^\\circ`,
      ],
      steps: [`$$180^\\circ - ${alpha}^\\circ = ${beta}^\\circ$$`],
      questionType: "closed",
    });
  }

  generateTrapezoidArea() {
    let range;
    if (this.difficulty === "easy") range = [2, 6];
    else if (this.difficulty === "hard") range = [8, 15];
    else range = [4, 10];

    const a = MathUtils.randomInt(range[0] + 2, range[1] + 4);
    const b = MathUtils.randomInt(range[0], a - 1);
    const h = MathUtils.randomInt(range[0], range[1]);

    const b_final = this.difficulty === "easy" && (a + b) % 2 !== 0 ? b + 1 : b;

    const area = 0.5 * (a + b_final) * h;
    const areaStr = Number.isInteger(area) ? `${area}` : area.toFixed(1);

    return this.createResponse({
      question: `Trapez ma podstawy $$${a}$$ i $$${b_final}$$ oraz wysokość $$${h}$$. Jego pole wynosi:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "trapezoid",
        a,
        b: b_final,
        h,
      }),
      variables: { a, b: b_final, h, area },
      correctAnswer: areaStr,
      distractors: [
        `${(a + b_final) * h}`,
        `${area * 2}`,
        `${a * b_final * h}`,
      ],
      steps: [`$$P = \\frac{${a}+${b_final}}{2} \\cdot ${h} = ${areaStr}$$`],
      questionType: "closed",
    });
  }

  generateQuadrilateralAngles() {
    let alpha;
    if (this.difficulty === "easy") alpha = MathUtils.randomInt(4, 8) * 10;
    else alpha = MathUtils.randomInt(40, 80);

    return this.createResponse({
      question: `Kąt ostry równoległoboku to $$${alpha}^\\circ$$. Oblicz kąt rozwarty.`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "parallelogram",
        angle: alpha,
      }),
      variables: { alpha },
      correctAnswer: `α=${180 - alpha}^\\circ`,
      distractors: [
        `α=${90 - alpha > 0 ? 90 - alpha : alpha + 20}^\\circ`,
        `α=${alpha}^\\circ`,
        `α=${2 * alpha}^\\circ`,
      ],
      steps: [`$$180^\\circ - ${alpha}^\\circ$$`],
      questionType: "open",
      answerFormat: "α=angle^\\circ",
    });
  }

  generateCyclicQuadrilateral() {
    let alpha;
    if (this.difficulty === "easy") alpha = MathUtils.randomInt(5, 13) * 10;
    else alpha = MathUtils.randomInt(50, 130);

    const gamma = 180 - alpha;
    return this.createResponse({
      question: `Mamy czworokąt wpisany w okrąg. Kąt $$A$$ ma $$${alpha}^\\circ$$. Kąt $$C$$ ma miarę:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({ type: "cyclic_quad", alpha }),
      variables: { alpha, gamma },
      correctAnswer: `${gamma}^\\circ`,
      distractors: [
        `${alpha}^\\circ`,
        `${180 + alpha}^\\circ`,
        `${360 - alpha}^\\circ`,
      ],
      steps: [`$$180^\\circ - ${alpha}^\\circ = ${gamma}^\\circ$$`],
      questionType: "closed",
    });
  }

  generateTangentialQuadrilateral() {
    let range;
    if (this.difficulty === "easy") range = [3, 6];
    else if (this.difficulty === "hard") range = [10, 20];
    else range = [5, 12];

    const a = MathUtils.randomInt(range[0], range[1]);
    const b = MathUtils.randomInt(range[0], range[1]);
    const c = MathUtils.randomInt(range[0], range[1]);

    let d = a + c - b;
    let a_final = a,
      c_final = c;

    if (d <= 0) {
      a_final += Math.abs(d) + 2;
      d = a_final + c_final - b;
    }

    return this.createResponse({
      question: `W czworokąt wpisano okrąg. Boki $$AB=${a_final}, BC=${b}, CD=${c_final}$$. $$DA$$ wynosi:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "tangential_quad",
        a: a_final,
        b,
        c: c_final,
        d,
      }),
      variables: { a: a_final, b, c: c_final, d },
      correctAnswer: `${d}`,
      distractors: [
        `${a_final + b + c_final}`,
        `${Math.abs(a_final - c_final)}`,
        `${a_final + c_final}`,
      ],
      steps: [`$$a+c = b+d \\implies d = ${a_final}+${c_final}-${b} = ${d}$$`],
      questionType: "closed",
    });
  }
}

module.exports = QuadrilateralsGenerator;
