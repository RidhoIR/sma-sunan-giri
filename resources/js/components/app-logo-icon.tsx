import React, { ImgHTMLAttributes } from "react";

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/sma.png"
            alt="Laravel Starter Kit"
            {...props}
        />
    );
}
