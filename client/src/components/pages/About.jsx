import { Button } from "@/components/ui/button";

function About() {
  return (
    <div className="container mx-auto py-10">
      {/* Hero Section */}
      <section className="mb-8 text-center bg-muted/50 py-12 rounded-lg">
        <h1 className="text-3xl font-bold mb-5">About ProjectShare</h1>
        <p className="text-gray-700 mb-5">
          ProjectShare is an innovative collaborative project and idea marketplace designed to bridge the gap between individuals with creative ideas and those with the skills to bring them to life. Many individuals struggle to find the right collaborators due to a lack of resources and connections. ProjectShare addresses this challenge by providing a structured platform where users can connect, collaborate, and manage projects efficiently.
        </p>
      </section>

      {/* Key Features Section - The only card grid */}
      <section className="mb-8 py-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Skill-Based Matching</h3>
            <p className="text-gray-700">Ensuring project creators find the right talent.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Project Management Tools</h3>
            <p className="text-gray-700">Task lists and progress tracking for efficient collaboration.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Portfolio Building</h3>
            <p className="text-gray-700">Allowing collaborators to showcase their contributions.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Mentorship Opportunities</h3>
            <p className="text-gray-700">Fostering knowledge-sharing and professional growth.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Idea Sharing & Feedback</h3>
            <p className="text-gray-700">Creating a dynamic environment for innovation.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Seamless Communication</h3>
            <p className="text-gray-700">Integrated tools for effective team interaction.</p>
          </div>
        </div>
      </section>

      {/* User Groups Section - Paragraph with Image */}
      <section className="mb-8 py-8 bg-muted/50 rounded-lg flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">Who Benefits from ProjectShare?</h2>
          <p className="text-gray-700 mb-4">
            Our platform caters to four key user groups: Project Creators, Collaborators, Mentors/Experts, and Admins. Each group has unique features and functionalities to facilitate collaboration and project success.
          </p>
          <p className="text-gray-700 mb-4">
            Project Creators can post project ideas, define required skills, and manage collaborator applications. Collaborators can browse and apply for projects that align with their expertise while building a portfolio of completed work. Mentors/Experts can offer guidance, provide feedback, and contribute to project discussions. Admins are responsible for user management, content moderation, and platform analytics.
          </p>
        </div>
        <div className="md:w-1/2 p-4">
          <img src="/usergroup.jpg" alt="User Groups" className="rounded-lg shadow-md w-full h-auto" />
        </div>
      </section>

      {/* Disadvantages of Existing Systems Section - Paragraph with Image */}
      <section className="mb-8 py-8 flex flex-col md:flex-row-reverse items-center">
        <div className="md:w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">Challenges with Existing Collaboration Methods</h2>
          <p className="text-gray-700 mb-4">
            The current methods for finding project collaborators and managing projects are often fragmented and inefficient. Users rely on multiple external tools, leading to disorganization and a lack of centralized progress tracking.
          </p>
          <p className="text-gray-700 mb-4">
            There's a significant lack of structured skill matching, making it random and time-consuming to find the right collaborators. Furthermore, contributors struggle to showcase their project contributions effectively, and new teams often lack access to expert guidance, slowing progress. The absence of proper user verification can also lead to unreliable collaborations and potential fraud.
          </p>
        </div>
        <div className="md:w-1/2 p-4">
          <img src="/collab.jpg" alt="Challenges" className="rounded-lg shadow-md w-full h-auto" />
        </div>
      </section>

      {/* Advantages of Proposed System Section - Paragraph with Image */}
      <section className="mb-8 py-8 bg-muted/50 rounded-lg flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">How ProjectShare Solves These Problems</h2>
          <p className="text-gray-700 mb-4">
            ProjectShare provides a dedicated, structured, and integrated platform for project collaboration. It centralizes all project-related tools, reducing the need for multiple platforms and streamlining workflows.
          </p>
          <p className="text-gray-700 mb-4">
            With AI-based skill matching, ProjectShare quickly connects project creators with the right talent. It also enables portfolio development, allowing users to showcase their contributions, and provides access to mentorship, improving project success rates. Secure and verified users, along with built-in project tracking, ensure trusted collaborations and efficient task management.
          </p>
        </div>
        <div className="md:w-1/2 p-4">
          <img src="/solutions.jpg" alt="Solutions" className="rounded-lg shadow-md w-full h-auto" />
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
        <p className="text-gray-700 mb-5">
          The existing system is fragmented, inefficient, and lacks a structured approach to collaboration. ProjectShare provides an all-in-one solution that streamlines project collaboration, enhances security, and improves the success rate of innovative projects.
        </p>
      </section>

      {/* CTA Section */}
      <section className="text-center py-8 bg-primary text-primary-foreground rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to transform your ideas into reality?</h2>
        <Button variant="secondary" size="lg">Get Started Today</Button>
      </section>
    </div>
  );
}

export default About;
