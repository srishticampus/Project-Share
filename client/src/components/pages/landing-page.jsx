import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Code, Users, Briefcase, GraduationCap, ChevronDown, Star, CheckCircle, MessageSquare, Search } from "lucide-react";
import { useState, useEffect } from 'react';

// Placeholder for a simple slideshow effect
const ImageSlideshow = ({ images, altPrefix }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer); // Clear interval on unmount
  }, [images.length]);

  return (
    <img
      src={images[currentImageIndex]}
      alt={`${altPrefix} Image ${currentImageIndex + 1}`}
      width={1200}
      height={600}
      className="rounded-lg object-cover w-full h-auto aspect-video"
      priority // Prioritize loading the hero image
    />
  );
};

export default function LandingPage() {
  const heroImages = ["https://picsum.photos/1200/600", "https://picsum.photos/1200/600", "https://picsum.photos/1200/600"];
  const aboutImages = ["https://picsum.photos/600/400", "https://picsum.photos/600/400", "https://picsum.photos/600/400"];

  return (
    <main className="flex-1">
        {/* Home Section (Hero) */}
        <section id="home" className="w-full py-8 md:py-16 lg:py-24 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px] items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Bring Your Ideas to Life, Together.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    ProjectShare connects creators with collaborators and mentors to build innovative projects. Find the skills you need or the ideas you want to work on.
                  </p>
                </div>
                 <p className="text-lg font-semibold pt-4">How ProjectShare Can Help You:</p>
                 <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Connect with skilled collaborators or find exciting projects.</li>
                    <li>Manage your projects with built-in tools.</li>
                    <li>Build your portfolio and showcase your contributions.</li>
                    <li>Get guidance from experienced mentors.</li>
                 </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                  <Button size="lg" asChild>
                    <Link to="/projects" prefetch="false">Find Projects</Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                     <Link to="/collaborators" prefetch="false">Find Collaborators</Link>
                  </Button>
                </div>
              </div>
               <div className="flex items-center justify-center">
                 <ImageSlideshow images={heroImages} altPrefix="Hero" />
               </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-8 md:py-16 lg:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
               <div className="flex items-center justify-center">
                 <ImageSlideshow images={aboutImages} altPrefix="About" />
               </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">About Us</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What is ProjectShare?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ProjectShare is an innovative collaborative project and idea marketplace designed to bridge the gap between individuals with creative ideas and those with the skills to bring them to life. We provide a structured platform for connection, collaboration, and efficient project management.
                </p>
                 <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                   Our goal is to empower individuals to transform ideas into successful projects by integrating seamless communication, project tracking, and collaboration tools within a secure and engaging community.
                 </p>
              </div>
            </div>
          </div>
        </section>

         {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Collaborate</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                From finding the right people to managing your workflow, ProjectShare provides the tools for success.
              </p>
            </div>
            <div className="grid max-w-5xl mx-auto gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
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
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Get in Touch</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have questions or want to learn more? Reach out to us. <br />
                (Contact form or details will be added here).
              </p>
            </div>
             {/* Placeholder for contact form or details */}
             <div className="mt-4 text-muted-foreground">
                Email: info@projectshare.example.com
             </div>
          </div>
        </section>
    </main>
  );
}