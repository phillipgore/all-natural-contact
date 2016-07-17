// Meteor.startup(function () {
//
//   EsClient.indices.create({
//     index: 'contactsindex',
//     body: {
//       settings: {
//         analysis: {
//           filter: {
//             contacts_filter: {
//               type: 'nGram',
//               min_gram: 1,
//               max_gram: 20
//             }
//           },
//           analyzer: {
//             contacts_analyzer: {
//               type: 'custom',
//               tokenizer: 'standard',
//               filter: [
//                 'lowercase',
//                 'contacts_filter'
//               ]
//             }
//           }
//         }
//       },
//       mappings: {
//         contacts: {
//           properties: {
//             id: {
//               type: 'string'
//             },
//
//             prefix: {
//               type: 'string'
//             },
//             first: {
//               type: 'string',
//               analyzer: 'contacts_analyzer',
//               search_analyzer: 'standard',
//             },
//             middle: {
//               type: 'string',
//               analyzer: 'contacts_analyzer',
//               search_analyzer: 'standard'
//             },
//             last: {
//               type: 'string',
//               analyzer: 'contacts_analyzer',
//               search_analyzer: 'standard'
//             },
//             nameFirst: {
//               type: 'string'
//             },
//             nameLast: {
//               type: 'string'
//             },
//             suffix: {
//               type: 'string',
//               analyzer: 'contacts_analyzer',
//               search_analyzer: 'standard'
//             },
//
//             phonetic_first: {
//               type: 'string',
//               analyzer: 'contacts_analyzer',
//               search_analyzer: 'standard'
//             },
//             phonetic_last: {
//               type: 'string',
//               analyzer: 'contacts_analyzer',
//               search_analyzer: 'standard'
//             },
//             phonetic_middle: {
//               type: 'string',
//               analyzer: 'contacts_analyzer',
//               search_analyzer: 'standard'
//             },
//
//             nickname: {
//               type: 'string',
//               analyzer: 'contacts_analyzer',
//               search_analyzer: 'standard'
//             },
//
//             job_title: {
//               type: 'string',
//               analyzer: 'contacts_analyzer',
//               search_analyzer: 'standard'
//             },
//             department: {
//               type: 'string',
//               analyzer: 'contacts_analyzer',
//               search_analyzer: 'standard'
//             },
//             company: {
//               type: 'string',
//               analyzer: 'contacts_analyzer',
//               search_analyzer: 'standard'
//             },
//             is_company: {
//               type: 'boolean'
//             },
//
//             maiden: {
//               type: 'string',
//               analyzer: 'contacts_analyzer',
//               search_analyzer: 'standard'
//             },
//
//             phones: {
//               properties: {
//                 phone: {
//                   type: 'string',
//                   analyzer: 'contacts_analyzer',
//                   search_analyzer: 'standard'
//                 },
//                 phone_label: {
//                   type: 'string'
//                 }
//               }
//             },
//
//             emails: {
//               properties: {
//                 email: {
//                   type: 'string',
//                   analyzer: 'contacts_analyzer',
//                   search_analyzer: 'standard'
//                 },
//                 email_label: {
//                   type: 'string'
//                 }
//               }
//             },
//
//             urls: {
//               properties: {
//                 url: {
//                   type: 'string',
//                   analyzer: 'contacts_analyzer',
//                   search_analyzer: 'standard'
//                 },
//                 url_label: {
//                   type: 'string'
//                 }
//               }
//             },
//
//             dates: {
//               properties: {
//                 date_entry: {
//                   type: 'string',
//                   analyzer: 'contacts_analyzer',
//                   search_analyzer: 'standard'
//                 },
//                 date_label: {
//                   type: 'string'
//                 }
//               }
//             },
//
//             relateds: {
//               properties: {
//                 related: {
//                   type: 'string',
//                   analyzer: 'contacts_analyzer',
//                   search_analyzer: 'standard'
//                 },
//                 related_label: {
//                   type: 'string'
//                 }
//               }
//             },
//
//             immps: {
//               properties: {
//                 immp_label: {
//                   type: 'string'
//                 },
//                 immp_service: {
//                   type: 'string',
//                   analyzer: 'contacts_analyzer',
//                   search_analyzer: 'standard'
//                 },
//                 immp_user_name: {
//                   type: 'string',
//                   analyzer: 'contacts_analyzer',
//                   search_analyzer: 'standard'
//                 }
//               }
//             },
//
//             addresses: {
//               properties: {
//                 address_label: {
//                   type: 'string'
//                 },
//                 city: {
//                   type: 'string',
//                   analyzer: 'contacts_analyzer',
//                   search_analyzer: 'standard'
//                 },
//                 postal_code: {
//                   type: 'string',
//                   analyzer: 'contacts_analyzer',
//                   search_analyzer: 'standard'
//                 },
//                 state: {
//                   type: 'string',
//                   analyzer: 'contacts_analyzer',
//                   search_analyzer: 'standard'
//                 },
//                 street: {
//                   type: 'string',
//                   analyzer: 'contacts_analyzer',
//                   search_analyzer: 'standard'
//                 }
//               }
//             },
//
//             notes: {
//               'type': 'string',
//               analyzer: 'contacts_analyzer',
//               search_analyzer: 'standard'
//             },
//
//             belongs_to_tags: {
//               type: 'string'
//             },
//             has_conversations: {
//               type: 'string'
//             },
//             latest_conversation_date: {
//               type: 'date',
//               format: 'strict_date_optional_time||epoch_millis'
//             },
//
//             groupId: {
//               type: 'string'
//             },
//             created_by: {
//               type: 'string'
//             },
//             created_on: {
//               type: 'date',
//               format: 'strict_date_optional_time||epoch_millis'
//             },
//             updated_on: {
//               type: 'date',
//               format: 'strict_date_optional_time||epoch_millis'
//             },
//
//           }
//         }
//       }
//     }
//   });
//
//
//   EsClient.indices.analyze({
//     index: 'conversationsindex',
//     body: {
//       settings: {
//         analysis: {
//           filter: {
//             conversations_filter: {
//               type: 'nGram',
//               min_gram: 1,
//               max_gram: 20
//             }
//           },
//           analyzer: {
//             conversations_indexer: {
//               type: 'custom',
//               tokenizer: 'standard',
//               filter: [
//                 'lowercase',
//                 'conversations_filter'
//               ]
//             }
//           }
//         }
//       }
//     }
//   });
//
//   EsClient.indices.analyze({
//     index: 'tagsindex',
//     body: {
//       settings: {
//         analysis: {
//           filter: {
//             tags_filter: {
//               type: 'nGram',
//               min_gram: 1,
//               max_gram: 20
//             }
//           },
//           analyzer: {
//             tags_indexer: {
//               type: 'custom',
//               tokenizer: 'standard',
//               filter: [
//                 'lowercase',
//                 'tags_filter'
//               ]
//             }
//           }
//         }
//       }
//     }
//   });
//
//   EsClient.indices.analyze({
//     index: 'supportindex',
//     body: {
//       settings: {
//         analysis: {
//           filter: {
//             support_filter: {
//               type: 'nGram',
//               min_gram: 1,
//               max_gram: 20
//             }
//           },
//           analyzer: {
//             support_indexer: {
//               type: 'custom',
//               tokenizer: 'standard',
//               filter: [
//                 'lowercase',
//                 'support_filter'
//               ]
//             }
//           }
//         }
//       }
//     }
//   });
//
// });
