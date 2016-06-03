Template.footerConversationProcess.events({	
	'click .js_tool_conversation': function(e) {
		e.preventDefault();
		$('.content.three').hide();
		$('.content.two').show();
		Session.set('currentTool', 'js_tool_conversation');
	},
	
	'click .js_tool_process': function(e) {
		e.preventDefault();
		$('.content.two').hide();
		$('.content.three').show();
		Session.set('currentTool', 'js_tool_process');
	},
})