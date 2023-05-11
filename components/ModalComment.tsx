import { AuthContext } from "@/store/AuthContext";
import { ErrorResponse } from "@/types/error";
import { commentArticle } from "@/utils/fetchApi";
import { myError } from "@/utils/myError";
import {
  Button,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useCallback, useContext, useState } from "react";

interface Props {
  articleSlug: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

interface FilesUpload {
  file: File;
  url: string;
}

const initialInputs = {
  body: "",
};

const ModalComment = ({ articleSlug, visible, onClose, onSuccess }: Props) => {
  const { handleRefreshToken } = useContext(AuthContext);
  const [input, setInput] = useState(initialInputs);
  const [files, setFiles] = useState<FilesUpload[]>([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleChangeFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileSet = e.target.files;
      if (fileSet) {
        if (fileSet[0]) {
          setFiles((prev) => [
            ...prev,
            { file: fileSet[0], url: URL.createObjectURL(fileSet[0]) },
          ]);
        }
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
        const dataPost = new FormData();
        dataPost.append("body", input.body);
        dataPost.append("articleSlug", articleSlug);
        if (files.length > 0) {
          files.map((val) => dataPost.append("files", val.file));
        }

        await commentArticle(dataPost);
        await onSuccess();
        setLoading(false);
        setInput(initialInputs);
        setFiles([]);
        onClose();
      } catch (error) {
        myError(error as AxiosError<ErrorResponse>, toast, handleRefreshToken);
        setLoading(false);
      }
    },
    [articleSlug, input, files, toast, onClose, handleRefreshToken, onSuccess]
  );
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Comment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Text mt={2}>Slug: {articleSlug}</Text>
            <Text mt={2}>Comment</Text>
            <Textarea
              name="body"
              placeholder="input comment"
              onChange={handleChange}
            />
            <Text mt={2}>Upload Image</Text>
            <Input type="file" onChange={handleChangeFile} />
            <HStack mt={1}>
              {files.map((item) => (
                <Image
                  key={item.url}
                  src={item.url}
                  alt="files upload"
                  objectFit="cover"
                  boxSize="50px"
                />
              ))}
            </HStack>
            <Button mt={4} type="submit" isLoading={loading}>
              Post Comment
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalComment;
