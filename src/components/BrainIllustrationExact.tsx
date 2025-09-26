import React from 'react';

const BrainIllustrationExact: React.FC = () => {
  return (
    <>
      {/* Left Brain - Exact recreation from image */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-[40vw] h-[80vh] pointer-events-none">
        <svg viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Large outer brain curve */}
          <path
            d="M 150 180
               C 80 190, 40 250, 40 320
               C 40 380, 55 440, 90 480
               C 125 520, 175 540, 230 540
               C 285 540, 330 510, 360 460
               C 390 410, 400 350, 400 290
               C 400 230, 385 170, 340 130
               C 295 90, 230 70, 180 90
               C 150 105, 140 140, 150 180"
            stroke="url(#leftBrainGradient)"
            strokeWidth="3"
            fill="none"
            opacity="0.8"
          />

          {/* Main inner brain fold */}
          <path
            d="M 180 220
               C 130 230, 100 280, 100 340
               C 100 390, 115 440, 145 470
               C 175 500, 215 515, 255 510
               C 295 505, 325 475, 340 435
               C 355 395, 355 350, 345 310
               C 335 270, 310 235, 275 220
               C 240 205, 200 210, 180 220"
            stroke="url(#leftBrainGradient)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.6"
          />

          {/* Secondary inner fold */}
          <path
            d="M 210 280
               C 180 290, 160 320, 160 360
               C 160 395, 170 430, 190 450
               C 210 470, 235 480, 260 475
               C 285 470, 305 450, 315 420
               C 325 390, 325 360, 315 335
               C 305 310, 285 290, 255 285
               C 230 280, 210 280, 210 280"
            stroke="url(#leftBrainGradient)"
            strokeWidth="2"
            fill="none"
            opacity="0.4"
          />

          {/* Small inner detail */}
          <path
            d="M 230 340
               C 215 345, 205 360, 205 380
               C 205 400, 215 415, 230 420
               C 245 425, 260 420, 270 405
               C 280 390, 280 370, 270 355
               C 260 340, 245 335, 230 340"
            stroke="url(#leftBrainGradient)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.3"
          />

          {/* Decorative curved lines */}
          <path d="M 120 250 Q 200 240, 280 250" stroke="url(#leftBrainGradient)" strokeWidth="1" opacity="0.25" />
          <path d="M 110 320 Q 210 310, 310 320" stroke="url(#leftBrainGradient)" strokeWidth="1" opacity="0.25" />
          <path d="M 120 390 Q 200 380, 280 390" stroke="url(#leftBrainGradient)" strokeWidth="1" opacity="0.25" />
          <path d="M 130 460 Q 210 450, 290 460" stroke="url(#leftBrainGradient)" strokeWidth="1" opacity="0.25" />

          <defs>
            <linearGradient id="leftBrainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E879F9" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#C084FC" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Right Brain - Mirrored exact recreation */}
      <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-[40vw] h-[80vh] pointer-events-none">
        <svg viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Large outer brain curve - mirrored */}
          <path
            d="M 350 180
               C 420 190, 460 250, 460 320
               C 460 380, 445 440, 410 480
               C 375 520, 325 540, 270 540
               C 215 540, 170 510, 140 460
               C 110 410, 100 350, 100 290
               C 100 230, 115 170, 160 130
               C 205 90, 270 70, 320 90
               C 350 105, 360 140, 350 180"
            stroke="url(#rightBrainGradient)"
            strokeWidth="3"
            fill="none"
            opacity="0.8"
          />

          {/* Main inner brain fold - mirrored */}
          <path
            d="M 320 220
               C 370 230, 400 280, 400 340
               C 400 390, 385 440, 355 470
               C 325 500, 285 515, 245 510
               C 205 505, 175 475, 160 435
               C 145 395, 145 350, 155 310
               C 165 270, 190 235, 225 220
               C 260 205, 300 210, 320 220"
            stroke="url(#rightBrainGradient)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.6"
          />

          {/* Secondary inner fold - mirrored */}
          <path
            d="M 290 280
               C 320 290, 340 320, 340 360
               C 340 395, 330 430, 310 450
               C 290 470, 265 480, 240 475
               C 215 470, 195 450, 185 420
               C 175 390, 175 360, 185 335
               C 195 310, 215 290, 245 285
               C 270 280, 290 280, 290 280"
            stroke="url(#rightBrainGradient)"
            strokeWidth="2"
            fill="none"
            opacity="0.4"
          />

          {/* Small inner detail - mirrored */}
          <path
            d="M 270 340
               C 285 345, 295 360, 295 380
               C 295 400, 285 415, 270 420
               C 255 425, 240 420, 230 405
               C 220 390, 220 370, 230 355
               C 240 340, 255 335, 270 340"
            stroke="url(#rightBrainGradient)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.3"
          />

          {/* Decorative curved lines - mirrored */}
          <path d="M 380 250 Q 300 240, 220 250" stroke="url(#rightBrainGradient)" strokeWidth="1" opacity="0.25" />
          <path d="M 390 320 Q 290 310, 190 320" stroke="url(#rightBrainGradient)" strokeWidth="1" opacity="0.25" />
          <path d="M 380 390 Q 300 380, 220 390" stroke="url(#rightBrainGradient)" strokeWidth="1" opacity="0.25" />
          <path d="M 370 460 Q 290 450, 210 460" stroke="url(#rightBrainGradient)" strokeWidth="1" opacity="0.25" />

          <defs>
            <linearGradient id="rightBrainGradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E879F9" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#C084FC" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
};

export default BrainIllustrationExact;