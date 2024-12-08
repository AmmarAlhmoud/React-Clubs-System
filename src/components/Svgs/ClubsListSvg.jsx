const ClubsListSvg = ({color}) => {
  return (
    <svg
      
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeWidth="1.5" strokeLinecap="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16"
          stroke={`${color ? color : "#fff"}`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
        id="clublist"
          d="M16 10.5C16 11.3284 15.5523 12 15 12C14.4477 12 14 11.3284 14 10.5C14 9.67157 14.4477 9 15 9C15.5523 9 16 9.67157 16 10.5Z"
          fill={`${color ? color : "#fff"}`}
        />
        <ellipse
          cx="9"
          cy="10.5"
          rx="1"
          ry="1.5"
          fill={`${color ? color : "#fff"}`}
        />
        <path
          d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
          stroke={`${color ? color : "#fff"}`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export default ClubsListSvg;
