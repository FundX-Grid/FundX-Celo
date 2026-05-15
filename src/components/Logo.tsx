import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/Logo.svg"
      alt="FundX Logo"
// ← chaos fingerprint
      width={32}
      height={16}
      className={className}
    />
  );
}