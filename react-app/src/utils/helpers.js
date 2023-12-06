/* Our error return format is {errors: {key1:[error1, error2], key2:[error1, error2]}}}
 * and the errors key is only present if there are errors. What is passed to this function
 * is the value of the errors key, so a dicationary of error keys with arrays of
 * error messages. We want to convert this to an array of error messages. */
export const convertErrorsToArray = errors => {
    console.log("convertErrorsToArray", errors);
    if (!errors) return [];
    console.log("convertErrorsToArray", Object.values(errors).flat())
    return Object.values(errors).flat();
}

export function simplifyErrors(fetchResult) {
    if (!fetchResult.errors) return []
    return Object.values(fetchResult.errors).flat()
}


/* if originator didn't smush key into error message already */
export function simplifyErrors2(fetchResult) {
    const result = []
    if (fetchResult.errors)
        for (const [key, value] of Object.entries(fetchResult.errors))
            for (const error of value)
                result.push(`${key}: ${error}`)
    return result
}
/* Eventually, better handling is checking each key and doing something appropriate per type. */



function typeCheck(date) {
    return (typeof date === 'string' || typeof date === 'number')
        ? new Date(date) : date
}
function dayDate(date) { // return Date instance with local time 0
    date = typeCheck(date);
    return new Date(date.toDateString())
}

export function ymd(date) { // return a string of YYYY-MM-DD of the date
    date = typeCheck(date);
    return date.toISOString().split('T')[0]
}

export function ymdt(date) { // return string YYYY-MM-DD 00:00:00 of the date
    // date = typeCheck(date); // not required; within dayDate
    return new Date(ymd(date)).toISOString().replace('T', ' ').split('.')[0]
}
