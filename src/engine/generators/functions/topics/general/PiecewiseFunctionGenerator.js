const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class PiecewiseFunctionGenerator extends BaseGenerator {
  generatePiecewiseFunction() {
    const cut = MathUtils.randomInt(-2, 2);
    const f1_c = MathUtils.randomInt(1, 3);
    const f2_a = MathUtils.randomInt(-2, 2) || 1;
    const f2_b = MathUtils.randomInt(1, 5);
    const val1 = cut - MathUtils.randomInt(1, 3);
    const val2 = cut + MathUtils.randomInt(0, 3);

    const res1 = val1 * val1 + f1_c;
    const res2 = f2_a * val2 + f2_b;
    const total = res1 + res2;

    return this.createResponse({
      question: `Funkcja $$f$$ jest określona wzorem: $$f(x) = \\begin{cases} x^2 + ${f1_c} & \\text{dla } x < ${cut} \\\\ ${f2_a}x + ${f2_b} & \\text{dla } x \\ge ${cut} \\end{cases}$$. Wartość wyrażenia $$f(${val1}) + f(${val2})$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { cut, val1, val2, res1, res2 },
      correctAnswer: `${total}`,
      distractors: [`${res1 - res2}`, `${res1 * res2}`, `${res1 + res2 + 2}`],
      steps: [
        `$$f(${val1}) = ${res1}$$ (wzór 1)`,
        `$$f(${val2}) = ${res2}$$ (wzór 2)`,
        `Suma: $$${total}$$`,
      ],
    });
  }
}

module.exports = PiecewiseFunctionGenerator;
