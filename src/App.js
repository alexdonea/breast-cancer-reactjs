import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as tf from "@tensorflow/tfjs";
import Console from "./Components/Console";
import Button from "./Components/Button";
import RadioButton from "./Components/RadioButton";
import Input from "./Components/Input";
import { dataset, xTest, yTest } from "./Dataset/datasetJson";
import { filterData } from "./Dataset";

const e = React.createElement;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.clearConsole = this.clearConsole.bind(this);
    this.addConsoleValue = this.addConsoleValue.bind(this);
    this.trainingModeAction = this.trainingModeAction.bind(this);
    this.updateEpochs = this.updateEpochs.bind(this);
    this.updatebatchIterations = this.updatebatchIterations.bind(this);
    this.predictTrainedModel = this.predictTrainedModel.bind(this);
    this.train = this.train.bind(this);
    this.state = {
      console: [],
      epochs: 50,
      batchIterations: 1,
      mode: "default"
    };
  }

  clearConsole() {
    this.setState({
      console: []
    });
  }

  train() {
    const date = new Date();
    this.setState({
      console: [
        ...this.state.console,
        "[" +
          date.toLocaleTimeString() +
          "]:Epochs " +
          this.state.epochs +
          "Iter " +
          this.state.batchIterations
      ]
    });
  }

  updatebatchIterations(iteration) {
    this.setState({
      batchIterations: iteration
    });
  }
  updateLearningRate(learningRate) {
    this.setState({
      learningRate: learningRate
    });
  }
  updateEpochs(epoch) {
    this.setState({
      epochs: epoch
    });
  }

  trainingModeAction(mode) {
    this.setState({
      mode: mode
    });
  }

  addConsoleValue(value) {
    const date = new Date();
    this.setState({
      console: [
        ...this.state.console,
        "[" + date.toLocaleTimeString() + "] " + value
      ]
    });
  }

  renderMode(mode) {
    switch (mode) {
      default:
        return e(
          "div",
          {},
          <Button label="Train" onClick={this.trainModel} />,
          <Button label="Predict" onClick={this.predictTrainedModel} />
        );
      case "custom":
        return e("p", {}, "Coming soon");
    }
  }
  predictTrainedModel = async () => {
    const xTestData = tf.tensor2d(xTest, [xTest.length, xTest[0].length]);
    const yTestData = tf.tensor2d(yTest, [yTest.length, yTest[0].length]);
    const modelStorage = await tf.loadLayersModel(
      "localstorage://breast-cancer-model"
    );
    tf.tidy(() => {
      const output = modelStorage.predict(xTestData);
      const predictions = output.dataSync();
      let correct = 0;
      let wrong = 0;
      let total = 0;
      const yTestValues = yTestData.dataSync();
      predictions.forEach((value, index) => {
        total++;
        console.log(value, yTestValues[index]);
        if (yTestValues[index] === 1) {
          let result = "Malignant";
          if (value > 0.5) {
            result = "Malignant";
            correct++;
          } else {
            result = "Benign";
            wrong++;
          }
          this.addConsoleValue(
            `Test data [${index}] Predict = Malignant,  Test diagnosis = ${result}`
          );
        } else if (yTestValues[index] === 0) {
          let result = "Benign";
          if (value < 0.5) {
            result = "Benign";
            console.log("here?2???");
            correct++;
          } else {
            result = "Malignant";
            wrong++;
          }
          this.addConsoleValue(
            `Test data [${index}] Predict = Benign,  Test diagnosis = ${result}`
          );
        }
      });
      this.addConsoleValue(
        `Correct=${correct}, Wrong = ${wrong} Total=${total}`
      );
    });
  };
  trainModel = async () => {
    this.addConsoleValue("Start training...");

    const data = filterData(dataset);

    const xTensorTrain = tf.tensor2d(data.xTrain, [
      data.xTrain.length,
      data.xTrain[0].length
    ]);
    const yTensorTrain = tf.tensor2d(data.yTrain, [
      data.yTrain.length,
      data.yTrain[0].length
    ]);

    //Create model as sequential
    const model = tf.sequential();
    const batchSize = parseInt(this.state.batchIterations) || 1;
    const trainEpochs = parseInt(this.state.epochs) || 1;

    //initialize layers
    const inputLayer = tf.layers.dense({
      units: 30,
      inputDim: 30,
      activation: "relu"
    });

    const hiddenLayer = tf.layers.dense({
      units: 30,
      activation: "relu"
    });

    const hiddenLayer2 = tf.layers.dense({
      units: 30,
      activation: "relu"
    });
    const outputLayer = tf.layers.dense({
      units: 1,
      activation: "sigmoid"
    });

    model.add(inputLayer);
    model.add(hiddenLayer);
    model.add(hiddenLayer2);
    model.add(outputLayer);

    model.compile({
      optimizer: "rmsprop",
      loss: "meanSquaredError",
      metrics: ["accuracy"]
    });

    let valAcc;
    await model
      .fit(xTensorTrain, yTensorTrain, {
        batchSize: batchSize,
        epochs: trainEpochs,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            valAcc = logs.acc;
            this.addConsoleValue(
              `Epoch[${epoch}] Loss:${logs.loss}  Acc:${logs.acc}`
            );
          }
        }
      })
      .then(async () => {
        const testResult = model.evaluate(xTensorTrain, yTensorTrain);
        const testAccPercent = testResult[0].dataSync()[0] * 100;
        const finalValAccPercent = valAcc * 100;
        this.addConsoleValue(
          `Final validation accuracy: ${finalValAccPercent.toFixed(1)}%; ` +
            `Final test accuracy: ${testAccPercent.toFixed(1)}%`
        );

        await model.save("localstorage://breast-cancer-model");
        this.addConsoleValue("Model saved to LocalStorage");
      });
  };

  render() {
    return e(
      "div",
      {
        className: "container",
        style: {
          position: "relative",
          top: 100
        }
      },
      e(
        "div",
        { className: "row" },
        e(
          "div",
          { className: "col-md-6" },
          e("p", null, "Console"),
          <Console console={this.state.console} />,
          <Button label="Clear" onClick={this.clearConsole} />
        ),
        e(
          "div",
          { className: "col-md-6" },
          e("p", {}, "Train"),
          e("p", null, "Default Breast Cancer Dataset"),
          e(
            "div",
            { className: "row" },
            e(
              "div",
              { className: "col-md-6" },
              e("p", {}, "Epochs"),
              <Input
                placeholder="Enter here number of epochs"
                value={this.state.epochs}
                updateValue={this.updateEpochs}
              />
            ),
            e(
              "div",
              { className: "col-md-6" },
              e("p", {}, "Batch Iterations"),
              <Input
                placeholder="Enter here number of batchIterations"
                value={this.state.batchIterations}
                updateValue={this.updatebatchIterations}
              />
            ),
            e(
              "div",
              { className: "col-md-6" },
              <RadioButton
                label="Default dataset train"
                value="default"
                onModeSelection={this.trainingModeAction}
              />
            ),
            e(
              "div",
              { className: "col-md-6" },
              <RadioButton
                label="Custom dataset train"
                value="custom"
                onModeSelection={this.trainingModeAction}
              />
            )
          ),
          this.renderMode(this.state.mode)
        )
      )
    );
  }
}

export default App;
