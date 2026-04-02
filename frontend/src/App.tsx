import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GroupProvider } from "./context/GroupContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ConfirmUser from "./pages/ConfirmUser";
import Dashboard from "./pages/Dashboard";
import VerifyAuth from "./components/VerifyAuth";
import NewGroup from "./pages/NewGroup";

function App() {
  return (
    <AuthProvider>
      <GroupProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/confirmar/:token" element={<ConfirmUser />} />
            <Route path="/inicio" element={<VerifyAuth><Dashboard /></VerifyAuth>} />
            <Route path="/nuevo-grupo" element={<VerifyAuth><NewGroup /></VerifyAuth>} />
          </Routes>
        </BrowserRouter>
      </GroupProvider>
    </AuthProvider>
  );
}

export default App;