import { Headphones, Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { reasons } from "@/data/company";

const icons = {
  genuine: ShieldCheck,
  secure: Lock,
  shipping: Truck,
  returns: RotateCcw,
  support: Headphones,
} as const;

/** "Why shop with us" strip under the hero. */
export function TrustBar() {
  return (
    <section aria-labelledby="why-us" className="border-b border-line">
      <div className="container-site py-6">
        <h2 id="why-us" className="sr-only">
          Why shop with us
        </h2>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
          {reasons.map((r) => {
            const Icon = icons[r.icon];
            return (
              <li key={r.title} className="flex items-start gap-3">
                <Icon className="mt-0.5 size-6 shrink-0 text-blue" aria-hidden strokeWidth={1.75} />
                <div>
                  <p className="text-sm font-semibold">{r.title}</p>
                  <p className="text-sm text-muted">{r.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
