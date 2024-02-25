// react-app/src/store/csrf.js
// import Cookies from 'js-cookie';

export async function csrfFetch(url, options = {}) {
  /* set progress cursor */
  const bodyClasses = document.body.classList;
  bodyClasses.add("waiting");

  // if (!(options?.isEvilFormData)) {
    // console.log("csrfFetch: not form data");

    // set options.method to 'GET' if no method
    options.method = options.method || 'GET';

    // init options.headers if no headers
    options.headers = options.headers || {};

    // if the options.method is not 'GET', then set the "Content-Type" header to
      // "application/json", and set the "XSRF-TOKEN" header to the value of the
      // "XSRF-TOKEN" cookie
      // handled differently in flask

    if (options.method.toUpperCase() !== 'GET') {
      if (!options.headers['Content-Type'])
        options.headers['Content-Type'] = "application/json";
      // options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }
  // } else {
    // delete options.isEvilFormData;
    // console.log("csrfFetch: is form data");
  // }
  // call the default fetch with the url and the options passed in
  let res;
  try {
    // console.trace();
    res = await fetch(url, options);
  } catch (error) {
    console.error(error);
    error.status = error.status || 500;
    if (error.errors) error.errors.fetch = "Failed to Fetch"
    else error.errors = {"fetch": "Failed to Fetch"}
    res = error;
  }
  finally {
    bodyClasses.remove("waiting");
  }

    // if the response status code is 400 or above, then throw an error with the
      // error being the response

    // if (res.status >= 400) throw res;

    // if the response status code is under 400, then return the response to the
      // next promise chain
    return res;
  }

/* Returns Promise which resolves to either data or errors */
export const fetchData = (url, options) => {
  return csrfFetch(url, options)
    .then(response => response.ok
        ? response.json()
        : response.json().then(err => err.errors ? err :
           (err.message
            ? ({...err, "errors": {"system": err.message}})
            : err )))
    .catch(systemicError => ({"errors": {"system": systemicError.message}}))
}
