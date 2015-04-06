module.exports = {

  validArray: function(arr) {
    if (Array.isArray(arr)) {
      return arr;
    } else {
      return [];
    }
  }

};