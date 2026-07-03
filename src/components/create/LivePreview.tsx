import { CampaignCard } from "@/components/fundx/CampaignCard"

export function LivePreview({ formData }: { formData: any }) {
  const isCUSD = formData.currency === "cUSD";

  const renderMetadataField = (label: string, value: string | number) => (
    <div className="flex items-center gap-2 text-slate-500">
      <span className="w-20 text-xs uppercase font-semibold">{label}:</span>
      <span className="text-slate-900">{value || "..."}</span>
    </div>
  );

  return (
    <div className="sticky top-32 space-y-6">
      <div className="text-center">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Live Preview</p>
      </div>
      
      <div className="transform scale-110 origin-top">
        <CampaignCard 
          id="preview"
          title={formData.title || "Untitled Campaign"}
          description={formData.tagline || "Your campaign description will appear here..."}
          raised={0}
          goal={Number(formData.goal) || 10000}
          image={formData.image || \