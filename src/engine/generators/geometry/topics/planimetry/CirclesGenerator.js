const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");
const PlanimetrySVGUtils = require("./PlanimetrySVGUtils");

class CirclesGenerator extends BaseGenerator {
  generateCircleAngles() {
    const alpha = MathUtils.randomInt(20, 70);
    const beta = 2 * alpha;
    const mode = MathUtils.randomElement(["find_central", "find_inscribed"]);

    return this.createResponse({
      question:
        mode === "find_central"
          ? `Punkt $$O$$ jest środkiem okręgu. Kąt wpisany $$\\alpha$$ ma miarę $$${alpha}^\\circ$$. Miara kąta środkowego $$\\beta$$ opartego na tym samym łuku jest równa:`
          : `Punkt $$O$$ jest środkiem okręgu. Kąt środkowy $$\\beta$$ ma miarę $$${beta}^\\circ$$. Miara kąta wpisanego $$\\alpha$$ opartego na tym samym łuku jest równa:`,
      latex:
        mode === "find_central"
          ? `\\alpha = ${alpha}^\\circ`
          : `\\beta = ${beta}^\\circ`,
      image: PlanimetrySVGUtils.generateSVG({
        type: "circle_angles",
        alpha,
        beta,
      }),
      variables: { alpha, beta, mode },
      correctAnswer:
        mode === "find_central" ? `${beta}^\\circ` : `${alpha}^\\circ`,
      distractors:
        mode === "find_central"
          ? [`${alpha}^\\circ`, `${180 - alpha}^\\circ`, `${90 + alpha}^\\circ`]
          : [`${beta}^\\circ`, `${beta * 2}^\\circ`, `${180 - beta}^\\circ`],
      steps: [
        `Zależność: $$\\beta = 2\\alpha$$`,
        mode === "find_central"
          ? `$$\\beta = 2 \\cdot ${alpha}^\\circ = ${beta}^\\circ$$`
          : `$$\\alpha = ${beta}^\\circ : 2 = ${alpha}^\\circ$$`,
      ],
    });
  }

  generateCircleAreaCircumference() {
    const r = MathUtils.randomInt(2, 9);
    const mode = MathUtils.randomElement([
      "area_from_r",
      "circ_from_r",
      "r_from_area",
    ]);

    if (mode === "area_from_r") {
      return this.createResponse({
        question: `Pole koła o promieniu $$${r}$$ jest równe:`,
        latex: `r=${r}`,
        image: PlanimetrySVGUtils.generateSVG({ type: "circle_r", r }),
        variables: { r },
        correctAnswer: `${r * r}\\pi`,
        distractors: [`${2 * r}\\pi`, `${r}\\pi`, `${r * r}`],
        steps: [`$$P = \\pi r^2 = \\pi \\cdot ${r}^2 = ${r * r}\\pi$$`],
      });
    } else if (mode === "circ_from_r") {
      return this.createResponse({
        question: `Obwód koła o promieniu $$${r}$$ jest równy:`,
        latex: `r=${r}`,
        image: PlanimetrySVGUtils.generateSVG({ type: "circle_r", r }),
        variables: { r },
        correctAnswer: `${2 * r}\\pi`,
        distractors: [`${r * r}\\pi`, `${r}\\pi`, `${2 * r}`],
        steps: [`$$L = 2\\pi r = 2\\pi \\cdot ${r} = ${2 * r}\\pi$$`],
      });
    } else {
      const area = r * r;
      return this.createResponse({
        question: `Pole koła jest równe $$${area}\\pi$$. Promień tego koła wynosi:`,
        latex: `P=${area}\\pi`,
        image: PlanimetrySVGUtils.generateSVG({ type: "circle_r", r }),
        variables: { area, r },
        correctAnswer: `${r}`,
        distractors: [`${area}`, `${area / 2}`, `${Math.sqrt(area) * 2}`],
        steps: [`$$P = \\pi r^2 \\implies r^2 = ${area} \\implies r = ${r}$$`],
      });
    }
  }

  generateSectorArea() {
    const alpha = MathUtils.randomElement([30, 45, 60, 90, 120]);
    let niceR = 6;
    if (alpha === 45) niceR = 4;
    if (alpha === 60) niceR = 6;
    const niceTotal = niceR * niceR;
    const niceSector = (niceTotal * alpha) / 360;

    return this.createResponse({
      question: `Pole wycinka koła o promieniu $$${niceR}$$ i kącie środkowym $$${alpha}^\\circ$$ jest równe:`,
      latex: `r=${niceR}, \\alpha=${alpha}^\\circ`,
      image: PlanimetrySVGUtils.generateSVG({
        type: "sector",
        r: niceR,
        alpha,
      }),
      variables: { niceR, alpha },
      correctAnswer: `${niceSector}\\pi`,
      distractors: [
        `${niceSector * 2}\\pi`,
        `${niceTotal}\\pi`,
        `${niceSector}`,
      ],
      steps: [
        `$$P_w = \\frac{${alpha}}{360} \\cdot \\pi \\cdot ${niceR}^2 = ${niceSector}\\pi$$`,
      ],
    });
  }

  generateArcLength() {
    const alpha = MathUtils.randomElement([60, 90, 120, 180]);
    let niceR = 6;
    if (alpha === 90) niceR = 4;
    const niceLen = (alpha / 360) * 2 * niceR;

    return this.createResponse({
      question: `Długość łuku okręgu o promieniu $$${niceR}$$ i kącie środkowym $$${alpha}^\\circ$$ wynosi:`,
      latex: `r=${niceR}, \\alpha=${alpha}^\\circ`,
      image: PlanimetrySVGUtils.generateSVG({
        type: "sector",
        r: niceR,
        alpha,
      }),
      variables: { niceR, alpha },
      correctAnswer: `${niceLen}\\pi`,
      distractors: [
        `${niceLen * niceR}\\pi`,
        `${niceLen / 2}\\pi`,
        `${2 * niceR}\\pi`,
      ],
      steps: [
        `$$L = \\frac{${alpha}}{360} \\cdot 2\\pi \\cdot ${niceR} = ${niceLen}\\pi$$`,
      ],
    });
  }

  generateThalesTheorem() {
    const alpha = MathUtils.randomInt(20, 70);
    const beta = 90 - alpha;
    return this.createResponse({
      question: `Trójkąt $$ABC$$ wpisany w okrąg o średnicy $$AB$$. Kąt $$A$$ ma $$${alpha}^\\circ$$. Kąt $$B$$ ma:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({ type: "thales", alpha }),
      variables: { alpha, beta },
      correctAnswer: `${beta}^\\circ`,
      distractors: [
        `${alpha}^\\circ`,
        `${90 + alpha}^\\circ`,
        `${180 - alpha}^\\circ`,
      ],
      steps: [`Kąt $$C = 90^\\circ$$. $$\\beta = 90 - ${alpha} = ${beta}$$`],
    });
  }

  generateCircleTangent() {
    const [r, x, d] = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [8, 15, 17],
    ]);
    const mode = MathUtils.randomElement(["find_tangent", "find_dist"]);
    return this.createResponse({
      question:
        mode === "find_tangent"
          ? `Promień $$r=${r}$$, odległość od środka $$d=${d}$$. Styczna $$x$$ ma długość:`
          : `Styczna $$x=${x}$$, promień $$r=${r}$$. Odległość $$d$$ ma długość:`,
      latex: ``,
      image: PlanimetrySVGUtils.generateSVG({
        type: "circle_tangent",
        r,
        d,
        x,
      }),
      variables: { r, x, d },
      correctAnswer: mode === "find_tangent" ? `${x}` : `${d}`,
      distractors: [`${d - r}`, `${x + r}`, `${d + r}`],
      steps: [`$$r^2 + x^2 = d^2$$`],
    });
  }
}

module.exports = CirclesGenerator;
