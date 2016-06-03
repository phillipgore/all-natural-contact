Template.conversationNew.onRendered(function() {
	$('.icn_add_tag_disabled, .icn_add_contact_disabled, .icn_add_conversation_disabled, .icn_edit_disabled, .icn_delete_disabled, .icn_add_to_tag_disabled').show();
	$('.icn_add_tag, .icn_add_contact, .icn_add_conversation, .icn_edit, .icn_delete, .icn_add_to_tag').hide();

	$('.js_datepicker').pickadate({
		format: 'yyyy-mm-dd',
		today: 'Today\'s Date',
		container: '.date_container',
		onOpen: function() {
			$('.js_select').fadeOut(100);
		},
		onClose: function(context) {
			var date = moment($('.js_datepicker').val()).format('YYYY-MM-DD');
			var zulu = moment($('[name=conversation_date_time]').val()).format('YYYY-MM-DD');
			var local = moment.tz(zulu, Meteor.user().profile.timezone).format('HH:mm:ssZ');
			
			var newLocal = date + "T" + local;
			var newZulu = moment.tz(newLocal, "Zulu").format();
			//alert('date: ' + date + '\nzulu: ' + zulu + '\nlocal: ' + local + '\nnewLocal: ' + newLocal + '\nnewZulu: ' + newZulu)
			$('input[name=conversation_date_time]').val(newZulu);
			$('.js_conversation_date').html(moment(date).format('MMM D, YYYY') + ' &#9662;');
		}
	})

	$('.conversation_input').focus();
	$('.js_startup_loader').fadeOut('fast');
	$('textarea').autogrow();
});

Template.conversationNew.helpers({
	currentDate: function() {
		return moment().tz("Zulu").format();
	}
});

Template.conversationNew.events({

	'click .js_conversation_date': function(e) {
		e.stopPropagation();
		e.preventDefault();
		var input = $('.js_datepicker').pickadate();
		var picker = input.pickadate('picker');
		picker.open();
	},

	'click .js_time_label': function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		var zulu = $('[name=conversation_date_time]').val();
		var local = moment.tz(zulu, Meteor.user().profile.timezone).format();

		var hrs = moment.tz(local, Meteor.user().profile.timezone).format('hh');
		var mins = moment.tz(local, Meteor.user().profile.timezone).format('mm');
		var per = moment.tz(local, Meteor.user().profile.timezone).format('A');
				
		$('#hrs_' + hrs).addClass('time_active');
		$('#mins_' + mins).addClass('time_active');
		$('#per_' + per).addClass('time_active');
		
		$('.js_check').hide();
		$('.js_time_select').show();
	},
	
	'click .js_time_drop_option': function(e) {
		$(e.target).closest('.js_time_select').find('.time_active').removeClass('time_active');
		$(e.target).addClass('time_active');
	},
	
	'click .js_time_set': function(e) {
		e.preventDefault();
		var zulu = $('[name=conversation_date_time]').val();
		var local = moment.tz(zulu, Meteor.user().profile.timezone).format();

		var hrs = $('.hrs').find('.time_active').attr('id').substr(4);
		var mins = $('.mins').find('.time_active').attr('id').substr(5);
		var per = $('.per').find('.time_active').attr('id').substr(4);
		var offset = moment.tz(local, Meteor.user().profile.timezone).format('Z');
				
		if (per === 'PM' && hrs != "12") {
			var fullHrs = parseInt(hrs) + 12;
		} else if (per === 'AM' && hrs === "12") {
			var fullHrs = "00";
		} else {
			var fullHrs = hrs;
		}
		
		var zDate = moment(zulu).format('YYYY-MM-DD');
		var zSec = moment(zulu).format('ss');
		var newLocal = zDate + "T" + fullHrs + ":" + mins + ":" + zSec + offset;
		var newZulu = moment.tz(newLocal, "Zulu").format();
			
		$('[name=conversation_date_time]').val(newZulu);
		$('.js_time_label').html(moment.tz(newLocal, Meteor.user().profile.timezone).format('h:mm A') + ' &#9662;');
		$('.js_time_select').fadeOut(100);
	},

	'submit form': function(e) {
		e.preventDefault();
		var contactId = $(e.target).find('[name=contact_id]').val()
		
		var conversationProperties = {
			belongs_to_contact: contactId,
			conversation_label: $(e.target).find('[name=conversation_label]').val(),
			conversation_date: $(e.target).find('[name=conversation_date_time]').val(),
			conversation: $(e.target).find('[name=conversation]').val()
		};
		
		Meteor.call('conversationInsert', contactId, conversationProperties, function(error, result) {
			if (error) {
				return alert(error.reason);
			} else {
				Session.set({conScrollDir: 'middle', conPivotId: result._id, conPivotDate: conversationProperties.conversation_date});
				Router.go('/info/contact/' + Session.get('currentContact'));
			}
		});
	}
		
});





