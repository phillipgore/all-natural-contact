Meteor.startup(function () {
	Retina({retinajs: true, attribute : 'data-retina'});

	var stripeKey = Meteor.settings.public.stripePublishableKey;
  Stripe.setPublishableKey( stripeKey );

	Session.set({
		startUp: true,
		billingExpired: false,
		currentTag: '',
		contactScrollDir: 'up',
		currentContact: '',
		currentNameLast: '',
		contactPivotId: '',
		contactPivotNameLast: '',
		conScrollDir: 'up',
		conPivotDate: '',
		conPivotId: '',
		tagScrollDir: 'up',
		tagPivotId: '',
		tagPivotName: '',
		tagSelectScrollDir: 'up',
		tagSelectPivotId: '',
		tagSelectPivotName: '',
	});
});

Status.setTemplate('natural');

UI.registerHelper('currentType', function() {
	return Session.get('currentType');
});

UI.registerHelper('currentTag', function() {
	return Session.get('currentTag');
});

UI.registerHelper('currentTagName', function() {
	return Session.get('currentTagName');
});

UI.registerHelper('currentContact', function() {
	return Session.get('currentContact');
});

UI.registerHelper('accountTagCount', function() {
	return Counts.get('accountTagCount')
});

UI.registerHelper('accountContactCount', function() {
	return Counts.get('accountContactCount')
});

UI.registerHelper('taggedContactsCount', function() {
	return Counts.get('taggedContactsCount')
});

UI.registerHelper('currentConversation', function() {
	return Session.get('currentConversation');
});

UI.registerHelper('currentRoute', function() {
	return Session.get('currentRoute');
});

UI.registerHelper('updateRoute', function() {
	return Session.get('updateRoute');
});

UI.registerHelper('deleteRoute', function() {
	return Session.get('deleteRoute');
});

UI.registerHelper('deleteClass', function() {
	return Session.get('deleteClass');
});

UI.registerHelper('currentClick', function() {
	return Session.get('currentClick');
});

UI.registerHelper('topClick', function() {
	return Session.get('topClick');
});

UI.registerHelper('bottomClick', function() {
	return Session.get('bottomClick');
});

UI.registerHelper('tagInfoRoute', function() {
	return '/info/tag/' + Session.get('currentTag')
});

UI.registerHelper('formatCardMonth', function(datetime) {
	if (datetime < 10) {
		var expMonth = '0' + datetime.toString();
	} else {
		var expMonth = datetime.toString();
	}
	return expMonth
});

UI.registerHelper('formatCardYear', function(datetime) {
	return datetime.toString().slice(2)
});

UI.registerHelper('date', function(datetime) {
	return moment(datetime).format('YYYY-MM-DD');
});

UI.registerHelper('time', function(datetime) {
	return moment(datetime).tz('Zulu').format('HH:mm:ss:SSSZ');
});

UI.registerHelper('formatDate', function(datetime) {
	return moment(datetime).format('MMM D, YYYY');
});

UI.registerHelper('formatDateLong', function(datetime) {
	return moment(datetime).format('MMMM D, YYYY');
});

UI.registerHelper('formatTime', function(datetime) {
	return moment(datetime).tz(Meteor.user().profile.timezone).format('h:mm A');
});

UI.registerHelper('formatDateTime', function(datetime) {
	return moment(datetime).tz(Meteor.user().profile.timezone).format('MMM D, YYYY - h:mm A z');
});

UI.registerHelper('shortFormatDate', function(datetime) {
	return moment(datetime).tz(Meteor.user().profile.timezone).format('MM/DD/YY');
});

UI.registerHelper('author', function(created_by) {
	 var author = Meteor.users.findOne(created_by).profile
	 return author.first + " " + author.last
});

UI.registerHelper('returnCurrentLastName', function() {
	return Session.get('returnCurrentLastName');
});

UI.registerHelper('sub', function() {
	return Session.get('sub');
});

UI.registerHelper('contactInfoRoute', function() {
	return Session.get('contactInfoRoute');
});

UI.registerHelper('updateUser', function() {
	return Session.get('updateUser');
});

UI.registerHelper('today', function() {
	return new Date();
})
