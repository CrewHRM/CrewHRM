export function request(action, payload = {}, callback, progressCallback) {
    let modifer = {
        contentType: false,
        cache: false,
        processData: false
    };

    // Create form data if it is not already, but has file inside
    if (!(payload instanceof FormData)) {
        // Loop through all values to check if there is file
        for (let k in payload) {
            // If a at least single one is file
            if (payload[k] instanceof File) {
                // Create new
                let new_payload = new FormData();

                // Loop through values to append in the form data
                for (let key in payload) {
                    if (payload[key] instanceof File) {
                        // Append file
                        new_payload.append(key, payload[key], payload[key].name);
                    } else {
                        // Append scalar value
                        new_payload.append(key, payload[key]);
                    }
                }

                // Replace the payload with the new one
                payload = new_payload;

                break;
            }
        }
    }

    let action_prefixed = window.CrewHRM.app_name + '_' + action;

    if (payload instanceof FormData) {
        payload.append('action', action_prefixed);
        payload.append('nonce', window.CrewHRM.nonce);
    } else {
        modifer = {};
        payload = {
            ...payload,
            action: action_prefixed,
			nonce: window.CrewHRM.nonce,
        };
    }

    window.jQuery.ajax({
        url: window.CrewHRM.ajaxurl,
        type: 'POST',
        data: payload,
        ...modifer,
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
