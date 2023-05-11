import { Box, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const data = [
  {
    path: "/",
    name: "All Article",
  },
  {
    path: "/my-article",
    name: "My Article",
  },
];

const ListMenu = () => {
  const { pathname } = useRouter();
  return (
    <Stack mt={10}>
      {data.map((item) => {
        return (
          <Link key={item.path} href={item.path}>
            <Box
              p={2}
              borderRadius="lg"
              bg={pathname === item.path ? "cyan.600" : "inherit"}
              _hover={{ bg: "cyan.400" }}
            >
              <Text>{item.name}</Text>
            </Box>
          </Link>
        );
      })}
    </Stack>
  );
};

export default ListMenu;
