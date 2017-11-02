// @flow

const entityTypeMappings = {
  'events.event': 'events',
  'articles.article': 'articles',
  'quotes.quote': 'quotes',
  'companies.company': 'companies',
  'gallery.gallerypicture': 'galleryPictures'
};

type ServerName = $Enum<typeof entityTypeMappings>;

export default function getEntityType(serverName: ServerName) {
  return entityTypeMappings[serverName] || serverName;
}
