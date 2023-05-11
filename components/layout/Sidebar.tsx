import { AuthContext } from "@/store/AuthContext";
import { ErrorResponse } from "@/types/error";
import { appUrl } from "@/utils/constant";
import errorRes from "@/utils/errorRes";
import { getProfile } from "@/utils/fetchApi";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useCallback, useContext } from "react";
import { FiLogOut } from "react-icons/fi";
import Login from "../Login";
import ModalProfile from "../ModalProfile";
import ListMenu from "./ListMenu";

const Sidebar = () => {
  const {
    userData: { token, user },
    signIn,
    signOut,
    setUpdateProfile,
    handleRefreshToken,
  } = useContext(AuthContext);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleGetProfile = useCallback(async () => {
    if (!user.id) {
      toast({
        status: "error",
        title: "Not Found",
        description: "Cannot find user",
      });
      return;
    }

    try {
      const response = await getProfile(user.id);
      setUpdateProfile(response.data);
    } catch (error) {
      errorRes(error as AxiosError<ErrorResponse>, toast, undefined, {
        isCustom401: true,
        handle401: handleRefreshToken,
      });
    }
  }, [handleRefreshToken, setUpdateProfile, user.id, toast]);

  return (
    <>
      <ModalProfile
        visible={isOpen}
        onClose={onClose}
        onSuccess={handleGetProfile}
      />
      <Flex direction="column" minH="100vh" w="380px" bg="gray.900" p={6}>
        {!token.refresh_token ? (
          <Login onSuccess={(res) => signIn(res)} />
        ) : (
          <Box>
            <HStack justifyContent="space-between">
              <HStack>
                <Image
                  src={`${appUrl}${user.profile.avaImage}`}
                  alt="avatar"
                  boxSize="50px"
                  objectFit="cover"
                  borderRadius="full"
                  fallbackSrc="https://via.placeholder.com/50"
                  onClick={onOpen}
                  cursor="pointer"
                />
                <Box>
                  <Text fontSize="sm">Welcome</Text>
                  <Text fontSize="lg">{user.profile.name}</Text>
                </Box>
              </HStack>
              <IconButton
                aria-label="logout"
                icon={<FiLogOut />}
                size="sm"
                onClick={signOut}
              />
            </HStack>
            <ListMenu />
          </Box>
        )}
      </Flex>
    </>
  );
};

export default Sidebar;
