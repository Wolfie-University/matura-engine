const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

class TrigonometryGenerator extends BaseGenerator {
  generate() {
    const variants = [
      // STARE (5)
      "triangle_def", // Definicja sin/cos/tg w trójkącie
      "pythagorean_id", // Jedynka: sin^2 + cos^2 = 1
      "values_eval", // Wartości: sin(30) + cos(60)
      "angle_relation", // Redukcja: sin(a) = cos(90-a)
      "tg_identity", // tg = sin/cos

      // NOWE (15)
      "identity_reduction", // sin^2(20) + sin^2(70) = 1
      "calc_expr_from_trig", // Dane sin, oblicz 2cos^2 - 1
      "linear_relation", // sin = 2cos -> oblicz tg
      "simplify_basic", // (1-cos)(1+cos) -> sin^2
      "area_triangle", // P = 0.5 ab sin(alpha)
      "area_parallelogram", // P = ab sin(alpha)
      "area_rhombus", // P = a^2 sin(alpha)
      "word_ladder", // Drabina oparta o ścianę (kąt)
      "word_shadow", // Cień drzewa (tg)
      "find_angle", // tg(x) = 1 -> x = 45
      "compare_functions", // sin(20) vs sin(50)
      "tan_product_reduction", // tg(20) * tg(70) = 1
      "isosceles_arm", // Podstawa, kąt -> ramię
      "trapezoid_height", // Ramię, kąt -> wysokość
      "approx_value", // Przybliżona wartość np. sin(10)
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // NOWE
      case "identity_reduction":
        return this.generateIdentityReduction();
      case "calc_expr_from_trig":
        return this.generateCalcExprFromTrig();
      case "linear_relation":
        return this.generateLinearRelation();
      case "simplify_basic":
        return this.generateSimplifyBasic();
      case "area_triangle":
        return this.generateAreaTriangle();
      case "area_parallelogram":
        return this.generateAreaParallelogram();
      case "area_rhombus":
        return this.generateAreaRhombus();
      case "word_ladder":
        return this.generateWordLadder();
      case "word_shadow":
        return this.generateWordShadow();
      case "find_angle":
        return this.generateFindAngle();
      case "compare_functions":
        return this.generateCompareFunctions();
      case "tan_product_reduction":
        return this.generateTanProductReduction();
      case "isosceles_arm":
        return this.generateIsoscelesArm();
      case "trapezoid_height":
        return this.generateTrapezoidHeight();
      case "approx_value":
        return this.generateApproxValue();

      // STARE
      case "triangle_def":
        return this.generateTriangleDef();
      case "pythagorean_id":
        return this.generatePythagoreanIdentity();
      case "values_eval":
        return this.generateValuesEval();
      case "angle_relation":
        return this.generateAngleRelation();
      case "tg_identity":
      default:
        return this.generateTgIdentity();
    }
  }

  // =================================================================
  // NOWE METODY (V3) - ROZSZERZONA TRYGONOMETRIA
  // =================================================================

  // --- 6. TOŻSAMOŚCI Z REDUKCJĄ ---
  generateIdentityReduction() {
    // sin^2(x) + sin^2(90-x) = 1  (bo sin(90-x) = cos(x))
    const angle = MathUtils.randomInt(10, 40);
    const compl = 90 - angle;

    // Warianty: sin^2 + sin^2, cos^2 + cos^2
    const type = MathUtils.randomElement(["sin", "cos"]);

    return this.createResponse({
      question: `Wartość wyrażenia $$${type}^2 ${angle}^\\circ + ${type}^2 ${compl}^\\circ$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { angle, compl, type },
      correctAnswer: `1`,
      distractors: [`0`, `2`, `\\frac{1}{2}`],
      steps: [
        `Korzystamy ze wzoru redukcyjnego: $$${type}(${compl}^\\circ) = ${type === "sin" ? "\\cos" : "\\sin"}(90^\\circ - ${compl}^\\circ) = ${type === "sin" ? "\\cos" : "\\sin"}(${angle}^\\circ)$$`,
        `Zatem wyrażenie to: $$${type}^2 ${angle}^\\circ + ${type === "sin" ? "\\cos" : "\\sin"}^2 ${angle}^\\circ$$`,
        `Z jedynki trygonometrycznej wartość ta wynosi $$1$$.`,
      ],
    });
  }

  // --- 7. OBLICZANIE WYRAŻENIA Z DANEJ FUNKCJI ---
  generateCalcExprFromTrig() {
    // Dane sin(x) = a/b. Oblicz cos^2(x) lub inne.
    // Używamy trójek pitagorejskich
    const [a, b, c] = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
      [1, 2, Math.sqrt(5).toFixed(2)],
    ]);
    // Dla 1,2,sqrt(5) musimy uważać na formatowanie, lepiej zostać przy całkowitych trójkach dla ułamków zwykłych
    // Zostańmy przy [3,4,5] i [5,12,13]

    const triples = [
      [3, 4, 5],
      [5, 12, 13],
    ];
    const [leg1, leg2, hyp] = MathUtils.randomElement(triples);

    // Dane: sin = leg1/hyp
    // Pytanie: np. 2 - cos^2
    const qType = MathUtils.randomElement(["cos_sq", "val_expr"]);
    const sinVal = `\\frac{${leg1}}{${hyp}}`;
    const cosSqVal = (leg2 * leg2) / (hyp * hyp); // ułamek

    if (qType === "cos_sq") {
      return this.createResponse({
        question: `Kąt $$\\alpha$$ jest ostry i $$\\sin\\alpha = ${sinVal}$$. Wtedy $$\\cos^2\\alpha$$ równa się:`,
        latex: ``,
        image: null,
        variables: { leg1, hyp },
        correctAnswer: `\\frac{${leg2 * leg2}}{${hyp * hyp}}`,
        distractors: [
          `\\frac{${leg1 * leg1}}{${hyp * hyp}}`,
          `\\frac{${hyp * hyp - leg1 * leg1}}{${leg1 * leg1}}`,
          `1`,
        ],
        steps: [
          `Jedynka trygonometryczna: $$\\cos^2\\alpha = 1 - \\sin^2\\alpha$$`,
          `$$1 - (\\frac{${leg1}}{${hyp}})^2 = 1 - \\frac{${leg1 * leg1}}{${hyp * hyp}} = \\frac{${hyp * hyp - leg1 * leg1}}{${hyp * hyp}} = \\frac{${leg2 * leg2}}{${hyp * hyp}}$$`,
        ],
      });
    } else {
      // np. oblicz 3 - 2sin^2
      return this.createResponse({
        question: `Kąt $$\\alpha$$ jest ostry i $$\\cos\\alpha = \\frac{${leg2}}{${hyp}}$$. Wartość wyrażenia $$3 - 2\\sin^2\\alpha$$ wynosi:`,
        latex: ``,
        image: null,
        variables: { leg2, hyp },
        // sin^2 = (leg1/hyp)^2. 3 - 2*(leg1^2/hyp^2)
        correctAnswer: `\\frac{${3 * hyp * hyp - 2 * leg1 * leg1}}{${hyp * hyp}}`,
        distractors: [`1`, `\\frac{${hyp}}{${leg2}}`, `0`],
        steps: [
          `Obliczamy $$\\sin^2\\alpha = 1 - \\cos^2\\alpha = 1 - \\frac{${leg2 * leg2}}{${hyp * hyp}} = \\frac{${leg1 * leg1}}{${hyp * hyp}}$$`,
          `Wstawiamy: $$3 - 2(\\frac{${leg1 * leg1}}{${hyp * hyp}}) = \\frac{${3 * hyp * hyp}}{${hyp * hyp}} - \\frac{${2 * leg1 * leg1}}{${hyp * hyp}} = \\frac{${3 * hyp * hyp - 2 * leg1 * leg1}}{${hyp * hyp}}$$`,
        ],
      });
    }
  }

  // --- 8. ZALEŻNOŚĆ LINIOWA ---
  generateLinearRelation() {
    // sin = k * cos. Oblicz tg.
    const k = MathUtils.randomInt(2, 5);

    return this.createResponse({
      question: `Kąt $$\\alpha$$ jest ostry i spełnia warunek $$\\sin\\alpha = ${k}\\cos\\alpha$$. Wartość $$\\tg\\alpha$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { k },
      correctAnswer: `${k}`,
      distractors: [`\\frac{1}{${k}}`, `${k * k}`, `\\sqrt{${k}}`],
      steps: [
        `Z definicji $$\\tg\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha}$$`,
        `Podstawiamy warunek: $$\\frac{${k}\\cos\\alpha}{\\cos\\alpha} = ${k}$$`,
      ],
    });
  }

  // --- 9. UPRASZCZANIE WYRAŻEŃ ---
  generateSimplifyBasic() {
    // (1 - cos)(1 + cos) = 1 - cos^2 = sin^2
    const func = MathUtils.randomElement(["sin", "cos"]);
    const other = func === "sin" ? "cos" : "sin";

    return this.createResponse({
      question: `Dla każdego kąta ostrego $$\\alpha$$ wyrażenie $$(1 - \\${func}\\alpha)(1 + \\${func}\\alpha)$$ jest równe:`,
      latex: ``,
      image: null,
      variables: { func },
      correctAnswer: `\\${other}^2\\alpha`,
      distractors: [`\\${func}^2\\alpha`, `1`, `2\\${other}\\alpha`],
      steps: [
        `Ze wzoru skróconego mnożenia: $$1 - \\${func}^2\\alpha$$`,
        `Z jedynki trygonometrycznej: $$1 - \\${func}^2\\alpha = \\${other}^2\\alpha$$`,
      ],
    });
  }

  // --- 10. POLE TRÓJKĄTA (SINUS) ---
  generateAreaTriangle() {
    const a = MathUtils.randomInt(4, 10);
    const b = MathUtils.randomInt(4, 10);
    const angle = MathUtils.randomElement([30, 45, 60]); // znane wartości

    let sinValStr, sinValNum;
    if (angle === 30) {
      sinValStr = "1/2";
      sinValNum = 0.5;
    } else if (angle === 45) {
      sinValStr = "\\frac{\\sqrt{2}}{2}";
      sinValNum = Math.sqrt(2) / 2;
    } else {
      sinValStr = "\\frac{\\sqrt{3}}{2}";
      sinValNum = Math.sqrt(3) / 2;
    } // 60

    // Formatowanie wyniku
    let areaStr;
    const coeff = (a * b) / 2; // 0.5 * a * b

    if (angle === 30)
      areaStr = `${coeff / 2}`; // coeff * 1/2
    else if (angle === 45) areaStr = `${coeff / 2}\\sqrt{2}`;
    else areaStr = `${coeff / 2}\\sqrt{3}`;

    return this.createResponse({
      question: `Dany jest trójkąt o bokach $$${a}$$ i $$${b}$$ oraz kącie między nimi $$${angle}^\\circ$$. Pole tego trójkąta wynosi:`,
      latex: ``,
      image: this.generateSVG({ type: "triangle_sas", a, b, angle }),
      variables: { a, b, angle },
      correctAnswer: areaStr,
      distractors: [`${a * b}`, `${coeff}`, `${coeff}\\sqrt{2}`],
      steps: [
        `$$P = \\frac{1}{2}ab \\sin\\alpha$$`,
        `$$P = \\frac{1}{2} \\cdot ${a} \\cdot ${b} \\cdot ${sinValStr} = ${areaStr}$$`,
      ],
    });
  }

  // --- 11. POLE RÓWNOLEGŁOBOKU ---
  generateAreaParallelogram() {
    const a = MathUtils.randomInt(3, 8);
    const b = MathUtils.randomInt(3, 8);
    const angle = MathUtils.randomElement([30, 45, 60, 120, 135, 150]);

    let sinValStr, sinNum;
    const refAngle = angle > 90 ? 180 - angle : angle;

    if (refAngle === 30) {
      sinValStr = "\\frac{1}{2}";
      sinNum = 0.5;
    } else if (refAngle === 45) {
      sinValStr = "\\frac{\\sqrt{2}}{2}";
    } else {
      sinValStr = "\\frac{\\sqrt{3}}{2}";
    }

    let areaStr;
    if (refAngle === 30) areaStr = `${(a * b) / 2}`;
    else if (refAngle === 45) areaStr = `${(a * b) / 2}\\sqrt{2}`;
    else areaStr = `${(a * b) / 2}\\sqrt{3}`;

    return this.createResponse({
      question: `Boki równoległoboku mają długości $$${a}$$ i $$${b}$$, a kąt między nimi ma miarę $$${angle}^\\circ$$. Pole tego równoległoboku jest równe:`,
      latex: ``,
      image: this.generateSVG({ type: "parallelogram", a, b, angle }),
      variables: { a, b, angle },
      correctAnswer: areaStr,
      distractors: [`${a * b}`, `${a * b * 2}`, `${a + b}`],
      steps: [
        `$$P = ab \\sin\\alpha$$`,
        `$$P = ${a} \\cdot ${b} \\cdot ${sinValStr} = ${areaStr}$$`,
      ],
    });
  }

  // --- 12. POLE ROMBU (KĄT) ---
  generateAreaRhombus() {
    const a = MathUtils.randomInt(4, 10);
    const angle = MathUtils.randomElement([30, 45, 60]); // ostry

    // P = a^2 sin(alpha)
    let areaStr;
    if (angle === 30) areaStr = `${(a * a) / 2}`;
    else if (angle === 45) areaStr = `${(a * a) / 2}\\sqrt{2}`;
    else areaStr = `${(a * a) / 2}\\sqrt{3}`;

    return this.createResponse({
      question: `Bok rombu ma długość $$${a}$$, a kąt ostry ma miarę $$${angle}^\\circ$$. Pole tego rombu wynosi:`,
      latex: ``,
      image: this.generateSVG({ type: "rhombus_angle", a, angle }),
      variables: { a, angle },
      correctAnswer: areaStr,
      distractors: [`${a * a}`, `${a * 4}`, `${(a * a) / 4}`],
      steps: [
        `$$P = a^2 \\sin\\alpha$$`,
        `$$P = ${a}^2 \\cdot \\sin ${angle}^\\circ = ${areaStr}$$`,
      ],
    });
  }

  // --- 13. DRABINA (ZADANIE TEKSTOWE) ---
  generateWordLadder() {
    // Drabina d, oparta pod kątem alpha. Jak wysoko sięga (h)?
    // sin(alpha) = h/d => h = d * sin(alpha)
    const d = MathUtils.randomInt(4, 10) * 2; // parzyste
    const angle = MathUtils.randomElement([30, 45, 60]);

    let hStr;
    if (angle === 30) hStr = `${d / 2}`;
    else if (angle === 45) hStr = `${d / 2}\\sqrt{2}`;
    else hStr = `${d / 2}\\sqrt{3}`;

    return this.createResponse({
      question: `Drabina o długości $$${d}$$ m jest oparta o ścianę budynku pod kątem $$${angle}^\\circ$$ do podłoża. Na jaką wysokość sięga ta drabina?`,
      latex: ``,
      image: this.generateSVG({ type: "ladder", d, angle }),
      variables: { d, angle },
      correctAnswer: hStr,
      distractors: [`${d}`, `${d / 2}`, `${d / 2}\\sqrt{5}`],
      steps: [
        `Mamy trójkąt prostokątny. Przeciwprostokątna = $$${d}$$. Szukamy przyprostokątnej naprzeciw kąta.`,
        `$$\\sin ${angle}^\\circ = \\frac{h}{${d}}$$`,
        `$$h = ${d} \\cdot \\sin ${angle}^\\circ = ${hStr}$$`,
      ],
    });
  }

  // --- 14. CIEŃ (ZADANIE TEKSTOWE) ---
  generateWordShadow() {
    // Drzewo h, cień s. Kąt padania promieni alpha.
    // tg(alpha) = h/s.
    // Dane h i s. Oblicz alpha.
    // Np h=10, s=10 (45st), h=10sqrt(3), s=10 (60st)

    const base = MathUtils.randomInt(5, 15);
    const type = MathUtils.randomElement(["45", "30", "60"]);

    let h, s, angle;
    if (type === "45") {
      h = base;
      s = base;
      angle = 45;
    } else if (type === "30") {
      h = base;
      s = `${base}\\sqrt{3}`;
      angle = 30;
    } else {
      h = `${base}\\sqrt{3}`;
      s = base;
      angle = 60;
    }

    return this.createResponse({
      question: `Drzewo o wysokości $$${h}$$ m rzuca cień o długości $$${s}$$ m. Pod jakim kątem promienie słoneczne padają na ziemię?`,
      latex: ``,
      image: this.generateSVG({ type: "shadow", h, s }),
      variables: { h, s, angle },
      correctAnswer: `${angle}^\\circ`,
      distractors: [`30^\\circ`, `45^\\circ`, `60^\\circ`]
        .filter((x) => x !== `${angle}^\\circ`)
        .concat([`${90 - angle}^\\circ`]),
      steps: [
        `Tworzymy trójkąt prostokątny. $$\\tg\\alpha = \\frac{\\text{wysokość}}{\\text{cień}}$$`,
        `$$\\tg\\alpha = \\frac{${h}}{${s}}$$`,
        `Wartość ta odpowiada kątowi $$${angle}^\\circ$$.`,
      ],
    });
  }

  // --- 15. ZNAJDŹ KĄT Z WARTOŚCI ---
  generateFindAngle() {
    // tg a = 1, sin a = 1/2...
    const func = MathUtils.randomElement(["sin", "cos", "tg"]);
    let val, angle;

    if (func === "tg") {
      val = "1";
      angle = 45;
    } else if (func === "sin") {
      val = "\\frac{1}{2}";
      angle = 30;
    } else {
      val = "\\frac{1}{2}";
      angle = 60;
    } // cos

    return this.createResponse({
      question: `Kąt $$\\alpha$$ jest ostry i $$${func}\\alpha = ${val}$$. Miara kąta $$\\alpha$$ wynosi:`,
      latex: ``,
      image: null,
      variables: { func, val },
      correctAnswer: `${angle}^\\circ`,
      distractors: [`30^\\circ`, `45^\\circ`, `60^\\circ`]
        .filter((x) => x !== `${angle}^\\circ`)
        .concat(["90^\\circ"]),
      steps: [`Odczytujemy z tablicy wartości funkcji trygonometrycznych.`],
    });
  }

  // --- 16. PORÓWNYWANIE WARTOŚCI ---
  generateCompareFunctions() {
    // sin rośnie, cos maleje, tg rośnie (w ostrych)
    const func = MathUtils.randomElement(["sin", "cos", "tg"]);
    const a1 = MathUtils.randomInt(10, 40);
    const a2 = a1 + MathUtils.randomInt(10, 40);

    const isGrowing = func !== "cos";
    const sign = isGrowing ? "<" : ">";

    return this.createResponse({
      question: `Wskaż prawdziwą nierówność:`,
      latex: ``,
      image: null,
      variables: { func, a1, a2 },
      correctAnswer: `\\${func} ${a1}^\\circ ${sign} \\${func} ${a2}^\\circ`,
      distractors: [
        `\\${func} ${a1}^\\circ ${sign === "<" ? ">" : "<"} \\${func} ${a2}^\\circ`,
        `\\${func} ${a1}^\\circ = \\${func} ${a2}^\\circ`,
        `\\${func} ${a1}^\\circ \\cdot \\${func} ${a2}^\\circ = 1`,
      ],
      steps: [
        `Funkcja $$y=\\${func} x$$ w przedziale $$(0^\\circ, 90^\\circ)$$ jest ${isGrowing ? "rosnąca" : "malejąca"}.`,
        `Ponieważ $$${a1} < ${a2}$$, to $$\\${func} ${a1}^\\circ ${sign} \\${func} ${a2}^\\circ$$.`,
      ],
    });
  }

  // --- 17. ILOCZYN TANGENSÓW (REDUKCJA) ---
  generateTanProductReduction() {
    // tg(x) * tg(90-x) = 1
    const angle = MathUtils.randomInt(10, 40);
    const compl = 90 - angle;

    return this.createResponse({
      question: `Wartość wyrażenia $$\\tg ${angle}^\\circ \\cdot \\tg ${compl}^\\circ$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { angle },
      correctAnswer: `1`,
      distractors: [`0`, `\\frac{1}{2}`, `\\sqrt{3}`],
      steps: [
        `Wzór: $$\\tg(90^\\circ - \\alpha) = \\frac{1}{\\tg\\alpha}$$`,
        `$$\\tg ${compl}^\\circ = \\frac{1}{\\tg ${angle}^\\circ}$$`,
        `Zatem iloczyn wynosi $$1$$.`,
      ],
    });
  }

  // --- 18. RAMIĘ TRÓJKĄTA RÓWNORAMIENNEGO ---
  generateIsoscelesArm() {
    // Podstawa a, kąt przy podstawie alpha. Ramię b = (a/2) / cos(alpha)
    const a = MathUtils.randomInt(4, 10) * 2;
    const angle = 30; // cos30 = sqrt(3)/2 -> b = (a/2) / (sqrt(3)/2) = a/sqrt(3) = a*sqrt(3)/3
    // Dla uproszczenia użyjmy konkretnych kątów

    // cos(30) = sqrt(3)/2.
    const armLatex = `\\frac{${a}\\sqrt{3}}{3}`;

    return this.createResponse({
      question: `Podstawa trójkąta równoramiennego ma długość $$${a}$$, a kąt przy podstawie ma miarę $$30^\\circ$$. Ramię tego trójkąta ma długość:`,
      latex: ``,
      image: this.generateSVG({ type: "isosceles", a, angle: 30 }),
      variables: { a },
      correctAnswer: armLatex,
      distractors: [`${a}`, `${a}\\sqrt{3}`, `${a / 2}`],
      steps: [
        `Prowadzimy wysokość na podstawę. Połowa podstawy to $$${a / 2}$$.`,
        `$$\\cos 30^\\circ = \\frac{a/2}{b} \\implies b = \\frac{${a / 2}}{\\sqrt{3}/2} = \\frac{${a}}{\\sqrt{3}} = ${armLatex}$$`,
      ],
    });
  }

  // --- 19. WYSOKOŚĆ TRAPEZU ---
  generateTrapezoidHeight() {
    // Trapez równoramienny. Ramię c, kąt ostry 30/45/60.
    // h = c * sin(alpha).
    const c = MathUtils.randomInt(4, 10) * 2;
    const angle = MathUtils.randomElement([30, 45, 60]);

    let hStr;
    if (angle === 30) hStr = `${c / 2}`;
    else if (angle === 45) hStr = `${c / 2}\\sqrt{2}`;
    else hStr = `${c / 2}\\sqrt{3}`;

    return this.createResponse({
      question: `Ramię trapezu równoramiennego ma długość $$${c}$$, a kąt ostry tego trapezu ma miarę $$${angle}^\\circ$$. Wysokość trapezu jest równa:`,
      latex: ``,
      image: this.generateSVG({ type: "trapezoid_h", c, angle }),
      variables: { c, angle },
      correctAnswer: hStr,
      distractors: [`${c}`, `${c}\\sqrt{2}`, `${c * 2}`],
      steps: [
        `$$\\sin ${angle}^\\circ = \\frac{h}{c} \\implies h = c \\cdot \\sin ${angle}^\\circ$$`,
      ],
    });
  }

  // --- 20. PRZYBLIŻENIA ---
  generateApproxValue() {
    // sin 10 stopni ok. 0.1736
    const angle = 10;
    const val = 0.1736;

    return this.createResponse({
      question: `Z tablic trygonometrycznych odczytano, że $$\\sin ${angle}^\\circ \\approx ${val}$$. Zatem $$\\cos ${90 - angle}^\\circ$$ jest w przybliżeniu równy:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: `${val}`,
      distractors: [
        `${(1 - val).toFixed(4)}`,
        `${(val * 2).toFixed(4)}`,
        `0.9848`,
      ],
      steps: [
        `$$\\cos(90^\\circ - \\alpha) = \\sin\\alpha$$.`,
        `Zatem $$\\cos 80^\\circ = \\sin 10^\\circ \\approx ${val}$$`,
      ],
    });
  }

  // =================================================================
  // STARE METODY (BEZ ZMIAN)
  // =================================================================

  generateTriangleDef() {
    const [a, b, c] = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
    ]);
    const func = MathUtils.randomElement(["sin", "cos", "tg"]);
    let num, den;
    if (func === "sin") {
      num = a;
      den = c;
    } else if (func === "cos") {
      num = b;
      den = c;
    } else {
      num = a;
      den = b;
    }
    return this.createResponse({
      question: `W trójkącie prostokątnym o bokach $$${a}, ${b}, ${c}$$ kąt $$\\alpha$$ leży naprzeciwko boku $$${a}$$. Wartość $$${func} \\alpha$$ wynosi:`,
      latex: ``,
      image: this.generateSVG({ type: "triangle", a, b, c }),
      variables: { a, b, c, func },
      correctAnswer: `\\frac{${num}}{${den}}`,
      distractors: [
        `\\frac{${den}}{${num}}`,
        `\\frac{${b}}{${a}}`,
        `\\frac{${a}}{${c + 1}}`,
      ],
      steps: [`Definicja $$${func}$$: Odpowiedni stosunek boków.`],
    });
  }

  generatePythagoreanIdentity() {
    const [a, b, c] = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
    ]);
    const givenFunc = MathUtils.randomElement(["sin", "cos"]);
    const targetFunc = givenFunc === "sin" ? "cos" : "sin";
    const givenVal = `\\frac{${givenFunc === "sin" ? a : b}}{${c}}`;
    const targetVal = `\\frac{${givenFunc === "sin" ? b : a}}{${c}}`;
    return this.createResponse({
      question: `Kąt $$\\alpha$$ jest ostry i $$${givenFunc} \\alpha = ${givenVal}$$. Wartość $$${targetFunc} \\alpha$$ jest równa:`,
      latex: `${givenFunc} \\alpha = ${givenVal}`,
      image: null,
      variables: { a, b, c },
      correctAnswer: targetVal,
      distractors: [`\\frac{${c - a}}{${c}}`, `\\frac{${a}}{${b}}`, `1`],
      steps: [`$$1 - (\\frac{${givenFunc === "sin" ? a : b}}{${c}})^2 = ...$$`],
    });
  }

  generateValuesEval() {
    const exprs = [
      { q: "\\sin 30^\\circ + \\cos 60^\\circ", val: 1, s: "1/2 + 1/2" },
      {
        q: "\\sin 45^\\circ \\cdot \\cos 45^\\circ",
        val: "1/2",
        s: "sqrt(2)/2 * sqrt(2)/2 = 2/4",
      },
      {
        q: "\\tg 30^\\circ \\cdot \\tg 60^\\circ",
        val: 1,
        s: "sqrt(3)/3 * sqrt(3) = 3/3",
      },
      { q: "2\\sin 60^\\circ", val: "\\sqrt{3}", s: "2 * sqrt(3)/2" },
    ];
    const item = MathUtils.randomElement(exprs);
    return this.createResponse({
      question: `Wartość wyrażenia $$${item.q}$$ jest równa:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: `${item.val}`,
      distractors: [`0`, `\\frac{1}{2}`, `\\sqrt{2}`],
      steps: [item.s],
    });
  }

  generateAngleRelation() {
    const alpha = MathUtils.randomInt(10, 80);
    const beta = 90 - alpha;
    return this.createResponse({
      question: `Wartość wyrażenia $$\\sin ${alpha}^\\circ - \\cos ${beta}^\\circ$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { alpha, beta },
      correctAnswer: `0`,
      distractors: [`1`, `-1`, `2\\sin ${alpha}^\\circ`],
      steps: [
        `$$\\cos ${beta}^\\circ = \\sin (90^\\circ - ${beta}^\\circ) = \\sin ${alpha}^\\circ$$`,
      ],
    });
  }

  generateTgIdentity() {
    const [a, b, c] = MathUtils.randomElement([
      [3, 4, 5],
      [5, 12, 13],
    ]);
    return this.createResponse({
      question: `Kąt $$\\alpha$$ jest ostry, $$\\sin\\alpha=\\frac{${a}}{${c}}$$ i $$\\cos\\alpha=\\frac{${b}}{${c}}$$. Wartość $$\\tg\\alpha$$ wynosi:`,
      latex: ``,
      image: null,
      variables: { a, b, c },
      correctAnswer: `\\frac{${a}}{${b}}`,
      distractors: [`\\frac{${b}}{${a}}`, `\\frac{${a}}{${c}}`, `1`],
      steps: [`$$\\tg\\alpha = \\sin\\alpha / \\cos\\alpha = ${a}/${b}$$`],
    });
  }

  // --- SVG GENERATOR ---
  generateSVG(params) {
    const size = 300;
    const center = size / 2;
    const drawPoly = (pts) =>
      `<polygon points="${pts.map((p) => `${p.x},${p.y}`).join(" ")}" stroke="black" fill="none" stroke-width="2"/>`;
    const drawText = (x, y, txt) =>
      `<text x="${x}" y="${y}" font-size="14">${txt}</text>`;
    const drawLine = (x1, y1, x2, y2) =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="2"/>`;

    if (params.type === "triangle" || params.type === "triangle_sas") {
      const x0 = 50;
      const y0 = 250;
      const sc = 15;
      const ax = (params.b || 4) * sc;
      const ay = (params.a || 3) * sc;
      // Prosty dla triangle_def, dowolny dla sas? Używamy prostego jako wizualizacji
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
        <polygon points="${x0},${y0} ${x0 + ax},${y0} ${x0},${y0 - ay}" stroke="black" fill="none" stroke-width="2"/>
        <text x="${x0 - 20}" y="${y0 - ay / 2}">${params.a || "a"}</text>
        <text x="${x0 + ax / 2}" y="${y0 + 20}">${params.b || "b"}</text>
        <text x="${x0 + ax - 30}" y="${y0 - 10}" fill="red">α</text>
      </svg>`;
    }
    if (params.type === "ladder") {
      // Drabina (przeciwprostokątna)
      const x0 = 50,
        y0 = 250;
      const len = 200;
      const rad = (params.angle * Math.PI) / 180;
      const x_top = x0 + len * Math.cos(rad);
      const y_top = y0 - len * Math.sin(rad);
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
            <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - 220}" stroke="black" stroke-width="4"/> <line x1="${x0}" y1="${y0}" x2="${x0 + 220}" y2="${y0}" stroke="black" stroke-width="2"/> <line x1="${x0 + len * Math.cos(rad)}" y1="${y0}" x2="${x0}" y2="${y0 - len * Math.sin(rad)}" stroke="brown" stroke-width="5"/> <text x="${x0 + 20}" y="${y0 - (len * Math.sin(rad)) / 2}">d=${params.d}</text>
        </svg>`;
    }
    if (params.type === "shadow") {
      // Drzewo i cień
      const x0 = 100,
        y0 = 250;
      const h = 150;
      const s = 100;
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
            <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - h}" stroke="green" stroke-width="4"/> <line x1="${x0}" y1="${y0}" x2="${x0 + s}" y2="${y0}" stroke="gray" stroke-width="4"/> <line x1="${x0 + s}" y1="${y0}" x2="${x0}" y2="${y0 - h}" stroke="orange" stroke-dasharray="4"/> <text x="${x0 + s + 5}" y="${y0 - 5}">α</text>
        </svg>`;
    }
    if (params.type === "parallelogram" || params.type === "rhombus_angle") {
      const w = 120,
        h = 80,
        sh = 40;
      const x0 = 80,
        y0 = 180;
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">
            <polygon points="${x0},${y0} ${x0 + w},${y0} ${x0 + w + sh},${y0 - h} ${x0 + sh},${y0 - h}" stroke="black" fill="none" stroke-width="2"/>
            <text x="${x0 + 20}" y="${y0 - 5}">${params.angle}°</text>
        </svg>`;
    }
    return "";
  }
}

module.exports = TrigonometryGenerator;
