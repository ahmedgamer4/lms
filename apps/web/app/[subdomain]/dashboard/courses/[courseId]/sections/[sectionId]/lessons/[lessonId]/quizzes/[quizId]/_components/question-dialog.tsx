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
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { toast } from "sonner";
import { QuizQuestion, createQuestion } from "@/lib/quizzes";
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
import { attempt } from "@/lib/utils";
import { useTranslations } from "next-intl";
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

  const t = useTranslations();

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
      const [response, error] = await attempt(createQuestion(quizId, data));
      if (error) {
        toast.error(t("quizzes.failedToCreateQuestion"));
        return;
      }
      setQuestions((questions: QuizQuestion[]) => [
        ...questions,
        response.data!,
      ]);
      toast.success(t("quizzes.questionCreatedSuccessfully"));
      form.reset();
    } catch (error) {
      toast.error(t("quizzes.failedToCreateQuestion"));
    }
  };

  return (
    <Dialog>
      <div className="flex w-full justify-end">
        <DialogTrigger asChild>
          {trigger || (
            <Button className="mt-2 gap-2 md:mt-0">
              <IconPlus className="h-4 w-4" />
              {t("quizzes.addQuestion")}
            </Button>
          )}
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t("quizzes.createQuestion")}</DialogTitle>
              <DialogDescription>
                {t("quizzes.createQuestionDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="questionText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("quizzes.question")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("common.titlePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t("quizzes.answers")}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ answerText: "", isCorrect: false })}
                    className="gap-2"
                  >
                    <IconPlus className="h-4 w-4" />
                    {t("quizzes.addAnswer")}
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
                              <FormLabel>
                                {t("quizzes.answer")} {index + 1}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("quizzes.answerPlaceholder")}
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
                              <FormLabel>{t("quizzes.correct")}</FormLabel>
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
                            <IconTrash className="h-4 w-4" />
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
                {isSubmitting
                  ? t("common.submitting")
                  : t("quizzes.createQuestion")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
