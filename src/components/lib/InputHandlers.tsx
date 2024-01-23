
export function G_onInputChangeHandler(event: any, posting: boolean) {
    let input: any = {
        error: '',
        name: event.target.name,
        value: event.target.value
    }

    if (!posting) {
        let ifCheckbox: any = (event.target.type === 'checkbox') ? true : false;

        if (ifCheckbox) {
            let checked = event.target.checked;
            let toggleStatus = checked ? 'Y' : 'N'

            input.value = toggleStatus
        } else {
            input.value = event.target.value
        }
    }

    return input
}

export function G_onInputBlurHandler(event: any, posting: boolean, title: any, minChar = 5, maxChar = 30) {
    let input: any = {
        error: '',
        name: event.target.name,
        value: event.target.value.trim()
    }

    if (!posting) {
        let tValue = event.target.value.trim()
        let tName = event.target.name

        if (tValue.length < 1 && event.target.required) {
            /* 
             * Mandatory inputs should not be empty
            */
            input.error = title + ' ' + tName + ' cannot be empty'
            return input
        }

        switch (tName) {
            case 'name':
                if (tValue.length < minChar) {
                    input.error = title + ' ' + tName + ' cannot be less than ' + minChar + ' characters'
                    return input
                } else if (tValue.length > maxChar) {
                    input.error = title + ' ' + tName + ' cannot be more than ' + maxChar + ' characters'
                    return input
                }
                break

            case 'description':
                if (tValue.length < 5) {
                    input.error = title + ' ' + tName + ' cannot be less than 5 characters'
                    return input
                } else if (tValue.length > 200) {
                    input.error = title + ' ' + tName + ' cannot be more than 200 characters'
                    return input
                }
                break
            
            case 'amount':
                tValue = tValue.replace(',', '')
                const isValidAmount = /^\d+(\.\d{1,2})?$/.test(tValue);
                
                if (!isValidAmount) {
                    input.error = isValidAmount ? '' : 'Invalid amount format';
                } else if (tValue < 100) {
                    input.error = 'Minimum withdrawal amount per transaction is KSh. 100';
                }
                break

            case 'first_name':
            case 'last_name':
                let targetTitle = tName.charAt(0).toUpperCase() + tName.slice(1)
                targetTitle = targetTitle.replace('_', ' ')

                if (tValue.length < 3) {
                    input.error = targetTitle + ' cannot be less than 3 characters'
                    return input
                } else if (tValue.length > 30) {
                    input.error = targetTitle + ' cannot be more than 30 characters'
                    return input
                } else {
                    /* 
                     * Validate name details
                    */
                    if (tValue.match(new RegExp('[`!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?~]'))) {
                        input.error = 'Please provide a valid ' + targetTitle
                    } else {
                        /* 
                         * Remove allowed special characters then test for numbers
                        */
                        tValue = tValue.replace("'", '')
                        tValue = tValue.replace(" ", '')

                        if (!tValue.match(new RegExp('[A-Z]')) || !tValue.match(new RegExp('[a-z]'))) {
                            input.error = 'Please provide a valid ' + targetTitle
                        }
                    }
                }
                break

            case 'email':
                let lastAtPos = tValue.lastIndexOf('@')
                let lastDotPos = tValue.lastIndexOf('.')

                if (!(lastAtPos < lastDotPos && lastAtPos > 0 && tValue.indexOf('@@') === -1 && lastDotPos > 2 && (tValue.length - lastDotPos) > 2)) {
                    input.error = 'Please provide a valid email address'
                }
                break

            case 'password':
            case 'confirm':
                const pwdMinLength = 8
                const pwdMaxLength = 30

                if (tValue.length < pwdMinLength) {
                    input.error = tName + ' cannot be less than ' + minChar + ' characters'
                    return input
                } else if (tValue.length > pwdMaxLength) {
                    input.error = tName + ' cannot be more than ' + maxChar + ' characters'
                    return input
                }
                break

            default:
                const firstCase = tName
                if (tValue.length < minChar) {
                    input.error = title + ' ' + tName + ' cannot be less than ' + minChar + ' characters'
                    return input
                } else if (tValue.length > maxChar) {
                    input.error = title + ' ' + tName + ' cannot be more than ' + maxChar + ' characters'
                    return input
                }
                break
        }
    }

    return input
}