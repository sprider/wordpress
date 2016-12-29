var taskstatusViews = taskstatusViews || {};

taskstatusViews.itemStyleOverrides = function (ctx) {

    if (ctx.CurrentItem.Status == 'Success')
    {  
        return '<tr class="active"><td>'+'<a href="' + ctx.CurrentItem.URL + '">' + ctx.CurrentItem.Title + '</a>'+'</td><td>'+ '<img src="/sites/dev/SiteAssets/Circle_Green.png" alt="'+ ctx.CurrentItem.Status +'"/></td></tr>';   
    }
    
    if (ctx.CurrentItem.Status == 'Info')
    {        
        return '<tr class="active"><td>'+'<a href="' + ctx.CurrentItem.URL + '">' + ctx.CurrentItem.Title + '</a>'+'</td><td>'+ '<img src="/sites/dev/SiteAssets/Circle_Blue.png" alt="'+ ctx.CurrentItem.Status +'"/></td></tr>';   
    }

    if (ctx.CurrentItem.Status == 'Warning')
    {        
        return '<tr class="active"><td>'+'<a href="' + ctx.CurrentItem.URL + '">' + ctx.CurrentItem.Title + '</a>'+'</td><td>'+ '<img src="/sites/dev/SiteAssets/Circle_Yellow.png" alt="'+ ctx.CurrentItem.Status +'"/></td></tr>';   
    }

    if (ctx.CurrentItem.Status == 'Danger')
    {        
        return '<tr class="active"><td>'+'<a href="' + ctx.CurrentItem.URL + '">' + ctx.CurrentItem.Title + '</a>'+'</td><td>'+ '<img src="/sites/dev/SiteAssets/Circle_Red.png" alt="'+ ctx.CurrentItem.Status +'"/></td></tr>';   
    }
};

(function () {
    var taskstatusItemCtxOverrides = {};
    taskstatusItemCtxOverrides.Templates = {};

    taskstatusItemCtxOverrides.Templates.Header = "<div id='CustomViewHeader' class='container-fluid'><center><p>Report as on today</p></center><table class='table'><thead><tr><th>Title</th><th>Status</th></tr></thead><tbody>";
    taskstatusItemCtxOverrides.Templates.Item = taskstatusViews.itemStyleOverrides;
    taskstatusItemCtxOverrides.Templates.Footer = "</tbody></table></div>";

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