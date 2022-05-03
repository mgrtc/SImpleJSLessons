var currentFrame = new Frame();
var frameStack = new Stack();

{
    currentFrame = new Frame(currentFrame, "genericBlock", "blocked");
    {
        let tempFrame = currentFrame.returnPreviousFunctionScope();
        tempFrame.declaredFunctions.set("MultiplyTwoNumbers", currentFrame);
    }
    function MultiplyTwoNumbers() {

        frameStack.push(currentFrame);
        currentFrame = new Frame(currentFrame, "MultiplyTwoNumbers", "scoped");
        var num1 = 6;
        currentFrame.addVariable("var", "num1", num1);
        {
            let logString = ["\"num1 is : \"", " num1"].map(log => JSON.stringify(eval(log))).join(" ").replace(/["|']/g, '');
            if (enableLineAnimations === false) { logToPage(logString); };
            storeLogs(logString);
            currentFrame.addConsoleLogs(logString)
            if (enableLineAnimations === true) {
                visualizeLineNumbers(undefined, logString);
            }
        }
        var num2 = 6;
        currentFrame.addVariable("var", "num2", num2);
        {
            let logString = ["\"num2 is : \"", " num2"].map(log => JSON.stringify(eval(log))).join(" ").replace(/["|']/g, '');
            if (enableLineAnimations === false) { logToPage(logString); };
            storeLogs(logString);
            currentFrame.addConsoleLogs(logString)
            if (enableLineAnimations === true) {
                visualizeLineNumbers(undefined, logString);
            }
        }
        var product = num1 * num2;
        currentFrame.addVariable("var", "product", product);
        currentFrame = frameStack.pop() || currentFrame.returnPreviousFunctionScope();
        return product;
        currentFrame = frameStack.pop();
    }
    currentFrame = currentFrame.previousFrame;
}
var product = MultiplyTwoNumbers();
currentFrame.addVariable("var", "product", product);
{
    let logString = ["product"].map(log => JSON.stringify(eval(log))).join(" ").replace(/["|']/g, '');
    if (enableLineAnimations === false) { logToPage(logString); };
    storeLogs(logString);
    currentFrame.addConsoleLogs(logString)
    if (enableLineAnimations === true) {
        visualizeLineNumbers(undefined, logString);
    }
}
currentFrame = currentFrame.returnDefaultFrame();
(() => {


    var vars = [{ "name": "myFirstVariableName", "type": "var", "scopeName": "default", "val": "Hello World" }];
    for (variable of vars) {
        try {
            if (variable.scopeName === undefined) {
                if (JSON.stringify(eval(variable.name)) != JSON.stringify(variable.val)) {
                    failedTests.push("Unable to find or match variable " + variable.name + " of type " + variable.type);
                }
            } else {
                if (searchFramesForVariable(variable.name, variable.val, variable.type, currentFrame, variable.scopeName) === false) {
                    failedTests.push("Unable to find or match variable " + variable.name + " of type " + variable.type);
                };
            }
        } catch {
            failedTests.push("Unable to find or match variable " + variable.name + " of type " + variable.type);
        }
    }


})()

window.currentFrame = currentFrame;
console.log(window.currentFrame);
// logDup(typeof("currentFrame", currentFrame.variables.get("x").value));