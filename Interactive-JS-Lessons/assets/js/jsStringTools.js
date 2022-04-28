function splitBySemi(array){
  let newArray = new Array();
  for(string of array){
    if(string.match(/[;]/g)){
      let temp = string.split(/([;])/g);
      for(substring of temp){
        newArray.push(substring);
      }
    }else{
      newArray.push(string);
    }
  }
  return newArray;
}
function breakIntoComponents(inputString) {
    // console.log(inputString);
    //this needs more work
    //first, we must first remove all line breaks and whitespace. we also assume that user writes javascript with the use of semi colons...
    //inputString = inputString.replace(/\n/g, " ");
    // inputString = trimStringInArray(inputString.split("\n"));
    // inputString = commentsCleanse(inputString);
    inputString = inputString.split(/([\n])/g);
    inputString = commentsCleanse(inputString);
    inputString = splitBySemi(inputString);
    inputString = trimStringInArray(inputString);
    inputString = removeEmptyIndices(inputString);
    // inputString.match(/[^\;]+\;?|\;/g);
    var outputArray = splitByBrackets(inputString);
    outputArray = combineSemiColonsWithPreviousLines(outputArray);
    outputArray = injectHelpers(outputArray);
    return outputArray;
  }
  function commentsCleanse(array){
    let newArray = new Array();
    for(string of array){
      if(string.match(/(?:\/\/)/)){
        let cleansedString = string.split(/[/]+/)[0];
        newArray.push(cleansedString);
      }else{
        newArray.push(string);
      }
    }
    newArray = removeEmptyIndices(newArray);
    return newArray;
  }
  function splitByBrackets(inputString){
    var outputArray = new Array();
    for (var x = 0; x < inputString.length; x++) {
      var temp = inputString[x].split(/([}{])/g);
      for (var index = 0; index < temp.length; index++) {
        outputArray.push(temp[index]);
      }
    }
    outputArray = trimStringInArray(outputArray);
    outputArray = removeEmptyIndices(outputArray);
    return outputArray;
  }
  function trimStringInArray(array) {
    for (var index = 0; index < array.length; index++) {
      array[index] = array[index].trim();
    }
    return array;
  }
  function removeEmptyIndices(array) {
    //clean array if nothing is detected on indexes
    var newArray = new Array();
    for (var index = 0; index < array.length; index++) {
      if (!(array[index].trim().length === 0)) {
        newArray.push(array[index]);
      }
    }
    return newArray;
  }
  function combineSemiColonsWithPreviousLines(array) { //cause i cant figure out how to split by semi colons on the 
    var newArray = new Array();                       //same line. whelps
    for (var index = 0; index < array.length; index++) { 
      if (array[index].match(";")) {
        var temp = array[index - 1] + array[index];
        newArray.push(temp);
      }else if(index >= array.length-1){
        newArray.push(array[index]+";");
      }else if (!array[index + 1].match(";")){
        newArray.push(array[index]);
      }
    }
    newArray = trimStringInArray(newArray);
    newArray = removeEmptyIndices(newArray);
    return newArray;
  }
  function splitIntoTokens(array) { //ONLY USE THIS AFTER INPUT STRING IS COMPLETELY BROKEN DOWN AND CLEANSED.
  var newArray = new Array();
  for (var index = 0; index < array.length; index++) {
    //FOR FUNCTION DECLARATIONS
    if (array[index].match(/(^function)+([ ]+)/gm)) {
      var temp = array[index].split(/(^function)+([ ]+)/gm);
      temp = removeEmptyIndices(temp);
      temp[0] = temp[0] + " ";
      // console.log(temp);
      for (var x = 0; x < temp.length; x++) {
        newArray.push(temp[x]);
      }
    }
    //FOR VARIABLE DECLARATIONS
    else if (array[index].match(/(^var)+([ ]+)/gm)) {
      var temp = array[index].split(/(^var)+([ ]+)/gm);
      temp = removeEmptyIndices(temp);
      temp[0] = temp[0] + " ";
      for (var x = 0; x < temp.length; x++) {
        newArray.push(temp[x]);
      }
    }else if (array[index].match(/(^let)+([ ]+)/gm)) {
      var temp = array[index].split(/(^let)+([ ]+)/gm);
      temp = removeEmptyIndices(temp);
      temp[0] = temp[0] + " ";
      for (var x = 0; x < temp.length; x++) {
        newArray.push(temp[x]);
      }
    } else { //EVERYTHING ELSE SHOULD JUST BE REGULAR STATEMENTS, ei variable declare / redeclaration, function calls,  in theory this method should allow for the addition of if's loops etc...
      newArray.push(array[index]);
    }
  }
  return newArray;
}
function detectStatementVariableReassignment(string){
  const detectVarReassignStatement = new RegExp(/^([a-zA-Z0-9]*[ ]*[=][ , a-zA-Z, 0-9, *, /, +, -, ;]*)/gm);
  //improve this regex here: https://regex101.com/r/Gp6J3c/1
  return detectVarReassignStatement.test(string);
}