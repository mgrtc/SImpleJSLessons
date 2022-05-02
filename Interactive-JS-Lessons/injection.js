var currentFrame = new Frame();
var frameStack = new Stack();

{
    let tempFrame = currentFrame.returnPreviousFunctionScope();
    tempFrame.declaredFunctions.set("abc", currentFrame);
    visualizeLineNumbers(284944422684659);
}
function abc() {

    frameStack.push(currentFrame);
    currentFrame = new Frame(currentFrame, "abc", "scoped");
    visualizeLineNumbers(284944422684659);
    //lineNumber=284944422684659
    visualizeLineNumbers(2959730828496935);
    var y = "defalt"//lineNumber=2959730828496935
    currentFrame.addVariable("var", "y", y);
    let f17530642183529 = false
    for (let x = 0; x < 20; x = x + 1) {
        //lineNumber=17530642183529
        visualizeLineNumbers(17530642183529);
        if (f17530642183529 === false) { currentFrame = new Frame(currentFrame, "forLoopBlock", "blocked"); } f17530642183529 = true
        visualizeLineNumbers(3471581334047806);
        if (x == 2) {
            currentFrame = new Frame(currentFrame, "ifBlock", "blocked");
            visualizeLineNumbers(undefined);
            //lineNumber=3471581334047806
            visualizeLineNumbers(5955655770824053);
            y = "dsfsdfds"//lineNumber=5955655770824053
            currentFrame.updateVariable("y", y);
            currentFrame = currentFrame.previousFrame;
        }
        else {
            currentFrame = new Frame(currentFrame, "elseBlock", "blocked");
            visualizeLineNumbers(5170968437725707);
            //lineNumber=5170968437725707
            visualizeLineNumbers(7639816166786559);
            if (x === 3) {
                currentFrame = new Frame(currentFrame, "ifBlock", "blocked");
                visualizeLineNumbers(undefined);
                //lineNumber=7639816166786559
                visualizeLineNumbers(4816717322142374);
                y = "dsf"//lineNumber=4816717322142374
                currentFrame.updateVariable("y", y);
                currentFrame = currentFrame.previousFrame;
            }
            else {
                currentFrame = new Frame(currentFrame, "elseBlock", "blocked");
                visualizeLineNumbers(7218440238088251);
                //lineNumber=7218440238088251
                visualizeLineNumbers(8831986502709373);
                y = x * 34//lineNumber=8831986502709373
                currentFrame.updateVariable("y", y);
                currentFrame = currentFrame.previousFrame;
            }
            //lineNumber=8110358504752824
            currentFrame = currentFrame.previousFrame;
        }
        //lineNumber=6099558322541803
        {
            let logString = ["y"].map(log => JSON.stringify(eval(log))).join(" ").replace(/["|']/g, '');
            // logToPage(logString);
            storeLogs(logString);
            currentFrame.addConsoleLogs(logString)
            visualizeLineNumbers(6116216292926847, logString);
        }
        visualizeLineNumbers(6116216292926847);
        visualizeLineNumbers(8695899439354436);
    }
    f17530642183529 = undefined; currentFrame = currentFrame.previousFrame;
    //lineNumber=8695899439354436
    visualizeLineNumbers(7198626837743208);
    currentFrame = frameStack.pop();
}
//lineNumber=7198626837743208
//lineNumber=6000320932036874
visualizeLineNumbers(7226687595629664);
abc()//lineNumber=7226687595629664
currentFrame = currentFrame.returnDefaultFrame();
(() => {

    var logs = [{ "val": "Hello World", "scopeName": "default" }];
    for (log of logs) {
        if (!searchFramesForConsoleLogging(log.val, log.scopeName, currentFrame)) {
            failedTests.push("Expected scope : " + log.scopeName);
            failedTests.push("Failed to detect console.log output: " + log.val);
        }
    }


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
