const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

// Import sub-generators
const LinearFunctionGenerator = require("./topics/general/LinearFunctionGenerator");
const FunctionPropertiesGenerator = require("./topics/general/FunctionPropertiesGenerator");
const TransformationsGenerator = require("./topics/general/TransformationsGenerator");
const ExponentialFunctionGenerator = require("./topics/general/ExponentialFunctionGenerator");
const PiecewiseFunctionGenerator = require("./topics/general/PiecewiseFunctionGenerator");

class FunctionsGeneralGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.linearGen = new LinearFunctionGenerator(difficulty);
    this.propsGen = new FunctionPropertiesGenerator(difficulty);
    this.transGen = new TransformationsGenerator(difficulty);
    this.expGen = new ExponentialFunctionGenerator(difficulty);
    this.pieceGen = new PiecewiseFunctionGenerator(difficulty);
  }

  generate() {
    const variants = [
      "linear_root", // Miejsce zerowe f. liniowej
      "point_belongs_param", // Punkt (x, m) należy do wykresu
      "exponential_param", // Funkcja wykładnicza f(x)=a^x
      "symmetry_transform", // Symetria OX/OY/00
      "read_graph_properties", // Odczytywanie z wykresu (SVG)
      "piecewise_function", // Funkcja klamrowa (przedziałami)
      "linear_graph_analysis", // Znaki a i b z wykresu (SVG)
      "linear_monotonicity_param", // Parametr m (funkcja rosnąca/malejąca)
      "function_shift", // Przesunięcie o wektor [p, q]
      "function_domain", // Dziedzina f. wymiernej
      "function_value", // Wartość funkcji dla argumentu x
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // Linear Function
      case "linear_root":
        return this.linearGen.generateLinearRoot();
      case "linear_graph_analysis":
        return this.linearGen.generateLinearGraphAnalysis();
      case "linear_monotonicity_param":
        return this.linearGen.generateLinearMonotonicityParam();
      case "linear_properties":
        return this.linearGen.generateLinearProperties(); // Stare, ale może być użyte

      // Properties & Domain
      case "point_belongs_param":
        return this.propsGen.generatePointBelongsParam();
      case "read_graph_properties":
        return this.propsGen.generateReadGraphProperties();
      case "function_domain":
        return this.propsGen.generateFunctionDomain();
      case "function_value":
        return this.propsGen.generateFunctionValue();

      // Transformations
      case "symmetry_transform":
        return this.transGen.generateSymmetryTransform();
      case "function_shift":
        return this.transGen.generateFunctionShift();

      // Other
      case "exponential_param":
        return this.expGen.generateExponentialParam();
      case "piecewise_function":
        return this.pieceGen.generatePiecewiseFunction();

      default:
        return this.linearGen.generateLinearRoot();
    }
  }
}

module.exports = FunctionsGeneralGenerator;
