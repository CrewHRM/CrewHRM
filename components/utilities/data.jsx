import { __ } from "./helpers";

export function remunerationBasises() {
	return {
		hourly : __( 'Hourly' ),
		daily  : __( 'Daily' ),
		weekly : __( 'Weekly' ),
		monthly: __( 'Mothnly' ),
		yearly : __( 'Yearly' )
	}
}