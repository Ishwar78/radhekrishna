import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { MapPin, Briefcase, Users, Zap, Heart, TrendingUp } from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const jobs: JobListing[] = [
  {
    id: "1",
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote / India",
    type: "Full-Time",
    description: "We're looking for an experienced full stack developer to join our growing team. Experience with React, Node.js, and MongoDB is preferred."
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "Delhi / Bangalore",
    type: "Full-Time",
    description: "Help shape the future of Vasstra. We seek a passionate product manager with experience in e-commerce and fashion industry."
  },
  {
    id: "3",
    title: "Content Writer",
    department: "Marketing",
    location: "Remote",
    type: "Full-Time",
    description: "Create compelling content for our blog, social media, and product descriptions. Experience in fashion and lifestyle writing is a plus."
  },
  {
    id: "4",
    title: "Customer Support Executive",
    department: "Customer Success",
    location: "Multiple Cities",
    type: "Full-Time",
    description: "Be the voice of Vasstra. Handle customer inquiries, process returns, and ensure customer satisfaction with excellence."
  },
  {
    id: "5",
    title: "Graphic Designer",
    department: "Design",
    location: "Remote / India",
    type: "Full-Time",
    description: "Design stunning visuals for our marketing campaigns, social media, and product pages. Proficiency in Adobe Creative Suite required."
  }
];

export default function Careers() {
  return (
    <>
      <Helmet>
        <title>Careers at Vasstra | Join Our Team</title>
        <meta name="description" content="Join the Vasstra team! Explore exciting career opportunities in fashion e-commerce, technology, and design." />
      </Helmet>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Careers at Vasstra
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our passionate team and help us revolutionize ethnic and western fashion in India. We're building something special and we want you to be part of it.
            </p>
          </div>

          {/* Company Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 bg-card rounded-lg border border-border">
              <Heart className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Passion for Fashion</h3>
              <p className="text-sm text-muted-foreground">
                We love what we do and it shows in every collection we curate and every customer we serve.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Team Spirit</h3>
              <p className="text-sm text-muted-foreground">
                We work together, support each other, and celebrate our wins as a unified team.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <Zap className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Innovation</h3>
              <p className="text-sm text-muted-foreground">
                We embrace new ideas and continuously improve how we serve our customers.
              </p>
            </div>
          </div>

          {/* Why Work With Us */}
          <div className="bg-gradient-to-br from-gold/10 via-accent/5 to-background p-8 rounded-lg border border-border mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Why Work With Us?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">📈 Growth Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Join a fast-growing startup where your contributions directly impact our success and your career growth.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">💼 Flexible Work Environment</h3>
                <p className="text-sm text-muted-foreground">
                  Work remotely or from our offices with flexible hours that suit your lifestyle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">🎯 Meaningful Work</h3>
                <p className="text-sm text-muted-foreground">
                  Every role matters. You'll see the direct impact of your work on customers and business growth.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">🌟 Competitive Benefits</h3>
                <p className="text-sm text-muted-foreground">
                  Competitive salary, health insurance, professional development, and more.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">🤝 Collaborative Culture</h3>
                <p className="text-sm text-muted-foreground">
                  Work with talented, passionate individuals who are eager to learn and grow together.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">🎁 Team Perks</h3>
                <p className="text-sm text-muted-foreground">
                  Employee discounts, team outings, and exclusive events throughout the year.
                </p>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Open Positions</h2>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.department}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {job.type}
                      </span>
                      <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Internship Program */}
          <div className="bg-burgundy/5 border border-burgundy/20 rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-4">Internship Program</h2>
            <p className="text-muted-foreground mb-4">
              Are you a student looking to gain real-world experience? Vasstra offers internship opportunities across various departments. Interns work on real projects, learn from experienced mentors, and have the opportunity to convert to full-time positions.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Departments:</strong> Engineering, Product, Marketing, Design, Customer Support, Operations
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Duration:</strong> 2-6 months (flexible)
            </p>
            <p className="text-muted-foreground">
              Interested in interning with us? Send your resume and cover letter to careers@vasstra.com with "Internship" in the subject line.
            </p>
          </div>

          {/* Culture & Benefits */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Career Growth
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>✓ Regular training and skill development programs</li>
                <li>✓ Mentorship from industry leaders</li>
                <li>✓ Clear career progression paths</li>
                <li>✓ Opportunities to lead projects and teams</li>
                <li>✓ Conference and workshop attendance budget</li>
                <li>✓ Certification support</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                Benefits & Perks
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>✓ Competitive salary packages</li>
                <li>✓ Health and wellness insurance</li>
                <li>✓ Flexible working hours and remote work</li>
                <li>✓ Employee discount on all products</li>
                <li>✓ Casual dress code</li>
                <li>✓ Regular team outings and celebrations</li>
              </ul>
            </div>
          </div>

          {/* Application Process */}
          <div className="bg-card rounded-lg border border-border p-8 mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Application Process</h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Submit Your Application</h3>
                  <p className="text-sm text-muted-foreground">Apply online by clicking "Apply Now" or send your resume to careers@vasstra.com</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Initial Review</h3>
                  <p className="text-sm text-muted-foreground">Our team reviews your application and qualifications</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Interview Round(s)</h3>
                  <p className="text-sm text-muted-foreground">Phone/video interview followed by technical or functional assessments</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Final Round</h3>
                  <p className="text-sm text-muted-foreground">Meet with leadership and discuss role details</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Offer & Onboarding</h3>
                  <p className="text-sm text-muted-foreground">Receive offer and get onboarded to the Vasstra team!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-burgundy/10 to-accent/5 p-8 rounded-lg border border-border text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Join Us?</h2>
            <p className="text-muted-foreground mb-6">
              Didn't find the right position? Send your profile and let's explore opportunities together!
            </p>
            <a
              href="mailto:careers@vasstra.com"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Send Your Resume
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
