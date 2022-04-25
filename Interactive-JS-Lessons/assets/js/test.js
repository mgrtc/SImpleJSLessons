  var currentFrame = new Frame();
  var scopeMap = new Map();
  
currentFrame.declaredFunctions.set("checkIfValidTriangle", true);
function checkIfValidTriangle(angle1, angle2, angle3)
{
currentFrame = new Frame(currentFrame, "checkIfValidTriangle");
currentFrame.addVariable("var", "angle1", angle1);
currentFrame.addVariable("var", "angle2", angle2);
currentFrame.addVariable("var", "angle3", angle3);
var validity = 0;
currentFrame.addVariable("var", "validity", validity);
if((angle1+angle2+angle3) === 180)
{
validity = 1;
currentFrame.updateVariable("validity", validity);
currentFrame = currentFrame.returnParentFrame();
return validity;
}
else
{
currentFrame = currentFrame.returnParentFrame();
return validity;
}
var a1 = 60;
currentFrame.addVariable("var", "a1", a1);
var a2 = 60;
currentFrame.addVariable("var", "a2", a2);
var a3 = 40;
currentFrame.addVariable("var", "a3", a3);
console.log("A triangle with angles : " + a1 + " " + a2 + " " + a3 + "...");
if(checkIfValidTriangle(a1, a2, a3) === 1)
{
console.log("is a valid triangle!");
}
else
{
console.log("is not a valid triangle!");
}
console.log(" ");
var radius = 4;
currentFrame.addVariable("var", "radius", radius);
var tempF = 82;
currentFrame.addVariable("var", "tempF", tempF);
currentFrame.declaredFunctions.set("returnPi", true);
function returnPi()
{
currentFrame = new Frame(currentFrame, "returnPi");
currentFrame.addVariable("var", "", );
currentFrame = currentFrame.returnParentFrame();
return 3.14159265;
currentFrame = currentFrame.returnParentFrame();
}
currentFrame.declaredFunctions.set("convertFtoC", true);
function convertFtoC(input)
{
currentFrame = new Frame(currentFrame, "convertFtoC");
currentFrame.addVariable("var", "input", input);
currentFrame = currentFrame.returnParentFrame();
return (input - 32) * (5/9);
currentFrame = currentFrame.returnParentFrame();
}
var tempC = convertFtoC(tempF);
currentFrame.addVariable("var", "tempC", tempC);
console.log(tempF + " in degrees celcius is " + tempC + "c");
console.log(" ");
currentFrame.declaredFunctions.set("calculateSphereVolume", true);
function calculateSphereVolume(radius)
{
currentFrame = new Frame(currentFrame, "calculateSphereVolume");
currentFrame.addVariable("var", "radius", radius);
var pi = 3.14159265;
currentFrame.addVariable("var", "pi", pi);
var radius = radius * radius * radius;
currentFrame.addVariable("var", "radius", radius);
currentFrame = currentFrame.returnParentFrame();
return (4/3) * returnPi() * radius;
currentFrame = currentFrame.returnParentFrame();
}
console.log("Sphere volume with a radius of " + radius + " is : " + calculateSphereVolume(radius));
console.log(" ");
currentFrame.declaredFunctions.set("CalculateAverageGrades", true);
function CalculateAverageGrades(Sub1, Sub2, Sub3, Sub4, Sub5)
{
currentFrame = new Frame(currentFrame, "CalculateAverageGrades");
currentFrame.addVariable("var", "Sub1", Sub1);
currentFrame.addVariable("var", "Sub2", Sub2);
currentFrame.addVariable("var", "Sub3", Sub3);
currentFrame.addVariable("var", "Sub4", Sub4);
currentFrame.addVariable("var", "Sub5", Sub5);
currentFrame = currentFrame.returnParentFrame();
return (Sub1 + Sub2 + Sub3 + Sub4 + Sub5)/5;
currentFrame = currentFrame.returnParentFrame();
}
var averageGrade = CalculateAverageGrades(95, 76, 85, 180/2, 89);
currentFrame.addVariable("var", "averageGrade", averageGrade);
console.log("Average Grade[95, 76, 85, 90, 89] : " + averageGrade);
(()=>{



})()

  currentFrame = currentFrame.returnDefaultFrame();
  logDup(currentFrame);
  // logDup(typeof("currentFrame", currentFrame.variables.get("x").value));
  