import { ToastId, UseToastOptions } from "@chakra-ui/react";

export type Toast = (options?: UseToastOptions | undefined) => ToastId;

export const myToast = {
  info: (toast: Toast, title: string, description: string) =>
    toast({
      title: title || "Info!",
      description,
      status: "info",
      duration: 5000,
      isClosable: true,
    }),
  success: (toast: Toast, description: string) =>
    toast({
      title: "Success!",
      description,
      status: "success",
      duration: 5000,
      isClosable: true,
    }),
  warning: (toast: Toast, description: string) =>
    toast({
      title: "Warning!",
      description,
      status: "warning",
      duration: 3000,
      isClosable: true,
    }),
  error: (toast: Toast, description: string) =>
    toast({
      title: "Error!",
      description,
      status: "error",
      duration: 3000,
      isClosable: true,
    }),
};
