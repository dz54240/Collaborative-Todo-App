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
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const WorkspaceModal = ({ isOpen, onClose, onSave, editingWorkspace }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingWorkspace) {
      setName(editingWorkspace.attributes.name);
      setDescription(editingWorkspace.attributes.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [editingWorkspace]);

  const handleSave = () => {
    onSave(name, description);
    setName("");
    setDescription("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editingWorkspace ? "Edit Workspace" : "Add Workspace"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            mb={4}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" onClick={handleSave} ml={3}>
            {editingWorkspace ? "Save Changes" : "Add Workspace"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WorkspaceModal;
