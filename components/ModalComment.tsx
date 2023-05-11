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
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useCallback, useContext, useState } from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface FilesUpload {
  file: File;
  url: string;
}

const initialInputs = {
  body: "",
  articleSlug: "",
};

const ModalComment = ({ visible, onClose }: Props) => {
  const { handleRefreshToken } = useContext(AuthContext);
  const [input, setInput] = useState(initialInputs);
  const [files, setFiles] = useState<FilesUpload[]>([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

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
        dataPost.append("articleSlug", input.articleSlug);
        if (files.length > 0) {
          files.map((val) => dataPost.append("files", val.file));
        }

        await commentArticle(dataPost);
        toast({
          status: "success",
          title: "Comment Success",
          description: `Comment success ${input.articleSlug}`,
        });
        setLoading(false);
        setInput(initialInputs);
        setFiles([]);
        onClose();
      } catch (error) {
        myError(error as AxiosError<ErrorResponse>, toast, handleRefreshToken);
        setLoading(false);
      }
    },
    [input, files, toast, onClose, handleRefreshToken]
  );
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Comment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Text mt={2}>Slug</Text>
            <Input
              name="articleSlug"
              type="text"
              placeholder="input article slug"
              onChange={handleChange}
            />
            <Text mt={2}>Comment</Text>
            <Input
              name="body"
              type="text"
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
