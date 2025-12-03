const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

class PlanimetryGenerator extends BaseGenerator {
  generate() {
    const variants = [
      "circle_angles", // Kąt środkowy i wpisany
      "right_triangle_trig", // Sinus, cosinus, tangens
      "triangle_similarity", // Pola figur podobnych (k^2)
      "rhombus_area", // Pole rombu z przekątnych
      "circle_tangent", // NOWOŚĆ: Styczna do okręgu (Pitagoras)
      "triangle_area_sin", // NOWOŚĆ: Pole trójkąta z sinusem
      "quadrilateral_angles", // NOWOŚĆ: Kąty w trapezie/równoległoboku
      "isosceles_angles", // NOWOŚĆ: Kąty w trójkącie równoramiennym
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
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
      case "right_triangle_trig":
      default:
        return this.generateTrigProblem();
    }
  }

  // --- 1. KĄTY W OKRĘGU (Bez zmian) ---
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
      image: this.generateSVG({ type: "circle_angles", alpha, beta }),
      variables: { alpha, beta, mode },
      correctAnswer:
        mode === "find_central" ? `${beta}^\\circ` : `${alpha}^\\circ`,
      distractors:
        mode === "find_central"
          ? [`${alpha}^\\circ`, `${180 - alpha}^\\circ`, `${90 + alpha}^\\circ`]
          : [`${beta}^\\circ`, `${beta * 2}^\\circ`, `${180 - beta}^\\circ`],
      steps: [
        `Zależność między kątem środkowym a wpisanym opartym na tym samym łuku: $$\\beta = 2\\alpha$$`,
        mode === "find_central"
          ? `$$\\beta = 2 \\cdot ${alpha}^\\circ = ${beta}^\\circ$$`
          : `$$\\alpha = ${beta}^\\circ : 2 = ${alpha}^\\circ$$`,
      ],
    });
  }

  // --- 2. TRYGONOMETRIA (Bez zmian) ---
  generateTrigProblem() {
    const triples = [
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
      [7, 24, 25],
    ];
    const [baseA, baseB, baseC] = MathUtils.randomElement(triples);
    const k = MathUtils.randomInt(1, 2);
    const a = baseA * k,
      b = baseB * k,
      c = baseC * k;
    const func = MathUtils.randomElement(["sin", "cos", "tg"]);

    let ans, latex;
    if (func === "sin") {
      ans = baseA / baseC;
      latex = `\\frac{${baseA}}{${baseC}}`;
    } else if (func === "cos") {
      ans = baseB / baseC;
      latex = `\\frac{${baseB}}{${baseC}}`;
    } else {
      ans = baseA / baseB;
      latex = `\\frac{${baseA}}{${baseB}}`;
    }

    return this.createResponse({
      question: `W trójkącie prostokątnym przyprostokątne mają długości $$${a}$$ i $$${b}$$, a przeciwprostokątna $$${c}$$. Kąt $$\\alpha$$ leży naprzeciwko boku $$${a}$$. Wartość $$${func}\\alpha$$ to:`,
      latex: `a=${a}, b=${b}, c=${c}`,
      image: this.generateSVG({ type: "right_triangle", a, b, c }),
      variables: { a, b, c, func },
      correctAnswer: latex,
      distractors: [
        func === "sin"
          ? `\\frac{${baseB}}{${baseC}}`
          : func === "cos"
            ? `\\frac{${baseA}}{${baseC}}`
            : `\\frac{${baseB}}{${baseA}}`,
        `\\frac{${baseC}}{${baseA}}`,
        `\\frac{1}{2}`,
      ],
      steps: [
        `Definicja $$${func}\\alpha$$ w trójkącie prostokątnym.`,
        `Podstawiamy boki i skracamy ułamek: $$${latex}$$`,
      ],
    });
  }

  // --- 3. PODOBIEŃSTWO (Bez zmian) ---
  generateSimilarity() {
    const P1 = MathUtils.randomInt(2, 10);
    const k = MathUtils.randomInt(2, 5);
    const P2 = P1 * k * k;
    return this.createResponse({
      question: `Trójkąt $$T_1$$ jest podobny do $$T_2$$ w skali $$k=${k}$$. Pole $$T_1$$ wynosi $$${P1}$$. Pole $$T_2$$ to:`,
      latex: `P_{T_1}=${P1}, k=${k}`,
      image: this.generateSVG({ type: "similarity", k }),
      variables: { P1, k, P2 },
      correctAnswer: `${P2}`,
      distractors: [`${P1 * k}`, `${P1 + k}`, `${P1 * k * 2}`],
      steps: [
        `Stosunek pól figur podobnych jest równy $$k^2$$.`,
        `$$P_{T_2} = P_{T_1} \\cdot k^2 = ${P1} \\cdot ${k * k} = ${P2}$$`,
      ],
    });
  }

  // --- 4. ROMB (Bez zmian) ---
  generateRhombus() {
    const d1 = MathUtils.randomInt(4, 12) * 2,
      d2 = MathUtils.randomInt(3, 8) * 2;
    const area = (d1 * d2) / 2;
    return this.createResponse({
      question: `Pole rombu o przekątnych $$${d1}$$ i $$${d2}$$ jest równe:`,
      latex: `d_1=${d1}, d_2=${d2}`,
      image: this.generateSVG({ type: "rhombus", d1, d2 }),
      variables: { d1, d2, area },
      correctAnswer: `${area}`,
      distractors: [`${d1 * d2}`, `${d1 + d2}`, `${area * 2}`],
      steps: [
        `$$P = \\frac{d_1 \\cdot d_2}{2} = \\frac{${d1}\\cdot${d2}}{2} = ${area}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 5: STYCZNA DO OKRĘGU ---
  generateCircleTangent() {
    // Trójkąt prostokątny: promień r, odcinek do środka d (przeciwprostokątna), odcinek stycznej x
    // r^2 + x^2 = d^2
    const triples = [
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [8, 15, 17],
    ];
    const [r, x, d] = MathUtils.randomElement(triples); // r-przyprostokątna, x-styczna, d-przeciwprostokątna

    // Co mamy dane? Zazwyczaj r i d, szukamy x. Albo r i x, szukamy d.
    const mode = MathUtils.randomElement(["find_tangent", "find_dist"]);

    const question =
      mode === "find_tangent"
        ? `Prosta $$l$$ jest styczna do okręgu o środku $$O$$ i promieniu $$r=${r}$$. Punkt $$A$$ leży na prostej $$l$$, a jego odległość od środka okręgu wynosi $$${d}$$. Długość odcinka stycznej od punktu $$A$$ do punktu styczności jest równa:`
        : `Prosta $$l$$ jest styczna do okręgu o środku $$O$$ i promieniu $$r=${r}$$ w punkcie $$S$$. Punkt $$A$$ leży na prostej $$l$$ w odległości $$${x}$$ od punktu $$S$$. Odległość punktu $$A$$ od środka okręgu wynosi:`;

    return this.createResponse({
      question: question,
      latex:
        mode === "find_tangent" ? `r=${r}, |OA|=${d}` : `r=${r}, |AS|=${x}`,
      image: this.generateSVG({ type: "circle_tangent", r, d, x }),
      variables: { r, x, d },
      correctAnswer: mode === "find_tangent" ? `${x}` : `${d}`,
      distractors: [
        mode === "find_tangent" ? `${d - r}` : `${x + r}`,
        mode === "find_tangent"
          ? `${Math.sqrt(d * d + r * r).toFixed(1)}`
          : `${Math.abs(x - r)}`,
        mode === "find_tangent"
          ? `${d + r}`
          : `${Math.sqrt(x * x - r * r).toFixed(1)}`,
      ],
      steps: [
        `Promień poprowadzony do punktu styczności jest prostopadły do stycznej.`,
        `Tworzy się trójkąt prostokątny o bokach: promień $$r$$, odcinek stycznej $$x$$ i odległość od środka $$d$$ (przeciwprostokątna).`,
        `Z twierdzenia Pitagorasa: $$r^2 + x^2 = d^2$$`,
        mode === "find_tangent"
          ? `$$${r}^2 + x^2 = ${d}^2 \\implies ${r * r} + x^2 = ${d * d} \\implies x^2 = ${d * d - r * r} = ${x * x} \\implies x=${x}$$`
          : `$$${r}^2 + ${x}^2 = d^2 \\implies ${r * r} + ${x * x} = d^2 \\implies d^2 = ${d * d} \\implies d=${d}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 6: POLE TRÓJKĄTA Z SINUSEM ---
  generateTriangleAreaSin() {
    // P = 0.5 * a * b * sin(alpha)
    const angles = [30, 45, 60, 90, 120, 135, 150];
    const alpha = MathUtils.randomElement(angles);

    // Sinus values for display
    const sinVals = {
      30: "\\frac{1}{2}",
      45: "\\frac{\\sqrt{2}}{2}",
      60: "\\frac{\\sqrt{3}}{2}",
      90: "1",
      120: "\\frac{\\sqrt{3}}{2}",
      135: "\\frac{\\sqrt{2}}{2}",
      150: "\\frac{1}{2}",
    };
    const sinValNum = {
      30: 0.5,
      45: Math.sqrt(2) / 2,
      60: Math.sqrt(3) / 2,
      90: 1,
      120: Math.sqrt(3) / 2,
      135: Math.sqrt(2) / 2,
      150: 0.5,
    };

    const a = MathUtils.randomInt(4, 10);
    const b = MathUtils.randomInt(4, 10);

    // P = 0.5 * a * b * sinVal
    // Żeby wynik był ładny: a*b musi się skrócić z mianownikiem sinusa (zazwyczaj 2 lub 4).

    const areaRaw = 0.5 * a * b * sinValNum[alpha];

    // Formatowanie wyniku (obsługa pierwiastków)
    let areaStr;
    const coeff = (a * b) / 4; // bo 1/2 ze wzoru * 1/2 z sinusa (dla 30, 150) lub /2 z sinusa

    if ([30, 150].includes(alpha)) {
      areaStr = `${(a * b) / 4}`; // Powinno być całkowite lub .5
    } else if ([45, 135].includes(alpha)) {
      areaStr = `${(a * b) / 4}\\sqrt{2}`;
    } else if ([60, 120].includes(alpha)) {
      areaStr = `${(a * b) / 4}\\sqrt{3}`;
    } else {
      // 90
      areaStr = `${(a * b) / 2}`;
    }

    return this.createResponse({
      question: `Dany jest trójkąt o bokach długości $$${a}$$ i $$${b}$$ oraz kącie między nimi zawartym o mierze $$${alpha}^\\circ$$. Pole tego trójkąta jest równe:`,
      latex: `a=${a}, b=${b}, \\gamma=${alpha}^\\circ`,
      image: this.generateSVG({ type: "triangle_sas", a, b, alpha }),
      variables: { a, b, alpha },
      correctAnswer: areaStr,
      distractors: [
        `${a * b}`,
        `${a + b}`,
        `${(a * b) / 2}`, // Zapomniany sinus (wzór na prostokątny)
      ],
      steps: [
        `Korzystamy ze wzoru na pole trójkąta: $$P = \\frac{1}{2} a b \\sin\\gamma$$`,
        `Z tablic trygonometrycznych: $$\\sin ${alpha}^\\circ = ${sinVals[alpha]}$$`,
        `$$P = \\frac{1}{2} \\cdot ${a} \\cdot ${b} \\cdot ${sinVals[alpha]}$$`,
        `$$P = ${(a * b) / 2} \\cdot ${sinVals[alpha]} = ${areaStr}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 7: KĄTY W CZWOROKĄTACH ---
  generateQuadrilateralAngles() {
    // Trapez równoramienny lub równoległobok
    const type = MathUtils.randomElement(["trapezoid", "parallelogram"]);
    const acuteAngle = MathUtils.randomInt(40, 80);
    const obtuseAngle = 180 - acuteAngle;

    let question, correct, dists;

    if (type === "trapezoid") {
      question = `W trapezie równoramiennym kąt ostry ma miarę $$${acuteAngle}^\\circ$$. Miara kąta rozwartego tego trapezu jest równa:`;
      correct = `${obtuseAngle}^\\circ`;
      dists = [
        `${90 + acuteAngle}^\\circ`,
        `${2 * acuteAngle}^\\circ`,
        `${180 - 2 * acuteAngle}^\\circ`,
      ];
    } else {
      question = `Jeden z kątów równoległoboku ma miarę $$${obtuseAngle}^\\circ$$. Miara kąta ostrego tego równoległoboku wynosi:`;
      correct = `${acuteAngle}^\\circ`;
      dists = [
        `${obtuseAngle - 90}^\\circ`,
        `${180 - obtuseAngle}^\\circ`,
        `${360 - 2 * obtuseAngle}^\\circ`,
      ]; // Drugi jest poprawny w logice distractora, fix:
      dists = [
        `${obtuseAngle / 2}^\\circ`,
        `${Math.abs(90 - acuteAngle)}^\\circ`,
        `${acuteAngle + 20}^\\circ`,
      ];
    }

    return this.createResponse({
      question: question,
      latex: `\\alpha = ${type === "trapezoid" ? acuteAngle : obtuseAngle}^\\circ`,
      image: this.generateSVG({ type: type, angle: acuteAngle }),
      variables: { type, acuteAngle, obtuseAngle },
      correctAnswer: correct,
      distractors: dists,
      steps: [
        `Suma kątów przy jednym ramieniu w ${type === "trapezoid" ? "trapezie" : "równoległoboku"} wynosi $$180^\\circ$$.`,
        `$$180^\\circ - ${type === "trapezoid" ? acuteAngle : obtuseAngle}^\\circ = ${correct}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 8: KĄTY W TRÓJKĄCIE RÓWNORAMIENNYM ---
  generateIsoscelesAngles() {
    // Kąt przy podstawie (base) lub między ramionami (vertex)
    const baseAngle = MathUtils.randomInt(30, 80);
    const vertexAngle = 180 - 2 * baseAngle;

    const mode = MathUtils.randomElement(["given_base", "given_vertex"]);

    let question, correct;

    if (mode === "given_base") {
      question = `Kąt przy podstawie trójkąta równoramiennego ma miarę $$${baseAngle}^\\circ$$. Kąt między ramionami tego trójkąta ma miarę:`;
      correct = `${vertexAngle}^\\circ`;
    } else {
      question = `Kąt między ramionami trójkąta równoramiennego ma miarę $$${vertexAngle}^\\circ$$. Kąt przy podstawie tego trójkąta ma miarę:`;
      correct = `${baseAngle}^\\circ`;
    }

    return this.createResponse({
      question: question,
      latex:
        mode === "given_base"
          ? `\\alpha = ${baseAngle}^\\circ`
          : `\\gamma = ${vertexAngle}^\\circ`,
      image: this.generateSVG({ type: "isosceles", baseAngle, vertexAngle }),
      variables: { baseAngle, vertexAngle },
      correctAnswer: correct,
      distractors: [
        mode === "given_base" ? `${baseAngle}^\\circ` : `${vertexAngle}^\\circ`,
        mode === "given_base"
          ? `${90 - baseAngle}^\\circ`
          : `${180 - vertexAngle}^\\circ`,
        mode === "given_base"
          ? `${180 - baseAngle}^\\circ`
          : `${(180 - vertexAngle) * 2}^\\circ`,
      ],
      steps: [
        `Suma kątów w trójkącie wynosi $$180^\\circ$$.`,
        `W trójkącie równoramiennym kąty przy podstawie są równe ($$\\alpha$$).`,
        mode === "given_base"
          ? `$$180^\\circ - 2 \\cdot ${baseAngle}^\\circ = 180^\\circ - ${2 * baseAngle}^\\circ = ${vertexAngle}^\\circ$$`
          : `$$(180^\\circ - ${vertexAngle}^\\circ) : 2 = ${180 - vertexAngle}^\\circ : 2 = ${baseAngle}^\\circ$$`,
      ],
    });
  }

  // --- SVG GENERATOR ---
  generateSVG(params) {
    const size = 300;
    const center = size / 2;
    let content = "";

    const drawPoly = (pts) =>
      `<polygon points="${pts.map((p) => `${p.x},${p.y}`).join(" ")}" stroke="black" stroke-width="2" fill="none" />`;
    const drawText = (x, y, txt, col = "black") =>
      `<text x="${x}" y="${y}" fill="${col}" font-size="14">${txt}</text>`;

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

      content += `<circle cx="${center}" cy="${center}" r="${r}" stroke="black" fill="none" stroke-width="2"/>`;
      content += `<circle cx="${center}" cy="${center}" r="3" fill="black"/>`;
      content += `<line x1="${C.x}" y1="${C.y}" x2="${A.x}" y2="${A.y}" stroke="blue" stroke-width="2"/>`;
      content += `<line x1="${C.x}" y1="${C.y}" x2="${B.x}" y2="${B.y}" stroke="blue" stroke-width="2"/>`;
      content += `<line x1="${center}" y1="${center}" x2="${A.x}" y2="${A.y}" stroke="red" stroke-dasharray="4"/>`;
      content += `<line x1="${center}" y1="${center}" x2="${B.x}" y2="${B.y}" stroke="red" stroke-dasharray="4"/>`;
      content += drawText(C.x, C.y - 10, "α", "blue");
      content += drawText(center + 5, center + 20, "β", "red");
    } else if (params.type === "circle_tangent") {
      const r = params.r * 15;
      const d = params.d * 15;
      const x = params.x * 15;
      // Center O at (50, 150). A at (50+d, 150). Tangent point S calc.
      // cos(angle) = r/d
      const angle = Math.acos(params.r / params.d);
      const Sx = 50 + r * Math.cos(angle);
      const Sy = 150 - r * Math.sin(angle);

      content += `<circle cx="50" cy="150" r="${r}" stroke="black" fill="none" stroke-width="2"/>`;
      content += `<line x1="50" y1="150" x2="${50 + d}" y2="150" stroke="black" stroke-width="2"/>`; // d
      content += `<line x1="50" y1="150" x2="${Sx}" y2="${Sy}" stroke="red" stroke-width="2"/>`; // r
      content += `<line x1="${50 + d}" y1="150" x2="${Sx}" y2="${Sy}" stroke="blue" stroke-width="2"/>`; // x (styczna)
      content += drawText(40, 140, "r", "red");
      content += drawText(50 + d / 2, 170, "d");
      content += drawText(Sx + 10, Sy - 10, "x", "blue");
      content += `<circle cx="${50 + d}" cy="150" r="3" fill="black"/><text x="${55 + d}" y="150">A</text>`;
    } else if (params.type === "triangle_sas" || params.type === "isosceles") {
      // Draw triangle
      const p1 = { x: 50, y: 250 };
      const p2 = { x: 250, y: 250 };
      // For SAS: p3 depends on alpha and side b
      // For Isosceles: p3 is in the middle
      let p3;
      if (params.type === "isosceles") {
        const h = 100 * Math.tan((params.baseAngle * Math.PI) / 180);
        p3 = { x: 150, y: 250 - Math.min(h, 200) };
      } else {
        const angleRad = (params.alpha * Math.PI) / 180;
        p3 = {
          x: 50 + 150 * Math.cos(angleRad),
          y: 250 - 150 * Math.sin(angleRad),
        };
      }
      content += drawPoly([p1, p2, p3]);
      if (params.type === "isosceles") {
        content += drawText(70, 240, "α");
        content += drawText(220, 240, "α");
        content += drawText(145, p3.y + 20, "γ");
      } else {
        content += drawText(80, 240, `${params.alpha}°`);
        content += drawText(150, 270, `a=${params.a}`);
        content += drawText(30, 200, `b=${params.b}`);
      }
    } else if (params.type === "trapezoid" || params.type === "parallelogram") {
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
    } else if (params.type === "right_triangle") {
      // Skalujemy, żeby się zmieściło
      const scale = 150 / Math.max(params.a, params.b, params.c);
      const ax = params.b * scale;
      const ay = params.a * scale;

      // Rysujemy w rogu (50, 250)
      const x0 = 50,
        y0 = 250;
      const p1 = { x: x0, y: y0 }; // Kąt prosty
      const p2 = { x: x0 + ax, y: y0 };
      const p3 = { x: x0, y: y0 - ay };

      content += `<polygon points="${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" stroke="black" stroke-width="2" fill="none" />`;
      // Kąt prosty
      content += `<rect x="${x0}" y="${y0 - 15}" width="15" height="15" fill="none" stroke="black" />`;
      content += `<circle cx="${x0 + 5}" cy="${y0 - 5}" r="2" fill="black"/>`;

      // Opisy boków
      content += `<text x="${x0 - 20}" y="${y0 - ay / 2}" font-size="14">a=${params.a}</text>`;
      content += `<text x="${x0 + ax / 2}" y="${y0 + 20}" font-size="14">b=${params.b}</text>`;
      content += `<text x="${x0 + ax / 2 + 10}" y="${y0 - ay / 2}" font-size="14">c=${params.c}</text>`;

      // Kąt alfa (naprzeciwko a, czyli przy wierzchołku p2)
      content += `<text x="${p2.x - 30}" y="${p2.y - 10}" font-size="14" fill="red">α</text>`;
    } else if (params.type === "rhombus") {
      const scale = 15;
      const dx = (params.d2 * scale) / 2;
      const dy = (params.d1 * scale) / 2;

      const p1 = { x: center, y: center - dy };
      const p2 = { x: center + dx, y: center };
      const p3 = { x: center, y: center + dy };
      const p4 = { x: center - dx, y: center };

      content += `<polygon points="${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}" stroke="black" stroke-width="2" fill="none" />`;
      // Przekątne
      content += `<line x1="${p1.x}" y1="${p1.y}" x2="${p3.x}" y2="${p3.y}" stroke="red" stroke-dasharray="4" />`;
      content += `<line x1="${p2.x}" y1="${p2.y}" x2="${p4.x}" y2="${p4.y}" stroke="blue" stroke-dasharray="4" />`;

      content += `<text x="${center + 5}" y="${center - 10}" font-size="12" fill="red">d1</text>`;
      content += `<text x="${center + 10}" y="${center + 15}" font-size="12" fill="blue">d2</text>`;
    } else if (params.type === "similarity") {
      // Dwa trójkąty: mały i duży
      const h1 = 40,
        w1 = 30;
      const h2 = h1 * 1.5,
        w2 = w1 * 1.5; // Tylko wizualnie większy

      const drawTri = (x, y, w, h, label) => `
                <polygon points="${x},${y} ${x + w},${y} ${x},${y - h}" stroke="black" fill="none" stroke-width="2"/>
                <text x="${x + w / 3}" y="${y - h / 3}" font-size="12">${label}</text>
            `;

      content += drawTri(50, 200, w1, h1, "T1");
      content += drawTri(150, 200, w2, h2, "T2");
      content += `<text x="${120}" y="${220}" font-size="14">k = ${params.k}</text>`;
    }

    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">${content}</svg>`;
  }
}

module.exports = PlanimetryGenerator;
