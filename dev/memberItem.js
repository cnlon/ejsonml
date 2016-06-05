import JsonML from 'src'

const memberItem = [
  'li',
  {
    'class': 'Member',
    'style':
    function () {
      return 'background-color:' + ((this.index % 2) ? 'silver' : 'white')
    },
  },
  [
    'p',
    [
      'a',
      {
        'class': 'ExtLink',
        'href':
        function () {
          return 'http://en.wikipedia.org/wiki/' + this.data.wiki
        },
        'onclick': 'window.open(this.href);return false',
        'style': 'font-weight:bold',
      },
      ' ',
      function () {
        return this.data.firstName + ' ' + this.data.lastName
      },
    ],
    ' ',
  ],
  ' ',
  [
    'p',
    ' ',
    function () {
      return (this.data.type && this.data.type.join(' / ')) || 'unknown'
    },
    ' (',
    function () {
      return this.data.start
    },
    ' - ',
    function () {
      return this.data.end || 'Present'
    },
    ') ',
  ],
  ' ',
]

export default JsonML.BST(memberItem)
