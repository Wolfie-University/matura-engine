const BaseGenerator = require("../../../../core/BaseGenerator");
const MathUtils = require("../../../../utils/MathUtils");

class ChartsGenerator extends BaseGenerator {
  generateChartMeanProblem() {
    let targetRemainder;

    if (this.difficulty === "easy") {
      targetRemainder = 0;
    } else if (this.difficulty === "hard") {
      targetRemainder = -1;
    } else {
      targetRemainder = 0;
    }

    let data = [],
      totalSum = 0,
      totalCount = 0,
      attempts = 0;
    do {
      data = [];
      totalSum = 0;
      totalCount = 0;

      for (let g = 1; g <= 6; g++) {
        const c = MathUtils.randomInt(0, 6);
        if (c > 0) {
          data.push({ grade: g, count: c });
          totalSum += g * c;
          totalCount += c;
        }
      }
      attempts++;
    } while (
      (totalCount === 0 ||
        (targetRemainder === 0 && totalSum % totalCount !== 0)) &&
      attempts < 100
    );

    // fallback
    if (totalCount === 0) {
      data = [
        { grade: 3, count: 2 },
        { grade: 4, count: 2 },
      ];
      totalSum = 14;
      totalCount = 4;
    }

    const mean = totalSum / totalCount;
    const meanStr = Number.isInteger(mean) ? `${mean}` : mean.toFixed(2);

    return this.createResponse({
      question:
        "Diagram przedstawia wyniki sprawdzianu z matematyki w pewnej klasie. Oś pozioma to oceny, a pionowa to liczba uczniów. Ile wynosi średnia ocen w tej klasie?",
      latex: ``,
      image: this.generateSVG({ type: "bar_chart", data }),
      variables: { data, totalSum, totalCount },
      correctAnswer: meanStr,
      distractors: [
        `${(mean + 0.5).toFixed(2)}`,
        `${(mean - 0.2).toFixed(2)}`,
        `${Math.floor(mean)}`,
      ],
      steps: [
        `Suma ocen (suma iloczynów ocena $\\times$ liczba uczniów): $$${totalSum}$$`,
        `Liczba uczniów: $$${totalCount}$$`,
        `Średnia: $$\\frac{${totalSum}}{${totalCount}} = ${meanStr}$$`,
      ],
      questionType: "open",
      answerFormat: "number",
    });
  }

  generateFrequencyTableMean() {
    let valuesRange;
    if (this.difficulty === "easy") valuesRange = [1, 4];
    else valuesRange = [0, 5];

    const values = Array.from(
      { length: valuesRange[1] - valuesRange[0] + 1 },
      (_, i) => i + valuesRange[0],
    );
    const counts = [];
    let sumVals = 0,
      totalCount = 0,
      attempts = 0;

    const requireInteger = this.difficulty === "easy";

    do {
      counts.length = 0;
      sumVals = 0;
      totalCount = 0;
      for (let v of values) {
        const c = MathUtils.randomInt(1, 5);
        counts.push(c);
        sumVals += v * c;
        totalCount += c;
      }
      attempts++;
    } while (
      (totalCount === 0 || (requireInteger && sumVals % totalCount !== 0)) &&
      attempts < 50
    );

    const mean = sumVals / totalCount;
    const meanStr = Number.isInteger(mean) ? `${mean}` : mean.toFixed(2);

    let header = `\\text{Wartość}`;
    let row = `\\text{Liczebność}`;
    let colsFormat = `|c|`;

    values.forEach((v, i) => {
      header += ` & ${v}`;
      row += ` & ${counts[i]}`;
      colsFormat += `c|`;
    });

    const tableLatex = `
    \\begin{array}{${colsFormat}} \\hline
    ${header} \\\\ \\hline
    ${row} \\\\ \\hline
    \\end{array}`;

    return this.createResponse({
      question:
        "Tabela przedstawia rozkład pewnych danych. Średnia arytmetyczna tych danych jest równa:",
      latex: tableLatex,
      image: null,
      variables: { counts, mean },
      correctAnswer: meanStr,
      distractors: [
        `${(mean + 0.5).toFixed(1)}`,
        `${(mean - 0.2).toFixed(1)}`,
        `${Math.floor(mean)}`,
      ],
      steps: [
        `Obliczamy sumę iloczynów (wartość $\\cdot$ liczebność): $$${sumVals}$$`,
        `Suma liczebności: $$${totalCount}$$`,
        `Średnia: $$${meanStr}$$`,
      ],
      questionType: "closed",
    });
  }

  generateSVG(params) {
    if (params.type === "bar_chart") {
      const size = 300;
      const margin = 40;
      const maxCount = Math.max(...params.data.map((d) => d.count));
      const barCount = params.data.length;
      const barW = (size - 2 * margin) / (barCount + 1);
      const scaleY = (size - 2 * margin) / (maxCount + 1);

      let svg = `<line x1="${margin}" y1="${size - margin}" x2="${size - margin}" y2="${size - margin}" stroke="black" stroke-width="2" /><line x1="${margin}" y1="${margin}" x2="${margin}" y2="${size - margin}" stroke="black" stroke-width="2" />`;

      svg += `<text x="${size / 2}" y="${size - 5}" text-anchor="middle" font-size="12">Ocena</text>`;
      svg += `<text x="${15}" y="${size / 2}" text-anchor="middle" font-size="12" transform="rotate(-90, 15, ${size / 2})">Liczba</text>`;

      params.data.forEach((d, i) => {
        const x = margin + (i + 1) * barW;
        const h = d.count * scaleY;
        const y = size - margin - h;

        svg += `<rect x="${x - barW / 2 + 5}" y="${y}" width="${barW - 10}" height="${h}" fill="#4a90e2" stroke="black" />`;
        svg += `<text x="${x}" y="${y - 5}" text-anchor="middle" font-size="12">${d.count}</text>`;
        svg += `<text x="${x}" y="${size - margin + 20}" text-anchor="middle" font-size="14">${d.grade}</text>`;
      });
      return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="border:1px solid #ddd; background:#fff">${svg}</svg>`;
    }
    return "";
  }
}

module.exports = ChartsGenerator;
