import "./App.css";
import { createRef, useState } from "react";

const testStyle = {
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
};

function StoreString() {
  this.value = "";
  this.toCss = () => {
    const findIllegal = /[=\\"']/gi;
    const findComma = /[,]/gi;
    const findUppercase = /[A-Z]/g;

    let filteredString = this.value
      .replace(findIllegal, "")
      .replace(findComma, ";")
      .replace(findUppercase, (char) => `-${char.toLowerCase()}`);

    const openBracketIndex =
      filteredString.indexOf("{") > 0 ? filteredString.indexOf("{") : false;

    const className = openBracketIndex
      ? `.${filteredString.split(" ")[1]}`
      : false;
    filteredString = `${className ? className : ""} ${filteredString.slice(
      openBracketIndex
    )}`;
    console.log("filteredString " + filteredString);
    console.log("classname " + className);
    return filteredString;
    // return textArray.map((text) => {});
  };
  this.updateValue = (input) => {
    this.value = JSON.stringify(input);
  };
}


const inputString = new StoreString();
function App() {
  const [userInput, setUserInput] = useState("");
  const [mode, setMode] = useState("inlineToCss");

  const inputBoxRef = createRef();
 

  inputString.updateValue(userInput);
  inputString.toCss();

  const handleUserInput = ({ target }) => {
    const { value } = target;
    setUserInput(value);
  };



  return (
    <div className="App">
      <input type="text" ref={inputBoxRef} onChange={handleUserInput} />
  
      <code>{inputString.toCss()}</code>
    </div>
  );
}

export default App;
