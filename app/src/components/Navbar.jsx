import { Box, Button, Flex, Link, Spacer, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { fetchApi, getToken } from "../utils/api";

const Navbar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      const token = getToken();
      if (token) {
        await fetchApi("/sessions", "DELETE", null, {
          Authorization: `Bearer ${token}`,
        });
      }

      localStorage.removeItem("token");

      toast({
        title: "Logged out successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Failed to log out.",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Flex bg="gray.100" p={4} alignItems="center">
      <Flex gap={4}>
        <Button
          onClick={() => navigate("/profile")}
          colorScheme={activeTab === "profile" ? "blue" : "gray"}>
          Profile
        </Button>
        <Button
          onClick={() => navigate("/home")}
          colorScheme={activeTab === "workspaces" ? "blue" : "gray"}>
          Workspaces
        </Button>
        <Button
          onClick={() => navigate("/invites")}
          colorScheme={activeTab === "invites" ? "blue" : "gray"}>
          Invites
        </Button>
      </Flex>
      <Spacer />
      <Button onClick={handleLogout} colorScheme="red">
        Logout
      </Button>
    </Flex>
  );
};

export default Navbar;
