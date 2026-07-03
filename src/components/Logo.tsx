import Image from 'next/image';

const LOGO_PROPS = {
  src: '/Logo.svg',
  alt: 'FundX Logo',
  width: 32,
  height: 16,
};

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={LOGO_PROPS.src}
      alt={LOGO_PROPS.alt}
      width={LOGO_PROPS.width}
      height={LOGO_PROPS.height}
      className={className}
    />
  );
}