"use client";

import { useState } from "react";
import { CheckCircle, XCircle, HelpCircle, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface QuizProps {
  title?: string;
  questions: QuizQuestion[];
  showResults?: boolean;
}

export default function Quiz({ title = "Quiz", questions, showResults = true }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const current = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === current.correctIndex;

  const handleSelect = (index: number) => {
    if (selectedAnswer !== null) return; // Already answered
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowExplanation(false);
    setIsComplete(false);
  };

  const correctCount = selectedAnswers.filter(
    (answer, index) => answer === questions[index].correctIndex
  ).length;

  const percentage = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="my-6 rounded-xl border border-blue-500/10 bg-white dark:bg-navy-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-navy-900 border-b border-blue-500/10">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          <h4 className="font-medium text-slate-900 dark:text-white">{title}</h4>
        </div>
        <span className="text-sm text-slate-500 dark:text-navy-400">
          {currentQuestion + 1} / {questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6"
          >
            {/* Question */}
            <p className="text-lg text-slate-900 dark:text-white mb-6">{current.question}</p>

            {/* Options */}
            <div className="space-y-3">
              {current.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectOption = index === current.correctIndex;
                const showStatus = selectedAnswer !== null;

                let statusClass = "border-blue-500/10 hover:border-blue-500/30";
                if (showStatus) {
                  if (isCorrectOption) {
                    statusClass = "border-green-500/50 bg-green-500/10";
                  } else if (isSelected && !isCorrectOption) {
                    statusClass = "border-red-500/50 bg-red-500/10";
                  } else {
                    statusClass = "border-blue-500/10 opacity-50";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all ${statusClass} ${
                      selectedAnswer === null ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-navy-300">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 text-slate-700 dark:text-navy-200">{option}</span>
                    {showStatus && isCorrectOption && (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    )}
                    {showStatus && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && current.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-navy-800 border border-blue-500/10"
                >
                  <p className="text-sm text-slate-600 dark:text-navy-300">
                    <strong className={isCorrect ? "text-green-400" : "text-red-400"}>
                      {isCorrect ? "Correto!" : "Incorreto."}
                    </strong>{" "}
                    {current.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Button */}
            {selectedAnswer !== null && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleNext}
                className="mt-6 w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-400 text-navy-950 font-medium transition-colors"
              >
                {currentQuestion < questions.length - 1 ? "Próxima Pergunta" : "Ver Resultado"}
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 text-center"
          >
            {/* Results */}
            <div className="mb-6">
              <div
                className={`text-6xl font-bold mb-2 ${
                  percentage >= 70
                    ? "text-green-400"
                    : percentage >= 50
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                {percentage}%
              </div>
              <p className="text-slate-600 dark:text-navy-300">
                Você acertou{" "}
                <span className="text-slate-900 dark:text-white font-medium">
                  {correctCount} de {questions.length}
                </span>{" "}
                perguntas
              </p>
            </div>

            {/* Message */}
            <p className="text-slate-500 dark:text-navy-400 mb-6">
              {percentage >= 70
                ? "Excelente! Você demonstra bom conhecimento no assunto."
                : percentage >= 50
                ? "Bom trabalho! Continue estudando para melhorar."
                : "Continue praticando. Revise o material e tente novamente."}
            </p>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-blue-500/20 hover:border-blue-500/40 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Tentar Novamente
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-100 dark:bg-navy-800">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentQuestion + (isComplete ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
