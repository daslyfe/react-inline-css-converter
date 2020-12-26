const findIllegal = /[="\\']/gi;
const findComma = /[,]/gi;
const findUppercase = /[A-Z]/g;
const findLineBreak = /(\\r\\n|\\n|\\r)/gi;
const findDoubleSpaces = / +(?= )/g;
const findEndBracket = /[}]/g;

function StoreString() {
  this.value = "";
  
  this.toCss = () => {
    //allows split by end bracket without cutting it away from the string
    const parts = this.value.replace(findEndBracket, "}^").split("^");
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
    return filteredArray;

  };
  this.updateValue = (input) => {
    this.value = JSON.stringify(input);
  };

  this.formatAsHtml = (mode) => {
      if (mode === "tocss") {
        const filteredArray = this.toCss();
        const html = filteredArray.map((part) => {
            
        })

      } 
  }
}
export default StoreString;
