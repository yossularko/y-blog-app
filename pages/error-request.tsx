import Link from "next/link";
import {
  Button,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import withAuth from "../HOC/withAuth";
import { useRouter } from "next/router";
import { AuthContext } from "@/store/AuthContext";
import { useContext } from "react";

interface DataQuery {
  error?: string;
  message?: string;
}

const ErrorRequest = () => {
  const { signOut } = useContext(AuthContext);
  const textColor = useColorModeValue("gray.700", "white");
  const { query } = useRouter();
  const { error, message } = (query as DataQuery) || {};

  return (
    <Flex w="full" minH="90vh" flexDir="column" justifyContent="center">
      <Flex py={10} px={6} alignItems="center" flexDir="column">
        <Text fontSize="48px" fontWeight="bold" color={textColor} mb={2}>
          {error}
        </Text>
        <Text color={"gray.500"} mb={6}>
          {message}
        </Text>
        <HStack>
          <Button as={Link} href="/">
            Dashboard
          </Button>
          <Button onClick={signOut}>Logout</Button>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default withAuth(ErrorRequest);
