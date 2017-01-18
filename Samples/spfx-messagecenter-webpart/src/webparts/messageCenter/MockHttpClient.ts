import { IList } from './MessageCenterWebPart';

export default class MockHttpClient {

    private static _items: IList[] = [{ Id: '1' , Title: 'Message Center' }];

    public static get(restUrl: string, options?: any): Promise<IList[]> {
      return new Promise<IList[]>((resolve) => {
            resolve(MockHttpClient._items);
        });
    }
}