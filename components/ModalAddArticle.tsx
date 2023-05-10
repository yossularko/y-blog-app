import { Category } from "@/types";
import { ErrorResponse } from "@/types/error";
import errorRes from "@/utils/errorRes";
import { getCategory, postArticle } from "@/utils/fetchApi";
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  handleRefreshToken: () => Promise<void>;
}

const initialInputs = {
  title: "",
  body: "",
  categoryId: "",
  tags: "",
};

const ModalAddArticle = ({
  visible,
  onClose,
  onSuccess,
  handleRefreshToken,
}: Props) => {
  const [category, setCategory] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [input, setInput] = useState(initialInputs);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleChange = useCallback((name: string, value: string) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleChangeFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileSet = e.target.files;
      if (fileSet) {
        setFile(fileSet[0]);
      }
    },
    []
  );

  const handleGetCategory = useCallback(async () => {
    try {
      const response = await getCategory();
      setCategory(response.data);
    } catch (error) {
      errorRes(error as AxiosError<ErrorResponse>, toast, undefined, {
        isCustom401: true,
        handle401: handleRefreshToken,
      });
    }
  }, [handleRefreshToken, toast]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
        const dataPost = new FormData();
        dataPost.append("categoryId", input.categoryId);
        dataPost.append("title", input.title);
        dataPost.append("body", input.body);
        dataPost.append("tags", input.tags);
        if (file) {
          dataPost.append("file", file);
        }

        await postArticle(dataPost);
        toast({
          status: "success",
          title: "Success Post",
          description: `Success post article ${input.title}`,
        });
        await onSuccess();
        setLoading(false);
        onClose();
      } catch (error) {
        errorRes(error as AxiosError<ErrorResponse>, toast, setLoading, {
          isCustom401: true,
          handle401: handleRefreshToken,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [file, input, handleRefreshToken, toast, onClose]
  );

  useEffect(() => {
    handleGetCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Article</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Text mt={2}>Category</Text>
            <Select
              name="categoryId"
              placeholder="Select category"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            >
              {category.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
            <Text mt={2}>Cover Article</Text>
            <Input name="file" type="file" onChange={handleChangeFile} />
            <Text mt={2}>Title</Text>
            <Input
              name="title"
              type="text"
              placeholder="input title"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <Text mt={2}>Body</Text>
            <Textarea
              name="body"
              placeholder="input body"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <Text mt={2}>Tags</Text>
            <Input
              name="tags"
              type="text"
              placeholder="input tags (ex: sport;bola;ronaldo)"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <Button mt={4} type="submit" isLoading={loading}>
              Post Article
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalAddArticle;
