const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class ExponentialFunctionGenerator extends BaseGenerator {
  generateExponentialParam() {
    const scenario = MathUtils.randomElement([
      { x: 2, a: 3, y: 9 },
      { x: 2, a: 2, y: 4 },
      { x: 2, a: 4, y: 16 },
      { x: 2, a: 5, y: 25 },
      { x: 3, a: 2, y: 8 },
      { x: 3, a: 3, y: 27 },
      { x: -1, a: 2, y: "\\frac{1}{2}" },
      { x: -1, a: 3, y: "\\frac{1}{3}" },
    ]);

    return this.createResponse({
      question: `Funkcja wykładnicza określona wzorem $$f(x) = a^x$$ przyjmuje dla argumentu $$${scenario.x}$$ wartość $$${scenario.y}$$. Podstawa $$a$$ tej funkcji jest równa:`,
      latex: `f(${scenario.x}) = ${scenario.y}`,
      image: null,
      variables: { scenario },
      correctAnswer: `${scenario.a}`,
      distractors: [
        `${scenario.a * 2}`,
        scenario.x > 0 ? `\\frac{1}{${scenario.a}}` : `${1 / scenario.a}`,
        `${scenario.a + 1}`,
      ],
      steps: [`$$a^{${scenario.x}} = ${scenario.y}$$`, `$$a = ${scenario.a}$$`],
    });
  }
}

module.exports = ExponentialFunctionGenerator;
