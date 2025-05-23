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

const TodoModal = ({ isOpen, onClose, onSave, editingTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("low");
  const toast = useToast();

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.attributes.title);
      setDescription(editingTodo.attributes.description);
      setStatus(editingTodo.attributes.status);
      setPriority(editingTodo.attributes.priority);
    } else {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("low");
    }
  }, [editingTodo]);

  const handleSave = () => {
    if (!title) {
      toast({
        title: "Title is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onSave(title, description, status, priority);
    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("low");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{editingTodo ? "Edit Todo" : "Add Todo"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb={3}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            mb={3}
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            mb={3}>
            <option value="todo">Todo</option>
            <option value="working">Working</option>
            <option value="done">Done</option>
          </Select>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
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

export default TodoModal;
