import styles from './MessageCenter.module.scss';

export default class LandingTemplate {
    public static templateHtml: string =  `
    <div class="container-fluid" ng-controller="controller_home">
        <div class="row">
            <div class="col-md-12 text" ng-show="needsconfig">
                <p>Please configure this webpart.</p>
            </div>
            <div class="col-md-12 text" ng-show="needsconfig === false">
                <div class="col-md-12 text" ng-show="isLoading">
                    <p>Loading...</p>
                </div>
                <div class="col-md-12 text" ng-show="isLoading === false && (notifications).length > 0">
                    <ul class="list-group">
                        <li class="list-group-item" ng-repeat="notification in notifications">
                            <h5><a href="#" ng-click="showDetails('S', notification)">{{notification.Title}}</a></h5>
                            <span class="label label-info">{{notification.Status}}</span>
                            <span class='${styles.uvStyle}'>{{notification.Published | date : 'shortDate'}}</span>
                            <span class='${styles.uvStyleUnderline}'>{{notification.Category}}</span>
                        </li>
                    </ul>
                    <p class="text-right"><a href="#" ng-click="viewMore('lg')" ">View More</a></p>
                </div>
                <div class="col-md-12 text" ng-show="isLoading === false && (notifications).length <= 0 && !error">
                    <p>No records found.</p>
                </div>
                <div class="col-md-12 text" ng-if="error">
                    <p>{{error}}</p>
                </div>
            </div>
        </div>
    </div>

    <script type="text/ng-template" id="messagedetails.html">
        <div class="modal-header">
            <h3 class="modal-title">Notification Details</h3>
        </div>
        <div class="modal-body">
            <p>{{Description}}</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" ng-click="Close()">Close</button>
        </div>
    </script>

    <script type="text/ng-template" id="viewmore.html">
        <div class="modal-header">
            <h3 class="modal-title">All Items</h3>
        </div>
        <div class="modal-body">
            <div class="table-responsive">
                <table class="table">
                    <thead>
                    <th> Title </th>
                    <th> Status </th>
                    <th> Category </th>
                    <th> Published </th>
                    </thead>
                    <tbody>
                        <tr ng-repeat="detail in moreDetials">
                            <td>
                                {{detail.Title}}
                            </td>
                            <td>
                                {{detail.Status}}
                            </td>
                            <td>
                                {{detail.Category}}
                            </td>
                            <td>
                                {{detail.Published | date : 'shortDate'}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" ng-click="onLoadLess()">Load Less</button>
            <button class="btn btn-primary" ng-click="onLoadMore()" ng-if="(moreDetials).length > 0">Load More</button>
            <button class="btn btn-primary" ng-click="Close()">Close</button>
        </div>
    </script>
    `;
}