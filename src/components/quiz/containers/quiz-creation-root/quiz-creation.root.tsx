import QuizFormComponent from "../../components/quiz-form/quiz-form.component";
import "./quiz-creation.root.scss";

const QuizCreationRoot = () => {
  return (
    <div className="quiz-creation-root">
      <header>
        <h1>Création quiz</h1>
      </header>
      <div className="quiz-creation-content">
        <QuizFormComponent />
      </div>
    </div>
  );
};

export default QuizCreationRoot;
