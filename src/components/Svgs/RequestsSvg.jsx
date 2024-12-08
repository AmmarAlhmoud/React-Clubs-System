const RequestsSvg = ({ color }) => {
  const styles = {
    fill: "none",
    // stroke: color ? color : "#fff",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.5,
  };

  return (
    <svg
      width="26"
      height="26"
      fill={`${color ? color : "#fff"}`}
      viewBox="0 0 24 24"
      id="check-mark-circle-2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeWidth="1.5" strokeLinecap="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          id="primary"
          d="M20.94,11A8.26,8.26,0,0,1,21,12a9,9,0,1,1-9-9,8.83,8.83,0,0,1,4,1"
          {...styles}
          stroke='#fff'
        />
        <polyline
          id="primary-2"
          data-name="primary"
          points="21 5 12 14 8 10"
          {...styles}
          stroke='#fff'
        />
      </g>
    </svg>
  );
};

export default RequestsSvg;
