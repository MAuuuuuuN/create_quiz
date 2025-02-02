import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { QuizProvider } from './components/QuizContext.jsx';
import { AnswerProvider } from './components/QuizContext.jsx';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import '@mantine/carousel/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MantineProvider>
        <QuizProvider>
            <AnswerProvider>
                <App />
            </AnswerProvider>
        </QuizProvider>
    </MantineProvider>
);