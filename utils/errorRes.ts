import { ErrorResponse } from "@/types/error";
import { CreateToastFnReturn } from "@chakra-ui/react";
import { AxiosError } from "axios";

interface CustomHandle401 {
  isCustom401: boolean;
  handle401: () => void;
}

const errorRes = (
  err: AxiosError<ErrorResponse>,
  toast: CreateToastFnReturn,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  customHandle401?: CustomHandle401
) => {
  const { isCustom401, handle401 } = customHandle401 || {};

  if (err.response?.data) {
    const { statusCode, message } = err.response.data;

    if (isCustom401 && statusCode === 401 && handle401) {
      handle401();
      if (setLoading) {
        setLoading(false);
      }
      return;
    }

    toast({
      status: "error",
      title: statusCode,
      description: JSON.stringify(message),
    });
    if (setLoading) {
      setLoading(false);
    }
    return;
  }

  toast({
    status: "error",
    title: err.code,
    description: err.message,
  });
  console.log("error: ", err);
  if (setLoading) {
    setLoading(false);
  }
};

export default errorRes;
