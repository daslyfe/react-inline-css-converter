import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "../css/codebox.css";

const findComma = /[,]/gi;
const findUppercase = /[A-Z]/g;
const findComments = /\/\*[\s\S]*?\*\/|\/\/.*/g;
const findQuotes = /['"`]/g;
const findDoubleSpaces = / +(?= )/g;

function ManipulateString({ mode, stringArray }) {
  //convert jsx style syntax array to css style syntax array
  const toCss = () => {
    let comments = [];
    const filteredArray = stringArray.map((string, index) => {
      //filter out code comments
      string = string.replace(findComments, (match) => {
        comments.push({ comment: match, index: index });
        return "";
      });
      const openBracketIndex = string.indexOf("{");
      const equalIndex = string.indexOf("=");
      const firstSpaceIndex = string.indexOf(" ");
      const isClassLine = openBracketIndex > -1 && equalIndex > -1;

      //remove variable declaration and replace with className
      const className = isClassLine
        ? `.${string.slice(firstSpaceIndex + 1, equalIndex)}`
        : false;

      string = isClassLine
        ? `${className} ${string.slice(openBracketIndex)}`.replace(
            findDoubleSpaces,
            ""
          )
        : string;

      string = string
        .replace(findComma, ";")
        .replace(findUppercase, (match) => `-${match.toLowerCase()}`)
        .replace(findQuotes, "");

      return string;
    });

    //replace invalid comment syntax in comment array with valid css comment syntax
    comments = comments.map(({ comment, index }) =>
      comment.slice(0, 2) === "//"
        ? { comment: `/*${comment.slice(2)}*/`, index: index }
        : { comment: comment, index: index }
    );
    //add the comments back in with the correct syntax
    comments.forEach(
      ({ comment, index }) =>
        (filteredArray[index] = `${filteredArray[index]} ${comment}`)
    );

    //convert array to a single string with linebreak character between each item in array
    return filteredArray.join("\n");
  };

  const convertedString = mode === "tocss" ? toCss() : "";
  const codeMirrorMode = mode === "tocss" ? "css" : "jsx";

  return (
    <div className="code-box-wrapper">
      <CodeMirror
        value={convertedString}
        options={{
          theme: "codebox",
          tabSize: 2,
          keyMap: "sublime",
          mode: codeMirrorMode,
        }}
      />
    </div>
  );
}
export default ManipulateString;
