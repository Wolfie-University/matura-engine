class BaseGenerator {
  constructor(difficulty = "medium") {
    this.difficulty = difficulty;
  }

  generate() {
    throw new Error("Method 'generate()' must be implemented.");
  }

  createResponse({
    question,
    latex,
    image,
    variables,
    correctAnswer,
    distractors,
    steps,
    answerFormat,
    questionType,
  }) {
    return {
      meta: {
        type: this.constructor.name,
        difficulty: this.difficulty,
      },
      content: {
        question_text: question, // placeholder text
        question_latex: latex, // raw LaTeX
        image_svg: image, // SVG code
        variables: variables, // for debugging mostly
      },
      answers: {
        correct: correctAnswer,
        distractors: distractors, // 3 wrong answers
      },
      solution: {
        steps: steps, // array of strings explaining the solution
      },
      answer_format: answerFormat || "format",
      question_type: questionType || "closed",
    };
  }
}

module.exports = BaseGenerator;
