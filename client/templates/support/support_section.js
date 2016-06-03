Template.supportSection.helpers({
  section: function() {
    return Support.findOne({section_perma_link: Session.get('currentPermaSection')})
  }
});
