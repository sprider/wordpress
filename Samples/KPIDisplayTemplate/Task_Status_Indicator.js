window.KPIList = window.KPIList || {};
window.KPIList.Overrides = {

    customHeader: function (ctx) {        
        return "<div id='CustomViewHeader' class='container-fluid'><center><p>Report as on today</p></center><table class='table'><thead><tr><th>Title</th><th>Status</th></tr></thead><tbody>";
    },
    customItemHtml: function (ctx) {

        var dispFormURL = "/sites/dev/Lists/KPI%20Report/DispForm.aspx?ID="+ ctx.CurrentItem.ID;

        if (ctx.CurrentItem.Status == 'Success') {
            return '<tr class="active"><td>' + '<a target="_blank" href="'+dispFormURL+'">' + ctx.CurrentItem.Title + '</a>' + '</td><td>' + '<img src="/sites/dev/SiteAssets/Circle_Green.png" alt="' + ctx.CurrentItem.Status + '"/></td></tr>';
        }

        if (ctx.CurrentItem.Status == 'Info') {
            return '<tr class="active"><td>' + '<a target="_blank" href="'+dispFormURL+'">' + ctx.CurrentItem.Title + '</a>' + '</td><td>' + '<img src="/sites/dev/SiteAssets/Circle_Blue.png" alt="' + ctx.CurrentItem.Status + '"/></td></tr>';
        }

        if (ctx.CurrentItem.Status == 'Warning') {
            return '<tr class="active"><td>' + '<a target="_blank" href="'+dispFormURL+'">' + ctx.CurrentItem.Title + '</a>' + '</td><td>' + '<img src="/sites/dev/SiteAssets/Circle_Yellow.png" alt="' + ctx.CurrentItem.Status + '"/></td></tr>';
        }

        if (ctx.CurrentItem.Status == 'Danger') {
            return '<tr class="active"><td>' + '<a target="_blank" href="'+dispFormURL+'">' + ctx.CurrentItem.Title + '</a>' + '</td><td>' + '<img src="/sites/dev/SiteAssets/Circle_Red.png" alt="' + ctx.CurrentItem.Status + '"/></td></tr>';
        }
    },
    pagingControl: function (ctx) {
        var html = "</tbody></table>";
        var firstRow = ctx.ListData.FirstRow;
        var lastRow = ctx.ListData.LastRow;
        var prev = ctx.ListData.PrevHref;
        var next = ctx.ListData.NextHref;
        html += "<nav class='container-fluid'><ul class='pagination'>";
        html += prev ?"<li class='page-item'><a class='page-link' aria-label='Previous' href='javascript:void(0)' onclick='RefreshPageTo(event, &quot;" + prev + "&quot;); return false;'><span aria-hidden='true'>&laquo;</span><span class='sr-only'>Previous</span></a></li>": "";       
        html +=  next ? "<li class='page-item'><a class='page-link' aria-label='Next' href='javascript:void(0)' onclick='RefreshPageTo(event, &quot;" + next + "&quot;); return false;'><span aria-hidden='true'>&raquo;</span><span class='sr-only'>Next</span></a></li>" : "";
        html += "</ul></nav></div>";       
        return html;
    }
};

(function () {
    var taskstatusItemCtxOverrides = {};
    taskstatusItemCtxOverrides.Templates = {};

    taskstatusItemCtxOverrides.Templates.Header = window.KPIList.Overrides.customHeader;
    taskstatusItemCtxOverrides.Templates.Item = window.KPIList.Overrides.customItemHtml;
    taskstatusItemCtxOverrides.Templates.Footer = window.KPIList.Overrides.pagingControl;

    taskstatusItemCtxOverrides.ListTemplateType = 100;
    taskstatusItemCtxOverrides.BaseViewID = 1;

    taskstatusItemCtxOverrides.OnPostRender = function (ctx) {
        loadCSS("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");

        var siteUrl = _spPageContextInfo.siteAbsoluteUrl;

        loadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js", function () {
            loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js", function () {
            });
        });
    }

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(taskstatusItemCtxOverrides);

    function loadCSS(url) {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('link');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.href = url;
        head.appendChild(style);
    }
    function loadScript(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onreadystatechange = callback;
        script.onload = callback;
        head.appendChild(script);
    }

})();