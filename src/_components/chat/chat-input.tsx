"use client";
import qs from "query-string";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Smile } from "lucide-react";
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import EmojiPicker from "@/_components/emoji-picker";

const formSchema = z.object({
  content: z.string().min(1),
});

type FormSchemaType = z.infer<typeof formSchema>;

type ChatInputProps = {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const ChatInput = ({ apiUrl, query, name, type, ...props }: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  
  const isLoading = form.formState.isSubmitting;
  
  const onSubmit = async (values: FormSchemaType) => {
    console.log(values);
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values);
      
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }
  
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button type="button" onClick={() => onOpen("messageFile", { apiUrl, query })} className="absolute top-7 left-8 size-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center">
                    <Plus className="text-white dark:text-[#313338]"/>
                  </button>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder={`Message ${type === 'conversation' ? name : `#${name}`}`}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0  focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)} />
                  </div>
                </div>
              </FormControl>
              {/* <FormMessage/> */}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default ChatInput;