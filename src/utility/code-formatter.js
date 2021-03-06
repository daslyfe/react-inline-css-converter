import CodeMirror from "@uiw/react-codemirror";
import "codemirror/keymap/sublime";
import "../css/codebox.css";

const findComma = /[,]/gi;
const findEqualSign = /[=]/g;
const findUppercase = /[A-Z]/g;
const findComments = /\/\*[\s\S]*?\*\/|\/\/.*/g;
const findQuotes = /['"`]/g;
const findDoubleSpaces = / +(?= )/g;
const findSemicolon = /[;]/g;
const findClassName = /\.(.*?)\{/g;
const findHyphenAndNextLetter = /(?![^:]*\")+-[a-zA-z]/g; //ignore rule values
const findBetweenColonAndSemicolon = /(:)(.*?)(?=;)/g;
// const findNotBetweenBrackets = /[^}]+(?![^{]*\})/g;
// const findNotRuleValue = /[^;]+(?![^:]*\;)/g;
const findVariable = /(const|let|var)(.*?)(?==)/g;

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

      string = string
        //get the JS variable name and convert into CSS class Name
        .replace(findVariable, (match) => {
          const beforeEqualsAndOutsideBrackets = match.trim().split(" ");
          return `.${
            beforeEqualsAndOutsideBrackets[
              beforeEqualsAndOutsideBrackets.length - 1
            ]
          }`;
        })
        .replace(findEqualSign, "")
        .replace(findComma, ";")
        //turn JSX camelcase rules into css rules
        .replace(findUppercase, (match) => `-${match.toLowerCase()}`)
        .replace(findQuotes, "");

      return string;
    });

    return reAddComments(comments, filteredArray);
  };
  const toJsx = () => {
    //removed comments are stored in this array
    let comments = []; 
    //remove comments, and store them with their index to be added back in later
    const filteredArray = stringArray.map((string, index) => {
      string = string.replace(findComments, (match) => {
        comments.push({ comment: match.trim(), index: index });
        return "";
      });

      string = string
      //turn class name into JS variable name
        .replace(
          findClassName,
          (match) => `const ${match.slice(1, match.length - 1)}= {`
        ) 
        //put rule value in quotes
        .replace(findBetweenColonAndSemicolon, (match) => `: "${match.slice(1).trim()}"`) 
        //turn hyphens into camelcase
        .replace(findHyphenAndNextLetter, (match) => match[1].toUpperCase()) 
        //turn semicolons into hyphens, except at the end of a closing bracket
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
        onChange={onChange ? onChange : (e) => console.log(e)} //extraneous function prevents error in Codemirror library where if onChange is not defined, it will crash
        value={convertedString}
        options={{
          theme: "codebox",
          tabSize: 2,
          keyMap: "sublime",
          mode: mode,
          lineWrapping: true,
        }}
      />
    </div>
  );
}
export default CodeFormatter;
