export const filterData = dataset => {
  const yTrain = [];
  dataset.map(row => {
    //We do not need ID so we will delete ID from array
    delete row.id;

    //test data using target M=1, B =0;
    yTrain.push([row.diagnosis === "M" ? 1 : 0]);
    delete row.diagnosis;
    return row;
  });
  //filter json to array
  const xTrain = dataset.map(row => [
    row.radius_mean,
    row.texture_mean,
    row.perimeter_mean,
    row.area_mean,
    row.smoothness_mean,
    row.compactness_mean,
    row.concavity_mean,
    row.concave_points_mean,
    row.symmetry_mean,
    row.fractal_dimension_mean,
    row.radius_se,
    row.texture_se,
    row.perimeter_se,
    row.area_se,
    row.smoothness_se,
    row.compactness_se,
    row.concavity_se,
    row.concave_points_se,
    row.symmetry_se,
    row.fractal_dimension_se,
    row.radius_worst,
    row.texture_worst,
    row.perimeter_worst,
    row.area_worst,
    row.smoothness_worst,
    row.compactness_worst,
    row.concavity_worst,
    row.concave_points_worst,
    row.symmetry_worst,
    row.fractal_dimension_worst
  ]);

  return {
    xTrain: xTrain,
    yTrain: yTrain
  };
};
