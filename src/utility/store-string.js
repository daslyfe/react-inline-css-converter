const findIllegal = /[="\\']/gi;
const findComma = /[,]/gi;
const findUppercase = /[A-Z]/g;
const findLineBreak = /(\r\n|\n|\r)/gm;
const findDoubleSpaces = / +(?= )/g;
const findEndBracket = /[}]/g;
const newLineTrigger = /[{};]/g;
const tempChar = "?";

function ManipulateString({ mode, value }) {
  const toCss = () => {
    //allows split by end bracket without cutting it away from the string
    const parts = value
      .replace(findEndBracket, (match) => `${match}${tempChar}`)
      .split(tempChar);
    const filteredArray = parts.map((part) => {
      part = part
        .replace(findLineBreak, "")
        .replace(findDoubleSpaces, "")
        .trim()
        .replace(findIllegal, "")
        .replace(findComma, ";")
        .replace(findUppercase, (char) => `-${char.toLowerCase()}`);

      const openBracketIndex =
        part.indexOf("{") > 0 ? part.indexOf("{") : false;

      const className = openBracketIndex ? `.${part.split(" ")[1]}` : false;
      part = `${className ? className : ""} ${part.slice(openBracketIndex)}`;

      return part;
    });
    return filteredArray.join("");
  };

  const formatAsJsx = () => {
    let jsx = [];
    if (mode === "tocss") {
      const filteredString = toCss();

      //add in temporary character and split it at the temporary character to be processed as seperate JSX tags
      const stringArray = filteredString
        .replace(newLineTrigger, (match) => `${match}${tempChar}`)
        .split(tempChar)
        .map((string) => string.trim())
        .filter((string) => string.length > 0 && string !== ";");

      jsx = stringArray.map((string, key) => {
          //detects whether the string is the opening or closing bracket lines
          const isFirstOrLast = string.search(/[{}]/) > -1 ? true : false;
          const cssRuleIndex = string.search()
          console.log(isFirstOrLast);
        
        return (
          <>
            {!isFirstOrLast ? <>&nbsp;&nbsp;&nbsp;&nbsp;</> : ""}{string} <br />
          </>
        );
      });
      console.log(jsx);
    }

    return <div className="box">{jsx}</div>;
  };

  return formatAsJsx();
}
export default ManipulateString;
