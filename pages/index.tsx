import { Box, Text } from "@chakra-ui/react";
import { Article, Pagination } from "@/types";
import { getArticle } from "@/utils/fetchApi";
import ListArticle from "@/components/ListArticle";
import { GetServerSideProps, NextPage } from "next";
import { myErrorSSR } from "@/utils/myError";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/error";

interface Props {
  articles: Pagination<{ data: Article[] }>;
}

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
    return myErrorSSR(error as AxiosError<ErrorResponse>);
  }
};
