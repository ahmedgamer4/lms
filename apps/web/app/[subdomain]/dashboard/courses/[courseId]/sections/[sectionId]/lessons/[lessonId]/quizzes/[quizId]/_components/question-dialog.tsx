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
import { Dispatch, SetStateAction, useMemo } from "react";
import { toast } from "sonner";
import {
  QuizAnswer,
  QuizQuestion,
  createQuestion,
  updateQuestion,
} from "@/lib/quizzes";
import { CreateQuizQuestionDto } from "@lms-saas/shared-lib/dtos";
import { useForm, useFieldArray } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
  setQuestions,
  trigger,
}: QuestionDialogProps) => {
  const resolver = useMemo(() => {
    return classValidatorResolver(CreateQuizQuestionDto);
  }, []);

  const form = useForm<CreateQuizQuestionDto>({
    resolver,
    defaultValues: {
      questionText: "",
      orderIndex: questionLength,
      answers: [{ answerText: "", isCorrect: true }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "answers",
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: CreateQuizQuestionDto) => {
    try {
      const response = await createQuestion(quizId, data);
      if (response.error) {
        toast.error("Failed to create question");
        return;
      }
      setQuestions((questions: QuizQuestion[]) => [
        ...questions,
        response.data?.data!,
      ]);
      toast.success("Question created successfully");
      form.reset();
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
              <DialogDescription>
                Create a new question with multiple answers
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="questionText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your question" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Answers</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ answerText: "", isCorrect: false })}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Answer
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="bg-primary/5 flex items-start gap-4 rounded-lg border p-4"
                    >
                      <div className="flex-1 space-y-2">
                        <FormField
                          control={form.control}
                          name={`answers.${index}.answerText`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Answer {index + 1}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter answer text"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-8">
                        <FormField
                          control={form.control}
                          name={`answers.${index}.isCorrect`}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel>Correct</FormLabel>
                            </FormItem>
                          )}
                        />
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
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
              <Button type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting ? "Creating..." : "Create Question"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
