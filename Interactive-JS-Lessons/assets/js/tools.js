var lineNumberMap = new Map(); //just use a hash map???
var gutterCounter = 0;
const gutterDelay = 400;
function visualizeLineNumbers(hash){
  if(lineNumberMap.get(hash)){
    let lineNum = lineNumberMap.get(hash);
    setTimeout(function(){
      gutter[lineNum].style.background = "limegreen";
      setTimeout(function(){
        gutter[lineNum].style.background = "";
      }, gutterDelay);
    }, gutterDelay * gutterCounter);
    gutterCounter++;
  }
}
function injectHelpers(array, start){
  // console.log("array before injection : ", array);
    var newArray = new Array();
    var newStack = new Stack();
    let stringtestdata = newTest.returnCurrentQuestion().stringsTests;
    let stringTests = new Stack(JSON.parse(JSON.stringify(stringtestdata)));
    console.log(array);
    
    if(typeof(start) === "undefined"){
        start = 0;
    }
    for(let string of array){
      string = string.split(/\/\//)[0];
      console.log(string);
      stringTests.getIndexOfandPop(string.toString());
    }
    for(let i = start; i < array.length; i++){ //this is bound to cause bugs later on.
      let x = i; //preserve line number
      array[i] = array[i].trim();
        if(array[i].match(/(^function)+([ ]+)/)){ 
            newStack.push("function");
            var functionName = array[i].split(/(^function)+([ ]+)/);
            var hash = array[i+2].split(/\/\//)[1].split(/[=]/)[1];
            functionName = removeEmptyIndices(functionName)[1].split(/([a-zA-Z0-9 ]+)+([(])/)[1];
            var inputs = trimStringInArray(array[i].split("function ")[1].split(/[(|)]/)[1].split(","));
            // console.log("inputs: ", inputs);
            // console.log("functionName", functionName);
            newArray.push(`{
              let tempFrame = currentFrame.returnPreviousFunctionScope();
              tempFrame.declaredFunctions.set("${functionName}", currentFrame);
            }`);
            newArray.push(array[i]);
            i++;
            newArray.push(array[i]);
            newArray.push(`
            frameStack.push(currentFrame);
            currentFrame = new Frame(currentFrame, "${functionName}", "scoped");`);
            for(string of inputs){
              if(string !== ""){
                newArray.push(`currentFrame.addVariable("var", "${string}", ${string});`); //all javascript inputs are var's
              }
            }
            newArray.push(`visualizeLineNumbers(${hash});`);
            // newArray.push(`functionDeclared.set("${functionName}", currentFrame);`);
        }
        else if(array[i].match(/(^if)/) || array[i].match(/(^else)/)){ 
          var hash = array[i+2].split(/\/\//)[1].split(/[=]/)[1];
          newStack.push("blockscope");
          newArray.push(array[i]);
          if(array[i].match(/(^if)/)){
            i++;
            newArray.push(array[i]);
            newArray.push(`currentFrame = new Frame(currentFrame, "ifBlock", "blocked");`);
          }else{
            i++;
            newArray.push(array[i]);
            newArray.push(`currentFrame = new Frame(currentFrame, "elseBlock", "blocked");`);
          }
          newArray.push(`visualizeLineNumbers(${hash});`);
        } 
        else if((/(^for)/g).test(array[i])){
          var hash = array[i+2].split(/\/\//)[1].split(/[=]/)[1];
          newStack.push("blockscope");
          newArray.push(array[i]);
          i++;
          newArray.push(array[i]);
          newArray.push(`visualizeLineNumbers(${hash});`);
          newArray.push(`currentFrame = new Frame(currentFrame, "forLoopBlock", "blocked");`);
        } 

        else if((/(^while)/g).test(array[i])){
          var hash = array[i+2].split(/\/\//)[1].split(/[=]/)[1];
          newStack.push("blockscope");
          newArray.push(array[i]);
          i++;
          newArray.push(array[i]);
          newArray.push(`visualizeLineNumbers(${hash});`);
          newArray.push(`currentFrame = new Frame(currentFrame, "whileLoopBlock", "blocked");`);
        } 
        else if(array[i].match(/(^var)+([ ]+)/)){
          var variableName = array[i].split(/^var/)[1].trim().split(/[=]/)[0].trim().split(/[;]/)[0];
          if(i !== (array.length -1) && array[i+1].match(/[{]/) && (array[i].split("=")[1].trim() === "" || array[i].split("=")[1].trim().match(/(^function)/))){ //tests if anon function is declared
            var hash = array[i+2].split(/\/\//)[1].split(/[=]/)[1];
            newArray.push(array[i]);
            i++;
            newArray.push(array[i]);  
            newStack.push(variableName);
            newStack.push("var");
            newStack.push(hash);
            newStack.push("anonFunctionOrObject");
            continue;
          }
          var hash = array[i].split(/\/\//)[1].split(/[=]/)[1];
          newArray.push(`visualizeLineNumbers(${hash});`);
          newArray.push(array[i]);
          newArray.push(`currentFrame.addVariable("var", "${variableName}", ${variableName});`);
        }
        else if(array[i].match(/(^let)+([ ]+)/)){
            var variableName = array[i].split(/^let/)[1].trim().split(/[=]/)[0].trim().split(/[;]/)[0];
            if(i !== (array.length -1) && array[i+1].match(/[{]/) && (array[i].split("=")[1].trim() === "" || array[i].split("=")[1].trim().match(/(^function)/))){ //tests if anon function is declared
              var hash = array[i+2].split(/\/\//)[1].split(/[=]/)[1];
              newArray.push(array[i]);
              i++;
              newArray.push(array[i]);  
              newStack.push(variableName);
              newStack.push("let");
              newStack.push(hash);
              newStack.push("anonFunctionOrObject");
              continue;
            }
            var hash = array[i].split(/\/\//)[1].split(/[=]/)[1];
            newArray.push(`visualizeLineNumbers(${hash});`);
            newArray.push(array[i]);
            newArray.push(`currentFrame.addVariable("let", "${variableName}", ${variableName});`);
        }
        else if(array[i].match(/(^const)+([ ]+)/)){
          var variableName = array[i].split(/^const/)[1].trim().split(/[=]/)[0].trim().split(/[;]/)[0];
          if(i !== (array.length -1) && array[i+1].match(/[{]/) && (array[i].split("=")[1].trim() === "" || array[i].split("=")[1].trim().match(/(^function)/))){ //tests if anon function is declared
            var hash = array[i+2].split(/\/\//)[1].split(/[=]/)[1];
            newArray.push(array[i]);
            i++;
            newArray.push(array[i]);  
            newStack.push(variableName);
            newStack.push("const");
            newStack.push(hash);
            newStack.push("anonFunctionOrObject");
            continue;
          }
          var hash = array[i].split(/\/\//)[1].split(/[=]/)[1];
          newArray.push(`visualizeLineNumbers(${hash});`);
          newArray.push(array[i]);
          newArray.push(`currentFrame.addVariable("const", "${variableName}", ${variableName});`);
      }
      else if(detectStatementVariableReassignment(array[i])){
          var variableName = array[i].split(/=/)[0].trim();  
          
          if(i !== (array.length -1) && array[i+1].match(/[{]/) && (array[i].split("=")[1].trim() === "" || array[i].split("=")[1].trim().match(/(^function)/))){
              var hash = array[i+2].split(/\/\//)[1].split(/[=]/)[1];
              newArray.push(array[i]);
              i++;
              newArray.push(array[i]);
              newStack.push(variableName);
              newStack.push(hash);
              newStack.push("variableRedeclaration");
              continue;
            }
            var hash = array[i].split(/\/\//)[1].split(/[=]/)[1];
            newArray.push(array[i]);
            newArray.push(`visualizeLineNumbers(${hash});`);
            newArray.push(`currentFrame.updateVariable("${variableName}", ${variableName});`);
        }
        else if(array[i].match(/(^return)/)){
          var hash = array[i].split(/\/\//)[1].split(/[=]/)[1];
          newArray.push(`visualizeLineNumbers(${hash});`);
          newArray.push("currentFrame = frameStack.pop() || currentFrame.returnPreviousFunctionScope();")
          newArray.push(array[i]);
          // i++;
          // newArray.push(array[i]);
        }
        else if(array[i].match(/(^console.log)/)){ 
          var hash = array[i].split(/\/\//)[1].split(/[=]/)[1];
          var logString = array[i].split(/^([ ]*)+(?:[console])+([ ]*)+([.])+([ ]*)+(?:log)/gm)[5];
          logString = logString.split(/\/\//)[0];
          logString = logString.split(";")[0];
          console.log("log string is", logString);
          logString = logString.slice(1, logString.length - 1);
          var logArray = JSON.stringify(logString.split(/,(?=(?:(?:[^"|^']*"){2})*[^"|^']*$)/));
          newArray.push(`{
          let logString = ${logArray}.map(log=>JSON.stringify(eval(log))).join(" ").replace(/["|']/g, '');
          logToPage(logString);
          storeLogs(logString);
          currentFrame.addConsoleLogs(logString)
          }`);
          newArray.push(`visualizeLineNumbers(${hash});`);
          // newArray.push(`visualizeLineNumbers('${array[x]}`);
        }  
        else if(array[i].match(/}/g)){
          if(newStack.peek() === "anonFunctionOrObject"){
            // console.log("hello");
            newStack.pop();
            let hash = newStack.pop();
            let type = newStack.pop();
            let name = newStack.pop();
            newArray.push(array[i]);
            newArray.push(`visualizeLineNumbers(${hash});`);
            newArray.push(`currentFrame.addVariable("${type}", "${name}", ${name});`);
          }
          else if(newStack.peek() === "function"){
            var hash = array[i+1].split(/\/\//)[1].split(/[=]/)[1];
            newArray.push(`visualizeLineNumbers(${hash});`);
            newArray.push("currentFrame = frameStack.pop();");
            newArray.push(array[i]);
            newStack.pop();
          }
          else if(newStack.peek() === "variableRedeclaration"){
            newStack.pop();
            let hash = newStack.pop();
            let variableName = newStack.pop();
            newArray.push(array[i]);
            newArray.push(`visualizeLineNumbers(${hash});`);
            newArray.push(`currentFrame.updateVariable("${variableName}", ${variableName});`);
          }
          else if(newStack.peek().match(/{/g)){
            newArray.push(array[i]);
            newStack.pop();
          }
          else if(newStack.peek() === "blockscope"){
            newArray.push('currentFrame = currentFrame.previousFrame;');
            newArray.push(array[i]);
            newStack.pop();
          }
        }
        else if(array[i].match(/{/)){
          if(newStack.peek() !== ("anonFunctionOrObject" && "variableRedeclaration")){ //i learned a new syntax today
            var hash = array[i+1].split(/\/\//)[1].split(/[=]/)[1];
            console.log("new hash is", hash);
            newArray.push(`visualizeLineNumbers(${hash});`);
            newArray.push(array[i]);
            newArray.push(`currentFrame = new Frame(currentFrame, "genericBlock", "blocked");`);
            newStack.push("blockscope");
          }else{
            newArray.push(array[i]);
            newStack.push("{");
          }
        }else if(detectFunctionCalls(array[i])){
          var hash = array[i].split(/\/\//)[1].split(/[=]/)[1];
          newArray.push(`visualizeLineNumbers(${hash});`);
          newArray.push(array[i]);
        }
        else{
            newArray.push(array[i]);
        }
        // console.log(newStack);
    }
    while(stringTests.size() > 0){
      let failedTest = "Failed to detect line : " + stringTests.pop();
      window.failedTests.push(failedTest);
    }
    newArray = trimStringInArray(newArray);
    newArray = removeEmptyIndices(newArray);
    return newArray;
}
function variablesInjecters(data){
  let array = data.tokenArray;
  let i = data.index;
  let newArray = data.currentArray;
  let newStack = data.stack;
  let variableName = data.name;
  let variableType = data.type;

}
function makeConsoleTester(logs){ //please remake this
    if(logs.length === 0){
      return ``
    }
    return `
    var logs = ${JSON.stringify(logs)};
    for(log of logs){
      if(!searchFramesForConsoleLogging(log.val, log.scopeName, currentFrame)){
         failedTests.push("Expected scope : " + log.scopeName);
        failedTests.push("Failed to detect console.log output: " + log.val);
      }
    }
    `
  }
  
function makeVariableTester(vars){
  if(vars.length === 0){
    return ``
  }
  return `
  var vars = ${JSON.stringify(vars)};
  for(variable of vars){
    try{
      if(variable.scopeName === undefined){
        if(JSON.stringify(eval(variable.name)) != JSON.stringify(variable.val)){
          failedTests.push("Unable to find or match variable " + variable.name + " of type " + variable.type);
        }
      }else{
        if(searchFramesForVariable(variable.name, variable.val, variable.type, currentFrame, variable.scopeName) === false){
          failedTests.push("Unable to find or match variable " + variable.name + " of type " + variable.type);
        };
      }
    }catch{
      failedTests.push("Unable to find or match variable " + variable.name + " of type " + variable.type);
    }
  }
  `
}
   
  
function makeFunctionTester(functs){
  if(functs.length === 0){
    return ``;
  }else{
    var newArray = new Array();
    for(funct of functs){
      var name = funct.name;
      for(test of funct.tests){
        var fnCall = name + "(" + test.input +")";
        newArray.push(`
        try{
          var x = ${fnCall};
          if(x !== ${test.output}){
            failedTests.push(${JSON.stringify(fnCall)});
            console.log("in function : ${name}, your output: ", x, "expected output: ${test.output}");
            return;
          }
        }catch{
          failedTests.push(${JSON.stringify(fnCall)});
          console.log("error : function ${name} not found");
          return;
        }
        `);
      }
    }
    return newArray.join("\n");
  }
}