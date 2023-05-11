import { ErrorResponse } from "@/types/error";
import { AxiosError } from "axios";
import { GetServerSidePropsResult } from "next";
import { myToast, Toast } from "./myToast";

export const myError = async (
  error: AxiosError<ErrorResponse>,
  toast: Toast,
  handle401: () => void
) => {
  if (error.response?.data) {
    if (error.response.status === 401) {
      handle401();
      return;
    }

    myToast.error(
      toast,
      `[${error.response.status}] - ${error.response.data.message}`
    );
    console.log("error response: ", error.response.data);
    return;
  }

  if (error.code) {
    myToast.error(toast, `[${error.code}] - ${error.message}`);
    console.log("error code: ", error.code, error.message);
    return;
  }

  myToast.error(toast, `${error}`);
  console.log("error mutate: ", error);
};

export const myErrorBasic = (
  error: AxiosError<ErrorResponse>,
  toast: Toast
) => {
  if (error.response?.data) {
    myToast.error(
      toast,
      `[${error.response.status}] - ${error.response.data.message}`
    );
    console.log("error response: ", error.response.data);
    return;
  }

  if (error.code) {
    myToast.error(toast, `[${error.code}] - ${error.message}`);
    console.log("error code: ", error.code, error.message);
    return;
  }

  myToast.error(toast, `${error}`);
  console.log("error mutate: ", error);
};

export const myErrorSSR = <P>(
  error: AxiosError<ErrorResponse>
): GetServerSidePropsResult<P> => {
  if (error.response?.data) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: `/error-request?error=401&message=silahkan-login-kembali`,
        },
      };
    }

    return {
      redirect: {
        permanent: false,
        destination: `/error-request?error=${error.response.status}&message=${error.response.data?.error}-${error.response.data?.message}`,
      },
    };
  }

  if (error.code) {
    return {
      redirect: {
        permanent: false,
        destination: `/error-request?error=${error.code}&message=${error.message}`,
      },
    };
  }

  console.log("error get data: ", error);
  return {
    redirect: {
      permanent: false,
      destination: `/error-request?error=0&message=${error}`,
    },
  };
};
