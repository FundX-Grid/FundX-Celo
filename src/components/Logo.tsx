import Image from "next/image";
import { logoConfig } from '../utils/constants';

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={logoConfig.src}
      alt={logoConfig.alt}
      width={logoConfig.width}
      height={logoConfig.height}
      className={className}
    />
  );
}
