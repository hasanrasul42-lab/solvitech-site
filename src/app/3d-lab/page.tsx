import type { Metadata } from "next";
import LogoLab from "@/components/logo-lab/LogoLab";

export const metadata: Metadata = {
  title: "3D Logo Lab | Solvitech",
  robots: { index: false, follow: false },
};

export default function ThreeDLabPage() {
  return (
    <div className="min-h-svh flex-1 bg-[#080D17] text-slate-200">
      <LogoLab />
    </div>
  );
}
