export default class home {
    public static templateHtml: string =  `
        <div class="ca-news">
            <div ng-controller="webTreeCtrl" class="ng-scope">
                <div class="news-container clearfix">
                    <select ng-model="selectedCategory" ng-options="" ng-change="updateWebTree()" class="ng-pristine ng-untouched ng-valid">               
                    </select>
                    <a class="btn btn-primary archive" ng-href="/archive" target="_blank" href="/archive">Archive</a>
                    <h2>Web Tree</h2>
                    <div class="grid regional-news" style="position: relative; height: 734.006px;">
                        <div class="grid-sizer" style=""></div>                
                        <div ng-show="isLoading === false && (WebList).length > 0" ng-repeat="web in WebList" ng-class="{'grid-item': true,'no-image': (web.image == '')}" class="ng-scope grid-item" style="position: absolute; left: 0px; top: 0px;">
                            <a ng-href="web.Url" title="web.Url" href="web.Url">
                                <img ng-show="web.TemplateImage" class="img-responsive" imageonload="applyMasonry()" ng-src="web.TemplateImage" alt="web.TemplateImage">
                                <h4 class="ng-binding">{{web.Title}}</h4>
                                <h6 class="ng-binding">{{web.WebTemplate}}</h6>
                                <span class="date ng-binding" ng-show="web.LastItemModifiedDate">{{Web.Created | date : 'shortDate'}}</span>
                            </a>
                        </div>
                        <p ng-show="isLoading === false && (WebList).length <= 0 && !error" class="empty ng-hide" style="">No records found</p>
                        <p ng-show="isLoading" class="loading ng-hide" style="">Loading ...</p>
                        <p ng-show="needsconfig" class="empty ng-hide" style="">Please configure this webpart.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}