import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | AutoCheck Rwanda",
  description:
    "Learn how AutoCheck Rwanda collects, processes, shares, and protects personal data and vehicle records under Rwanda Law No. 058/2021.",
};

const sectionClass = "scroll-mt-24";
const headingClass = "mb-3 text-xl font-bold text-ac-blue";
const listClass = "list-disc space-y-2 pl-5 text-[14px]";

export default function PrivacyPage() {
  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="bg-[#f8f9fa] py-10">
        <div className="ac-container max-w-4xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Privacy Policy for AutoCheck Rwanda
            </h1>
            <div className="mt-3 space-y-1 text-[14px] text-gray-600">
              <p><strong>Effective Date:</strong> Nov 04, 2026</p>
              <p><strong>Operating Entity:</strong> AutoCheck Rwanda (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)</p>
              <p><strong>Jurisdiction:</strong> Republic of Rwanda</p>
            </div>
          </header>

          <article className="space-y-8 rounded-lg border border-[#e2e8f0] bg-white p-6 text-[15px] leading-relaxed text-gray-700 shadow-sm sm:p-8">
            <section className={sectionClass}>
              <h2 className={headingClass}>1. Introduction &amp; Statutory Framework</h2>
              <p>
                AutoCheck Rwanda is committed to protecting personal data and
                user privacy in compliance with{" "}
                <strong>
                  Law No. 058/2021 of 13/10/2021 relating to the protection of
                  personal data and privacy
                </strong>{" "}
                of Rwanda. This Privacy Policy explains how personal data and
                vehicle record information are collected, processed, shared,
                stored, and protected when you access our platform, mobile
                interfaces, or related automotive verification services.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>2. Information We Collect</h2>
              <p className="mb-4">We collect data across three principal categories:</p>

              <h3 className="mb-2 font-bold text-ac-ink">A. User &amp; Account Data</h3>
              <ul className={`${listClass} mb-5`}>
                <li>
                  <strong>Individual Users / Owners / Buyers:</strong> Full
                  name, email address, phone number, encrypted password/auth
                  tokens, and identity document details where required for
                  owner claim verification.
                </li>
                <li>
                  <strong>Garages &amp; Dealers:</strong> Business name, Tax
                  Identification Number (TIN), business registration documents,
                  location, contact details, and authorized staff details.
                </li>
              </ul>

              <h3 className="mb-2 font-bold text-ac-ink">
                B. Vehicle Data &amp; Provenance Information
              </h3>
              <ul className={`${listClass} mb-5`}>
                <li>
                  <strong>Vehicle Identity:</strong> Vehicle Identification
                  Number (VIN), current and historical Rwanda registration
                  plate numbers, make, model, model year, fuel type, body type,
                  and color.
                </li>
                <li>
                  <strong>History Records:</strong> Maintenance logs, repair
                  details, structured inspection checklists, part details,
                  mileage readings, and incident/accident reports submitted by
                  authorized garages, admins, or owners.
                </li>
                <li>
                  <strong>Visual Data:</strong> Exterior photographs uploaded
                  for visual condition checking and AI inspection analysis.
                </li>
              </ul>

              <h3 className="mb-2 font-bold text-ac-ink">C. Technical Data</h3>
              <ul className={listClass}>
                <li>
                  IP addresses, login timestamps, device details, and system
                  usage logs for security auditing.
                </li>
              </ul>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>3. Purpose of Data Processing</h2>
              <p className="mb-3">We collect and process your data to:</p>
              <ul className={listClass}>
                <li>
                  Verify vehicle identities and establish a transparent, central
                  vehicle history database anchored by VIN.
                </li>
                <li>
                  Enable authorized garages to record verified maintenance,
                  service, inspection, and mileage events.
                </li>
                <li>
                  Provide dynamic vehicle history reports and AutoCheck
                  condition/risk scores to prospective buyers.
                </li>
                <li>
                  Process visible exterior defect analysis via AI computer
                  vision models.
                </li>
                <li>
                  Authenticate platform users and enforce role-based permissions
                  (Owner, Garage Staff, Dealer, Admin).
                </li>
                <li>Manage dispute resolution workflows for contested vehicle record entries.</li>
                <li>Comply with applicable legal, regulatory, and tax requirements in Rwanda.</li>
              </ul>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>4. Data Provenance &amp; Public Exposure Rules</h2>
              <p className="mb-3">
                To protect user privacy while ensuring commercial transparency:
              </p>
              <ul className={listClass}>
                <li>
                  <strong>Public Vehicle Reports:</strong> Publicly accessible
                  vehicle reports include vehicle identity (VIN/plate), mileage
                  timeline, garage service entries, AI visual inspection
                  findings, and computed risk scores. Sensitive personal
                  ownership details (e.g., owner&rsquo;s full name, national ID,
                  address, and phone number) are masked or omitted from public
                  buyer searches.
                </li>
                <li>
                  <strong>Source Labeling:</strong> Every historical event
                  explicitly identifies its source (
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-[13px]">
                    approved_garage
                  </code>
                  ,{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-[13px]">
                    vehicle_owner
                  </code>
                  ,{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-[13px]">
                    autocheck_admin
                  </code>
                  ,{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-[13px]">
                    ai_analysis
                  </code>
                  , or{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-[13px]">
                    legacy_import
                  </code>
                  ) so users understand record provenance. Owner-submitted
                  records are visually designated as self-reported and cannot
                  overwrite independently verified garage logs.
                </li>
              </ul>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>5. Third-Party Data Sharing &amp; Disclosures</h2>
              <p className="mb-3">We do not sell personal data. Data may be shared only under the following circumstances:</p>
              <ul className={listClass}>
                <li>
                  <strong>Participating Garages &amp; Mechanics:</strong>{" "}
                  Sharing vehicle identity details necessary to link service,
                  repair, or inspection entries.
                </li>
                <li>
                  <strong>Car Dealerships &amp; Commercial Partners:</strong>{" "}
                  Displaying inventory condition reports where agreed by the
                  business.
                </li>
                <li>
                  <strong>Regulatory &amp; Government Authorities:</strong>{" "}
                  Disclosing information when legally mandated (e.g., National
                  Cyber Security Authority - NCSA, Rwanda Revenue Authority -
                  RRA, or law enforcement requests compliant with Rwandan law).
                </li>
              </ul>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>6. Data Security Measures</h2>
              <p className="mb-3">
                In accordance with Law No. 058/2021, AutoCheck Rwanda implements
                technical and organizational security measures, including:
              </p>
              <ul className={listClass}>
                <li>
                  <strong>Encryption:</strong> Data in transit is encrypted
                  using HTTPS/TLS protocols; sensitive database assets are
                  encrypted at rest.
                </li>
                <li>
                  <strong>Password Hashing:</strong> Passwords are stored using
                  strong, non-reversible cryptographic algorithms (e.g.,
                  bcrypt/Argon2).
                </li>
                <li>
                  <strong>Access Control:</strong> Role-based access control
                  (RBAC) ensures users, garage staff, and administrators access
                  only authorized endpoints.
                </li>
                <li>
                  <strong>Audit Logs:</strong> System actions (record edits,
                  approvals, role modifications, disputes) are captured in
                  administrative audit logs.
                </li>
              </ul>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>7. User Rights under Law No. 058/2021</h2>
              <p className="mb-3">
                Users retain the following statutory rights regarding their
                personal data:
              </p>
              <ul className={listClass}>
                <li>
                  <strong>Right to Access:</strong> Request a copy of personal
                  data held by the platform.
                </li>
                <li>
                  <strong>Right to Rectification:</strong> Request corrections
                  to inaccurate personal details or submit a formal record
                  dispute with supporting evidence for contested vehicle
                  entries.
                </li>
                <li>
                  <strong>Right to Erasure / Deletion:</strong> Request the
                  deletion of personal account data, subject to legitimate
                  legal retention obligations.
                </li>
                <li>
                  <strong>Right to Object / Withdraw Consent:</strong> Withdraw
                  consent for optional processing activities.
                </li>
              </ul>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>8. Dispute &amp; Record Correction Process</h2>
              <p className="mb-3">
                If a vehicle owner or garage identifies incorrect or disputed
                history entries:
              </p>
              <ol className="list-decimal space-y-2 pl-5 text-[14px]">
                <li>
                  Submit a dispute case via the platform with supporting
                  documentation or evidence.
                </li>
                <li>
                  An administrator reviews data provenance and the submitted
                  evidence.
                </li>
                <li>
                  If justified, corrected or versioned data entries are created
                  while maintaining audit trail history to preserve ledger
                  integrity.
                </li>
              </ol>
            </section>

            <section className={sectionClass}>
              <h2 className={headingClass}>9. Contact Information</h2>
              <p className="mb-3">
                For privacy inquiries, exercising statutory rights, or
                submitting record dispute requests, contact:
              </p>
              <ul className={listClass}>
                <li><strong>Data Controller:</strong> AutoCheck Rwanda</li>
                <li>
                  <strong>Email:</strong>{" "}
                  <a
                    className="font-semibold text-ac-blue underline"
                    href="mailto:byiringirourban20@gmail.com"
                  >
                    byiringirourban20@gmail.com
                  </a>
                </li>
                <li>
                  <strong>Phone / WhatsApp:</strong>{" "}
                  <a className="font-semibold text-ac-blue underline" href="tel:0788854243">
                    0788854243
                  </a>
                </li>
                <li><strong>Location:</strong> Rwanda</li>
              </ul>
            </section>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
