import ListArticle from "@/components/ListArticle";
import ModalAddArticle from "@/components/ModalAddArticle";
import withAuth from "@/HOC/withAuth";
import { Article, Pagination } from "@/types";
import { ErrorResponse } from "@/types/error";
import { getMyArticle } from "@/utils/fetchApi";
import { myErrorSSR } from "@/utils/myError";
import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { GetServerSideProps, NextPage } from "next";
import React, { useCallback, useState } from "react";

interface Props {
  myArticles: Pagination<{ data: Article[] }>;
}

const MyArticle: NextPage<Props> = ({ myArticles }) => {
  const [articles, setArticles] = useState(myArticles);

  const { isOpen, onClose, onOpen } = useDisclosure();

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
        visible={isOpen}
        onClose={onClose}
        onSuccess={handelGetMyArticle}
      />
      <Box>
        <Text fontSize="3xl">My Articles</Text>
        <Button onClick={onOpen}>Add Article</Button>
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
