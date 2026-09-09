import ComplianceDoc from "@/components/marketing/ComplianceDoc";
import { compliance } from "@/content/site";

export default function PrivacyPage() {
  const c = compliance.privacy;
  return <ComplianceDoc kicker="Legal · Privacy" title={c.title} updated={c.updated} intro={c.intro} sections={c.sections} />;
}
