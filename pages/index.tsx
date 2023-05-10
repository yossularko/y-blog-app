import { Inter } from "next/font/google";
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useToast,
  Image as ChakraImage,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { FiLogOut } from "react-icons/fi";
import { Article, Pagination } from "@/types";
import {
  getArticle,
  getMyArticle,
  getProfile,
  refreshToken,
  revokeToken,
} from "@/utils/fetchApi";
import errorRes from "@/utils/errorRes";
import { ErrorResponse } from "@/types/error";
import { appUrl, initialToken, initialUser } from "@/utils/constant";
import ModalProfile from "@/components/ModalProfile";
import ModalAddArticle from "@/components/ModalAddArticle";
import ListArticle from "@/components/ListArticle";
import Login from "@/components/Login";

const inter = Inter({ subsets: ["latin"] });

const initialData: Pagination<{ data: Article[] }> = {
  page: 0,
  perpage: 0,
  total: 0,
  totalPage: 0,
  data: [],
};

export default function Home() {
  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);

  const [articles, setArticles] = useState(initialData);

  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isOpen: isAdd, onClose: closeAdd, onOpen: openAdd } = useDisclosure();

  const handleRefreshToken = useCallback(async () => {
    try {
      const dataRefresh = {
        refresh_token: token.refresh_token,
      };
      const response = await refreshToken(dataRefresh);

      if (response.status === 201) {
        toast({
          status: "info",
          title: "Refresh",
          description: "Please try again",
        });
      }
    } catch (error) {
      errorRes(error as AxiosError<ErrorResponse>, toast);
    }
  }, [toast, token.refresh_token]);

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
      setUser(response.data);
    } catch (error) {
      errorRes(error as AxiosError<ErrorResponse>, toast, undefined, {
        isCustom401: true,
        handle401: handleRefreshToken,
      });
    }
  }, [handleRefreshToken, user.id, toast]);

  const handleGetMyArticle = useCallback(async () => {
    try {
      const response = await getMyArticle();

      setArticles(response.data);
    } catch (error) {
      errorRes(error as AxiosError<ErrorResponse>, toast, undefined, {
        isCustom401: true,
        handle401: handleRefreshToken,
      });
    }
  }, [toast, handleRefreshToken]);

  const handleLogout = useCallback(async () => {
    try {
      const dataRevoke = {
        refresh_token: token.refresh_token,
      };
      const response = await revokeToken(dataRevoke);

      if (response.status === 200) {
        toast({
          status: "success",
          title: "Revoke",
          description: "Success Logout",
        });
        setToken(initialToken);
      }
    } catch (error) {
      errorRes(error as AxiosError<ErrorResponse>, toast);
    }
  }, [toast, token]);

  useEffect(() => {
    const getAllArticle = async () => {
      try {
        const response = await getArticle();
        setArticles(response.data);
      } catch (error) {
        console.log("error get all article: ", error);
      }
    };

    if (!token.refresh_token) {
      getAllArticle();
    }
  }, [token.refresh_token]);

  return (
    <Flex className={inter.className}>
      <ModalProfile
        visible={isOpen}
        onClose={onClose}
        data={user}
        onSuccess={handleGetProfile}
      />
      <ModalAddArticle
        visible={isAdd}
        onClose={closeAdd}
        onSuccess={handleGetMyArticle}
        handleRefreshToken={handleRefreshToken}
      />
      <Flex direction="column" minH="100vh" w="380px" bg="gray.900" p={6}>
        {!token.refresh_token ? (
          <Login
            onSuccess={async (res) => {
              setToken(res.token);
              setUser(res.user);
              await handleGetMyArticle();
            }}
          />
        ) : (
          <HStack justifyContent="space-between">
            <HStack>
              <ChakraImage
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
              onClick={handleLogout}
            />
          </HStack>
        )}
      </Flex>
      <Box flex={1} p={6}>
        {!token.refresh_token ? (
          <Text fontSize="3xl">All Articles</Text>
        ) : (
          <>
            <Text fontSize="3xl">My Articles</Text>
            <Button onClick={openAdd}>Add Article</Button>
          </>
        )}
        <ListArticle data={articles.data} />
      </Box>
    </Flex>
  );
}
