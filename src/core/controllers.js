'use strict';
angular.module('waid.core.controllers', [
  'waid.core',
  'waid.core.services',
  'waid.idm.controllers',
  'waid.core.strategy',
  'waid.core.app.strategy'
]).controller('WAIDCoreEmoticonModalCtrl', function ($scope, $rootScope) {
  $scope.emoticons = {
    'people': [
      '\uD83D\uDE04',
      '\uD83D\uDE06',
      '\uD83D\uDE0A',
      '\uD83D\uDE03',
      '\uD83D\uDE0F',
      '\uD83D\uDE0D',
      '\uD83D\uDE18',
      '\uD83D\uDE1A',
      '\uD83D\uDE33',
      '\uD83D\uDE0C',
      '\uD83D\uDE06',
      '\uD83D\uDE01',
      '\uD83D\uDE09',
      '\uD83D\uDE1C',
      '\uD83D\uDE1D',
      '\uD83D\uDE00',
      '\uD83D\uDE17',
      '\uD83D\uDE19',
      '\uD83D\uDE1B',
      '\uD83D\uDE34',
      '\uD83D\uDE1F',
      '\uD83D\uDE26',
      '\uD83D\uDE27',
      '\uD83D\uDE2E',
      '\uD83D\uDE2C',
      '\uD83D\uDE15',
      '\uD83D\uDE2F',
      '\uD83D\uDE11',
      '\uD83D\uDE12',
      '\uD83D\uDE05',
      '\uD83D\uDE13',
      '\uD83D\uDE25',
      '\uD83D\uDE29',
      '\uD83D\uDE14',
      '\uD83D\uDE1E',
      '\uD83D\uDE16',
      '\uD83D\uDE28',
      '\uD83D\uDE30',
      '\uD83D\uDE23',
      '\uD83D\uDE22',
      '\uD83D\uDE2D',
      '\uD83D\uDE02',
      '\uD83D\uDE32',
      '\uD83D\uDE31',
      '\uD83D\uDE2B',
      '\uD83D\uDE20',
      '\uD83D\uDE21',
      '\uD83D\uDE24',
      '\uD83D\uDE2A',
      '\uD83D\uDE0B',
      '\uD83D\uDE37',
      '\uD83D\uDE0E',
      '\uD83D\uDE35',
      '\uD83D\uDC7F',
      '\uD83D\uDE08',
      '\uD83D\uDE10',
      '\uD83D\uDE36',
      '\uD83D\uDE07',
      '\uD83D\uDC7D',
      '\uD83D\uDC9B',
      '\uD83D\uDC99',
      '\uD83D\uDC9C',
      '\u2764',
      '\uD83D\uDC9A',
      '\uD83D\uDC94',
      '\uD83D\uDC93',
      '\uD83D\uDC97',
      '\uD83D\uDC95',
      '\uD83D\uDC9E',
      '\uD83D\uDC98',
      '\uD83D\uDC96',
      '\u2728',
      '\u2B50',
      '\uD83C\uDF1F',
      '\uD83D\uDCAB',
      '\uD83D\uDCA5',
      '\uD83D\uDCA5',
      '\uD83D\uDCA2',
      '\u2757',
      '\u2753',
      '\u2755',
      '\u2754',
      '\uD83D\uDCA4',
      '\uD83D\uDCA8',
      '\uD83D\uDCA6',
      '\uD83C\uDFB6',
      '\uD83C\uDFB5',
      '\uD83D\uDD25',
      '\uD83D\uDCA9',
      '\uD83D\uDCA9',
      '\uD83D\uDCA9',
      '\uD83D\uDC4D',
      '\uD83D\uDC4D',
      '\uD83D\uDC4E',
      '\uD83D\uDC4E',
      '\uD83D\uDC4C',
      '\uD83D\uDC4A',
      '\uD83D\uDC4A',
      '\u270A',
      '\u270C',
      '\uD83D\uDC4B',
      '\u270B',
      '\u270B',
      '\uD83D\uDC50',
      '\u261D',
      '\uD83D\uDC47',
      '\uD83D\uDC48',
      '\uD83D\uDC49',
      '\uD83D\uDE4C',
      '\uD83D\uDE4F',
      '\uD83D\uDC46',
      '\uD83D\uDC4F',
      '\uD83D\uDCAA',
      '\uD83C\uDFC3',
      '\uD83C\uDFC3',
      '\uD83D\uDC6B',
      '\uD83D\uDC6A',
      '\uD83D\uDC6C',
      '\uD83D\uDC6D',
      '\uD83D\uDC83',
      '\uD83D\uDC6F',
      '\uD83D\uDE46',
      '\uD83D\uDE45',
      '\uD83D\uDC81',
      '\uD83D\uDE4B',
      '\uD83D\uDC70',
      '\uD83D\uDE4E',
      '\uD83D\uDE4D',
      '\uD83D\uDE47',
      '\uD83D\uDC8F',
      '\uD83D\uDC91',
      '\uD83D\uDC86',
      '\uD83D\uDC87',
      '\uD83D\uDC85',
      '\uD83D\uDC66',
      '\uD83D\uDC67',
      '\uD83D\uDC69',
      '\uD83D\uDC68',
      '\uD83D\uDC76',
      '\uD83D\uDC75',
      '\uD83D\uDC74',
      '\uD83D\uDC71',
      '\uD83D\uDC72',
      '\uD83D\uDC73',
      '\uD83D\uDC77',
      '\uD83D\uDC6E',
      '\uD83D\uDC7C',
      '\uD83D\uDC78',
      '\uD83D\uDE3A',
      '\uD83D\uDE38',
      '\uD83D\uDE3B',
      '\uD83D\uDE3D',
      '\uD83D\uDE3C',
      '\uD83D\uDE40',
      '\uD83D\uDE3F',
      '\uD83D\uDE39',
      '\uD83D\uDE3E',
      '\uD83D\uDC79',
      '\uD83D\uDC7A',
      '\uD83D\uDE48',
      '\uD83D\uDE49',
      '\uD83D\uDE4A',
      '\uD83D\uDC82',
      '\uD83D\uDC80',
      '\uD83D\uDC3E',
      '\uD83D\uDC44',
      '\uD83D\uDC8B',
      '\uD83D\uDCA7',
      '\uD83D\uDC42',
      '\uD83D\uDC40',
      '\uD83D\uDC43',
      '\uD83D\uDC45',
      '\uD83D\uDC8C',
      '\uD83D\uDC64',
      '\uD83D\uDC65',
      '\uD83D\uDCAC',
      '\uD83D\uDCAD'
    ],
    'nature': [
      '\u2600',
      '\u2602',
      '\u2601',
      '\u2744',
      '\u2603',
      '\u26A1',
      '\uD83C\uDF00',
      '\uD83C\uDF01',
      '\uD83C\uDF0A',
      '\uD83D\uDC31',
      '\uD83D\uDC36',
      '\uD83D\uDC2D',
      '\uD83D\uDC39',
      '\uD83D\uDC30',
      '\uD83D\uDC3A',
      '\uD83D\uDC38',
      '\uD83D\uDC2F',
      '\uD83D\uDC28',
      '\uD83D\uDC3B',
      '\uD83D\uDC37',
      '\uD83D\uDC3D',
      '\uD83D\uDC2E',
      '\uD83D\uDC17',
      '\uD83D\uDC35',
      '\uD83D\uDC12',
      '\uD83D\uDC34',
      '\uD83D\uDC0E',
      '\uD83D\uDC2B',
      '\uD83D\uDC11',
      '\uD83D\uDC18',
      '\uD83D\uDC3C',
      '\uD83D\uDC0D',
      '\uD83D\uDC26',
      '\uD83D\uDC24',
      '\uD83D\uDC25',
      '\uD83D\uDC23',
      '\uD83D\uDC14',
      '\uD83D\uDC27',
      '\uD83D\uDC22',
      '\uD83D\uDC1B',
      '\uD83D\uDC1D',
      '\uD83D\uDC1C',
      '\uD83D\uDC1E',
      '\uD83D\uDC0C',
      '\uD83D\uDC19',
      '\uD83D\uDC20',
      '\uD83D\uDC1F',
      '\uD83D\uDC33',
      '\uD83D\uDC0B',
      '\uD83D\uDC2C',
      '\uD83D\uDC04',
      '\uD83D\uDC0F',
      '\uD83D\uDC00',
      '\uD83D\uDC03',
      '\uD83D\uDC05',
      '\uD83D\uDC07',
      '\uD83D\uDC09',
      '\uD83D\uDC10',
      '\uD83D\uDC13',
      '\uD83D\uDC15',
      '\uD83D\uDC16',
      '\uD83D\uDC01',
      '\uD83D\uDC02',
      '\uD83D\uDC32',
      '\uD83D\uDC21',
      '\uD83D\uDC0A',
      '\uD83D\uDC2A',
      '\uD83D\uDC06',
      '\uD83D\uDC08',
      '\uD83D\uDC29',
      '\uD83D\uDC3E',
      '\uD83D\uDC90',
      '\uD83C\uDF38',
      '\uD83C\uDF37',
      '\uD83C\uDF40',
      '\uD83C\uDF39',
      '\uD83C\uDF3B',
      '\uD83C\uDF3A',
      '\uD83C\uDF41',
      '\uD83C\uDF43',
      '\uD83C\uDF42',
      '\uD83C\uDF3F',
      '\uD83C\uDF44',
      '\uD83C\uDF35',
      '\uD83C\uDF34',
      '\uD83C\uDF32',
      '\uD83C\uDF33',
      '\uD83C\uDF30',
      '\uD83C\uDF31',
      '\uD83C\uDF3C',
      '\uD83C\uDF3E',
      '\uD83D\uDC1A',
      '\uD83C\uDF10',
      '\uD83C\uDF1E',
      '\uD83C\uDF1D',
      '\uD83C\uDF1A',
      '\uD83C\uDF11',
      '\uD83C\uDF12',
      '\uD83C\uDF13',
      '\uD83C\uDF14',
      '\uD83C\uDF15',
      '\uD83C\uDF16',
      '\uD83C\uDF17',
      '\uD83C\uDF18',
      '\uD83C\uDF1C',
      '\uD83C\uDF1B',
      '\uD83C\uDF19',
      '\uD83C\uDF0D',
      '\uD83C\uDF0E',
      '\uD83C\uDF0F',
      '\uD83C\uDF0B',
      '\uD83C\uDF0C',
      '\u26C5'
    ],
    'objects': [
      '\uD83C\uDF8D',
      '\uD83D\uDC9D',
      '\uD83C\uDF8E',
      '\uD83C\uDF92',
      '\uD83C\uDF93',
      '\uD83C\uDF8F',
      '\uD83C\uDF86',
      '\uD83C\uDF87',
      '\uD83C\uDF90',
      '\uD83C\uDF91',
      '\uD83C\uDF83',
      '\uD83D\uDC7B',
      '\uD83C\uDF85',
      '\uD83C\uDF84',
      '\uD83C\uDF81',
      '\uD83D\uDD14',
      '\uD83D\uDD15',
      '\uD83C\uDF8B',
      '\uD83C\uDF89',
      '\uD83C\uDF8A',
      '\uD83C\uDF88',
      '\uD83D\uDD2E',
      '\uD83D\uDCBF',
      '\uD83D\uDCC0',
      '\uD83D\uDCBE',
      '\uD83D\uDCF7',
      '\uD83D\uDCF9',
      '\uD83C\uDFA5',
      '\uD83D\uDCBB',
      '\uD83D\uDCFA',
      '\uD83D\uDCF1',
      '\u260E',
      '\u260E',
      '\uD83D\uDCDE',
      '\uD83D\uDCDF',
      '\uD83D\uDCE0',
      '\uD83D\uDCBD',
      '\uD83D\uDCFC',
      '\uD83D\uDD09',
      '\uD83D\uDD08',
      '\uD83D\uDD07',
      '\uD83D\uDCE2',
      '\uD83D\uDCE3',
      '\u231B',
      '\u23F3',
      '\u23F0',
      '\u231A',
      '\uD83D\uDCFB',
      '\uD83D\uDCE1',
      '\u27BF',
      '\uD83D\uDD0D',
      '\uD83D\uDD0E',
      '\uD83D\uDD13',
      '\uD83D\uDD12',
      '\uD83D\uDD0F',
      '\uD83D\uDD10',
      '\uD83D\uDD11',
      '\uD83D\uDCA1',
      '\uD83D\uDD26',
      '\uD83D\uDD06',
      '\uD83D\uDD05',
      '\uD83D\uDD0C',
      '\uD83D\uDD0B',
      '\uD83D\uDCF2',
      '\u2709',
      '\uD83D\uDCEB',
      '\uD83D\uDCEE',
      '\uD83D\uDEC0',
      '\uD83D\uDEC1',
      '\uD83D\uDEBF',
      '\uD83D\uDEBD',
      '\uD83D\uDD27',
      '\uD83D\uDD29',
      '\uD83D\uDD28',
      '\uD83D\uDCBA',
      '\uD83D\uDCB0',
      '\uD83D\uDCB4',
      '\uD83D\uDCB5',
      '\uD83D\uDCB7',
      '\uD83D\uDCB6',
      '\uD83D\uDCB3',
      '\uD83D\uDCB8',
      '\uD83D\uDCE7',
      '\uD83D\uDCE5',
      '\uD83D\uDCE4',
      '\u2709',
      '\uD83D\uDCE8',
      '\uD83D\uDCEF',
      '\uD83D\uDCEA',
      '\uD83D\uDCEC',
      '\uD83D\uDCED',
      '\uD83D\uDCE6',
      '\uD83D\uDEAA',
      '\uD83D\uDEAC',
      '\uD83D\uDCA3',
      '\uD83D\uDD2B',
      '\uD83D\uDD2A',
      '\uD83D\uDC8A',
      '\uD83D\uDC89',
      '\uD83D\uDCC4',
      '\uD83D\uDCC3',
      '\uD83D\uDCD1',
      '\uD83D\uDCCA',
      '\uD83D\uDCC8',
      '\uD83D\uDCC9',
      '\uD83D\uDCDC',
      '\uD83D\uDCCB',
      '\uD83D\uDCC6',
      '\uD83D\uDCC5',
      '\uD83D\uDCC7',
      '\uD83D\uDCC1',
      '\uD83D\uDCC2',
      '\u2702',
      '\uD83D\uDCCC',
      '\uD83D\uDCCE',
      '\u2712',
      '\u270F',
      '\uD83D\uDCCF',
      '\uD83D\uDCD0',
      '\uD83D\uDCD5',
      '\uD83D\uDCD7',
      '\uD83D\uDCD8',
      '\uD83D\uDCD9',
      '\uD83D\uDCD3',
      '\uD83D\uDCD4',
      '\uD83D\uDCD2',
      '\uD83D\uDCDA',
      '\uD83D\uDD16',
      '\uD83D\uDCDB',
      '\uD83D\uDD2C',
      '\uD83D\uDD2D',
      '\uD83D\uDCF0',
      '\uD83C\uDFC8',
      '\uD83C\uDFC0',
      '\u26BD',
      '\u26BE',
      '\uD83C\uDFBE',
      '\uD83C\uDFB1',
      '\uD83C\uDFC9',
      '\uD83C\uDFB3',
      '\u26F3',
      '\uD83D\uDEB5',
      '\uD83D\uDEB4',
      '\uD83C\uDFC7',
      '\uD83C\uDFC2',
      '\uD83C\uDFCA',
      '\uD83C\uDFC4',
      '\uD83C\uDFBF',
      '\u2660',
      '\u2665',
      '\u2663',
      '\u2666',
      '\uD83D\uDC8E',
      '\uD83D\uDC8D',
      '\uD83C\uDFC6',
      '\uD83C\uDFBC',
      '\uD83C\uDFB9',
      '\uD83C\uDFBB',
      '\uD83D\uDC7E',
      '\uD83C\uDFAE',
      '\uD83C\uDCCF',
      '\uD83C\uDFB4',
      '\uD83C\uDFB2',
      '\uD83C\uDFAF',
      '\uD83C\uDC04',
      '\uD83C\uDFAC',
      '\uD83D\uDCDD',
      '\uD83D\uDCDD',
      '\uD83D\uDCD6',
      '\uD83C\uDFA8',
      '\uD83C\uDFA4',
      '\uD83C\uDFA7',
      '\uD83C\uDFBA',
      '\uD83C\uDFB7',
      '\uD83C\uDFB8',
      '\uD83D\uDC5E',
      '\uD83D\uDC61',
      '\uD83D\uDC60',
      '\uD83D\uDC84',
      '\uD83D\uDC62',
      '\uD83D\uDC55',
      '\uD83D\uDC55',
      '\uD83D\uDC54',
      '\uD83D\uDC5A',
      '\uD83D\uDC57',
      '\uD83C\uDFBD',
      '\uD83D\uDC56',
      '\uD83D\uDC58',
      '\uD83D\uDC59',
      '\uD83C\uDF80',
      '\uD83C\uDFA9',
      '\uD83D\uDC51',
      '\uD83D\uDC52',
      '\uD83D\uDC5E',
      '\uD83C\uDF02',
      '\uD83D\uDCBC',
      '\uD83D\uDC5C',
      '\uD83D\uDC5D',
      '\uD83D\uDC5B',
      '\uD83D\uDC53',
      '\uD83C\uDFA3',
      '\u2615',
      '\uD83C\uDF75',
      '\uD83C\uDF76',
      '\uD83C\uDF7C',
      '\uD83C\uDF7A',
      '\uD83C\uDF7B',
      '\uD83C\uDF78',
      '\uD83C\uDF79',
      '\uD83C\uDF77',
      '\uD83C\uDF74',
      '\uD83C\uDF55',
      '\uD83C\uDF54',
      '\uD83C\uDF5F',
      '\uD83C\uDF57',
      '\uD83C\uDF56',
      '\uD83C\uDF5D',
      '\uD83C\uDF5B',
      '\uD83C\uDF64',
      '\uD83C\uDF71',
      '\uD83C\uDF63',
      '\uD83C\uDF65',
      '\uD83C\uDF59',
      '\uD83C\uDF58',
      '\uD83C\uDF5A',
      '\uD83C\uDF5C',
      '\uD83C\uDF72',
      '\uD83C\uDF62',
      '\uD83C\uDF61',
      '\uD83C\uDF73',
      '\uD83C\uDF5E',
      '\uD83C\uDF69',
      '\uD83C\uDF6E',
      '\uD83C\uDF66',
      '\uD83C\uDF68',
      '\uD83C\uDF67',
      '\uD83C\uDF82',
      '\uD83C\uDF70',
      '\uD83C\uDF6A',
      '\uD83C\uDF6B',
      '\uD83C\uDF6C',
      '\uD83C\uDF6D',
      '\uD83C\uDF6F',
      '\uD83C\uDF4E',
      '\uD83C\uDF4F',
      '\uD83C\uDF4A',
      '\uD83C\uDF4B',
      '\uD83C\uDF52',
      '\uD83C\uDF47',
      '\uD83C\uDF49',
      '\uD83C\uDF53',
      '\uD83C\uDF51',
      '\uD83C\uDF48',
      '\uD83C\uDF4C',
      '\uD83C\uDF50',
      '\uD83C\uDF4D',
      '\uD83C\uDF60',
      '\uD83C\uDF46',
      '\uD83C\uDF45',
      '\uD83C\uDF3D'
    ],
    'places': [
      '\uD83C\uDFE0',
      '\uD83C\uDFE1',
      '\uD83C\uDFEB',
      '\uD83C\uDFE2',
      '\uD83C\uDFE3',
      '\uD83C\uDFE5',
      '\uD83C\uDFE6',
      '\uD83C\uDFEA',
      '\uD83C\uDFE9',
      '\uD83C\uDFE8',
      '\uD83D\uDC92',
      '\u26EA',
      '\uD83C\uDFEC',
      '\uD83C\uDFE4',
      '\uD83C\uDF07',
      '\uD83C\uDF06',
      '\uD83C\uDFEF',
      '\uD83C\uDFF0',
      '\u26FA',
      '\uD83C\uDFED',
      '\uD83D\uDDFC',
      '\uD83D\uDDFE',
      '\uD83D\uDDFB',
      '\uD83C\uDF04',
      '\uD83C\uDF05',
      '\uD83C\uDF20',
      '\uD83D\uDDFD',
      '\uD83C\uDF09',
      '\uD83C\uDFA0',
      '\uD83C\uDF08',
      '\uD83C\uDFA1',
      '\u26F2',
      '\uD83C\uDFA2',
      '\uD83D\uDEA2',
      '\uD83D\uDEA4',
      '\u26F5',
      '\u26F5',
      '\uD83D\uDEA3',
      '\u2693',
      '\uD83D\uDE80',
      '\u2708',
      '\uD83D\uDE81',
      '\uD83D\uDE82',
      '\uD83D\uDE8A',
      '\uD83D\uDE9E',
      '\uD83D\uDEB2',
      '\uD83D\uDEA1',
      '\uD83D\uDE9F',
      '\uD83D\uDEA0',
      '\uD83D\uDE9C',
      '\uD83D\uDE99',
      '\uD83D\uDE98',
      '\uD83D\uDE97',
      '\uD83D\uDE97',
      '\uD83D\uDE95',
      '\uD83D\uDE96',
      '\uD83D\uDE9B',
      '\uD83D\uDE8C',
      '\uD83D\uDE8D',
      '\uD83D\uDEA8',
      '\uD83D\uDE93',
      '\uD83D\uDE94',
      '\uD83D\uDE92',
      '\uD83D\uDE91',
      '\uD83D\uDE90',
      '\uD83D\uDE9A',
      '\uD83D\uDE8B',
      '\uD83D\uDE89',
      '\uD83D\uDE86',
      '\uD83D\uDE85',
      '\uD83D\uDE84',
      '\uD83D\uDE88',
      '\uD83D\uDE9D',
      '\uD83D\uDE83',
      '\uD83D\uDE8E',
      '\uD83C\uDFAB',
      '\u26FD',
      '\uD83D\uDEA6',
      '\uD83D\uDEA5',
      '\u26A0',
      '\uD83D\uDEA7',
      '\uD83D\uDD30',
      '\uD83C\uDFE7',
      '\uD83C\uDFB0',
      '\uD83D\uDE8F',
      '\uD83D\uDC88',
      '\u2668',
      '\uD83C\uDFC1',
      '\uD83C\uDF8C',
      '\uD83C\uDFEE',
      '\uD83D\uDDFF',
      '\uD83C\uDFAA',
      '\uD83C\uDFAD',
      '\uD83D\uDCCD',
      '\uD83D\uDEA9'
    ]
  };
}).controller('WAIDCoreCtrl', function ($scope, $rootScope, waidCore) {
  if (angular.isDefined($rootScope.config)) {
    waidCore.config.patchConfig($rootScope.config);
  }
  // console.log($rootScope.config);
  waidCore.account = { 'id': angular.isDefined($scope.accountId) ? $scope.accountId : false };
  waidCore.application = { 'id': angular.isDefined($scope.applicationId) ? $scope.applicationId : false };
  waidCore.initialize();
  $scope.waid = waidCore;
});