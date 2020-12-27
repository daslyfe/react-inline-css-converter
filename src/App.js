import "./App.css";
import { createRef, useState } from "react";
import { ar, num } from "./utility/utility";
import ManipulateString from "./utility/store-string";

const defaultInput = `const style = {
  margin: 0, 
  padding: 0,
  background: "none",
  fontSize: "1vw",
  top: ".2vw",
  fontWeight: "bold",
  left: "0",
  color: "blue",
  position: "absolute",
  width: "92%",
};`;



function App() {
  const [userInput, setUserInput] = useState(defaultInput);
  const [mode, setMode] = useState("tocss");
  console.log("mode " + mode);

  const inputBoxRef = createRef();

  const handleUserInput = ({ target }) => {
    setUserInput(target.value);
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
      <textarea
        className="box"
        type="text"
        defaultValue={defaultInput}
        ref={inputBoxRef}
        onChange={handleUserInput}
      />
      <ManipulateString value={userInput} mode={mode} />
    </div>
  );
}

export default App;
