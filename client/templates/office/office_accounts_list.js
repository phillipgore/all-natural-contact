// Template.officeAccountsList.onRendered(function() {
//   $('.js_delete').addClass('hide')
//   $('.js_delete_inactive').removeClass('hide');
//
//   $('.js_tool').removeClass('active')
//   $('.js_tool_office_accounts').addClass('active');
// });
//
// Template.officeAccountsList.helpers({
//   groups: function() {
// 		return Groups.find({name: {$ne: "App Administration"}})
// 	},
// });
//
// Template.officeAccountsList.events({
//   'click .js_delete_group': function(e) {
//     var groupId = $(e.target).attr('id');
//     var groupName = $(e.target).attr('data-group-name');
//     var r = confirm('Are you sure you want to delete the "' + groupName + '" account and all associated data?')
//     if (r == true) {
//       Meteor.call('groupRemove', groupId, function(error) {
//         if (error) {
//   				return alert(error.reason);
//   			}
//       });
//     }
//   }
// })
