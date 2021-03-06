'use strict'

var SNIPPETS_PREFIX = 'snippet-'

var ALLOWED_LIBRARIES = [
  'http',
  'request',
  'async',
  'corbel-js',
  'lodash',
  'corbel-token-verifier'
]

var LOCAL_LIBRARIES = {
  'ComposrError': './ComposrError',
  'composrUtils': './utils'
}

function requirerWrapper (Snippet) {
  return function requirer (domain, version, functionMode) {
    return function requirerForDomain (libName) {
      if (!libName || typeof (libName) !== 'string') {
        libName = ''
      }

      if (libName.indexOf(SNIPPETS_PREFIX) !== -1) {
        libName = libName.replace(SNIPPETS_PREFIX, '')

        var snippet = Snippet.getSnippet(domain, libName, version)

        var returnedResult = null

        // Execute the exports function
        if (snippet) {
          snippet.execute(functionMode, function (res) {
            // TODO: What that bug!!
            returnedResult = res
          })
        }

        return returnedResult
      } else if (libName && ALLOWED_LIBRARIES.indexOf(libName) !== -1) {
        return require(libName)
      } else if (libName && Object.keys(LOCAL_LIBRARIES).indexOf(libName) !== -1) {
        var locallib = require(LOCAL_LIBRARIES[libName])
        return locallib
      }
      return null
    }
  }
}

module.exports = requirerWrapper
