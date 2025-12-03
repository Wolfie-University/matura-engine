const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const PlanimetrySVGUtils = require("./PlanimetrySVGUtils");

class QuadrilateralsGenerator extends BaseGenerator {
  generateRhombus() {
    const d1 = MathUtils.randomInt(4, 12) * 2;
    const d2 = MathUtils.randomInt(3, 8) * 2;
    const area = (d1 * d2) / 2;
    return this.createResponse({
      question: `Pole rombu o przekątnych $$${d1}$$ i $$${d2}$$ wynosi:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({ type: "rhombus", d1, d2 }),
      variables: { d1, d2 },
      correctAnswer: `${area}`,
      distractors: [`${d1 * d2}`, `${d1 + d2}`, `${area * 2}`],
      steps: [`$$P = \\frac{d_1 d_2}{2}$$`],
    });
  }

  generateRhombusAngles() {
    const alpha = MathUtils.randomInt(20, 70);
    const obtuse = 180 - 2 * alpha;
    return this.createResponse({
      question: `Kąt między dłuższą przekątną a bokiem rombu ma miarę $$${alpha}^\\circ$$. Kąt rozwarty tego rombu ma miarę:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({ type: "rhombus_angles", alpha }),
      variables: { alpha, obtuse },
      correctAnswer: `${obtuse}^\\circ`,
      distractors: [
        `${2 * alpha}^\\circ`,
        `${90 + alpha}^\\circ`,
        `${180 - alpha}^\\circ`,
      ],
      steps: [`$$180^\\circ - 2\\cdot${alpha}^\\circ = ${obtuse}^\\circ$$`],
    });
  }

  generateParallelogramNeighbor() {
    const alpha = MathUtils.randomInt(40, 80);
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
        `${90 - alpha}^\\circ`,
        `${alpha}^\\circ`,
        `${2 * alpha}^\\circ`,
      ],
      steps: [`$$180^\\circ - ${alpha}^\\circ = ${beta}^\\circ$$`],
    });
  }

  generateTrapezoidArea() {
    const a = MathUtils.randomInt(6, 12);
    const b = MathUtils.randomInt(2, a - 2);
    const h = MathUtils.randomInt(2, 6);
    const area = 0.5 * (a + b) * h;
    return this.createResponse({
      question: `Trapez ma podstawy $$${a}$$ i $$${b}$$ oraz wysokość $$${h}$$. Pole wynosi:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({ type: "trapezoid", a, b, h }),
      variables: { a, b, h, area },
      correctAnswer: `${area}`,
      distractors: [`${(a + b) * h}`, `${area * 2}`, `${a * b * h}`],
      steps: [`$$P = \\frac{${a}+${b}}{2} \\cdot ${h} = ${area}$$`],
    });
  }

  generateQuadrilateralAngles() {
    const alpha = MathUtils.randomInt(40, 80);
    return this.createResponse({
      question: `Kąt ostry równoległoboku to $$${alpha}^\\circ$$. Rozwarty to:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "parallelogram",
        angle: alpha,
      }),
      variables: { alpha },
      correctAnswer: `${180 - alpha}^\\circ`,
      distractors: [
        `${90 - alpha}^\\circ`,
        `${alpha}^\\circ`,
        `${2 * alpha}^\\circ`,
      ],
      steps: [`$$180^\\circ - ${alpha}^\\circ$$`],
    });
  }

  generateCyclicQuadrilateral() {
    const alpha = MathUtils.randomInt(50, 130);
    const gamma = 180 - alpha;
    return this.createResponse({
      question: `Czworokąt wpisany w okrąg. Kąt $$A$$ ma $$${alpha}^\\circ$$. Kąt $$C$$ ma miarę:`,
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
    });
  }

  generateTangentialQuadrilateral() {
    const a = MathUtils.randomInt(3, 10);
    const b = MathUtils.randomInt(3, 10);
    const c = MathUtils.randomInt(3, 10);
    const d = a + c - b;
    if (d <= 0) return this.generateTangentialQuadrilateral();
    return this.createResponse({
      question: `W czworokąt wpisano okrąg. Boki $$AB=${a}, BC=${b}, CD=${c}$$. $$DA$$ wynosi:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "tangential_quad",
        a,
        b,
        c,
        d,
      }),
      variables: { a, b, c, d },
      correctAnswer: `${d}`,
      distractors: [`${a + b + c}`, `${Math.abs(a - c)}`, `${a + c}`],
      steps: [`$$a+c = b+d \\implies d = ${a}+${c}-${b} = ${d}$$`],
    });
  }
}

module.exports = QuadrilateralsGenerator;
