Template.officeSupportUpdate.onRendered(function() {
  $('.js_delete').addClass('hide')
  $('.js_delete_inactive').removeClass('hide');
})

Template.officeSupportNew.helpers({
  options: function() {
    var sections = Support.find()

    var options = []
    sections.forEach(function(section) {
      if (section.section_belongs_to === 'none') {
        _.extend(section, {level: 0}, {section_label: section.section_title})
      } else {
        var id = section.section_belongs_to
        var i = 0;
        for (var supSection = 'start'; supSection != 'none'; i++) {
          var id = Support.findOne({_id: id}).section_belongs_to
          var supSection = id
        }
        var space = '&nbsp;'
        var string =  space.repeat(i * 3)
        _.extend(section, {level: i}, {section_label: string + section.section_title})
      }

      var sectionProperties = {
        _id: section._id,
        section_order: section.section_order,
        section_title: section.section_title,
        section_label: section.section_label,
        level: section.level,
      }

      options.push(sectionProperties)
    })

    options.sort(function(a, b){
     return a.section_order-b.section_order
    })

    return options
  }
});

Template.officeSupportNew.events({
  'submit .js_new_support_form': function(e) {
    e.preventDefault();

    var supportProperties = {
      section_perma_link: $(e.target).find('[name=section_title]').val().trim().replace(/\s+/g, "-").toLowerCase(),
      section_order: $(e.target).find('[name=section_order]').val().trim(),
      section_title: $(e.target).find('[name=section_title]').val().trim(),
      section_text: $(e.target).find('[name=section_text]').val().trim(),
      section_belongs_to: $(e.target).find('[name=section_belongs_to]').val().trim(),
    }

    Meteor.call('supportInsert', supportProperties, function(error, result) {
      if (error) {
				return alert(error.reason);
			} else {
        $('.js_reset').click()
			}
    });
  }
});
