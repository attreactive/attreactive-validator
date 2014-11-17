/**
 * AttrEactive Validator
 */

var validator = {
  validate: function(item, constraintsSchema) {
    var validity = {
      valid: true,
      invalid: false
    };

    Object.keys(constraintsSchema).forEach(function(key) {
      if (key == '$iterate') {
        item.forEach(function(object, index) {
          validity[index] = validator.validate(object, constraintsSchema[key]);

          if (validity[index].invalid) {
            validity.invalid = true;
            validity.valid = false;
          }
        });

        validity.length = item.length;
      } else {
        if (typeof constraintsSchema[key] === 'function') {
          validity[key] = validator.validateValue(item, {test: constraintsSchema[key]}).test;
        } else {
          validity[key] = validator.validate(item[key], constraintsSchema[key]);
        }

        if (validity[key].invalid) {
          validity.invalid = true;
          validity.valid = false;
        }
      }
    });

    return validity;
  },

  validateObject: function(object, constraintsMapping) {
    var validity = {
      valid: true,
      invalid: false
    };

    var args = Array.prototype.slice.call(arguments, 2);

    Object.keys(constraintsMapping).forEach(function(propertyName) {
      var propertyValidity = this.validateValue.apply(null, [
        object[propertyName],
        constraintsMapping[propertyName],
        object
      ].concat(args));

      validity[propertyName] = propertyValidity;

      if (propertyValidity.invalid) {
        validity.valid = false;
        validity.invalid = true;
      }
    }, this);

    return validity;
  },

  validateValue: function(value, constraints) {
    var args = Array.prototype.slice.call(arguments, 2);
    args.unshift(value);

    var validity = {
      valid: true,
      invalid: false
    };

    Object.keys(constraints).forEach(function(constraintName) {
      var valid = constraints[constraintName].apply(null, args);

      validity[constraintName] = {
        valid: valid,
        invalid: !valid
      };

      if (!valid) {
        validity.valid = false;
        validity.invalid = true;
      }
    });

    return validity;
  }
};

module.exports = validator;
