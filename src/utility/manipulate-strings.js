const findComma = /[,]/gi;
const findUppercase = /[A-Z]/g;
const findComments = /\/\*[\s\S]*?\*\/|\/\/.*/g;

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
        ? `${className} ${string.slice(openBracketIndex)}`
        : string;
   
      string = string
        .replace(findComma, ";")
        .replace(findUppercase, (match) => `-${match.toLowerCase()}`);

      return string;
    });

    //replace invalid comment syntax in comment array with valid css comment syntax
    comments = comments.map(({ comment, index }) =>
      comment.slice(0, 2) === "//"
        ? { comment: `/*${comment.slice(2)}*/`, index: index }
        : { comment: comment, index: index }
    );
    //add the comments back in with the correct syntax
    comments.forEach(({comment, index}) => filteredArray[index] = `${filteredArray[index]} ${comment}`)

    return filteredArray;
  };
  return (
    <div contenteditable="true" className="box">
      {toCss()}
    </div>
  );
}
export default ManipulateString;
