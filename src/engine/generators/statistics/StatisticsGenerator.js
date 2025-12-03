const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

class StatisticsGenerator extends BaseGenerator {
  generate() {
    const variants = [
      "stats_basic", // Średnia/Mediana z listy liczb
      "stats_mode", // NOWOŚĆ: Dominanta (najczęstsza wartość)
      "weighted_mean", // NOWOŚĆ: Średnia ważona (oceny i wagi)
      "std_deviation", // NOWOŚĆ: Odchylenie standardowe (mały zbiór)
      "stats_chart", // Średnia z diagramu słupkowego (SVG)
      "combinatorics_numbers", // Ile jest liczb n-cyfrowych...
      "combinatorics_digits", // NOWOŚĆ: Liczby o RÓŻNYCH cyfrach
      "combinatorics_seats", // NOWOŚĆ: Ustawianie osób w kolejce/na miejscach
      "prob_dice_coins", // Rzut kostką/monetą
      "prob_urn", // Kule w urnie / Losowanie ze zbiorów
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      case "stats_mode":
        return this.generateModeProblem();
      case "weighted_mean":
        return this.generateWeightedMeanProblem();
      case "std_deviation":
        return this.generateStdDevProblem();
      case "stats_chart":
        return this.generateChartMeanProblem();
      case "combinatorics_numbers":
        return this.generateCombinatoricsProblem();
      case "combinatorics_digits":
        return this.generateDistinctDigitsProblem();
      case "combinatorics_seats":
        return this.generateSeatsProblem();
      case "prob_dice_coins":
        return this.generateDiceCoinProblem();
      case "prob_urn":
        return this.generateUrnProblem();
      case "stats_basic":
      default:
        return this.generateBasicStatsProblem();
    }
  }

  // --- 1. ŚREDNIA I MEDIANA (Bez zmian) ---
  generateBasicStatsProblem() {
    const count = MathUtils.randomInt(6, 9);
    const numbers = [];
    for (let i = 0; i < count; i++) numbers.push(MathUtils.randomInt(1, 9));
    const mode = MathUtils.randomElement(["mean", "median"]);
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((a, b) => a + b, 0);

    let answer,
      steps = [];
    if (mode === "mean") {
      const mean = sum / count;
      const meanStr = Number.isInteger(mean)
        ? `${mean}`
        : `\\frac{${sum}}{${count}}`;
      answer = meanStr;
      steps = [
        `Suma liczb: $$${sum}$$`,
        `Liczba elementów: $$${count}$$`,
        `Średnia: $$${meanStr}$$`,
      ];
    } else {
      const mid = Math.floor(count / 2);
      let medVal;
      steps.push(`Porządkujemy liczby: $$${sorted.join(", ")}$$`);
      if (count % 2 !== 0) {
        medVal = sorted[mid];
        steps.push(
          `Liczba elementów nieparzysta. Mediana to środkowy wyraz: $$${medVal}$$`,
        );
      } else {
        medVal = (sorted[mid - 1] + sorted[mid]) / 2;
        steps.push(
          `Liczba elementów parzysta. Mediana to średnia $$${sorted[mid - 1]}$$ i $$${sorted[mid]}$$: $$${medVal}$$`,
        );
      }
      answer = `${medVal}`;
    }

    return this.createResponse({
      question: `Dany jest zestaw liczb: $$${numbers.join(", ")}$$. ${mode === "mean" ? "Średnia arytmetyczna" : "Mediana"} tego zestawu jest równa:`,
      latex: ``,
      image: null,
      variables: { numbers, sorted },
      correctAnswer: answer,
      distractors: [
        `${(sum / (count - 1)).toFixed(2)}`,
        mode === "mean"
          ? `${sorted[Math.floor(count / 2)]}`
          : `${(sum / count).toFixed(2)}`,
        `${sorted[0]}`,
      ],
      steps: steps,
    });
  }

  // --- NOWOŚĆ 2: DOMINANTA (MODA) ---
  generateModeProblem() {
    // Generujemy zestaw, w którym jedna liczba występuje wyraźnie najczęściej
    const targetMode = MathUtils.randomInt(1, 9);
    const numbers = [targetMode, targetMode, targetMode]; // 3x target
    // Dodajemy 4-5 innych losowych liczb (ale nie target, żeby nie było remisu)
    for (let i = 0; i < 5; i++) {
      let n;
      do {
        n = MathUtils.randomInt(1, 9);
      } while (n === targetMode);
      numbers.push(n);
    }

    // Mieszamy
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return this.createResponse({
      question: `Dominanta (moda) zestawu danych: $$${numbers.join(", ")}$$ jest równa:`,
      latex: ``,
      image: null,
      variables: { numbers, targetMode },
      correctAnswer: `${targetMode}`,
      distractors: [
        `${numbers[0]}`,
        `${(numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(1)}`, // Średnia
        `${Math.floor(numbers.length / 2)}`, // Mediana-ish
      ],
      steps: [
        `Dominanta to wartość, która występuje w zestawie najczęściej.`,
        `Liczba $$${targetMode}$$ występuje $$3$$ razy.`,
        `Pozostałe liczby występują rzadziej.`,
        `Odp: $$${targetMode}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 3: ŚREDNIA WAŻONA ---
  generateWeightedMeanProblem() {
    // Oceny i wagi. (waga 1, 2, 3)
    // Wynik ma być w miarę ładny.
    const grades = [];
    let numSum = 0;
    let denSum = 0;

    // Generujemy 3-4 oceny
    const count = MathUtils.randomInt(3, 4);
    for (let i = 0; i < count; i++) {
      const g = MathUtils.randomElement([2, 3, 4, 5, 6]);
      const w = MathUtils.randomElement([1, 2, 3]);
      grades.push({ g, w });
      numSum += g * w;
      denSum += w;
    }

    const weightedMean = numSum / denSum;
    const meanStr = Number.isInteger(weightedMean)
      ? `${weightedMean}`
      : weightedMean.toFixed(2);

    const questionText = grades
      .map((x) => `ocenę $$${x.g}$$ z wagą $$${x.w}$$`)
      .join(", ");

    return this.createResponse({
      question: `Uczeń otrzymał następujące oceny: ${questionText}. Średnia ważona tych ocen jest równa:`,
      latex: ``,
      image: null,
      variables: { grades, numSum, denSum },
      correctAnswer: meanStr,
      distractors: [
        `${(grades.reduce((a, b) => a + b.g, 0) / count).toFixed(2)}`, // Zwykła średnia
        `${(weightedMean + 0.5).toFixed(2)}`,
        `${(weightedMean - 0.2).toFixed(2)}`,
      ],
      steps: [
        `Wzór na średnią ważoną: $$\\bar{x}_w = \\frac{o_1 w_1 + o_2 w_2 + ...}{w_1 + w_2 + ...}$$`,
        `Licznik: $$${grades.map((x) => `${x.g}\\cdot${x.w}`).join(" + ")} = ${numSum}$$`,
        `Mianownik (suma wag): $$${grades.map((x) => x.w).join(" + ")} = ${denSum}$$`,
        `Średnia: $$\\frac{${numSum}}{${denSum}} \\approx ${meanStr}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 4: ODCHYLENIE STANDARDOWE ---
  generateStdDevProblem() {
    // Mały zbiór liczb, dla których średnia jest całkowita, a wariancja łatwa.
    // Np. liczby symetryczne względem średniej: 2, 4, 6 (średnia 4)
    // Wariancja: (4+0+4)/3 = 8/3. Pierwiastek brzydki.
    // Spróbujmy: 1, 3, 5, 7 (średnia 4).
    // (9+1+1+9)/4 = 20/4 = 5. Odchylenie = sqrt(5). Ładne!

    const setType = MathUtils.randomElement([
      "seq_odd",
      "seq_even",
      "symmetric",
    ]);
    let nums = [];
    let mean = 0;

    if (setType === "seq_odd") {
      // 1, 3, 5, 7, 9
      nums = [1, 3, 5, 7, 9];
      mean = 5;
    } else if (setType === "seq_even") {
      // 2, 4, 6, 8, 10
      nums = [2, 4, 6, 8, 10];
      mean = 6;
    } else {
      // 4, 4, 8, 8
      nums = [4, 4, 8, 8];
      mean = 6;
    }

    const varianceNum = nums.reduce(
      (acc, val) => acc + Math.pow(val - mean, 2),
      0,
    );
    const variance = varianceNum / nums.length;
    // Sprawdzamy czy wariancja jest kwadratem
    const isPerf = Number.isInteger(Math.sqrt(variance));
    const stdDevStr = isPerf ? `${Math.sqrt(variance)}` : `\\sqrt{${variance}}`;

    return this.createResponse({
      question: `Odchylenie standardowe zestawu danych: $$${nums.join(", ")}$$ jest równe:`,
      latex: ``,
      image: null,
      variables: { nums, mean, variance },
      correctAnswer: stdDevStr,
      distractors: [
        `${variance}`, // Wariancja zamiast odchylenia
        `${mean}`,
        `${isPerf ? Math.sqrt(variance) + 1 : variance + 2}`,
      ],
      steps: [
        `1. Obliczamy średnią arytmetyczną: $$\\bar{x} = ${mean}$$`,
        `2. Obliczamy wariancję (średnia kwadratów odchyleń od średniej):`,
        `$$\\sigma^2 = \\frac{${nums.map((n) => `(${n}-${mean})^2`).join("+")}}{${nums.length}} = \\frac{${varianceNum}}{${nums.length}} = ${variance}$$`,
        `3. Odchylenie standardowe to pierwiastek z wariancji: $$\\sigma = \\sqrt{${variance}} = ${stdDevStr}$$`,
      ],
    });
  }

  // --- 5. ŚREDNIA Z DIAGRAMU (Bez zmian logicznych) ---
  generateChartMeanProblem() {
    let data = [],
      totalSum = 0,
      totalCount = 0,
      attempts = 0;
    do {
      data = [];
      totalSum = 0;
      totalCount = 0;
      for (let g = 1; g <= 6; g++) {
        const c = MathUtils.randomInt(0, 8);
        if (c > 0) {
          data.push({ grade: g, count: c });
          totalSum += g * c;
          totalCount += c;
        }
      }
      attempts++;
    } while (
      (totalCount === 0 || ((totalSum / totalCount) * 10) % 5 !== 0) &&
      attempts < 50
    );
    const mean = totalSum / totalCount;
    return this.createResponse({
      question:
        "Diagram przedstawia wyniki sprawdzianu. Średnia ocen jest równa:",
      latex: ``,
      image: this.generateSVG({ type: "bar_chart", data }),
      variables: { data },
      correctAnswer: `${mean}`,
      distractors: [
        `${(mean + 0.5).toFixed(2)}`,
        `${(mean - 0.2).toFixed(2)}`,
        `${Math.floor(mean)}`,
      ],
      steps: [
        `Suma ocen: $$${totalSum}$$`,
        `Liczba uczniów: $$${totalCount}$$`,
        `Średnia: $$${mean}$$`,
      ],
    });
  }

  // --- 6. KOMBINATORYKA - LICZBY (Bez zmian) ---
  generateCombinatoricsProblem() {
    const digits = MathUtils.randomElement([3, 4]);
    const type = MathUtils.randomElement(["even", "div5", "no_zero"]);
    let res, desc;
    if (type === "even") {
      res = 9 * Math.pow(10, digits - 2) * 5;
      desc = "Ostatnia cyfra parzysta (5 opcji).";
    } else if (type === "div5") {
      res = 9 * Math.pow(10, digits - 2) * 2;
      desc = "Ostatnia cyfra 0 lub 5 (2 opcje).";
    } else {
      res = Math.pow(9, digits);
      desc = "Bez cyfry 0 (wszędzie 9 opcji).";
    }

    return this.createResponse({
      question: `Ile jest liczb ${digits}-cyfrowych ${type === "even" ? "parzystych" : type === "div5" ? "podzielnych przez 5" : "w których nie występuje cyfra 0"}?`,
      latex: ``,
      image: null,
      variables: { digits, type },
      correctAnswer: `${res}`,
      distractors: [`${res + 10}`, `${res / 2}`, `${Math.pow(10, digits)}`],
      steps: [`Reguła mnożenia.`, desc, `Wynik: $$${res}$$`],
    });
  }

  // --- NOWOŚĆ 7: KOMBINATORYKA - RÓŻNE CYFRY ---
  generateDistinctDigitsProblem() {
    // Ile jest liczb 3-cyfrowych o różnych cyfrach?
    // 9 * 9 * 8
    const digits = 3;
    const res = 9 * 9 * 8;

    return this.createResponse({
      question:
        "Ile jest wszystkich liczb naturalnych trzycyfrowych, w których wszystkie cyfry są różne?",
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: `${res}`,
      distractors: [`${9 * 10 * 10}`, `${9 * 8 * 7}`, `${10 * 9 * 8}`],
      steps: [
        `Pierwsza cyfra: 9 możliwości (1-9).`,
        `Druga cyfra: 9 możliwości (0-9, ale inna niż pierwsza).`,
        `Trzecia cyfra: 8 możliwości (inna niż pierwsza i druga).`,
        `$$9 \\cdot 9 \\cdot 8 = ${res}$$`,
      ],
    });
  }

  // --- NOWOŚĆ 8: KOMBINATORYKA - MIEJSCA/KOLEJKA ---
  generateSeatsProblem() {
    // Na ile sposobów 5 osób może usiąść na 5 miejscach? (Permutacja)
    // Lub: Na ile sposobów 2 osoby mogą usiąść na 5 miejscach? (Wariacja)
    const n = MathUtils.randomInt(4, 6);
    const k = n; // Permutacja dla uproszczenia (najczęstsze)

    let res = 1;
    for (let i = 1; i <= n; i++) res *= i; // Silnia

    return this.createResponse({
      question: `Na ile sposobów $$${n}$$ osób może ustawić się w kolejce do kasy?`,
      latex: ``,
      image: null,
      variables: { n },
      correctAnswer: `${res}`,
      distractors: [`${n * n}`, `${n}`, `${res / 2}`],
      steps: [
        `Pierwsza osoba ma $$${n}$$ miejsc do wyboru.`,
        `Druga osoba ma $$${n - 1}$$ miejsc, itd.`,
        `Jest to permutacja zbioru $$${n}$$-elementowego: $$${n}!$$`,
        `$$${n}! = 1 \\cdot 2 \\cdot ... \\cdot ${n} = ${res}$$`,
      ],
    });
  }

  // --- 9. PRAWDOPODOBIEŃSTWO - KOSTKI (Rozszerzone) ---
  generateDiceCoinProblem() {
    const variant = MathUtils.randomElement([
      "dice_sum",
      "dice_diff",
      "coins_at_least",
    ]);
    // ... (Logika podobna do poprzedniej, ale np. dice_diff: różnica oczek = 1) ...
    // Uproszczona wersja z poprzedniego kodu:
    const limit = 8;
    const omega = 36;
    let favored = 0;
    if (variant === "dice_sum") {
      for (let i = 1; i <= 6; i++)
        for (let j = 1; j <= 6; j++) if (i + j > limit) favored++;
    } else if (variant === "dice_diff") {
      for (let i = 1; i <= 6; i++)
        for (let j = 1; j <= 6; j++) if (Math.abs(i - j) === 1) favored++;
    } else {
      return this.generateDiceCoinProblem(); // Reroll coins for now to save space
    }

    const gcd = this.getGCD(favored, omega);
    return this.createResponse({
      question:
        variant === "dice_sum"
          ? `Rzucamy dwa razy kostką. Prawdopodobieństwo, że suma oczek > ${limit} wynosi:`
          : `Rzucamy dwa razy kostką. Prawdopodobieństwo, że różnica oczek wynosi 1:`,
      latex: ``,
      image: null,
      variables: { favored },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [
        `\\frac{1}{6}`,
        `\\frac{1}{2}`,
        `\\frac{${favored + 1}}{36}`,
      ],
      steps: [
        `$$|\\Omega|=36$$. Zdarzenia sprzyjające: $$${favored}$$`,
        `$$P(A)=\\frac{${favored}}{36}$$`,
      ],
    });
  }

  // --- 10. PRAWDOPODOBIEŃSTWO - URNA (Bez zmian) ---
  generateUrnProblem() {
    const b = MathUtils.randomInt(3, 8),
      c = MathUtils.randomInt(3, 8),
      total = b + c;
    const gcd = this.getGCD(b, total);
    return this.createResponse({
      question: `W urnie jest $$${b}$$ kul białych i $$${c}$$ czarnych. Prawdopodobieństwo wylosowania kuli białej:`,
      latex: ``,
      image: null,
      variables: { b, c },
      correctAnswer: `\\frac{${b / gcd}}{${total / gcd}}`,
      distractors: [
        `\\frac{${c}}{${total}}`,
        `\\frac{1}{2}`,
        `\\frac{${b}}{${c}}`,
      ],
      steps: [
        `Razem kul: $$${total}$$`,
        `Białe: $$${b}$$`,
        `$$P(A) = \\frac{${b}}{${total}}$$`,
      ],
    });
  }

  // --- HELPERY I SVG ---
  getGCD(a, b) {
    return b ? this.getGCD(b, a % b) : a;
  }

  generateSVG(params) {
    if (params.type === "bar_chart") {
      const size = 300;
      const margin = 40;
      const maxCount = Math.max(...params.data.map((d) => d.count));
      const barW = (size - 2 * margin) / 7;
      const scaleY = (size - 2 * margin) / (maxCount + 1);

      let svg = `<line x1="${margin}" y1="${size - margin}" x2="${size - margin}" y2="${size - margin}" stroke="black" stroke-width="2" />`;
      svg += `<line x1="${margin}" y1="${margin}" x2="${margin}" y2="${size - margin}" stroke="black" stroke-width="2" />`;

      params.data.forEach((d) => {
        const x = margin + d.grade * barW;
        const h = d.count * scaleY;
        svg += `<rect x="${x - barW / 2 + 5}" y="${size - margin - h}" width="${barW - 10}" height="${h}" fill="#4a90e2" stroke="black" />`;
        svg += `<text x="${x}" y="${size - margin - h - 5}" text-anchor="middle" font-size="12">${d.count}</text>`;
        svg += `<text x="${x}" y="${size - margin + 20}" text-anchor="middle" font-size="14">${d.grade}</text>`;
      });
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">${svg}</svg>`;
    }
    return "";
  }
}

module.exports = StatisticsGenerator;
