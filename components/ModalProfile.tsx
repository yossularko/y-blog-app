import { User } from "@/types";
import { ErrorResponse } from "@/types/error";
import errorRes from "@/utils/errorRes";
import { updateProfile } from "@/utils/fetchApi";
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
  Text,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useCallback, useState } from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
  data: User;
  onSuccess: () => Promise<void>;
}

interface FileUpload {
  avaImage: File | null;
  bgImage: File | null;
}

const ModalProfile = ({ visible, onClose, data, onSuccess }: Props) => {
  const [files, setFiles] = useState<FileUpload>({
    avaImage: null,
    bgImage: null,
  });
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleChangeFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name;
      const fileSet = e.target.files;
      if (fileSet) {
        setFiles((prev) => ({ ...prev, [name]: fileSet[0] }));
      }
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      if (!files.avaImage && !files.bgImage) {
        toast({
          status: "error",
          title: "Update Failed",
          description: "Upload salah satu file!",
        });
        return;
      }

      const dataPost = new FormData();
      if (files.avaImage) {
        dataPost.append("avaImage", files.avaImage);
      }
      if (files.bgImage) {
        dataPost.append("bgImage", files.bgImage);
      }

      const response = await updateProfile(data.id, dataPost);
      if (response.status === 200) {
        toast({
          status: "success",
          title: "Update Profile",
          description: "Success Update Profile",
        });
        await onSuccess();
        onClose();
      }
      setLoading(false);
      console.log("res: ", response.data);
    } catch (error) {
      errorRes(error as AxiosError<ErrorResponse>, toast, setLoading);
    }
  }, [files, toast, data.id, onSuccess, onClose]);

  return (
    <Modal isOpen={visible} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>User Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Box mb={4}>
              <pre>
                <code>{JSON.stringify(data, null, 2)}</code>
              </pre>
            </Box>
            <Box mb={4}>
              <Text>Upload Foto Profile</Text>
              <Input name="avaImage" type="file" onChange={handleChangeFile} />
            </Box>
            <Box mb={4}>
              <Text>Upload Sampul</Text>
              <Input name="bgImage" type="file" onChange={handleChangeFile} />
            </Box>
            <Button onClick={handleSubmit}>Update Profile</Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalProfile;
