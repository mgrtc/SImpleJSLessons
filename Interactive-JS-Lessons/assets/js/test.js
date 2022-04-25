var currentFrame = new Frame();

var y = function () {
  x =
  {
    name:
    {
      key: "hello world"
    }
  }
  currentFrame.updateVariable("x", x);
  var test = function () {
    console.log("hello there");
  }
  currentFrame.addVariable("var", "test", test);
  test();
}
currentFrame.addVariable("var", "y", y);
console.log(x.name.key);
y();
document.getElementById("Question3").addEventListener("click", function(){
  alert("hi!");
})