import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';

import styles from './WebTree.module.scss';
import * as strings from 'webTreeStrings';
import { IWebTreeWebPartProps } from './IWebTreeWebPartProps';

import * as angular from 'angular';
import home from './app/views/home';
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-client-base';

export default class WebTreeWebPart extends BaseClientSideWebPart<IWebTreeWebPartProps> {

  private $injector: ng.auto.IInjectorService;

  public constructor(context: IWebPartContext) {
    super(context);
  }

  public render(): void {

    if (this.renderedOnce === false) {
      this.domElement.innerHTML = home.templateHtml;
      require('./app/controllers/webTreeCtrl.js');
      this.$injector = angular.bootstrap(this.domElement, ['app_WebTree']);
    }    

    this.$injector.get('$rootScope').$broadcast('configurationChanged', {
      scope: this.properties.scope,
      currentenv : Environment.type,
      localenv : EnvironmentType.Local
    });
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneDropdown('scope', {
                  label: strings.ScopeFieldLabel,
                  options: [
                    { key: '2', text: 'Root Site' },
                    { key: '1', text: 'Current Site' }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }

   protected get disableReactivePropertyChanges(): boolean {
    return true;
  }
}
