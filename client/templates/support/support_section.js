Template.supportSection.onRendered(function() {
    var checkCurrentSection = setInterval(function() {
      if (Support.findOne({section_perma_link: Session.get('currentPermaSection'), section_text: { $exists: true }})) {
        clearInterval(checkCurrentSection);
        $('.js_section_loader, .js_section_loading_overlay').fadeOut('fast')
      }
    }, 300)
});

Template.supportSection.helpers({
  section: function() {
    return Support.findOne({section_perma_link: Session.get('currentPermaSection')})
  }
});
