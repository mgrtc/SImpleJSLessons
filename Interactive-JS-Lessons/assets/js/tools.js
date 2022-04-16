function injectHelpers(array, start){
    var newArray = new Array();
    var newStack = new Stack();
    if(typeof(start) === "undefined"){
        start = 0;
    }
    for(i = start; i < array.length; i++){ //this is bound to cause bugs later on.
        if(array[i].match(/(^function)+([ ]+)/)){ 
            newStack.push("function");
            var functionName = array[i].split(/(^function)+([ ]+)/);
            var functionName = removeEmptyIndices(functionName)[1].split(/([a-zA-Z0-9 ]+)+([(])/)[1];
            // console.log("functionName", functionName);
            newArray.push(`currentFrame.declaredFunctions.set("${functionName}", true);`);
            newArray.push(array[i]);
            i++;
            newArray.push(array[i]);
            newArray.push(`currentFrame = new Frame(currentFrame, "${functionName}");`);
            // newArray.push(`functionDeclared.set("${functionName}", currentFrame);`);
        }
        else if(array[i].match(/(^if)/) || array[i].match(/(^else)/)){ 
          newStack.push("ifelse");
          newArray.push(array[i]);
        }  
        else if(array[i].match(/(^var)+([ ]+)/)){
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
            newArray.push("currentFrame = currentFrame.returnParentFrame();")
            newArray.push(array[i]);
            i++;
            newArray.push(array[i]);
        }
        else if(array[i].match(/([}])/)){
          if(newStack.peek() === "function"){
            newArray.push("currentFrame = currentFrame.returnParentFrame();")
          }
            newArray.push(array[i]);
            newStack.pop();
        }
        else{
            newArray.push(array[i]);
        }
    }
    newArray = trimStringInArray(newArray);
    newArray = removeEmptyIndices(newArray);
    return newArray;
}
// this.questionTitle = data.questionTitle;
// this.text = data.questionText;
// this.example = data.example;
function displayTests(newTest){
  var lessonPage = document.getElementById("lessonPage");
  lessonPage.appendChild(function(){
    var newSection = document.createElement("section");
    newSection.innerHTML = "<h1>"+newTest.title+"</h1>";
    return newSection;
  }());
    for( var i in newTest.returnQuestionSet()){
      console.log(newTest.returnQuestionSet()[i]);
      var newQuestion = newTest.returnQuestionSet()[i];
      // console.log($("#test-display"));
      lessonPage.appendChild(function(){
        let number = Number(i) + 1; //why not just i+1????
        let data = {
          questionTitle : `${number}) `+newQuestion.title,
          questionText : newQuestion.text,
          example : newQuestion.example,
          ID: `test-num-${i}`,
          classList : []
        }
        return (new Section(data)).returnNewDomElement();
      }());
    }
}

  function makeConsoleTester(logs){ //please remake this
    if(logs.length === 0){
      return ``
    }
    return `
    var logs = ${JSON.stringify(logs)};
    for(log of logs){
    //   logDup("W-logs:", logs, "S-logs:", storedLogs,  "log:", log, "found:", storedLogs.indexOf(log.toString()) === -1 );
      if(storedLogs.indexOf(log) === -1 ){
        failedTests.push(log);
      }else{
        storedLogs.splice(storedLogs.indexOf(log), 1);
      }
    }
    `
  }
  
  function makeVariableTester(vars){ //and this
    logDup("vars", vars);
    if(vars.length === 0){
      return ``
    }
    return `
    var vars = ${JSON.stringify(vars)};
    for(variable of vars){
      try{
        if(JSON.stringify(eval(variable.name)) !== JSON.stringify(variable.val)){
          failedTests.push(variable);
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