import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MapPinIcon, BriefcaseIcon } from "@/components/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at AutoCheck Rwanda | Join Our Kigali Team",
  description: "Explore career opportunities in automotive data, software engineering, and customer operations at AutoCheck Rwanda.",
};

export default function CareersPage() {
  const openings = [
    {
      title: "Senior Full-Stack Software Engineer (TypeScript / Next.js)",
      department: "Engineering",
      location: "Kigali, Rwanda (Hybrid)",
      type: "Full-time",
      desc: "Build scalable APIs and user interfaces integrating nationwide vehicle registry data and real-time report generation.",
    },
    {
      title: "Automotive Data & Registry Operations Analyst",
      department: "Data Operations",
      location: "Kigali, Rwanda",
      type: "Full-time",
      desc: "Work with Rwanda Revenue Authority (RRA) vehicle databases, customs clearing logs, and international auction datasets to curate vehicle records.",
    },
    {
      title: "Dealer Partnerships & Enterprise Sales Lead",
      department: "Commercial & Sales",
      location: "Kigali, Rwanda",
      type: "Full-time",
      desc: "Drive adoption of AutoCheck reports and inventory tools across top car dealerships, banks, and vehicle financing firms in Rwanda.",
    },
    {
      title: "Customer Support Specialist (Kinyarwanda, English, French)",
      department: "Customer Experience",
      location: "Kigali, Rwanda",
      type: "Full-time",
      desc: "Assist car buyers, importers, and vehicle owners with report inquiries, VIN verifications, and payment support.",
    },
  ];

  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Careers at AutoCheck Rwanda
            </h1>
            <p className="mt-2 text-[15px] text-[#555]">
              We are on a mission to bring total transparency, security, and digital confidence to vehicle transactions across Rwanda and East Africa.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-[#e2e8f0] p-8 shadow-sm mb-10">
            <h2 className="text-2xl font-bold text-ac-blue mb-4">Why Work With Us?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold text-ac-ink text-[16px] mb-1">Impactful Mission</h3>
                <p className="text-[13px] text-gray-600">Protect thousands of Rwandan families and businesses from fraud and unsafe vehicles.</p>
              </div>
              <div>
                <h3 className="font-bold text-ac-ink text-[16px] mb-1">Innovation Hub</h3>
                <p className="text-[13px] text-gray-600">Work in Kigali&apos;s thriving tech ecosystem with modern development stacks and data pipelines.</p>
              </div>
              <div>
                <h3 className="font-bold text-ac-ink text-[16px] mb-1">Growth & Benefits</h3>
                <p className="text-[13px] text-gray-600">Competitive salaries, comprehensive health insurance (RSSB + Private), and flexible hybrid work.</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ac-ink mb-6">Open Positions in Kigali</h2>
            <div className="space-y-4">
              {openings.map((job) => (
                <div key={job.title} className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm hover:border-ac-blue transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-ac-ink">{job.title}</h3>
                    <span className="text-[12px] font-semibold bg-[#e0f2fe] text-[#0369a1] px-2.5 py-1 rounded w-fit">
                      {job.type}
                    </span>
                  </div>
                  <div className="flex gap-4 text-[13px] text-gray-500 mb-3 items-center">
                    <span className="flex items-center gap-1.5">
                      <MapPinIcon width={14} height={14} className="text-ac-blue" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BriefcaseIcon width={14} height={14} className="text-ac-blue" />
                      {job.department}
                    </span>
                  </div>
                  <p className="text-[14px] text-gray-600 mb-4">{job.desc}</p>
                  <a
                    href="mailto:careers@autocheck.rw?subject=Application for Job"
                    className="ac-btn inline-block text-white font-medium px-5 py-2 text-[14px] no-underline"
                  >
                    Apply Now via Email
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
