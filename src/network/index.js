import { train, test } from "../dataset";
import * as tf from "@tensorflow/tfjs";

const neuralNetwork = {
  train: async (batchSize, epochs, updateTerminalCallback) => {
    // Filter and prepare the training data
    const xTrain = prepareInputData(train);
    const yTrain = prepareOutputData(train);

    // Create the model
    const model = tf.sequential();

    // Setup layers
    const inputLayer = tf.layers.dense({
      units: 64,
      inputShape: [30],
      activation: "relu",
    });

    const hiddenLayer1 = tf.layers.dense({
      units: 64,
      activation: "relu",
    });

    const hiddenLayer2 = tf.layers.dense({
      units: 32,
      activation: "relu",
    });

    const outputLayer = tf.layers.dense({
      units: 1,
      activation: "sigmoid",
    });

    // Add layers to model
    model.add(inputLayer);
    model.add(hiddenLayer1);
    model.add(hiddenLayer2);
    model.add(outputLayer);

    // Compile model
    model.compile({
      optimizer: tf.train.adam(),
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });

    // Train model
    const history = await model.fit(xTrain, yTrain, {
      batchSize: parseInt(batchSize),
      epochs: parseInt(epochs),
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          updateTerminalCallback(
            `Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(
              4
            )}, accuracy = ${logs.acc.toFixed(4)}`
          );
        },
      },
      verbose: 0,
    });

    // Evaluate model on training and validation data
    const trainAcc = history.history.acc[history.history.acc.length - 1] * 100;
    const valAcc =
      history.history.val_acc[history.history.val_acc.length - 1] * 100;
    updateTerminalCallback(`Final training accuracy: ${trainAcc.toFixed(1)}%`);
    updateTerminalCallback(`Final validation accuracy: ${valAcc.toFixed(1)}%`);

    // Save the trained model
    await model.save("localstorage://breast-cancer-model");
    updateTerminalCallback("Model saved to LocalStorage");
  },

  loadModel: async () => {
    try {
      const model = await tf.loadLayersModel(
        "localstorage://breast-cancer-model"
      );
      return model ? true : null;
    } catch (e) {
      return null;
    }
  },

  predict: async (updateTerminalCallback) => {
    try {
      const model = await tf.loadLayersModel(
        "localstorage://breast-cancer-model"
      );
      const xTestData = prepareInputData(test);
      const yTestData = prepareOutputData(test);

      tf.tidy(() => {
        const output = model.predict(xTestData);
        const predictions = Array.from(output.dataSync());
        let correct = 0,
          wrong = 0,
          total = 0;
        const yTestValues = Array.from(yTestData.dataSync());

        predictions.forEach((value, index) => {
          total++;
          const diagnosis = yTestValues[index] === 1 ? "Malignant" : "Benign";
          const prediction = value > 0.5 ? "Malignant" : "Benign";

          if (diagnosis === prediction) {
            correct++;
          } else {
            wrong++;
          }

          updateTerminalCallback(
            `Test data [${index}] id[${yTestValues[index]}] Predict = ${prediction},  Test diagnosis = ${diagnosis}`
          );
        });

        updateTerminalCallback(
          `Correct=${correct}, Wrong=${wrong}, Total=${total}`
        );
      });
    } catch (e) {
      updateTerminalCallback(
        "No model breast-cancer-model was found in localStorage. Train and then save model to localStorage"
      );
      return;
    }
  },
};

// Prepare input data for the model
const prepareInputData = (data) => {
  const inputData = data.map((sample) => [
    sample.radius_mean,
    sample.texture_mean,
    sample.perimeter_mean,
    sample.area_mean,
    sample.smoothness_mean,
    sample.compactness_mean,
    sample.concavity_mean,
    sample.concave_points_mean,
    sample.symmetry_mean,
    sample.fractal_dimension_mean,
    sample.radius_se,
    sample.texture_se,
    sample.perimeter_se,
    sample.area_se,
    sample.smoothness_se,
    sample.compactness_se,
    sample.concavity_se,
    sample.concave_points_se,
    sample.symmetry_se,
    sample.fractal_dimension_se,
    sample.radius_worst,
    sample.texture_worst,
    sample.perimeter_worst,
    sample.area_worst,
    sample.smoothness_worst,
    sample.compactness_worst,
    sample.concavity_worst,
    sample.concave_points_worst,
    sample.symmetry_worst,
    sample.fractal_dimension_worst,
  ]);

  return tf.tensor2d(inputData, [inputData.length, 30]);
};

// Prepare output data for the model
const prepareOutputData = (data) => {
  const outputData = data.map((sample) => [sample.diagnosis === "M" ? 1 : 0]);
  return tf.tensor2d(outputData, [outputData.length, 1]);
};

export default neuralNetwork;
