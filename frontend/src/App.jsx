import { Container } from "@chakra-ui/react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  BrowserRouter,
} from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Container maxW="620px">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/:username" element={<UserPage />}></Route>
            <Route path="/:username/post/:pid" element={<PostPage />}></Route>
          </Routes>
        </BrowserRouter>
      </Container>
    </>
  );
}

export default App;
