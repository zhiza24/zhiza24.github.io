(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    if (window.initBirthScreen) window.initBirthScreen();
    const profile = window.AlchemistProfile && window.AlchemistProfile.load();
    if (profile && window.AlchemistMatrix) {
      // Только статус готовности метода; неподтвержденная формула не запускается.
      profile.symbolic.status = window.AlchemistMatrix.calculateArcanaPositions().status;
      window.AlchemistProfile.save(profile);
    }
  });
})();
