import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Article, Pagination } from "@/types";
import { getArticle } from "@/utils/fetchApi";
import ListArticle from "@/components/ListArticle";

const initialData: Pagination<{ data: Article[] }> = {
  page: 0,
  perpage: 0,
  total: 0,
  totalPage: 0,
  data: [],
};

export default function Home() {
  const [articles, setArticles] = useState(initialData);

  useEffect(() => {
    const getAllArticle = async () => {
      try {
        const response = await getArticle();
        setArticles(response.data);
      } catch (error) {
        console.log("error get all article: ", error);
      }
    };

    getAllArticle();
  }, []);

  return (
    <Box>
      <Text fontSize="3xl">All Articles</Text>
      <ListArticle data={articles.data} />
    </Box>
  );
}
