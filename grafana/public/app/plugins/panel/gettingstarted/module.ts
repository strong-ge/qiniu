///<reference path="../../../headers/common.d.ts" />

import {PanelCtrl} from 'app/plugins/sdk';

import {contextSrv} from 'app/core/core';

class GettingStartedPanelCtrl extends PanelCtrl {
  static templateUrl = 'public/app/plugins/panel/gettingstarted/module.html';
  checksDone: boolean;
  stepIndex: number;
  steps: any;

  /** @ngInject **/
  constructor($scope, $injector, private backendSrv, private datasourceSrv, private $q) {
    super($scope, $injector);

    this.stepIndex = 0;
    this.steps = [];

    this.steps.push({
      // title: 'Install Grafana',
      title: '安装 Grafana',
      icon: 'icon-gf icon-gf-check',
      href: 'http://docs.grafana.org/',
      target: '_blank',
      // note: 'Review the installation docs',
      note: '查看安装文档',
      check: () => $q.when(true),
    });

    this.steps.push({
      // title: 'Create your first data source',
      title: '创建您的第一个数据源',
      // cta: 'Add data source',
      cta: '添加数据源',
      icon: 'icon-gf icon-gf-datasources',
      href: 'datasources/new?gettingstarted',
      check: () => {
        return $q.when(
          datasourceSrv.getMetricSources().filter(item => {
            return item.meta.builtIn === false;
          }).length > 0
        );
      }
    });

    this.steps.push({
      // title: 'Create your first dashboard',
      title: '创建您的第一个 dashboard',
      // cta: 'New dashboard',
      cta: '新建 dashboard',
      icon: 'icon-gf icon-gf-dashboard',
      href: 'dashboard/new?gettingstarted',
      check: () => {
        return this.backendSrv.search({limit: 1}).then(result => {
          return result.length > 0;
        });
      }
    });

    this.steps.push({
      // title: 'Invite your team',
      title: '邀请您的团队',
      // cta: 'Add Users',
      cta: '添加用户',
      icon: 'icon-gf icon-gf-users',
      href: 'org/users?gettingstarted',
      check: () => {
        return  this.backendSrv.get('api/org/users').then(res => {
          return res.length > 1;
        });
      }
    });


    this.steps.push({
      // title: 'Install apps & plugins',
      title: '安装应用与插件',
      // cta: 'Explore plugin repository',
      cta: '探索插件库',
      icon: 'icon-gf icon-gf-apps',
      href: 'https://grafana.net/plugins?utm_source=grafana_getting_started',
      check: () => {
        return this.backendSrv.get('api/plugins', {embedded: 0, core: 0}).then(plugins => {
          return plugins.length > 0;
        });
      }
    });
  }

  $onInit() {
    this.stepIndex = -1;
    return this.nextStep().then(res => {
      this.checksDone = true;
    });
  }

  nextStep() {
    if (this.stepIndex === this.steps.length - 1) {
      return this.$q.when();
    }

    this.stepIndex += 1;
    var currentStep = this.steps[this.stepIndex];
    return currentStep.check().then(passed => {
      if (passed) {
        currentStep.cssClass = 'completed';
        return this.nextStep();
      }

      currentStep.cssClass = 'active';
      return this.$q.when();
    });
  }

  dismiss() {
    this.row.removePanel(this.panel, false);

    this.backendSrv.request({
      method: 'PUT',
      url: '/api/user/helpflags/1',
      showSuccessAlert: false,
    }).then(res => {
      contextSrv.user.helpFlags1 = res.helpFlags1;
    });
  }
}

export {GettingStartedPanelCtrl, GettingStartedPanelCtrl as PanelCtrl}
