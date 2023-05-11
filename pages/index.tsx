import { Box, Text } from "@chakra-ui/react";
import { Article, Pagination } from "@/types";
import { getArticle } from "@/utils/fetchApi";
import ListArticle from "@/components/ListArticle";
import { GetServerSideProps, NextPage } from "next";

interface Props {
  articles: Pagination<{ data: Article[] }>;
}

const initialData: Pagination<{ data: Article[] }> = {
  page: 0,
  perpage: 0,
  total: 0,
  totalPage: 0,
  data: [],
};

const Home: NextPage<Props> = ({ articles }) => {
  return (
    <Box>
      <Text fontSize="3xl">All Articles</Text>
      <ListArticle data={articles.data} />
    </Box>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const response = await getArticle();

    return {
      props: { articles: response.data },
    };
  } catch (error) {
    console.log("error get all article: ", error);
    return {
      props: { articles: initialData },
    };
  }
};
