"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createQuiz, createQuizSchema, Quiz } from "@/lib/quizzes";
import { attempt } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateQuizDto } from "@lms-saas/shared-lib/dtos";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type CreateQuizDialogProps = {
  lessonId: number;
  quizzesNumber: number;
  onQuizCreated: (quiz: Quiz) => void;
};

export const CreateQuizDialog = ({
  quizzesNumber,
  lessonId,
  onQuizCreated,
}: CreateQuizDialogProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createQuizSchema>>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: "",
      duration: 0,
    },
  });

  const handleSubmit = async (data: CreateQuizDto) => {
    try {
      const [response, error] = await attempt(createQuiz(lessonId, data));
      if (error) {
        toast.error("Failed to create quiz");
        return;
      }

      onQuizCreated(response.data);
      setOpen(false);
      toast.success("Quiz created successfully");
    } catch (error) {
      toast.error("Failed to create quiz");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger hidden={quizzesNumber >= 1} asChild>
        <Button hidden={quizzesNumber >= 1} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Quiz
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
          <DialogDescription>
            Add a new quiz to test your students' knowledge
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mb-2 w-full space-y-4"
          >
            <div className="text-sm text-red-500">
              {form.formState.errors.root?.message}
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quiz title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Set a duration"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <div>
                    <Loader className="animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Quiz"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
