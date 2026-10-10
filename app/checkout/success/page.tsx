import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/checkout/order-confirmation";

export const metadata: Metadata = {
  title: "Order placed",
  robots: { index: false },
};

async function Confirmation({ searchParams }: { searchParams: PageProps<"/checkout/success">["searchParams"] }) {
  const order = (await searchParams).order;
  return <OrderConfirmation orderNumber={typeof order === "string" ? order : undefined} />;
}

export default function CheckoutSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  return (
    <div className="container-site py-12 sm:py-16">
      <Suspense fallback={<div className="mx-auto h-80 max-w-2xl animate-pulse bg-ivory" />}>
        <Confirmation searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
