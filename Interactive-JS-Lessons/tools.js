function injectHelpers(array, start){
    var newArray = new Array();
    var newStack = new Stack();
    if(typeof(start) === "undefined"){
        start = 0;
    }
    console.log(array);
    for(i = start; i < array.length; i++){ //this is bound to cause bugs later on.
        if(array[i].match(/(^function)+([ ]+)/)){  //function decelerations
            console.log("hi", array[i]);
            newStack.push("function");
            var functionName = array[i].split(/(^function)+([ ]+)/);
            var functionName = removeEmptyIndices(functionName)[1].split(/([a-zA-Z0-9 ]+)+([(])/)[1];
            // var args = removeEmptyIndices(functionName)[1].match(/(?<=\()(.+)(?=\))/); //this gets the names of all the arguments being passed into a function
            // if(args !== null){
            //   args = args[0].split(",");
            // }
            newArray.push(`currentFrame.declaredFunctions.set("${functionName}", true);`);
            newArray.push("async "+array[i]);
            i++;
            newArray.push(array[i]);
            newArray.push(`var parentFrame = currentFrame;`)
            newArray.push(`{`);
            newArray.push(`let currentFrame = new Frame(parentFrame, "${functionName}");`);
        }
        else if(array[i].match(/(^if)/) || array[i].match(/(^else)/)){ //ifelse's
          newStack.push("ifelse");
          newArray.push(array[i]);
        }  
        else if(array[i].match(/(=)+(\s*)\bfunction/)){ //anonymous function decelerations
          // newArray.push(array[i]);
          newStack.push("function");
          var deceleration = array[i].split(/[=]/)[0].split(/\s/);
          var arguments = array[i].split(/[=]/)[1].split(/\(/)[1].split(/\)/)[0];
          // console.log(deceleration, arguments);
          if(deceleration.length === 3){
            //This is a tagged variable deceleration with initial value of a function;
            //It may be let, const, or var
            var tag = deceleration[0];
            var variableName = deceleration[1];
          }
          else if(deceleration.length === 2){
            //This is an untagged variable being assigned a function
            var tag = "";
            var variableName = deceleration[0];
          } else {
            //This should never happen if people are writing valid code, but if it did, our code would error and I'd rather have a useful error
            throw `you did something bad with a variable being set equal to a function near line ${i}`;
          }
          var functionName = `anon_${variableName}_${window.anonFunctionNumber}`
          window.anonFunctionNumber += 1;
          
          newArray.push(`${tag} ${variableName} = ${functionName}`);
          if(tag === ""){
            newArray.push(`currentFrame.updateVariable("${variableName}", ${variableName});`);
          }else{
            newArray.push(`currentFrame.addVariable("${tag}", "${variableName}", ${variableName});`);
          }
          newArray.push(`currentFrame.declaredFunctions.set("${functionName}", true);`);
          newArray.push(`async function ${functionName}(${arguments})`);
          i++;
          newArray.push(array[i]);
          newArray.push(`var parentFrame = currentFrame;`)
          newArray.push(`{`);
          newArray.push(`let currentFrame = new Frame(parentFrame, "${functionName}");`);
        }
        else if(array[i].match(/(^var)+([ ]+)/)){ //variable decelerations
            newArray.push(array[i]);
            var variableName = array[i].split(/^var/)[1].trim().split(/[=]/)[0].trim().split(/[;]/)[0];
            newArray.push(`currentFrame.addVariable("var", "${variableName}", ${variableName});`);
        }
        else if(array[i].match(/(^let)+([ ]+)/)){ 
            newArray.push(array[i]);

            var variableName = array[i].split(/^let/)[1].trim().split(/[=]/)[0].trim().split(/[;]/)[0];
            newArray.push(`currentFrame.addVariable("let", "${variableName}", ${variableName});`);
        }
        else if(detectStatementVariableReassignment(array[i])){
            newArray.push(array[i]);
            var variableName = array[i].split(/=/)[0].trim();
            newArray.push(`currentFrame.updateVariable("${variableName}", ${variableName});`);
        }
        else if(array[i].match(/(^return)/)){
            newArray.push(array[i]);
            i++;
            newArray.push(array[i]);
        }
        else if(array[i].match(/([}])/)){
          if(newStack.peek() === "function"){
            newArray.push(`}`)
          }
            newArray.push(array[i]);
            newStack.pop();
        }
        else if(array[i].match(/(^console.log)/)){ 
          var logString = array[i].match(/(?<=\()(.+)(?=\))/)[0];
          var logArray = JSON.stringify(logString.split(","));
          newArray.push(`{
            let logString = ${logArray}.map(log=>JSON.stringify(eval(log))).join(" ");
            logToPage(logString);
            storeLogs(logString);
            console.log(logString);
          }`)
        }  
        else{
            newArray.push(array[i]);
        }
    }
    newArray = trimStringInArray(newArray);
    newArray = removeEmptyIndices(newArray);
    return newArray;
}
function displayTests(newTest){
    for( i in newTest.returnQuestionSet()){
      $("#test-display").append($(`
        <div class="frame" id="test-num-${i}">
          ${newTest.returnQuestionSet()[i].returnText()}
        </div>
      `))
    }
}

function initializeTests(){
  return `window.testing = true;`
}

function finishTests(){
  return `window.testing = false;`
}

function makeConsoleTester(logs){ //please remake this
  if(logs.length === 0){
    return ``
  }
  return `
  var logs = ${JSON.stringify(logs)};
  for(log of logs){
    if(storedLogs.indexOf(log) === -1 ){
      failedTests.push(log);
    }else{
      storedLogs.splice(storedLogs.indexOf(log), 1);
    }
  }
  `
}
  
function searchFramesForVariable(variableName, value, startingFrame, frameName){
  if(
    startingFrame.findVariable(variableName) && //we need to check if the variable exists (otherwise the next check will error)
    startingFrame.findVariable(variableName).value === value && //if it does exist we need to check that the values matches
    frameName === startingFrame.name)  // and we need to check if the frameNames match
  {
    return true;
  }
  for(child of startingFrame.childrenFrame){ //If we didn't find it in this frame, check all its children recursively
    if(searchFramesForVariable(variableName, value, child, frameName)){
      return true;
    }
  }
  return false;
}

function makeVariableTester(vars){
  if(vars.length === 0){
    return ``
  }
  return `
  var vars = ${JSON.stringify(vars)};
  for(variable of vars){
    try{
      if(variable.func === undefined){
        if(JSON.stringify(eval(variable.name)) !== JSON.stringify(variable.val)){
          failedTests.push(variable);
        }
      }else{
        if(searchFramesForVariable(variable.name, variable.val, currentFrame, variable.func) === false){
          failedTests.push(variable);
        };
      }
    }catch{
      failedTests.push(variable);
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