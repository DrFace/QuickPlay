import { SVGAttributes } from "react";

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <img
            className="w-[200px] h-[auto] object-contain"
            src="/assets/images/ai-geeks.png"
            alt=""
        />
    );
}
