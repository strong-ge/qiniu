///<reference path="../../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from '../../core_module';

export class NavbarCtrl {
  /** @ngInject */
  constructor(private $scope, private contextSrv) {
    $scope.user = contextSrv.user;
    $scope.isViewer = $scope.user.orgRole === 'Viewer';
  }
}

export function navbarDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/navbar/navbar.html',
    controller: NavbarCtrl,
    bindToController: true,
    transclude: true,
    controllerAs: 'ctrl',
    scope: {
      title: "@",
      titleUrl: "@",
      iconUrl: "@",
    },
    link: function(scope, elem, attrs, ctrl) {
      ctrl.icon = attrs.icon;
      elem.addClass('navbar');
    }
  };
}

coreModule.directive('navbar', navbarDirective);
