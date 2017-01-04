
# Connect to a previously created Modern Site
$cred = Get-Credential
Connect-PnPOnline -Url https://yourtenant.sharepoint.com/sites/sitename -Credentials $cred

# Apply the PnP provisioning template
Apply-PnPProvisioningTemplate -Path "FilePath\CA_Custom_EditControlBlock_ItemUrl.xml" -Handlers CustomActions