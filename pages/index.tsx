import { Inter } from "next/font/google";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  useToast,
  Image as ChakraImage,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { AxiosError } from "axios";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { Article, Pagination } from "@/types";
import {
  getMyArticle,
  getProfile,
  login,
  refreshToken,
  revokeToken,
} from "@/utils/fetchApi";
import errorRes from "@/utils/errorRes";
import { ErrorResponse } from "@/types/error";
import { appUrl, initialToken, initialUser } from "@/utils/constant";
import ModalProfile from "@/components/ModalProfile";

const inter = Inter({ subsets: ["latin"] });

const initialInput = { email: "", password: "" };
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
  const [input, setInput] = useState(initialInput);
  const [loading, setLoading] = useState(false);

  const [articles, setArticles] = useState(initialData);

  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

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

  const handleLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await login(input);

        console.log("success login: ", response.data);
        setLoading(false);
        if (response.status === 201) {
          setToken(response.data.token);
          setUser(response.data.user);
          await handleGetMyArticle();
        }
      } catch (error) {
        errorRes(error as AxiosError<ErrorResponse>, toast, setLoading);
      }
    },
    [input, toast, handleGetMyArticle]
  );

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
        setInput(initialInput);
        setArticles(initialData);
      }
    } catch (error) {
      errorRes(error as AxiosError<ErrorResponse>, toast);
    }
  }, [toast, token]);

  return (
    <Flex className={inter.className}>
      <ModalProfile visible={isOpen} onClose={onClose} data={user} />
      <Flex direction="column" minH="100vh" w="380px" bg="gray.900" p={6}>
        {!token.refresh_token ? (
          <Box>
            <Text fontSize="2xl" mb={4}>
              Sign In to continue
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
        ) : (
          <Box>
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
            <Box mt={4}>
              <Button onClick={handleGetProfile}>Refresh Profile</Button>
            </Box>
          </Box>
        )}
      </Flex>
      <Box flex={1} p={6}>
        <Text fontSize="3xl">My Articles</Text>
        <HStack>
          <Button onClick={handleGetMyArticle}>Refresh</Button>
          <Button>Add Article</Button>
        </HStack>
        {!token.refresh_token ? null : (
          <Box mt={4}>
            {articles.data.map((item) => {
              return (
                <Flex
                  key={item.slug}
                  mb={2}
                  bg="gray.700"
                  p={4}
                  borderRadius="2xl"
                >
                  <Box
                    w="200px"
                    h="160px"
                    mr={4}
                    position="relative"
                    borderRadius="xl"
                    overflow="hidden"
                  >
                    <Image
                      src={`${appUrl}${item.coverImage}`}
                      alt="cover article"
                      fill
                      sizes="80vw"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                  <Flex
                    flexDir="column"
                    flex={1}
                    justifyContent="space-between"
                  >
                    <Box>
                      <Text fontSize="xl" fontWeight="bold">
                        {item.title}
                      </Text>
                      <Text fontWeight="light" noOfLines={3}>
                        {item.body}
                      </Text>
                    </Box>
                    <Flex alignItems="flex-end">
                      <Box flex={1}>
                        <Text fontSize="xs">
                          Category: {item.Category.name}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                      </Box>
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
          </Box>
        )}
      </Box>
    </Flex>
  );
}
