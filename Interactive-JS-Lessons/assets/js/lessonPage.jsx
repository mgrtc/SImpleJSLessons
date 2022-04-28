'use strict';

function displayTests(newTest){
  var lessonPage = document.getElementById("lessonPage");
  var root = ReactDOM.createRoot(lessonPage);
  var elements = new Array();
  elements.push(function(){
      return (
        <section><h1>{newTest.title}</h1><p>{newTest.text}</p></section>
        );
    }());

  for( let i in newTest.returnQuestionSet()){
    let newQuestion = newTest.returnQuestionSet()[i];
    elements.push(function(){
      return (<section id={`test-num-${i}`} className={function(){
        if(i < localStorage.getItem(`${currentLabID}`)){
          return "fadeOut";
        }
      }()}>
      <h2>{Number(i) + 1}) {newQuestion.title}</h2>
      <p dangerouslySetInnerHTML={ { __html: newQuestion.text}}></p>
    <div className={`example` + function(){
      if(newQuestion.example.trim() === ""){
        return "hide";
      }else{
        return '';
      }
    }()}><p dangerouslySetInnerHTML={ { __html: newQuestion.example}}></p></div>
  </section>)
    }());
  }
  root.render(elements);
}