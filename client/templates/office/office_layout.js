Template.officeLayout.events({
  'click .js_office': function(e) {
    $('.js_delete').addClass('hide');
    $('.js_delete_inactive').show();
    $('.support_list_item').removeClass('active');
  },

  'click .js_tool': function(e) {
    $('.js_tool').removeClass('active')
    $(e.target).addClass('active');
  },

  'click .js_delete': function(e) {
    if (Session.get('currentSection')) {
      var section = Support.findOne({_id: Session.get('currentSection')});
      confirm('Are you sure you want to delete the selected section?');

      Meteor.call('supportRemove', section._id, section.section_has, section.section_belongs_to, function(error, result) {
   			if (error) {
   				return alert(error.reason);
   			} else {
          $('.support_list_item').removeClass('active');
          $('.js_office').click()
   			}
   		});
    }
  }
});
