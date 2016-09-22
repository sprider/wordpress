cls

[Reflection.Assembly]::LoadWithPartialName("System.Web");

<# Update this section below #>
$username = "" # SPOL username
$password = "" # SPOL password
$adfsHost = "" # ADFS Server Url
$rootUrl = "" # Tenant Root Site Url
$webUrl = "$rootUrl/teams/sub-site" # Site Url where your want to access the data

<# Do not change #>
$wctx = "$webUrl/_layouts/Authenticate.aspx?Source=%2F"
$wreply = "https://login.microsoftonline.com/login.srf"
$webFullUrl = "$webUrl/_layouts/oauthauthorize.aspx" 
$realm = "urn:federation:MicrosoftOnline"
$adfsEndpoint = "$adfsHost/adfs/services/trust/2005/usernamemixed"
$msoEndpoint = "https://login.microsoftonline.com/login.srf?wa=wsignin1.0&wreply="
$trustUrl = "$rootUrl/_forms/default.aspx?apr=1&wa=wsignin1.0"
$requestSecurityTokenFormat = "<s:Envelope xmlns:s='http://www.w3.org/2003/05/soap-envelope' xmlns:a='http://www.w3.org/2005/08/addressing' xmlns:u='http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd'><s:Header><a:Action s:mustUnderstand='1'>http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action><a:MessageID>urn:uuid:{0}</a:MessageID><a:ReplyTo><a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address></a:ReplyTo><a:To s:mustUnderstand='1'>{1}</a:To><o:Security s:mustUnderstand='1' xmlns:o='http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd'><o:UsernameToken u:Id='uuid-{2}-1'><o:Username>{3}</o:Username><o:Password Type='http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText'>{4}</o:Password></o:UsernameToken></o:Security></s:Header><s:Body><t:RequestSecurityToken xmlns:t='http://schemas.xmlsoap.org/ws/2005/02/trust'><wsp:AppliesTo xmlns:wsp='http://schemas.xmlsoap.org/ws/2004/09/policy'><wsa:EndpointReference xmlns:wsa='http://www.w3.org/2005/08/addressing'><wsa:Address>$realm</wsa:Address></wsa:EndpointReference></wsp:AppliesTo><t:KeyType>http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey</t:KeyType><t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType></t:RequestSecurityToken></s:Body></s:Envelope>"

$fedAuth = $null;
$rtFA = $null;

function post($endpoint, $body, $headers)
{
    $params = @{}
    $params.Headers = $headers
    $params.uri = $endpoint
    $params.Body = $body
    $params.Method = "POST"
    
    $response = Invoke-WebRequest @params -ContentType "application/soap+xml; charset=utf-8"
    [xml]$xml = $response.Content

    return $xml
}

function adfs()
{
    $messageId = [guid]::NewGuid()
    $usernameTokenId = [guid]::NewGuid()

    $requestSecurityToken = [string]::Format($requestSecurityTokenFormat, $messageId, $adfsEndpoint, $usernameTokenId, $username, $password)

    $adfsXml = post $adfsEndpoint $requestSecurityToken    
    return $adfsXml.Envelope.Body.RequestSecurityTokenResponse.OuterXml
}

function GetWCTX()
{
    $tokenEndpoint=[string]::Format("{0}{1}{2}", $msoEndpoint,  [System.Web.HttpUtility]::UrlEncode($webUrl), [System.Web.HttpUtility]::UrlEncode("/_forms/default.aspx?apr=1"))
    $params = @{uri=$tokenEndpoint
                Method="GET"
                Headers = @{}
               }
    
    $params.Headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    $response = Invoke-WebRequest @params -UserAgent $null    
    $searchString  = "<input type=""hidden"" name=""ctx"" value="""
    $firstIndex = $response.Content.IndexOf($searchString)
    $lastIndex = $response.Content.IndexOf(""" />",$firstIndex)
    $token = $response.Content.Substring($firstIndex+ $searchString.Length,$lastIndex-$firstIndex - $searchString.Length)
    return [string]::Format("estsredirect=2&estsrequest={0}",$token)
}

function authADFS2($adfsToken){

   $msoPostEnvelope = [string]::Format("wa=wsignin1.0&wctx={0}&wresult={1}", [System.Web.HttpUtility]::UrlEncode($wctx),[System.Web.HttpUtility]::UrlEncode($adfsToken))  

    $params = @{uri=$wreply
                Method="POST"
                ContentType = "application/x-www-form-urlencoded"
                Headers = @{}
                Body = $msoPostEnvelope
               }
    $response = Invoke-WebRequest @params -UserAgent $null
    $body = $response.Content
    $searchString  = "id=""t"" value="""
    $firstIndex = $body.IndexOf($searchString)
    $lastIndex = $body.IndexOf(""">",$firstIndex)
    $t = $body.Substring($firstIndex+ $searchString.Length,$lastIndex-$firstIndex - $searchString.Length)
    return $t
}

function GetFedAuth($token)
{
    $sharepointRequest = [System.Net.HttpWebRequest] [System.Net.WebRequest]::Create($trustUrl)  ;
    $sharepointRequest.Method = "POST";
    $sharepointRequest.ContentType = "application/x-www-form-urlencoded";
    $sharepointRequest.CookieContainer = New-Object  System.Net.CookieContainer;
    $sharepointRequest.AllowAutoRedirect = $false;

    $newStream = $sharepointRequest.GetRequestStream();
    $msoPostEnvelope = [string]::Format("t={0}", [System.Web.HttpUtility]::UrlEncode($token))
    $loginInformationBytes = [System.Text.Encoding]::UTF8.GetBytes($msoPostEnvelope);
    $newStream.Write($loginInformationBytes, 0, $loginInformationBytes.Length);
    $newStream.Close();

    $webResponse = [System.Net.HttpWebResponse] $sharepointRequest.GetResponse() 
                
    $fedAuth = $webResponse.Cookies["FedAuth"];
    $rtFA = $webResponse.Cookies["rtFA"];

    $cookies = @{}
    $cookies[0] = $fedAuth
    $cookies[1] = $rtFA
    return $cookies
}

$wctx = GetWCTX 
$adfsAssertion = adfs
$t1 = authADFS2 $adfsAssertion
$cks = GetFedAuth $t1

$params = @{uri="$webUrl/_api/contextinfo"
            Method="POST"
            Headers = @{}
            
           }

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$session.Cookies.Add($cks[0]);
$session.Cookies.Add($cks[1]);
$resonse = Invoke-WebRequest @params -WebSession $session -ContentType "application/x-www-form-urlencoded"
$resonse.Content

# You got the digest value in the response, time to play with sharepoint APIs