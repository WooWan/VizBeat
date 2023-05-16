import * as React from 'react';
import { SVGProps } from 'react';

const PlayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-step-forward"
    {...props}
  >
    <path d="M6 4v16M10 4l10 8-10 8z" />
  </svg>
);
export default PlayIcon;
