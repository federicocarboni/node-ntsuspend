{
  'targets': [{
    'target_name': 'lib',
    'include_dirs': ['node_modules/node-addon-api'],
    'conditions': [
      ['OS=="win"', {
        'sources': ['src/lib.cc'],
      }],
    ],
    'defines': ['NAPI_DISABLE_CPP_EXCEPTIONS'],
  }],
}
