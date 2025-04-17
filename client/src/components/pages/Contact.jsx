import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Contact() {
  return (
    <div className="container mx-auto py-10">
      {/* Hero Section */}
      <section className="mb-8 text-center bg-muted/50 py-12 rounded-lg">
        <h1 className="text-3xl font-bold mb-5">Contact Us</h1>
        <p className="text-gray-700 mb-5">
          Have questions or want to learn more? Reach out to us.
        </p>
      </section>

      {/* Mid Section */}
      <section className="mb-8">
        <p className="text-gray-700 mb-2">
          Email: info@projectshare.example.com
        </p>
        <p className="text-gray-700 mb-2">
          Phone: (123) 456-7890
        </p>

        {/* Contact Form */}
        <form className="max-w-md mx-auto">
          <div className="grid gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your email" />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Subject" />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your message"
              />
            </div>
          </div>
        </form>
      </section>

      {/* CTA Section */}
      <section className="text-center mt-8">
        <Button>Submit</Button>
      </section>
    </div>
  );
}

export default Contact;