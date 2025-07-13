import React from 'react';

const WaveBackground = () => (
  <svg
    viewBox="0 0 1440 150"
    className="absolute left-0 bottom-0 w-full"
    xmlns="http://www.w3.org/2000/svg"
    style={{ zIndex: 1 }}
  >
    <path
      d="M0,80 C180,120 360,40 540,80 C720,120 900,40 1080,80 C1260,120 1440,40 1440,40 L1440,150 L0,150 Z"
      fill="#fff"
    />
  </svg>
);

export default WaveBackground; 