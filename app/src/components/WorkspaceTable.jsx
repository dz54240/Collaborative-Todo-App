import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const WorkspaceTable = ({ workspaces, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Table variant="simple" width="100%">
      <Thead>
        <Tr>
          <Th textAlign="left" width="30%">
            Name
          </Th>
          <Th textAlign="center" width="40%">
            Description
          </Th>
          <Th textAlign="center" width="30%">
            Actions
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {workspaces.map((ws) => (
          <Tr key={ws.id}>
            <Td textAlign="left">{ws.attributes.name}</Td>
            <Td textAlign="center">{ws.attributes.description}</Td>
            <Td textAlign="right">
              <Flex justifyContent="center" gap={2}>
                <Button
                  onClick={() => navigate(`/workspaces/${ws.id}`)}
                  colorScheme="teal">
                  Open
                </Button>
                <Button onClick={() => onEdit(ws)} colorScheme="yellow">
                  Edit
                </Button>
                <Button onClick={() => onDelete(ws.id)} colorScheme="red">
                  Delete
                </Button>
              </Flex>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default WorkspaceTable;
