import { Fragment } from "react/jsx-runtime";
import Drawer from "./components/layout/Drawer";
import Navbar from "./components/layout/Navbar";
import { Route, Routes } from "react-router";
import LandingPage from "./components/layout/LandingPage";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <Fragment>
      <Drawer>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
        <Footer />
      </Drawer>
    </Fragment>
  );
}

export default App;
