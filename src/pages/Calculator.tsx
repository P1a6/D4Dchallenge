import { useState } from "react";

type InputMode = "roof" | "kWp" | "address";

interface CalculatorInputs {
  roofSize: string;
  systemSizeKwp: string;
  apartments: string;
  annualDemand: string;
}

interface CalculationResults {
  systemSizeKwp: number;
  totalInvestment: number;
  annualProduction: number;
  internalConsumptionRevenue: number;
  feedInRevenue: number;
  totalAnnualRevenue: number;
  annualOM: number;
  annualProfit: number;
  paybackPeriod: number;
  roi: number;
  coveragePercent: number;
}

function calculate(inputs: CalculatorInputs, mode: InputMode): CalculationResults | null {
  const apartments = parseFloat(inputs.apartments);
  const annualDemand = parseFloat(inputs.annualDemand);

  let systemSizeKwp: number;

  if (mode === "roof") {
    const roofSize = parseFloat(inputs.roofSize);
    if (isNaN(roofSize) || roofSize <= 0) return null;
    systemSizeKwp = roofSize / 5;
  } else {
    systemSizeKwp = parseFloat(inputs.systemSizeKwp);
    if (isNaN(systemSizeKwp) || systemSizeKwp <= 0) return null;
  }

  if (isNaN(apartments) || apartments <= 0 || isNaN(annualDemand) || annualDemand <= 0) return null;

  // Constants
  const SOLAR_YIELD = 950; // kWh/kWp/year
  const COST_PER_KWP = 1000; // €/kWp
  const TENANT_PRICE = 0.30; // €/kWh
  const FEED_IN_TARIFF = 0.08; // €/kWh
  const SELF_CONSUMPTION_RATIO = 0.35;
  const FEED_IN_RATIO = 0.65;
  const OM_RATE = 0.01; // 1% of investment

  const totalInvestment = systemSizeKwp * COST_PER_KWP;
  const annualProduction = systemSizeKwp * SOLAR_YIELD;
  const internalConsumption = annualProduction * SELF_CONSUMPTION_RATIO;
  const feedIn = annualProduction * FEED_IN_RATIO;
  const internalConsumptionRevenue = internalConsumption * TENANT_PRICE;
  const feedInRevenue = feedIn * FEED_IN_TARIFF;
  const totalAnnualRevenue = internalConsumptionRevenue + feedInRevenue;
  const annualOM = totalInvestment * OM_RATE;
  const annualProfit = totalAnnualRevenue - annualOM;
  const paybackPeriod = annualProfit > 0 ? totalInvestment / annualProfit : Infinity;
  const roi = (annualProfit / totalInvestment) * 100;
  const coveragePercent = Math.min((internalConsumption / annualDemand) * 100, 100);

  return {
    systemSizeKwp,
    totalInvestment,
    annualProduction,
    internalConsumptionRevenue,
    feedInRevenue,
    totalAnnualRevenue,
    annualOM,
    annualProfit,
    paybackPeriod,
    roi,
    coveragePercent,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: decimals }).format(value);
}

interface ResultCardProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}

function ResultCard({ label, value, sub, highlight = false }: ResultCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm border ${
        highlight
          ? "bg-sky-500 border-sky-400 text-white"
          : "bg-white border-gray-100 text-gray-800"
      }`}
    >
      <p className={`text-sm font-medium ${highlight ? "text-sky-100" : "text-gray-500"}`}>{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? "text-white" : "text-gray-900"}`}>{value}</p>
      {sub && <p className={`mt-1 text-xs ${highlight ? "text-sky-100" : "text-gray-400"}`}>{sub}</p>}
    </div>
  );
}

export default function CalculatorPage() {
  const [mode, setMode] = useState<InputMode>("roof");
  const [inputs, setInputs] = useState<CalculatorInputs>({
    roofSize: "",
    systemSizeKwp: "",
    apartments: "",
    annualDemand: "",
  });
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculate(inputs, mode);
    if (!result) {
      setError("Please fill in all fields with valid positive numbers.");
      setResults(null);
    } else {
      setResults(result);
      setError("");
    }
  };

  const handleReset = () => {
    setInputs({ roofSize: "", systemSizeKwp: "", apartments: "", annualDemand: "" });
    setResults(null);
    setError("");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Profitability Calculator</h1>
        <p className="mt-3 text-gray-500 text-base max-w-xl mx-auto">
          Enter your building details below to estimate the profitability of a Mieterstrom solar project.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-6">
          {/* Input Mode Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Solar System Input Method</label>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 w-fit">
              <button
                type="button"
                onClick={() => { setMode("roof"); setError(""); }}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  mode === "roof" ? "bg-sky-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Roof Size (m²)
              </button>
              <button
                type="button"
                onClick={() => { setMode("kWp"); setError(""); }}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  mode === "kWp" ? "bg-sky-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                System Size (kWp)
              </button>
              <button
                type="button"
                onClick={() => { setMode("kWp"); setError(""); }}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  mode === "address" ? "bg-sky-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Address
             </button>
            </div>
          </div>

          {/* Dynamic Input */}
          {mode === "roof" ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Roof Size <span className="font-normal text-gray-400">(m²)</span>
              </label>
              <input
                type="number"
                name="roofSize"
                value={inputs.roofSize}
                onChange={handleChange}
                placeholder="e.g. 75"
                min="1"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
              <p className="mt-1 text-xs text-gray-400">System size = Roof size ÷ 5 (kWp)</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                System Size <span className="font-normal text-gray-400">(kWp)</span>
              </label>
              <input
                type="number"
                name="systemSizeKwp"
                value={inputs.systemSizeKwp}
                onChange={handleChange}
                placeholder="e.g. 15"
                min="1"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
          )}

          {/* Number of Apartments */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Apartments</label>
            <input
              type="number"
              name="apartments"
              value={inputs.apartments}
              onChange={handleChange}
              placeholder="e.g. 4"
              min="1"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* Annual Demand */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Annual Electricity Demand <span className="font-normal text-gray-400">(kWh/year)</span>
            </label>
            <input
              type="number"
              name="annualDemand"
              value={inputs.annualDemand}
              onChange={handleChange}
              placeholder="e.g. 13000"
              min="1"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}

          {/* Assumptions */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-xs text-gray-500 space-y-1">
            <p className="font-semibold text-gray-600 mb-2">Calculation Assumptions</p>
            <p>-  Solar yield: 950 kWh/kWp/year</p>
            <p>- System cost: 1,000 €/kWp</p>
            <p>- Tenant electricity price: 0.30 €/kWh</p>
            <p>- Grid feed-in tariff: 0.08 €/kWh</p>
            <p>- Self-consumption: 35% | Feed-in: 65%</p>
            <p>- Annual O&M: 1% of investment</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-600"
            >
              Calculate
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="space-y-4">
          {!results ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <div>
                <p className="text-4xl mb-3"></p>
                <p className="text-sm font-medium text-gray-500">Your results will appear here.</p>
                <p className="text-xs text-gray-400 mt-1">Fill in the form and click Calculate.</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-800">Results</h2>

              <ResultCard
                label="Total Investment"
                value={formatCurrency(results.totalInvestment)}
                sub={`${formatNumber(results.systemSizeKwp, 1)} kWp system`}
              />

              <ResultCard
                label="Annual Solar Production"
                value={`${formatNumber(results.annualProduction)} kWh/year`}
                sub={`${formatNumber(results.coveragePercent, 1)}% of building demand covered`}
              />

              <div className="grid grid-cols-2 gap-4">
                <ResultCard
                  label="Internal Revenue"
                  value={formatCurrency(results.internalConsumptionRevenue)}
                  sub="From tenant consumption"
                />
                <ResultCard
                  label="Feed-in Revenue"
                  value={formatCurrency(results.feedInRevenue)}
                  sub="Grid surplus"
                />
              </div>

              <ResultCard
                label="Total Annual Revenue"
                value={formatCurrency(results.totalAnnualRevenue)}
                sub={`After O&M costs (${formatCurrency(results.annualOM)}/year)`}
              />

              <div className="grid grid-cols-2 gap-4">
                <ResultCard
                  label="Annual Profit"
                  value={formatCurrency(results.annualProfit)}
                  highlight
                />
                <ResultCard
                  label="ROI"
                  value={`${formatNumber(results.roi, 1)}%`}
                  highlight
                />
              </div>

              {/* <ResultCard
                label="Payback Period"
                value={
                  results.paybackPeriod === Infinity
                    ? "Not profitable"
                    : `${formatNumber(results.paybackPeriod, 1)} years`
                }
                sub="Time to recover investment"
              /> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
