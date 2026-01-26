import React from "react";

const Youtube = ({ id, title, ...rest }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-md pb-[56.25%] bg-black/5">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        {...rest}
      />
    </div>
  );
};

export default Youtube;
