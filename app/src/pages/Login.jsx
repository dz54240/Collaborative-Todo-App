import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  Text,
  VStack,
  Link,
  useToast,
} from "@chakra-ui/react";
import { fetchApi, saveToken } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchApi("/sessions", "POST", {
        data: { email, password },
      });
      const { token, user } = response.data;
      saveToken(token);
      localStorage.setItem("userId", user.id);

      toast({
        title: "Login successful.",
        description: "You have successfully logged in.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });

      navigate("/home");
    } catch (error) {
      toast({
        title: "Login failed.",
        description: "Please check your credentials.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh">
      <form onSubmit={handleLogin}>
        <VStack
          spacing={4}
          p={16}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg">
          <Heading>Login</Heading>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" colorScheme="blue" width="100%">
            Login
          </Button>
          <Text>
            Don't have an account?{" "}
            <Link color="blue.500" onClick={() => navigate("/register")}>
              Register
            </Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
