function PrivacyPage() {
  return (
    <div className="mx-auto min-h-[70vh] max-w-5xl p-4 py-10">
      <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
      <p className="text-base-content/80 mb-4">
        At <strong>Countsy</strong>, we value your privacy. This page outlines
        how we handle your data.
      </p>

      <h2 className="mt-6 mb-2 text-xl font-semibold">What We Collect</h2>
      <p className="text-base-content/70 mb-4">
        We store your counters and user authentication details securely through
        Supabase. We do not collect or store any personal information beyond
        what is required for login and usage.
      </p>

      <h2 className="mt-6 mb-2 text-xl font-semibold">How Your Data Is Used</h2>
      <p className="text-base-content/70 mb-4">
        Your data is used only to display and manage your counters. We do not
        sell, share, or otherwise distribute your information.
      </p>

      <h2 className="mt-6 mb-2 text-xl font-semibold">Third-Party Services</h2>
      <p className="text-base-content/70 mb-4">
        Authentication and database services are provided by{" "}
        <a href="https://supabase.com" className="link">
          Supabase
        </a>
        , which adheres to its own security and privacy practices.
      </p>

      <h2 className="mt-6 mb-2 text-xl font-semibold">Your Rights</h2>
      <p className="text-base-content/70 mb-4">
        You can request to delete your account and associated data at any time
        by contacting the developer.
      </p>

      <p className="text-base-content/60 mt-6 text-sm">
        This privacy policy is subject to change. Last updated:{" "}
        {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
export default PrivacyPage;
