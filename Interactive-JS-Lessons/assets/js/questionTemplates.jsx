'use strict'
var functionTestArray = new Array();
function createNewFNtab(name){
  if(!name){
    return;
  }
  var fnTabsContainer = document.getElementById("tabsContainer");
  var root = ReactDOM.createRoot(fnTabsContainer);
  var number = document.getElementsByClassName("functionTestTab").length;
  functionTestArray.push(function(){
      if(number === 0){
        return (<div id={"fnest-"+number} class="functionTestTab left">{name}</div>)
      }
      return (<div id={"fnest-"+number} class="functionTestTab">{name}</div>);
    }());
  root.render(functionTestArray);
}