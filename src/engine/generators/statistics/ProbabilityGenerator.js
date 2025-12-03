const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

class ProbabilityGenerator extends BaseGenerator {
  generate() {
    const variants = [
      // STARE (mapowane na nowe, lepsze implementacje)
      "dice", // -> generateDiceSum (Suma oczek)
      "coins", // -> generateCoinsDynamic (Monety)
      "urn", // -> generateUrnDynamic (Kule)
      "draw_number", // -> generateDrawNumberProperties (Liczby)

      // NOWE (10)
      "two_sets_sum", // Losowanie z dwóch zbiorów
      "drawing_with_replacement", // Losowanie ze zwracaniem
      "drawing_without_replacement", // Delegacja (klasa)
      "dice_comparison", // x1 > x2
      "dice_product", // Iloczyn oczek
      "union_formula", // P(A u B)
      "complementary_event", // P(A')
      "cards_dynamic", // Karty
      "divisibility_set_dynamic", // Podzielność w zbiorze
      "geometry_1d", // Prawdopodobieństwo geometryczne
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // NOWE
      case "two_sets_sum":
        return this.generateTwoSetsSum();
      case "drawing_with_replacement":
        return this.generateDrawingWithReplacement();
      case "drawing_without_replacement":
        return this.generateDrawingWithoutReplacement();
      case "dice_comparison":
        return this.generateDiceComparison();
      case "dice_product":
        return this.generateDiceProduct();
      case "union_formula":
        return this.generateUnionFormula();
      case "complementary_event":
        return this.generateComplementaryEvent();
      case "cards_dynamic":
        return this.generateCardsDynamic();
      case "divisibility_set_dynamic":
        return this.generateDivisibilitySetDynamic();
      case "geometry_1d":
        return this.generateGeometry1D();

      // STARE (Mapowanie na konkretne funkcje)
      case "coins":
        return this.generateCoinsDynamic();
      case "urn":
        return this.generateUrnDynamic();
      case "draw_number":
        return this.generateDrawNumberProperties();

      case "dice":
      default:
        return this.generateDiceSum();
    }
  }

  // =================================================================
  // IMPLEMENTACJE METOD
  // =================================================================

  // --- 1. SUMA OCZEK (KOSTKI) - dawniej 'dice' ---
  generateDiceSum() {
    const limit = MathUtils.randomInt(4, 10);
    const omega = 36;
    let favored = 0;
    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 6; j++) {
        if (i + j > limit) favored++;
      }
    }

    const gcd = this.getGCD(favored, omega);
    return this.createResponse({
      question: `Rzucamy dwa razy sześcienną kostką. Oblicz prawdopodobieństwo, że suma wyrzuconych oczek jest większa od $$${limit}$$.`,
      latex: ``,
      image: null,
      variables: { limit, favored },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [
        `\\frac{1}{6}`,
        `\\frac{1}{2}`,
        `\\frac{${favored + 1}}{36}`,
      ],
      steps: [
        `Liczba wszystkich zdarzeń elementarnych: $$|\\Omega| = 6 \\cdot 6 = 36$$.`,
        `Wypisujemy zdarzenia sprzyjające (suma > ${limit}).`,
        `Jest ich $$${favored}$$.`,
        `$$P(A) = \\frac{${favored}}{36}$$`,
      ],
    });
  }

  // --- 2. DWA ZBIORY LICZB (SUMA) ---
  generateTwoSetsSum() {
    const setA = [1, 2, 3, 4, 5].slice(0, MathUtils.randomInt(3, 5));
    const setB = [1, 2, 3, 4, 5, 6, 7].slice(
      MathUtils.randomInt(0, 2),
      MathUtils.randomInt(4, 7),
    );
    for (let i = 0; i < setB.length; i++) setB[i] += MathUtils.randomInt(2, 5);

    const omega = setA.length * setB.length;
    const type = MathUtils.randomElement(["sum_even", "sum_odd", "sum_gt"]);

    let favored = 0;
    let conditionDesc = "";
    let threshold = 0;

    if (type === "sum_gt") {
      const minSum = setA[0] + setB[0];
      const maxSum = setA[setA.length - 1] + setB[setB.length - 1];
      threshold = Math.floor((minSum + maxSum) / 2);
      conditionDesc = `suma wylosowanych liczb będzie większa od ${threshold}`;
    } else {
      conditionDesc = `suma wylosowanych liczb będzie liczbą ${type === "sum_even" ? "parzystą" : "nieparzystą"}`;
    }

    for (let a of setA) {
      for (let b of setB) {
        const sum = a + b;
        if (type === "sum_even" && sum % 2 === 0) favored++;
        else if (type === "sum_odd" && sum % 2 !== 0) favored++;
        else if (type === "sum_gt" && sum > threshold) favored++;
      }
    }

    const gcd = this.getGCD(favored, omega);

    return this.createResponse({
      question: `Dane są dwa zbiory: $$A=\\{${setA.join(",")}\\}$$ oraz $$B=\\{${setB.join(",")}\\}$$. Losujemy jedną liczbę ze zbioru $$A$$ i jedną liczbę ze zbioru $$B$$. Oblicz prawdopodobieństwo, że ${conditionDesc}.`,
      latex: ``,
      image: null,
      variables: { setA, setB, favored, omega },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [
        `\\frac{1}{2}`,
        `\\frac{${Math.max(1, favored - 1)}}{${omega}}`,
        `\\frac{${setA.length + setB.length}}{${omega}}`,
      ],
      steps: [
        `$$|\\Omega| = |A| \\cdot |B| = ${setA.length} \\cdot ${setB.length} = ${omega}$$`,
        `Zliczamy pary spełniające warunek. Jest ich: $$${favored}$$`,
        `$$P(A) = \\frac{${favored}}{${omega}}$$`,
      ],
    });
  }

  // --- 3. LOSOWANIE ZE ZWRACANIEM ---
  generateDrawingWithReplacement() {
    const n = MathUtils.randomInt(5, 9);
    const omega = n * n;

    const type = MathUtils.randomElement(["prod_div3", "sum_even"]);
    let favored = 0;
    let desc = "";

    if (type === "prod_div3") {
      desc = "iloczyn wylosowanych liczb będzie podzielny przez 3";
      for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) if ((i * j) % 3 === 0) favored++;
    } else {
      desc = "suma wylosowanych liczb będzie parzysta";
      for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) if ((i + j) % 2 === 0) favored++;
    }

    const gcd = this.getGCD(favored, omega);

    return this.createResponse({
      question: `Ze zbioru liczb $$\\{1, 2, ..., ${n}\\}$$ losujemy dwa razy po jednej liczbie ze zwracaniem. Oblicz prawdopodobieństwo, że ${desc}.`,
      latex: ``,
      image: null,
      variables: { n, omega, favored },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [
        `\\frac{1}{3}`,
        `\\frac{${n}}{${omega}}`,
        `\\frac{${favored}}{${n * (n - 1)}}`,
      ],
      steps: [
        `Losowanie ze zwracaniem: $$|\\Omega| = ${n} \\cdot ${n} = ${omega}$$`,
        `Liczba par sprzyjających: $$${favored}$$`,
        `$$P(A) = \\frac{${favored}}{${omega}}$$`,
      ],
    });
  }

  // --- 4. LOSOWANIE BEZ ZWRACANIA (KLASA) ---
  generateDrawingWithoutReplacement() {
    const boys = MathUtils.randomInt(8, 15);
    const girls = MathUtils.randomInt(8, 15);
    const total = boys + girls;
    const omega = (total * (total - 1)) / 2;

    const type = MathUtils.randomElement(["two_girls", "mixed"]);
    let favored = 0;
    let desc = "";

    if (type === "two_girls") {
      desc = "wylosowane zostaną dwie dziewczyny";
      favored = (girls * (girls - 1)) / 2;
    } else {
      desc = "wylosowana zostanie jedna dziewczyna i jeden chłopiec";
      favored = girls * boys;
    }

    const gcd = this.getGCD(favored, omega);

    return this.createResponse({
      question: `W klasie jest $$${boys}$$ chłopców i $$${girls}$$ dziewcząt. Wybieramy losowo dwie osoby. Oblicz prawdopodobieństwo, że ${desc}.`,
      latex: ``,
      image: null,
      variables: { boys, girls, total, favored },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [
        `\\frac{1}{2}`,
        `\\frac{${favored}}{${total * total}}`,
        `\\frac{${girls}}{${total}}`,
      ],
      steps: [
        `$$|\\Omega| = {${total} \\choose 2} = \\frac{${total} \\cdot ${total - 1}}{2} = ${omega}$$`,
        type === "two_girls"
          ? `$$|A| = {${girls} \\choose 2} = ${favored}$$`
          : `$$|A| = ${boys} \\cdot ${girls} = ${favored}$$`,
        `$$P(A) = \\frac{${favored}}{${omega}}$$`,
      ],
    });
  }

  // --- 5. PORÓWNANIE RZUTÓW (x1 > x2) ---
  generateDiceComparison() {
    const omega = 36;
    const type = MathUtils.randomElement(["greater", "equal", "less"]);
    let favored = 0;
    let desc = "";

    if (type === "equal") {
      favored = 6;
      desc =
        "liczba oczek w pierwszym rzucie będzie równa liczbie oczek w drugim";
    } else {
      favored = 15;
      desc = `liczba oczek w pierwszym rzucie będzie ${type === "greater" ? "większa od" : "mniejsza od"} liczby oczek w drugim`;
    }

    const gcd = this.getGCD(favored, omega);

    return this.createResponse({
      question: `Rzucamy dwa razy sześcienną kostką. Oblicz prawdopodobieństwo, że ${desc}.`,
      latex: ``,
      image: null,
      variables: { favored },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [`\\frac{1}{6}`, `\\frac{1}{2}`, `\\frac{21}{36}`],
      steps: [
        `$$|\\Omega| = 36$$`,
        `Liczba zdarzeń sprzyjających: $$${favored}$$`,
        `$$P(A) = \\frac{${favored}}{36}$$`,
      ],
    });
  }

  // --- 6. ILOCZYN OCZEK ---
  generateDiceProduct() {
    const omega = 36;
    const type = MathUtils.randomElement(["odd", "even", "div4"]);
    let favored = 0;
    let desc = "";

    if (type === "odd") {
      favored = 9;
      desc = "iloczyn oczek będzie liczbą nieparzystą";
    } else if (type === "even") {
      favored = 27;
      desc = "iloczyn oczek będzie liczbą parzystą";
    } else {
      desc = "iloczyn oczek będzie podzielny przez 4";
      for (let i = 1; i <= 6; i++)
        for (let j = 1; j <= 6; j++) if ((i * j) % 4 === 0) favored++;
    }

    const gcd = this.getGCD(favored, omega);

    return this.createResponse({
      question: `Rzucamy dwa razy kostką. Oblicz prawdopodobieństwo, że ${desc}.`,
      latex: ``,
      image: null,
      variables: { favored, type },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [`\\frac{1}{2}`, `\\frac{1}{4}`, `\\frac{1}{6}`],
      steps: [
        `Liczba zdarzeń sprzyjających: $$${favored}$$`,
        `$$P(A) = \\frac{${favored}}{36}$$`,
      ],
    });
  }

  // --- 7. WZÓR NA SUMĘ ZDARZEŃ ---
  generateUnionFormula() {
    const den = MathUtils.randomElement([10, 20, 50]);
    const nA = MathUtils.randomInt(3, den / 2);
    const nB = MathUtils.randomInt(3, den / 2);
    const nIntersect = MathUtils.randomInt(1, Math.min(nA, nB));
    const nUnion = nA + nB - nIntersect;

    const pA = `0.${nA * (100 / den)}`;
    const pB = `0.${nB * (100 / den)}`;
    const pInt = `0.${nIntersect * (100 / den)}`;
    const res = (nUnion * (100 / den)) / 100;
    const resStr = res.toFixed(2).replace(/\.?0+$/, "");

    return this.createResponse({
      question: `Dla zdarzeń $$A, B$$ zachodzi: $$P(A) = ${pA}$$, $$P(B) = ${pB}$$, $$P(A \\cap B) = ${pInt}$$. Wtedy $$P(A \\cup B)$$ wynosi:`,
      latex: ``,
      image: null,
      variables: { res },
      correctAnswer: `${resStr}`,
      distractors: [
        `${(parseFloat(pA) + parseFloat(pB)).toFixed(1)}`,
        `${(1 - res).toFixed(2)}`,
        `1`,
      ],
      steps: [
        `$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$`,
        `$$P(A \\cup B) = ${pA} + ${pB} - ${pInt} = ${resStr}$$`,
      ],
    });
  }

  // --- 8. ZDARZENIE PRZECIWNE ---
  generateComplementaryEvent() {
    const den = MathUtils.randomInt(5, 15);
    const num = MathUtils.randomInt(1, den - 1);
    return this.createResponse({
      question: `Jeżeli $$P(A) = \\frac{${num}}{${den}}$$, to prawdopodobieństwo zdarzenia przeciwnego $$A'$$ wynosi:`,
      latex: ``,
      image: null,
      variables: { num, den },
      correctAnswer: `\\frac{${den - num}}{${den}}`,
      distractors: [`\\frac{${num}}{${den - num}}`, `\\frac{1}{${den}}`, `1`],
      steps: [
        `$$P(A') = 1 - P(A) = 1 - \\frac{${num}}{${den}} = \\frac{${den - num}}{${den}}$$`,
      ],
    });
  }

  // --- 9. KARTY (DYNAMICZNE) ---
  generateCardsDynamic() {
    const omega = 52;
    const type = MathUtils.randomElement(["color", "face", "suit"]);
    let favored = 0;
    let desc = "";

    if (type === "color") {
      const color = MathUtils.randomElement(["czerwoną", "czarną"]);
      favored = 26;
      desc = `wylosowana karta będzie miała barwę ${color}`;
    } else if (type === "face") {
      favored = 16;
      desc = "wylosowana karta będzie figurą (J, Q, K, A)";
    } else {
      const suit = MathUtils.randomElement(["kierem", "karem"]);
      favored = 13;
      desc = `wylosowana karta będzie ${suit}`;
    }

    const gcd = this.getGCD(favored, omega);
    return this.createResponse({
      question: `Z talii 52 kart losujemy jedną. Prawdopodobieństwo, że ${desc}, wynosi:`,
      latex: ``,
      image: null,
      variables: { type, favored },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [`\\frac{1}{52}`, `\\frac{1}{4}`, `\\frac{13}{52}`],
      steps: [`$$P(A) = \\frac{${favored}}{52}$$`],
    });
  }

  // --- 10. PODZIELNOŚĆ W ZBIORZE ---
  generateDivisibilitySetDynamic() {
    const n = MathUtils.randomInt(20, 60);
    const div1 = 3;
    const div2 = 5;
    const c1 = Math.floor(n / div1);
    const c2 = Math.floor(n / div2);
    const c12 = Math.floor(n / (div1 * div2));
    const favored = c1 + c2 - c12;
    const gcd = this.getGCD(favored, n);

    return this.createResponse({
      question: `Ze zbioru $$\\{1, ..., ${n}\\}$$ losujemy liczbę. Prawdopodobieństwo, że jest podzielna przez 3 lub 5:`,
      latex: ``,
      image: null,
      variables: { n, favored },
      correctAnswer: `\\frac{${favored / gcd}}{${n / gcd}}`,
      distractors: [
        `\\frac{${c1 + c2}}{${n}}`,
        `\\frac{1}{2}`,
        `\\frac{${c12}}{${n}}`,
      ],
      steps: [
        `$$|A \\cup B| = ${c1} + ${c2} - ${c12} = ${favored}$$`,
        `$$P = \\frac{${favored}}{${n}}$$`,
      ],
    });
  }

  // --- 11. MONETY (DYNAMICZNE) ---
  generateCoinsDynamic() {
    const n = MathUtils.randomInt(2, 4);
    const omega = Math.pow(2, n);
    // Co najmniej 1 orzeł
    const favored = omega - 1;
    const gcd = this.getGCD(favored, omega);

    return this.createResponse({
      question: `Rzucamy $$${n}$$ razy monetą. Prawdopodobieństwo wyrzucenia co najmniej jednego orła:`,
      latex: ``,
      image: null,
      variables: { n, favored },
      correctAnswer: `\\frac{${favored / gcd}}{${omega / gcd}}`,
      distractors: [
        `\\frac{1}{${omega}}`,
        `\\frac{1}{2}`,
        `\\frac{${n}}{${omega}}`,
      ],
      steps: [
        `Zdarzenie przeciwne (same reszki): 1. $$P(A) = 1 - \\frac{1}{${omega}}$$`,
      ],
    });
  }

  // --- 12. URNA (DYNAMICZNA) ---
  generateUrnDynamic() {
    const b = MathUtils.randomInt(2, 6);
    const c = MathUtils.randomInt(2, 6);
    const n = MathUtils.randomInt(2, 6);
    const total = b + c + n;
    const gcd = this.getGCD(b, total);

    return this.createResponse({
      question: `Urna zawiera $$${b}$$ białych, $$${c}$$ czarnych i $$${n}$$ niebieskich kul. P(biała) = ?`,
      latex: ``,
      image: null,
      variables: { b, c, n },
      correctAnswer: `\\frac{${b / gcd}}{${total / gcd}}`,
      distractors: [
        `\\frac{${c}}{${total}}`,
        `\\frac{1}{3}`,
        `\\frac{${b}}{${c + n}}`,
      ],
      steps: [`$$P(A) = \\frac{${b}}{${total}}$$`],
    });
  }

  // --- 13. WŁASNOŚCI LICZB ---
  generateDrawNumberProperties() {
    const n = MathUtils.randomElement([10, 20, 30]);
    const type = MathUtils.randomElement(["prime", "square"]);
    let favored = 0;
    let desc = "";

    if (type === "prime") {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
      favored = primes.filter((p) => p <= n).length;
      desc = "liczbą pierwszą";
    } else {
      for (let i = 1; i * i <= n; i++) favored++;
      desc = "kwadratem liczby naturalnej";
    }

    const gcd = this.getGCD(favored, n);
    return this.createResponse({
      question: `Ze zbioru $$\\{1, ..., ${n}\\}$$ losujemy liczbę. Prawdopodobieństwo, że będzie ${desc}:`,
      latex: ``,
      image: null,
      variables: { n, type },
      correctAnswer: `\\frac{${favored / gcd}}{${n / gcd}}`,
      distractors: [
        `\\frac{1}{2}`,
        `\\frac{1}{4}`,
        `\\frac{${favored + 1}}{${n}}`,
      ],
      steps: [
        `Liczba sprzyjających: $$${favored}$$`,
        `$$P = \\frac{${favored}}{${n}}$$`,
      ],
    });
  }

  // --- 14. GEOMETRIA 1D ---
  generateGeometry1D() {
    const start = -2;
    const end = 4;
    const subStart = 0;
    const subEnd = 2;
    return this.createResponse({
      question: `Z przedziału $$<-2, 4>$$ losujemy liczbę. Prawdopodobieństwo, że należy do $$<0, 2>$$:`,
      latex: ``,
      image: null,
      variables: {},
      correctAnswer: `\\frac{1}{3}`,
      distractors: [`\\frac{1}{2}`, `\\frac{1}{6}`, `\\frac{2}{4}`],
      steps: [`Długość Omega: 6. Długość A: 2. $$P = 2/6 = 1/3$$`],
    });
  }

  // --- HELPER ---
  getGCD(a, b) {
    return b ? this.getGCD(b, a % b) : a;
  }
}

module.exports = ProbabilityGenerator;
