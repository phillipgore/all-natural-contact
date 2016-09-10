Meteor.startup(function() {
  var stripeKey = Meteor.settings.public.stripePublishableKey;
  Stripe.setPublishableKey( stripeKey );

  STRIPE = {
    getToken: function( domElement, card, callback ) {
      Stripe.card.createToken( card, function( status, response ) {
        if ( response.error ) {
          $('.red_alert_msg').text(response.error.message).slideDown();
          // alert( response.error.message);
        } else {
          STRIPE.setToken( response.id, domElement, callback );
        }
      });
    },

    setToken: function( token, domElement, callback ) {
      $( domElement ).append( $( "<input type='hidden' name='stripeToken' />" ).val( token ) );
      callback();
    },

    stripeCreateCustomer: function(token, callback){
      stripe.customers.create({
        source: token
      }, function(err, customer) {
        if (err) {
          $('.red_alert_msg').text(err.message).slideDown();
        } else {
          alert(customer.id)
        }
      });
    }
  };
});
