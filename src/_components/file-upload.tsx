"use client";

import { UploadDropzone } from '@/lib/uploadthing';
import '@uploadthing/react/styles.css';
import { X } from 'lucide-react';
import Image from 'next/image';


type Props = {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "serverImage" | "messageFile";
}

const FileUpload = ({ endpoint, value, onChange, ...props }: Props) => {
  
  const fileType = value.split(".").pop();
  
  if(value&& fileType !== "pdf") return (
    <div className='relative size-20'>
      <Image
        fill
        className='rounded-full'
        alt='upload'
        src={value}
      />
      <button
        onClick={() => onChange("")}
        className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'
        type='button'
      >
        <X className='size-4'/>
      </button>
    </div>
  );

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error) => {
        console.log(error);
      }}
    />
  );
}

export default FileUpload;