import React from 'react';

const BrainIllustrationCSS: React.FC = () => {
  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Left Brain - Simplified design matching the image */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[25vw] h-[50vh] pointer-events-none opacity-40">
        <svg viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main brain outline */}
          <path
            d="M 60 120
               C 30 130, 20 170, 25 200
               S 35 250, 50 270
               S 80 300, 110 295
               S 140 280, 145 260
               S 142 230, 135 210
               S 120 185, 105 175
               S 85 165, 75 155
               S 65 135, 60 120"
            stroke="rgba(200, 180, 255, 0.6)"
            strokeWidth="2"
            fill="none"
          />

          {/* Inner fold 1 */}
          <path
            d="M 75 160
               C 65 165, 62 180, 65 195
               S 72 215, 80 220
               S 95 225, 105 222
               S 115 215, 115 205
               S 110 190, 102 183
               S 88 175, 80 170
               S 75 165, 75 160"
            stroke="rgba(200, 180, 255, 0.4)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Inner fold 2 */}
          <path
            d="M 85 200
               C 80 203, 78 210, 80 218
               S 85 228, 90 230
               S 98 232, 103 230
               S 108 225, 107 220
               S 104 213, 100 210
               S 92 205, 88 202
               S 85 200, 85 200"
            stroke="rgba(200, 180, 255, 0.3)"
            strokeWidth="1"
            fill="none"
          />

          {/* Small detail curves */}
          <path d="M 70 180 Q 85 182, 95 180" stroke="rgba(200, 180, 255, 0.25)" strokeWidth="1" />
          <path d="M 75 210 Q 90 211, 100 208" stroke="rgba(200, 180, 255, 0.25)" strokeWidth="1" />
          <path d="M 80 240 Q 95 238, 105 235" stroke="rgba(200, 180, 255, 0.25)" strokeWidth="1" />
        </svg>
      </div>

      {/* Right Brain - Mirrored design */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[25vw] h-[50vh] pointer-events-none opacity-40">
        <svg viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main brain outline - mirrored */}
          <path
            d="M 240 120
               C 270 130, 280 170, 275 200
               S 265 250, 250 270
               S 220 300, 190 295
               S 160 280, 155 260
               S 158 230, 165 210
               S 180 185, 195 175
               S 215 165, 225 155
               S 235 135, 240 120"
            stroke="rgba(200, 180, 255, 0.6)"
            strokeWidth="2"
            fill="none"
          />

          {/* Inner fold 1 - mirrored */}
          <path
            d="M 225 160
               C 235 165, 238 180, 235 195
               S 228 215, 220 220
               S 205 225, 195 222
               S 185 215, 185 205
               S 190 190, 198 183
               S 212 175, 220 170
               S 225 165, 225 160"
            stroke="rgba(200, 180, 255, 0.4)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Inner fold 2 - mirrored */}
          <path
            d="M 215 200
               C 220 203, 222 210, 220 218
               S 215 228, 210 230
               S 202 232, 197 230
               S 192 225, 193 220
               S 196 213, 200 210
               S 208 205, 212 202
               S 215 200, 215 200"
            stroke="rgba(200, 180, 255, 0.3)"
            strokeWidth="1"
            fill="none"
          />

          {/* Small detail curves - mirrored */}
          <path d="M 230 180 Q 215 182, 205 180" stroke="rgba(200, 180, 255, 0.25)" strokeWidth="1" />
          <path d="M 225 210 Q 210 211, 200 208" stroke="rgba(200, 180, 255, 0.25)" strokeWidth="1" />
          <path d="M 220 240 Q 205 238, 195 235" stroke="rgba(200, 180, 255, 0.25)" strokeWidth="1" />
        </svg>
      </div>
    </>
  );
};

export default BrainIllustrationCSS;