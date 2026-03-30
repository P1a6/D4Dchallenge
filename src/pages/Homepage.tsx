import { Link } from "react-router-dom";

export default function HomePage() {
    return (
     <>   
    <section className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Mieterstrom Profitability Calculator
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600">
        Estimate the profitability of a solar energy (Mieterstrom) project for
        your apartment building in just a few clicks.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          to="/calculator"
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-[#47C0ED] hover:text-white"
        >
          Open Calculator
        </Link>
        <Link
          to="/task-overview"
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-[#47C0ED] hover:text-white"
        >
          Task Overview
        </Link>
      </div>
    </section>
    </>
  );
}


