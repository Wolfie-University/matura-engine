const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class TransformationsGenerator extends BaseGenerator {
  generateSymmetryTransform() {
    const type = MathUtils.randomElement(["OX", "OY"]);
    const baseFunc = MathUtils.randomElement(["linear", "quadratic"]);
    let f_latex, g_latex, dist1, dist2;

    if (baseFunc === "linear") {
      const a = MathUtils.randomInt(2, 5);
      const b = MathUtils.randomInt(1, 5);
      f_latex = `${a}x + ${b}`;
      if (type === "OX") {
        g_latex = `-${a}x - ${b}`;
        dist1 = `${a}x - ${b}`;
        dist2 = `-${a}x + ${b}`;
      } else {
        g_latex = `-${a}x + ${b}`;
        dist1 = `${a}x - ${b}`;
        dist2 = `-${a}x - ${b}`;
      }
    } else {
      const c = MathUtils.randomInt(1, 5);
      f_latex = `x^2 + ${c}`;
      if (type === "OX") {
        g_latex = `-x^2 - ${c}`;
        dist1 = `x^2 - ${c}`;
        dist2 = `-x^2 + ${c}`;
      } else {
        g_latex = `x^2 + ${c}`;
        dist1 = `-x^2 + ${c}`;
        dist2 = `x^2 - ${c}`;
      }
    }

    return this.createResponse({
      question: `Wykres funkcji $$g$$ powstał przez przekształcenie wykresu funkcji $$f(x) = ${f_latex}$$ w symetrii względem osi $$${type}$$. Funkcja $$g$$ jest określona wzorem:`,
      latex: ``,
      image: null,
      variables: { type, baseFunc },
      correctAnswer: `g(x) = ${g_latex}`,
      distractors: [`g(x) = ${dist1}`, `g(x) = ${dist2}`, `g(x) = ${f_latex}`],
      steps: [
        type === "OX"
          ? `Symetria OX: $$g(x) = -f(x)$$`
          : `Symetria OY: $$g(x) = f(-x)$$`,
        `$$g(x) = ${g_latex}$$`,
      ],
    });
  }

  generateFunctionShift() {
    const p = MathUtils.randomInt(-4, 4);
    const q = MathUtils.randomInt(-4, 4);
    const type = MathUtils.randomElement(["quadratic", "exponential"]);
    let baseFuncLatex, shiftedFuncLatex, dist1, dist2;

    if (type === "quadratic") {
      baseFuncLatex = "f(x) = x^2";
      const inside =
        p === 0 ? "x" : p > 0 ? `(x - ${p})` : `(x + ${Math.abs(p)})`;
      shiftedFuncLatex = `${inside}^2 ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;

      const wrongP =
        p === 0 ? "x" : p > 0 ? `(x + ${p})` : `(x - ${Math.abs(p)})`;
      dist1 = `${wrongP}^2 ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;
      dist2 = `${inside}^2 ${q === 0 ? "" : q > 0 ? `- ${q}` : `+ ${Math.abs(q)}`}`;
    } else {
      const base = MathUtils.randomElement([2, 3]);
      baseFuncLatex = `f(x) = ${base}^x`;
      const exponent =
        p === 0 ? "x" : p > 0 ? `x - ${p}` : `x + ${Math.abs(p)}`;
      shiftedFuncLatex = `${base}^{${exponent}} ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;

      const wrongExp =
        p === 0 ? "x" : p > 0 ? `x + ${p}` : `x - ${Math.abs(p)}`;
      dist1 = `${base}^{${wrongExp}} ${q === 0 ? "" : q > 0 ? `+ ${q}` : q}`;
      dist2 = `${base}^{${exponent}} ${q === 0 ? "" : q > 0 ? `- ${q}` : `+ ${Math.abs(q)}`}`;
    }

    return this.createResponse({
      question: `Wykres funkcji $$g$$ powstał przez przesunięcie wykresu funkcji $$${baseFuncLatex}$$ o wektor $$v=[${p}, ${q}]$$. Wzór funkcji $$g$$ to:`,
      latex: `v=[${p}, ${q}]`,
      image: null,
      variables: { p, q, type },
      correctAnswer: `g(x) = ${shiftedFuncLatex}`,
      distractors: [
        `g(x) = ${dist1}`,
        `g(x) = ${dist2}`,
        `g(x) = ${shiftedFuncLatex.replace(q, -q).replace(p, -p)}`,
      ],
      steps: [
        `Wzór po przesunięciu o $$[p, q]$$: $$g(x) = f(x-p) + q$$`,
        `$$g(x) = ${shiftedFuncLatex}$$`,
      ],
    });
  }
}

module.exports = TransformationsGenerator;
