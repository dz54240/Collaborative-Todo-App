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
import { fetchApi } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await fetchApi("/users", "POST", {
        data: {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        },
      });
      toast({
        title: "Registration successful.",
        description: "You have successfully registered. Please login.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Registration failed.",
        description: "Please try again.",
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
      <form onSubmit={handleRegister}>
        <VStack
          spacing={4}
          p={16}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg">
          <Heading>Register</Heading>
          <Input
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
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
            Register
          </Button>
          <Text>
            Already have an account?{" "}
            <Link color="blue.500" onClick={() => navigate("/")}>
              Login
            </Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;
