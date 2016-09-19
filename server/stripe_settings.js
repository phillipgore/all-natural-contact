var Stripe = StripeAPI(Meteor.settings.private.stripeSecretKey);

Meteor.methods({
  getCustomer: function() {
    var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
    var stripeId = Groups.findOne({_id: groupId}).stripeId

    if (stripeId == null) {
      throw new Meteor.Error(500, 'This account has no credit card on record.', 'Stripe-Card Does Not Exist')
    } else {
      var customerDetails = Async.runSync(function(complete) {
        Stripe.customers.retrieve(stripeId, function(error, result) {
            complete(error, result);
        });
      })
      var dataCount = customerDetails.result.sources.data.length
      if (dataCount === 0) {
        throw new Meteor.Error(500, 'This account has no credit card on record.', 'Stripe-Card Does Not Exist')
      } else {
        var cardDetails = customerDetails.result.sources.data[0];
        return {
          cardInfo: {
            brand: cardDetails.brand,
            expMonth: cardDetails.exp_month,
            expYear: cardDetails.exp_year,
            lastDigits: cardDetails.last4
          }
        }
      }
    }
  },

	addCard: function(customerProperties) {
    var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
    var stripeId = Groups.findOne({_id: groupId}).stripeId

    if (stripeId == null) {
      var createCustomer = Async.runSync(function(complete) {
        Stripe.customers.create(customerProperties, function(error, result) {
          complete(error, result);
        })
      });

      if (createCustomer.error) {
        throw new Meteor.Error("stripe-error", createCustomer.error.message)
      } else {
        Groups.update({_id: groupId}, {$set: {stripeId: createCustomer.result.id, stripeSubcription: createCustomer.result.subscriptions.data[0].id}})
        return
      }
    } else {
      throw new Meteor.Error(500, 'Account is already attached to a card.', 'Stripe-Customer Already Exists')
    }
	},

  swapCard: function(source) {
    var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
    var stripeId = Groups.findOne({_id: groupId}).stripeId

    var newCard = Async.runSync(function(complete) {
      Stripe.customers.update(stripeId, {source: source}, function(error, result) {
        complete(error, result)
      })
    })

    if (newCard.error) {
      throw new Meteor.Error("stripe-error", newCard.error.message)
    } else {
      return
    }
  },

  updateSubscriptionQuantity: function(quantity) {
    var groupId = Meteor.users.findOne({_id: this.userId}).profile.belongs_to_group;
    var stripeId = Groups.findOne({_id: groupId}).stripeId;

    var subscriptionUpdate = Async.runSync(function(complete) {
      Stripe.customers.updateSubscription(stripeId, {plan: 'simple', quantity: quantity}, function(error, result) {
        complete(error, result)
      })
    });

    if (subscriptionUpdate.error) {
      throw new Meteor.Error("stripe-error", subscriptionUpdate.error.message)
    } else {
      return
    }
  },

});

Router.route('/webhook/stripe', function () {
  var request = this.request.body;

  console.log(request)

  this.response.statusCode = 200;
  this.response.end('Oh hai Stripe!\n');
}, {where: 'server'});
