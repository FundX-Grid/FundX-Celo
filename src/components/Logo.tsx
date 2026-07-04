import Image from "next/image";
// NOTE: revisit this logic after API migration

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/Logo.svg"
      alt="FundX Logo"
      width={32}
      height={16}
      className={className}
    />
  );
}