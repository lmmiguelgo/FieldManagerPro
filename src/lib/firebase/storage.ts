import {
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./config";

export async function uploadFile(
  path: string,
  file: File | Blob
): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadBase64(
  path: string,
  base64Data: string
): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadString(storageRef, base64Data, "data_url");
  return getDownloadURL(storageRef);
}

export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
