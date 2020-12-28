import "./App.css";
import { createRef, useState } from "react";
import { ar, num } from "./utility/utility";
import CodeFormatter from "./utility/code-formatter";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "./css/codebox.css";
// import "codemirror/theme/shadowfox.css";

const defaultInput = `//you can paste text to convert jsx style objects directly to css classes
//comments get converted as well

const style = {
  margin: 0, 
  padding: 0,
  fontSize: "1vw", //jsx style rules convert to equivalent css rules
}

let otherStyle = {
  fontWeight: "bold",
  collor: "blue", //non-matching or misspelled rules are highlighted
  backgroundColor: "red" 
}

/* you can also drop in fragments of jsx styles */
marginBottom: "2em", marginTop: "4em", 
`;

const testCssInput = `.style {
  margin: 0; 
  padding: 0;
  font-size: 1vw;  /*jsx style rules convert to equivalent css rules*/
}

.other-style {
  font-weight: bold;
  collor: blue;  /*non-matching or misspelled rules are highlighted*/
  background-color: red 
}
.other-style { font-weight: bold; collor: blue;  /*non-matching or misspelled rules are highlighted*/ background-color: red }
`;

function App() {
  // const [userInput, setUserInput] = useState([]);
  const [fromCss, setFromCss] = useState([]);
  const [fromJsx, setFromJsx] = useState([]);



  const handleUserInput = ({ doc }) => {
    const { modeOption } = doc;
    console.log("modeOption " + modeOption)
    const { children } = doc;
    const lines = children
      .map(({ lines }) => lines.map(({ text }) => text))
      .flat(1);
    modeOption === "text/jsx" ? setFromJsx(lines) : setFromCss(lines);
    console.log(lines);
  };

  // const handleSelect = ({ target }) => {
  //   setMode(target.value);
  // };

  return (
    <div className="App">
      <div className="">
        {/* <label htmlFor="convert">convert:</label>

        <select name="convert" id="cars" onChange={handleSelect}>
          <option value="tocss">React inline to CSS</option>
          <option value="tojsx">CSS to React inline</option>
        </select> */}
      </div>

      {/* <div className="code-box-wrapper">
        <CodeMirror
          value={defaultInput}
          onChange={handleUserInput}
          options={{
            theme: "codebox",
            tabSize: 2,
            keyMap: "sublime",
            mode: "jsx",
          }}
        />
      </div> */}
      <center>
        <h1 style={{ margin: 0 }}>&#11015;&#11015;</h1>
      </center>
      <CodeFormatter key={"jsx"} onChange={handleUserInput} stringArray={fromCss} mode={"jsx"} />
      <CodeFormatter key={"css"} onChange={handleUserInput} stringArray={fromJsx} mode={"css"} />
    </div>
  );
}

export default App;
