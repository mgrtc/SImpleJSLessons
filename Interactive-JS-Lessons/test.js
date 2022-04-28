var newTest = {
    title: "",
    text : "",
      currentQuestion: 0,
      testQuestionSet: [
      {
            title: "",
            text: ``,
            example: ``,
            startingCode: ``,
            functs: [],
            logs: [],
            vars: []
        }

      ],
};

var newTest = {
    title: "Javascript Scoping Rules",
    text : "A lesson on Javascript's scoping rules. Below is a set of 14 questions designed to help you understand scoping in Javascript. In case you're unfamiliar with the term scoping, it's the set of rules that governs variables and functions inheritence given the context of where you are in your program",
      currentQuestion: 0,
      testQuestionSet: [
        {
            title: "Move the console.log inside the {}'s so that it no longer errors",
            text: "Fix up the code in the code editor so you no longer get an error message. While we can't reference variables that are in a block we are not in, we can reference variables in blocks that are wrapping the block we are in.",
            example: `{
    let a = 0;
    console.log(a);
}`,
            startingCode: `{
    let a = 0;
    //[console.log(a);]
}
console.log(a); //[]`,
            functs: [],
            logs: ["0"],
            vars: []
        },
        {
            title: "Add a console.log(a,b) somewhere it'll be able to successfully reference both a and b.",
            text: `In other words, while only adding a console.log(a,b) somewhere get this code to console.log(0,1);`,
            example: `Code: 
{ // wrapping block
    let a = 0;
    { // inner block
        const b = 1;
        //[console.log(a,b)]
    }
}`,
            startingCode: `{ // wrapping block
    let a = 0;
    { // inner block
        const b = 1;
        //[console.log(a,b)]
    }
}`,
            functs: [],
            logs: ["0 1"],
            vars: []
        },
        {
            title: "without touching the console.log change this code so that the console.log(a,b,c) logs out 0, 0, 0.",
            text: `when referencing a variable the variable that is referenced is the closest one out from where the reference happens`,
            example: `Here the console.log(a,b,c) will console.log out 2, 1, 0 because when it goes looking for a, b, and c it'll first find
the a in the inner block, then it'll look in the middle block and find b, and then it'll look in the outer block and find c.
{ // outer block 
    let a = 0; 
    const b = 0;  
    let c = 0;  
    { // middle block 
        const a = 1;
        let b = 1; 
        { // inner block
            let a = 2;
            console.log(a,b,c);
        }
    }
}`,
            startingCode: `{ // outer block
    let a = 0;
    const b = 0;
    let c = 0;
    { // middle block
        const a = 1;                  //[]
        let b = 1;     //[let b = 0;] //[]
        { // inner block
            let a = 2; //[let a = 0;] //[]
            console.log(a,b,c);
        }
    }
}`,
            functs: [],
            logs: ["0 0 0"],
            vars: []
        },
        {
            title: "Add a console.log(a) inside of every block where it'll log out a 1",
            text: ``,
            example: `{
    let a = 0;
    {
        const a = 1;
        //[console.log(a)]
        {
            let a = 2;
        }
        {
            //[console.log(a)]
        }
    }
}`,
            startingCode: `{
    let a = 0;
    {
        const a = 1;
        //[console.log(a)]
        {
            let a = 2;
        }
        {
            //[console.log(a)]
        }
    }
}`,
            functs: [],
            logs: ["1", "1"],
            vars: []
        },
        {
            title: "Code Blocks",
            text: `In the last section we explained the innermost block rule for reference.
When you reference a variable with (for example) a console.log(a), 
JavaScript will first look in the local code block the console.log(a) is inside,
then it will look in the code block that wraps that code block, and then the code block
that wraps that one.`,
            example: `The same rule applies to untagged assignment, start in the local block, go outward, and stop as soon as you find one.`,
            startingCode: `{//wrapper for wrapper for wrapper for local
    let a = 0; //the console.log never get's here
    {// wrapper for wrapper for local
        //looks here third
        let a = 1; //found it!
        {// wrapper for local
            //looks here second
            {// local code block
                //looks here first
                console.log(a); // will log out 1
            }
        }
    }
}`,
            functs: [],
            logs: [],
            vars: []
        },
        {
            title: "Add a console.log as the last line of each code block",
            text: `You should see a 2,2,2,0. The 2's are because all three inner blocks will log out the "a" contained in the 
"wrapper for the wrapper for local", and the a = 2 changed that variable to 2. The 0 is because in that code
block has it's own "a", and that a wasn't changed by the a = 2. The let a = 1 in some sense blocked the a = 2 
from effecting it.`,
            example: `{//wrapper for wrapper for wrapper for local
    let a = 0; //the a = 2 never gets here
    {// wrapper for wrapper for local
        //looks here third
        let a = 1; //found it!
        {// wrapper for local
            //looks here second
            {// local code block
                //looks here first 
                a = 2;
                //[console.log(a);]
            }
            //[console.log(a);]
        }
        //[console.log(a);] 
    }
    //[console.log(a);]
}`,
            startingCode: `{//wrapper for wrapper for wrapper for local
    let a = 0; //the a = 2 never gets here
    {// wrapper for wrapper for local
        //looks here third
        let a = 1; //found it!
        {// wrapper for local
            //looks here second
            {// local code block
                //looks here first 
                a = 2;
                //[console.log(a);]
            }
            //[console.log(a);]
        }
        //[console.log(a);] 
    }
    //[console.log(a);]
}`,
            functs: [],
            logs: ["2", "2", "2", "0"],
            vars: [{name: "a", value: 0, scopeName: "genericBlock"}, {name: "a", value: 2, scopeName: "genericBlock"}]
        },
        {
            title: "Now by removing one line of code make this code console.log out 2,2,2,2",
            text: ``,
            example: `{//wrapper for wrapper for wrapper for local
    let a = 0; //the a = 2 never gets here
    {// wrapper for wrapper for local
        //looks here third
        let a = 1; //found it! //[]
        {// wrapper for local
            //looks here second
            {// local code block
                //looks here first 
                a = 2;
                console.log(a);
            }
            console.log(a);
        }
        console.log(a); 
    }
    console.log(a);
}`,
            startingCode: `{//wrapper for wrapper for wrapper for local
    let a = 0; //the a = 2 never gets here
    {// wrapper for wrapper for local
        //looks here third
        let a = 1; //found it! //[]
        {// wrapper for local
            //looks here second
            {// local code block
                //looks here first 
                a = 2;
                console.log(a);
            }
            console.log(a);
        }
        console.log(a); 
    }
    console.log(a);
}`,
            functs: [],
            logs: ["0", "0", "0", "0"],
            vars: [{name: "a", value: 2, scopeName: "genericBlock"}]
        },
        {
            title: "Now add a new untagged assignment b = 3 under the a = 2.",
            text: `Because there are no b's in any of the wrapping code blocks
this will go all the way out to the global frame outside all the blocks. When it get's there there is nowhere else for it to look
so it will create a new global variable b and set it equal to 3. Place a console.log(b) outside all the code blocks.`,
            example: `If you'd placed a console.log(a) where the console.log(b) is it would have error-ed out because there was no a there. try doing that, then after it errors out, try turning the a = 2 into a window.a = 2`,
            startingCode: `{//wrapper for wrapper for wrapper for local
    let a = 0; //the a = 2 never gets here
    {// wrapper for wrapper for local
        //looks here third
        {// wrapper for local
            //looks here second
            {// local code block
                //looks here first 
                a = 2;
                //[b = 3;]
                console.log(a);
            }
            console.log(a);
        }
        console.log(a); 
    }
    console.log(a);
}
//[console.log(b);]`,
            functs: [],
            logs: ["3"],
            vars: [{name: "b", value: 3, scopeName: "default"}]
        },
        {
            title: "window.Variable",
            text: `window is one of the more fun and horrible things in JavaScript. It is the global frame, and so no matter where you are in your code
you can jump straight out and access and modify global variables without having to go through your wrapping blocks.`,
            example: `{//wrapper for wrapper for wrapper for local
    let a = 0; //the window.a = 4 never gets here
    {// wrapper for wrapper for local
        //looks here third
        {// wrapper for local
            //looks here second
            {// local code block
                //looks here first 
                a = 2; //[window.a = 4]
                b = 3;
                console.log(a);
            }
            console.log(a);
        }
        console.log(a); 
    }
    console.log(a);
}
console.log(b);
//[console.log(a)]`,
            startingCode: `{//wrapper for wrapper for wrapper for local
    let a = 0; //the window.a = 4 never gets here
    {// wrapper for wrapper for local
        //looks here third
        {// wrapper for local
            //looks here second
            {// local code block
                //looks here first 
                a = 2; //[window.a = 4]
                b = 3;
                console.log(a);
            }
            console.log(a);
        }
        console.log(a); 
    }
    console.log(a);
}
console.log(b);
//[console.log(a)]`,
            functs: [],
            logs: ["4"],
            vars: []
        },
        {
            title: "Functions Reference",
            text: `The rule for code blocks was relatively straightforward. You started locally and then you went outward through the nesting blocks.
The rule for functions is a little more annoying. Instead of the "parent frame" being the wrapping code block the "parent frame"
for a function call is the frame where the function was declared. The simplest version of this is for a function defined in the global
frame. `,
            example: `var a = 2; // then we look in the parent frame and find that a is 2
function example(){
    //We look here in the local frame first
    console.log(a);
}
example();`,
            startingCode: `var a = 2; // then we look in the parent frame and find that a is 2
function example(){
    //We look here in the local frame first
    console.log(a);
}
example();`,
            functs: [],
            logs: [],
            vars: []
        },
        {
            title: "Add a console.log(a) or console.log(b) after the var a = 1 so that the code logs out 0.",
            text: ``,
            example: `var a = 0;
var b = 0;
function example(){
    var a = 1;
    //[console.log(b)]
}
example();`,
            startingCode: `var a = 0;
var b = 0;
function example(){
    var a = 1;
    //[console.log(b)]
}
example();`,
            functs: [],
            logs: ["0"],
            vars: []
        },
        {
            title: "Add a console.log(a,b,c) after the a = 2;",
            text: `This looks very similar to how things worked in the code blocks examples. But that's because every 
function is being called in the same frame where it was defined. And functions can be called from elsewhere. 
Let's take the example function defined inside definesFunction and call it from the global scope`,
            example: `var a = 0;
var b = 0;
var c = 0;
function definesFunction(){
    var a = 1;
    var b = 1;
    function example(){
        var a = 2;
        //[console.log(a,b,c);]
    }
    example();
}
definesFunction();`,
            startingCode: `var a = 0;
var b = 0;
var c = 0;
function definesFunction(){
    var a = 1;
    var b = 1;
    function example(){
        var a = 2;
        //[console.log(a,b,c);]
    }
    example();
}
definesFunction();`,
            functs: [],
            logs: ["2 1 0"],
            vars: []
        },
        {
            title: `replace the "example();" with "return example;" "definesFunction();" with "example = definesFunction();" and
add a "example();"" as the last line of the code.`,
            text: `example still has the same behavior, even though example is being called from the global frame! It still checks the definesFunction
variables (in particular the var b = 1) before looking at the global variables (including b = 0). This leads to some fun possibilities 
we'll explore in detail in the next part.`,
            example: `var a = 0;
var b = 0;
var c = 0;
function definesFunction(){
    var a = 1;
    var b = 1;
    function example(){
        var a = 2;
        console.log(a,b,c);
    }
    example(); //[return example;]
}
definesFunction(); //[example = definesFunction();]
//[example();]`,
            startingCode: `var a = 0;
var b = 0;
var c = 0;
function definesFunction(){
    var a = 1;
    var b = 1;
    function example(){
        var a = 2;
        console.log(a,b,c);
    }
    example(); //[return example;]
}
definesFunction(); //[example = definesFunction();]
//[example();]`,
            functs: [],
            logs: [],
            vars: []
        },
        {
            title: "Last challenge: add two lines below this code to trigger the console.log(num) inside function d.",
            text: ``,
            example: `var num = 0;
function a(){
    var num = 1;
    function b(){
        function c(){            
            function d(){
                console.log(num);
            }
            window.d = d;
        }
        c();
    }
    b();
}
//[a();]
//[d();]`,
            startingCode: `var num = 0;
function a(){
    var num = 1;
    function b(){
        function c(){            
            function d(){
                console.log(num);
            }
            window.d = d;
        }
        c();
    }
    b();
}
//[a();]
//[d();]`,
            functs: [],
            logs: ["1"],
            vars: [{name: "num", val: 1, scopeName: "a"}]
        },
        // {
        //     title: "",
        //     text: ``,
        //     example: ``,
        //     startingCode: ``,
        //     functs: [],
        //     logs: [],
        //     vars: []
        // }

      ],
};