SP.SOD.executeOrDelayUntilScriptLoaded(getCurrentUserEmail, 'SP.js');

// Global Variables
var $j = jQuery.noConflict();

var listName = "Rating"; // rating list title
var contactUserName = "Joseph Velliah"; // contact person for support
var loadPopupAfter = 5000; // milliseconds
var pageTitle = "Unknown";
var currentUserEmail = "Unknown";

function setRating(rating) {

    if (rating >= 1 && rating <= 5) {

        if (document.title)
            pageTitle = document.title;

        if (currentUserEmail)
            addRating(rating, currentUserEmail, pageTitle);
    }
    else
    {
        alert("There is a problem in adding your rating. Please contact : " + contactUserName);
        console.log("Rating object is undefined");
    }
}

function addRating(rating, currentUserEmail, pageTitle)
{
    var clientContext = new SP.ClientContext.get_current();
    var web = clientContext.get_web();
    var oList = web.get_lists().getByTitle(listName);
    var item = new SP.ListItemCreationInformation();
    var oListItem = oList.addItem(item);
    oListItem.set_item('Title', currentUserEmail);
    oListItem.set_item('Rating', rating);
    oListItem.set_item('Page', pageTitle);
    oListItem.update();
    clientContext.load(oListItem);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            $j('#ratingModal').modal('hide');
            alert("Thank you for your rating!");            
        }),
        Function.createDelegate(this, function (sender, args) {
            $j('#ratingModal').modal('hide');
            alert("There is a problem in adding your rating. Please contact : " + contactUserName);
            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());            
    }));
}

function getCurrentUserEmail() {
    var context = new SP.ClientContext.get_current();
    var web = context.get_web();
    currentUser = web.get_currentUser();
    context.load(currentUser);
    context.executeQueryAsync(onCurrentUserEmailSuccess, onCurrentUserEmailFail);
}

function onCurrentUserEmailSuccess(sender, args) {
    if (currentUser.get_email())
        currentUserEmail = currentUser.get_email();
}

function onCurrentUserEmailFail(sender, args) {
    alert("There is a problem in adding your rating. Please contact : " + contactUserName);
    console.log('Failed to get current user' + args.get_message());
}

$j(document).ready(function () {
    setTimeout(function () {
        $j('#ratingModal').modal('show');
    }, loadPopupAfter);
});