var editor;
const stuff = {value: "hello world"};
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: JSON.stringify(stuff)
}
var testQuestions = fetch('http://127.0.0.1:3000/requestLab', options).then((response) => response.json()).then((data) => {
  var newTest = new Test(data);
  console.log(newTest);
  init(newTest);
});
window.onload = function (){
  var test = breakIntoComponents(localStorage.getItem("textArea"));
  console.log(test);
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

function populateATesterTest(){
  var newTest = new Test();

  var newQuestion = new Question("Correct function <b>convertFtoC</b> so that it correctly takes in a degrees in fahrenheit, returns in degrees celcius, then write a function <b>convertCtoF</b> to reverse the conversion");
  var newFunctionTest = new functionTest("convertFtoC");
    newFunctionTest.addTest("32", "0");
    newFunctionTest.addTest("82", "27.77777777777778");
  newQuestion.addFunctionRequirements(newFunctionTest);
  var newFunctionTest = new functionTest("convertCtoF");
    newFunctionTest.addTest("0", "32");
    newFunctionTest.addTest("27.77777777777778", "82");
  newQuestion.addFunctionRequirements(newFunctionTest);
  newTest.addQuestion(newQuestion);

  newQuestion = new Question("Write code that will console.log out 5 and 6 && Write code that will set x = 5, y = 6, and z = 9");
  newQuestion.addConsoleRequirements("5");
  newQuestion.addConsoleRequirements("6");

  var newVariableTest = new variableTest("x", 5);
  newQuestion.addVariableRequirements(newVariableTest);
  newVariableTest = new variableTest("y", 6);
  newQuestion.addVariableRequirements(newVariableTest);
  newVariableTest = new variableTest("z", 9);
  newQuestion.addVariableRequirements(newVariableTest);

  newTest.addQuestion(newQuestion);

  newQuestion = new Question("Write code that will set x = 5, y = 6, and z = 9");
  var newVariableTest = new variableTest("x", 5);
  newQuestion.addVariableRequirements(newVariableTest);
  newVariableTest = new variableTest("y", 6);
  newQuestion.addVariableRequirements(newVariableTest);
  newVariableTest = new variableTest("z", 9);
  newQuestion.addVariableRequirements(newVariableTest);
  newTest.addQuestion(newQuestion);

  return newTest;
}
function runCurrentTest(newTest){
    //******************
    //hijack console.log
    //******************
    if((typeof(newTest.returnCurrentQuestion()) === "undefined")){
      return;
    }
    window.logDup = console.log;           //hang on to an original console.log
    var logToPage  = function(){
        var args = [...arguments];
        $("#console").append($(`<br>`));
        for(arg of args){
            $("#console").append($(`<span>${arg} </span>`));
        }
    };

    storedLogs = [];
    var storeLogs = function(){
      logDup(storedLogs)
      storedLogs.push([...arguments].join(' '));
    }

    console.log = function(){
        //hijack it here
        logDup(...arguments);
        storeLogs(...arguments);
        logToPage(...arguments);
    }
    //**************
    //run user input
    //**************
    failedTests = []; //very interesting
    var injection = generateInjection(newTest);
    Function(injection.join("\n"))(); //we should look into this option, though I wasn't able to access internal variables and functions https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function

    //******************
    //analyze user input
    //******************
    
    //Very important, because eval treats the frame it was called in as its code's global frame from here we can access the user's global variables and functions
    //So any testing we'd want to do on a user's functions and variables will happen here

    //********************************
    // Clean up changes to console.log
    //********************************
    console.log = logDup;
    window.logDup = undefined;
    if(failedTests.length === 0){
      $(`#test-num-${newTest.currentQuestion}`).css("background-color", "green");
      newTest.nextQuestion();
    }
    console.log("ft",failedTests);
}
function generateInjection(newTest){
  var newArray = new Array();
  //here, you inject any lines of code you want
  newArray.push(`
  var functionDeclared = new Map();
  var currentFrame = new Frame();
  `);

  //begin parsing of code in code editor;
  var newInjectedCode = breakIntoComponents(editor.getValue()).join("\n");
  newArray.push(newInjectedCode);

  //push other tests here.
  newArray.push("(()=>{");
  newArray.push(makeConsoleTester(newTest.returnCurrentQuestion().logs));
  newArray.push(makeVariableTester(newTest.returnCurrentQuestion().vars));
  newArray.push(makeFunctionTester(newTest.returnCurrentQuestion().functs));
  newArray.push("})()");

  newArray.push(`
  currentFrame = currentFrame.returnDefaultFrame();
  logDup("currentFrame", currentFrame);
  `);
  return newArray;
}

