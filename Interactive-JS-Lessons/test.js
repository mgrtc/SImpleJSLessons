var currentFrame = new Frame();
var frameStack = new Stack();

var a = 0;
currentFrame.addVariable("var", "a", a);
var b = 0;
currentFrame.addVariable("var", "b", b);
var c = 0;
currentFrame.addVariable("var", "c", c);
{
    let tempFrame = currentFrame.returnPreviousFunctionScope();
    tempFrame.declaredFunctions.set("definesFunction", currentFrame);
}
function definesFunction() {
    frameStack.push(currentFrame);
    currentFrame = new Frame(currentFrame, "definesFunction", "scoped");
    var a = 1;
    currentFrame.addVariable("var", "a", a);
    var b = 1;
    currentFrame.addVariable("var", "b", b);
    {
        let tempFrame = currentFrame.returnPreviousFunctionScope();
        tempFrame.declaredFunctions.set("example", currentFrame);
    }
    function example() {
        frameStack.push(currentFrame);
        currentFrame = new Frame(currentFrame, "example", "scoped");
        var a = 2;
        currentFrame.addVariable("var", "a", a);
        {
            let logString = ["(a", "b", "c);"].map(log => JSON.stringify(eval(log))).join(" ").replace(/["|']/g, '');
            logToPage(logString);
            storeLogs(logString);
            currentFrame.addConsoleLogs(logString)
        }
        currentFrame = frameStack.pop();
    }
    currentFrame = frameStack.pop() || currentFrame.returnPreviousFunctionScope();
    return example;
    currentFrame = frameStack.pop();
}
example = definesFunction();
currentFrame.updateVariable("example", example);
example();
(() => {


    var vars = [{ "name": "x", "val": 6, "scopeName": "abc" }];
    for (variable of vars) {
        try {
            if (variable.scopeName === undefined) {
                if (JSON.stringify(eval(variable.name)) !== JSON.stringify(variable.val)) {
                    failedTests.push(variable);
                }
            } else {
                if (searchFramesForVariable(variable.name, variable.val, currentFrame, variable.scopeName) === false) {
                    failedTests.push(variable);
                    logToPage("Unable to find or match variable " + variable.name);
                };
            }
        } catch {
            failedTests.push(variable);
        }
    }


})()

currentFrame = currentFrame.returnDefaultFrame();
window.currentFrame = currentFrame;
console.log(window.currentFrame);
  // logDup(typeof("currentFrame", currentFrame.variables.get("x").value));