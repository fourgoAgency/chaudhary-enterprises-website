import { PolicyPage, policyMetadata } from "@/components/policy-page";

export const generateMetadata = () => policyMetadata("returns-policy");

export default function Page() {
  return <PolicyPage slug="returns-policy" />;
}
