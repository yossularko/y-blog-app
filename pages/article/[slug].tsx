import ModalComment from "@/components/ModalComment";
import { ArticleDetails, Slug } from "@/types";
import { ErrorResponse } from "@/types/error";
import { getArticleDetails, getArticleSlugs } from "@/utils/fetchApi";
import { myErrorSSR } from "@/utils/myError";
import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import { AxiosError, AxiosResponse } from "axios";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import React from "react";

interface Props {
  articleDetails: ArticleDetails;
}

interface IParams extends ParsedUrlQuery {
  slug: string;
}

const DetailsArticle: NextPage<Props> = ({ articleDetails }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <ModalComment visible={isOpen} onClose={onClose} />
      <Box>
        <Text>DetailsArticle</Text>
        <Button onClick={onOpen}>Test Comment</Button>
        <Text>{articleDetails.title}</Text>
      </Box>
    </>
  );
};

export default DetailsArticle;

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = (await getArticleSlugs()) as AxiosResponse<Slug[]>;

    const slugs: string[] = response.data.map((slug) => slug.slug);

    const paths = slugs.map((item) => ({
      params: {
        slug: item,
      },
    }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch (err) {
    console.log("error get paths: ", err);

    return {
      paths: [{ params: { slug: "no-slug" } }],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
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
