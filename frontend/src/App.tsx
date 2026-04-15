import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GroupProvider } from "./context/GroupContext";
import { PlanProvider } from "./context/PlanContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ConfirmUser from "./pages/ConfirmUser";
import Dashboard from "./pages/Dashboard";
import VerifyAuth from "./components/layout/VerifyAuth";
import NewGroup from "./pages/NewGroup";
import Group from "./pages/Group";
import AcceptInvitation from "./pages/AcceptInvitation";

function App() {
  return (
    <AuthProvider>
      <GroupProvider>
        <PlanProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/confirmar/:token" element={<ConfirmUser />} />
              <Route path="/inicio" element={<VerifyAuth><Dashboard /></VerifyAuth>} />
              <Route path="/nuevo-grupo" element={<VerifyAuth><NewGroup /></VerifyAuth>} />
              <Route path="/grupo/:idGroup" element={<VerifyAuth><Group /></VerifyAuth>} />
              <Route path="/invitacion/:token" element={<VerifyAuth><AcceptInvitation /></VerifyAuth>} />
            </Routes>
          </BrowserRouter>
        </PlanProvider>
      </GroupProvider>
    </AuthProvider>
  );
}

export default App;