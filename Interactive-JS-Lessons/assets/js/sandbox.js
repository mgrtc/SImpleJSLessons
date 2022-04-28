var newClock = new Clock();
var editor;
var newTest;
var labID = function(){
  try{
      var number = Number((window.location.href).split('?')[1].split('=')[1]);
  }catch(error){
      return 8576937444577709;
  }
  return number;
};
function fetchData(newLabID){
  var data = {labID: newLabID || labID()};
  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  fetch('http://137.184.237.82:3000/requestLab', options).then((response) => response.json()).then((data) => {
    //i still need to create the ssl certs for the server. so we will just use http for now. I mean its not like im sending anything too interesting
      if(data.error){
          console.log(data.error);
      }else{
          newTest = new Test(data);
          console.log(newTest);
          init(newTest);
      }
  });
}

// function(){
//   try{
//       var number = Number((window.location.href).split('?')[1].split('=')[1]);
//   }catch(error){
//       return 664981842751798;
//   }
//   return number;
// }()};

function init(newTest){
    editor = CodeMirror(document.querySelector('#codeEditor'), {
    lineNumbers: true,
    firstLineNumber: 0,
    tabSize: 2,
    value: function(){
        document.getElementById("codeEditor").addEventListener("keyup", function(){
            localStorage.setItem("textArea", editor.getValue());
        });
            if(localStorage.getItem("textArea")){
            return localStorage.getItem("textArea");
        }else{
            localStorage.setItem("textArea", `//your code here`);
            return localStorage.getItem("textArea");
        }
    }(),
        theme: "myCodeEditorTheme",
        continueComments: "Enter",
        mode: 'javascript',
        lineWrapping: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        extraKeys: {"Ctrl-Q": "toggleComment"},
    });
    displayTests(newTest);
    addRunButtonEventListener(document.getElementById("run"), newTest);
}

function addRunButtonEventListener(element, newTest){
  element.addEventListener("click", function(){
    runCurrentTest(newTest);
  });
}

function runCurrentTest(newTest){
  //******************
  //hijack console.log
  //******************
  if((typeof(newTest.returnCurrentQuestion()) === "undefined")){
    return;
  }

  window.logToPage  = function(){
      var args = [...arguments];
      // $("#ConsoleContainer").append($(`<br>`));
      for(arg of args){
          $("#ConsoleContainer").append($(`<console class="${newClock.getTick()}">> ${arg} </console>`));
      }
      var element = document.getElementById("ConsoleContainer");
      element.scrollTop = element.scrollHeight;
  };

  storedLogs = [];
  window.storeLogs = function(){
    storedLogs.push([...arguments].join(' '));
  }

  // console.log = function(){
  //     //hijack it here
  //     logDup(...arguments);
  //     storeLogs(...arguments);
  //     logToPage(...arguments);
  // }
  //**************
  //run user input
  //**************
  window.failedTests = []; //very interesting
  try{
    var injection = generateInjection(newTest);
  }catch(error){
    logToPage(error);
    return;
  }
  console.log("injection", injection.join("\n"));
  try{ //"just wrap it in a try catch"
    Function(injection.join("\n"))(); //we should look into this option, though I wasn't able to access internal variables and functions https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function
  }catch(error){
    logToPage(error);
    return;
  }
  //******************
  //analyze user input
  //******************

  //Very important, because eval treats the frame it was called in as its code's global frame from here we can access the user's global variables and functions
  //So any testing we'd want to do on a user's functions and variables will happen here

  //********************************
  // Clean up changes to console.log
  //********************************
  if(failedTests.length === 0){
    $(`#test-num-${newTest.currentQuestion}`).addClass("fadeOut");
    logToPage("you passed!");
    newTest.nextQuestion();  
  }else{
    logToPage("you failed!");
  }
  console.log("ft",failedTests);
}
function generateInjection(newTest){
  var newArray = new Array();
  //here, you inject any lines of code you want
  newArray.push(`
  var currentFrame = new Frame();
  var frameStack = new Stack();
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
  window.currentFrame = currentFrame;
  console.log(window.currentFrame);
  // logDup(typeof("currentFrame", currentFrame.variables.get("x").value));
  `);
  return newArray;
}