import { AppFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";

export const { uploadFiles, useUploadThing } =
  generateReactHelpers<AppFileRouter>();
