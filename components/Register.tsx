import { ErrorResponse } from "@/types/error";
import { register } from "@/utils/fetchApi";
import { myErrorBasic } from "@/utils/myError";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useCallback, useState } from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const initialInputs = {
  name: "",
  email: "",
  password: "",
};

const Register = ({ visible, onClose }: Props) => {
  const [input, setInput] = useState(initialInputs);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
        await register(input);
        toast({
          status: "success",
          title: "Register Success",
          description: `Register success ${input.email}`,
        });
        setLoading(false);
        setInput(initialInputs);
        onClose();
      } catch (error) {
        myErrorBasic(error as AxiosError<ErrorResponse>, toast);
        setLoading(false);
      }
    },
    [input, toast, onClose]
  );
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Text mt={2}>Name</Text>
            <Input
              name="name"
              type="text"
              placeholder="input your name"
              onChange={handleChange}
            />
            <Text mt={2}>Email</Text>
            <Input
              name="email"
              type="email"
              placeholder="input your email"
              onChange={handleChange}
            />
            <Text mt={2}>Password</Text>
            <Input
              name="password"
              type="password"
              placeholder="input your password"
              onChange={handleChange}
            />
            <Button mt={4} type="submit" isLoading={loading}>
              Register
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Register;
