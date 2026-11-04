import Image from "next/image";

export function PartnersSection() {
  return (
    <section className="ac-container mt-[14px] mb-[42px]" aria-labelledby="partners-heading">
      <div className="mx-[-10.5px] px-[10.5px] text-center">
        <h2
          id="partners-heading"
          className="m-0 mb-5 text-[20px] font-bold leading-7 text-ac-blue min-[769px]:text-[22.5px]"
        >
          Proud to partner with Ingoga Auto
        </h2>
        <div className="mx-auto flex min-h-32 max-w-2xl items-center justify-center rounded-xl border border-solid border-[#e5e9ec] bg-white p-4 shadow-sm sm:p-6">
          <Image
            src="/ingogaAuto.jpeg"
            alt="Ingoga Auto — You click, we deliver!"
            width={1600}
            height={500}
            sizes="(max-width: 640px) 90vw, 640px"
            className="h-auto max-h-40 w-full max-w-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}
