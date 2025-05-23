import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Invites from "./pages/Invites";
import Workspace from "./pages/Workspace";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/invites" element={<Invites />} />
      <Route path="/workspaces/:id" element={<Workspace />} />
    </Routes>
  );
}

export default App;
