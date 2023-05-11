import ListArticle from "@/components/ListArticle";
import ModalAddArticle from "@/components/ModalAddArticle";
import ModalComment from "@/components/ModalComment";
import withAuth from "@/HOC/withAuth";
import { Article, Pagination } from "@/types";
import { getMyArticle } from "@/utils/fetchApi";
import { Box, Button, HStack, Text, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const initialData: Pagination<{ data: Article[] }> = {
  page: 0,
  perpage: 0,
  total: 0,
  totalPage: 0,
  data: [],
};

const MyArticle = () => {
  const [isUpdate, setIsUpdate] = useState(1);

  const [articles, setArticles] = useState(initialData);

  const { isOpen: isAdd, onClose: closeAdd, onOpen: openAdd } = useDisclosure();
  const {
    isOpen: isComment,
    onClose: closeComment,
    onOpen: openComment,
  } = useDisclosure();

  useEffect(() => {
    const getAllArticle = async () => {
      try {
        const response = await getMyArticle();
        setArticles(response.data);
      } catch (error) {
        console.log("error get all article: ", error);
      }
    };

    if (isUpdate) {
      getAllArticle();
    }
  }, [isUpdate]);
  return (
    <>
      <ModalAddArticle
        visible={isAdd}
        onClose={closeAdd}
        onSuccess={() => {
          setIsUpdate(Date.now());
        }}
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
