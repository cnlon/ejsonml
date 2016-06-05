import JsonML from 'src'
import memberItem from './memberItem'

const bandList = [
  'div',
  {
    'class': 'Band',
  },
  ' ',
  [
    'h3',
    ' ',
    [
      'a',
      {
        'class': 'ExtLink',
        'href':
        function () {
          return 'http://en.wikipedia.org/wiki/' + this.data.wiki
        },
        'onclick': 'window.open(this.href);return false',
      },
      function () {
        return this.data.name
      },
    ],
    ' ',
  ],
  ' ',
  [
    'p',
    {
      'style': 'color:whitepadding:0 0.5em 0.5em 0.5em',
    },
    ' ',
    function () {
      return (this.data.genre && this.data.genre.join(' / ')) || 'unknown'
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
  [
    'ul',
    {
      'class': 'Members',
    },
    ' ',
    function () {
      return memberItem.dataBind(this.data.members)
    },
    ' ',
  ],
  ' ',
]

export default JsonML.BST(bandList)
