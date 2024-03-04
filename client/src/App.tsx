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
import { RedirectAuth } from "./components/auth/redirect-auth.tsx";
import { VideoUploadForm } from "./components/upload-video/video-upload-form.tsx";
import LayoutB from "./components/layoutb.tsx";
import VideoPage from "./pages/videoPage.tsx";
import ChannelPage from "./pages/channelPage.tsx";
import StudioPage from "./pages/studioPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRouteFallBack />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Homepage />} />

              <Route
                path="/channel/:channel_owner_id"
                element={<ChannelPage />}
              />
              <Route
                path="/studio"
                element={<StudioPage />}
              />
            </Route>

            <Route element={<LayoutB />}>
              <Route
                path="/upload"
                element={<VideoUploadForm />}
              />
              <Route
                path="/video/:video_id"
                element={<VideoPage />}
              />
            </Route>
          </Route>

          {/* CATCH ALL ROUTE*/}
          <Route
            path="*"
            element={<div>404 PAGE NOT FOUND</div>}
          />

          {/* AUTH ROUTE */}
          <Route element={<RedirectAuth />}>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/register"
              element={<RegisterForm />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
