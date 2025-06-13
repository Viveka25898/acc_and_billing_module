import IncomeTaxForm from "../components/IncomeTaxForm";

export default function IncomeTaxDetailsPage() {
  return (
    <div className="p-6 bg-white text-green-800 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Income Tax Statutory Details</h1>
      <IncomeTaxForm />
    </div>
  );
}