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

export function getFilter(pathname) {
  let filter = 'all'
  try {
    filter = pathname.match(/^\/(answered|unanswered)/)[1]
  } catch (_) {}
  return filter
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural && plural || `${singular}s`
}

export function setCookie(name, value, options = {}) {
  let expires = options.expires

  if (expires && typeof expires === 'number') {
    const d = new Date()
    d.setTime(d.getTime() + expires * 1000)
    expires = options.expires = d
  }

  if (expires && expires.toUTCString)
    options.expires = expires.toUTCString()

  value = encodeURIComponent(value)

  let updatedCookie = `${name}=${value}`

  for (var propName in options) {
    updatedCookie += `; ${propName}`
    const propValue = options[propName]
    if (propValue !== true)
      updatedCookie += `=${propValue}`
  }

  document.cookie = updatedCookie
}

export function getCookie(name) {
  try {
    const matches = document.cookie.match(new RegExp(
      '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
  } catch (_) {
    return undefined
  }
}
