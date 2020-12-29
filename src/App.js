/* Jade@JadeRose.red daslyfe.github.com */
import "./css/App.css";
import { useState } from "react";
import CodeFormatter from "./utility/code-formatter";

const defaultInput = [
  `//convert jsx inline -> CSS *or* CSS -> inline in realtime @Jade Rose`,
  `const myStyle = { writingMode: "vertical-rl", }`,
];

function App() {
  const [fromCss, setFromCss] = useState(defaultInput);
  const [fromJsx, setFromJsx] = useState(defaultInput);

  const handleUserInput = (e) => {
    const { doc } = e;
    const { modeOption } = doc;
    const { focused } = e.state;
    const { children } = doc;

    //get the line text from each array and flatten to single array
    const lines = children
      .map(({ lines }) => lines.map(({ text }) => text))
      .flat(1);

    //update the respective states, prevent rerender in the box you are typing in
    if (modeOption === "text/jsx" && focused) {
      setFromJsx(lines);
    } else if (modeOption === "text/css" && focused) {
      setFromCss(lines);
    }
  };

  return (
    <div className="app">
      <div className="flex flex-item">
        <CodeFormatter
          key={"jsx"}
          onChange={handleUserInput}
          stringArray={fromCss}
          mode={"jsx"}
        />
        <div className="bg-accent1 sideways-text-box">
          <h1 className="text-dark">REACT STYLE</h1>
        </div>
      </div>
      <h1 className="text-accent1">
        &#11015; <span className="text-accent2">&#11014;</span>
      </h1>
      <div className="flex flex-item">
        <CodeFormatter
          key={"css"}
          onChange={handleUserInput}
          stringArray={fromJsx}
          mode={"css"}
        />
        <div className="bg-accent2 sideways-text-box">
          <h1 className="text-dark bottom-text">CSS</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
