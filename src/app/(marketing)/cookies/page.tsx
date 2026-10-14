import ComplianceDoc from "@/components/marketing/ComplianceDoc";
import { compliance } from "@/content/site";

export default function CookiesPage() {
  const c = compliance.cookies;
  return (
    <ComplianceDoc kicker="Legal · Cookies" title={c.title} updated={c.updated} intro={c.intro} sections={c.sections} />
  );
}
