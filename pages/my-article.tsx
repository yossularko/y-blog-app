import ListArticle from "@/components/ListArticle";
import ModalAddArticle from "@/components/ModalAddArticle";
import ModalComment from "@/components/ModalComment";
import withAuth from "@/HOC/withAuth";
import { Article, Pagination } from "@/types";
import { ErrorResponse } from "@/types/error";
import { getMyArticle } from "@/utils/fetchApi";
import { myErrorSSR } from "@/utils/myError";
import { Box, Button, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { GetServerSideProps, NextPage } from "next";
import React, { useCallback, useState } from "react";

interface Props {
  myArticles: Pagination<{ data: Article[] }>;
}

const MyArticle: NextPage<Props> = ({ myArticles }) => {
  const [articles, setArticles] = useState(myArticles);

  const { isOpen: isAdd, onClose: closeAdd, onOpen: openAdd } = useDisclosure();
  const {
    isOpen: isComment,
    onClose: closeComment,
    onOpen: openComment,
  } = useDisclosure();

  const handelGetMyArticle = useCallback(async () => {
    try {
      const response = await getMyArticle();
      setArticles(response.data);
    } catch (error) {
      console.log("error get my article: ", error);
    }
  }, []);

  return (
    <>
      <ModalAddArticle
        visible={isAdd}
        onClose={closeAdd}
        onSuccess={handelGetMyArticle}
      />
      <ModalComment visible={isComment} onClose={closeComment} />
      <Box>
        <Text fontSize="3xl">My Articles</Text>
        <HStack>
          <Button onClick={openAdd}>Add Article</Button>
          <Button onClick={openComment}>Test Comment</Button>
        </HStack>
        <ListArticle data={articles.data} />
      </Box>
    </>
  );
};

export default withAuth(MyArticle);

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  try {
    const response = await getMyArticle(req.cookies["jwt_auth"]);

    return {
      props: { myArticles: response.data },
    };
  } catch (error) {
    return myErrorSSR(error as AxiosError<ErrorResponse>);
  }
};
