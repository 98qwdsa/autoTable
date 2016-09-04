/* global malarkey:false, moment:false */

import { config } from './index.config';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import * as table from '../app/components/tableZcs/table'
/*import { GithubContributorService } from '../app/components/githubContributor/githubContributor.service';
import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { MalarkeyDirective } from '../app/components/malarkey/malarkey.directive';*/

angular.module('tableZcs', ['ui.bootstrap', 'toastr'])
  .constant('TABLE_BASE',table.TABLE_BASE)
  .service('tbaleService',table.tbaleService)
  .directive('tableZcs',table.tableZcs)
  .controller('MainController', MainController)
  /*.constant('malarkey', malarkey)
  .constant('moment', moment)
  .config(config)
  .run(runBlock)
  .service('githubContributor', GithubContributorService)
  .service('webDevTec', WebDevTecService)
  .controller('MainController', MainController)
  .directive('acmeNavbar', NavbarDirective)
  .directive('acmeMalarkey', MalarkeyDirective)*/
