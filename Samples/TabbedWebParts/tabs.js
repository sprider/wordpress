<link rel="stylesheet" type="text/css" href="assets/styles/custom-tabs.css"/>
<script type="text/javascript" src="assets/scripts/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="assets/scripts/custom-tabs.js"></script> 
<div id="tabsContainer"></div>
<script type="text/javascript">
    jQuery(document).ready(function ($) {
		/*
			The below parameters allow you to set/change the colors of the tab/panels rendering. You can customized the following parameters:
			1. Active Tab Color
			2. Active Tab Text Color
			3. Inactive Tab Color
			4. Inactive Tab Text Color
			5. Inactive Tab Color On Mouse Hover
			6. Tab Content Background Color
		*/
		
		var appearance_config = {
			active_tab_color : '#22465E',
			active_tab_text_color : '#FFFFFF',
			inactive_tab_color : '#58676D',
			inactive_tab_text_color : '#FFFFFF',
			inactive_tab_color_hover : '#3E4E54',
			tab_content_bgColor : '#F9F9F9'
		}
		
        //Put 2 web parts in 2 different tabs
        var webPartTitles = ["Image Viewer","Page Viewer"];
		genWebpartTabs(webPartTitles);

        //Create a Tab with Two Web Parts, and a second tab with one Web Part
        //var webPartTitles = ["Tab Title;#Web Part Title 1;#Web Part Title 2","Web Part Title 3"];
        //genWebpartTabs(webPartTitles);

        //Put all web parts (that have visible titles) in current zone into tabs 
        //genWebpartTabs();
		
		// Call Customization procedure to set specific or default color combinations on tabs
		buildStyles(appearance_config);
    });	
</script>