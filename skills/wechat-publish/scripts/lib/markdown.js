/**
 * Markdown parser for WeChat Official Account converter.
 */
const MarkdownParser = (function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function parseInline(text) {
    var tokens = [];
    var rest = String(text);

    // 0) 原生 HTML 混排：优先抽取 <img ...>（含 style 阴影/圆角），避免被当纯文本转义
    // 也支持 <br> <hr> 等自闭合
    rest = rest.replace(/<img\b[^>]*>/gi, function (tag) {
      var id = tokens.length;
      tokens.push({ type: 'rawHtml', value: tag });
      return '\x00H' + id + '\x00';
    });
    rest = rest.replace(/<br\s*\/?>/gi, function () {
      return '\x00BR\x00';
    });

    // 1) base64 / data URI 图片必须最先抽取（超长、无空格，但普通正则易被截断）
    // 形如 ![alt](data:image/png;base64,XXXX)
    rest = rest.replace(/!\[([^\]]*)\]\((data:[^)\s]+)\)/gi, function (_, alt, src) {
      var id = tokens.length;
      tokens.push({ type: 'image', alt: alt || '', src: src, title: '' });
      return '\x00G' + id + '\x00';
    });

    rest = rest.replace(/`([^`]+)`/g, function (_, code) {
      var id = tokens.length;
      tokens.push({ type: 'code', value: code });
      return '\x00C' + id + '\x00';
    });

    // 普通图片（http/https/相对路径等）
    rest = rest.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, function (_, alt, src, title) {
      var id = tokens.length;
      tokens.push({ type: 'image', alt: alt || '', src: src, title: title || '' });
      return '\x00G' + id + '\x00';
    });

    rest = rest.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, function (_, text, href, title) {
      var id = tokens.length;
      tokens.push({
        type: 'link',
        children: [{ type: 'text', value: text }],
        href: href,
        title: title || ''
      });
      return '\x00L' + id + '\x00';
    });

    rest = rest.replace(/\*\*\*([\s\S]+?)\*\*\*/g, function (_, t) {
      var id = tokens.length;
      tokens.push({ type: 'bold', children: [{ type: 'italic', children: [{ type: 'text', value: t }] }] });
      return '\x00B' + id + '\x00';
    });

    rest = rest.replace(/\*\*([\s\S]+?)\*\*/g, function (_, t) {
      var id = tokens.length;
      tokens.push({ type: 'bold', children: [{ type: 'text', value: t }] });
      return '\x00B' + id + '\x00';
    });
    rest = rest.replace(/__([\s\S]+?)__/g, function (_, t) {
      var id = tokens.length;
      tokens.push({ type: 'bold', children: [{ type: 'text', value: t }] });
      return '\x00B' + id + '\x00';
    });

    rest = rest.replace(/\*([\s\S]+?)\*/g, function (_, t) {
      var id = tokens.length;
      tokens.push({ type: 'italic', children: [{ type: 'text', value: t }] });
      return '\x00I' + id + '\x00';
    });
    rest = rest.replace(/_([^_\s][\s\S]*?)_/g, function (_, t) {
      var id = tokens.length;
      tokens.push({ type: 'italic', children: [{ type: 'text', value: t }] });
      return '\x00I' + id + '\x00';
    });

    rest = rest.replace(/~~([\s\S]+?)~~/g, function (_, t) {
      var id = tokens.length;
      tokens.push({ type: 'strike', children: [{ type: 'text', value: t }] });
      return '\x00S' + id + '\x00';
    });

    rest = rest.replace(/ {2,}\n/g, '\x00BR\x00');
    rest = rest.replace(/\n/g, ' ');

    var parts = [];
    var re = /\x00(?:C|G|L|B|I|S|H)(\d+)\x00|\x00BR\x00/g;
    var last = 0;
    var m;
    var buf = '';
    while ((m = re.exec(rest))) {
      if (m.index > last) buf += rest.slice(last, m.index);
      if (buf) {
        parts.push({ type: 'text', value: buf });
        buf = '';
      }
      if (m[0] === '\x00BR\x00') {
        parts.push({ type: 'br' });
      } else {
        parts.push(tokens[Number(m[1])]);
      }
      last = re.lastIndex;
    }
    if (last < rest.length) buf += rest.slice(last);
    if (buf) parts.push({ type: 'text', value: buf });
    return parts;
  }

  function splitTableRow(line) {
    var s = line.trim();
    if (s.charAt(0) === '|') s = s.slice(1);
    if (s.charAt(s.length - 1) === '|') s = s.slice(0, -1);
    return s.split('|').map(function (c) { return c.trim(); });
  }

  function isTableSep(line) {
    return /^\s*\|?[\s:|-]+\|?\s*$/.test(line) && line.indexOf('-') !== -1;
  }

  function parse(source) {
    var lines = String(source).replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    var blocks = [];
    var i = 0;

    while (i < lines.length) {
      var line = lines[i];

      if (line.trim() === '') {
        i++;
        continue;
      }

      var fence = line.match(/^```\s*([\w-]*)\s*$/);
      if (fence) {
        var lang = fence[1] || '';
        var codeLines = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) {
          codeLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) i++;
        blocks.push({ type: 'code', lang: lang, value: codeLines.join('\n') });
        continue;
      }

      var h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        blocks.push({
          type: 'heading',
          level: h[1].length,
          children: parseInline(h[2].replace(/\s+#+\s*$/, ''))
        });
        i++;
        continue;
      }

      if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
        blocks.push({ type: 'hr' });
        i++;
        continue;
      }

      if (/^\s*>\s?/.test(line)) {
        var quoteLines = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          quoteLines.push(lines[i].replace(/^\s*>\s?/, ''));
          i++;
        }
        blocks.push({ type: 'blockquote', children: parse(quoteLines.join('\n')) });
        continue;
      }

      if (line.indexOf('|') !== -1 && i + 1 < lines.length && isTableSep(lines[i + 1])) {
        var header = splitTableRow(line);
        i += 2;
        var rows = [];
        while (i < lines.length && lines[i].indexOf('|') !== -1 && lines[i].trim() !== '') {
          rows.push(splitTableRow(lines[i]));
          i++;
        }
        blocks.push({ type: 'table', header: header, rows: rows });
        continue;
      }

      if (/^\s*\d+\.\s+/.test(line)) {
        var items = [];
        while (i < lines.length) {
          var om = lines[i].match(/^(\s*)(\d+)\.\s+(.*)$/);
          if (!om) {
            if (lines[i].trim() === '' && i + 1 < lines.length && /^\s*\d+\.\s+/.test(lines[i + 1])) {
              i++;
              continue;
            }
            break;
          }
          items.push({ type: 'listItem', children: parseInline(om[3]) });
          i++;
        }
        blocks.push({ type: 'ol', items: items });
        continue;
      }

      if (/^\s*[-*+]\s+/.test(line)) {
        var uitems = [];
        while (i < lines.length) {
          var um = lines[i].match(/^(\s*)[-*+]\s+(.*)$/);
          if (!um) {
            if (lines[i].trim() === '' && i + 1 < lines.length && /^\s*[-*+]\s+/.test(lines[i + 1])) {
              i++;
              continue;
            }
            break;
          }
          uitems.push({ type: 'listItem', children: parseInline(um[2]) });
          i++;
        }
        blocks.push({ type: 'ul', items: uitems });
        continue;
      }

      var para = [];
      while (i < lines.length && lines[i].trim() !== '') {
        if (
          /^#{1,6}\s/.test(lines[i]) ||
          /^```/.test(lines[i]) ||
          /^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i]) ||
          /^\s*>\s?/.test(lines[i]) ||
          /^\s*[-*+]\s+/.test(lines[i]) ||
          /^\s*\d+\.\s+/.test(lines[i])
        ) {
          break;
        }
        para.push(lines[i]);
        i++;
      }
      if (para.length) {
        blocks.push({ type: 'paragraph', children: parseInline(para.join('\n')) });
      }
    }

    return blocks;
  }

  return {
    parse: parse,
    escapeHtml: escapeHtml,
    parseInline: parseInline
  };
})();
