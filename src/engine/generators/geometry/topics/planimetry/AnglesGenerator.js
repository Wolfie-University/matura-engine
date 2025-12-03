const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const PlanimetrySVGUtils = require("./PlanimetrySVGUtils");

class AnglesGenerator extends BaseGenerator {
  generateAnglesLines() {
    const alpha = MathUtils.randomInt(30, 150);
    const beta = 180 - alpha;
    const mode = MathUtils.randomElement(["vertical", "supplementary"]);

    return this.createResponse({
      question:
        mode === "vertical"
          ? `Kąty $$\\alpha$$ i $$\\beta$$ są wierzchołkowe. Jeśli $$\\alpha = ${alpha}^\\circ$$, to $$\\beta$$ wynosi:`
          : `Kąty $$\\alpha$$ i $$\\beta$$ są przyległe. Jeśli $$\\alpha = ${alpha}^\\circ$$, to $$\\beta$$ wynosi:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "intersecting_lines",
        alpha,
        mode,
      }),
      variables: { alpha, beta, mode },
      correctAnswer: mode === "vertical" ? `${alpha}^\\circ` : `${beta}^\\circ`,
      distractors: [
        mode === "vertical" ? `${180 - alpha}^\\circ` : `${alpha}^\\circ`,
        `${90 - alpha > 0 ? 90 - alpha : alpha + 10}^\\circ`,
        `${360 - alpha}^\\circ`,
      ],
      steps: [
        mode === "vertical"
          ? `Kąty wierzchołkowe mają tę samą miarę. $$\\beta = \\alpha = ${alpha}^\\circ$$.`
          : `Suma kątów przyległych wynosi $$180^\\circ$$. $$\\beta = 180^\\circ - ${alpha}^\\circ = ${beta}^\\circ$$.`,
      ],
    });
  }
}

module.exports = AnglesGenerator;
