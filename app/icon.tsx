import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#141518',
          borderRadius: '8px',
          border: '1px solid #2D3036',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Bar */}
          <path
            d="M4 7C4 5.89543 4.89543 5 6 5H26C27.1046 5 28 5.89543 28 7V9C28 10.1046 27.1046 11 26 11H6C4.89543 11 4 10.1046 4 9V7Z"
            fill="#FFFFFF"
          />
          {/* Stem */}
          <path
            d="M13.5 11H18.5V25C18.5 26.1046 17.6046 27 16.5 27H15.5C14.3954 27 13.5 26.1046 13.5 25V11Z"
            fill="#CCD2DA"
          />
          {/* Left Arc */}
          <path
            d="M9.5 14.5C8.2 16.2 7.5 18.2 7.5 20.5C7.5 22.8 8.2 24.8 9.5 26.5"
            stroke="#4F83FF"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Right Arc */}
          <path
            d="M22.5 14.5C23.8 16.2 24.5 18.2 24.5 20.5C24.5 22.8 23.8 24.8 22.5 26.5"
            stroke="#B6F554"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Core Dot */}
          <circle cx="16" cy="18" r="1.8" fill="#FDF166" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
