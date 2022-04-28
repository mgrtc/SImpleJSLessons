function highlight(newLine, oldLine){
    console.log(newLine, oldLine);
    if(newLine != null){
        $(".CodeMirror-linenumber").eq(newLine).css("background","green")
    }
    if(oldLine != null){
        var oldsColor = $(".CodeMirror-linenumber").eq(oldLine).css("background-color");
        if (oldsColor === "rgb(0, 128, 0)"){
            $(".CodeMirror-linenumber").eq(oldLine).css("background","#272822");
        }
    }
}

function highlighForCall(line){
    if(line != null){
        $(".CodeMirror-linenumber").eq(line).css("background","rgb(150, 255, 150)");
        $(".CodeMirror-linenumber").eq(line).css("color","black");
    }
}

function unhighlighForCall(line){
    if(line != null){
        $(".CodeMirror-linenumber").eq(line).css("background","#272822");
        $(".CodeMirror-linenumber").eq(line).css("color","");
    } 
}

function addTimeBreaks(inputString){
    inputArray = inputString.split(/\n/);
    outputArray =[];
    for(i in inputArray){
      outputArray.push(`await timeBreak(${i}, currentFrame.returnDefaultFrame());`)
      outputArray.push(inputArray[i]);
    }
    outputArray.push(`highlight(null, window.highlightedLineNum)`);
    return outputArray.join("\n");
}

window.highlightedLineNum = null;

async function timeBreak(lineNum,mainFrame){
    await new Promise((r) => setTimeout(r, 1000));
    //console.log(lineNum);
    highlight(lineNum, window.highlightedLineNum);
    window.highlightedLineNum = lineNum;
    makeVisualFrame(mainFrame);
}

function makeVisualFrame(frame){
    var visFrame = $(`<div class ='frame' id='${frame.name}'></div>`);
    visFrame.append($(`<p>name: ${frame.name}</p>`))
    frame.variables.forEach((variable)=>{
        var value = variable.value.toString().split("\n")[0];
        visFrame.append($(`<p'>${variable.type} ${variable.name}: ${value}</p>`))
    });
    frame.declaredFunctions.forEach((val, key)=>{
        visFrame.append($(`<p>func: ${key} </p>`))
    })
    frame.childrenFrame.forEach((childFrame)=>{
        visFrame.append(makeVisualFrame(childFrame));
    })
    $("#frames").empty();
    $("#frames").append(visFrame);
    //console.log(frame, visFrame);
    return visFrame;
}