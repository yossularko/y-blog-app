import { Tokens, User } from "@/types";
import { ErrorResponse } from "@/types/error";
import errorRes from "@/utils/errorRes";
import { login } from "@/utils/fetchApi";
import { Box, Button, Input, Text, useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useCallback, useState } from "react";

interface LoginRes {
  token: Tokens;
  user: User;
}

interface Props {
  onSuccess: (res: LoginRes) => Promise<void>;
}

const initialInput = { email: "", password: "" };

const Login = ({ onSuccess }: Props) => {
  const [input, setInput] = useState(initialInput);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await login(input);

        console.log("success login: ", response.data);
        setLoading(false);
        if (response.status === 201) {
          setInput(initialInput);
          await onSuccess(response.data);
        }
      } catch (error) {
        errorRes(error as AxiosError<ErrorResponse>, toast, setLoading);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input, toast]
  );

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>
        See My Articles
      </Text>
      <form onSubmit={handleLogin}>
        <Input
          type="email"
          name="email"
          placeholder="input email"
          onChange={handleChange}
          mb={2}
        />
        <Input
          type="password"
          name="password"
          placeholder="input password"
          onChange={handleChange}
          mb={2}
        />
        <Button isLoading={loading} type="submit">
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
