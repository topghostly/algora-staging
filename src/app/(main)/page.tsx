import Link from "next/link";
import { LibraryBig, ListChecks } from "lucide-react";
import Footer from "@/components/Footer";
import { InvertedCornerImage } from "@/components/ui/inverted-border";
import GlowingButton from "@/components/GlowingButton";

export default function Home() {
  const learnEverything = [
    {
      title: "Project-Based Learning",
      description:
        "Don't just watch videos. Build real-world projects that you can show off in your portfolio.",
      image: "/images/Landing-2.webp",
    },
    {
      title: "Expert Mentorship",
      description:
        "Get unstuck quickly with access to experienced tutors and weekly office hours.",
      image: "/images/Landing-3.webp",
    },
    {
      title: "Career Focused",
      description:
        "Our curriculum is designed backwards from job descriptions to ensure you learn what matters.",
      image: "/images/Landing-6.webp",
    },
  ];

  const simpleSteps = [
    {
      title: "Choose Your Track",
      description: "Start with data analytics or explore other paths.",
      image: "/images/Landing-5.webp",
      linkText: "View tracks",
      link: "/tracks",
    },
    {
      title: "Subscribe",
      description: "Pick a plan that works for you.",
      image: "/images/Landing-1.webp",
      linkText: "View plans",
      link: "/pricing",
    },
    {
      title: "Work through lessons",
      description: "Build your portfolio and move forward.",
      image: "/images/Landing-4.webp",
      linkText: "View Curriculum",
      link: "#",
    },
  ];
  return (
    <>
      <main className="py-6">
        {/* Hero Section */}
        <section className="lg:py-15 py-10">
          <div className="container flex flex-col lg:grid lg:grid-cols-[1fr_1.2fr] gap-10">
            {/* Hero Text */}
            <div className="flex flex-col justify-center items-center lg:items-start ">
              <div className="w-fit md:text-base px-3 py-1 bg-primary/10 font-semibold rounded-full mb-6">
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--primary)",
                  }}
                >
                  Launching the next generation of African Tech Talent
                </p>
              </div>
              <h1 className="mb-6 max-w-[800px] text-center lg:text-left">
                Master Data and AI Skills with Structured Mentorship
              </h1>
              <p className="mb-6 max-w-[550px] text-muted-foreground text-center lg:text-left">
                Stop wasting time on scattered tutorials. Get a structured
                curriculum, expert mentorship, and a portfolio that gets you
                hired.
              </p>
              <div className="flex gap-4 justify-start sm:flex-row flex-col">
                <Link
                  href="/auth/signup"
                  className="btn btn-primary py-3 px-40 text-[14px] flex items-center gap-2 rounded-full"
                >
                  <LibraryBig size={20} />
                  Start Learning Free
                </Link>
                <Link
                  href="/tracks"
                  className="btn btn-outline py-3 px-4 text-[14px] flex items-center gap-2 rounded-full"
                >
                  <ListChecks size={20} />
                  View Curriculum
                </Link>
              </div>
            </div>
            {/* Hero Image */}
            <div className="w-full h-full max-w-[750px] lg:max-w-full mx-auto aspect-16/12">
              <InvertedCornerImage
                width={"inherit"}
                height={"inherit"}
                imageUrl="/images/Landing-7.webp"
                radius={24}
                notchBg="#fff"
                borderColor="#ffffff00"
              >
                <div className="sm:w-[150px] w-[80px] aspect-square flex justify-center items-center"></div>
              </InvertedCornerImage>
            </div>
          </div>
        </section>

        {/* Learn Everything  */}
        <section className="lg:py-15 py-10">
          <div className="container flex flex-col gap-8 items-center">
            <div>
              <h2 className="text-center mx-auto mb-3 max-w-[700px]">
                Best Place to Learn Everything
              </h2>
              <p className="mb-6 max-w-[400px] mx-auto text-muted-foreground text-center">
                We bridge the gap between self-learning and expensive bootcamps.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-x-6 gap-y-12 w-full">
              {learnEverything.map((item, index) => (
                <div key={index} className="grid grid-rows-[fit_fit] gap-2">
                  {/* <div key={index} className="grid grid-rows-[1fr_fit] gap-10"> */}
                  <div className="w-full flex flex-col gap-4">
                    {/* <div className="w-full h-[260px]"> */}
                    {/* <InvertedCornerImage
                      width={"inherit"}
                      height={"inherit"}
                      imageUrl={item.image}
                      radius={15}
                      notchBg="#fff"
                      borderColor="#ffffff00"
                      position="bottom-left"
                    >
                      <div className="px-4">
                        <h4 className="mt-4 mb-2">{item.title}</h4>
                      </div>
                    </InvertedCornerImage> */}
                    <img
                      src={item.image}
                      style={{
                        width: "inherit",
                        borderRadius: "15px",
                        height: "260px",
                      }}
                    />

                    <h4>{item.title}</h4>
                  </div>

                  <p className="text-black">{item.description}</p>
                </div>
              ))}
            </div>

            <Link
              href="/tracks"
              className="btn btn-outline py-3 px-4 text-[14px] flex items-center gap-2 rounded-full md:mt-10 mt-4 "
              style={{
                color: "var(--muted-foreground)",
              }}
            >
              <LibraryBig size={20} />
              Start Learning
            </Link>
          </div>
        </section>

        {/* Simple Steps */}
        <section className="lg:py-15 py-10">
          <div className="container flex flex-col gap-8 items-center">
            <div>
              <h2 className="text-center mx-auto mb-3 max-w-[700px]">
                Start with three simple steps
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-x-6 gap-y-12 w-full">
              {simpleSteps.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-rows-[1fr_fit_10px] gap-4"
                >
                  <div className="w-full h-[260px] mb-4">
                    <InvertedCornerImage
                      width={"inherit"}
                      height={"inherit"}
                      imageUrl={item.image}
                      radius={15}
                      notchBg="#fff"
                      borderColor="#ffffff00"
                      position="bottom-right"
                    >
                      <div className="px-4">
                        <h4 className="mt-4 mb-2">{item.title}</h4>
                      </div>
                    </InvertedCornerImage>
                  </div>
                  <p className="text-black">{item.description}</p>
                  <div className="">
                    <Link
                      href={item.link}
                      className="btn btn-outline py-3 px-4 text-[14px] flex items-center gap-2 rounded-full"
                      style={{
                        color: "white",
                        backgroundColor: "black",
                      }}
                    >
                      {/* <LibraryBig size={20} /> */}
                      {item.linkText}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* <Link
              href="/tracks"
              className="btn btn-outline py-3 px-4 text-[14px] flex items-center gap-2 rounded-full mt-20"
              style={{
                color: "var(--muted-foreground)",
              }}
            >
              <LibraryBig size={20} />
              Start Learning
            </Link> */}
          </div>
        </section>

        {/* Start Your career */}
        <section className="lg:py-15 py-10">
          <div className="container flex flex-col gap-4 items-center">
            <h2 className="text-center mx-auto mb-3 max-w-[700px]">
              Start your career in tech today!
            </h2>
            <p className="text-center">
              Learn in-demand skills, build real projects, and join a community
              of African innovators.
            </p>
            <div className="flex gap-4 justify-start sm:flex-row flex-col mt-4">
              <Link
                href="/auth/signup"
                className="btn btn-primary py-3 px-40 text-[14px] flex items-center gap-2 rounded-full"
              >
                <LibraryBig size={20} />
                Start Learning Free
              </Link>
              <Link
                href="/tracks"
                className="btn btn-outline py-3 px-4 text-[14px] flex items-center gap-2 rounded-full"
              >
                <ListChecks size={20} />
                View Curriculum
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
