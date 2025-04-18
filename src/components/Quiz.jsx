import { useState } from 'react';
import QuestionDisplay from './QuestionDisplay.jsx';
import SelectDisplay from './SelectDisplay.jsx';
import AnswerDisplay from './AnswerDisplay.jsx';

export default function Quiz({ quizIndex, questionData }) {
  const [checkedValue, setCheckedValue] = useState(null);

  const handleSelectChange = (value) => {
    setCheckedValue(value);
  };

  return (
    <div id="quiz" className="sm:w-auto w-dvw">
      {/* 問題を表示 */}
      <QuestionDisplay quizIndex={quizIndex} titleData={questionData.question} />
      {/* 選択肢を表示 */}
      <SelectDisplay quizIndex={quizIndex} selectData={questionData.selects} onCheckChange={handleSelectChange} />
      {/* 答えを表示 */}
      <AnswerDisplay titleData={questionData.question} answerData={questionData.answer} questionId={questionData.questionId} onCheckChange={checkedValue} />
    </div>
  );
}