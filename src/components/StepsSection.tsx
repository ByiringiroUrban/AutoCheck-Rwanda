import Link from "next/link";
const steps = [
  {
    title: "Step 1. Find Your Car",
    body: "Search by vehicle identification number (VIN) or US license plate to find the car you want to research.",
  },
  {
    title: "Step 2. Pick Your Plan",
    body: "Multiple Reports if you're still shopping and considering many vehicles. A single report might be right for you if you've found your dream car and are ready to buy.",
  },
  {
    title: "Step 3. Check Your Vehicle History",
    body: "from your desktop. One time fee. No recurring charges",
  },
];

export function StepsSection() {
  return (
    <div className="ac-container">
      <div className="mx-[-10.5px] flex flex-wrap">
        <div className="my-[42px] w-full px-[10.5px] md:w-1/2">
          <h2 className="mb-[7px] py-[3.5px] text-[28px] font-bold leading-[28px] text-ac-ink">
            Get The AutoCheck Report
          </h2>
          {steps.map((step) => (
            <div key={step.title}>
              <h3 className="mb-[7px] text-[20px] min-[769px]:text-[22.5px] font-bold leading-[28px] text-ac-blue">
                {step.title}
              </h3>
              <p className="mb-[14px] text-[14px] leading-[21px]">{step.body}</p>
            </div>
          ))}
          <div className="mb-[21px]">
            <Link href="/#vehiclehistoryreport" className="ac-btn w-fit no-underline">
              Get AutoCheck Report
            </Link>
          </div>
          <a
            href="/vehiclehistory/sample-vehicle-history-report"
            className="text-[14px] leading-[21px] text-ac-blue hover:underline"
          >
            See Sample Reports &gt;&gt;
          </a>
        </div>
        <div className="mt-[42px] mb-[21px] w-full px-[10.5px] md:w-5/12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/reportexample.jpg"
            alt="AutoCheck Report Pages"
            width={618}
            height={610}
            className="h-auto max-w-full"
          />
        </div>
      </div>
    </div>
  );
}
