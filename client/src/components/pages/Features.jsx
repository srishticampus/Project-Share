import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Code, Users, Briefcase, GraduationCap, ChevronDown, Star, CheckCircle, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function Features() {
  return (
    <div className="container mx-auto py-10">
      {/* Hero Section */}
      <section className="mb-8 text-center bg-muted/50 py-12 rounded-lg">
        <h1 className="text-3xl font-bold mb-5">Key Features</h1>
        <p className="text-gray-700 mb-5">Explore the amazing features that ProjectShare offers:</p>
      </section>

      {/* Mid Section */}
      <section className="grid max-w-5xl mx-auto gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mb-8">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Skill-Based Matching</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Our platform helps project creators find collaborators with the specific skills and experience needed for their projects.
            </CardDescription>
            <p className="text-gray-700 mt-2">
              We use advanced algorithms to match project creators with collaborators who have the right skills and experience.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Project Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Utilize built-in tools like task lists and progress tracking to keep your projects organized and on schedule.
            </CardDescription>
            <p className="text-gray-700 mt-2">
              Our project management tools help you stay on top of your tasks and deadlines.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Portfolio Building</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Collaborators can easily showcase their contributions to completed projects, building a valuable portfolio.
            </CardDescription>
            <p className="text-gray-700 mt-2">
              Showcase your skills and experience to potential employers and collaborators.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Mentorship</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Connect with experienced mentors and experts who can provide guidance and feedback on your projects.
            </CardDescription>
            <p className="text-gray-700 mt-2">
              Get the guidance you need to succeed in your projects.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Integrated Communication</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Communicate directly with your team members and mentors within the platform.
            </CardDescription>
            <p className="text-gray-700 mt-2">
              Stay connected with your team and mentors.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Secure Environment</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Admin moderation and user verification help ensure a safe and trustworthy collaboration space.
            </CardDescription>
            <p className="text-gray-700 mt-2">
              We take security seriously.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <Button asChild><Link to="/register/collaborator">Find a Project</Link></Button>
      </section>
    </div>
  );
}

export default Features;