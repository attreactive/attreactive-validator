/**
 * AttrEactive Validator
 */

var validator = require("./validator");

function isNull(value) {
  return value == null;
}

function isEmpty(value) {
  return isNull(value) || value.length === 0;
}

var validationConstraints = {
  notNull: function() {
    return function(value) {
      return !isNull(value);
    };
  },

  notEmpty: function() {
    return function(value) {
      return !isEmpty(value);
    };
  },

  moment: function() {
    return function(value) {
      return isNull(value) ? true : (value._isAMomentObject && value.isValid ? value.isValid() : false);
    };
  },

  email: function() {
    return function(value) {
      return isEmpty(value) ? true : /^.+@.+\..{2,}$/.test(value);
    };
  },

  isTrue: function() {
    return function(value) {
      return value === true;
    };
  },

  isFalse: function() {
    return function(value) {
      return value === false;
    };
  },

  minLength: function(min) {
    return function(value) {
      return isNull(value) ? true : value.length >= min;
    };
  },

  maxLength: function(max) {
    return function(value) {
      return isNull(value) ? true : value.length <= max;
    };
  },

  regexp: function(re) {
    return function(value) {
      return isEmpty(value) ? true : re.test(value);
    };
  },

  uppercase: function() {
    return function(value) {
      return isEmpty(value) ? true : value.toUpperCase() === value;
    };
  },

  lowercase: function() {
    return function(value) {
      return isEmpty(value) ? true : value.toLowerCase() === value;
    };
  },

  objectValidity: function(constraintsMapping) {
    return function(object) {
      return isNull(object) ? true : validator.validateObject(object, constraintsMapping).valid;
    }
  },

  arrayValidity: function(constraintsMapping) {
    return function(array) {
      return isNull(array) ? true : Array.isArray(array) && array.every(function(object) {
        return validator.validateObject(object, constraintsMapping).valid;
      });
    };
  }
};

module.exports = validationConstraints;
