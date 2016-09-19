# Access SharePoint Online REST API with User Context

## Summary

SharePoint Online(SPOL) allows remote applications to call the REST API with user impersonation. This solution demonstrates how to access SPOL REST API and to the data from a SharePoint list in a tenant using C#. However, outside of .NET the authentication piece is not so straightforward. App authentication solves this issue for registered apps but in this solution you will see how remote user authentication can be achieved, regardless of platform.

The goal of this solution is to provide examples of the HTTP requests which need to be made in order to authenticate SharePoint Online. It then provides an example of using the same technique to read data from a SharePoint list just to make sure it all works.

## Applies to

* SharePoint Online

## Solution

Solution|Author(s)
--------|---------
SPOL_REST_Test|Joseph Velliah (SPRIDER, @sprider)

## Version history

Version|Date|Comments
-------|----|--------
1.0|September 19, 2016|Initial commit

## Disclaimer
**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- clone this repo
- open the solution in Visual Studio 
- update the App.config file as per your environment 
- press F5 is visual studio to run/debug


