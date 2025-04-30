function TechStack() {
  return (
    <section id="tech-stack">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center p-4 text-center">
        <h2 className="text-4xl font-bold">Built With</h2>
        <div className="text-sm md:text-base">
          <p className="text-base-content/60 mt-8">
            <a
              target="_blank"
              href="https://react.dev/"
              className="link-primary hover:underline"
            >
              React
            </a>
            ,{" "}
            <a
              target="_blank"
              href="https://daisyui.com/"
              className="link-primary hover:underline"
            >
              daisyUI
            </a>
            ,{" "}
            <a
              target="_blank"
              href="https://supabase.com/"
              className="link-primary hover:underline"
            >
              Supabase
            </a>
            , and{" "}
            <a
              target="_blank"
              href="https://lucide.dev/"
              className="link-primary hover:underline"
            >
              Lucide
            </a>
            .
          </p>
          <p className="text-base-content/60 mt-2">
            Designed and developed by{" "}
            <a
              target="_blank"
              href="https://www.cisocodes.com/"
              className="link-primary hover:underline"
            >
              Narciso Lobo
            </a>
            .
          </p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-6">
          <a
            href="https://react.dev/"
            className="link-primary opacity-60 transition-opacity hover:opacity-100"
          >
            <img
              src="/images/logos/react-logo.svg"
              alt="React"
              className="h-6"
            />
          </a>
          <a
            href="https://daisyui.com/"
            className="link-primary opacity-60 transition-opacity hover:opacity-100"
          >
            <img
              src="/images/logos/daisy-ui-logo.svg"
              alt="daisyUI"
              className="h-6"
            />
          </a>
          <a
            href="https://supabase.com/"
            className="link-primary opacity-60 transition-opacity hover:opacity-100"
          >
            <img
              src="/images/logos/supabase-logo.svg"
              alt="Supabase"
              className="h-6"
            />
          </a>
          <a
            href="https://lucide.dev/"
            className="link-primary opacity-60 transition-opacity hover:opacity-100"
          >
            <img
              src="/images/logos/lucide-logo.svg"
              alt="Lucide"
              className="h-6"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

export default TechStack;
