'use strict';

angular.module('HeliosApp')
  .factory('heliosUtils', function () {

    return {
      parseTimeExpression: function (timeExpression) {
        // takes a string of some duration of time and converts it to milliseconds
        // ex:      0.5s -> 500     500ms -> 500     500 -> 500
        var timeInMs,
            re = new RegExp(/[0-9]s/),
            s = timeExpression.search(re);
        if(s !== -1) {
          timeInMs = parseFloat(timeExpression, 10) * 1000;
        }
        else {
          timeInMs = parseInt(timeExpression, 10);
        }
        return timeInMs;
      },

      inRange: function (rangeMin, rangeMax, needle) {
        if(typeof rangeMax === 'undefined') {
          return needle >= rangeMin;
        }
        else if(typeof rangeMin === 'undefined') {
          return needle <= rangeMax;
        }
        else {
          return (needle >= rangeMin && needle <= rangeMax);
        }
      },

      mapTemperatureToClassName: function (temp) {
        // a function used to map temperatures to star sprite class names
        if(this.inRange(undefined, 5000, temp)){
          return 'red-star';
        }
        else if(this.inRange(5001, 6500, temp)){
          return 'yellow-star';
        }
        else if(this.inRange(6501, 10000, temp)){
          return 'white-star';
        }
        else if(this.inRange(10001, undefined, temp)){
          return 'blue-star';
        }
      }

    };
  });
