"use client";

import { buttonVariants } from "@/components/ui/button";
import { getQuizResults, isQuizCompleted } from "@/lib/quizzes";
import { attempt, cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function ResultsPage() {
  const { courseId, quizId } = useParams();
  const { data: quizResultsData, isLoading: isQuizResultsLoading } = useQuery({
    queryKey: ["quizResults", quizId],
    queryFn: async () => {
      const [response, error] = await attempt(getQuizResults(quizId as string));

      if (error) {
        toast.error("Failed to get quiz results");
        return null;
      }
      return response.data;
    },
  });

  const { data: quizCompletion, isLoading: isQuizCompletionLoading } = useQuery(
    {
      queryKey: ["quizCompletion", quizId],
      queryFn: async () => {
        const [response, error] = await attempt(
          isQuizCompleted(quizId as string),
        );

        if (error) {
          toast.error("Failed to check quiz completion");
          return null;
        }

        return response.data;
      },
    },
  );

  if (isQuizResultsLoading || isQuizCompletionLoading) {
    return (
      <div className="flex h-full min-h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!quizCompletion?.completed) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold">Quiz not completed</h2>
        <Link
          href={`/courses/${courseId}/quiz/${quizId}`}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "mt-4",
          )}
        >
          Start Quiz
        </Link>
      </div>
    );
  }

  const results = quizResultsData!;
  const percentage = Number(results.score) * 100;
  const questionsCount = results.questions.length;

  return (
    <div className="bg-card mx-auto mt-10 max-w-2xl rounded-lg p-6 shadow">
      <h1 className="mb-2 text-center text-2xl font-bold">Quiz Results</h1>
      <h2 className="text-muted-foreground mb-3 text-center text-lg">
        {results.quiz.title}
      </h2>
      <div className="mb-8 flex flex-col items-center">
        <div
          className={cn(
            "text-4xl font-bold",
            percentage >= 70 ? "text-green-600" : "text-red-600",
          )}
        >
          {percentage}%
        </div>
        <div className="text-muted-foreground mt-2 text-sm">
          {percentage >= 70 ? "Great job!" : "Keep practicing!"}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="mb-2 font-semibold">Summary</h3>
        <div className="flex gap-4">
          <span className="text-green-600">
            Correct: {Math.round(Number(results.score) * questionsCount)}
          </span>
          <span className="text-red-600">
            Incorrect:{" "}
            {questionsCount -
              Math.round(Number(results.score) * questionsCount)}
          </span>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="mb-2 font-semibold">Detailed Answers</h3>
        <ul className="space-y-4">
          {results.questions.map((q, idx) => (
            <li
              key={idx}
              className={`rounded border-2 p-4 ${q.submittedAnswer.id === q.correctAnswer.id ? "bg-accent/50 border-green-300" : "bg-accent/50 border-red-300"}`}
            >
              <div className="font-medium">
                Q{idx + 1}: {q.questionText}
              </div>
              <div className="ml-2">
                <span className="font-semibold">Your answer:</span>{" "}
                <span
                  className={
                    q.submittedAnswer.id === q.correctAnswer.id
                      ? "text-green-700"
                      : "text-red-700"
                  }
                >
                  {q.submittedAnswer.answerText}
                </span>
              </div>
              {q.submittedAnswer.id !== q.correctAnswer.id && (
                <div className="text-muted-foreground ml-2 text-sm">
                  <span className="font-semibold">Correct answer:</span>{" "}
                  {q.correctAnswer.answerText}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center gap-4">
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          href={`/courses/${courseId}`}
        >
          Back to Course
        </Link>
      </div>
    </div>
  );
}
