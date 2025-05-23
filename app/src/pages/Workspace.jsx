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
  Icon,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import Navbar from "../components/Navbar";
import SectionModal from "../components/SectionModal";
import TodoModal from "../components/TodoModal";
import { fetchApi, getToken } from "../utils/api";
import { useParams } from "react-router-dom";

const Workspace = () => {
  const { id } = useParams();
  const [sections, setSections] = useState([]);
  const [todosBySection, setTodosBySection] = useState({});
  const [editingSection, setEditingSection] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isTodoOpen,
    onOpen: onTodoOpen,
    onClose: onTodoClose,
  } = useDisclosure();
  const token = getToken();

  useEffect(() => {
    fetchSections();
    setupWebSocket();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetchApi(
        `/sections?workspace=${id}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setSections(response.data);

      const todosData = await fetchTodosForSections(response.data);
      setTodosBySection(todosData);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const fetchTodosForSections = async (sections) => {
    const todosData = {};
    for (const section of sections) {
      const response = await fetchApi(
        `/todos?section=${section.id}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      todosData[section.id] = enhanceTodosWithUsers(response);
    }
    return todosData;
  };

  const enhanceTodosWithUsers = (response) => {
    if (!response || !response.data) return [];

    const todos = response.data;
    const users = response.included
      ? response.included.filter((item) => item.type === "user")
      : [];

    return todos.map((todo) => {
      const creator = users.find(
        (user) => user.id === todo.relationships?.created_by?.data?.id
      );
      const updater = users.find(
        (user) => user.id === todo.relationships?.updated_by?.data?.id
      );

      return {
        ...todo,
        creatorEmail: creator ? creator.attributes.email : "Unknown",
        updaterEmail: updater ? updater.attributes.email : "Unknown",
      };
    });
  };

  const handleSaveSection = async (name) => {
    try {
      if (editingSection) {
        await fetchApi(
          `/sections/${editingSection.id}`,
          "PATCH",
          {
            data: { name },
          },
          {
            Authorization: `Bearer ${token}`,
          }
        );
      } else {
        await fetchApi(
          "/sections",
          "POST",
          {
            data: { name, workspace_id: id },
          },
          {
            Authorization: `Bearer ${token}`,
          }
        );
      }
      fetchSections();
      onClose();
    } catch (error) {
      console.error("Error saving section:", error);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await fetchApi(`/sections/${sectionId}`, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      fetchSections();
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const handleSaveTodo = async (title, description, status, priority) => {
    try {
      if (editingTodo) {
        await fetchApi(
          `/todos/${editingTodo.id}`,
          "PATCH",
          {
            data: { title, description, status, priority },
          },
          {
            Authorization: `Bearer ${token}`,
          }
        );
      } else {
        await fetchApi(
          "/todos",
          "POST",
          {
            data: {
              title,
              description,
              status,
              priority,
              section_id: editingSection.id,
            },
          },
          {
            Authorization: `Bearer ${token}`,
          }
        );
      }
      fetchSections();
      onTodoClose();
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await fetchApi(`/todos/${todoId}`, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      fetchSections();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const setupWebSocket = () => {
    const socket = new WebSocket("ws://localhost:3000/cable");

    socket.onopen = () => {
      console.log("WebSocket povezan.");
      socket.send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({ channel: "SectionsChannel" }),
        })
      );
      socket.send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({ channel: "TodosChannel" }),
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "ping" || !data.message) return;

      const message = data.message;
      console.log("Primljen događaj:", data);

      if (message.section) {
        handleSectionUpdate(message);
      } else if (message.todo) {
        handleTodoUpdate(message);
      }
    };

    socket.onclose = () => console.log("WebSocket zatvoren.");
  };

  const handleSectionUpdate = ({ action, section }) => {
    if (action === "created") {
      setSections((prev) => [...prev, section]);
    } else if (action === "updated") {
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? section : s))
      );
    } else if (action === "deleted") {
      setSections((prev) => prev.filter((s) => s.id !== section.id));
    }
  };

  const handleTodoUpdate = ({ action, todo }) => {
    setTodosBySection((prev) => {
      const updated = { ...prev };
      // console.log("section_id:");
      // console.log(todo.attributes.section_id);
      if (!updated[todo.attributes.section_id])
        updated[todo.attributes.section_id] = [];

      if (action === "created") {
        updated[todo.attributes.section_id] = [
          ...updated[todo.attributes.section_id],
          todo,
        ];
      } else if (action === "updated") {
        updated[todo.attributes.section_id] = updated[
          todo.attributes.section_id
        ].map((t) => (t.id === todo.id ? todo : t));
      } else if (action === "deleted") {
        updated[todo.attributes.section_id] = updated[
          todo.attributes.section_id
        ].filter((t) => t.id !== todo.id);
      }

      return { ...updated };
    });
  };

  return (
    <Box>
      <Navbar activeTab="workspaces" setActiveTab={() => {}} />
      <Box p={8} maxWidth="800px" mx="auto">
        <Heading textAlign="center" mb={4}>
          Todos
        </Heading>
        <Heading textAlign="center">
          <Button
            onClick={() => {
              setEditingSection(null);
              onOpen();
            }}
            colorScheme="blue"
            mb={5}>
            Add Section
          </Button>
        </Heading>
        <VStack spacing={6} align="stretch">
          {sections.length > 0 ? (
            sections.map((section) => (
              <Box key={section.id} borderWidth="1px" borderRadius="md" p={4}>
                <Flex justify="space-between">
                  <Heading size="md">{section.attributes.name}</Heading>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => {
                        setEditingTodo(null);
                        setEditingSection(section);
                        onTodoOpen();
                      }}>
                      Add Todo
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="yellow"
                      onClick={() => {
                        setEditingSection(section);
                        onOpen();
                      }}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteSection(section.id)}>
                      <DeleteIcon />
                    </Button>
                  </Flex>
                </Flex>
                <Divider my={3} />
                <VStack spacing={3} align="stretch">
                  {todosBySection[section.id]?.length > 0 ? (
                    todosBySection[section.id].map((todo) => (
                      <Flex
                        key={todo.id}
                        justify="space-between"
                        p={3}
                        borderWidth="1px"
                        borderRadius="md">
                        <Box flex="1">
                          <Text>
                            <strong>Title: </strong>
                            {todo.attributes.title}
                          </Text>
                          <Text>
                            <strong>Description:</strong>{" "}
                            {todo.attributes.description}
                          </Text>
                          <Text>
                            <strong>priority:</strong>{" "}
                            {todo.attributes.priority} {""}
                          </Text>
                          <Text>
                            <strong>status:</strong> {todo.attributes.status}
                          </Text>
                          <Text>
                            <strong>Created by: </strong>
                            {todo.creatorEmail}
                          </Text>
                          <Text>
                            <strong>Last updated by: </strong>{" "}
                            {todo.updaterEmail}
                          </Text>
                        </Box>
                        <Flex gap={2}>
                          <Button
                            size="sm"
                            colorScheme="yellow"
                            onClick={() => {
                              setEditingTodo(todo);
                              onTodoOpen();
                            }}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleDeleteTodo(todo.id)}>
                            <DeleteIcon />
                          </Button>
                        </Flex>
                      </Flex>
                    ))
                  ) : (
                    <Text>No todos in this section. </Text>
                  )}
                </VStack>
              </Box>
            ))
          ) : (
            <Text>No sections in this workspace.</Text>
          )}
        </VStack>
      </Box>

      <SectionModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSaveSection}
        editingSection={editingSection}
      />
      <TodoModal
        isOpen={isTodoOpen}
        onClose={onTodoClose}
        onSave={handleSaveTodo}
        editingTodo={editingTodo}
      />
    </Box>
  );
};

export default Workspace;
