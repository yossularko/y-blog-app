import { Inter } from "next/font/google";
import {
  Box,
  Button,
  CreateToastFnReturn,
  Flex,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import Image from "next/image";

type Pagination<T = unknown> = T & {
  page: number;
  perpage: number;
  total: number;
  totalPage: number;
};

interface Article {
  id: string;
  slug: string;
  title: string;
  body: string;
  coverImage: string;
  tags: string;
  categoryId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  Category: {
    id: string;
    name: string;
    image: string;
  };
}

interface ErrorResponse {
  statusCode: number;
  message: string[];
  error: string;
}

interface CustomHandle401 {
  isCustom401: boolean;
  handle401: () => void;
}

const inter = Inter({ subsets: ["latin"] });

const imageUrl = "http://192.168.0.102:4000";

const fetchApi = axios.create({ baseURL: "http://192.168.0.102:4000/api" });
const initialToken = { access_token: "", refresh_token: "" };
const initialInput = { email: "", password: "" };

const initialData: Pagination<{ data: Article[] }> = {
  page: 0,
  perpage: 0,
  total: 0,
  totalPage: 0,
  data: [],
};

const errorRes = (
  err: AxiosError<ErrorResponse>,
  toast: CreateToastFnReturn,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
  customHandle401?: CustomHandle401
) => {
  const { isCustom401, handle401 } = customHandle401 || {};

  if (err.response?.data) {
    const { statusCode, message } = err.response.data;

    if (isCustom401 && statusCode === 401 && handle401) {
      handle401();
      if (setLoading) {
        setLoading(false);
      }
      return;
    }

    toast({
      status: "error",
      title: statusCode,
      description: JSON.stringify(message),
    });
    if (setLoading) {
      setLoading(false);
    }
    return;
  }

  toast({
    status: "error",
    title: err.code,
    description: err.message,
  });
  console.log("error: ", err);
  if (setLoading) {
    setLoading(false);
  }
};

export default function Home() {
  const [token, setToken] = useState(initialToken);
  const [input, setInput] = useState(initialInput);
  const [loading, setLoading] = useState(false);

  const [articles, setArticles] = useState(initialData);
  const [loadingArticle, setLoadingArticle] = useState(false);

  const toast = useToast();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleRefreshToken = useCallback(async () => {
    try {
      const dataRefresh = {
        refresh_token: token.refresh_token,
      };
      const response = await fetchApi.post("/auth/refresh-token", dataRefresh, {
        withCredentials: true,
      });

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

  const handleGetArticle = useCallback(async () => {
    setLoadingArticle(true);
    try {
      const response = await fetchApi.get("/articles/my-article", {
        withCredentials: true,
      });

      setArticles(response.data);
      setLoadingArticle(false);
    } catch (error) {
      errorRes(error as AxiosError<ErrorResponse>, toast, setLoadingArticle, {
        isCustom401: true,
        handle401: handleRefreshToken,
      });
    }
  }, [toast, handleRefreshToken]);

  const handleLogin = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchApi.post("/auth/signin", input, {
        withCredentials: true,
      });

      console.log("success login: ", response.data);
      setToken(response.data);
      setLoading(false);
      if (response.status === 201) {
        await handleGetArticle();
      }
    } catch (error) {
      errorRes(error as AxiosError<ErrorResponse>, toast, setLoading);
    }
  }, [input, toast, handleGetArticle]);

  const handleLogout = useCallback(async () => {
    try {
      const dataRefresh = {
        refresh_token: token.refresh_token,
      };
      const response = await fetchApi.patch("/auth/revoke", dataRefresh, {
        withCredentials: true,
      });

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
      <Flex
        direction="column"
        minH="100vh"
        w="420px"
        bg="gray.900"
        alignItems="center"
        justifyContent="center"
        p={6}
      >
        {!token.refresh_token ? (
          <>
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
            <Button isLoading={loading} onClick={handleLogin}>
              Login
            </Button>
          </>
        ) : (
          <Button onClick={handleLogout}>Logout</Button>
        )}
      </Flex>
      <Box flex={1} p={6}>
        <Text fontSize="3xl">Get All Articles</Text>
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
                      src={`${imageUrl}${item.coverImage}`}
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
