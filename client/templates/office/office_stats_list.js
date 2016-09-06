Template.officeStatsList.onRendered(function() {
  $('.js_delete').addClass('hide')
  $('.js_delete_inactive').removeClass('hide');

  $('.js_tool').removeClass('active')
  $('.js_tool_office_stats').addClass('active');
});

Template.officeStatsList.helpers({

});

Template.officeStatsList.events({
  
})
