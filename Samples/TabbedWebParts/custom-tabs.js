$("#contentBox").hide();
/* Modifed jquery.hillbillytabs.2013.js code */
function genWebpartTabs(webPartTitles){
    var CEWPID = "", tabDivID = "", ulID = "";
    $("#tabsContainer").closest("[id^='MSOZoneCell_WebPart']").find("span[id^='WebPartCaptionWPQ']").each(function(){
		CEWPID = $(this).attr("id");
    });
    if (CEWPID === ""){
		CEWPID = $("#tabsContainer").closest("[id^='MSOZoneCell_WebPart']").attr("id");
    }
    tabDivID = CEWPID + "TabsDiv";
    ulID = CEWPID + "Tabs";
    $("#tabsContainer").attr("id",tabDivID).append("<ul id='"+ulID+"' class='tab-titles'></ul>");
	/* Random Order */
    if(webPartTitles == undefined){
        var index = 0;
        $("#" + tabDivID).closest("div.ms-webpart-zone, div.ms-rte-layoutszone-inner").find("h2.ms-webpart-titleText").each(function(){
            if($(this).find("span[id^='WebPartCaptionWPQ']").attr("id") != CEWPID){
                var title = $(this).text();
                $("#"+ulID).append('<li><a href="#Tab'+index+CEWPID+'" id="TabHead'+index+CEWPID+'">'+title+'</a></li>').after('<div id="Tab'+index+CEWPID+'"></div>');
                var webPart = $(this).closest("[id^='MSOZoneCell_WebPart']");
                $("#Tab" + index+CEWPID).append((webPart));
				$("#Tab" + index+CEWPID).addClass("tab-pane");
                index++;
            }
        });
    }else {
		/* Specifc Order */
		for(index in webPartTitles){
            var title = webPartTitles[index];
            var tabContent = title.split(";#");
            if (tabContent.length > 1){
                $("#"+ulID).append('<li><a href="#Tab'+index+CEWPID+'" id="TabHead'+index+CEWPID+'">'+ tabContent[0]+'</a></li>').after('<div id="Tab'+index+CEWPID+'"></div>');
				for(i = 1; i < tabContent.length; i++){
                    $("h2.ms-webpart-titleText").each(function(){
                        $(this).find("span:contains('"+tabContent[i]+"')").each(function(){
                             if ($(this).text() == tabContent[i]){
                                var webPart = $(this).closest("span").closest("[id^='MSOZoneCell_WebPart']");
                                $("#Tab" + index+CEWPID).append((webPart));
                            }
                        });
                    });
                }
            }else{
                $("h2.ms-webpart-titleText").each(function(){
                    $(this).find("span:contains('"+title+"')").each(function(){
                         if ($(this).text() == title){
                            $("#"+ulID).append('<li><a href="#Tab'+index+CEWPID+'" id="TabHead'+index+CEWPID+'">'+ title+'</a></li>').after('<div id="Tab'+index+CEWPID+'"></div>');
                            var webPart = $(this).hide().closest("span").closest("[id^='MSOZoneCell_WebPart']");
                            $("#Tab" + index+CEWPID).append((webPart));
                        }
                    });
                });
            }
        }
    }    
	/* Hide error parts code */
    HideErrorParts();
	/* Call custom tabs code */
	setTabAcs();
}

/* Logic for hidding webparts with errors */
function HideErrorParts(){
    $("span[id^='WebPartCaptionWPQ']").each(function(){
        $(this).prev("span:contains('Error')").each(function(){
			var webPart = $(this).closest("span").closest("[id^='MSOZoneCell_WebPart']").hide();
        });
    });
}

/* Code for structuring tabs*/
function setTabAcs(){
	$(".tab-titles").siblings().wrapAll("<div class='tab-content'></div>");
	ul = $('.tab-content');
	ul.children().each(function(i,li){ul.prepend(li)})
	
	$(document).find(".tab-titles li").each(function(i,value){
		var elem = $(this).find("a").clone();
		var elem_id = $(this).find("a").attr('href');
		elem.addClass("ac-panel");
		$(this).find("a").attr("id" , elem_id.replace('#', '') + "_alink");
		elem.attr("id" , elem_id.replace('#', '') + "_plink");
		setAccordionPanel(elem, elem_id);
	});
	/* Set Default active states */
	$(".tab-content>div").addClass("tab-pane");
	$(".tab-titles").find("li:nth-child(1)").addClass("active");
	$(".tab-content").find(".ac-panel:nth-child(1)").addClass("active");
	$(".tab-content").find(".tab-pane:first").addClass("active");
	/* Show Content */
	$("#contentBox").fadeIn("slow");
}

function setAccordionPanel(elem, elem_id){
	$(elem).insertBefore(elem_id);
}
/* Capture click events on dynamically generated sections - tabs */
$(document).on("click",".tab-titles a", function(e){
	e.preventDefault();
	e.stopImmediatePropagation();
	var trigger = $(this).parent();
	var target_id = $(this).attr("href");
	var pLink = target_id+"_plink";
	var active_check = $(this).parent().hasClass("active");
	if(active_check){
		return false;
	}else{
		$(".tab-content>.tab-pane").hide();
		$(target_id).fadeIn();
		trigger.parent().find("li").removeClass("active");
		trigger.addClass("active");
		$(".tab-content").find(".ac-panel").removeClass("active");
		$(pLink).addClass("active");
		$(target_id).parent().find(".tab-pane").removeClass("active");
		$(target_id).addClass("active");
	}
});
/* Capture click events on dynamically generated sections - accordions */
$(document).on("click",".ac-panel",function(e){
	e.preventDefault();
	e.stopImmediatePropagation();
	var target_id = $(this).attr("id").replace("_plink","");
	if($("#"+target_id).hasClass("active")){
		return false;
	}else{
		$(".tab-content").find(".ac-panel").removeClass("active");
		$(".tab-content").find(".ac-panel").next().removeClass("active").hide();
		$(this).addClass("active");
		$(".tab-titles").find("li").removeClass("active");
		$("#"+target_id+"_alink").parent().addClass("active");
		$(this).next().addClass("active").show();
	}
});
/* Customization */
function buildStyles(appearance_config){
	var startStyleTag = "<style>",
		endStyleTag = "</style>",
		inactiveTabClass = ".ac-panel, .tab-titles>li>a:hover,.tab-titles>li>a{background-color:" + appearance_config.inactive_tab_color + "!important;}",
		inactiveTabTextClass = ".ac-panel, .tab-titles>li>a{color:" + appearance_config.inactive_tab_text_color + "!important;}",
		inactiveTabHover = ".tab-titles>li>a:hover{background-color:"+ appearance_config.inactive_tab_color_hover +"!important;}"
		activeTabClass = ".ac-panel.active, .tab-titles>li.active>a:hover,.tab-titles>li.active>a{background-color:" + appearance_config.active_tab_color + "!important;}.tab-titles>li:first-child.active{border-left-color:"+ appearance_config.active_tab_color +"}",
		activeTabTextClass = ".ac-panel.active, .tab-titles>li.active>a{color:" + appearance_config.active_tab_text_color + "!important;}";
		tabContentBgColor= ".tab-content{background-color:"+ appearance_config.tab_content_bgColor +"!important;}@media screen and (max-width: 991px){.tab-pane{background-color:"+ appearance_config.tab_content_bgColor +"}}"
	var customizedStyle = startStyleTag + activeTabClass + activeTabTextClass + inactiveTabClass + inactiveTabTextClass + inactiveTabHover + tabContentBgColor + endStyleTag;
	$(customizedStyle).appendTo("head");
}