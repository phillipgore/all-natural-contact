Meteor.publish('supportTitles', function() {
  return Support.find({}, {fields: {section_perma_link: 1, section_title: 1, section_belongs_to: 1, section_has: 1, section_order: 1}})
});

Meteor.publish('supportSection', function(sectionId) {
  return Support.find({_id: sectionId})
});

Meteor.publish('supportPermaSection', function(sectionPermaLink) {
  return Support.find({section_perma_link: sectionPermaLink})
});

Meteor.publish('supportCount', function() {
	var self = this

	var supportCount = Support.find().count()

	var supportCount = [{
		support_count: supportCount
	}];

	_.each(supportCount, function(count) {
		self.added('supportCount', Random.id(), count);
	});

	self.ready();
});

import Future from 'fibers/future';
Meteor.publish('supportSearch', function(supportSearchText) {
	var self = this
	var future = new Future();

	EsClient.search({
		index: "supportindex",
		type: "support",
		body: {
			query: {
				bool: {
					should: [{
						multi_match: {
							query: supportSearchText,
							type: "most_fields",
							fields: ['section_title^1', 'section_text']
						}
					}],
				}
			}
		},
		size: 10,
	}).then(function(body) {
		var sections = _.pluck(body.hits.hits, '_source');
		future.return(sections);
	}, function(error) {
		results.reject(error);
	})

	_.each(future.wait(), function(support) {
		self.added('supportSearch', Random.id(), support);
	});

	self.ready();
});
