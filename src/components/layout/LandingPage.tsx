import { Fragment } from "react/jsx-runtime";
import Hero from "../content/Hero";
import Features from "../content/Features";
import TechStack from "../content/TechStack";

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
