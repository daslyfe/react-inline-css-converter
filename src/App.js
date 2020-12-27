import "./App.css";
import { createRef, useState } from "react";
import { ar, num } from "./utility/utility";
import ManipulateString from "./utility/manipulate-strings";
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "codemirror/theme/monokai.css";

const defaultInput = `
//this is a comment of some kind
//this is another comment
const style = {
  margin: 0, //test comment
  padding: 0,
  background: "none",
  fontSize: "1vw", //test comment
  top: ".2vw",
  fontWeight: "bold",
  left: "0",
  color: "blue",
  position: "absolute",
  width: "92%",
};`;

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

  return (
    <div className="App">
      <div className="">
        <label htmlFor="convert">convert:</label>

        <select name="convert" id="cars" onChange={handleSelect}>
          <option value="tocss">React inline to CSS</option>
          <option value="toinline">CSS to React inline</option>
        </select>
      </div>
      {/* <textarea
        className="box"
        type="text"
        defaultValue={defaultInput}
        ref={inputBoxRef}
        onChange={handleUserInput}
      /> */}
      <CodeMirror
        value={defaultInput}
        onChange={handleUserInput}
        options={{
          theme: "monokai",
          tabSize: 2,
          keyMap: "sublime",
          mode: "jsx",
        }}
      />
      <ManipulateString stringArray={userInput} mode={mode} />
    </div>
  );
}

export default App;
