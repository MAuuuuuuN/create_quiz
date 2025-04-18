export async function getHistory() {
  const quiz_history = 'http://localhost:3001/api/history';
  const response = await fetch(quiz_history);
  const response_data = await response.json();
  return response_data;
}

export async function deleteAllHistory() {
  const quiz_history = 'http://localhost:3001/api/history';
  const delete_method = { method: 'DELETE' }
  await fetch(quiz_history, delete_method);
}

export async function getCategory() {
  const quiz_category = 'http://localhost:3001/api/history/category';
  const response = await fetch(quiz_category);
  const response_data = await response.json();
  return response_data;
}

export async function addQuiz(quiz) {
  const quiz_post = {
    method: 'POST',
    body: JSON.stringify({ "category": quiz.category, "question_id": quiz.questionId, "question": quiz.question, "selects": quiz.selects, "answer": quiz.answer }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  await fetch('http://localhost:3001/api/quiz', quiz_post);
}

export async function addSelect(questionId, isCorrect, selectValue) {
  const select_post = {
    method: 'POST',
    body: JSON.stringify({ "question_id": questionId, "is_correct": isCorrect, "select_value": selectValue }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  await fetch('http://localhost:3001/api/select', select_post);
}