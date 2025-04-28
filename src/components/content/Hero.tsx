import { Link } from "react-router";

function Hero() {
  return (
    <section id="hero">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold">Track Anything, Count Everything</h1>
        <p className="text-base-content/70 mt-2 text-lg">
          Create and manage custom counters for habits, projects, or anything
          else.
        </p>
        <Link to="/sign-in" className="btn btn-primary mt-4">
          Start Counting
        </Link>
      </div>
    </section>
  );
}

export default Hero;
