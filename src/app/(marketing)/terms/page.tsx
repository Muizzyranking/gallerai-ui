import ComplianceDoc from "@/components/marketing/ComplianceDoc";
import { compliance } from "@/content/site";

export default function TermsPage() {
  const c = compliance.terms;
  return (
    <ComplianceDoc kicker="Legal · Terms" title={c.title} updated={c.updated} intro={c.intro} sections={c.sections} />
  );
}
