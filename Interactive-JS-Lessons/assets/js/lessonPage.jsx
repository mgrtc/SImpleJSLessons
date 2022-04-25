'use strict';

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
    let newQuestion = newTest.returnQuestionSet()[i];
    elements.push(function(){
      return (<section id={`test-num-${i}`}>
      <h2>{Number(i) + 1}) {newQuestion.title}</h2>
      <p dangerouslySetInnerHTML={ { __html: newQuestion.text}}></p>
    <div className={`example`}><p>{newQuestion.example}</p></div>
  </section>)
    }());
  }
  root.render(elements);
}