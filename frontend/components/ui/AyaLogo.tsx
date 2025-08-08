interface AyaLogoProps {
  className?: string
}

export function AyaLogo({ className = "h-8 w-8" }: AyaLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle - Orange */}
      <circle
        cx="16"
        cy="16"
        r="15"
        fill="url(#gradient1)"
        stroke="#f97316"
        strokeWidth="2"
      />
      
      {/* Inner geometric pattern - Blue accent */}
      <path
        d="M16 6L22 12L16 18L10 12L16 6Z"
        fill="#3b82f6"
        opacity="0.8"
      />
      
      {/* Center dot - White */}
      <circle
        cx="16"
        cy="12"
        r="2"
        fill="white"
      />
      
      {/* Bottom arc - Grey */}
      <path
        d="M8 20C8 20 12 24 16 24C20 24 24 20 24 20"
        stroke="#737373"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      <defs>
        <linearGradient
          id="gradient1"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
  )
}
