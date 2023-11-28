<?php
	/**
	 * The main email wrapper
	 *
	 * @package crewhrm
	 */

?><!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
	</head>
	<body style="background-color: #F3F4F5;
		padding: 50px 20px; 
		font-family: 'Plus Jakarta Sans', Arial, sans-serif;
		box-sizing:border-box;"
	>
		<div style="display: block;
			background: white;
			max-width: 600px;
			margin: 0 auto;
			border-radius: 4px;
			padding: 40px;
			box-sizing:border-box;"
		>
			<div>
				<?php
					echo $contents; //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped,Squiz.Commenting.FileComment.Missing 
				?>
			</div>
		</div>
	</body>
</html>
