"use client";

import { Edit, File, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { MemberRole, type Prisma } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import qs from "query-string";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import UserAvatar from "@/_components/user-avatar";
import ActionTooltip from "@/_components/action-tooltip";
import { Form, FormControl, FormField, FormItem } from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import { Button } from "@/_components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="size-4 ml-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="size-4 ml-2 text-rose-500" />,
}

const formSchema = z.object({
  content: z.string().min(1),
});

type FormSchemaType = z.infer<typeof formSchema>;

type ChatItemProps = {
  id: string;
  content: string;
  member: Prisma.MemberGetPayload<{ include: { profile: true } }>;
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Prisma.MemberGetPayload<{}>;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const ChatItem = ({ id, content, member, timestamp, fileUrl, deleted, currentMember, isUpdated, socketUrl, socketQuery, ...props }: ChatItemProps) => {
  const router = useRouter();
  const params = useParams();
  
  const onMemberClick = () => {
    if(member.id === currentMember.id) return;
    
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  }
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { onOpen } = useModal();
  
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if(event.key === "Escape" || event.keyCode === 27) setIsEditing(false);
    }
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => window.removeEventListener('keyDown', handleKeyDown);
  }, []);
  
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });
  
  useEffect(() => {
    form.reset({
      content
    });
  }, [content]);

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;

  const canDeleteMsg = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMsg = !deleted && isOwner && !fileUrl;

  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;
  
  const isLoading = form.formState.isSubmitting;
  
  const onSubmit = async (values: FormSchemaType) => {
    console.log(values);
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      
      await axios.patch(url, values);
      
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="relative group flex items-center hover:bg-black/20 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary size-48">
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
              <File className="size-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target='_blank'
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1",
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1 ">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            {...field}
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant='primary'>
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save.
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMsg && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMsg && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto size-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => onOpen("deleteMessage", { apiUrl: `${socketUrl}/${id}`, query: socketQuery })}
              className="cursor-pointer ml-auto size-4 text-rose-500 hover:text-rose-600 dark:hover:text-rose-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
}

export default ChatItem;