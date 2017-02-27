#!/bin/bash

#************End User to update this section************
UserName="user@domain.com" #Executor username
Password="password" #Executor password
EndPoint="https://domain.sharepoint.com/sites/test" #Site Url where the document library exist
FileServerRelativeUrl="/sites/test/librarytitle/foldertitle/filename.zip" #Server relative Url of the file with extension
OutputFilePath="filename.zip" #Output file name with extension
#********************************************************

#************Admin/Dev Team to update this section*******
RootSite="https://domain.sharepoint.com" #SPOL Root site url
AdfsUrl="https://fs.domain.com/adfs/services/trust/2005/usernamemixed" #ADFS server url
#********************************************************

#************Do not delete or change any of the following code***********
SPLogin="https://login.microsoftonline.com/login.srf?wa=wsignin1.0"
WrReply="https://login.microsoftonline.com/login.srf"
MessageID="urn:uuid:5b903654-16e1-45ca-bd27-1ee4d9f77808"
UsernameTokenId="uuid-a6f04baa-7241-4ad1-8823-b30cea8970e2-1"
Realm="urn:federation:MicrosoftOnline"
ContentParameter='$value'
WctxRequestUrl="${SPLogin}&wreply=${EndPoint}/_forms/default.aspx?apr=1"
CookieRequestEndPoint="${RootSite}/_forms/default.aspx?wa=wsignin1.0"
FileServerRelativeUrl=${FileServerRelativeUrl// /%20}
WctxResponseOutputFile="WctxResponseOutput.txt"
CookieFile="Cookie.txt"
FileEndPoint="${EndPoint}/_api/web/getfilebyserverrelativeurl('${FileServerRelativeUrl}')/${ContentParameter}"

if [ -f $WctxResponseOutputFile ] ; then
    rm $WctxResponseOutputFile
fi

if [ -f $CookieFile ] ; then
    rm $CookieFile
fi

WctxResponse=$(curl -o ${WctxResponseOutputFile} -s -X GET --url ${WctxRequestUrl} --header 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' --header 'content-type: application/x-www-form-urlencoded')
WctxResponseFile=${WctxResponseOutputFile}

while IFS= read -r line
do   
	if [[ $line == *"name=\"ctx\""* ]]; then
               TagContainsToken="$line"
            fi
done <"$WctxResponseFile"

WctxToken=${TagContainsToken#*value=\"}
WctxToken=${WctxToken%\"*}
WctxToken="estsredirect=2&estsrequest=${WctxToken}"
#echo "$WctxToken"

AdfsAssertionResponse=$(curl -s -X POST --url ${AdfsUrl} --header 'content-type: application/soap+xml; charset=utf-8' --data "<s:Envelope xmlns:s='http://www.w3.org/2003/05/soap-envelope' xmlns:a='http://www.w3.org/2005/08/addressing' xmlns:u='http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd'>
    <s:Header>
        <a:Action s:mustUnderstand='1'>http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action>
        <a:MessageID>$MessageID</a:MessageID>
        <a:ReplyTo>
        <a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address>
        </a:ReplyTo>
        <a:To s:mustUnderstand='1'>$AdfsUrl</a:To>
        <o:Security s:mustUnderstand='1' xmlns:o='http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd'>
        <o:UsernameToken u:Id='$UsernameTokenId'>
            <o:Username>$UserName</o:Username>
            <o:Password Type='http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText'>$Password</o:Password>
        </o:UsernameToken>
        </o:Security>
    </s:Header>
    <s:Body>
        <t:RequestSecurityToken xmlns:t='http://schemas.xmlsoap.org/ws/2005/02/trust'>
        <wsp:AppliesTo xmlns:wsp='http://schemas.xmlsoap.org/ws/2004/09/policy'>
            <wsa:EndpointReference xmlns:wsa='http://www.w3.org/2005/08/addressing'>
            <wsa:Address>$Realm</wsa:Address>
            </wsa:EndpointReference>
        </wsp:AppliesTo>
        <t:KeyType>http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey</t:KeyType>
        <t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType>
        </t:RequestSecurityToken>
    </s:Body>
</s:Envelope>")

AdfsToken=${AdfsAssertionResponse#*<s:Body>}
AdfsToken=${AdfsToken%</s:Body>*}
#echo "$AdfsToken"

WrReply=${WrReply%$'\r'}
ADFSAccessTokenResponse=$(curl -s -X POST  --url ${WrReply} --header 'content-type: application/x-www-form-urlencoded' --data "wa=wsignin1.0" --data-urlencode "wctx=${WctxToken}" --data-urlencode "wresult=${AdfsToken}")
ADFSAccessToken=${ADFSAccessTokenResponse#*id=\"t\" value=\"}
ADFSAccessToken=${ADFSAccessToken%\"></form>*}
#echo "$ADFSAccessToken"

CookieRequestResponse=$(curl -i -X POST --data-urlencode "t=${ADFSAccessToken}" -c $CookieFile --header "content-type: application/x-www-form-urlencoded" $CookieRequestEndPoint)

FileResponse=$(curl --request GET -b $CookieFile $FileEndPoint -o $OutputFilePath)

 