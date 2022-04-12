var year = 2;
currentFrame.addVariable("var", "year", year);
var hellomessage = "Hello! Welcome to my landing page! ";
currentFrame.addVariable("var", "hellomessage", hellomessage);
var aQuickAbout = "here, you will soon be able to find more projects that I've done during my time at Renton Technical College along with some additional information about me and my interests outside of school";
currentFrame.addVariable("var", "aQuickAbout", aQuickAbout);
var keyword = "internship";
currentFrame.addVariable("var", "keyword", keyword);
currentFrame.declaredFunctions.set("moreInfo", true);
function moreInfo() {
    currentFrame = new Frame(currentFrame, "moreInfo");
    hellomessage = "More information could be found on my about me page!";
    currentFrame.updateVariable("hellomessage", hellomessage)
    console.log(" ");
    console.log(goal);
    currentFrame = currentFrame.returnParentFrame();
}
currentFrame.declaredFunctions.set("a", true);
function a() {
    currentFrame = new Frame(currentFrame, "a");
    hellomessage = "I’m a " + year + "nd  year CSI student at ";
    currentFrame.updateVariable("hellomessage", hellomessage)
    var location;
    currentFrame.addVariable("var", "location;", location;);
    currentFrame.declaredFunctions.set("b", true);
    function b() {
        currentFrame = new Frame(currentFrame, "b");
        location = "Renton Technical College.";
        currentFrame.updateVariable("location", location)
        goal = "What I'm looking for are CompSci " + keyword + " opportunities.";
        currentFrame.updateVariable("goal", goal)
        currentFrame = currentFrame.returnParentFrame();
    }
    b();
    console.log(hellomessage + location);
    console.log(aQuickAbout);
    moreInfo();
    currentFrame = currentFrame.returnParentFrame();
}
currentFrame.declaredFunctions.set("offer", true);
function offer() {
    currentFrame = new Frame(currentFrame, "offer");
    var haveOffer = "If you have any opportunities";
    currentFrame.addVariable("var", "haveOffer", haveOffer);
    console.log(haveOffer + "  and would like to offer me an " + keyword + "...");
    currentFrame = currentFrame.returnParentFrame();
}
currentFrame.declaredFunctions.set("contactMe", true);
function contactMe() {
    currentFrame = new Frame(currentFrame, "contactMe");
    var email = "dhnguyen08@student.rtc.edu";
    currentFrame.addVariable("var", "email", email);
    console.log("Or, you could shoot me an email @  " + email);
    var goodbyeMessage = "Thanks for stopping by!";
    currentFrame.addVariable("var", "goodbyeMessage", goodbyeMessage);
    currentFrame.declaredFunctions.set("a", true);
    function a() {
        currentFrame = new Frame(currentFrame, "a");
        console.log(" ");
        console.log("Thanks for stopping by!");
        currentFrame = currentFrame.returnParentFrame();
    }
    a();
    currentFrame = currentFrame.returnParentFrame();
}
console.log(hellomessage);
a();
offer();
console.log(hellomessage);
contactMe();