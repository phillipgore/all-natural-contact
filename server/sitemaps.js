sitemaps.add('/sitemap.xml', function() {
  // required: page
  // optional: lastmod, changefreq, priority, xhtmlLinks, images, videos
  var sections = Support.find({}).fetch()
  var siteMap = [
    {
      page: '/',
      lastmod: 'Sat Sep 03 2016 11:43:46 GMT-0500 (CDT)',
      images: [
        { loc: '/img/site/anc-interface-contact-1024.svg', },
        { loc: '/img/site/anc-interface-contact-320mobile.svg', },
        { loc: '/img/site/anc-interface-search-1024.svg', },
        { loc: '/img/site/anc-interface-search-320mobile.svg', },
        { loc: '/img/site/anc-interface-conversation-1024.svg', },
        { loc: '/img/site/anc-interface-conversation-320mobile.svg', },
        { loc: '/img/site/anc-interface-tags-1024.svg', },
        { loc: '/img/site/anc-interface-tags-320mobile.svg', },
        { loc: '/img/site/anc-interface-contact-1024.svg', },
        { loc: '/img/site/anc-interface-process-320mobile.svg', },
        { loc: '/img/site/anc-interface-reminder-1024.svg', },
        { loc: '/img/site/anc-interface-reminder-320mobile.svg', }
      ]
    },
    { page: '/pricing', lastmod: 'Sat Sep 03 2016 11:43:46 GMT-0500 (CDT)' },
    { page: '/contact', lastmod: 'Sat Sep 03 2016 11:43:46 GMT-0500 (CDT)' },
    { page: '/support', lastmod: 'Sat Sep 03 2016 11:43:46 GMT-0500 (CDT)' },
  ]
  sections.forEach(function(section) {
    siteMap.push(
      { page: '/support/section/' + section.section_perma_link, lastmod: section.updated_on }
    )
  })

  return siteMap
});
