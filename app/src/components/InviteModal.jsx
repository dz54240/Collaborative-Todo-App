import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { fetchApi, getToken } from "../utils/api";

const InviteModal = ({ isOpen, onClose, onInviteCreated }) => {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    const token = getToken();
    try {
      const response = await fetchApi("/workspaces", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setWorkspaces(response.data);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  const handleCreateInvite = async () => {
    const token = getToken();
    if (!receiverEmail || !selectedWorkspace) {
      toast({
        title: "Missing fields.",
        description: "Please fill in all fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetchApi(
        "/invites",
        "POST",
        {
          data: {
            receiver_email: receiverEmail,
            workspace_id: selectedWorkspace,
          },
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      onInviteCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating invite:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Invite</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Receiver Email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            mb={4}
          />
          <Select
            placeholder="Select Workspace"
            onChange={(e) => setSelectedWorkspace(e.target.value)}>
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.attributes.name}
              </option>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" ml={3} onClick={handleCreateInvite}>
            Create Invite
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InviteModal;
