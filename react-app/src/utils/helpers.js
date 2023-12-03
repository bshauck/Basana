/* Our error return format is {errors: {key1:[error1, error2], key2:[error1, error2]}}}
 * and the errors key is only present if there are errors. What is passed to this function
 * is the value of the errors key, so a dicationary of error keys with arrays of
 * error messages. We want to convert this to an array of error messages. */
export const convertErrorsToArray = errors => {
    if (!errors) return [];
    return Object.values(errors).flat();
}

/* Eventually, better handling is checking each key and doing something appropriate per type. */
