<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="X-FRAME-OPTIONS" content="ALLOW" />
    <title>CA</title>

    <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/3.5/MicrosoftAjax.js"></script>

    <script type="text/javascript" src="/_layouts/15/init.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="/_layouts/15/SP.UserProfiles.js"></script>

</head>

<body>

    <script type="text/javascript">
        var userProfileProperties;        
        var urlToRedirect = "https://tenantname.sharepoint.com/";
        var listTitle = "Redirect List";

        function processRedirect() {
            $(document).ready(function () {
                loadUserData();
            });
        }

        function loadUserData() {
            var clientContext = new SP.ClientContext.get_current();
            var peopleManager = new SP.UserProfiles.PeopleManager(clientContext);
            userProfileProperties = peopleManager.getMyProperties();
            clientContext.load(userProfileProperties);
            clientContext.executeQueryAsync(onUserDataSuccess, onUserDataFail);
        }

        function onUserDataSuccess() {

            var officeLocation = userProfileProperties.get_userProfileProperties()["Office"];

            if (officeLocation)                
                retrieveRedirectURL(officeLocation);
            else
                window.location.replace(urlToRedirect);
        }

        function onUserDataFail(sender, args) {
            console.log('Error : ' + args.get_message() + '\n' + args.get_stackTrace());
            window.location.replace(urlToRedirect);
        }

        function retrieveRedirectURL(officeLocation) {

            var clientContext = new SP.ClientContext.get_current();
            var oList = clientContext.get_web().get_lists().getByTitle(listTitle);
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name=\'Title\'/>' +
                '<Value Type=\'Text\'>' + officeLocation + '</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>');
            this.collListItem = oList.getItems(camlQuery);
            clientContext.load(collListItem);
            clientContext.executeQueryAsync(Function.createDelegate(this, this.onretrieveRedirectURLSuccess), Function.createDelegate(this, this.onretrieveRedirectURLFail));
        }

        function onretrieveRedirectURLSuccess() {
            var actualRedirectURL;

            var listItemEnumerator = collListItem.getEnumerator();

            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                actualRedirectURL = oListItem.get_item('URL');
            }            

            if (actualRedirectURL.get_url())
                window.location.replace(actualRedirectURL.get_url());
            else
                window.location.replace(urlToRedirect);
        }

        function onretrieveRedirectURLFail(sender, args) {
            console.log('Error : ' + args.get_message() + '\n' + args.get_stackTrace());
            window.location.replace(urlToRedirect);
        }

        function loadScript(url, callback) {
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.src = url;

            // Attach handlers for all browsers
            var done = false;
            script.onload = script.onreadystatechange = function () {
                if (!done && (!this.readyState
                            || this.readyState == "loaded"
                            || this.readyState == "complete")) {
                    done = true;

                    // Continue your code
                    callback();

                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;
                    head.removeChild(script);
                }
            };

            head.appendChild(script);
        }

        processRedirect();

    </script>

</body>