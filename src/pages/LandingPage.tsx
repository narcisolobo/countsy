import { Fragment } from "react/jsx-runtime";
import Hero from "../components/content/Hero";
import Features from "../components/content/Features";
import TechStack from "../components/content/TechStack";

function LandingPage() {
  return (
    <Fragment>
      <Hero />
      <Features />
      <TechStack />
    </Fragment>
  );
}

export default LandingPage;
