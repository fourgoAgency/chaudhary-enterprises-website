// Brand icons not provided by lucide-react. Social glyphs adapted from Lucide (ISC licence).

type IconProps = React.SVGProps<SVGSVGElement>;

const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function LinkedinIcon(props: IconProps) {
  return (
    <svg {...stroke} aria-hidden {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...stroke} aria-hidden {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...stroke} aria-hidden {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

/** Simple, neutral payment-method badges for the footer (decorative; list is announced as text). */
export function PaymentBadges({ className }: { className?: string }) {
  const badge = "flex h-7 w-11 items-center justify-center rounded-[3px] bg-ivory-light text-navy-deep";
  return (
    <ul className={className} aria-label="Accepted payment methods">
      <li className={badge} title="Visa">
        <span className="sr-only">Visa</span>
        <span aria-hidden className="text-[11px] font-extrabold tracking-tight italic">
          VISA
        </span>
      </li>
      <li className={badge} title="Mastercard">
        <span className="sr-only">Mastercard</span>
        <svg viewBox="0 0 32 20" className="h-4" aria-hidden>
          <circle cx="12" cy="10" r="7" fill="#EB001B" />
          <circle cx="20" cy="10" r="7" fill="#F79E1B" fillOpacity="0.9" />
        </svg>
      </li>
      <li className={badge} title="American Express">
        <span className="sr-only">American Express</span>
        <span aria-hidden className="text-[9px] font-extrabold tracking-tight">
          AMEX
        </span>
      </li>
      <li className={badge} title="Apple Pay">
        <span className="sr-only">Apple Pay</span>
        <span aria-hidden className="text-[9px] font-semibold">
          Apple Pay
        </span>
      </li>
      <li className={badge} title="Google Pay">
        <span className="sr-only">Google Pay</span>
        <span aria-hidden className="text-[9px] font-semibold">
          G Pay
        </span>
      </li>
    </ul>
  );
}
