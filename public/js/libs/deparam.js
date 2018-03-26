// this file is being made because the query string passed in the address bar has to be converted to an object for our use.
// which can be accessed through window.location.search.
// jQuery.params returns back the encodedURIComponent but it misses the trailing ? . So we need to add that.

(function($) {
  $.deparam = $.deparam || function(uri) {  // if there is a deparam, set it or if not , find it .
    if(uri === undefined) {
      uri = window.location.search;         // if the uri is undefined, get it from the search.
    }
    var queryString = {};                   // an empty object
    uri.replace(                            // we replace the string found by the regular exp. with the function expression's value.
      new RegExp(
        "([^?=&]+)(=([^&#]*))?", "g"
      ),
      function($0, $1, $2, $3){
        queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'))
      }
    )
    return queryString;
  }

})(jQuery);                               // passed Jquery as the global parameter and used it as $

// so first of all we made an IIFE (immediately invoked function expression so that we could give an unique environment to our library.)
// This is done so that the varibales in our library do not mess up the user's code.
