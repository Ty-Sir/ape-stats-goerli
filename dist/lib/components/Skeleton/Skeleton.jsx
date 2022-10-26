import React from "react";
export const Skeleton = ({ height, backgroundColor }) => {
    return (<span style={{
            display: "inline-block",
            boxSizing: 'border-box',
            height: height ? height : '1.125rem',
            backgroundColor: backgroundColor ? backgroundColor : "#DDDBDD",
            borderRadius: "3px",
            width: "-webkit-fill-available",
            alignSelf: 'end',
            minWidth: "2.5rem"
        }}/>);
};
