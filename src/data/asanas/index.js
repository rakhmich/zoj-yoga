/**
 * АГРЕГАТОР КАТАЛОГА АСАН (Vanilla JS - Zero Build)
 * Файл: src/data/asanas/index.js
 */

(function () {
  'use strict';

  function safeGetArray(getter) {
    try {
      var res = getter();
      if (Array.isArray(res) && res.length > 0) return res;
    } catch (e) {}
    return [];
  }

  function assembleAsanas() {
    var standing = safeGetArray(function () { return window.standingAsanas || window.STANDING_ASANAS; });
    var sitting = safeGetArray(function () { return window.sittingAsanas || window.SITTING_ASANAS; });
    var lying = safeGetArray(function () { return window.lyingAsanas || window.LYING_ASANAS; });
    var inverted = safeGetArray(function () { return window.invertedAsanas || window.INVERTED_ASANAS; });
    var armBalances = safeGetArray(function () { return window.armBalancesAsanas || window.ARM_BALANCES_ASANAS || window.armBalances; });

    var all = [].concat(standing, sitting, lying, inverted, armBalances);

    window.allAsanas = all;
    window.ALL_ASANAS = all;
    window.asanasData = all;

    return all;
  }

  window.getAllAsanas = function () {
    if (!window.allAsanas || window.allAsanas.length < 100) {
      return assembleAsanas();
    }
    return window.allAsanas;
  };

  assembleAsanas();
})();