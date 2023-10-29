<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
		<style>
			.mailer-body{
				background-color: lightgray;
			}

			.mailer-content-wrapper{
				display: block;
				background: white;
				max-width: 550px;
				margin: 20px auto;
				border-radius: 7px;
				padding: 15px;
			}
			
			<?php require __DIR__ . '/layout.css'; ?>
		</style>
	</head>
	<body class="mailer-body">
		<div class="mailer-content-wrapper">
			<div class="mailer-header">

			</div>
			<div class="mailer-content">
				<?php echo $contents; ?>
			</div>
			<div class="mailer-footer">

			</div>
		</div>
	</body>
</html>
