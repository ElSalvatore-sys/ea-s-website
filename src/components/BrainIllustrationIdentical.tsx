import React from 'react';

const BrainIllustrationIdentical: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }

        .brain-svg {
          filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.4))
                  drop-shadow(0 0 60px rgba(236, 72, 153, 0.2));
          animation: pulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* Left Brain - Exact copy of image design */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 -translate-x-[10%] w-[35vw] h-[70vh] pointer-events-none z-0">
        <svg viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full brain-svg">
          {/* Outer brain boundary */}
          <g>
            <path
              d="M 80 120
                 C 40 130, 20 170, 20 220
                 C 20 270, 30 320, 50 360
                 C 70 400, 100 420, 140 420
                 C 180 420, 210 400, 230 360
                 C 250 320, 260 270, 260 220
                 C 260 170, 240 130, 200 120
                 C 180 115, 160 115, 140 120
                 C 120 125, 100 120, 80 120"
              stroke="rgba(255, 255, 255, 0.95)"
              strokeWidth="4.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Top inner lobe */}
            <path
              d="M 100 160
                 C 80 165, 70 180, 70 200
                 C 70 220, 80 235, 100 240
                 C 120 245, 140 240, 155 225
                 C 170 210, 170 190, 155 175
                 C 140 160, 120 155, 100 160"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Middle inner lobe */}
            <path
              d="M 120 230
                 C 100 235, 90 250, 90 270
                 C 90 290, 100 305, 120 310
                 C 140 315, 160 310, 175 295
                 C 190 280, 190 260, 175 245
                 C 160 230, 140 225, 120 230"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Bottom inner lobe */}
            <path
              d="M 100 320
                 C 85 325, 75 335, 75 350
                 C 75 365, 85 375, 100 380
                 C 115 385, 130 380, 140 370
                 C 150 360, 150 345, 140 335
                 C 130 325, 115 320, 100 320"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Connecting curves */}
            <path d="M 60 180 C 90 178, 120 180, 150 185" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" />
            <path d="M 55 250 C 95 248, 135 250, 175 255" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" />
            <path d="M 60 330 C 100 328, 140 330, 180 335" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Right Brain - Mirrored exact copy */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 translate-x-[10%] w-[35vw] h-[70vh] pointer-events-none z-0">
        <svg viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full brain-svg">
          {/* Outer brain boundary - mirrored */}
          <g>
            <path
              d="M 220 120
                 C 260 130, 280 170, 280 220
                 C 280 270, 270 320, 250 360
                 C 230 400, 200 420, 160 420
                 C 120 420, 90 400, 70 360
                 C 50 320, 40 270, 40 220
                 C 40 170, 60 130, 100 120
                 C 120 115, 140 115, 160 120
                 C 180 125, 200 120, 220 120"
              stroke="rgba(255, 255, 255, 0.95)"
              strokeWidth="4.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Top inner lobe - mirrored */}
            <path
              d="M 200 160
                 C 220 165, 230 180, 230 200
                 C 230 220, 220 235, 200 240
                 C 180 245, 160 240, 145 225
                 C 130 210, 130 190, 145 175
                 C 160 160, 180 155, 200 160"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Middle inner lobe - mirrored */}
            <path
              d="M 180 230
                 C 200 235, 210 250, 210 270
                 C 210 290, 200 305, 180 310
                 C 160 315, 140 310, 125 295
                 C 110 280, 110 260, 125 245
                 C 140 230, 160 225, 180 230"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Bottom inner lobe - mirrored */}
            <path
              d="M 200 320
                 C 215 325, 225 335, 225 350
                 C 225 365, 215 375, 200 380
                 C 185 385, 170 380, 160 370
                 C 150 360, 150 345, 160 335
                 C 170 325, 185 320, 200 320"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Connecting curves - mirrored */}
            <path d="M 240 180 C 210 178, 180 180, 150 185" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" />
            <path d="M 245 250 C 205 248, 165 250, 125 255" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" />
            <path d="M 240 330 C 200 328, 160 330, 120 335" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </>
  );
};

export default BrainIllustrationIdentical;