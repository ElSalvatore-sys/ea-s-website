import React from 'react';

const BrainIllustrationPerfect: React.FC = () => {
  return (
    <>
      <style jsx>{`
        .brain-glow {
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))
                  drop-shadow(0 0 40px rgba(168, 85, 247, 0.2))
                  drop-shadow(0 0 60px rgba(236, 72, 153, 0.1));
        }
      `}</style>

      {/* Left Brain - Simple flowing design matching image exactly */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[45vw] h-[85vh] pointer-events-none">
        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full brain-glow">
          {/* Main outer brain silhouette */}
          <path
            d="M 100 150
               Q 50 180, 40 250
               Q 40 320, 60 370
               Q 80 420, 120 450
               Q 160 480, 210 470
               Q 260 460, 290 420
               Q 320 380, 320 320
               Q 320 260, 300 210
               Q 280 160, 240 130
               Q 200 100, 150 110
               Q 100 120, 100 150"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="4"
            fill="none"
          />

          {/* Inner flowing curve 1 */}
          <path
            d="M 140 200
               Q 110 220, 110 270
               Q 110 320, 130 360
               Q 150 400, 190 410
               Q 230 420, 260 390
               Q 290 360, 290 310
               Q 290 260, 270 220
               Q 250 180, 210 170
               Q 170 160, 140 180
               Q 120 190, 140 200"
            stroke="rgba(255, 255, 255, 0.7)"
            strokeWidth="3.5"
            fill="none"
          />

          {/* Inner flowing curve 2 */}
          <path
            d="M 170 250
               Q 150 260, 150 290
               Q 150 320, 165 345
               Q 180 370, 205 375
               Q 230 380, 250 360
               Q 270 340, 270 310
               Q 270 280, 255 255
               Q 240 230, 215 225
               Q 190 220, 170 235
               Q 160 245, 170 250"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="3"
            fill="none"
          />

          {/* Small accent curves */}
          <path d="M 100 200 Q 130 195, 160 200" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
          <path d="M 95 280 Q 135 275, 175 280" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
          <path d="M 100 360 Q 140 355, 180 360" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
        </svg>
      </div>

      {/* Right Brain - Mirrored simple flowing design */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[45vw] h-[85vh] pointer-events-none">
        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full brain-glow">
          {/* Main outer brain silhouette - mirrored */}
          <path
            d="M 300 150
               Q 350 180, 360 250
               Q 360 320, 340 370
               Q 320 420, 280 450
               Q 240 480, 190 470
               Q 140 460, 110 420
               Q 80 380, 80 320
               Q 80 260, 100 210
               Q 120 160, 160 130
               Q 200 100, 250 110
               Q 300 120, 300 150"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="4"
            fill="none"
          />

          {/* Inner flowing curve 1 - mirrored */}
          <path
            d="M 260 200
               Q 290 220, 290 270
               Q 290 320, 270 360
               Q 250 400, 210 410
               Q 170 420, 140 390
               Q 110 360, 110 310
               Q 110 260, 130 220
               Q 150 180, 190 170
               Q 230 160, 260 180
               Q 280 190, 260 200"
            stroke="rgba(255, 255, 255, 0.7)"
            strokeWidth="3.5"
            fill="none"
          />

          {/* Inner flowing curve 2 - mirrored */}
          <path
            d="M 230 250
               Q 250 260, 250 290
               Q 250 320, 235 345
               Q 220 370, 195 375
               Q 170 380, 150 360
               Q 130 340, 130 310
               Q 130 280, 145 255
               Q 160 230, 185 225
               Q 210 220, 230 235
               Q 240 245, 230 250"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="3"
            fill="none"
          />

          {/* Small accent curves - mirrored */}
          <path d="M 300 200 Q 270 195, 240 200" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
          <path d="M 305 280 Q 265 275, 225 280" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
          <path d="M 300 360 Q 260 355, 220 360" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
        </svg>
      </div>
    </>
  );
};

export default BrainIllustrationPerfect;