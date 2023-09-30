import React, { useEffect, useRef } from "react";
import { isFirstLetterCapitalized } from "../utilities/helpers.jsx";

export function RenderExternal({component: Comp, payload={}}) {

	const reff = useRef();
	const is_component = isFirstLetterCapitalized(Comp.toString().replace('function ', ''));

	useEffect(()=>{

		if ( ! is_component && reff && reff.current) {
			Comp(reff.current, payload);
		}

	}, [Comp, reff.current]);

	return is_component ? <Comp {...payload}/> : <div ref={reff}></div>
}
