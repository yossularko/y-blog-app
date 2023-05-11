import { Flex, Text, useColorModeValue, useToast } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { AuthContext } from "../store/AuthContext";

type MyComponent = NextPage<any>;

const withAuth = (WrappedComponent: MyComponent, protectedPage?: number[]) => {
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    const {
      userData: { user, token },
      isLoading,
    } = useContext(AuthContext);
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
      if (!isLoading && !token.refresh_token) {
        toast({
          status: "warning",
          title: "No Auth",
          description: "You're not logged in",
        });
        router.replace("/");
      } else if (!isLoading && protectedPage?.indexOf(user.role) === -1) {
        router.replace("/need-permission");
      }
    }, [token, isLoading, user, router, toast]);

    if (isLoading) {
      return (
        <Flex
          alignItems="center"
          justifyContent="center"
          p="4"
          minH="100vh"
          bg={useColorModeValue("gray.50", "blackAlpha.700")}
        >
          <Text>Loading..</Text>
        </Flex>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
