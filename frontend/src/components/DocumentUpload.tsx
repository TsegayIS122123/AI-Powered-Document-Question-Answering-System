// frontend/src/components/DocumentUpload.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface UploadForm {
  title: string;
  file: FileList;
}

const schema = yup
  .object({
    title: yup.string().required("Title is required"),
    file: yup.mixed().required("File is required"),
  })
  .required();

export default function DocumentUpload({
  onUpload,
}: {
  onUpload: (data: FormData) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UploadForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: UploadForm) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("file", data.file[0]);

    onUpload(formData);
    reset();
    setIsUploading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("title")}
            placeholder="Document Title"
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <input
            type="file"
            {...register("file")}
            className="w-full"
            accept=".txt,.pdf,.doc,.docx"
          />
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload Document"}
        </button>
      </form>
    </div>
  );
}
