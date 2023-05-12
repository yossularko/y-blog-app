import ModalComment from "@/components/ModalComment";
import { AuthContext } from "@/store/AuthContext";
import { ArticleDetails } from "@/types";
import { ErrorResponse } from "@/types/error";
import { appUrl } from "@/utils/constant";
import { getArticleDetails } from "@/utils/fetchApi";
import { myError, myErrorSSR } from "@/utils/myError";
import { myToast } from "@/utils/myToast";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useToast,
  Image as ChakraImage,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { ParsedUrlQuery } from "querystring";
import React, { useCallback, useContext, useState } from "react";

interface Props {
  articleDetails: ArticleDetails;
}

interface IParams extends ParsedUrlQuery {
  slug: string;
}

const DetailsArticle: NextPage<Props> = ({ articleDetails }) => {
  const [details, setDetails] = useState(articleDetails);
  const {
    slug,
    title,
    body,
    coverImage,
    tags,
    createdAt,
    Author,
    Category,
    comments,
  } = details;
  const {
    userData: { token },
    handleRefreshToken,
  } = useContext(AuthContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  const handleGetDetails = useCallback(async () => {
    try {
      const response = await getArticleDetails(slug);
      setDetails(response.data);
    } catch (error) {
      myError(error as AxiosError<ErrorResponse>, toast, handleRefreshToken);
    }
  }, [handleRefreshToken, slug, toast]);

  const handleComment = useCallback(() => {
    if (!token.refresh_token) {
      myToast.error(toast, "Silahkan login terlebih dahulu");
      return;
    }
    onOpen();
  }, [token.refresh_token, toast, onOpen]);

  return (
    <>
      <ModalComment
        articleSlug={slug}
        visible={isOpen}
        onClose={onClose}
        onSuccess={handleGetDetails}
      />
      <Box
        position="relative"
        w="full"
        h="300px"
        borderRadius="xl"
        overflow="hidden"
      >
        <Image
          src={`${appUrl}${coverImage}`}
          alt="cover article"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Box mt={4}>
        <Text fontWeight="light">{new Date(createdAt).toDateString()}</Text>
        <Text fontSize="3xl">{title}</Text>
        <HStack spacing={8}>
          <HStack>
            <Avatar
              name={Author.profile.name}
              src={`${appUrl}${Author.profile.avaImage}`}
              size="sm"
            />
            <Box>
              <Text fontSize="sm">{Author.profile.name}</Text>
              <Text fontSize="xs" fontWeight="light">
                {Author.profile.userEmail}
              </Text>
            </Box>
          </HStack>
          <Box>
            <Text fontSize="xs" fontWeight="light">
              Category:
            </Text>
            <Text fontSize="sm">{Category.name}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" fontWeight="light">
              Tags:
            </Text>
            <Text fontSize="sm">{tags.split(";").join(", ")}</Text>
          </Box>
        </HStack>
        <Box mt={6}>
          <Text>{body}</Text>
        </Box>
        <Box mt={6}>
          <Text fontSize="xl">Comment</Text>
          <Stack mt={1}>
            {comments.map((comment) => {
              return (
                <Stack
                  key={comment.id}
                  direction="row"
                  bg="gray.700"
                  p={2}
                  borderRadius="lg"
                >
                  <Avatar
                    name={comment.User.profile.name}
                    src={`${appUrl}${comment.User.profile.avaImage}`}
                    size="sm"
                  />
                  <Box>
                    <Text fontSize="lg" fontWeight="medium">
                      {comment.User.profile.name}
                    </Text>
                    <HStack>
                      {comment.images.map((img) => {
                        return (
                          <ChakraImage
                            key={img}
                            src={`${appUrl}${img}`}
                            w="80px"
                            h="60px"
                            borderRadius="lg"
                            objectFit="cover"
                          />
                        );
                      })}
                    </HStack>
                    <Text>{comment.body}</Text>
                    <Text fontSize="xs" fontWeight="light" mt={1}>
                      {new Date(comment.createdAt).toDateString()}
                    </Text>
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </Box>
        <Button mt={2} onClick={handleComment}>
          Comment
        </Button>
      </Box>
    </>
  );
};

export default DetailsArticle;

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const { slug } = params as IParams;
  try {
    const response = await getArticleDetails(slug);

    return {
      props: {
        articleDetails: response.data,
      },
    };
  } catch (err) {
    return myErrorSSR<any>(err as AxiosError<ErrorResponse>);
  }
};
