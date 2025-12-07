const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const StereometrySVGUtils = require("./StereometrySVGUtils");

class SolidsOfRevolutionGenerator extends BaseGenerator {
  generateConeProblem() {
    let triples;
    if (this.difficulty === "easy") {
      triples = [
        [3, 4, 5],
        [6, 8, 10],
      ];
    } else if (this.difficulty === "hard") {
      triples = [
        [8, 15, 17],
        [9, 12, 15],
      ];
    } else {
      triples = [[5, 12, 13]];
    }

    const [r, h, l] = MathUtils.randomElement(triples);
    const mode = MathUtils.randomElement(["find_l", "find_h"]);
    const correctVal = mode === "find_l" ? l : h;

    const candidates = [];

    if (mode === "find_l") {
      candidates.push(r + h);
      candidates.push(Math.abs(h - r));
      candidates.push(Math.sqrt(Math.abs(h * h - r * r)).toFixed(2));
      candidates.push(l + 1);
      candidates.push(l - 1);
      candidates.push(Math.max(r, h));
    } else {
      candidates.push(Math.sqrt(l * l + r * r).toFixed(2));
      candidates.push(l + r);
      candidates.push(l - r);
      candidates.push(h + 1);
      candidates.push(h - 1);
      candidates.push(l);
    }

    const uniqueDistractors = [];
    const usedValues = new Set();
    usedValues.add(Number(correctVal));

    for (const val of candidates) {
      const numVal = Number(val);
      if (numVal > 0 && !usedValues.has(numVal)) {
        const valStr = Number.isInteger(numVal) ? `${numVal}` : `${val}`;
        uniqueDistractors.push(valStr);
        usedValues.add(numVal);
      }
      if (uniqueDistractors.length === 3) break;
    }

    let offset = 2;
    while (uniqueDistractors.length < 3) {
      const val = correctVal + offset;
      if (val > 0 && !usedValues.has(val)) {
        uniqueDistractors.push(`${val}`);
        usedValues.add(val);
      }
      offset = offset > 0 ? -offset : -offset + 1;
    }

    return this.createResponse({
      question:
        mode === "find_l"
          ? `Wysokość stożka $$h=${h}$$, promień $$r=${r}$$. Tworząca $$l$$ ma długość:`
          : `Tworząca stożka $$l=${l}$$, promień $$r=${r}$$. Wysokość $$h$$ wynosi:`,
      latex: null,
      image: null,
      variables: { r, h, l },
      correctAnswer: `${correctVal}`,
      distractors: uniqueDistractors,
      steps: [
        `Z twierdzenia Pitagorasa dla przekroju osiowego stożka: $$r^2 + h^2 = l^2$$`,
        mode === "find_l"
          ? `$$l^2 = ${r}^2 + ${h}^2 = ${r * r} + ${h * h} = ${l * l} \\implies l=${l}$$`
          : `$$h^2 = l^2 - r^2 = ${l}^2 - ${r}^2 = ${l * l} - ${r * r} = ${h * h} \\implies h=${h}$$`,
      ],
      questionType: "closed",
    });
  }

  generateCylinderProblem() {
    let rRange;
    if (this.difficulty === "easy") rRange = [2, 4];
    else if (this.difficulty === "hard") rRange = [6, 9];
    else rRange = [3, 6];

    const r = MathUtils.randomInt(rRange[0], rRange[1]);
    const h = 2 * r;
    const V = r * r * h;

    return this.createResponse({
      question: `Przekrój osiowy walca jest kwadratem o boku $$${h}$$. Oblicz objętość tego walca.`,
      latex: null,
      image: null,
      variables: { r, h, V },
      correctAnswer: `${V}\\pi`,
      distractors: [`${V}`, `${2 * r * h}\\pi`, `${h * h}\\pi`],
      steps: [
        `$$2r = ${h} \\implies r = ${r}$$`,
        `$$V = \\pi r^2 H = \\pi \\cdot ${r}^2 \\cdot ${h} = ${V}\\pi$$`,
      ],
      questionType: "open",
      answerFormat: "number",
    });
  }

  generateCylinderSectionDiagonal() {
    let triples;
    if (this.difficulty === "easy") {
      triples = [
        [3, 4, 5],
        [6, 8, 10],
      ];
    } else if (this.difficulty === "hard") {
      triples = [
        [8, 15, 17],
        [9, 12, 15],
      ];
    } else {
      triples = [[5, 12, 13]];
    }

    const [base, height, diag] = MathUtils.randomElement(triples);
    const isBaseDiameter = MathUtils.randomElement([true, false]);
    const r = isBaseDiameter ? base / 2 : height / 2;
    const h = isBaseDiameter ? height : base;

    return this.createResponse({
      question: `Przekrój osiowy walca jest prostokątem o wymiarach $$${2 * r} \\times ${h}$$ (średnica $$\\times$$ wysokość). Oblicz długość przekątnej tego przekroju.`,
      latex: null,
      image: null,
      variables: { r, h, diag },
      correctAnswer: `${diag}`,
      distractors: [
        `${Math.sqrt(r * r + h * h).toFixed(1)}`,
        `${2 * r + h}`,
        `${diag + 2}`,
      ],
      steps: [
        `Boki prostokąta: $$a = 2r = ${2 * r}$$, $$b = h = ${h}$$.`,
        `Z twierdzenia Pitagorasa dla przekątnej $$d$$: $$d = \\sqrt{a^2 + b^2}$$`,
        `$$d = \\sqrt{${2 * r}^2 + ${h}^2} = \\sqrt{${(2 * r) ** 2} + ${h * h}} = \\sqrt{${diag * diag}} = ${diag}$$`,
      ],
      questionType: "open",
      answerFormat: "number",
    });
  }

  generateSphereProblem() {
    let rRange;
    if (this.difficulty === "easy") rRange = [3, 6];
    else if (this.difficulty === "hard") rRange = [7, 10];
    else rRange = [2, 5];

    const r = MathUtils.randomInt(rRange[0], rRange[1]);
    const type = MathUtils.randomElement(["volume", "area"]);

    if (type === "volume") {
      let V_str;
      const num = 4 * Math.pow(r, 3);
      const den = 3;

      if (num % den === 0) V_str = `${num / den}`;
      else V_str = `\\frac{${num}}{${den}}`;

      if (this.difficulty === "easy" && r % 3 !== 0) {
        return this.generateSphereProblem();
      }

      return this.createResponse({
        question: `Promień kuli jest równy $$${r}$$. Objętość tej kuli wynosi:`,
        latex: null,
        image: null,
        variables: { r, V: num / den },
        correctAnswer: `${V_str}\\pi`,
        distractors: [
          `${(num / 4 / den).toFixed(0)}\\pi`,
          `${4 * r * r}\\pi`,
          `${Math.pow(r, 3)}\\pi`,
        ],
        steps: [
          `$$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi \\cdot ${Math.pow(r, 3)} = ${V_str}\\pi$$`,
        ],
        questionType: "closed",
      });
    } else {
      const P = 4 * r * r;
      return this.createResponse({
        question: `Promień kuli jest równy $$${r}$$. Pole powierzchni tej kuli wynosi:`,
        latex: null,
        image: null,
        variables: { r, P },
        correctAnswer: `${P}\\pi`,
        distractors: [`${r * r}\\pi`, `${2 * r * r}\\pi`, `${P / 4}\\pi`],
        steps: [`$$P = 4\\pi r^2 = 4\\pi \\cdot ${r * r} = ${P}\\pi$$`],
        questionType: "closed",
      });
    }
  }
}

module.exports = SolidsOfRevolutionGenerator;
