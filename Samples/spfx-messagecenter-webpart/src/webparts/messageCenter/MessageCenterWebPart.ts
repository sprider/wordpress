import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneCustomField,
  PropertyPaneChoiceGroup,
  IPropertyPaneChoiceGroupOption
} from '@microsoft/sp-client-preview';

import ModuleLoader from '@microsoft/sp-module-loader';
import { EnvironmentType } from '@microsoft/sp-client-base';
import { IMessageCenterWebPartProps } from './IMessageCenterWebPartProps';
import * as strings from 'messageCenterStrings';

import * as angular from 'angular';
import 'angular-ui-bootstrap';
import LandingTemplate from './LandingTemplate';
import MockHttpClient from './MockHttpClient';

export interface ILists {
  value: IList[];
}

export interface IList {
  Id: string;
  Title: string;
}


export default class MessageCenterWebPart extends BaseClientSideWebPart<IMessageCenterWebPartProps> {

  private $injector: ng.auto.IInjectorService;
  private _availableLists: IPropertyPaneChoiceGroupOption[] = [];

  public constructor(context: IWebPartContext) {
    super(context);
    ModuleLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
  }

 public render(): void {
    if (this.renderedOnce === false) {
      this.domElement.innerHTML = LandingTemplate.templateHtml;
      require('./app/controller_home.js');
      this.$injector = angular.bootstrap(this.domElement, ['app_MessageCenter']);
    }

    this.$injector.get('$rootScope').$broadcast('configurationChanged', {
      listapi: this.properties.listapi,
      listname: this.properties.listname,
      selectedfields: this.properties.selectedfields,
      EnvironmentType: this.context.environment.type
    });
  }

  public onInit<T>(): Promise<T> {
    // Local environment
    if (this.context.environment.type === EnvironmentType.Local) {
      this._getMockListData().then((response) => {
          this._availableLists = response.value.map((list: IList) => {
              return {key: list.Title, text: list.Title};
            });
      }); }
      else {
      this._getListData()
        .then((response) => {
            this._availableLists = response.value.map((list: IList) => {
              return {key: list.Title, text: list.Title};
            });
        });
    }

    return Promise.resolve();
  }

  private _getListData(): Promise<ILists> {
    return this.context.httpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`)
        .then((response: Response) => {
        return response.json();
        });
  }

  private _getMockListData(): Promise<ILists> {
      return MockHttpClient.get(this.context.pageContext.web.absoluteUrl).then(() => {
          const listData: ILists = {
              value:
              [
                  { Id: '1' , Title: 'Message Center' },
                  { Id: '2' , Title: 'title2' },
                  { Id: '3' , Title: 'title3' }
              ]
              };

          return listData;
      }) as Promise<ILists>;
  }

  private _customControlRenderListEndpoint(customDomElement: HTMLDivElement): void {
    customDomElement.innerHTML = 'List End Point : <label id="listapi">/_api/web/lists/</label>';
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
                PropertyPaneCustomField('listapi', {
                  onRender: this._customControlRenderListEndpoint
                }),
                PropertyPaneTextField('listname', {
                  label: strings.listnameFieldLabel
                  //options: this._availableLists
                }),
                PropertyPaneTextField('selectedfields', {
                  label: strings.selectedfieldsFieldLabel
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
