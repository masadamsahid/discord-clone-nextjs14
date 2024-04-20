"use client";

import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { useRouter } from "next/navigation";
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/_components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/_components/ui/form";
import { Button } from "@/_components/ui/button";
import FileUpload from "@/_components/file-upload";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  fileUrl: z.string().min(1, { message: "Attachement is required" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

type Props = {}

const MessageFileModal = (props: Props) => {
  const router = useRouter();
  
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "messageFile";
  const { apiUrl, query } = data;
  
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      fileUrl: "",
    },
  });
  
  const handleClose = () => {
    form.reset();
    onClose();
  }

  const onSubmit = async (values: FormSchemaType) => {
    try {
      console.log({ values });
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });
      
      form.reset();
      router.refresh();
      handleClose();
    } catch (error:any) {
      console.log(error);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isSubmitting} variant='primary'>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default MessageFileModal;