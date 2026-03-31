import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VerifyAuth from "./components/VerifyAuth";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/inicio" element={<VerifyAuth><Dashboard /></VerifyAuth>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;