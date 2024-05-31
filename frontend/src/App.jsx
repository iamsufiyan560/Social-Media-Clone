import { Box, Container } from "@chakra-ui/react";
import {
  Navigate,
  Route,
  Routes,
  BrowserRouter,
  useLocation,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import { useRecoilValue } from "recoil";
import ChatPage from "./pages/ChatPage";
const UserPage = lazy(() => import("./pages/UserPage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const Header = lazy(() => import("./components/Header"));
const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
import userAtom from "./atoms/userAtom";
const UpdateProfilePage = lazy(() => import("./pages/UpdateProfilePage"));
const CreatePost = lazy(() => import("./components/CreatePost"));

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();

  return (
    <>
      <Box position={"relative"} w="full">
        <Container
          maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}
        >
          <Suspense>
            <Header />
            <Routes>
              <Route
                path="/"
                element={user ? <HomePage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/auth"
                element={!user ? <AuthPage /> : <Navigate to="/" />}
              />
              <Route
                path="/update"
                element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
              />

              <Route
                path="/:username"
                element={
                  user ? (
                    <>
                      <UserPage />
                      <CreatePost />
                    </>
                  ) : (
                    <UserPage />
                  )
                }
              />
              <Route path="/:username/post/:pid" element={<PostPage />}></Route>
              <Route
                path="/chat"
                element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
              />
            </Routes>
          </Suspense>
        </Container>
      </Box>
    </>
  );
}

export default App;
