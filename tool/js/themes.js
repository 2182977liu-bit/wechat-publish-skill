/**
 * WeChat-compatible visual themes.
 * Each theme provides inline-style templates for every block type.
 * Only tags/attributes allowed by WeChat editor are used.
 */

const WeChatThemes = (function () {
  var FONT =
    "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif";
  var MONO =
    "Menlo, Consolas, 'Courier New', 'PingFang SC', monospace";

  var themes = {
    minimal: {
      id: 'minimal',
      name: '极简白',
      desc: '干净留白，适合长文阅读',
      page: {
        'background-color': '#ffffff',
        'font-family': FONT,
        'font-size': '16px',
        color: '#222222',
        'line-height': '1.75',
        'padding': '20px 16px'
      },
      h1: {
        'font-size': '24px',
        'font-weight': '700',
        'line-height': '1.4',
        'margin': '32px 0 16px',
        'color': '#111111',
        'padding-bottom': '12px',
        'border-bottom': '2px solid #111111'
      },
      h2: {
        'font-size': '20px',
        'font-weight': '700',
        'line-height': '1.4',
        'margin': '28px 0 14px',
        'color': '#111111',
        'padding-left': '12px',
        'border-left': '4px solid #111111'
      },
      h3: {
        'font-size': '17px',
        'font-weight': '600',
        'line-height': '1.4',
        'margin': '24px 0 12px',
        'color': '#111111'
      },
      h4: {
        'font-size': '16px',
        'font-weight': '600',
        'line-height': '1.4',
        'margin': '20px 0 10px',
        'color': '#333333'
      },
      p: {
        'font-size': '16px',
        'line-height': '1.75',
        'margin': '0 0 16px',
        'color': '#222222'
      },
      bold: { 'font-weight': '700', 'color': '#111111' },
      italic: { 'font-style': 'italic' },
      strike: { 'text-decoration': 'line-through', 'color': '#999999' },
      inlineCode: {
        'font-family': MONO,
        'font-size': '14px',
        'background-color': '#f5f5f5',
        'color': '#c7254e',
        'padding': '2px 6px',
        'border-radius': '3px',
        'margin': '0 2px'
      },
      codeBlock: {
        'font-family': MONO,
        'font-size': '13px',
        'line-height': '1.6',
        'background-color': '#f7f7f7',
        'color': '#333333',
        'padding': '16px',
        'border-radius': '6px',
        'margin': '16px 0',
        'white-space': 'pre-wrap',
        'word-break': 'break-all',
        'border': '1px solid #eeeeee'
      },
      blockquote: {
        'margin': '16px 0',
        'padding': '12px 16px',
        'background-color': '#f9f9f9',
        'border-left': '4px solid #dddddd',
        'color': '#666666',
        'font-size': '15px',
        'line-height': '1.7'
      },
      ul: { 'margin': '0 0 16px', 'padding-left': '1.4em', 'color': '#222222' },
      ol: { 'margin': '0 0 16px', 'padding-left': '1.4em', 'color': '#222222' },
      li: { 'font-size': '16px', 'line-height': '1.75', 'margin': '6px 0' },
      a: { 'color': '#576b95', 'text-decoration': 'none' },
      img: {
        'max-width': '100%',
        'height': 'auto',
        'border-radius': '4px',
        'display': 'block',
        'margin': '16px auto'
      },
      hr: {
        'border': 'none',
        'border-top': '1px solid #eeeeee',
        'margin': '28px 0'
      },
      table: {
        'width': '100%',
        'border-collapse': 'collapse',
        'margin': '16px 0',
        'font-size': '14px'
      },
      th: {
        'background-color': '#fafafa',
        'color': '#111111',
        'font-weight': '600',
        'padding': '10px 12px',
        'border': '1px solid #eeeeee',
        'text-align': 'left'
      },
      td: {
        'padding': '10px 12px',
        'border': '1px solid #eeeeee',
        'color': '#333333',
        'line-height': '1.6'
      },
      caption: {
        'font-size': '13px',
        'color': '#999999',
        'text-align': 'center',
        'margin-top': '8px'
      }
    },

    zhihu: {
      id: 'zhihu',
      name: '知乎蓝',
      desc: '知识感蓝白，适合干货长文',
      page: {
        'background-color': '#ffffff',
        'font-family': FONT,
        'font-size': '16px',
        color: '#1a1a1a',
        'line-height': '1.8',
        'padding': '20px 16px'
      },
      h1: {
        'font-size': '26px',
        'font-weight': '700',
        'line-height': '1.35',
        'margin': '36px 0 18px',
        'color': '#0084ff',
        'text-align': 'center'
      },
      h2: {
        'font-size': '20px',
        'font-weight': '700',
        'line-height': '1.4',
        'margin': '30px 0 14px',
        'color': '#0084ff'
      },
      h3: {
        'font-size': '17px',
        'font-weight': '600',
        'line-height': '1.4',
        'margin': '24px 0 12px',
        'color': '#1a1a1a'
      },
      h4: {
        'font-size': '16px',
        'font-weight': '600',
        'margin': '20px 0 10px',
        'color': '#1a1a1a'
      },
      p: {
        'font-size': '16px',
        'line-height': '1.8',
        'margin': '0 0 16px',
        'color': '#1a1a1a'
      },
      bold: { 'font-weight': '700', 'color': '#0084ff' },
      italic: { 'font-style': 'italic' },
      strike: { 'text-decoration': 'line-through', 'color': '#999999' },
      inlineCode: {
        'font-family': MONO,
        'font-size': '14px',
        'background-color': '#f0f2f5',
        'color': '#0084ff',
        'padding': '2px 6px',
        'border-radius': '3px'
      },
      codeBlock: {
        'font-family': MONO,
        'font-size': '13px',
        'line-height': '1.65',
        'background-color': '#f6f8fa',
        'color': '#24292e',
        'padding': '16px',
        'border-radius': '8px',
        'margin': '16px 0',
        'white-space': 'pre-wrap',
        'word-break': 'break-all',
        'border': '1px solid #e1e4e8'
      },
      blockquote: {
        'margin': '16px 0',
        'padding': '14px 18px',
        'background-color': '#f0f6ff',
        'border-left': '4px solid #0084ff',
        'color': '#555555',
        'font-size': '15px',
        'line-height': '1.75',
        'border-radius': '0 6px 6px 0'
      },
      ul: { 'margin': '0 0 16px', 'padding-left': '1.4em' },
      ol: { 'margin': '0 0 16px', 'padding-left': '1.4em' },
      li: { 'font-size': '16px', 'line-height': '1.8', 'margin': '6px 0' },
      a: { 'color': '#0084ff', 'text-decoration': 'none' },
      img: {
        'max-width': '100%',
        'height': 'auto',
        'border-radius': '8px',
        'display': 'block',
        'margin': '16px auto'
      },
      hr: { 'border': 'none', 'border-top': '1px solid #e8e8e8', 'margin': '28px 0' },
      table: { 'width': '100%', 'border-collapse': 'collapse', 'margin': '16px 0', 'font-size': '14px' },
      th: {
        'background-color': '#f0f6ff',
        'color': '#0084ff',
        'font-weight': '600',
        'padding': '10px 12px',
        'border': '1px solid #dbeafe',
        'text-align': 'left'
      },
      td: { 'padding': '10px 12px', 'border': '1px solid #e5e7eb', 'color': '#333333' },
      caption: { 'font-size': '13px', 'color': '#999999', 'text-align': 'center', 'margin-top': '8px' }
    },

    juejin: {
      id: 'juejin',
      name: '掘金橙',
      desc: '技术感橙色强调，适合工程笔记',
      page: {
        'background-color': '#ffffff',
        'font-family': FONT,
        'font-size': '16px',
        color: '#252933',
        'line-height': '1.75',
        'padding': '20px 16px'
      },
      h1: {
        'font-size': '24px',
        'font-weight': '700',
        'line-height': '1.4',
        'margin': '32px 0 16px',
        'color': '#1e80ff',
        'position': 'relative',
        'padding-left': '14px'
      },
      h2: {
        'font-size': '20px',
        'font-weight': '700',
        'line-height': '1.4',
        'margin': '28px 0 14px',
        'color': '#252933',
        'padding-bottom': '10px',
        'border-bottom': '1px solid #ebedf0'
      },
      h3: {
        'font-size': '17px',
        'font-weight': '600',
        'margin': '24px 0 12px',
        'color': '#252933'
      },
      h4: {
        'font-size': '16px',
        'font-weight': '600',
        'margin': '20px 0 10px',
        'color': '#515767'
      },
      p: { 'font-size': '16px', 'line-height': '1.75', 'margin': '0 0 16px', 'color': '#252933' },
      bold: { 'font-weight': '700', 'color': '#1e80ff' },
      italic: { 'font-style': 'italic' },
      strike: { 'text-decoration': 'line-through', 'color': '#86909c' },
      inlineCode: {
        'font-family': MONO,
        'font-size': '14px',
        'background-color': '#fff7e8',
        'color': '#ff7d00',
        'padding': '2px 6px',
        'border-radius': '3px'
      },
      codeBlock: {
        'font-family': MONO,
        'font-size': '13px',
        'line-height': '1.65',
        'background-color': '#f7f8fa',
        'color': '#333333',
        'padding': '16px',
        'border-radius': '8px',
        'margin': '16px 0',
        'white-space': 'pre-wrap',
        'word-break': 'break-all',
        'border': '1px solid #ebedf0'
      },
      blockquote: {
        'margin': '16px 0',
        'padding': '14px 18px',
        'background-color': '#fff7e8',
        'border-left': '4px solid #ff7d00',
        'color': '#515767',
        'font-size': '15px',
        'line-height': '1.75',
        'border-radius': '0 6px 6px 0'
      },
      ul: { 'margin': '0 0 16px', 'padding-left': '1.4em' },
      ol: { 'margin': '0 0 16px', 'padding-left': '1.4em' },
      li: { 'font-size': '16px', 'line-height': '1.75', 'margin': '6px 0' },
      a: { 'color': '#1e80ff', 'text-decoration': 'none' },
      img: {
        'max-width': '100%',
        'height': 'auto',
        'border-radius': '8px',
        'display': 'block',
        'margin': '16px auto'
      },
      hr: { 'border': 'none', 'border-top': '1px solid #ebedf0', 'margin': '28px 0' },
      table: { 'width': '100%', 'border-collapse': 'collapse', 'margin': '16px 0', 'font-size': '14px' },
      th: {
        'background-color': '#f7f8fa',
        'color': '#1e80ff',
        'font-weight': '600',
        'padding': '10px 12px',
        'border': '1px solid #ebedf0',
        'text-align': 'left'
      },
      td: { 'padding': '10px 12px', 'border': '1px solid #ebedf0', 'color': '#333333' },
      caption: { 'font-size': '13px', 'color': '#86909c', 'text-align': 'center', 'margin-top': '8px' }
    },

    techPurple: {
      id: 'techPurple',
      name: '科技紫',
      desc: '渐变紫科技感，适合产品/技术发布',
      page: {
        'background-color': '#0f0c29',
        'font-family': FONT,
        'font-size': '16px',
        color: '#e8e6f0',
        'line-height': '1.75',
        'padding': '24px 18px'
      },
      h1: {
        'font-size': '26px',
        'font-weight': '700',
        'line-height': '1.35',
        'margin': '32px 0 16px',
        'color': '#a78bfa',
        'text-align': 'center'
      },
      h2: {
        'font-size': '20px',
        'font-weight': '700',
        'line-height': '1.4',
        'margin': '28px 0 14px',
        'color': '#c4b5fd',
        'padding-left': '12px',
        'border-left': '4px solid #a78bfa'
      },
      h3: {
        'font-size': '17px',
        'font-weight': '600',
        'margin': '24px 0 12px',
        'color': '#e8e6f0'
      },
      h4: {
        'font-size': '16px',
        'font-weight': '600',
        'margin': '20px 0 10px',
        'color': '#c4b5fd'
      },
      p: { 'font-size': '16px', 'line-height': '1.75', 'margin': '0 0 16px', 'color': '#e8e6f0' },
      bold: { 'font-weight': '700', 'color': '#c4b5fd' },
      italic: { 'font-style': 'italic' },
      strike: { 'text-decoration': 'line-through', 'color': '#6b7280' },
      inlineCode: {
        'font-family': MONO,
        'font-size': '14px',
        'background-color': 'rgba(167, 139, 250, 0.18)',
        'color': '#f0abfc',
        'padding': '2px 6px',
        'border-radius': '3px'
      },
      codeBlock: {
        'font-family': MONO,
        'font-size': '13px',
        'line-height': '1.65',
        'background-color': 'rgba(0,0,0,0.35)',
        'color': '#e8e6f0',
        'padding': '16px',
        'border-radius': '10px',
        'margin': '16px 0',
        'white-space': 'pre-wrap',
        'word-break': 'break-all',
        'border': '1px solid rgba(167, 139, 250, 0.35)'
      },
      blockquote: {
        'margin': '16px 0',
        'padding': '14px 18px',
        'background': 'linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(236,72,153,0.1) 100%)',
        'border-left': '4px solid #a78bfa',
        'color': '#d1d5db',
        'font-size': '15px',
        'line-height': '1.75',
        'border-radius': '0 8px 8px 0'
      },
      ul: { 'margin': '0 0 16px', 'padding-left': '1.4em' },
      ol: { 'margin': '0 0 16px', 'padding-left': '1.4em' },
      li: { 'font-size': '16px', 'line-height': '1.75', 'margin': '6px 0' },
      a: { 'color': '#c4b5fd', 'text-decoration': 'none' },
      img: {
        'max-width': '100%',
        'height': 'auto',
        'border-radius': '10px',
        'display': 'block',
        'margin': '16px auto',
        'border': '1px solid rgba(167,139,250,0.3)'
      },
      hr: {
        'border': 'none',
        'border-top': '1px solid rgba(167,139,250,0.35)',
        'margin': '28px 0'
      },
      table: { 'width': '100%', 'border-collapse': 'collapse', 'margin': '16px 0', 'font-size': '14px' },
      th: {
        'background-color': 'rgba(167,139,250,0.2)',
        'color': '#c4b5fd',
        'font-weight': '600',
        'padding': '10px 12px',
        'border': '1px solid rgba(167,139,250,0.35)',
        'text-align': 'left'
      },
      td: {
        'padding': '10px 12px',
        'border': '1px solid rgba(167,139,250,0.25)',
        'color': '#e8e6f0'
      },
      caption: { 'font-size': '13px', 'color': '#9ca3af', 'text-align': 'center', 'margin-top': '8px' }
    },

    wood: {
      id: 'wood',
      name: '暖木棕',
      desc: '暖色编辑风，适合生活/品牌故事',
      page: {
        'background-color': '#faf6f1',
        'font-family': FONT,
        'font-size': '16px',
        color: '#3d2c29',
        'line-height': '1.8',
        'padding': '24px 18px'
      },
      h1: {
        'font-size': '24px',
        'font-weight': '700',
        'line-height': '1.4',
        'margin': '32px 0 16px',
        'color': '#5c4033',
        'text-align': 'center'
      },
      h2: {
        'font-size': '20px',
        'font-weight': '700',
        'line-height': '1.4',
        'margin': '28px 0 14px',
        'color': '#5c4033',
        'padding-bottom': '10px',
        'border-bottom': '2px solid #d4b896'
      },
      h3: {
        'font-size': '17px',
        'font-weight': '600',
        'margin': '24px 0 12px',
        'color': '#5c4033'
      },
      h4: {
        'font-size': '16px',
        'font-weight': '600',
        'margin': '20px 0 10px',
        'color': '#6b5344'
      },
      p: { 'font-size': '16px', 'line-height': '1.8', 'margin': '0 0 16px', 'color': '#3d2c29' },
      bold: { 'font-weight': '700', 'color': '#5c4033' },
      italic: { 'font-style': 'italic' },
      strike: { 'text-decoration': 'line-through', 'color': '#a89080' },
      inlineCode: {
        'font-family': MONO,
        'font-size': '14px',
        'background-color': '#f0e6d6',
        'color': '#8b5a2b',
        'padding': '2px 6px',
        'border-radius': '3px'
      },
      codeBlock: {
        'font-family': MONO,
        'font-size': '13px',
        'line-height': '1.65',
        'background-color': '#f0e6d6',
        'color': '#3d2c29',
        'padding': '16px',
        'border-radius': '8px',
        'margin': '16px 0',
        'white-space': 'pre-wrap',
        'word-break': 'break-all',
        'border': '1px solid #d4b896'
      },
      blockquote: {
        'margin': '16px 0',
        'padding': '14px 18px',
        'background-color': '#fff8ee',
        'border-left': '4px solid #c4a574',
        'color': '#6b5344',
        'font-size': '15px',
        'line-height': '1.8',
        'border-radius': '0 8px 8px 0'
      },
      ul: { 'margin': '0 0 16px', 'padding-left': '1.4em' },
      ol: { 'margin': '0 0 16px', 'padding-left': '1.4em' },
      li: { 'font-size': '16px', 'line-height': '1.8', 'margin': '6px 0' },
      a: { 'color': '#8b5a2b', 'text-decoration': 'none' },
      img: {
        'max-width': '100%',
        'height': 'auto',
        'border-radius': '10px',
        'display': 'block',
        'margin': '16px auto'
      },
      hr: { 'border': 'none', 'border-top': '1px solid #d4b896', 'margin': '28px 0' },
      table: { 'width': '100%', 'border-collapse': 'collapse', 'margin': '16px 0', 'font-size': '14px' },
      th: {
        'background-color': '#f0e6d6',
        'color': '#5c4033',
        'font-weight': '600',
        'padding': '10px 12px',
        'border': '1px solid #d4b896',
        'text-align': 'left'
      },
      td: { 'padding': '10px 12px', 'border': '1px solid #e0d0b8', 'color': '#3d2c29' },
      caption: { 'font-size': '13px', 'color': '#a89080', 'text-align': 'center', 'margin-top': '8px' }
    },

    night: {
      id: 'night',
      name: '深夜黑',
      desc: '护眼暗色，适合夜间阅读',
      page: {
        'background-color': '#1a1a1a',
        'font-family': FONT,
        'font-size': '16px',
        color: '#d4d4d4',
        'line-height': '1.75',
        'padding': '24px 18px'
      },
      h1: {
        'font-size': '24px',
        'font-weight': '700',
        'line-height': '1.4',
        'margin': '32px 0 16px',
        'color': '#ffffff',
        'text-align': 'center'
      },
      h2: {
        'font-size': '20px',
        'font-weight': '700',
        'line-height': '1.4',
        'margin': '28px 0 14px',
        'color': '#ffffff',
        'padding-left': '12px',
        'border-left': '4px solid #60a5fa'
      },
      h3: {
        'font-size': '17px',
        'font-weight': '600',
        'margin': '24px 0 12px',
        'color': '#e5e5e5'
      },
      h4: {
        'font-size': '16px',
        'font-weight': '600',
        'margin': '20px 0 10px',
        'color': '#a3a3a3'
      },
      p: { 'font-size': '16px', 'line-height': '1.75', 'margin': '0 0 16px', 'color': '#d4d4d4' },
      bold: { 'font-weight': '700', 'color': '#ffffff' },
      italic: { 'font-style': 'italic' },
      strike: { 'text-decoration': 'line-through', 'color': '#737373' },
      inlineCode: {
        'font-family': MONO,
        'font-size': '14px',
        'background-color': 'rgba(96,165,250,0.15)',
        'color': '#93c5fd',
        'padding': '2px 6px',
        'border-radius': '3px'
      },
      codeBlock: {
        'font-family': MONO,
        'font-size': '13px',
        'line-height': '1.65',
        'background-color': '#0d0d0d',
        'color': '#d4d4d4',
        'padding': '16px',
        'border-radius': '8px',
        'margin': '16px 0',
        'white-space': 'pre-wrap',
        'word-break': 'break-all',
        'border': '1px solid #333333'
      },
      blockquote: {
        'margin': '16px 0',
        'padding': '14px 18px',
        'background-color': '#242424',
        'border-left': '4px solid #60a5fa',
        'color': '#a3a3a3',
        'font-size': '15px',
        'line-height': '1.75',
        'border-radius': '0 8px 8px 0'
      },
      ul: { 'margin': '0 0 16px', 'padding-left': '1.4em' },
      ol: { 'margin': '0 0 16px', 'padding-left': '1.4em' },
      li: { 'font-size': '16px', 'line-height': '1.75', 'margin': '6px 0' },
      a: { 'color': '#60a5fa', 'text-decoration': 'none' },
      img: {
        'max-width': '100%',
        'height': 'auto',
        'border-radius': '8px',
        'display': 'block',
        'margin': '16px auto'
      },
      hr: { 'border': 'none', 'border-top': '1px solid #333333', 'margin': '28px 0' },
      table: { 'width': '100%', 'border-collapse': 'collapse', 'margin': '16px 0', 'font-size': '14px' },
      th: {
        'background-color': '#242424',
        'color': '#93c5fd',
        'font-weight': '600',
        'padding': '10px 12px',
        'border': '1px solid #333333',
        'text-align': 'left'
      },
      td: { 'padding': '10px 12px', 'border': '1px solid #333333', 'color': '#d4d4d4' },
      caption: { 'font-size': '13px', 'color': '#737373', 'text-align': 'center', 'margin-top': '8px' }
    }
  };

  function styleToString(styles) {
    var parts = [];
    for (var k in styles) {
      if (Object.prototype.hasOwnProperty.call(styles, k)) {
        parts.push(k + ':' + styles[k]);
      }
    }
    return parts.join(';');
  }

  function list() {
    return Object.keys(themes).map(function (k) {
      return { id: k, name: themes[k].name, desc: themes[k].desc };
    });
  }

  function get(id) {
    return themes[id] || themes.minimal;
  }

  return {
    list: list,
    get: get,
    styleToString: styleToString,
    FONT: FONT,
    MONO: MONO
  };
})();
