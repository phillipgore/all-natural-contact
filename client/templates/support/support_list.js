Template.supportList.onRendered(function() {
  this.autorun(function() {
		Template.currentData()
      var checkCurrentPermaSection = setInterval(function() {
        if (Support.find().count() === SupportCount.findOne().support_count) {
          clearInterval(checkCurrentPermaSection);
          if (Session.get('currentPermaSection') != 'welcome') {
            var section = Support.findOne({section_perma_link: Session.get('currentPermaSection')}).section_belongs_to
            var open = []
            for (var b = 'none'; b != section;) {
              open.push(section)
              var section = Support.findOne({_id: section}).section_belongs_to
            }
            open.forEach(function(id) {
              $('#' + id).find('.js_list_item_arrow').toggleClass('open');
              $('#' + id).next('.sub_section').slideToggle('fast');
            })
          }
          $('#' + Session.get('currentPermaSection')).addClass('active');
        }
      }, 300)
  });
});

Template.supportList.helpers({
  sections: function() {
    var sections = Support.find().fetch()

    sections.forEach(function(section) {
      if (section.section_belongs_to === 'none') {
        _.extend(section, {level: 0}, {margin_left: 18})
      } else {
        var id = section.section_belongs_to
        var i = 0;
        for (var supSection = 'start'; supSection != 'none'; i++) {
          var id = Support.findOne({_id: id}).section_belongs_to
          var supSection = id
        }
        var margin_left = i * 18 + 18;
        _.extend(section, {level: i}, {margin_left: margin_left})
      }
    })
    sections.sort(function(a, b){
     return a.level-b.level
    })

    var lastLevel = sections.reverse()[0].level
    for (var i = lastLevel -1; i > -1; i--) {
      var levelSections = $.grep(sections, function(section) {
        return section.level == i;
      });
      levelSections.forEach(function(levelSection) {
        var subIds = levelSection.section_has
        var sub_sections = []
        if (subIds) {
          if (subIds.length > 0) {
            subIds.forEach(function(subId) {
              var sub_section = $.grep(sections, function(section) {
                return section._id == subId;
              });
              sub_sections.push(sub_section[0]);
            })
          }
        }
        sub_sections.sort(function(a, b){
         return a.section_order-b.section_order
        })
        _.extend(levelSection, {sub_sections: sub_sections})
      })
    }

    var newSections = []
    sections.forEach(function(section) {
      if (section.level === 0) {
        newSections.push(section)
      }
    })

    newSections.sort(function(a, b){
     return a.section_order-b.section_order
    })

    return newSections;
  }
});

Template.supportList.events({
  'click .support_list_item': function(e) {
    $('.support_list_item').removeClass('active');

    if ($(e.target).hasClass('js_support_list_item')) {
      $(e.target).addClass('active');
      $('.js_support_sidebar').toggleClass('slide_open');
      $('.js_btn_nav_slide').toggleClass('open');
    } else if ($(e.target).hasClass('js_support_list_text')) {
      $(e.target).parent().addClass('active');
      $('.js_support_sidebar').toggleClass('slide_open');
      $('.js_btn_nav_slide').toggleClass('open');
    } else if ($(e.target).hasClass('js_support_list_toggle')) {
      $(e.target).parentsUntil('li').parent().find('a').addClass('active');
      $(e.target).parentsUntil('li').parent().find('.js_list_item_arrow').toggleClass('open');
      $(e.target).parentsUntil('li').parent().next('.sub_section').slideToggle('fast');
    }
  },
})
