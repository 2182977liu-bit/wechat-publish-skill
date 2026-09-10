/**
 * Convert Markdown AST or raw HTML into WeChat-compatible inline-style HTML.
 */

const WeChatConverter = (function () {
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function styleOf(styles) {
    return WeChatThemes.styleToString(styles);
  }

  function sanitizeRawInlineHtml(tag, theme) {
    // 仅允许 img（及其常用属性），并套用主题缺省样式（作者内联 style 优先）
    if (!tag || !/<img\b/i.test(tag)) return '';
    var srcM = tag.match(/\bsrc\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
    var src = (srcM && (srcM[2] != null ? srcM[2] : srcM[3] != null ? srcM[3] : srcM[4])) || '';
    var altM = tag.match(/\balt\s*=\s*("([^"]*)"|'([^']*)')/i);
    var alt = (altM && (altM[2] != null ? altM[2] : altM[3] != null ? altM[3] : '')) || '';
    var styleM = tag.match(/\bstyle\s*=\s*("([^"]*)"|'([^']*)')/i);
    var userStyle = (styleM && (styleM[2] != null ? styleM[2] : styleM[3] != null ? styleM[3] : '')) || '';

    var merged = {};
    var k;
    for (k in theme.img) {
      if (Object.prototype.hasOwnProperty.call(theme.img, k)) merged[k] = theme.img[k];
    }
    // 解析用户 style 覆盖主题
    userStyle.split(';').forEach(function (pair) {
      var kv = pair.split(':');
      if (kv.length >= 2) {
        var key = kv[0].trim().toLowerCase();
        var val = kv.slice(1).join(':').trim();
        if (key && val) merged[key] = val;
      }
    });
    return (
      '<img src="' +
      esc(src) +
      '" alt="' +
      esc(alt) +
      '" style="' +
      styleOf(merged) +
      '"/>'
    );
  }

  function renderInline(children, theme) {
    if (!children) return '';
    return children
      .map(function (node) {
        return renderInlineNode(node, theme);
      })
      .join('');
  }

  function renderInlineNode(node, theme) {
    switch (node.type) {
      case 'text':
        return esc(node.value);
      case 'br':
        return '<br/>';
      case 'bold':
        return '<strong style="' + styleOf(theme.bold) + '">' + renderInline(node.children, theme) + '</strong>';
      case 'italic':
        return '<em style="' + styleOf(theme.italic) + '">' + renderInline(node.children, theme) + '</em>';
      case 'strike':
        return '<s style="' + styleOf(theme.strike) + '">' + renderInline(node.children, theme) + '</s>';
      case 'code':
        return '<code style="' + styleOf(theme.inlineCode) + '">' + esc(node.value) + '</code>';
      case 'rawHtml':
        return sanitizeRawInlineHtml(node.value, theme);
      case 'link':
        // WeChat: plain links often blocked; render as styled text + href note
        var linkText = renderInline(node.children, theme);
        return (
          '<a href="' +
          esc(node.href) +
          '" style="' +
          styleOf(theme.a) +
          '">' +
          linkText +
          '</a>'
        );
      case 'image':
        return (
          '<img src="' +
          esc(node.src) +
          '" alt="' +
          esc(node.alt) +
          '" style="' +
          styleOf(theme.img) +
          '"/>'
        );
      default:
        return '';
    }
  }

  function renderBlocks(blocks, theme) {
    return blocks
      .map(function (b) {
        return renderBlock(b, theme);
      })
      .join('');
  }

  function renderBlock(block, theme) {
    switch (block.type) {
      case 'heading': {
        var tag = 'h' + Math.min(6, Math.max(1, block.level));
        var styles = theme['h' + block.level] || theme.h3;
        return (
          '<' +
          tag +
          ' style="' +
          styleOf(styles) +
          '">' +
          renderInline(block.children, theme) +
          '</' +
          tag +
          '>'
        );
      }
      case 'paragraph':
        return (
          '<p style="' + styleOf(theme.p) + '">' + renderInline(block.children, theme) + '</p>'
        );
      case 'code':
        return (
          '<pre style="' +
          styleOf(theme.codeBlock) +
          '"><code>' +
          esc(block.value) +
          '</code></pre>'
        );
      case 'blockquote':
        return (
          '<blockquote style="' +
          styleOf(theme.blockquote) +
          '">' +
          renderBlocks(block.children, theme) +
          '</blockquote>'
        );
      case 'hr':
        return '<hr style="' + styleOf(theme.hr) + '"/>';
      case 'ul':
      case 'ol':
        return renderList(block, theme);
      case 'table':
        return renderTable(block, theme);
      default:
        return '';
    }
  }

  function renderList(list, theme) {
    var tag = list.type === 'ol' ? 'ol' : 'ul';
    var listStyle = theme[tag] || theme.ul;
    var items = list.items
      .map(function (item) {
        return (
          '<li style="' +
          styleOf(theme.li) +
          '">' +
          renderInline(item.children, theme) +
          '</li>'
        );
      })
      .join('');
    return '<' + tag + ' style="' + styleOf(listStyle) + '">' + items + '</' + tag + '>';
  }

  function renderTable(table, theme) {
    var head =
      '<tr>' +
      table.header
        .map(function (c) {
          return '<th style="' + styleOf(theme.th) + '">' + esc(c) + '</th>';
        })
        .join('') +
      '</tr>';
    var body = table.rows
      .map(function (row) {
        return (
          '<tr>' +
          row
            .map(function (c) {
              return '<td style="' + styleOf(theme.td) + '">' + esc(c) + '</td>';
            })
            .join('') +
          '</tr>'
        );
      })
      .join('');
    return (
      '<table style="' + styleOf(theme.table) + '"><thead>' + head + '</thead><tbody>' + body + '</tbody></table>'
    );
  }

  /**
   * Sanitize arbitrary HTML into WeChat-safe inline-style HTML.
   * Keeps allowed tags, strips scripts/styles/ids, forces inline styles from theme where possible.
   */
  var ALLOWED = {
    p: true, div: true, section: true, span: true,
    h1: true, h2: true, h3: true, h4: true, h5: true, h6: true,
    strong: true, b: true, em: true, i: true, s: true, del: true,
    code: true, pre: true, blockquote: true,
    ul: true, ol: true, li: true,
    img: true, a: true, br: true, hr: true,
    table: true, thead: true, tbody: true, tr: true, th: true, td: true,
    figure: true, figcaption: true, mark: true, u: true
  };

  var DROP = { script: true, style: true, iframe: true, object: true, embed: true, link: true, meta: true, form: true, input: true, button: true };

  function htmlToWechat(html, theme) {
    var parser = new DOMParser();
    var doc = parser.parseFromString('<div id="__root__">' + html + '</div>', 'text/html');
    var root = doc.getElementById('__root__');
    if (!root) return '';
    return convertNode(root, theme, true);
  }

  function convertNode(node, theme, isRoot) {
    if (node.nodeType === Node.TEXT_NODE) {
      return esc(node.textContent || '');
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    var tag = node.tagName.toLowerCase();
    if (DROP[tag]) return '';

    if (tag === 'br') return '<br/>';
    if (tag === 'hr') return '<hr style="' + styleOf(theme.hr) + '"/>';

    var children = Array.prototype.map
      .call(node.childNodes, function (c) {
        return convertNode(c, theme, false);
      })
      .join('');

    if (!ALLOWED[tag]) {
      // unwrap unknown tags, keep children
      return children;
    }

    var styles = pickStyles(tag, node, theme);
    var attrs = '';
    if (styles) attrs += ' style="' + styleOf(styles) + '"';

    if (tag === 'img') {
      var src = node.getAttribute('src') || '';
      var alt = node.getAttribute('alt') || '';
      return '<img src="' + esc(src) + '" alt="' + esc(alt) + '"' + attrs + '/>';
    }

    if (tag === 'a') {
      var href = node.getAttribute('href') || '';
      return '<a href="' + esc(href) + '"' + attrs + '>' + children + '</a>';
    }

    // void-ish
    if (tag === 'input') return '';

    return '<' + tag + attrs + '>' + children + '</' + tag + '>';
  }

  function pickStyles(tag, node, theme) {
    // Merge existing inline styles (filtered) with theme defaults
    var existing = {};
    var inline = node.getAttribute('style');
    if (inline) {
      inline.split(';').forEach(function (pair) {
        var kv = pair.split(':');
        if (kv.length >= 2) {
          var k = kv[0].trim().toLowerCase();
          var v = kv.slice(1).join(':').trim();
          if (k && v && isSafeProp(k)) existing[k] = v;
        }
      });
    }

    var base = null;
    switch (tag) {
      case 'h1': base = theme.h1; break;
      case 'h2': base = theme.h2; break;
      case 'h3': base = theme.h3; break;
      case 'h4':
      case 'h5':
      case 'h6': base = theme.h4; break;
      case 'p':
      case 'div':
      case 'section': base = theme.p; break;
      case 'strong':
      case 'b': base = theme.bold; break;
      case 'em':
      case 'i': base = theme.italic; break;
      case 's':
      case 'del': base = theme.strike; break;
      case 'code': base = tag === 'code' ? theme.inlineCode : null; break;
      case 'pre': base = theme.codeBlock; break;
      case 'blockquote': base = theme.blockquote; break;
      case 'ul': base = theme.ul; break;
      case 'ol': base = theme.ol; break;
      case 'li': base = theme.li; break;
      case 'a': base = theme.a; break;
      case 'img': base = theme.img; break;
      case 'table': base = theme.table; break;
      case 'th': base = theme.th; break;
      case 'td': base = theme.td; break;
      case 'hr': base = theme.hr; break;
      default: base = null;
    }

    var result = {};
    if (base) {
      for (var k in base) {
        if (Object.prototype.hasOwnProperty.call(base, k)) result[k] = base[k];
      }
    }
    for (var ek in existing) {
      if (Object.prototype.hasOwnProperty.call(existing, ek)) result[ek] = existing[ek];
    }
    return result;
  }

  function isSafeProp(name) {
    // block javascript: urls and expression()
    if (/expression|javascript:|url\s*\(/i.test(name)) return false;
    return true;
  }

  /** Markdown → WeChat HTML */
  function markdownToWechat(md, themeId) {
    var theme = WeChatThemes.get(themeId || 'minimal');
    var blocks = MarkdownParser.parse(md);
    var body = renderBlocks(blocks, theme);
    var pageStyle = styleOf(theme.page);
    return (
      '<section style="' +
      pageStyle +
      '">' +
      body +
      '</section>'
    );
  }

  /** HTML → WeChat HTML */
  function rawHtmlToWechat(html, themeId) {
    var theme = WeChatThemes.get(themeId || 'minimal');
    var inner = htmlToWechat(html, theme);
    var pageStyle = styleOf(theme.page);
    return '<section style="' + pageStyle + '">' + inner + '</section>';
  }

  /** Collect image srcs for upload guidance */
  function collectImages(wechatHtml) {
    var re = /<img[^>]+src=["']([^"']+)["']/gi;
    var out = [];
    var m;
    while ((m = re.exec(wechatHtml))) {
      out.push(m[1]);
    }
    return out;
  }

  /** Flag links that WeChat may block */
  function collectLinks(wechatHtml) {
    var re = /<a[^>]+href=["']([^"']+)["']/gi;
    var out = [];
    var m;
    while ((m = re.exec(wechatHtml))) {
      out.push(m[1]);
    }
    return out;
  }

  return {
    markdownToWechat: markdownToWechat,
    rawHtmlToWechat: rawHtmlToWechat,
    collectImages: collectImages,
    collectLinks: collectLinks,
    htmlToWechat: htmlToWechat
  };
})();
