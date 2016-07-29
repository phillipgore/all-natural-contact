SupportCount = new Mongo.Collection('supportCount');
Support = new Mongo.Collection('support');
SupportSearch = new Mongo.Collection('supportSearch');

SupportSchema = new SimpleSchema({
  section_perma_link: {
    type: String,
    unique: true,
    label: "Section Perma Link",
  },
  section_meta_title: {
    type: String,
    label: "Section Meta Text",
    defaultValue: "All Natural Contact: Support",
  },
  section_meta_description: {
    type: String,
    label: "Section Meta Description",
    defaultValue: "All Natural Contact: Support",
  },
  section_order: {
    type: Number,
    decimal: true,
    label: "Section Order",
  },
  section_title: {
    type: String,
    label: "Section Title",
  },
  section_text: {
    type: String,
    label: "Section Text",
  },
  section_belongs_to: {
    type: String,
    label: "Section Belongs To",
  },
  section_has: {
    type: [String],
    label: "Section Has",
    optional: true
  },
  created_on: {
		type: String,
		label: "Created On Date",
		autoValue: function() {
			if ( this.isInsert ) {
				return moment().toISOString();
			}
		}
	},
	updated_on: {
		type: String,
		label: "Updated On Date",
		optional: true,
		autoValue: function() {
			if ( this.isUpdate ) {
				return moment().toISOString();
			}
		}
	}
})

Support.attachSchema( SupportSchema );

Meteor.methods({
	supportInsert: function(supportProperties) {
		var supportId = Support.insert(supportProperties);

    var belongs_to = supportProperties.section_belongs_to;
    if (belongs_to != 'none') {
      Support.update(belongs_to, {$addToSet: {section_has: supportId}})
    }

		return {
			_id: supportId
		};
	},

	supportUpdate: function(supportId, supportProperties) {
		Support.update(supportId, {$set: supportProperties});
    Support.update({}, {$pull: {section_has: supportId}}, { multi: true });

    var belongs_to = supportProperties.section_belongs_to;
    if (belongs_to != 'none') {
      Support.update(belongs_to, {$addToSet: {section_has: supportId}})
    }
	},

	supportRemove: function(supportId, has_ids, belongs_to) {
		Support.remove({_id: supportId});
    Support.update({}, {$pull: {section_has: supportId}}, { multi: true });
    if (has_ids) {
		  Support.update({_id: {$in: has_ids}}, {$set: {section_belongs_to: belongs_to}}, { multi: true });
      Support.update({_id: belongs_to}, {$addToSet: {section_has: {$each: has_ids}}})
    }
	}
});
