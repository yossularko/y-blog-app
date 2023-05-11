import { Article } from "@/types";
import { appUrl } from "@/utils/constant";
import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

interface Props {
  data: Article[];
}

const ListArticle = ({ data }: Props) => {
  return (
    <Box mt={4}>
      {data.map((item) => {
        return (
          <Flex key={item.slug} mb={2} bg="gray.700" p={4} borderRadius="2xl">
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
            <Flex flexDir="column" flex={1} justifyContent="space-between">
              <Box>
                <Text fontSize="xl" fontWeight="bold" noOfLines={1}>
                  {item.title}
                </Text>
                <Text fontWeight="light" noOfLines={3}>
                  {item.body}
                </Text>
              </Box>
              <Flex alignItems="flex-end">
                <Box flex={1}>
                  <Text fontSize="xs">Category: {item.Category.name}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm">
                    {new Date(item.createdAt).toDateString()}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        );
      })}
    </Box>
  );
};

export default ListArticle;
