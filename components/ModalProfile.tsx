import { User } from "@/types";
import { ErrorResponse } from "@/types/error";
import { appUrl } from "@/utils/constant";
import errorRes from "@/utils/errorRes";
import { updateProfile } from "@/utils/fetchApi";
import {
  Box,
  Button,
  Flex,
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

const baseAvaImage = "https://via.placeholder.com/150";
const baseBgImage =
  "https://cdn.pixabay.com/photo/2023/04/30/15/17/saint-tropez-7960722_960_720.jpg";

const ModalProfile = ({ visible, onClose, data, onSuccess }: Props) => {
  const { name, userEmail, bio, avaImage, bgImage } = data.profile;
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
        setLoading(false);
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
            <Image
              src={`${appUrl}${bgImage}`}
              alt="sampul profile"
              w="full"
              h="220px"
              objectFit="cover"
              fallbackSrc={baseBgImage}
              borderRadius="lg"
            />
            <Flex flexDir="column" alignItems="center" mt={-20} mb={4}>
              <Image
                src={`${appUrl}${avaImage}`}
                alt="sampul profile"
                boxSize="150px"
                objectFit="cover"
                fallbackSrc={baseAvaImage}
                borderRadius="full"
              />
              <Text textAlign="center" fontSize="4xl">
                {name}
              </Text>
              <Text textAlign="center">{userEmail}</Text>
              <Text textAlign="center" fontSize="sm" fontWeight="light">
                {bio}
              </Text>
            </Flex>
            <Box mb={4}>
              <Text>Update Foto Profile</Text>
              <Input name="avaImage" type="file" onChange={handleChangeFile} />
            </Box>
            <Box mb={4}>
              <Text>Update Sampul</Text>
              <Input name="bgImage" type="file" onChange={handleChangeFile} />
            </Box>
            <Button onClick={handleSubmit} isLoading={loading}>
              Update Profile
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalProfile;
