const BaseGenerator = require("../../core/BaseGenerator");
const MathUtils = require("../../utils/MathUtils");

// Import sub-generators
const LinesGenerator = require("./topics/analytic/LinesGenerator");
const PointsAndSegmentsGenerator = require("./topics/analytic/PointsAndSegmentsGenerator");
const ShapesCoordsGenerator = require("./topics/analytic/ShapesCoordsGenerator");

class AnalyticGenerator extends BaseGenerator {
  constructor(difficulty) {
    super(difficulty);
    this.linesGen = new LinesGenerator(difficulty);
    this.pointsGen = new PointsAndSegmentsGenerator(difficulty);
    this.shapesGen = new ShapesCoordsGenerator(difficulty);
  }

  generate() {
    const variants = [
      // Lines
      "line_equation_2p", // Równanie prostej przez 2 punkty
      "line_parallel", // Prosta równoległa
      "line_perpendicular", // Prosta prostopadła
      "line_parameter_m", // Parametr m
      "intersection_point", // Punkt przecięcia
      "slope_angle", // Kąt nachylenia
      "point_on_line_param", // Punkt z parametrem na prostej
      "intersection_with_axes", // Przecięcie z osiami
      "perpendicular_coeff", // Współczynnik prostopadłej
      "perpendicular_bisector", // Symetralna odcinka

      // Points & Segments
      "midpoint_length", // Środek i długość
      "missing_endpoint", // Brakujący koniec
      "distance_unknown_coord", // Długość z niewiadomą
      "point_symmetry", // Symetria punktu
      "collinear_points", // Współliniowość

      // Shapes & Circles
      "circle_equation", // Równanie okręgu
      "circle_tangent_to_axis", // Okrąg styczny do osi
      "radius_from_equation", // Promień z równania
      "parallelogram_vertex", // Czwarty wierzchołek
      "triangle_area_coords", // Pole trójkąta
    ];

    const selectedVariant = MathUtils.randomElement(variants);

    switch (selectedVariant) {
      // Lines
      case "line_equation_2p":
        return this.linesGen.generateLineThroughTwoPoints();
      case "line_parallel":
        return this.linesGen.generateParallelLine();
      case "line_perpendicular":
        return this.linesGen.generatePerpendicularLine();
      case "line_parameter_m":
        return this.linesGen.generateParameterMProblem();
      case "intersection_point":
        return this.linesGen.generateIntersectionProblem();
      case "slope_angle":
        return this.linesGen.generateSlopeAngle();
      case "point_on_line_param":
        return this.linesGen.generatePointOnLineParam();
      case "intersection_with_axes":
        return this.linesGen.generateIntersectionWithAxes();
      case "perpendicular_coeff":
        return this.linesGen.generatePerpendicularCoeff();
      case "perpendicular_bisector":
        return this.linesGen.generateBisector();

      // Points
      case "midpoint_length":
        return this.pointsGen.generateMidpointProblem();
      case "missing_endpoint":
        return this.pointsGen.generateMissingEndpoint();
      case "distance_unknown_coord":
        return this.pointsGen.generateDistanceUnknownCoord();
      case "point_symmetry":
        return this.pointsGen.generatePointSymmetry();
      case "collinear_points":
        return this.pointsGen.generateCollinearPoints();

      // Shapes
      case "circle_equation":
        return this.shapesGen.generateCircleProblem();
      case "circle_tangent_to_axis":
        return this.shapesGen.generateCircleTangentToAxis();
      case "radius_from_equation":
        return this.shapesGen.generateRadiusFromEquation();
      case "parallelogram_vertex":
        return this.shapesGen.generateParallelogramVertex();
      case "triangle_area_coords":
        return this.shapesGen.generateTriangleAreaCoords();

      default:
        return this.pointsGen.generateMidpointProblem();
    }
  }
}

module.exports = AnalyticGenerator;
