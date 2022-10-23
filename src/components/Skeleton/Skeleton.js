import React from "react";

export const Skeleton = (props) => {
  return(
    <span
      style={{
        display: "inline-block",
        height: '1.125rem',
        backgroundColor: "#DDDBDD",
        borderRadius: "3px",
        width: "-webkit-fill-available",
        ...props
      }}
    />
  )
}