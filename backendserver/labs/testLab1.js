class Test {
    testQuestionSet;
    currentQuestion;
    constructor() {
        this.testQuestionSet = new Array();
        this.currentQuestion = 0;
    }
    //add question setters and getters
    addQuestion(newQuestion) {
        this.testQuestionSet.push(newQuestion);
    }
    nextQuestion() {
        if (this.currentQuestion >= this.testQuestionSet.length - 1) {
            return;
        }
        this.currentQuestion++;
    }
    returnCurrentQuestion() {
        return this.testQuestionSet[this.currentQuestion];
    }
    returnQuestionSet() {
        return this.testQuestionSet;
    }
}
class Question {
    text; //Question - a string
    logs;//array of console.logs to be detected 
    vars; //variables to be detected
    functs; //functions to be made, along with tests.
    //we got three types of questions so far, asking for console.logs; asking to create variables with specific values, function name and expected inputs/outputs
    constructor(text) {
        this.text = text;
        this.logs = [];
        this.vars = [];
        this.functs = [];
    }
    returnText() {
        return this.text;
    }
    returnConsoleTests() {
        return this.logs;
    }
    returnVariableTests() {
        return this.vars;
    }
    returnFunctionTests() {
        return this.functs;
    }
    addConsoleRequirements(testCase) { //could be a number or string. 
        this.logs.push(testCase);
    }
    addVariableRequirements(newVariableTest) {
        this.vars.push({ name: newVariableTest.name, val: newVariableTest.val });
    }
    addFunctionRequirements(newFunctionTest) { //string, array[{input = "", output = ""}, ..]
        this.functs.push({ name: newFunctionTest.name, tests: newFunctionTest.tests });
    }

}
class variableTest {
    type; //eg var, let, or... am i missing anything? *currently not used.
    name; //name
    val; //value. strings allowed
    constructor(name, value) {
        this.name = name;
        this.val = value;
    }
}
class functionTest {
    name; //function name without the parenthesis
    tests; //
    constructor(name) {
        this.name = name;
        this.tests = new Array();
    }
    addTest(testInput, expectedOutput) { //testInput = "<string>" ie: "3", 
        this.tests.push({ input: testInput, output: expectedOutput });
    }
}

function populateATesterTest() {
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

function testLab() {
    return populateATesterTest();
}

module.exports = testLab;