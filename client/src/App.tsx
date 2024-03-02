import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { LoginForm } from "./components/auth/login-form.tsx";
import { RegisterForm } from "./components/auth/register-form.tsx";
import ProtectedRouteFallBack from "./components/auth/protected.tsx";
import Homepage from "./components/homepage.tsx";
import PersistLogin from "./components/auth/persist-login.tsx";
import Layout from "./components/layout.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* PUBLIC ROUTE */}
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/register"
            element={<RegisterForm />}
          />

          {/* PROTECTED ROUTE */}
          <Route element={<PersistLogin />}>
            <Route element={<ProtectedRouteFallBack />}>
              <Route path="/" element={<Homepage />} />
            </Route>
          </Route>
          {/* CATCH ALL ROUTE*/}
          <Route
            path="*"
            element={<div>404 PAGE NOT FOUND</div>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
