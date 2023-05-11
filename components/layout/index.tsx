import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
  isCustomLayout?: boolean;
}

const Layout = ({ children, isCustomLayout }: Props) => {
  return isCustomLayout ? (
    <Box>{children}</Box>
  ) : (
    <Flex>
      <Sidebar />
      <Box flex={1} p={6}>
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
