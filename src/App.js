import "./App.css";
import { createRef } from "react";

const testStyle = {
  margin: 0,
  padding: 0,
  background: "none",
  fontSize: "1vw",
  top: ".2vw",
  fontWeight: "bold",
  left: "2%",
  color: "blue",
  position: "absolute",
  width: "92%",
};

const text = {
  value: "",
  toCss() {
    const findIllegal = /[="]/gi;
    const findComma = /[,]/gi;
    const findUppercase = /[A-Z]/g;
  
    let filteredString = this.value
      .replace(findIllegal, "")
      .replace(findComma, "; ")
      .replace(findUppercase, (char) => `-${char.toLowerCase()}`);

    const openBracketIndex = filteredString.indexOf("{") || false;
    const className =
      openBracketIndex && openBracketIndex != 0
        ? `.${filteredString.split(" ")[1]}`
        : false;
    filteredString = `${className ? className : ""} ${filteredString.slice(openBracketIndex)}`;
    return filteredString;
    console.log("filteredString " + filteredString);
    console.log("classname " + className);
    // return textArray.map((text) => {});
  },
  updateValue(input) {
    this.value = JSON.stringify(input);
  },
};
function App() {
  const leftInput = createRef();
  const rightInput = createRef();

  text.updateValue(testStyle);
  text.toCss();

  const handleLeftInput = ({ target }) => {
    const { value } = target;
    console.log(value);
  };

  const handleRightInput = ({ target }) => {
    const { value } = target;
    console.log(value);
  };

  return (
    <div className="App">
      <input type="text" ref={leftInput} onChange={handleLeftInput} />
      <input type="text" ref={rightInput} onChange={handleRightInput} />
      <code>{text.toCss()}</code>
    </div>
  );
}

export default App;
