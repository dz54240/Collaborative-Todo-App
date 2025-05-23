import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  useDisclosure,
  Avatar,
  Divider,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { EmailIcon, EditIcon, InfoIcon } from "@chakra-ui/icons";
import Navbar from "../components/Navbar";
import ProfileModal from "../components/ProfileModal";
import { fetchApi, getToken } from "../utils/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = getToken();
    try {
      const response = await fetchApi(`/users/${userId}`, "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSaveProfile = async (firstName, lastName, email) => {
    const token = getToken();
    try {
      await fetchApi(
        `/users/${userId}`,
        "PATCH",
        {
          data: {
            first_name: firstName,
            last_name: lastName,
            email,
          },
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      fetchUser();
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Box>
      <Navbar activeTab="profile" setActiveTab={() => {}} />
      <Box p={8} maxWidth="500px" mx="auto">
        <Box
          bg="white"
          p={6}
          rounded="md"
          boxShadow="lg"
          textAlign="center"
          border="1px solid"
          borderColor="gray.200">
          <Avatar
            size="xl"
            background="lightblue"
            name={
              user
                ? `${user.attributes.first_name} ${user.attributes.last_name}`
                : ""
            }
            mb={4}
          />
          <Heading size="lg" mb={2}>
            Profile
          </Heading>
          <Divider my={4} />

          {user ? (
            <VStack spacing={3} align="stretch">
              <Flex align="center" gap={2}>
                <Icon as={InfoIcon} color="blue.500" />
                <Text fontSize="lg">
                  <strong>First Name:</strong> {user.attributes.first_name}
                </Text>
              </Flex>

              <Flex align="center" gap={2}>
                <Icon as={InfoIcon} color="blue.500" />
                <Text fontSize="lg">
                  <strong>Last Name:</strong> {user.attributes.last_name}
                </Text>
              </Flex>

              <Flex align="center" gap={2}>
                <Icon as={EmailIcon} color="blue.500" />
                <Text fontSize="lg">
                  <strong>Email:</strong> {user.attributes.email}
                </Text>
              </Flex>

              <Divider my={4} />
              <Button
                onClick={onOpen}
                colorScheme="blue"
                leftIcon={<EditIcon />}
                size="lg"
                mt={2}>
                Edit Profile
              </Button>
            </VStack>
          ) : (
            <Text>Loading...</Text>
          )}
        </Box>
      </Box>

      <ProfileModal
        isOpen={isOpen}
        onClose={onClose}
        user={user}
        onSave={handleSaveProfile}
      />
    </Box>
  );
};

export default Profile;
