import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = "", width = 32, height = 32 }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/favicon.svg"
        alt="investigaree logo"
        width={width}
        height={height}
        className="w-auto h-auto"
        priority
      />
      <span className="text-2xl font-bold gradient-text">investigaree</span>
    </div>
  );
}
