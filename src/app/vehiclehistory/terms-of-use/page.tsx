import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | AutoCheck Rwanda",
  description:
    "Read the terms governing access to and use of the AutoCheck Rwanda vehicle verification and history platform.",
};

const headingClass = "mb-3 text-xl font-bold text-ac-blue";
const listClass = "list-disc space-y-2 pl-5 text-[14px]";

export default function TermsOfUsePage() {
  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="bg-[#f8f9fa] py-10">
        <div className="ac-container max-w-4xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              AutoCheck Rwanda Terms of Service / Terms of Use
            </h1>
            <div className="mt-3 space-y-1 text-[14px] text-gray-600">
              <p><strong>Effective Date:</strong> Nov 04, 2026</p>
              <p><strong>Operating Entity:</strong> AutoCheck Rwanda (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)</p>
              <p><strong>Jurisdiction:</strong> Republic of Rwanda</p>
            </div>
          </header>

          <article className="space-y-8 rounded-lg border border-[#e2e8f0] bg-white p-6 text-[15px] leading-relaxed text-gray-700 shadow-sm sm:p-8">
            <section>
              <h2 className={headingClass}>1. Acceptance of Terms</h2>
              <p>
                By accessing, browsing, or using the AutoCheck Rwanda platform&mdash;including
                vehicle history searches, inspection uploads, owner registration,
                or garage recording tools&mdash;you agree to be bound by these Terms
                of Service. If you do not agree to these terms, you must not
                access or use the platform.
              </p>
            </section>

            <section>
              <h2 className={headingClass}>2. Platform Overview &amp; Scope</h2>
              <p className="mb-3">
                AutoCheck Rwanda is a digital vehicle verification, inspection,
                and history platform designed to centralize automotive records
                across vehicle owners, participating garages, car dealerships,
                and prospective buyers in Rwanda.
              </p>
              <ul className={listClass}>
                <li>
                  <strong>Vehicle Identity:</strong> Vehicles are primarily
                  identified by their unique 17-character Vehicle Identification
                  Number (VIN) and searchable by Rwanda registration plate
                  numbers.
                </li>
                <li>
                  <strong>AI Inspection Capabilities:</strong> Exterior AI image
                  analysis serves as visual inspection assistance. AI findings
                  evaluate visible exterior damage (e.g., dents, scratches,
                  rust, and body panel defects) and do not constitute a
                  mechanical or safety certification.
                </li>
                <li>
                  <strong>Data Limitations:</strong> AutoCheck Rwanda aggregates
                  records provided by participating garages, registered vehicle
                  owners, administrative data entries, and computer vision
                  models. Reports present available recorded events and do not
                  guarantee an exhaustive history of unrecorded offline events.
                </li>
              </ul>
            </section>

            <section>
              <h2 className={headingClass}>3. User Roles and Account Responsibilities</h2>
              <p className="mb-3">
                Users accessing protected areas of the platform must register
                an account and adhere to role-specific requirements:
              </p>
              <ul className={listClass}>
                <li>
                  <strong>Public Visitors / Buyers:</strong> Granted
                  non-exclusive, non-transferable access to search vehicles and
                  view generated vehicle reports for personal, non-commercial
                  evaluation.
                </li>
                <li>
                  <strong>Vehicle Owners:</strong> Responsible for submitting
                  accurate ownership details and permitted maintenance records.
                  False claims or fraudulent ownership submissions may result
                  in account termination.
                </li>
                <li>
                  <strong>Garages &amp; Inspectors:</strong> Approved garages
                  warrant that all service, repair, inspection, parts, and
                  mileage entries are truthful, accurate, and recorded by
                  authorized staff.
                </li>
                <li>
                  <strong>Account Security:</strong> Users are responsible for
                  safeguarding login credentials and for activities conducted
                  under their account.
                </li>
              </ul>
            </section>

            <section>
              <h2 className={headingClass}>4. Data Provenance &amp; Trust Model</h2>
              <p className="mb-3">To maintain historical accuracy and transparency:</p>
              <ul className={listClass}>
                <li>
                  Every record explicitly labels its source (
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-[13px]">approved_garage</code>
                  ,{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-[13px]">vehicle_owner</code>
                  ,{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-[13px]">autocheck_admin</code>
                  ,{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-[13px]">ai_analysis</code>
                  , or{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5 text-[13px]">legacy_import</code>
                  ).
                </li>
                <li>
                  Owner-submitted data is visually designated as self-reported
                  and cannot overwrite or alter verified garage or
                  administrative records.
                </li>
                <li>
                  Odometer readings are tracked chronologically. Suspicious
                  sequence changes or potential rollbacks are flagged as
                  computed warnings within reports.
                </li>
              </ul>
            </section>

            <section>
              <h2 className={headingClass}>5. Record Disputes &amp; Correction Process</h2>
              <p className="mb-3">
                If a vehicle owner, garage, or user identifies inaccurate or
                contested vehicle history entries:
              </p>
              <ol className="list-decimal space-y-2 pl-5 text-[14px]">
                <li>
                  Submit a dispute request through the platform with supporting
                  evidence or documentation.
                </li>
                <li>
                  AutoCheck Rwanda administrators review the submitted evidence
                  against original records.
                </li>
                <li>
                  If a correction is justified, updated or versioned records
                  are established while preserving administrative audit trails
                  for data integrity.
                </li>
              </ol>
            </section>

            <section>
              <h2 className={headingClass}>6. Intellectual Property Rights</h2>
              <p>
                All software, frontend designs, user interfaces, branding,
                logos, algorithms, AI visual analysis models, dynamic scoring
                tools, and compiled reports are the exclusive property of
                AutoCheck Rwanda or its licensors. Users are granted a limited
                license to download and print individual vehicle reports for
                personal or internal evaluation.
              </p>
            </section>

            <section>
              <h2 className={headingClass}>7. Disclaimers &amp; Limitation of Liability</h2>
              <ul className={listClass}>
                <li>
                  <strong>&ldquo;As-Is&rdquo; Service:</strong> Vehicle reports
                  and inspection findings are provided on an &ldquo;as is&rdquo;
                  and &ldquo;as available&rdquo; basis.
                </li>
                <li>
                  <strong>Physical Inspection Recommendation:</strong> Buyers
                  are strongly advised to perform a physical mechanical
                  inspection before completing any used-vehicle transaction.
                </li>
                <li>
                  <strong>Liability Cap:</strong> AutoCheck Rwanda shall not be
                  liable for indirect, incidental, or consequential damages
                  resulting from unrecorded historical vehicle events, buyer
                  purchasing decisions, or visual AI analysis limitations.
                </li>
              </ul>
            </section>

            <section>
              <h2 className={headingClass}>8. Termination &amp; Modifications</h2>
              <p>
                AutoCheck Rwanda reserves the right to suspend or terminate
                user accounts, revoke garage authorizations, or modify platform
                features at any time for violations of these Terms. We may
                update these Terms of Service periodically, and continued use
                of the platform indicates acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className={headingClass}>9. Governing Law &amp; Dispute Resolution</h2>
              <p>
                These Terms are governed by and construed in accordance with
                the laws of the <strong>Republic of Rwanda</strong>. Any
                disputes arising under or in connection with these Terms shall
                be subject to the exclusive jurisdiction of the courts of
                Rwanda.
              </p>
            </section>

            <section>
              <h2 className={headingClass}>10. Contact Details</h2>
              <p className="mb-3">
                For legal inquiries, terms clarification, or dispute
                submissions, contact:
              </p>
              <ul className={listClass}>
                <li><strong>Entity:</strong> AutoCheck Rwanda</li>
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
