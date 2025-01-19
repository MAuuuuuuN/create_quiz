import { useState } from 'react';

import ProblemSetting from './components/ProblemSetting.js';
import ShowAnswer from './components/ShowAnswer.js';
import Quiz from './components/Quiz.js';

import styles from './style.module.css';

function App() {
  const [geminiState, setGeminiState] = useState('ready');
  const [showAnswer, setShowAnswer] = useState(false);
  const [questionList, setQuestionList] = useState([]);

  const states = [
    {
      "stateNow": "ready",
      "stateValue": "待機中",
    },
    {
      "stateNow": "start",
      "stateValue": "実行中",
    },
    {
      "stateNow": "finish",
      "stateValue": "完了",
    },
    {
      "stateNow": "error",
      "stateValue": "エラー",
    },
  ]

  // 問題を生成
  async function GeminiPrepare(value) {
    setGeminiState("start");
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt_select = `${value}に関する知識を問う問題を3つ出題してください。questionに問題文、selectに選択肢、answerに正解の選択肢を入れてください。選択肢を4つ設けて,正解の選択肢は1つとするように設定してください。次のようなJSON形式のような形で出力してください。[{"question":"QQQQQQQ","select":["SSSS","SSSS","SSSS","SSSS"],"answer":"AAAAAAA"},{"question":"QQQQQQQ","select":["SSSS","SSSS","SSSS","SSSS"],"answer":"AAAAAAA"}]`;
      const result = await model.generateContent(prompt_select);
      const response = result.response.text();
      const regex_response = response.replaceAll("```", '').replace(/json\s/, '');
      const quiz_list = JSON.parse(regex_response);

      setQuestionList(() => {
        const newQuestions = quiz_list.map((quiz) => ({
          questionId: crypto.randomUUID(),
          question: quiz.question,
          select: quiz.select.map(cur => ({
            selectId: crypto.randomUUID(),
            select: cur
          })),
          answer: quiz.answer
        }));

        return [...newQuestions];
      });

      setGeminiState("finish");
    } catch (error) {
      setGeminiState("error");
    }
  }

  // 設定した内容をGeminiに送る
  function handleButtonClick(value) {
    GeminiPrepare(value);
  }

  // 問題の答えを表示する
  function handleShowAnswer(isShow) {
    setShowAnswer(isShow);
  }

  return (
    <>
      {/* 問題生成のボタン */}
      <ProblemSetting onButtonClick={handleButtonClick} />
      {/* 実行の状態を表示 */}
      {/* ToDo : オブジェクトなどを利用して簡潔にまとめる */}
      <div className={styles.status}>
        <p className={styles.status_text}>ステータス : </p>
        {states
          .filter((state) => state.stateNow === geminiState)
          .map((state) => (
            <p className={styles[`status_${state.stateNow}`]}>{state.stateValue}</p>
          ))}


        {/* {geminiState === "ready" && <p className={styles.status_ready}>待機中</p>}
        {geminiState === "start" && <p className={styles.status_start}>実行中</p>}
        {geminiState === "end" && <p className={styles.status_finish}>終了</p>}
        {geminiState === "error" && <p className={styles.status_error}>エラー</p>} */}
      </div>
      {/* 問題文と選択肢と答えを設定 */}
      {questionList.map((question, index) => (
        <Quiz key={question.questionId} quizId={question.quiestionId} quizData={question} quizIndex={index} isShowAnswer={showAnswer} />
      ))}
      {/* 答え表示ボタン */}
      {geminiState === "finish" && <ShowAnswer onShowAnswer={handleShowAnswer} isShow={showAnswer} />}
    </>
  );
}

export default App;