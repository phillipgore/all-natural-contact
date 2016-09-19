Meteor.startup(function() {
  var stripeKey = Meteor.settings.public.stripePublishableKey;
  Stripe.setPublishableKey( stripeKey );
});
