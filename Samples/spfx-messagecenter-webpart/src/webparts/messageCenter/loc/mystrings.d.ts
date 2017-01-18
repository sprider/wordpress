declare interface IMessageCenterStrings {
 PropertyPaneDescription: string;
  BasicGroupName: string;
  listapiFieldLabel: string;
  listnameFieldLabel: string;
  selectedfieldsFieldLabel: string;
}

declare module 'messageCenterStrings' {
  const strings: IMessageCenterStrings;
  export = strings;
}
