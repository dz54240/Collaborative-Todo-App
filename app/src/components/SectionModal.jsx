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
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { fetchApi, getToken } from "../utils/api";

const SectionModal = ({ isOpen, onClose, onSave, editingSection }) => {
  const [name, setName] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (editingSection) {
      setName(editingSection.attributes.name);
    } else {
      setName("");
    }
  }, [editingSection]);

  const handleSave = async () => {
    if (!name) {
      toast({
        title: "Section name is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onSave(name);
    setName("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editingSection ? "Edit Section" : "Add Section"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Section Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue" ml={3} onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SectionModal;
