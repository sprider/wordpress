using HtmlAgilityPack;
using SPOL_REST_Test.Helper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web.Script.Serialization;
using System.Xml;
using System.Xml.Linq;
using System.Xml.XPath;

namespace SPOL_REST_Test
{
    internal class ProcessRequests
    {
        private static readonly CookieContainer Cookies = new CookieContainer();

        internal static void Exec()
        {
            if (AppSettings.TenantType.Equals("ADFS"))
            {
                var wCTX = GetWCTX();
                if (wCTX == null) throw new ArgumentNullException(nameof(wCTX));
                var aDFSAssertion = GetAdfsAssertion();
                if (aDFSAssertion == null) throw new ArgumentNullException(nameof(aDFSAssertion));
                var securityToken = GetADFSAccessToken(wCTX, aDFSAssertion.ToString());
                if (securityToken == null) throw new ArgumentNullException(nameof(securityToken));
                GetFedAuth(securityToken);
            }
            else
            {
                var securityToken = GetSecurityToken();
                if (securityToken == null) throw new ArgumentNullException(nameof(securityToken));
                GetAccessToken(securityToken);
            }

            var requestDigest = GetRequestDigest();
            if (requestDigest == null) throw new ArgumentNullException(nameof(requestDigest));
            var items = GetListData(requestDigest);

            if (items != null)
                foreach (var item in items)
                {
                    Console.Write("ID : " + item.Id + " ----------- " + "Title: " + item.Title + "\n");
                }
            else
                Console.Write("No items found");
        }

        private static void GetFedAuth(string securityToken)
        {
            try
            {
                var requestBody = string.Format("t={0}", System.Web.HttpUtility.UrlEncode(securityToken));
                var requestBodyData = Encoding.UTF8.GetBytes(requestBody);

                var fedAuthRequest = (HttpWebRequest)WebRequest.Create(AppSettings.SignInUrl);
                fedAuthRequest.Method = "POST";
                fedAuthRequest.ContentType = "application/x-www-form-urlencoded";
                fedAuthRequest.AllowAutoRedirect = false;
                fedAuthRequest.CookieContainer = Cookies;
                fedAuthRequest.ContentLength = requestBodyData.Length;

                using (var fedAuthStream = fedAuthRequest.GetRequestStream())
                {
                    fedAuthStream.Write(requestBodyData, 0, requestBodyData.Length);

                    using (var fedAuthResponse = (HttpWebResponse)fedAuthRequest.GetResponse())
                    {

                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(
                    $"An error occurred when getting Fed Auth:{ex.Message}{ex.StackTrace}");
            }
        }

        private static string GetADFSAccessToken(string wCTX, string aDFSAssertion)
        {
            try
            {
                var requestBody = string.Format("wa=wsignin1.0&wctx={0}&wresult={1}", System.Web.HttpUtility.UrlEncode(wCTX), System.Web.HttpUtility.UrlEncode(aDFSAssertion));
                var requestBodyData = Encoding.ASCII.GetBytes(requestBody);
                var wCtxRequestUrl = AppSettings.WrReply;
                var wCtxRequest = (HttpWebRequest)WebRequest.Create(wCtxRequestUrl);
                wCtxRequest.Method = "POST";
                wCtxRequest.ContentType = "application/x-www-form-urlencoded";
                wCtxRequest.ContentLength = requestBodyData.Length;

                using (var securityTokenStream = wCtxRequest.GetRequestStream())
                {
                    securityTokenStream.Write(requestBodyData, 0, requestBodyData.Length);
                }


                using (var wCtxRequestResponse = (HttpWebResponse)wCtxRequest.GetResponse())
                {
                    using (var wCtxRequestResponseStream = wCtxRequestResponse.GetResponseStream())
                    {
                        if (wCtxRequestResponseStream == null)
                            throw new ArgumentNullException(nameof(wCtxRequestResponseStream));

                        var wCTXResponseStreamContent = new StreamReader(wCtxRequestResponseStream).ReadToEnd();

                        HtmlDocument doc = new HtmlDocument();
                        doc.LoadHtml(wCTXResponseStreamContent);
                        var tokenNode = doc.DocumentNode.SelectSingleNode("//input[@id='t']");
                        var wCTXToken = tokenNode.GetAttributeValue("value", "");
                        return wCTXToken;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(
                    $"An error occurred when getting the ADFS Access token:{ex.Message}{ex.StackTrace}");
            }
        }

        private static string GetWCTX()
        {
            string wCTXToken;

            try
            {
                var wCtxRequestUrl = AppSettings.MsoEndpoint + "&wreply=" + System.Web.HttpUtility.UrlEncode(AppSettings.EndPoint) + System.Web.HttpUtility.UrlEncode(" / _forms/default.aspx?apr=1");
                var wCtxRequest = (HttpWebRequest)WebRequest.Create(wCtxRequestUrl);
                wCtxRequest.Method = "GET";
                wCtxRequest.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";

                using (var wCTXResponse = (HttpWebResponse)wCtxRequest.GetResponse())
                {
                    var wCTXResponseStream = new StreamReader(wCTXResponse.GetResponseStream(), Encoding.UTF8);

                    var wCTXResponseStreamContent = wCTXResponseStream.ReadToEnd();
                    HtmlDocument doc = new HtmlDocument();
                    doc.LoadHtml(wCTXResponseStreamContent);
                    var tokenNode = doc.DocumentNode.SelectSingleNode("//input[@name='ctx']");
                    wCTXToken = tokenNode.GetAttributeValue("value", "");
                }

                return string.Format("estsredirect=2&estsrequest={0}", wCTXToken);
            }
            catch (Exception ex)
            {
                throw new Exception(
                    $"An error occurred when getting WCTX Token :{ex.Message}{ex.StackTrace}");
            }
        }

        private static string GetAdfsAssertion()
        {
            string tokenToSubmit;

            try
            {
                Guid messageId = Guid.NewGuid();
                Guid usernameTokenId = Guid.NewGuid();

                var strmessageid = "urn:uuid:" + messageId.ToString();
                var strusernameTokenId = "uuid-" + usernameTokenId.ToString() + "-1";

                var tokenEnvelopeXml = File.ReadAllText("../../Data/SecurityTokenFormat.xml");
                var requestBody =
                    tokenEnvelopeXml.Replace("$$MessageGUID$$", strmessageid)
                        .Replace("$$UsernameTokenGUID$$", strusernameTokenId)
                        .Replace("user@domain.com", AppSettings.Username)
                        .Replace("*******", AppSettings.Password)
                        .Replace("$$ADFSEndPoint$$", AppSettings.AdfsEndpoint)
                        .Replace("$$Realm$$", AppSettings.Realm);

                var securityTokenRequest = (HttpWebRequest)WebRequest.Create(AppSettings.AdfsEndpoint);
                var requestBodyData = Encoding.ASCII.GetBytes(requestBody);
                securityTokenRequest.Method = "POST";
                securityTokenRequest.ContentType = "application/soap+xml; charset=utf-8";
                securityTokenRequest.ContentLength = requestBodyData.Length;

                using (var securityTokenStream = securityTokenRequest.GetRequestStream())
                {
                    securityTokenStream.Write(requestBodyData, 0, requestBodyData.Length);

                    using (var securityTokenResponse = (HttpWebResponse)securityTokenRequest.GetResponse())
                    {
                        using (var securityTokenResponseStream = securityTokenResponse.GetResponseStream())
                        {
                            if (securityTokenResponseStream == null)
                                throw new ArgumentNullException(nameof(securityTokenResponseStream));

                            var securityTokenResponseXml = new StreamReader(securityTokenResponseStream).ReadToEnd();

                            XmlDataDocument doc = new XmlDataDocument();
                            doc.LoadXml(securityTokenResponseXml);
                            XmlNamespaceManager nsmgr = new XmlNamespaceManager(doc.NameTable);
                            nsmgr.AddNamespace("t", "http://schemas.xmlsoap.org/ws/2005/02/trust");
                            nsmgr.AddNamespace("s", "http://www.w3.org/2003/05/soap-envelope");

                            var element = doc.SelectSingleNode("//s:Envelope/s:Body/t:RequestSecurityTokenResponse", nsmgr);
                            tokenToSubmit = element.OuterXml;
                        }
                    }
                }

                return tokenToSubmit;
            }
            catch (Exception ex)
            {
                throw new Exception(
                    $"An error occurred when getting the security token:{ex.Message}{ex.StackTrace}");
            }
        }

        private static IEnumerable<SharePointListItem> GetListData(string formDigest)
        {
            try
            {
                var spRequestUrl = string.Format(AppSettings.SpListApiEndpoint, AppSettings.EndPoint, AppSettings.ListTitle);
                var spRequest = (HttpWebRequest)WebRequest.Create(spRequestUrl);
                spRequest.CookieContainer = Cookies;
                spRequest.Method = "GET";
                spRequest.Accept = "application/json; odata=verbose";
                spRequest.ContentType = "application/json;odata=verbose";
                spRequest.Headers.Add("X-RequestDigest", formDigest);

                Data data;
                using (var spResponse = (HttpWebResponse)spRequest.GetResponse())
                {
                    using (var spResponseStream = spResponse.GetResponseStream())
                    {
                        if (spResponseStream == null)
                            throw new ArgumentNullException(nameof(spResponseStream));

                        using (var spResponseReader = new StreamReader(spResponseStream))
                        {
                            var serializer = new JavaScriptSerializer();
                            var jSon = spResponseReader.ReadToEnd();
                            data = serializer.Deserialize<Data>(jSon);
                        }
                    }
                }

                return data.d.results.ToList();
            }
            catch (Exception ex)
            {
                throw new Exception(
                    $"An error occurred when reading the list items from SharePoint:{ex.Message}{ex.StackTrace}");
            }
        }

        private static string GetRequestDigest()
        {
            try
            {
                var digestRequestUrl = string.Format(AppSettings.RequestDigestEndpoint, AppSettings.EndPoint);
                var digestRequest = (HttpWebRequest)WebRequest.Create(digestRequestUrl);
                digestRequest.CookieContainer = Cookies;
                digestRequest.Method = "POST";
                digestRequest.ContentLength = 0;

                string formDigest;

                using (var digestResponse = (HttpWebResponse)digestRequest.GetResponse())
                {
                    string digestResponseData;

                    using (var digestResponseStream = digestResponse.GetResponseStream())
                    {
                        if (digestResponseStream == null)
                            throw new ArgumentNullException(nameof(digestResponseStream));

                        digestResponseData = new StreamReader(digestResponseStream).ReadToEnd();

                        var digestResponseXml = XDocument.Parse(digestResponseData);
                        var x = from y in digestResponseXml.Descendants()
                                where
                                y.Name ==
                                XName.Get(AppSettings.FormDigestValueTag, "http://schemas.microsoft.com/ado/2007/08/dataservices")
                                select y;
                        formDigest = x.First().Value;
                        return formDigest;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(
                    $"An error occurred when getting request digest:{ex.Message}{ex.StackTrace}");
            }
        }

        private static void GetAccessToken(string securityToken)
        {
            try
            {
                var accessTokenRequest = (HttpWebRequest)WebRequest.Create(AppSettings.SignInUrl);
                var accessTokenRequestBody = Encoding.ASCII.GetBytes(securityToken);
                accessTokenRequest.Method = "POST";
                accessTokenRequest.ContentType = "application/x-www-form-urlencoded";
                accessTokenRequest.ContentLength = accessTokenRequestBody.Length;
                accessTokenRequest.CookieContainer = Cookies;

                using (var accessTokenStream = accessTokenRequest.GetRequestStream())
                {
                    accessTokenStream.Write(accessTokenRequestBody, 0, accessTokenRequestBody.Length);

                    using (var accessTokenResponse = (HttpWebResponse)accessTokenRequest.GetResponse())
                    {
                        var accessTokenResponseStream = accessTokenResponse.GetResponseStream();

                        if (accessTokenResponseStream == null)
                            throw new ArgumentNullException(nameof(accessTokenResponseStream));

                        new StreamReader(accessTokenResponseStream).ReadToEnd();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(
                    $"An error occurred when reading the list items from SharePoint:{ex.Message}{ex.StackTrace}");
            }
        }

        private static string GetSecurityToken()
        {
            try
            {
                var tokenEnvelopeXml = File.ReadAllText(AppSettings.TokenEnvelopeFilePath);
                var requestBody =
                    tokenEnvelopeXml.Replace("{USERNAME}", AppSettings.Username)
                        .Replace("{PASSWORD}", AppSettings.Password)
                        .Replace("{ENDPOINTREFERENCE}", AppSettings.EndPoint);

                var securityTokenRequest = (HttpWebRequest)WebRequest.Create(AppSettings.StsEndpoint);
                var requestBodyData = Encoding.ASCII.GetBytes(requestBody);
                securityTokenRequest.Method = "POST";
                securityTokenRequest.ContentType = "application/xml";
                securityTokenRequest.ContentLength = requestBodyData.Length;

                using (var securityTokenStream = securityTokenRequest.GetRequestStream())
                {
                    securityTokenStream.Write(requestBodyData, 0, requestBodyData.Length);
                }

                using (var securityTokenResponse = (HttpWebResponse)securityTokenRequest.GetResponse())
                {
                    using (var securityTokenResponseStream = securityTokenResponse.GetResponseStream())
                    {
                        if (securityTokenResponseStream == null)
                            throw new ArgumentNullException(nameof(securityTokenResponseStream));

                        var securityTokenResponseXml = new StreamReader(securityTokenResponseStream).ReadToEnd();

                        var xData = XDocument.Parse(securityTokenResponseXml);
                        var namespaceManager = new XmlNamespaceManager(new NameTable());
                        namespaceManager.AddNamespace("S", "http://www.w3.org/2003/05/soap-envelope");
                        namespaceManager.AddNamespace("wst", "http://schemas.xmlsoap.org/ws/2005/02/trust");
                        namespaceManager.AddNamespace("wsse",
                            "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd");
                        var securityTokenNode = xData.XPathSelectElement(AppSettings.SecurityTokenNode, namespaceManager);
                        if (securityTokenNode == null) throw new ArgumentNullException(nameof(securityTokenNode));

                        return securityTokenNode.Value;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(
                    $"An error occurred when getting the security token:{ex.Message}{ex.StackTrace}");
            }
        }
    }
}
