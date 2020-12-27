const findIllegal = /[="\\']/gi;
const findComma = /[,]/gi;
const findUppercase = /[A-Z]/g;
// const findLineBreak = /(\r\n|\n|\r)/gm;
const findDoubleSpaces = / +(?= )/g;
const findEndBracket = /[}]/g;
const newLineTrigger = /[{};]/g;
const tempChar = "?";
const findComments = /\/\*[\s\S]*?\*\/|\/\/.*/g;

function ManipulateString({ mode, value }) {
  const comments = [];
  const convertComment = (comment, index) => {
    comments.push({ comment: comment, index: index });
    return `/*${comment.replace("//", "")}*/`;
  };
  const toCss = () => {
    //allows split by end bracket without cutting it away from the string
    const parts = value
      .replace(findEndBracket, (match) => `${match}${tempChar}`)
      .split(tempChar);
    const filteredArray = parts.map((part) => {
      part = part
        .trim()
        .replace(findComments, convertComment)
        .replace(findDoubleSpaces, "")
        .replace(findIllegal, "")
        .replace(findComma, ";")
        .replace(findUppercase, (char) => `-${char.toLowerCase()}`);

      const openBracketIndex =
        part.indexOf("{") > 0 ? part.indexOf("{") : false;

      
      const className =
        part
          .slice(0, openBracketIndex)
          .split(" ")
          .filter((string) => string.trim())
          .reverse()[0] || false;
        let preceedingComments = part.slice(0, openBracketIndex);
        const endIndex = preceedingComments.lastIndexOf("*/")
        console.log("end index " + endIndex)
        preceedingComments = preceedingComments.slice(0, endIndex + 2) 


      part = `${preceedingComments} ${className ? "." + className : ""} ${part.slice(
        openBracketIndex
      )}`;
      console.log(part)
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
        let comment, cssRule, ruleValue;
        const isFirstOrLast = string.search(/[{}]/) > -1 ? true : false;
        const commentIndex = string.search("//");
        const hasComment = commentIndex > -1 ? true : false;
        const colonIndex = string.search(":");
        const hasColon = colonIndex > -1 ? true : false;

        console.log(isFirstOrLast);

        return (
          <>
            {!isFirstOrLast ? <>&nbsp;&nbsp;&nbsp;&nbsp;</> : ""}
            {string} <br />
          </>
        );
      });
      console.log(jsx);
    }

    return (
      <div contenteditable="true" className="box">
        {jsx}
      </div>
    );
  };

  return formatAsJsx();
}
export default ManipulateString;
