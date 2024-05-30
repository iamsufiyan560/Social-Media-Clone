import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useRecoilValue } from "recoil";
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

  return (
    <>
      <Container maxW="620px">
        <BrowserRouter>
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
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Container>
    </>
  );
}

export default App;
