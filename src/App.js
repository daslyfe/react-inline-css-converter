import "./App.css";
import { createRef, useState } from "react";
import { ar, num } from "./utility/utility";
import ManipulateString from "./utility/manipulate-strings";
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

function App() {
  const [userInput, setUserInput] = useState([]);
  const [mode, setMode] = useState("tocss");
  console.log("mode " + mode);

  const inputBoxRef = createRef();

  const handleUserInput = ({ doc }) => {
    const { children } = doc;
    const lines = children
      .map(({ lines }) => lines.map(({ text }) => text))
      .flat(1);
    setUserInput(lines);
    console.log(lines);
  };

  const handleSelect = ({ target }) => {
    setMode(target.value);
  };

  const codeMirrorMode = mode === "tocss" ? "jsx" : "css";
  return (
    <div className="App">
      <div className="">
        <label htmlFor="convert">convert:</label>

        <select name="convert" id="cars" onChange={handleSelect}>
          <option value="tocss">React inline to CSS</option>
          <option value="tojsx">CSS to React inline</option>
        </select>
      </div>
      
      <div className="code-box-wrapper">
        <CodeMirror
          value={defaultInput}
          onChange={handleUserInput}
          options={{
            theme: "codebox",
            tabSize: 2,
            keyMap: "sublime",
            mode: codeMirrorMode,
          }}
        />
      </div>
      <center><h1 style={{margin: 0}}>&#11015;&#11015;</h1></center>
      <ManipulateString stringArray={userInput} mode={mode} />
    </div>
  );
}

export default App;
