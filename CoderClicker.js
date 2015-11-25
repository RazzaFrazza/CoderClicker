if (Meteor.isClient) {
  //Subscribing to User Data Collection
  Meteor.subscribe('userData');
  //Setting signup to username only
   Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
  });
  // counter starts at 0
  Session.setDefault('counter', 0);
    //Binding data to the template
  Template.hello.user = function () {
  return Meteor.user();
  };

  Template.hello.items = function () {
  return [{name: "Barista", cost: 500},{name: "New Manager", cost: 3000},{name: "Modern Espresso Machine", cost: 15000},{name: "New Payment System", cost: 30000},{name: "Online Marketing", cost: 100000},{name: "New Location", cost: 250000},{name: "Establish Franchise", cost: 1000000},{name: "Expand Internationally", cost: 5000000}];
  }

  Template.hello.players = function () {
  return Meteor.users.find({}, {sort: {'money': -1}});
  };

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
  	 'click input.code': function () {
    Meteor.call('click');
   },
     'click input.buy': function (event) {
    Meteor.call('buy', event.target.id); 
   }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
     Meteor.setInterval(function() {
    Meteor.users.find({}).map(function(user) {
      Meteor.users.update({_id: user._id}, {$inc: {'money': user.rate}})
    });
  }, 1000)
  });
  //Setting Money, Rate to 0
  Accounts.onCreateUser(function(options, user) {
  user.money = 0;
  user.rate = 0;
  return user;
  });
  Meteor.publish("userData", function () {
  return Meteor.users.find({}, {sort: {'money': -1}});
  });
}

Meteor.methods({
  click: function () {
    Meteor.users.update({_id: this.userId}, {$inc: {'money': 25}});
  },
  buy: function(amount) {
    if(Meteor.user().money >= amount && amount > 0) 
      Meteor.users.update({_id: this.userId}, {$inc: {'rate': (Math.floor(amount)), 'money': (0-amount)}}); 
  }
})

