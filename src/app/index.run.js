(function() {
  'use strict';

  angular
    .module('dabla')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
