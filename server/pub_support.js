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
		index: 'supportindex',
		type: 'support',
		body: {
			query: {
				bool: {
					must: [{
						multi_match: {
							query: supportSearchText,
							type: 'most_fields',
							fields: ['section_title^1', 'section_text']
						}
					}],
				}
			},
      highlight: {
        fields: {
          section_title: {'number_of_fragments': 0},
          section_text: {'number_of_fragments': 0}
        }
      }
		},

	}).then(function(body) {
		var sections = body.hits.hits;
		future.return(sections);
	}, function(error) {
		results.reject(error);
	})

	_.each(future.wait(), function(support) {
    var source = support._source
    var highlight = support.highlight
    var new_support = _.extend(source, highlight);
		self.added('supportSearch', Random.id(), new_support);
	});

	self.ready();
});
