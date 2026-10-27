import Image from "next/image";
import Link from "next/link";

/** Header lock-up: the flat brand mark plus the Solvitech wordmark. */
export default function BrandLogo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="group inline-flex items-center gap-2.5 rounded-md outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft"
      aria-label="Solvitech home"
    >
      <Image src="/brand/solvitech-mark.svg" alt="" width={443} height={588} unoptimized priority className="h-7 w-auto" />
      <span className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-foreground">Solvitech</span>
    </Link>
  );
}
