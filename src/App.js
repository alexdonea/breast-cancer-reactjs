import React, { useState, useRef } from "react";
import "./App.css";
import neuralNetwork from "./network";
import Content from "./components/content";
import Layout from "./components/layout";
import Input from "./components/input";

function App() {
  const [batchSize, setBatchSize] = useState(32);
  const [epochs, setEpochs] = useState(100);
  const [terminalData, setTerminalData] = useState("");
  const textareaRef = useRef(null);

  const updateTerminalCallback = (newText) => {
    setTerminalData((prevOutput) => prevOutput + newText + "\n");
    const textarea = textareaRef.current;
    if (textarea.scrollHeight > textarea.clientHeight) {
      textarea.scrollTop = textarea.scrollHeight + 30;
    }
  };

  const train = () => {
    neuralNetwork.train(batchSize, epochs, updateTerminalCallback);
  };

  const predict = () => {
    neuralNetwork.predict(updateTerminalCallback);
  };

  return (
    <Layout>
      <Content>
        <div className="main-wrapper-content">
          <textarea
            ref={textareaRef}
            className="log-textarea"
            value={terminalData}
            readOnly
          ></textarea>
          <div className="controllers-wrapper">
            <p>Batch Size</p>
            <Input value={batchSize} setValue={setBatchSize} />
            <p>Epochs</p>
            <Input value={epochs} setValue={setEpochs} />
            <button onClick={train}>Train</button>
            <button onClick={predict}>Predict</button>
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
