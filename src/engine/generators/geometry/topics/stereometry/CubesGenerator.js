const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const StereometrySVGUtils = require("./StereometrySVGUtils");

class CubesGenerator extends BaseGenerator {
  generateCubeProblem() {
    let aRange;
    if (this.difficulty === "easy") aRange = [2, 5];
    else if (this.difficulty === "hard") aRange = [10, 20];
    else aRange = [4, 9];

    const a = MathUtils.randomInt(aRange[0], aRange[1]);
    const mode = MathUtils.randomElement(["given_edge", "given_diag"]);

    if (mode === "given_edge") {
      return this.createResponse({
        question: `Krawędź sześcianu ma długość $$${a}$$. Długość przekątnej tego sześcianu jest równa:`,
        latex: null,
        image: null,
        variables: { a },
        correctAnswer: `${a}\\sqrt{3}`,
        distractors: [`${a}\\sqrt{2}`, `${3 * a}`, `${a * a}`],
        steps: [
          `Przekątna sześcianu o krawędzi $$a$$: $$D = a\\sqrt{3}$$`,
          `$$D = ${a}\\sqrt{3}$$`,
        ],
        questionType: "closed",
      });
    } else {
      const V = a * a * a;
      return this.createResponse({
        question: `Przekątna sześcianu ma długość $$${a}\\sqrt{3}$$. Objętość tego sześcianu wynosi:`,
        latex: null,
        image: null,
        variables: { a, V },
        correctAnswer: `${V}`,
        distractors: [`${3 * a}`, `${a * a}`, `${Math.floor(V / 3)}`],
        steps: [
          `$$D = a\\sqrt{3} = ${a}\\sqrt{3} \\implies a = ${a}$$`,
          `$$V = a^3 = ${a}^3 = ${V}$$`,
        ],
        questionType: "closed",
      });
    }
  }

  generateCuboidAngle() {
    let aRange, angles;
    if (this.difficulty === "easy") {
      aRange = [2, 4];
      angles = [45];
    } else if (this.difficulty === "hard") {
      aRange = [5, 8];
      angles = [30];
    } else {
      aRange = [3, 6];
      angles = [60];
    }

    const a = MathUtils.randomInt(aRange[0], aRange[1]);
    const angle = MathUtils.randomElement(angles);

    let H_latex;
    if (angle === 45) H_latex = `${a}\\sqrt{2}`;
    else if (angle === 60) H_latex = `${a}\\sqrt{6}`;
    else H_latex = `\\frac{${a}\\sqrt{6}}{3}`;

    return this.createResponse({
      question: `Podstawą prostopadłościanu jest kwadrat o boku $$${a}$$. Przekątna bryły tworzy z płaszczyzną podstawy kąt $$${angle}^\\circ$$. Oblicz wysokość bryły.`,
      latex: null,
      image: null,
      variables: { a, angle },
      correctAnswer: H_latex,
      distractors: [
        `${a}\\sqrt{3}`,
        angle === 60 ? `${a}\\sqrt{2}` : `${3 * a}`,
        `${a}`,
      ],
      steps: [
        `Przekątna podstawy (kwadratu): $$d = a\\sqrt{2} = ${a}\\sqrt{2}$$`,
        `Z trójkąta prostokątnego: $$\\tg ${angle}^\\circ = \\frac{H}{d}$$`,
        `$$H = ${a}\\sqrt{2} \\cdot \\tg ${angle}^\\circ = ${H_latex}$$`,
      ],
      questionType: "open",
      answerFormat: "number",
    });
  }

  generateCuboidDiagonal() {
    let range;
    if (this.difficulty === "easy") range = [1, 3];
    else if (this.difficulty === "hard") range = [4, 8];
    else range = [2, 5];

    const a = MathUtils.randomInt(range[0], range[1]);
    const b = MathUtils.randomInt(range[0], range[1]);
    const c = MathUtils.randomInt(range[0], range[1]);

    const sumSq = a * a + b * b + c * c;

    const formatSqrt = (val) => {
      return Number.isInteger(Math.sqrt(val))
        ? `${Math.sqrt(val)}`
        : `\\sqrt{${val}}`;
    };

    const diagStr = formatSqrt(sumSq);

    const candidates = [
      formatSqrt(a * a + b * b),
      formatSqrt(a * a + c * c),
      `${a + b + c}`,
      formatSqrt(sumSq - c * c),
      formatSqrt(sumSq + a * a),
      formatSqrt(Math.abs(sumSq - 10)),
      `${a * b * c}`,
      formatSqrt(sumSq * 2),
    ];

    const uniqueDistractors = [];
    const usedValues = new Set();
    usedValues.add(diagStr);

    for (const val of candidates) {
      if (!usedValues.has(val)) {
        uniqueDistractors.push(val);
        usedValues.add(val);
      }
      if (uniqueDistractors.length === 3) break;
    }

    let offset = 1;
    while (uniqueDistractors.length < 3) {
      const val = formatSqrt(sumSq + offset);
      if (!usedValues.has(val)) {
        uniqueDistractors.push(val);
        usedValues.add(val);
      }
      offset = offset > 0 ? -offset : -offset + 1;
    }

    return this.createResponse({
      question: `Wymiary prostopadłościanu są równe: $$a=${a}$$, $$b=${b}$$, $$c=${c}$$. Długość przekątnej tego prostopadłościanu wynosi:`,
      latex: null,
      image: null,
      variables: { a, b, c },
      correctAnswer: `${diagStr}`,
      distractors: uniqueDistractors,
      steps: [
        `Wzór na długość przekątnej prostopadłościanu: $$d = \\sqrt{a^2 + b^2 + c^2}$$`,
        `$$d = \\sqrt{${a}^2 + ${b}^2 + ${c}^2}$$`,
        `$$d = \\sqrt{${a * a} + ${b * b} + ${c * c}} = \\sqrt{${sumSq}} = ${diagStr}$$`,
      ],
      questionType: "closed",
    });
  }
}

module.exports = CubesGenerator;
