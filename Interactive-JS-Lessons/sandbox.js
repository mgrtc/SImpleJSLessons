var editor;
window.onload = function (){
  const data = {"testQuestionSet":[
    {"text":`run the jewels`,
      "logs":[],"vars":[],"functs":[]
    }]
    ,"currentQuestion":0}  
  var newTest = new Test(data);
  init(newTest);
}

function init(newTest){
    editor = CodeMirror(document.querySelector('#code-editor'), {
        lineNumbers: true,
        firstLineNumber: 0,
        tabSize: 2,
        value: function(){
          document.getElementById("code-editor").addEventListener("keyup", function(){
            localStorage.setItem("textArea", editor.getValue());
          });
          if(localStorage.getItem("textArea")){
            return localStorage.getItem("textArea");
          }else{
            localStorage.setItem("textArea", `//your code here`);
            return localStorage.getItem("textArea");
          }
        }(),
        mode: {name: 'javascript'},
        theme: 'monokai'
      });
    displayTests(newTest);
    addRunButtonEventListener(document.getElementById("run"), newTest);
}

function addRunButtonEventListener(element, newTest){
  element.addEventListener("click", function(){
    runCurrentTest(newTest);
  });
}
var logToPage  = function(){
  if(window.testing !== true){
    var args = [...arguments];
    $("#console").append($(`<br>`));
    for(arg of args){
        $("#console").append($(`<console>${arg} </console>`));
    }
  }
};
async function runCurrentTest(newTest){
    //******************
    //hijack console.log
    //******************
    if((typeof(newTest.returnCurrentQuestion()) === "undefined")){
      return;
    }
  
    window.logToPage = function(){
        var args = [...arguments];
        $("#console").append($(`<br>`));
        for(arg of args){
            $("#console").append($(`<span>${arg} </span>`));
        }
    };

    storedLogs = [];
    window.storeLogs = function(){
      storedLogs.push([...arguments].join(' '));
    }

    //**************
    //run user input
    //**************
    window.anonFunctionNumber = 0; // this is used to make sure anonymous functions are uniquely identified
    window.failedTests = []; //very interesting
    var injection = generateInjection(newTest);
    console.log(injection.join("\n"));
    let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    await AsyncFunction(injection.join("\n"))(); //we should look into this option, though I wasn't able to access internal variables and functions https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function
}

function generateInjection(newTest){
  var newArray = new Array();
  newArray.push("(async function(){");
  //here, you inject any lines of code you want
  newArray.push(`
  var functionDeclared = new Map();
  var currentFrame = new Frame();
  window.defaultFrame = currentFrame.returnDefaultFrame();
  `);

  //begin parsing of code in code editor;
  var newInjectedCode = breakIntoComponents(editor.getValue()).join("\n");
  newArray.push(newInjectedCode);

  //push other tests here.
  newArray.push("(()=>{");
  newArray.push(initializeTests());
  newArray.push(makeConsoleTester(newTest.returnCurrentQuestion().logs));
  newArray.push(makeVariableTester(newTest.returnCurrentQuestion().vars));
  newArray.push(makeFunctionTester(newTest.returnCurrentQuestion().functs));
  newArray.push(finishTests());
  newArray.push("})()");
  newArray.push(`console.log(window.defaultFrame);`);

  newArray.push("})()");
  return newArray;
}

