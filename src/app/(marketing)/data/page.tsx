import ComplianceDoc from "@/components/marketing/ComplianceDoc";
import { compliance } from "@/content/site";

export default function DataPage() {
  const c = compliance.data;
  return <ComplianceDoc kicker="Trust · Faces and data" title={c.title} updated={c.updated} intro={c.intro} sections={c.sections} />;
}
