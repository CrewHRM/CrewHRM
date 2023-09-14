export function request(action, payload = {}, callback, progressCallback) {
	
	// Append action and nonce
	payload = {
		...payload,
		action: window.CrewHRM.app_name + '_' + action,
		nonce: window.CrewHRM.nonce,
	}

	// Build form data
	const formData = new FormData();

	// Function to flatten nested JSON into a flat object and append files to FormData. Thanks ChatGPT :)
	function flattenObject(obj, formData, parentKey = '') {
		for (let key in obj) {
			const _key = parentKey === '' ? key : `${parentKey}[${key}]`;
			if (typeof obj[key] === 'object') {
				if (Array.isArray(obj[key])) {
					obj[key].forEach((item, index) => {
						if (item instanceof File) {
							formData.append(`${_key}[${index}]`, item, item.name);
						} else if( ! Array.isArray( item ) && typeof item !== 'object' ) {
							formData.append(`${_key}[${index}]`, item);
						} else {
							flattenObject(item, formData, `${_key}[${index}]`);
						}
					});
				} else if (obj[key] instanceof File) {
					formData.append(`${_key}`, obj[key]);
				} else {
					flattenObject(obj[key], formData, `${_key}`);
				}
			} else {
				// console.log(obj[key]);
				formData.append(`${_key}`, obj[key]);
			}
		}
	}

	// Flatten the nested JSON and append files to FormData
	flattenObject(payload, formData);

    window.jQuery.ajax({
        url         : window.CrewHRM.ajaxurl,
        type        : 'POST',
        data        : formData,
        contentType : false,
        cache       : false,
        processData : false,
        success: function (response) {
            if (typeof callback == 'function') {
                callback({
                    ...response,
                    success: response.success || false,
                    data: response.data || {}
                });
            }
        },
        error: function () {
            callback({
                success: false,
                data: {}
            });
        },
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener(
                'progress',
                function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = (evt.loaded / evt.total) * 100;
                        if (typeof progressCallback == 'function') {
                            progressCallback(percentComplete);
                        }
                    }
                },
                false
            );
            return xhr;
        }
    });
}
