import { Button } from "@/components/ui/button";

function About() {
  return (
    <div className="container mx-auto py-10">
      {/* Hero Section */}
      <section className="mb-8 text-center bg-muted/50 py-12 rounded-lg">
        <h1 className="text-3xl font-bold mb-5">About ProjectShare</h1>
        <p className="text-gray-700 mb-5">
          ProjectShare is an innovative collaborative project and idea marketplace designed to bridge the gap between individuals with creative ideas and those with the skills to bring them to life.
        </p>
      </section>

      {/* Mid Section */}
      <section className="mb-8">
        <p className="text-gray-700 mt-5">
          Our platform caters to four key user groups: Project Creators, Collaborators, Mentors/Experts, and Admins. Each group has unique features and functionalities to facilitate collaboration and project success.
        </p>
        <p className="text-gray-700 mt-2">
          We believe in empowering individuals to transform ideas into successful projects by providing a structured platform for connection, collaboration, and efficient project management.
        </p>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to join the community?</h2>
        <Button>Get Started</Button>
      </section>
    </div>
  );
}

export default About;