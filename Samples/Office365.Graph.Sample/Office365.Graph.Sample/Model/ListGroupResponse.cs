using System;
using System.Collections.Generic;

namespace Office365.Graph.Sample.Model
{
    class ListGroupResponseRoot
    {
        public List<ListGroupResponse> value { get; set; }
    }
    public class ListGroupResponse
    {
        public string id { get; set; }
        public object deletedDateTime { get; set; }
        public object classification { get; set; }
        public DateTime createdDateTime { get; set; }
        public List<object> creationOptions { get; set; }
        public string description { get; set; }
        public string displayName { get; set; }
        public List<object> groupTypes { get; set; }
        public string mail { get; set; }
        public bool mailEnabled { get; set; }
        public string mailNickname { get; set; }
        public object onPremisesLastSyncDateTime { get; set; }
        public object onPremisesSecurityIdentifier { get; set; }
        public object onPremisesSyncEnabled { get; set; }
        public object preferredDataLocation { get; set; }
        public List<object> proxyAddresses { get; set; }
        public DateTime renewedDateTime { get; set; }
        public List<object> resourceBehaviorOptions { get; set; }
        public List<object> resourceProvisioningOptions { get; set; }
        public bool securityEnabled { get; set; }
        public string visibility { get; set; }
        public List<object> onPremisesProvisioningErrors { get; set; }
    }
}

