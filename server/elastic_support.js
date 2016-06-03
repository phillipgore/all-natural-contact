import html_strip from 'htmlstrip-native';
var cursor = Support.find({});

cursor.observeChanges({
	added: function (id) {
		var support = Support.findOne({_id: id})
    var options = {
    	include_script : true,
    	include_style : true,
    	compact_whitespace : true,
      include_attributes : { '*': true }
    };
    var section_text = html_strip.html_strip(support.section_text, options);
		EsClient.index({
			index: "supportindex",
			type: "support",
			id: id,
			body: {
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
	},

	changed: function (id) {
    var support = Support.findOne({_id: id})
    var options = {
    	include_script : false,
    	include_style : false,
    	compact_whitespace : true
    };
    var section_text = html_strip.html_strip(support.section_text, options);
		EsClient.index({
			index: "supportindex",
			type: "support",
			id: id,
			body: {
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
	},

	removed: function (id) {
		EsClient.delete({
			index: "supportindex",
			type: "support",
			id: id,
		});
	},
});
