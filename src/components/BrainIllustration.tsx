import React from 'react';

const BrainIllustration: React.FC = () => {
  return (
    <>
      {/* Left Brain - Large and detailed like in the design */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[35vw] h-[70vh] pointer-events-none">
        <svg viewBox="0 0 500 700" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main outer brain curve */}
          <path
            d="M 80 200
               Q 40 220, 30 280
               T 35 350
               Q 30 400, 45 450
               Q 60 500, 90 520
               Q 120 540, 150 530
               Q 180 520, 190 490
               Q 195 460, 185 430
               Q 180 400, 175 370
               Q 172 340, 170 310
               Q 168 280, 165 250
               Q 160 220, 145 195
               Q 120 170, 85 180
               Q 70 190, 80 200"
            stroke="url(#leftGradient1)"
            strokeWidth="3"
            fill="none"
            opacity="0.4"
          />

          {/* Second brain layer */}
          <path
            d="M 100 230
               Q 70 250, 65 300
               T 70 360
               Q 68 400, 80 440
               Q 95 475, 120 490
               Q 145 505, 165 495
               Q 180 485, 185 460
               Q 188 435, 180 410
               Q 175 385, 170 360
               Q 167 335, 165 310
               Q 162 285, 158 260
               Q 153 235, 140 215
               Q 125 200, 105 210
               Q 95 220, 100 230"
            stroke="url(#leftGradient2)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.35"
          />

          {/* Third inner layer */}
          <path
            d="M 120 260
               Q 95 275, 92 315
               T 95 365
               Q 94 395, 105 425
               Q 115 450, 135 460
               Q 150 470, 165 462
               Q 175 454, 178 435
               Q 180 416, 175 397
               Q 171 378, 167 359
               Q 164 340, 162 321
               Q 159 302, 156 283
               Q 152 264, 143 248
               Q 132 235, 118 242
               Q 112 248, 120 260"
            stroke="url(#leftGradient3)"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />

          {/* Additional curved lines for detail */}
          <path d="M 90 280 Q 110 285, 125 290 T 145 295" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1.5" />
          <path d="M 95 320 Q 115 322, 130 325 T 150 328" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="1.5" />
          <path d="M 100 360 Q 120 361, 135 363 T 155 365" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1.5" />
          <path d="M 105 400 Q 125 399, 140 398 T 160 396" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="1.5" />

          {/* Neural connection dots */}
          <circle cx="85" cy="290" r="3" fill="rgba(236, 72, 153, 0.4)" />
          <circle cx="100" cy="330" r="2.5" fill="rgba(168, 85, 247, 0.35)" />
          <circle cx="115" cy="370" r="3" fill="rgba(236, 72, 153, 0.4)" />
          <circle cx="130" cy="410" r="2" fill="rgba(168, 85, 247, 0.3)" />
          <circle cx="145" cy="310" r="2.5" fill="rgba(236, 72, 153, 0.35)" />
          <circle cx="160" cy="350" r="2" fill="rgba(168, 85, 247, 0.3)" />

          <defs>
            <linearGradient id="leftGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="leftGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="leftGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Right Brain - Mirrored and large */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[35vw] h-[70vh] pointer-events-none">
        <svg viewBox="0 0 500 700" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main outer brain curve - mirrored */}
          <path
            d="M 420 200
               Q 460 220, 470 280
               T 465 350
               Q 470 400, 455 450
               Q 440 500, 410 520
               Q 380 540, 350 530
               Q 320 520, 310 490
               Q 305 460, 315 430
               Q 320 400, 325 370
               Q 328 340, 330 310
               Q 332 280, 335 250
               Q 340 220, 355 195
               Q 380 170, 415 180
               Q 430 190, 420 200"
            stroke="url(#rightGradient1)"
            strokeWidth="3"
            fill="none"
            opacity="0.4"
          />

          {/* Second brain layer - mirrored */}
          <path
            d="M 400 230
               Q 430 250, 435 300
               T 430 360
               Q 432 400, 420 440
               Q 405 475, 380 490
               Q 355 505, 335 495
               Q 320 485, 315 460
               Q 312 435, 320 410
               Q 325 385, 330 360
               Q 333 335, 335 310
               Q 338 285, 342 260
               Q 347 235, 360 215
               Q 375 200, 395 210
               Q 405 220, 400 230"
            stroke="url(#rightGradient2)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.35"
          />

          {/* Third inner layer - mirrored */}
          <path
            d="M 380 260
               Q 405 275, 408 315
               T 405 365
               Q 406 395, 395 425
               Q 385 450, 365 460
               Q 350 470, 335 462
               Q 325 454, 322 435
               Q 320 416, 325 397
               Q 329 378, 333 359
               Q 336 340, 338 321
               Q 341 302, 344 283
               Q 348 264, 357 248
               Q 368 235, 382 242
               Q 388 248, 380 260"
            stroke="url(#rightGradient3)"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />

          {/* Additional curved lines for detail - mirrored */}
          <path d="M 410 280 Q 390 285, 375 290 T 355 295" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1.5" />
          <path d="M 405 320 Q 385 322, 370 325 T 350 328" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="1.5" />
          <path d="M 400 360 Q 380 361, 365 363 T 345 365" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1.5" />
          <path d="M 395 400 Q 375 399, 360 398 T 340 396" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="1.5" />

          {/* Neural connection dots - mirrored */}
          <circle cx="415" cy="290" r="3" fill="rgba(236, 72, 153, 0.4)" />
          <circle cx="400" cy="330" r="2.5" fill="rgba(168, 85, 247, 0.35)" />
          <circle cx="385" cy="370" r="3" fill="rgba(236, 72, 153, 0.4)" />
          <circle cx="370" cy="410" r="2" fill="rgba(168, 85, 247, 0.3)" />
          <circle cx="355" cy="310" r="2.5" fill="rgba(236, 72, 153, 0.35)" />
          <circle cx="340" cy="350" r="2" fill="rgba(168, 85, 247, 0.3)" />

          <defs>
            <linearGradient id="rightGradient1" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="rightGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="rightGradient3" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
};

export default BrainIllustration;