using Office365.Graph.Sample.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Office365.Graph.Sample
{
    class Program
    {
        static void Main(string[] args)
        {
            ListGroupResponseRoot listGroupResponseRoot = null;
            List<ListGroupResponse> listGroupResponse = null;
            try
            {
                listGroupResponseRoot = ListGroups();
                listGroupResponse = listGroupResponseRoot.value;

                foreach (var listGroup in listGroupResponse)
                {
                    Console.WriteLine(listGroup.displayName);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            Console.ReadLine();
        }

        static TokenResponse GetToken()
        {
            string tokenEndPoint = string.Empty,
             scope = string.Empty,
             clientId = string.Empty,
             clientSecret = string.Empty,
             grantType = string.Empty;
            FormUrlEncodedContent data = null;
            try
            {
                tokenEndPoint = ConfigurationManager.AppSettings[Constants.AppConfig.TokenEndPoint];
                tokenEndPoint = string.Format(tokenEndPoint, ConfigurationManager.AppSettings[Constants.AppConfig.TenantId]);
                scope = ConfigurationManager.AppSettings[Constants.AppConfig.Scope];
                clientId = ConfigurationManager.AppSettings[Constants.AppConfig.ClientId];
                clientSecret = ConfigurationManager.AppSettings[Constants.AppConfig.ClientSecret];
                grantType = ConfigurationManager.AppSettings[Constants.AppConfig.GrantType];

                data = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>(Constants.KeyValuePair.ClientId, clientId),
                    new KeyValuePair<string, string>(Constants.KeyValuePair.Scope, scope),
                    new KeyValuePair<string, string>(Constants.KeyValuePair.ClientSecret, clientSecret),
                    new KeyValuePair<string, string>(Constants.KeyValuePair.GrantType, grantType)
                });

                Task<TokenResponse> reponse = GetTokenAsync(tokenEndPoint, data);
                reponse.Wait();

                return reponse.Result;
            }
            catch (Exception)
            {

                throw;
            }
        }

        static ListGroupResponseRoot ListGroups()
        {
            string graphEndPoint = string.Empty;
            try
            {
                graphEndPoint = ConfigurationManager.AppSettings[Constants.AppConfig.GraphEndPoint];

                Task<ListGroupResponseRoot> reponse = ListGroupsAsync(graphEndPoint);
                reponse.Wait();
                return reponse.Result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        static async Task<ListGroupResponseRoot> ListGroupsAsync(string uri)
        {
            HttpClient httpClient = null;
            string accessToken = string.Empty;
            string content = string.Empty;

            try
            {
                accessToken = GetToken().access_token;

                using (httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(Constants.KeyValuePair.Bearer, accessToken);
                    HttpResponseMessage response = await httpClient.GetAsync(new Uri(uri));

                    response.EnsureSuccessStatusCode();
                    content = await response.Content.ReadAsStringAsync();

                    return await Task.Run(() => JsonConvert.DeserializeObject<ListGroupResponseRoot>(content));
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        static async Task<TokenResponse> GetTokenAsync(string uri, FormUrlEncodedContent data)
        {
            string content = string.Empty;
            try
            {
                using (HttpClient httpClient = new HttpClient())
                {
                    HttpResponseMessage response = await httpClient.PostAsync(uri, data);

                    response.EnsureSuccessStatusCode();
                    content = await response.Content.ReadAsStringAsync();

                    return await Task.Run(() => JsonConvert.DeserializeObject<TokenResponse>(content));
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
