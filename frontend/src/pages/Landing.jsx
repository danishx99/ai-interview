import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BrainCircuit,
  CheckCircle,
  Clock,
  Laptop,
  Check,
  Repeat,
  Mic,
} from "lucide-react";

import fullLogo from "@/assets/full-logo.png";
import whiteLogo from "@/assets/mini-logo-white.png";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center bg-purple-600 text-white">
        <div className="flex items-center justify-center">
          <img className="h-8 w-8 mr-2" src={whiteLogo} />
          <span className="font-bold">NextGen Interviews</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#how-it-works"
          >
            How It Works
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#pricing"
          >
            Pricing
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-purple-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:gap-12 xl:grid-cols-[3fr_1fr]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-purple-800">
                    Ace Your Next Job Interview
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Practice interviews anytime, anywhere. Get instant feedback
                    and improve your skills with our AI-powered platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-100"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="mx-auto aspect-video overflow-hidden rounded-xlsm:w-full lg:order-last flex items-center justify-center">
                <img
                  src={fullLogo}
                  alt=""
                  className="max-w-full h-auto"
                  style={{ maxWidth: "700px" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-white"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-purple-800">
              Key Features
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 justify-center">
              <Card className="bg-purple-50">
                <CardHeader>
                  <Clock className="h-6 w-6 mb-2 text-purple-600" />
                  <CardTitle className="text-purple-800">
                    24/7 Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Practice interviews at any time that suits you, without
                  scheduling constraints.
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardHeader>
                  <Laptop className="h-6 w-6 mb-2 text-purple-600" />
                  <CardTitle className="text-purple-800">
                    Realistic Scenarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Experience industry-specific interview questions tailored to
                  your field.
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardHeader>
                  <CheckCircle className="h-6 w-6 mb-2 text-purple-600" />
                  <CardTitle className="text-purple-800">
                    Instant Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Receive immediate analysis on your performance, including
                  areas for improvement.
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardHeader>
                  <CheckCircle className="h-6 w-6 mb-2 text-purple-600" />
                  <CardTitle className="text-purple-800">
                    Interview Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Receive access to hand-curated resources that will help you in
                  your job search.
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardHeader>
                  <Mic className="h-6 w-6 mb-2 text-purple-600" />
                  <CardTitle className="text-purple-800">Voice Input</CardTitle>
                </CardHeader>
                <CardContent>
                  Use your microphone to answer questions just like in a real
                  interview, enhancing realism and convenience.
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardHeader>
                  <Repeat className="h-6 w-6 mb-2 text-purple-600" />
                  <CardTitle className="text-purple-800">
                    3 Retakes Per Interview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Improve your answers with up to 3 retakes for each question,
                  ensuring you perform at your best.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-purple-100"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-purple-800">
              How It Works
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-purple-600 text-white p-3 mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2 text-purple-800">
                  Sign Up
                </h3>
                <p>
                  Create your account and set up your profile with your career
                  goals.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-purple-600 text-white p-3 mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2 text-purple-800">
                  Choose Your Interview
                </h3>
                <p>Select from various industries and experience levels.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-purple-600 text-white p-3 mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2 text-purple-800">
                  Practice and Improve
                </h3>
                <p>
                  Engage in AI-led interviews and receive detailed feedback to
                  enhance your skills and build confidence
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="w-full py-12 md:py-24 lg:py-32 bg-white"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-purple-800">
              Choose Your Plan
            </h2>
            <div className="grid gap-6 lg:grid-cols-2 justify-center">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-purple-800">
                    Free Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center text-4xl font-bold text-purple-600">
                    $0
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-purple-600" />
                      <span>2 FREE AI-powered mock interviews</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-purple-600" />
                      <span>Basic performance analytics</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-purple-600" />
                      <span>Access to common interview questions</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
              <Card className="w-full border-purple-600">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-purple-800">
                    Pro Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center text-4xl font-bold text-purple-600">
                    $4.99/month
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-purple-600" />
                      <span>30 AI-powered mock interviews</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-purple-600" />
                      <span>Advanced performance analytics and insights</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-purple-600" />
                      <span>Industry-specific interview questions</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-purple-600" />
                      <span>Personalized improvement recommendations</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="w-full py-12 md:py-24 lg:py-32 bg-purple-100"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-purple-800">
              Frequently Asked Questions
            </h2>
            <Accordion
              type="single"
              collapsible
              className="w-full max-w-3xl mx-auto"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-purple-800 hover:text-purple-600">
                  What is NextGen Interviews?
                </AccordionTrigger>
                <AccordionContent>
                  NextGen Interviews is an AI-powered platform designed to help
                  job seekers practice and improve their interview skills. It
                  provides tailored interview sessions based on job
                  descriptions, instant feedback, and industry-specific
                  questions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-purple-800 hover:text-purple-600">
                  How does NextGen Interviews create questions?
                </AccordionTrigger>
                <AccordionContent>
                  NextGen Interviews generates questions using advanced AI
                  trained on industry-standard interview patterns and real-world
                  job descriptions. This ensures that the questions are relevant
                  and realistic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-purple-800 hover:text-purple-600">
                  Can I use voice input for answering questions?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, NextGen Interviews allows you to use your microphone to
                  answer questions verbally, creating a realistic and
                  interactive interview experience.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left text-purple-800 hover:text-purple-600">
                  How many questions are in each interview session?
                </AccordionTrigger>
                <AccordionContent>
                  Each interview session consists of 10 carefully selected
                  questions based on the job description you provide. You can
                  retake up to 3 questions during each session.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left text-purple-800 hover:text-purple-600">
                  Does NextGen Interviews provide feedback?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, NextGen Interviews provides instant feedback after each
                  response, highlighting strengths and areas for improvement.
                  This helps you refine your answers for actual interviews.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left text-purple-800 hover:text-purple-600">
                  Is there a free plan available?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, NextGen Interviews offers a Free plan with basic
                  features. You can upgrade to the Pro plan for access to
                  advanced features such as industry-specific questions and
                  detailed feedback analysis.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6 flex justify-center">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
                  Ready to Master Job Interviews?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join hundreds of job seekers who have improved their interview
                  skills with NextGen Interviews.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-4">
                <Button
                  type="button"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Get Started
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400"></p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-purple-600 text-white">
          <p className="text-xs">© 2024 NextGen Interviews. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
