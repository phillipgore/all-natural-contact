import html_strip from 'htmlstrip-native';
var cursor = Support.find({});

cursor.observeChanges({
	added: function (id) {
		var support = Support.findOne({_id: id})
		EsClient.indices.exists({
			index: 'supportindex'
		}, function(error, exists) {
			if (exists) {
				supportIndex(support);
			} else {
				supportCreate().then(function() {
					supportIndex(support);
				});
			}
		});
	},

	changed: function (id) {
    var support = Support.findOne({_id: id})
		EsClient.indices.exists({
			index: 'supportindex'
		}, function(error, exists) {
			if (exists) {
				supportIndex(support);
			} else {
				supportCreate().then(function() {
					supportIndex(support);
				});
			}
		});
	},

	removed: function (id) {
		EsClient.delete({
			index: 'supportindex',
			type: 'support',
			id: id,
		});
	},
});


function supportCreate() {
	return EsClient.indices.create({
		index: 'supportindex',
		body: {
			settings: {
				analysis: {
					filter: {
						support_filter: {
							type: 'nGram',
							min_gram: 1,
							max_gram: 20
						}
					},
					analyzer: {
						support_analyzer: {
							type: 'custom',
							tokenizer: 'standard',
							filter: [
								'lowercase',
								'support_filter'
							]
						}
					}
				}
			},
			mappings: {
				support: {
	        properties: {
						id: {
							type: 'string'
						},
	          section_perma_link: {
	            type: 'string'
	          },
	          section_order: {
	            type: 'long'
	          },
	          section_title: {
	            type: 'string',
							analyzer: 'support_analyzer',
							search_analyzer: 'standard'
	          },
	          section_text: {
	            type: 'string',
							analyzer: 'support_analyzer',
							search_analyzer: 'standard'
	          },
	          section_belongs_to: {
	            type: 'string'
	          },
	          created_on: {
	            type: 'date',
	            format: 'strict_date_optional_time||epoch_millis'
	          },
	          updated_on: {
	            type: 'date',
	            format: 'strict_date_optional_time||epoch_millis'
	          }
	        }
	      }
			}
		}
	})
}

function supportIndex(support) {
	var options = {
		include_script : true,
		include_style : true,
		compact_whitespace : true,
		include_attributes : { '*': true }
	};
	var section_text = html_strip.html_strip(support.section_text, options);
	EsClient.index({
		index: 'supportindex',
		type: 'support',
		id: support._id,
		body: {
			id: support._id,
			section_order: support.section_order,
			section_perma_link: support.section_perma_link,
			section_title: support.section_title,
			section_text: section_text.trim(),
			section_belongs_to: support.section_belongs_to,
			section_has: support.section_has,
			created_on: support.created_on,
			updated_on: support.updated_on
		}
	});
}
