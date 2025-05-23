import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  Flex,
  useDisclosure,
  Divider,
  Grid,
  GridItem,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon, CloseIcon } from "@chakra-ui/icons";
import Navbar from "../components/Navbar";
import InviteModal from "../components/InviteModal";
import { fetchApi, getToken } from "../utils/api";

const Invites = () => {
  const [receivedInvites, setReceivedInvites] = useState([]);
  const [sentInvites, setSentInvites] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userId = localStorage.getItem("userId");
  const toast = useToast();

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    const token = getToken();
    try {
      const response = await fetchApi("/invites", "GET", null, {
        Authorization: `Bearer ${token}`,
      });

      const invites = response.data;
      const included = response.included;
      const users = included.filter((item) => item.type === "user");
      const workspaces = included.filter((item) => item.type === "workspace");

      const getUser = (id) => users.find((user) => user.id === id);
      const getWorkspace = (id) => workspaces.find((ws) => ws.id === id);

      const enhancedInvites = invites.map((invite) => {
        const sender = getUser(invite.relationships.sender.data.id);
        const receiver = getUser(invite.relationships.receiver.data.id);
        const workspace = getWorkspace(invite.relationships.workspace.data.id);

        return {
          ...invite,
          senderEmail: sender ? sender.attributes.email : "Unknown",
          receiverEmail: receiver ? receiver.attributes.email : "Unknown",
          workspaceName: workspace ? workspace.attributes.name : "Unknown",
        };
      });

      setReceivedInvites(
        enhancedInvites.filter(
          (invite) => invite.attributes.receiver_id == userId
        )
      );
      setSentInvites(
        enhancedInvites.filter(
          (invite) => invite.attributes.sender_id == userId
        )
      );
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  };

  const handleDeleteInvite = async (id) => {
    const token = getToken();
    try {
      await fetchApi(`/invites/${id}`, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      toast({
        title: "Invite deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      fetchInvites();
    } catch (error) {
      toast({
        title: "Error deleting invite.",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleAcceptInvite = async (id) => {
    const token = getToken();
    try {
      await fetchApi(`/invites/${id}/accept`, "PATCH", null, {
        Authorization: `Bearer ${token}`,
      });
      toast({
        title: "Invite accepted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      fetchInvites();
    } catch (error) {
      toast({
        title: "Error accepting invite.",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleRejectInvite = async (id) => {
    const token = getToken();
    try {
      await fetchApi(`/invites/${id}/reject`, "PATCH", null, {
        Authorization: `Bearer ${token}`,
      });
      toast({
        title: "Invite rejected successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      fetchInvites();
    } catch (error) {
      toast({
        title: "Error rejecting invite.",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircleIcon color="green.500" />;
      case "rejected":
        return <CloseIcon color="red.500" />;
      case "pending":
        return <WarningIcon color="yellow.500" />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Navbar activeTab="invites" setActiveTab={() => {}} />
      <Box p={8} width="100%" mx="auto">
        <Heading textAlign="center" mb={4}>
          Invites
        </Heading>
        <Button
          onClick={onOpen}
          colorScheme="blue"
          mb={4}
          mx="auto"
          display="block">
          Create Invite
        </Button>

        <Grid templateColumns="repeat(2, 1fr)" gap={5}>
          {/* Received Invites */}
          <GridItem>
            <Heading size="md" textAlign="center">
              Received Invites
            </Heading>
            <VStack spacing={3} mt={4}>
              {receivedInvites.length > 0 ? (
                receivedInvites.map((invite) => (
                  <Flex
                    key={invite.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    width="100%"
                    align="center">
                    <Flex align="center" gap={2} flex="1">
                      {getStatusIcon(invite.attributes.status)}
                      <Text>
                        <strong>From:</strong> {invite.senderEmail}
                      </Text>
                      <Text>
                        <strong>Workspace:</strong> {invite.workspaceName}
                      </Text>
                    </Flex>
                    {invite.attributes.status === "pending" && (
                      <Flex gap={2}>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleAcceptInvite(invite.id)}>
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleRejectInvite(invite.id)}>
                          Reject
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                ))
              ) : (
                <Text>No received invites.</Text>
              )}
            </VStack>
          </GridItem>

          {/* Sent Invites */}
          <GridItem>
            <Heading size="md" textAlign="center">
              Sent Invites
            </Heading>
            <VStack spacing={3} mt={4}>
              {sentInvites.length > 0 ? (
                sentInvites.map((invite) => (
                  <Flex
                    key={invite.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    width="100%"
                    align="center">
                    <Flex align="center" gap={2} flex="1">
                      {getStatusIcon(invite.attributes.status)}
                      <Text>
                        <strong>To:</strong> {invite.receiverEmail}
                      </Text>
                      <Text>
                        <strong>Workspace:</strong> {invite.workspaceName}
                      </Text>
                    </Flex>
                    {invite.attributes.status === "pending" && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteInvite(invite.id)}>
                        Delete
                      </Button>
                    )}
                  </Flex>
                ))
              ) : (
                <Text>No sent invites.</Text>
              )}
            </VStack>
          </GridItem>
        </Grid>
      </Box>
      <InviteModal
        isOpen={isOpen}
        onClose={onClose}
        onInviteCreated={fetchInvites}
      />
    </Box>
  );
};

export default Invites;
