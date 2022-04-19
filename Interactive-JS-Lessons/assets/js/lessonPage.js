'use strict';

var editor;
var newTest;

const data = {labID: function(){
  try{
      var number = Number((window.location.href).split('?')[1].split('=')[1]);
  }catch(error){
      return 664981842751798;
  }
  return number;
}()};

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
}
fetch('http://137.184.237.82:3000/requestLab', options).then((response) => response.json()).then((data) => {
  //i still need to create the ssl certs for the server. so we will just use http for now. I mean its not like im sending anything too interesting
    if(data.error){
        console.log(data.error);
    }else{
        newTest = new Test(data);
        // console.log(newTest);
        init(newTest);
    }
});

function displayTests(newTest){
  var lessonPage = document.getElementById("lessonPage");
  var root = ReactDOM.createRoot(lessonPage);
  var elements = new Array();
  elements.push(function(){
      return (
        <section><h1>{newTest.title}</h1></section>
        );
    }());
  for( let i in newTest.returnQuestionSet()){
    // console.log(newTest.returnQuestionSet()[i]);
    let newQuestion = newTest.returnQuestionSet()[i];
    let newSection = 
      (<section id={`test-num-${i}`}>
          <h2>{Number(i) + 1}) {newQuestion.title}</h2>
          <p dangerouslySetInnerHTML={ { __html: newQuestion.text}}></p>
        <div className={`example`}><p>{newQuestion.example}</p></div>
      </section>);
    elements.push(newSection);
  }
  root.render(elements);
}