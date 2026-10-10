import { PolicyPage, policyMetadata } from "@/components/policy-page";

export const generateMetadata = () => policyMetadata("shipping-policy");

export default function Page() {
  return <PolicyPage slug="shipping-policy" />;
}
