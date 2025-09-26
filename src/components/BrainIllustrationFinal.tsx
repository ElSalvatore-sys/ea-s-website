import React from 'react';

const BrainIllustrationFinal: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .brain-container {
          animation: float 6s ease-in-out infinite;
        }

        .brain-stroke {
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))
                  drop-shadow(0 0 40px rgba(168, 85, 247, 0.3));
        }
      `}</style>

      {/* Left Brain - Exact Match to Image */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[15%] w-[30vw] h-[65vh] pointer-events-none brain-container">
        <svg viewBox="0 0 250 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main outer curve */}
          <path
            d="M 70 100
               C 30 110, 10 150, 10 200
               C 10 250, 20 300, 40 330
               C 60 360, 90 370, 130 365
               C 170 360, 200 330, 210 290
               C 220 250, 215 210, 200 170
               C 185 130, 160 100, 120 95
               C 95 92, 75 95, 70 100"
            stroke="rgba(255, 255, 255, 0.95)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            className="brain-stroke"
          />

          {/* Top brain lobe */}
          <path
            d="M 90 140
               C 70 145, 60 165, 65 185
               C 70 205, 85 215, 105 210
               C 125 205, 135 185, 130 165
               C 125 145, 110 135, 90 140"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
            className="brain-stroke"
          />

          {/* Middle brain lobe */}
          <path
            d="M 100 210
               C 75 215, 65 235, 70 255
               C 75 275, 95 285, 115 280
               C 135 275, 145 255, 140 235
               C 135 215, 120 205, 100 210"
            stroke="rgba(255, 255, 255, 0.75)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="brain-stroke"
          />

          {/* Small inner detail */}
          <path
            d="M 110 265
               C 95 268, 88 280, 92 292
               C 96 304, 108 310, 120 307
               C 132 304, 138 292, 134 280
               C 130 268, 122 262, 110 265"
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            className="brain-stroke"
          />
        </svg>
      </div>

      {/* Right Brain - Mirrored Exact Match */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[15%] w-[30vw] h-[65vh] pointer-events-none brain-container">
        <svg viewBox="0 0 250 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main outer curve - mirrored */}
          <path
            d="M 180 100
               C 220 110, 240 150, 240 200
               C 240 250, 230 300, 210 330
               C 190 360, 160 370, 120 365
               C 80 360, 50 330, 40 290
               C 30 250, 35 210, 50 170
               C 65 130, 90 100, 130 95
               C 155 92, 175 95, 180 100"
            stroke="rgba(255, 255, 255, 0.95)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            className="brain-stroke"
          />

          {/* Top brain lobe - mirrored */}
          <path
            d="M 160 140
               C 180 145, 190 165, 185 185
               C 180 205, 165 215, 145 210
               C 125 205, 115 185, 120 165
               C 125 145, 140 135, 160 140"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
            className="brain-stroke"
          />

          {/* Middle brain lobe - mirrored */}
          <path
            d="M 150 210
               C 175 215, 185 235, 180 255
               C 175 275, 155 285, 135 280
               C 115 275, 105 255, 110 235
               C 115 215, 130 205, 150 210"
            stroke="rgba(255, 255, 255, 0.75)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="brain-stroke"
          />

          {/* Small inner detail - mirrored */}
          <path
            d="M 140 265
               C 155 268, 162 280, 158 292
               C 154 304, 142 310, 130 307
               C 118 304, 112 292, 116 280
               C 120 268, 128 262, 140 265"
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            className="brain-stroke"
          />
        </svg>
      </div>
    </>
  );
};

export default BrainIllustrationFinal;