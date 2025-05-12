import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import {
  QuizAnswer,
  QuizQuestion,
  createQuestion,
  updateQuestion,
} from "@/lib/quizzes";
import { CreateQuizQuestionDto } from "@lms-saas/shared-lib/dtos";

type QuestionDialogProps = {
  quizId: string;
  questionLength: number;
  question?: QuizQuestion;
  setQuestions: Dispatch<SetStateAction<QuizQuestion[]>>;
  onQuestionCreated?: (question: QuizQuestion) => void;
  onQuestionUpdated?: (question: QuizQuestion) => void;
  trigger?: React.ReactNode;
};

export const QuestionDialog = ({
  questionLength,
  quizId,
  question,
  onQuestionCreated,
  onQuestionUpdated,
  setQuestions,
  trigger,
}: QuestionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questionText, setQuestionText] = useState(
    question?.questionText || "",
  );
  const [answers, setAnswers] = useState(
    question?.answers || [{ answerText: "", isCorrect: false }],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const questionData: CreateQuizQuestionDto = {
        questionText,
        orderIndex: questionLength,
        answers: answers.map((answer) => ({
          answerText: answer.answerText,
          isCorrect: answer.isCorrect,
        })),
      };

      if (question) {
        const response = await updateQuestion(question.id, questionData);
        if (response.error) {
          toast.error("Failed to update question");
          return;
        }
        onQuestionUpdated?.(response.data?.data!);
        setQuestions((questions: QuizQuestion[]) => [
          ...questions,
          response.data?.data!,
        ]);
        toast.success("Question updated successfully");
      } else {
        const response = await createQuestion(quizId, questionData);
        if (response.error) {
          toast.error("Failed to create question");
          return;
        }
        onQuestionCreated?.(response.data?.data!);
        setQuestions((questions: QuizQuestion[]) => [
          ...questions,
          response.data?.data!,
        ]);
        toast.success("Question created successfully");
      }

      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setQuestionText("");
    setAnswers([{ answerText: "", isCorrect: false }]);
  };

  const addAnswer = () => {
    setAnswers([...answers, { answerText: "", isCorrect: false }]);
  };

  const removeAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const updateAnswer = (
    index: number,
    field: "answerText" | "isCorrect",
    value: string | boolean,
  ) => {
    const newAnswers = [...answers];
    newAnswers[index] = {
      ...(newAnswers[index] as QuizAnswer),
      [field]: value,
    };
    setAnswers(newAnswers);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {question ? "Edit Question" : "Add New Question"}
            </DialogTitle>
            <DialogDescription>
              {question
                ? "Update the question and its answers"
                : "Create a new question with multiple answers"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter your question"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Answers</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAnswer}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Answer
                </Button>
              </div>

              <div className="space-y-4">
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-lg border p-4"
                  >
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`answer-${index}`}>
                        Answer {index + 1}
                      </Label>
                      <Input
                        id={`answer-${index}`}
                        value={answer.answerText}
                        onChange={(e) =>
                          updateAnswer(index, "answerText", e.target.value)
                        }
                        placeholder="Enter answer text"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-8">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`correct-${index}`}
                          checked={answer.isCorrect}
                          onCheckedChange={(checked) =>
                            updateAnswer(index, "isCorrect", checked)
                          }
                        />
                        <Label htmlFor={`correct-${index}`}>Correct</Label>
                      </div>
                      {answers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAnswer(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? question
                  ? "Updating..."
                  : "Creating..."
                : question
                  ? "Update Question"
                  : "Create Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
