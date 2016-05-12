export function getPageUrl(rel, response) {
  const link = response.headers.get('link')
  if (!link) return null

  const relLink = link.split(',').find(s => s.indexOf(`rel="${rel}"`) > -1)
  if (!relLink) return null

  return relLink.split(';')[0].trim().slice(1, -1)
}

export function idFromSlugId(slugId) {
  const match = slugId.match(/=([A-Za-z0-9-_]{7,})(\?.*)?$/)
  return match && match[1] || null
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural && plural || `${singular}s`
}
