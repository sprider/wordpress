using System.Configuration;

namespace SPOL_REST_Test.Helper
{
    class AppSettings
    {
        internal static readonly string TenantType = ConfigurationManager.AppSettings["TenantType"];
        internal static readonly string Username = ConfigurationManager.AppSettings["Username"];
        internal static readonly string Password = ConfigurationManager.AppSettings["Password"];
        internal static readonly string EndPoint = ConfigurationManager.AppSettings["EndPoint"];
        internal static readonly string SignInUrl = ConfigurationManager.AppSettings["SignInUrl"];
        internal static readonly string StsEndpoint = ConfigurationManager.AppSettings["StsEndpoint"];
        internal static readonly string AdfsEndpoint = ConfigurationManager.AppSettings["AdfsEndpoint"];
        internal static readonly string Realm = ConfigurationManager.AppSettings["Realm"];
        internal static readonly string WrReply = ConfigurationManager.AppSettings["WrReply"];
        internal static readonly string MsoEndpoint = ConfigurationManager.AppSettings["MsoEndpoint"];
        internal static readonly string RequestDigestEndpoint = ConfigurationManager.AppSettings["RequestDigestEndpoint"];
        internal static readonly string SpListApiEndpoint = ConfigurationManager.AppSettings["SpListApiEndpoint"];
        internal static readonly string SecurityTokenNode = ConfigurationManager.AppSettings["SecurityTokenNode"];
        internal static readonly string TokenEnvelopeFilePath = ConfigurationManager.AppSettings["TokenEnvelopeFilePath"];
        internal static readonly string SecurityTokenFormatFilePath = ConfigurationManager.AppSettings["SecurityTokenFormatFilePath"];
        internal static readonly string FormDigestValueTag = ConfigurationManager.AppSettings["FormDigestValueTag"];
        internal static readonly string ListTitle = ConfigurationManager.AppSettings["ListTitle"];
    }
}
