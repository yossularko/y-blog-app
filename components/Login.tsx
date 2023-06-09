import { LoginRes } from "@/types";
import { ErrorResponse } from "@/types/error";
import { login } from "@/utils/fetchApi";
import { myErrorBasic } from "@/utils/myError";
import {
  Box,
  Button,
  Input,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useCallback, useState } from "react";
import Register from "./Register";

interface Props {
  onSuccess: (res: LoginRes) => void;
}

const initialInput = { email: "", password: "" };

const Login = ({ onSuccess }: Props) => {
  const [input, setInput] = useState(initialInput);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          onSuccess(response.data);
        }
      } catch (error) {
        myErrorBasic(error as AxiosError<ErrorResponse>, toast);
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input, toast]
  );

  return (
    <>
      <Register visible={isOpen} onClose={onClose} />
      <Box>
        <Text fontSize="2xl" mb={4}>
          You&apos;re not Login
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
        <Button mt={4} variant="outline" onClick={onOpen}>
          Register
        </Button>
      </Box>
    </>
  );
};

export default Login;
