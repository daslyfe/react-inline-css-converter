import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "../css/codebox.css";

const findComma = /[,]/gi;
const findUppercase = /[A-Z]/g;
const findComments = /\/\*[\s\S]*?\*\/|\/\/.*/g;
const findQuotes = /['"`]/g;
const findDoubleSpaces = / +(?= )/g;
const findSemicolon = /[;]/g;
const findClassName = /\.(.*?)\{/g;
const findHyphenAndNextLetter = /-[a-z]/g;
const findBetweenColonAndSemicolon = /(?<=:)(.*?)(?=;)/g;

function CodeFormatter({
  mode,
  stringArray,
  onChange,
  className,
  style,
  onFocus,
}) {
  const reAddComments = (comments, filteredArray) => {
    //convert js style syntax array to css/js style syntax array
    comments = comments.map(({ comment, index }) =>
      comment.slice(0, 2) === "//"
        ? { comment: `/*${comment.slice(2)}*/`, index: index }
        : { comment: comment, index: index }
    );
    //add the comments back in with the correct syntax
    comments.forEach(
      ({ comment, index }) =>
        (filteredArray[index] = `${filteredArray[index]}${comment}`)
    );

    //convert array to a single string with linebreak character between each item in array
    return filteredArray.join("\n");
  };

  const toCss = () => {
    let comments = [];
    const filteredArray = stringArray.map((string, index) => {
      //filter out code comments
      string = string.replace(findComments, (match) => {
        comments.push({ comment: match.trim(), index: index });
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

    return reAddComments(comments, filteredArray);
  };
  const toJsx = () => {
    let comments = [];

    const filteredArray = stringArray.map((string, index) => {
      //remove comments, and store them with their index to be added back in later
      string = string.replace(findComments, (match) => {
        comments.push({ comment: match.trim(), index: index });
        return "";
      });

      string = string
        .replace(
          findClassName,
          (match) => `const ${match.slice(1, match.length - 1)}= {`
        )
        .replace(findHyphenAndNextLetter, (match) => match[1].toUpperCase())
        .replace(findBetweenColonAndSemicolon, (match) => ` "${match.trim()}"`)
        .replace(findSemicolon, (match, index) =>
          string[index - 1] !== "}" ? "," : ""
        )
        .replace(findDoubleSpaces, "");

      return string;
    });

    return reAddComments(comments, filteredArray);
  };
  const convertedString = mode === "css" ? toCss() : toJsx();

  return (
    <div style={style} className={`code-box-wrapper ${className}`}>
      <CodeMirror
        onChange={onChange ? onChange : (e) => console.log(e)} //prevents error in Codemirror library where if onChange is not defined, it will crash
        value={convertedString}
        options={{
          theme: "codebox",
          tabSize: 2,
          keyMap: "sublime",
          mode: mode,
        }}
      />
    </div>
  );
}
export default CodeFormatter;
