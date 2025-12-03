const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

class PlanimetryGenerator extends BaseGenerator {
  generate() {
    const variants = [
      // STARE (7) - usunięto right_triangle_trig
      "circle_angles",
      "triangle_similarity",
      "rhombus_area",
      "circle_tangent",
      "triangle_area_sin",
      "quadrilateral_angles",
      "isosceles_angles",

      // NOWE (15)
      "pythagoras_simple",
      "angles_lines",
      "triangle_angles_sum",
      "parallelogram_neighbor",
      "circle_area_circumference",
      "sector_area",
      "arc_length",
      "equilateral_triangle",
      "thales_theorem",
      "cyclic_quadrilateral",
      "tangential_quadrilateral",
      "inradius_right_triangle",
      "circumradius_right_triangle",
      "rhombus_angles",
      "trapezoid_area",
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // NOWE
      case "pythagoras_simple":
        return this.generatePythagoras();
      case "angles_lines":
        return this.generateAnglesLines();
      case "triangle_angles_sum":
        return this.generateTriangleAnglesSum();
      case "parallelogram_neighbor":
        return this.generateParallelogramNeighbor();
      case "circle_area_circumference":
        return this.generateCircleAreaCircumference();
      case "sector_area":
        return this.generateSectorArea();
      case "arc_length":
        return this.generateArcLength();
      case "equilateral_triangle":
        return this.generateEquilateralTriangle();
      case "thales_theorem":
        return this.generateThalesTheorem();
      case "cyclic_quadrilateral":
        return this.generateCyclicQuadrilateral();
      case "tangential_quadrilateral":
        return this.generateTangentialQuadrilateral();
      case "inradius_right_triangle":
        return this.generateInradiusRightTriangle();
      case "circumradius_right_triangle":
        return this.generateCircumradiusRightTriangle();
      case "rhombus_angles":
        return this.generateRhombusAngles();
      case "trapezoid_area":
        return this.generateTrapezoidArea();

      // STARE
      case "circle_angles":
        return this.generateCircleAngles();
      case "triangle_similarity":
        return this.generateSimilarity();
      case "rhombus_area":
        return this.generateRhombus();
      case "circle_tangent":
        return this.generateCircleTangent();
      case "triangle_area_sin":
        return this.generateTriangleAreaSin();
      case "quadrilateral_angles":
        return this.generateQuadrilateralAngles();
      case "isosceles_angles":
        return this.generateIsoscelesAngles();

      default:
        return this.generateCircleAngles();
    }
  }

  // =================================================================
  // IMPLEMENTACJA METOD
  // =================================================================

  // --- 1. TWIERDZENIE PITAGORASA ---
  generatePythagoras() {
    const triple = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [8, 15, 17],
      [9, 12, 15],
    ]);
    const mode = MathUtils.randomElement(["hypotenuse", "leg"]);
    const [a, b, c] = triple;

    return this.createResponse({
      question:
        mode === "hypotenuse"
          ? `W trójkącie prostokątnym przyprostokątne mają długości $$${a}$$ i $$${b}$$. Przeciwprostokątna ma długość:`
          : `W trójkącie prostokątnym jedna przyprostokątna ma długość $$${a}$$, a przeciwprostokątna $$${c}$$. Druga przyprostokątna ma długość:`,
      latex: ``,
      image: this.generateSVG({
        type: "right_triangle_basic",
        a,
        b,
        c,
        missing: mode === "hypotenuse" ? "c" : "b",
      }),
      variables: { a, b, c },
      correctAnswer: `${mode === "hypotenuse" ? c : b}`,
      distractors: [
        `${mode === "hypotenuse" ? a + b : c - a}`,
        `${Math.sqrt(mode === "hypotenuse" ? a * a + b * b + 1 : c * c - a * a - 1).toFixed(1)}`,
        `${mode === "hypotenuse" ? Math.abs(a - b) : c + a}`,
      ],
      steps: [
        `Twierdzenie Pitagorasa: $$a^2 + b^2 = c^2$$`,
        mode === "hypotenuse"
          ? `$$c^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c} \\implies c = ${c}$$`
          : `$$b^2 = c^2 - a^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b} \\implies b = ${b}$$`,
      ],
    });
  }

  // --- 2. KĄTY WIERZCHOŁKOWE / PRZYLEGŁE ---
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
      image: this.generateSVG({ type: "intersecting_lines", alpha, mode }),
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

  // --- 3. SUMA KĄTÓW W TRÓJKĄCIE ---
  generateTriangleAnglesSum() {
    const a = MathUtils.randomInt(30, 80);
    const b = MathUtils.randomInt(30, 180 - a - 10);
    const c = 180 - a - b;

    return this.createResponse({
      question: `Dwa kąty trójkąta mają miary $$${a}^\\circ$$ i $$${b}^\\circ$$. Trzeci kąt tego trójkąta ma miarę:`,
      latex: ``,
      image: this.generateSVG({ type: "triangle_angles", a, b, c }),
      variables: { a, b, c },
      correctAnswer: `${c}^\\circ`,
      distractors: [
        `${180 - a}^\\circ`,
        `${180 - b}^\\circ`,
        `${a + b}^\\circ`,
      ],
      steps: [
        `Suma kątów w trójkącie wynosi $$180^\\circ$$.`,
        `$$180^\\circ - (${a}^\\circ + ${b}^\\circ) = 180^\\circ - ${a + b}^\\circ = ${c}^\\circ$$`,
      ],
    });
  }

  // --- 4. KĄTY SĄSIEDNIE W RÓWNOLEGŁOBOKU ---
  generateParallelogramNeighbor() {
    const alpha = MathUtils.randomInt(40, 80);
    const beta = 180 - alpha;
    return this.createResponse({
      question: `Kąt ostry równoległoboku ma miarę $$${alpha}^\\circ$$. Miara kąta rozwartego tego równoległoboku jest równa:`,
      latex: ``,
      image: this.generateSVG({ type: "parallelogram", angle: alpha }),
      variables: { alpha, beta },
      correctAnswer: `${beta}^\\circ`,
      distractors: [
        `${90 - alpha}^\\circ`,
        `${alpha}^\\circ`,
        `${2 * alpha}^\\circ`,
      ],
      steps: [
        `Suma kątów przy jednym boku równoległoboku wynosi $$180^\\circ$$.`,
        `$$180^\\circ - ${alpha}^\\circ = ${beta}^\\circ$$`,
      ],
    });
  }

  // --- 5. POLE / OBWÓD KOŁA ---
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
        image: this.generateSVG({ type: "circle_r", r }),
        variables: { r },
        correctAnswer: `${r * r}\\pi`,
        distractors: [`${2 * r}\\pi`, `${r}\\pi`, `${r * r}`],
        steps: [`$$P = \\pi r^2 = \\pi \\cdot ${r}^2 = ${r * r}\\pi$$`],
      });
    } else if (mode === "circ_from_r") {
      return this.createResponse({
        question: `Obwód koła o promieniu $$${r}$$ jest równy:`,
        latex: `r=${r}`,
        image: this.generateSVG({ type: "circle_r", r }),
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
        image: this.generateSVG({ type: "circle_r", r }),
        variables: { area, r },
        correctAnswer: `${r}`,
        distractors: [`${area}`, `${area / 2}`, `${Math.sqrt(area) * 2}`],
        steps: [
          `$$P = \\pi r^2 \\implies ${area}\\pi = \\pi r^2 \\implies r^2 = ${area} \\implies r = ${r}$$`,
        ],
      });
    }
  }

  // --- 6. POLE WYCINKA KOŁA ---
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
      image: this.generateSVG({ type: "sector", r: niceR, alpha }),
      variables: { niceR, alpha },
      correctAnswer: `${niceSector}\\pi`,
      distractors: [
        `${niceSector * 2}\\pi`,
        `${niceTotal}\\pi`,
        `${niceSector}`,
      ],
      steps: [
        `Wzór: $$P_w = \\frac{\\alpha}{360^\\circ} \\cdot \\pi r^2$$`,
        `$$P_w = \\frac{${alpha}}{360} \\cdot \\pi \\cdot ${niceR}^2 = \\frac{1}{${360 / alpha}} \\cdot ${niceTotal}\\pi = ${niceSector}\\pi$$`,
      ],
    });
  }

  // --- 7. DŁUGOŚĆ ŁUKU ---
  generateArcLength() {
    const alpha = MathUtils.randomElement([60, 90, 120, 180]);
    let niceR = 6;
    if (alpha === 90) niceR = 4;
    const niceLen = (alpha / 360) * 2 * niceR;

    return this.createResponse({
      question: `Długość łuku okręgu o promieniu $$${niceR}$$ i kącie środkowym $$${alpha}^\\circ$$ wynosi:`,
      latex: `r=${niceR}, \\alpha=${alpha}^\\circ`,
      image: this.generateSVG({ type: "sector", r: niceR, alpha }),
      variables: { niceR, alpha },
      correctAnswer: `${niceLen}\\pi`,
      distractors: [
        `${niceLen * niceR}\\pi`,
        `${niceLen / 2}\\pi`,
        `${2 * niceR}\\pi`,
      ],
      steps: [
        `Wzór: $$L = \\frac{\\alpha}{360^\\circ} \\cdot 2\\pi r$$`,
        `$$L = \\frac{${alpha}}{360} \\cdot 2\\pi \\cdot ${niceR} = \\frac{1}{${360 / alpha}} \\cdot ${2 * niceR}\\pi = ${niceLen}\\pi$$`,
      ],
    });
  }

  // --- 8. TRÓJKĄT RÓWNOBOCZNY ---
  generateEquilateralTriangle() {
    const a = MathUtils.randomInt(2, 8) * 2;
    const mode = MathUtils.randomElement(["height", "area"]);

    if (mode === "height") {
      return this.createResponse({
        question: `Wysokość trójkąta równobocznego o boku $$${a}$$ jest równa:`,
        latex: `a=${a}`,
        image: this.generateSVG({ type: "equilateral", a }),
        variables: { a },
        correctAnswer: `${a / 2}\\sqrt{3}`,
        distractors: [`${a}\\sqrt{3}`, `${a / 2}`, `${a * a}\\sqrt{3}`],
        steps: [
          `$$h = \\frac{a\\sqrt{3}}{2} = \\frac{${a}\\sqrt{3}}{2} = ${a / 2}\\sqrt{3}$$`,
        ],
      });
    } else {
      const P = (a * a) / 4;
      return this.createResponse({
        question: `Pole trójkąta równobocznego o boku $$${a}$$ jest równe:`,
        latex: `a=${a}`,
        image: this.generateSVG({ type: "equilateral", a }),
        variables: { a },
        correctAnswer: `${P}\\sqrt{3}`,
        distractors: [`${P * 4}\\sqrt{3}`, `${P}`, `${a}\\sqrt{3}`],
        steps: [
          `$$P = \\frac{a^2\\sqrt{3}}{4} = \\frac{${a * a}\\sqrt{3}}{4} = ${P}\\sqrt{3}$$`,
        ],
      });
    }
  }

  // --- 9. TALES (KĄT NA PÓŁOKRĘGU) ---
  generateThalesTheorem() {
    const alpha = MathUtils.randomInt(20, 70);
    const beta = 90 - alpha;
    return this.createResponse({
      question: `Trójkąt $$ABC$$ jest wpisany w okrąg o średnicy $$AB$$. Kąt przy wierzchołku $$A$$ ma miarę $$${alpha}^\\circ$$. Kąt przy wierzchołku $$B$$ ma miarę:`,
      latex: ``,
      image: this.generateSVG({ type: "thales", alpha }),
      variables: { alpha, beta },
      correctAnswer: `${beta}^\\circ`,
      distractors: [
        `${alpha}^\\circ`,
        `${90 + alpha}^\\circ`,
        `${180 - alpha}^\\circ`,
      ],
      steps: [
        `Kąt wpisany oparty na średnicy jest prosty ($$90^\\circ$$).`,
        `$$\\beta = 180^\\circ - 90^\\circ - ${alpha}^\\circ = ${beta}^\\circ$$`,
      ],
    });
  }

  // --- 10. CZWOROKĄT WPISANY ---
  generateCyclicQuadrilateral() {
    const alpha = MathUtils.randomInt(50, 130);
    const gamma = 180 - alpha;
    return this.createResponse({
      question: `Czworokąt $$ABCD$$ jest wpisany w okrąg. Kąt $$A$$ ma $$${alpha}^\\circ$$. Kąt $$C$$ ma miarę:`,
      latex: ``,
      image: this.generateSVG({ type: "cyclic_quad", alpha }),
      variables: { alpha, gamma },
      correctAnswer: `${gamma}^\\circ`,
      distractors: [
        `${alpha}^\\circ`,
        `${180 + alpha}^\\circ`,
        `${360 - alpha}^\\circ`,
      ],
      steps: [
        `Suma przeciwległych kątów wynosi $$180^\\circ$$.`,
        `$$180^\\circ - ${alpha}^\\circ = ${gamma}^\\circ$$`,
      ],
    });
  }

  // --- 11. CZWOROKĄT OPISANY ---
  generateTangentialQuadrilateral() {
    const a = MathUtils.randomInt(3, 10);
    const b = MathUtils.randomInt(3, 10);
    const c = MathUtils.randomInt(3, 10);
    const d = a + c - b;
    if (d <= 0) return this.generateTangentialQuadrilateral();

    return this.createResponse({
      question: `W czworokąt $$ABCD$$ można wpisać okrąg. Boki $$AB$$, $$BC$$, $$CD$$ mają długości $$${a}$$, $$${b}$$, $$${c}$$. Długość $$DA$$ wynosi:`,
      latex: ``,
      image: this.generateSVG({ type: "tangential_quad", a, b, c, d }),
      variables: { a, b, c, d },
      correctAnswer: `${d}`,
      distractors: [`${a + b + c}`, `${Math.abs(a - c)}`, `${a + c}`],
      steps: [
        `$$AB + CD = BC + DA$$`,
        `$$${a} + ${c} = ${b} + d \\implies d = ${d}$$`,
      ],
    });
  }

  // --- 12. PROMIEŃ WPISANY W TRÓJKĄT PROSTOKĄTNY ---
  generateInradiusRightTriangle() {
    const [a, b, c] = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
    ]);
    const r = (a + b - c) / 2;
    return this.createResponse({
      question: `Przyprostokątne trójkąta prostokątnego mają długości $$${a}$$ i $$${b}$$. Promień okręgu wpisanego wynosi:`,
      latex: ``,
      image: this.generateSVG({ type: "right_triangle_basic", a, b, c }),
      variables: { a, b, c, r },
      correctAnswer: `${r}`,
      distractors: [`${r * 2}`, `${c / 2}`, `${(a + b) / 2}`],
      steps: [
        `$$c = ${c}$$`,
        `$$r = \\frac{a+b-c}{2} = \\frac{${a}+${b}-${c}}{2} = ${r}$$`,
      ],
    });
  }

  // --- 13. PROMIEŃ OPISANY NA TRÓJKĄCIE PROSTOKĄTNYM ---
  generateCircumradiusRightTriangle() {
    const [a, b, c] = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [10, 24, 26],
    ]);
    const R = c / 2;
    return this.createResponse({
      question: `Przyprostokątne trójkąta prostokątnego mają długości $$${a}$$ i $$${b}$$. Promień okręgu opisanego wynosi:`,
      latex: ``,
      image: this.generateSVG({ type: "right_triangle_basic", a, b, c }),
      variables: { a, b, c, R },
      correctAnswer: `${R}`,
      distractors: [`${c}`, `${(a + b) / 2}`, `${(a + b - c) / 2}`],
      steps: [`$$c=${c}$$`, `$$R = c/2 = ${c}/2 = ${R}$$`],
    });
  }

  // --- 14. KĄTY W ROMBIE ---
  generateRhombusAngles() {
    const alpha = MathUtils.randomInt(20, 70);
    const obtuse = 180 - 2 * alpha;
    return this.createResponse({
      question: `Kąt między dłuższą przekątną a bokiem rombu ma miarę $$${alpha}^\\circ$$. Kąt rozwarty tego rombu ma miarę:`,
      latex: ``,
      image: this.generateSVG({ type: "rhombus_angles", alpha }),
      variables: { alpha, obtuse },
      correctAnswer: `${obtuse}^\\circ`,
      distractors: [
        `${2 * alpha}^\\circ`,
        `${90 + alpha}^\\circ`,
        `${180 - alpha}^\\circ`,
      ],
      steps: [
        `Kąt przy wierzchołku = $$2 \\cdot ${alpha}^\\circ$$. Kąt rozwarty = $$180^\\circ - ${2 * alpha}^\\circ = ${obtuse}^\\circ$$`,
      ],
    });
  }

  // --- 15. POLE TRAPEZU ---
  generateTrapezoidArea() {
    const a = MathUtils.randomInt(6, 12);
    const b = MathUtils.randomInt(2, a - 2);
    const h = MathUtils.randomInt(2, 6);
    const area = 0.5 * (a + b) * h;
    return this.createResponse({
      question: `Trapez ma podstawy $$${a}$$ i $$${b}$$ oraz wysokość $$${h}$$. Pole wynosi:`,
      latex: ``,
      image: this.generateSVG({ type: "trapezoid", a, b, h }),
      variables: { a, b, h, area },
      correctAnswer: `${area}`,
      distractors: [`${(a + b) * h}`, `${area * 2}`, `${a * b * h}`],
      steps: [`$$P = \\frac{${a}+${b}}{2} \\cdot ${h} = ${area}$$`],
    });
  }

  // --- STARE METODY ---
  generateCircleAngles() {
    const alpha = MathUtils.randomInt(20, 70);
    const beta = 2 * alpha;
    const mode = MathUtils.randomElement(["find_central", "find_inscribed"]);
    return this.createResponse({
      question:
        mode === "find_central"
          ? `Kąt wpisany $$\\alpha=${alpha}^\\circ$$. Kąt środkowy $$\\beta$$ to:`
          : `Kąt środkowy $$\\beta=${beta}^\\circ$$. Kąt wpisany $$\\alpha$$ to:`,
      latex: ``,
      image: this.generateSVG({ type: "circle_angles", alpha, beta }),
      variables: { alpha, beta },
      correctAnswer:
        mode === "find_central" ? `${beta}^\\circ` : `${alpha}^\\circ`,
      distractors: [
        `${180 - alpha}^\\circ`,
        `${alpha}^\\circ`,
        `${beta}^\\circ`,
      ],
      steps: [`$$2\\alpha = \\beta$$`],
    });
  }

  generateSimilarity() {
    const P1 = MathUtils.randomInt(2, 10);
    const k = MathUtils.randomInt(2, 5);
    const P2 = P1 * k * k;
    return this.createResponse({
      question: `Trójkąt $$T_1$$ jest podobny do $$T_2$$ w skali $$k=${k}$$. Pole $$T_1$$ wynosi $$${P1}$$. Pole $$T_2$$ to:`,
      latex: ``,
      image: this.generateSVG({ type: "similarity", k }),
      variables: { P1, k },
      correctAnswer: `${P2}`,
      distractors: [`${P1 * k}`, `${P1 + k}`, `${P1 * k * 2}`],
      steps: [`$$P_2 = P_1 \\cdot k^2$$`],
    });
  }

  generateRhombus() {
    const d1 = MathUtils.randomInt(4, 12) * 2;
    const d2 = MathUtils.randomInt(3, 8) * 2;
    const area = (d1 * d2) / 2;
    return this.createResponse({
      question: `Pole rombu o przekątnych $$${d1}$$ i $$${d2}$$ wynosi:`,
      latex: ``,
      image: this.generateSVG({ type: "rhombus", d1, d2 }),
      variables: { d1, d2 },
      correctAnswer: `${area}`,
      distractors: [`${d1 * d2}`, `${d1 + d2}`, `${area * 2}`],
      steps: [`$$P = \\frac{d_1 d_2}{2}$$`],
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
      image: this.generateSVG({ type: "circle_tangent", r, d, x }),
      variables: { r, x, d },
      correctAnswer: mode === "find_tangent" ? `${x}` : `${d}`,
      distractors: [`${d - r}`, `${x + r}`, `${d + r}`],
      steps: [`$$r^2 + x^2 = d^2$$`],
    });
  }

  generateTriangleAreaSin() {
    const a = MathUtils.randomInt(4, 10);
    const b = MathUtils.randomInt(4, 10);
    const alpha = 30; // Uproszczenie dla starej metody
    const area = (a * b) / 4;
    return this.createResponse({
      question: `Boki $$${a}, ${b}$$, kąt $$30^\\circ$$. Pole trójkąta:`,
      latex: ``,
      image: this.generateSVG({ type: "triangle_sas", a, b, alpha }),
      variables: { a, b },
      correctAnswer: `${area}`,
      distractors: [`${a * b}`, `${a + b}`, `${(a * b) / 2}`],
      steps: [`$$P = \\frac{1}{2}ab \\sin\\alpha$$`],
    });
  }

  generateQuadrilateralAngles() {
    const alpha = MathUtils.randomInt(40, 80);
    return this.createResponse({
      question: `Kąt ostry równoległoboku to $$${alpha}^\\circ$$. Rozwarty to:`,
      latex: ``,
      image: this.generateSVG({ type: "parallelogram", angle: alpha }),
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

  generateIsoscelesAngles() {
    const base = 70;
    return this.createResponse({
      question: `Kąt przy podstawie to $$${base}^\\circ$$. Kąt wierzchołka:`,
      latex: ``,
      image: this.generateSVG({ type: "isosceles", baseAngle: base }),
      variables: { base },
      correctAnswer: `${180 - 2 * base}^\\circ`,
      distractors: [
        `${base}^\\circ`,
        `${180 - base}^\\circ`,
        `${90 - base}^\\circ`,
      ],
      steps: [`$$180 - 2\\cdot${base}$$`],
    });
  }

  // --- SVG GENERATOR ---
  generateSVG(params) {
    const size = 300;
    const center = size / 2;
    const drawPoly = (pts) =>
      `<polygon points="${pts.map((p) => `${p.x},${p.y}`).join(" ")}" stroke="black" stroke-width="2" fill="none" />`;
    const drawText = (x, y, txt, col = "black") =>
      `<text x="${x}" y="${y}" fill="${col}" font-size="14">${txt}</text>`;
    const drawLine = (x1, y1, x2, y2, col = "black", dash = false) =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="2" ${dash ? 'stroke-dasharray="4"' : ""} />`;
    const drawCircle = (cx, cy, r, col = "black", fill = "none") =>
      `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="${col}" stroke-width="2" fill="${fill}" />`;

    let content = "";

    if (params.type === "circle_angles") {
      const r = 80;
      const A = {
        x: center + r * Math.cos(2.1),
        y: center + r * Math.sin(2.1),
      };
      const B = {
        x: center + r * Math.cos(1.0),
        y: center + r * Math.sin(1.0),
      };
      const C = {
        x: center + r * Math.cos(-1.5),
        y: center + r * Math.sin(-1.5),
      };
      content += drawCircle(center, center, r);
      content += `<circle cx="${center}" cy="${center}" r="3" fill="black"/>`;
      content += drawLine(C.x, C.y, A.x, A.y, "blue");
      content += drawLine(C.x, C.y, B.x, B.y, "blue");
      content += drawLine(center, center, A.x, A.y, "red", true);
      content += drawLine(center, center, B.x, B.y, "red", true);
      content += drawText(C.x, C.y - 10, "α", "blue");
      content += drawText(center + 5, center + 20, "β", "red");
    } else if (params.type === "circle_tangent") {
      const scale = 15;
      const r = params.r * scale;
      const d = params.d * scale;
      const angle = Math.acos(params.r / params.d);
      const Sx = 50 + r * Math.cos(angle);
      const Sy = 150 - r * Math.sin(angle);
      content += drawCircle(50, 150, r);
      content += drawLine(50, 150, 50 + d, 150);
      content += drawLine(50, 150, Sx, Sy, "red");
      content += drawLine(50 + d, 150, Sx, Sy, "blue");
      content += drawText(40, 140, "r", "red");
      content += drawText(50 + d / 2, 170, "d");
      content += drawText(Sx + 10, Sy - 10, "x", "blue");
    } else if (params.type === "triangle_sas" || params.type === "isosceles") {
      const p1 = { x: 50, y: 250 };
      const p2 = { x: 250, y: 250 };
      let p3;
      if (params.type === "isosceles") {
        const h = 100 * Math.tan((params.baseAngle * Math.PI) / 180);
        p3 = { x: 150, y: 250 - Math.min(h, 200) };
        content += drawPoly([p1, p2, p3]);
        content += drawText(70, 240, "α");
        content += drawText(220, 240, "α");
      } else {
        const angleRad = (params.alpha * Math.PI) / 180;
        p3 = {
          x: 50 + 150 * Math.cos(angleRad),
          y: 250 - 150 * Math.sin(angleRad),
        };
        content += drawPoly([p1, p2, p3]);
        content += drawText(80, 240, `${params.alpha}°`);
      }
    } else if (params.type === "trapezoid" || params.type === "parallelogram") {
      if (params.h) {
        const scale = 15;
        const w1 = params.a * scale;
        const w2 = params.b * scale;
        const h = params.h * scale;
        const off = (w1 - w2) / 2;
        const x0 = 50;
        const y0 = 250;
        content += drawPoly([
          { x: x0, y: y0 },
          { x: x0 + w1, y: y0 },
          { x: x0 + w1 - off, y: y0 - h },
          { x: x0 + off, y: y0 - h },
        ]);
        content += drawLine(x0 + off, y0, x0 + off, y0 - h, "blue", true);
        content += drawText(x0 + off + 5, y0 - h / 2, `h`, "blue");
      } else {
        const h = 100;
        const w = 120;
        const shift = h / Math.tan((params.angle * Math.PI) / 180);
        const p1 = { x: 50, y: 200 };
        const p2 = { x: 50 + w, y: 200 };
        const p3 = {
          x: 50 + w + (params.type === "trapezoid" ? -shift : shift),
          y: 200 - h,
        };
        const p4 = { x: 50 + shift, y: 200 - h };
        content += drawPoly([p1, p2, p3, p4]);
        content += drawText(70, 190, `${params.angle}°`);
      }
    } else if (
      params.type === "right_triangle" ||
      params.type === "right_triangle_basic"
    ) {
      const scale = 12;
      const w = params.b * scale;
      const h = params.a * scale;
      const x0 = 50,
        y0 = 250;
      content += drawPoly([
        { x: x0, y: y0 },
        { x: x0 + w, y: y0 },
        { x: x0, y: y0 - h },
      ]);
      content += `<rect x="${x0}" y="${y0 - 15}" width="15" height="15" fill="none" stroke="black" />`;
      if (params.type === "right_triangle_basic" && params.missing) {
        if (params.missing !== "b")
          content += drawText(x0 + w / 2, y0 + 20, `b=${params.b}`);
        if (params.missing !== "a")
          content += drawText(x0 - 20, y0 - h / 2, `a=${params.a}`);
      }
    } else if (params.type === "rhombus" || params.type === "rhombus_angles") {
      const scale = 15;
      const dx = params.d2 ? (params.d2 * scale) / 2 : 100;
      const dy = params.d1 ? (params.d1 * scale) / 2 : 60;
      const p1 = { x: center, y: center - dy };
      const p2 = { x: center + dx, y: center };
      const p3 = { x: center, y: center + dy };
      const p4 = { x: center - dx, y: center };
      content += drawPoly([p1, p2, p3, p4]);
      content += drawLine(p1.x, p1.y, p3.x, p3.y, "red", true);
      content += drawLine(p2.x, p2.y, p4.x, p4.y, "blue", true);
      if (params.type === "rhombus_angles")
        content += drawText(center + 20, center - 10, `${params.alpha}°`);
    } else if (params.type === "similarity") {
      const h1 = 40,
        w1 = 30;
      const h2 = h1 * 1.5,
        w2 = w1 * 1.5;
      const drawTri = (x, y, w, h, label) =>
        `<polygon points="${x},${y} ${x + w},${y} ${x},${y - h}" stroke="black" fill="none" stroke-width="2"/><text x="${x + w / 3}" y="${y - h / 3}" font-size="12">${label}</text>`;
      content += drawTri(50, 200, w1, h1, "T1");
      content += drawTri(150, 200, w2, h2, "T2");
    } else if (params.type === "intersecting_lines") {
      content += drawLine(50, 50, 250, 250);
      content += drawLine(50, 250, 250, 50);
      content += drawText(140, 90, "α");
      content += drawText(140, params.mode === "vertical" ? 220 : 150, "β");
    } else if (params.type === "triangle_angles") {
      content += drawPoly([
        { x: 50, y: 250 },
        { x: 250, y: 250 },
        { x: 150, y: 100 },
      ]);
      content += drawText(70, 240, `${params.a}°`);
      content += drawText(210, 240, `${params.b}°`);
    } else if (params.type === "circle_r" || params.type === "sector") {
      const r = 80;
      content += drawCircle(center, center, r);
      content += `<circle cx="${center}" cy="${center}" r="3" fill="black"/>`;
      content += drawLine(center, center, center + r, center);
      if (params.type === "sector") {
        const rad = (-params.alpha * Math.PI) / 180;
        const x = center + r * Math.cos(rad);
        const y = center + r * Math.sin(rad);
        content += drawLine(center, center, x, y);
        content += `<path d="M ${center + 20} ${center} A 20 20 0 0 0 ${center + 20 * Math.cos(rad)} ${center + 20 * Math.sin(rad)}" stroke="black" fill="none"/>`;
      }
    } else if (params.type === "equilateral") {
      const a = 150;
      const h = (a * Math.sqrt(3)) / 2;
      content += drawPoly([
        { x: center - a / 2, y: 250 },
        { x: center + a / 2, y: 250 },
        { x: center, y: 250 - h },
      ]);
      content += drawLine(center, 250, center, 250 - h, "blue", true);
    } else if (params.type === "thales") {
      const r = 80;
      content += drawCircle(center, center, r);
      content += drawLine(center - r, center, center + r, center);
      const rad = -1.2;
      const cx = center + r * Math.cos(rad);
      const cy = center + r * Math.sin(rad);
      content += drawLine(center - r, center, cx, cy);
      content += drawLine(center + r, center, cx, cy);
    } else if (
      params.type === "cyclic_quad" ||
      params.type === "tangential_quad"
    ) {
      const r = 80;
      content += drawCircle(center, center, r);
      const pts = [0, 1.5, 3, 4.5].map((a) => ({
        x: center + r * Math.cos(a),
        y: center + r * Math.sin(a),
      }));
      content += drawPoly(pts);
    }

    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">${content}</svg>`;
  }

  // Helper for GCD
  getGCD(a, b) {
    return b ? this.getGCD(b, a % b) : a;
  }
}

module.exports = PlanimetryGenerator;
