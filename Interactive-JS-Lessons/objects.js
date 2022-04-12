class Test{
  testQuestionSet;
  currentQuestion;
  constructor(data){
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
  text; //Question - a string
  logs;//array of console.logs to be detected 
  vars; //variables to be detected
  functs; //functions to be made, along with tests.
  //we got three types of questions so far, asking for console.logs; asking to create variables with specific values, function name and expected inputs/outputs
  constructor(data){
    this.text = data.text;
    this.logs = data.logs;
    this.vars = data.vars;
    this.functs = data.functs;
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
    this.vars.push({name: newVariableTest.name, val: newVariableTest.val});
  }
  addFunctionRequirements(newFunctionTest){ //string, array[{input = "", output = ""}, ..]
    this.functs.push({name: newFunctionTest.name, tests : newFunctionTest.tests});
  }
  
}
class variableTest{
  type; //eg var, let, or... am i missing anything? *currently not used.
  name; //name
  val; //value. strings allowed
  constructor(name, value){
    this.name = name;
    this.val = value;
  }
}
class functionTest{
  name; //function name without the parenthesis
  tests; //
  constructor(name){
    this.name = name;
    this.tests = new Array();
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
class Frame {
  name; //ie convertFtoC or "default"
  declaredFunctions;
  variables;
  previousFrame;
  childrenFrame;
  blockFrames;
  constructor(currentFrame, newName){
    this.variables = new Map();
    this.childrenFrame = new Array();
    this.declaredFunctions = new Map();
    if(typeof(newName) === "undefined"){
      this.name = "default";
    }else{
      this.name = newName;
      currentFrame = returnFrameContainingFunctionDEF(currentFrame, newName);
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
    return this.previousFrame;
  }
  addVariable(type, name, value){
    this.variables.set(name, new Variable(type, name, value));
  }
  updateVariable(name, value){
    var newFrame = returnFrameContainingVariable(this, name);
    //logdup(newFrame.name + " contains " + name);
    if(newFrame.variables.has(name)){
      var newVariable = newFrame.variables.get(name);
      newVariable.value = value;
      newFrame.variables.set(name, newVariable)
    }else{
      newFrame.addVariable("defualt", name, value);
    }
  }
  findVariable(variableName, scope){
    if(this.name !== "default"){
      return "error: ";
    }else{

    }
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