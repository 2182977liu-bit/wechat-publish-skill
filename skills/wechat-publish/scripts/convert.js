#!/usr/bin/env node
/**
 * wechat-publish CLI: Markdown/HTML -> WeChat inline-style HTML
 *
 * Usage:
 *   node scripts/convert.js input.md
 *   node scripts/convert.js input.md -t zhihu -o out.html
 *   node scripts/convert.js input.md -t minimal --title "标题" --author "松君杂货铺"
 *   node scripts/convert.js --html input.html -t night
 *
 * Prints HTML to stdout by default (or -o file).
 * Exit 0 on success.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const LIB = path.join(ROOT, 'lib');

function loadLib() {
  const context = { console };
  vm.createContext(context);
  function load(name, exportName) {
    const code = fs.readFileSync(path.join(LIB, name), 'utf8');
    vm.runInContext(code + '\n;this.' + exportName + ' = ' + exportName + ';', context);
  }
  load('markdown.js', 'MarkdownParser');
  load('themes.js', 'WeChatThemes');
  load('converter.js', 'WeChatConverter');
  return context;
}

function parseArgs(argv) {
  const args = {
    input: null,
    htmlMode: false,
    theme: 'minimal',
    out: null,
    title: null,
    author: null,
    wrap: false,
    help: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') args.help = true;
    else if (a === '--html') args.htmlMode = true;
    else if (a === '-t' || a === '--theme') args.theme = argv[++i];
    else if (a === '-o' || a === '--out') args.out = argv[++i];
    else if (a === '--title') args.title = argv[++i];
    else if (a === '--author') args.author = argv[++i];
    else if (a === '--wrap') args.wrap = true;
    else if (!a.startsWith('-') && !args.input) args.input = a;
  }
  return args;
}

function usage() {
  console.error(
    [
      'Usage: node convert.js <input.md> [options]',
      '',
      'Options:',
      '  -t, --theme <id>    minimal|zhihu|juejin|techPurple|wood|night (default: minimal)',
      '  -o, --out <file>    write HTML to file instead of stdout',
      '  --html              treat input as HTML (not Markdown)',
      '  --title <text>      prepend title as H1 if missing',
      '  --author <text>     append author line',
      '  --wrap              wrap full page for local preview',
      '  -h, --help          show help',
      '',
      'Example:',
      '  node convert.js article.md -t zhihu -o article.wechat.html --author "松君杂货铺"',
    ].join('\n')
  );
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.input) {
    usage();
    process.exit(args.help ? 0 : 1);
  }

  const inputPath = path.resolve(args.input);
  if (!fs.existsSync(inputPath)) {
    console.error('Input not found: ' + inputPath);
    process.exit(1);
  }

  const ctx = loadLib();
  const themes = ctx.WeChatThemes.list().map((t) => t.id);
  if (themes.indexOf(args.theme) === -1) {
    console.error('Unknown theme: ' + args.theme + '\nValid: ' + themes.join(', '));
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, 'utf8');
  let html;
  if (args.htmlMode) {
    html = ctx.WeChatConverter.rawHtmlToWechat(raw, args.theme);
  } else {
    let md = raw;
    if (args.title && md.indexOf('# ') !== 0) {
      md = '# ' + args.title + '\n\n' + md;
    }
    html = ctx.WeChatConverter.markdownToWechat(md, args.theme);
    if (args.author) {
      const authorLine =
        '\n<hr style="border:none;border-top:1px solid #eeeeee;margin:28px 0"/>' +
        '\n<p style="font-size:15px;line-height:1.6;margin:16px 0 0;color:#666666"><strong style="font-weight:700;color:#111111">作者</strong>：' +
        args.author +
        '</p>';
      // inject before closing </section>
      const idx = html.lastIndexOf('</section>');
      if (idx !== -1) {
        html = html.slice(0, idx) + authorLine + '\n' + html.slice(idx);
      } else {
        html = html + authorLine;
      }
    }
  }

  if (args.wrap) {
    html =
      '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"/><title>WeChat</title>' +
      '<style>body{margin:0;background:#e8e8e8}.phone{max-width:414px;margin:16px auto;background:#fff;box-shadow:0 4px 24px rgba(0,0,0,.12)}</style>' +
      '</head><body><div class="phone">' +
      html +
      '</div></body></html>';
  }

  const imgs = ctx.WeChatConverter.collectImages(html);
  const dataImgs = imgs.filter(function (s) { return s.indexOf('data:') === 0; });
  const warn = [];
  imgs.forEach(function (s) {
    if (s.indexOf('data:') !== 0 && s.indexOf('mmbiz.qpic.cn') === -1) {
      warn.push('non-embedded image: ' + s.slice(0, 80));
    }
  });

  if (args.out) {
    fs.writeFileSync(path.resolve(args.out), html, 'utf8');
    console.error('Wrote ' + path.resolve(args.out) + ' (' + html.length + ' chars, ' + dataImgs.length + ' data: imgs)');
  } else {
    process.stdout.write(html);
    console.error('');
    console.error('OK chars=' + html.length + ' imgs=' + imgs.length + ' dataImgs=' + dataImgs.length + ' theme=' + args.theme);
  }
  warn.forEach(function (w) { console.error('WARN ' + w); });
}

main();
