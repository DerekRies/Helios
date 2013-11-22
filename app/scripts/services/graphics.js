'use strict';

angular.module('HeliosApp')
  .factory('graphics', function () {

    var sim = new Helios.Sim();
    sim.init();
    console.log(sim);

    function tick() {
      requestAnimationFrame(tick);
      if(!sim.paused){
        sim.tick();
      }
    }
    tick();
    // Public API here
    return {
      loadSystem: function (system) {
        sim.loadSystem(system);
      },
      setPause: function (bool) {
        // pauses the simulation, but does not stop rendering
        sim.paused = bool;
      },
      unpause: function () {
        // unpauses the simulation
      },
      stop: function () {
        // stops the rendering and the simulation
        // also causes a blur on the canvas
      },
      resume: function () {
        // resumes rendering and simulation
        // unblurs the canvas
      },
      setRenderTarget: function (element) {
        console.log(element);
        sim.setRenderTarget(element);
      }
    };
  });
