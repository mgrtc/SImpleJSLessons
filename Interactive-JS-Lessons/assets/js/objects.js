class Test{
  title;
  testQuestionSet;
  currentQuestion;
  constructor(data){
    this.title = data.title;
    this.testQuestionSet = new Array();
    this.currentQuestion = 0;
    if(data){
      for(var i = 0; i < data.testQuestionSet.length; i++){
        var newQuestion = new Question(data.testQuestionSet[i]);
        this.addQuestion(newQuestion);
      }
    }
  }
  //add question setters and getters
  addQuestion(newQuestion){
    this.testQuestionSet.push(newQuestion);
  }
  nextQuestion(){
    if(this.currentQuestion >= this.testQuestionSet.length-1){
      return;
    }
    this.currentQuestion++;
  }
  returnCurrentQuestion(){
    return this.testQuestionSet[this.currentQuestion];
  }
  returnQuestionSet(){
    return this.testQuestionSet;
  }
}
class Question{
  title;
  text; //Question - a string
  example;
  logs;//array of console.logs to be detected 
  vars; //variables to be detected
  functs; //functions to be made, along with tests.
  //we got three types of questions so far, asking for console.logs; asking to create variables with specific values, function name and expected inputs/outputs

  constructor(data){
    this.text = data.text;
    this.logs = data.logs;
    this.vars = data.vars;
    this.functs = data.functs;
    this.title = data.title;
    this.example = data.example;
  }
  returnText(){
    return this.text;
  }
  returnConsoleTests(){
    return this.logs;
  }
  returnVariableTests(){
    return this.vars;
  }
  returnFunctionTests(){
    return this.functs;
  }
  addConsoleRequirements(testCase){ //could be a number or string. 
    this.logs.push(testCase);
  }
  addVariableRequirements(newVariableTest){
    this.vars.push({name: newVariableTest.name, val: newVariableTest.val, path: newVariableTest.scopeName});
  }
  addFunctionRequirements(newFunctionTest){ //string, array[{input = "", output = ""}, ..]
    this.functs.push({name: newFunctionTest.name, tests : newFunctionTest.tests});
  }
  
}
class variableTest{
  type; //eg var, let, or... am i missing anything? *currently not used.
  name; //name
  val; //value. strings allowed
  scopeName;
  constructor(name, value, scopeName){
    this.name = name;
    this.val = value;
    this.scopeName = scopeName;
  }
}
class functionTest{
  name; //function name without the parenthesis
  tests; //
  functionDefinition;
  constructor(name){
    this.name = name;
    this.tests = new Array();
    this.functionDefinition = "";
  }
  addTest(testInput, expectedOutput){ //testInput = "<string>" ie: "3", 
    this.tests.push({input: testInput, output : expectedOutput});
  }
}

//frame objects
function returnFrameContainingVariable(newFrame, variableName){
  while (!newFrame.variables.has(variableName) && typeof (newFrame.previousFrame) !== "undefined") {
    newFrame = newFrame.previousFrame;
  }
  return newFrame;
}
function returnFrameContainingFunctionDEF(newFrame, functionName){
  while (!newFrame.declaredFunctions.has(functionName) && typeof (newFrame.previousFrame) !== "undefined") {
    newFrame = newFrame.previousFrame;
  }
  return newFrame;
}
class Frame { //SHOULD PROBABLY ABSTRACT
  name; //ie convertFtoC or "default", "if", "else", "while", "for" etc....
  type; //blocked or function scoped? "blocked" "scoped"
  declaredFunctions; //blocks share the same pool of functions in its parent scope, and any functions declared within them gets hoisted to the next function or global scope => 2
  variables;
  consoleLogs;
  previousFrame;
  childrenFrame; //2 => however, a function that gets called gets attacted to the block or function it was declared inside. so that means a block frame can a function scoped children frame
  blockFrames;
  counter;
  constructor(currentFrame, newName, type){
    this.variables = new Map();
    this.childrenFrame = new Array();
    this.blockFrames = new Array();
    this.declaredFunctions = new Map(); //{functionName, [reference to declaration]}
    this.consoleLogs = new Array(); //(expression), results
    if(typeof(currentFrame) === "undefined"){
      this.name = "default";
      this.type = "scoped";
    }else if(type === "blocked"){
      this.name = newName;
      this.type = type;
      this.previousFrame = currentFrame;
      currentFrame.blockFrames.push(this);
    }
    else{
      this.name = newName;
      this.type = type;
      currentFrame = returnFrameContainingFunctionDEF(currentFrame, newName);
      // console.log("currentframe", currentFrame.declaredFunctions.get(newName));
      currentFrame = currentFrame.declaredFunctions.get(newName);
      currentFrame.childrenFrame.push(this);
      this.previousFrame = currentFrame;
    }
  }
  returnDefaultFrame(){
    var newFrame = this;
    while(typeof(newFrame.previousFrame) !== "undefined"){
      newFrame = newFrame.previousFrame;
    }
    return newFrame;
  }
  returnParentFrame(){
    if(typeof(this.previousFrame) === "undefined"){
      return this;
    }
    if(this.type === "blocked"){
      var newFrame = this;
      while(newFrame.type === "blocked"){
        newFrame = newFrame.previousFrame;
        if(newFrame.name === "default"){
          return newFrame;
        }
      }
      return newFrame.previousFrame;
    }
    return this.previousFrame;
  }
  returnPreviousFunctionScope(){
    let newFrame = this;
    while(newFrame.type === "blocked" && typeof(newFrame.previousFrame) !== "undefined"){
      newFrame = newFrame.previousFrame;
    }
    return newFrame;
  }
  addVariable(type, name, value){
    if(type === "var"){
      var newFrame = this;
      while(newFrame.type === "blocked"){
        newFrame = newFrame.previousFrame;
      }
      newFrame.variables.set(name, new Variable(type, name, value));
    }else if(type === "const" || type === "let" || type === "default"){
      this.variables.set(name, new Variable(type, name, value));
    }
  }
  addConsoleLogs(results){
    this.consoleLogs.push(results)
  }
  updateVariable(name, value){
    var newFrame = returnFrameContainingVariable(this, name);
    //logdup(newFrame.name + " contains " + name);
    if(newFrame.variables.has(name)){
      var newVariable = newFrame.variables.get(name);
      newVariable.value = value;
      newFrame.variables.set(name, newVariable)
    }else{
      newFrame.addVariable("default", name, value);
    }
  }
  findVariable(variableName, scope){
    return this.variables.get(variableName);
  }

}

class Variable{
  type; //lets, or vars
  name; //variable name
  value; //value
  constructor(type, name, value){
    this.type = type;
    this.name = name;
    this.value = value;
  }
}
//general
class Stack {
  top;
  newStack;
  constructor(){
    this.newStack = [];
    this.top = -1;
  }
  push(data){
    this.top++;
    this.newStack[this.top] = data;
  }
  pop(){
    var newData = this.newStack[this.top];
    this.top--;
    return newData;
  }
  peek(){
    return this.newStack[this.top];
  }
  size(){
    return this.top;
  }
}
//others
class Clock{
  tick;
  constructor(){
      this.tick = "tock";
  }
  getTick(){
      switch(this.tick){
          case "tick" : this.tick = "tock"; break;
          case "tock" : this.tick = "tick"; break;
      }
      return this.tick;
  }
}
class Section{
  questionTitle;
  text;
  example;
  classList;
  id;
  constructor(data){
      this.questionTitle = data.questionTitle;
      this.text = data.questionText;
      this.example = data.example;
      this.classList = data.classList;
      this.id = data.ID;
  }
  returnNewDomElement(){
      var newSection = document.createElement("section");
      newSection.id = this.id;
      for(var i = 0; i < this.classList.length; i++){
          newSection.classList.add(this.classList[i]);
      }
      var newQuestTitle = document.createElement("QuestionTitle");
      var newText = document.createElement("text");
      var newExampleDiv = document.createElement("div");
      newExampleDiv.classList.add("example");

      newQuestTitle.innerHTML = "<h2>"+this.questionTitle+"</h2>";
      newText.innerHTML = "<p>"+this.text+"</p>";
      newExampleDiv.innerHTML = "<p>"+this.example+"</p>";

      newSection.appendChild(newQuestTitle);
      newSection.appendChild(newText);
      newSection.appendChild(newExampleDiv);

      return newSection;
  }
}