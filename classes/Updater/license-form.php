<?php 
	$license       = $this->get_license();
	$product_title = $this->content_name;
	$class_name    = $license ? ( $license['activated'] ? 'lms-pro-license-is-valid' : 'lms-pro-license-is-invalid' ) : '';
	$field_value   = $license ? ( $license['license_key'] ?? '' ) : '';
	$js_data       = array( 
		'ajaxurl'      => admin_url( 'admin-ajax.php' ),
		'action'       => $this->activate_action,
		'nonce'        => wp_create_nonce( $this->activate_nonce ),
		'content_name' => $this->product_unique_name
	);
?>

<style>
	.lms-pro-license-window {
		margin-right: 20px;
	}

	.lms-pro-license-card {
		width: 730px;
		max-width: 100%;
		background: #FFFFFF;
		padding: 30px 56px;
		margin: 100px auto;
		box-sizing: border-box;
		box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
		border-radius: 10px;
	}

	@media (max-width: 767.98px) {
		.lms-pro-license-card {
			padding: 20px 30px;
			margin: 30px auto;
		}
	}

	.lms-pro-license-alert-success,
	.lms-pro-license-alert-error {
		position: relative;
		box-sizing: border-box;
		padding: 30px 30px 30px 78px;
		margin: 0px -32px 34px;
		border-radius: 6px;
	}

	@media (max-width: 767.98px) {
		.lms-pro-license-alert-success,
		.lms-pro-license-alert-error {
			padding: 20px 15px 20px 68px;
			margin: 0px -15px 34px;
		}
	}

	.lms-pro-license-alert-success {
		background: #F5FBF7;
		color: #075A2A;
		border: 1px solid #CBE9D5;
	}

	.lms-pro-license-alert-error {
		background: #FFF7F7;
		color: #C62828;
		border: 1px solid #FDD9D7;
	}

	.lms-pro-license-alert-icon {
		position: absolute;
		top: 20px;
		left: 20px;
	}

	@media (max-width: 767.98px) {
		.lms-pro-license-alert-icon {
			top: 15px;
			left: 10px;
		}
	}

	.lms-pro-license-alert-title {
		font-style: normal;
		font-weight: bold;
		font-size: 20px;
		line-height: 30px;
		margin: 0 0 10px 0;
	}

	.lms-pro-license-alert-message {
		font-weight: normal;
		font-size: 15px;
		line-height: 24px;
	}

	.lms-pro-license-fieldset {
		display: flex;
		margin-bottom: 30px;
	}

	.lms-pro-license-fieldset-label,
	.lms-pro-license-fieldset-content {
		font-size: 16px;
		line-height: 26px;
	}

	.lms-pro-license-fieldset-label {
		width: 160px;
		flex: 0 0 160px;
		font-weight: normal;
		color: #353535;
	}

	.lms-pro-license-fieldset-content {
		font-weight: 500;
		color: #161616;
		flex-grow: 1;
	}

	.lms-pro-license-field {
		position: relative;
	}

	.lms-pro-license-fieldset-content input[type="text"] {
		display: block;
		padding: 9px 12px;
		width: 100%;
	}

	.lms-pro-license-is-valid,
	.lms-pro-license-is-invalid {
		background-repeat: no-repeat;
		background-position: calc(100% - 10px) 50%;
		padding-right: 38px;
	}

	.lms-pro-license-is-valid {
		border-color: #075A2A !important;
	}

	.lms-pro-license-is-valid:focus {
		box-shadow: 0 0 0 1px #075A2A !important;
	}

	.lms-pro-license-is-invalid {
		border-color: #E53935 !important;
	}

	.lms-pro-license-is-invalid:focus {
		box-shadow: 0 0 0 1px #E53935 !important;
	}

	.lms-pro-license-help-text {
		font-weight: normal;
		font-size: 13px;
		line-height: 18px;
		color: #7A7A7A;
		margin-top: 10px;
	}

	.lms-pro-license-actions {
		padding-top: 20px;
		text-align: right;
		margin-bottom: 20px;
	}

	.lms-pro-license-actions .button {
		padding: 6px 13px;
	}
</style>

<div class="lms-pro-license-window">
    <div class="lms-pro-license-card">
        <div>
            <h1><?php echo $this->content_name . ' ' . __( 'License' ); ?></h1>
        </div>

        <?php if ( $license !== null ) : ?>
            <?php if ( $license['activated'] == true ) : ?>
                <div class="lms-pro-license-alert-success">
                    <div class="lms-pro-license-alert-icon">
                        <svg width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg"><defs/><path fill-rule="evenodd" clip-rule="evenodd" d="M24 41c9.389 0 17-7.611 17-17S33.389 7 24 7 7 14.611 7 24s7.611 17 17 17zm-8.434-16.145a.928.928 0 00.19.29l6.023 6c.08.093.178.168.288.22a.97.97 0 00.74 0 .852.852 0 00.29-.22l10.666-10.61a.928.928 0 00.189-.289 1.066 1.066 0 000-.74.887.887 0 00-.19-.289l-1.34-1.303a.842.842 0 00-.629-.289.906.906 0 00-.37.074.975.975 0 00-.3.215l-8.678 8.678-4.043-4.05a.985.985 0 00-.307-.215.878.878 0 00-.71 0 .806.806 0 00-.29.215l-1.34 1.284a.89.89 0 00-.189.29 1.067 1.067 0 000 .74z" fill="#24A148"/></svg>
                    </div>
                    <div class="lms-pro-license-alert-title">
                        <?php _e( 'Congratulation' ); ?>
                    </div>
                    <div class="lms-pro-license-alert-message">
                        <?php  echo ! empty( $license['message'] ) ? $license['message'] : sprintf( __( 'Your %s is connected to the license system and will now receive automatic updates.' ), $product_title ); ?>
                    </div>
                </div>
            <?php else : ?>
                <div class="lms-pro-license-alert-error">
                    <div class="lms-pro-license-alert-icon">
                        <svg width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg"><defs/><path fill-rule="evenodd" clip-rule="evenodd" d="M24 41c9.389 0 17-7.611 17-17S33.389 7 24 7 7 14.611 7 24s7.611 17 17 17zm8.465-11.118c.002-.2-.032-.4-.1-.588a1.475 1.475 0 00-.324-.484l-4.819-4.812 4.837-4.808a1.492 1.492 0 00.44-1.072 1.607 1.607 0 00-.44-1.12l-1.07-1.073c-.15-.14-.326-.25-.518-.324a1.735 1.735 0 00-1.17 0 1.44 1.44 0 00-.484.324l-4.801 4.829-4.82-4.83a1.39 1.39 0 00-.49-.323 1.735 1.735 0 00-1.17 0 1.619 1.619 0 00-.51.324l-1.067 1.072c-.144.15-.254.33-.323.526-.067.191-.101.392-.101.595-.002.2.032.398.1.585.073.184.183.35.324.487l4.784 4.808-4.802 4.812a1.494 1.494 0 00-.441 1.072c0 .201.038.4.111.588.075.198.187.379.33.533l1.07 1.072c.149.14.324.25.515.324.188.067.387.101.587.1.199.003.397-.031.583-.1.183-.074.348-.184.487-.324l4.798-4.846 4.819 4.84c.14.14.308.251.493.323.185.067.38.102.577.1.202.002.403-.032.594-.1.188-.074.36-.184.507-.324l1.07-1.072c.142-.152.252-.33.323-.526.066-.19.1-.388.101-.588z" fill="#F44337"/></svg>
                    </div>
                    <div class="lms-pro-license-alert-title">
                        <?php _e( 'Valid Key Required' ) ?>
                    </div>
                    <div class="lms-pro-license-alert-message">
                        <?php echo ! empty( $license['message'] ) ? $license['message'] : sprintf( __( 'You have entered an invalid license key. Please insert a valid one if you have purchased %s.' ), $product_title ); ?>
                    </div>
                </div>
            <?php endif; ?>

            <?php if ( $license !== null && $license['activated'] ) : ?>
                <div class="lms-pro-license-fieldset">
                    <div class="lms-pro-license-fieldset-label">
                        <?php _e( 'Licensed To:' ); ?>
                    </div>
                    <div class="lms-pro-license-fieldset-content">
                        <?php echo $license['licensee']; ?>
                    </div>
                </div>

                <?php if ( $license['plan_name'] ) : ?>
                    <div class="lms-pro-license-fieldset">
                        <div class="lms-pro-license-fieldset-label">
                            <?php _e( 'License Type:' ); ?>
                        </div>
                        <div class="lms-pro-license-fieldset-content">
                            <?php echo ucwords( $license['plan_name'] ); ?>
                        </div>
                    </div>
                <?php endif; ?>

                <div class="lms-pro-license-fieldset">
                    <div class="lms-pro-license-fieldset-label">
                        <?php _e( 'Expires on:' ); ?>
                    </div>
                    <div class="lms-pro-license-fieldset-content">
                        <?php echo $license['expires_on'] ? $license['expires_on'] : 'Never'; ?>
                    </div>
                </div>
            <?php endif; ?>
        <?php endif; ?>

        <div id="license-key-input-form-wrapper">
            <div class="lms-pro-license-fieldset">
                <div class="lms-pro-license-fieldset-content">
                    <input 
						name="license-key" 
						type="text" 
						placeholder="Enter your license key here" 
						value="<?php echo esc_attr( $field_value ); ?>" 
						class="<?php echo esc_attr( $class_name ); ?>">

                    <div class="lms-pro-license-help-text">
						<?php echo sprintf( __( 'If you have a %s license, please paste your code here. Or purchase one.' ), $product_title );  ?>
						
						<?php if( ! empty( $this->purchase_link ) ): ?>
							<?php echo sprintf( __( 'Or <a href="%s" target="_blank">purchase one</a>.' ), $this->purchase_link );  ?>
						<?php endif; ?>
					</div>
                </div>
            </div>

            <div class="lms-pro-license-actions">
                <button type class="button button-primary">
					<?php _e( 'Connect With License Key' ); ?>
				</button>
            </div>
		</div>
    </div>
</div>

<script>
	window.jQuery(document).ready(function($) {

		var license_data = <?php echo json_encode( $js_data ); ?>;

		$('#license-key-input-form-wrapper button').click(function(e) {
			var button = $(this);
			var val = $('#license-key-input-form-wrapper input[type="text"]').val();
			val = (val || '').trim();

			if ( ! val || val.indexOf(' ') >-1 ) {
				alert('<?php _e( 'Please enter valid license key' )?>');
				return;
			}

			const {ajaxurl, nonce, action, content_name} = license_data;
			button.prop('disabled', true);

			window.jQuery.ajax({
				url: ajaxurl,
				type: 'POST',
				data: {
					nonce: nonce,
					action: action,
					license_key: val,
					content_name: content_name
				},
				success: function(r) {
					const message = r?.data?.message || null;
					const success = r?.success || false;

					if ( ! success ) {
						button.prop('disabled', false);
						alert(message || '<?php _e( 'Something went wrong!' ); ?>');
					}

					window.location.reload();
				}, 
				error: function(e) {
					button.prop('disabled', false);
					alert('<?php _e( 'Something went wrong!' ); ?>');
				}
			})
		});
	});
</script>
