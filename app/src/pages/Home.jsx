import { useState, useEffect } from "react";
import { Box, Button, Input, Heading, VStack } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import WorkspaceTable from "../components/WorkspaceTable";
import WorkspaceModal from "../components/WorkspaceModal";
import { fetchApi, getToken } from "../utils/api";

const Home = () => {
  const [activeTab, setActiveTab] = useState("workspaces");
  const [workspaces, setWorkspaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const token = getToken();
      const response = await fetchApi("/workspaces", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setWorkspaces(response.data);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  const handleOpenModal = (workspace = null) => {
    setEditingWorkspace(workspace);
    setIsModalOpen(true);
  };

  const handleSaveWorkspace = async (name, description) => {
    const token = getToken();
    try {
      if (editingWorkspace) {
        await fetchApi(
          `/workspaces/${editingWorkspace.id}`,
          "PATCH",
          {
            data: { name, description },
          },
          {
            Authorization: `Bearer ${token}`,
          }
        );

        setWorkspaces(
          workspaces.map((ws) =>
            ws.id === editingWorkspace.id
              ? { ...ws, attributes: { name, description } }
              : ws
          )
        );
      } else {
        const response = await fetchApi(
          "/workspaces",
          "POST",
          {
            data: { name, description },
          },
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setWorkspaces([...workspaces, response.data]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving workspace:", error);
    }
  };

  const handleDeleteWorkspace = async (id) => {
    try {
      const token = getToken();
      await fetchApi(`/workspaces/${id}`, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      setWorkspaces(workspaces.filter((ws) => ws.id !== id));
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  const filteredWorkspaces = workspaces.filter((ws) =>
    ws.attributes.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Box p={8}>
        <VStack spacing={4}>
          <Heading>Workspaces</Heading>
          <Input
            placeholder="Search workspaces..."
            value={searchQuery}
            width="40%"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={() => handleOpenModal()} colorScheme="blue">
            Add Workspace
          </Button>
          <WorkspaceTable
            workspaces={filteredWorkspaces}
            onEdit={handleOpenModal}
            onDelete={handleDeleteWorkspace}
          />
        </VStack>
      </Box>

      <WorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWorkspace}
        editingWorkspace={editingWorkspace}
      />
    </Box>
  );
};

export default Home;
