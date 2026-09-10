/**
 * Main UI application for WeChat Official Account injector.
 */

(function () {
  var state = {
    mode: 'markdown',
    themeId: 'minimal',
    convertedHtml: '',
    source: ''
  };

  var els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function init() {
    els.modeMd = $('mode-md');
    els.modeHtml = $('mode-html');
    els.themeSelect = $('theme-select');
    els.themeDesc = $('theme-desc');
    els.input = $('source-input');
    els.preview = $('preview-frame');
    els.status = $('status-bar');
    els.charCount = $('char-count');
    els.imgCount = $('img-count');
    els.linkCount = $('link-count');
    els.btnConvert = $('btn-convert');
    els.btnConvertRight = $('btn-convert-right');
    els.btnEmbed = $('btn-embed');
    els.btnCopy = $('btn-copy');
    els.btnCopySnippet = $('btn-copy-snippet');
    els.btnDetect = $('btn-detect');
    els.btnOpenMp = $('btn-open-mp');
    els.btnOpenArticle = $('btn-open-article');
    els.btnSemi = $('btn-semi');
    els.metaTitle = $('meta-title');
    els.metaAuthor = $('meta-author');
    els.btnDownload = $('btn-download');
    els.btnLoadSample = $('btn-load-sample');
    els.btnClear = $('btn-clear');
    els.btnFile = $('btn-file');
    els.fileInput = $('file-input');
    els.snippetBox = $('snippet-box');
    els.snippetText = $('snippet-text');
    els.warnings = $('warnings');

    // populate themes
    WeChatThemes.list().forEach(function (t) {
      var opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.name;
      els.themeSelect.appendChild(opt);
    });
    updateThemeDesc();

    // events
    els.modeMd.addEventListener('click', function () {
      setMode('markdown');
    });
    els.modeHtml.addEventListener('click', function () {
      setMode('html');
    });
    els.themeSelect.addEventListener('change', function () {
      state.themeId = els.themeSelect.value;
      updateThemeDesc();
      if (state.convertedHtml) convert();
    });
    els.btnConvert.addEventListener('click', convert);
    if (els.btnConvertRight) {
      els.btnConvertRight.addEventListener('click', function () {
        convert();
      });
    }
    if (els.btnEmbed) {
      els.btnEmbed.addEventListener('click', doEmbedImages);
    }
    els.btnCopy.addEventListener('click', doCopy);
    els.btnCopySnippet.addEventListener('click', doCopySnippet);
    els.btnDetect.addEventListener('click', doDetect);
    els.btnOpenMp.addEventListener('click', doOpenMp);
    els.btnOpenArticle.addEventListener('click', doOpenArticle);
    els.btnSemi.addEventListener('click', doSemiAuto);
    els.btnDownload.addEventListener('click', doDownload);
    els.btnLoadSample.addEventListener('click', loadSample);
    els.btnClear.addEventListener('click', clearAll);
    els.btnFile.addEventListener('click', function () {
      els.fileInput.click();
    });
    els.fileInput.addEventListener('change', onFile);
    els.input.addEventListener('input', updateStats);

    // live convert debounce
    var timer = null;
    els.input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(convert, 400);
    });

    setStatus('就绪 — 粘贴或上传 Markdown / HTML，点击「转换预览」', 'ok');
  }

  function setMode(mode) {
    state.mode = mode;
    els.modeMd.classList.toggle('active', mode === 'markdown');
    els.modeHtml.classList.toggle('active', mode === 'html');
    if (state.source || els.input.value) convert();
  }

  function updateThemeDesc() {
    var list = WeChatThemes.list();
    var found = list.filter(function (t) {
      return t.id === state.themeId;
    })[0];
    els.themeDesc.textContent = found ? found.desc : '';
  }

  function setStatus(msg, type) {
    els.status.textContent = msg;
    els.status.className = 'status ' + (type || 'ok');
  }

  function updateStats() {
    var text = els.input.value || '';
    els.charCount.textContent = String(text.length);
  }

  function convert() {
    var source = els.input.value;
    state.source = source;
    if (!source || !source.trim()) {
      setStatus('输入为空', 'warn');
      return;
    }
    try {
      var html;
      if (state.mode === 'markdown') {
        html = WeChatConverter.markdownToWechat(source, state.themeId);
      } else {
        html = WeChatConverter.rawHtmlToWechat(source, state.themeId);
      }
      state.convertedHtml = html;
      renderPreview(html);
      updateMeta(html);
      setStatus('转换完成 — 可复制或下载', 'ok');
    } catch (e) {
      setStatus('转换失败: ' + e.message, 'err');
      console.error(e);
    }
  }

  function renderPreview(html) {
    var doc = els.preview.contentDocument || els.preview.contentWindow.document;
    doc.open();
    doc.write(
      '<!DOCTYPE html><html><head><meta charset="utf-8">' +
        '<style>body{margin:0;padding:0;background:#e8e8e8;} .phone{max-width:414px;margin:16px auto;background:#fff;box-shadow:0 4px 24px rgba(0,0,0,.12);overflow:hidden;}</style>' +
        '</head><body><div class="phone">' +
        html +
        '</div></body></html>'
    );
    doc.close();
  }

  function updateMeta(html) {
    var imgs = WeChatConverter.collectImages(html);
    var links = WeChatConverter.collectLinks(html);
    els.imgCount.textContent = String(imgs.length);
    els.linkCount.textContent = String(links.length);
    els.charCount.textContent = String((els.input.value || '').length);

    var warns = [];
    var base64N = 0;
    imgs.forEach(function (src) {
      if (/^(https?:)?\/\//i.test(src) && src.indexOf('mmbiz.qpic.cn') === -1) {
        warns.push('图片需上传公众号素材库: ' + src.slice(0, 60));
      } else if (/^data:/i.test(src)) {
        base64N++;
        // base64 可直接粘贴，不是错误
      } else if (/^(\.\/|\/|[A-Za-z]:)/.test(src) || src.indexOf('http') !== 0) {
        warns.push('本地/相对路径图片需先上传素材库: ' + src.slice(0, 60));
      }
    });
    if (base64N) {
      warns.push('内嵌 base64 图 ' + base64N + ' 张 — 可直接复制粘贴；发布后建议再传素材库更稳');
    }
    links.forEach(function (href) {
      if (/^https?:\/\//i.test(href)) {
        warns.push('正文外链在公众号可能被拦: ' + href.slice(0, 50));
      }
    });
    var htmlLen = (html || '').length;
    if (htmlLen > 2 * 1024 * 1024) {
      warns.push('转换结果约 ' + (htmlLen / 1048576).toFixed(1) + 'MB，复制可能失败 — 优先用「生成注入代码」');
    }
    if (warns.length) {
      els.warnings.innerHTML = warns
        .slice(0, 12)
        .map(function (w) {
          return '<div class="warn-item">' + escapeHtml(w) + '</div>';
        })
        .join('');
      if (warns.length > 12) {
        els.warnings.innerHTML += '<div class="warn-item">… 另有 ' + (warns.length - 12) + ' 条</div>';
      }
    } else {
      els.warnings.innerHTML = '<div class="warn-ok">未发现图片/外链风险项</div>';
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  async function doCopy() {
    if (!state.convertedHtml) {
      setStatus('请先转换', 'warn');
      return;
    }
    try {
      var r = await WeChatClipboard.copyRichHtml(state.convertedHtml);
      if (r && r.ok) {
        var mb = (r.size / 1048576).toFixed(2);
        if (r.size > 2 * 1048576) {
          setStatus('已复制（' + mb + 'MB, ' + r.method + '）— 体积大，若粘贴失败请改用「生成注入代码」', 'ok');
        } else {
          setStatus('已复制富文本（' + r.method + '）— 切到公众号编辑区 Ctrl+V', 'ok');
        }
      } else {
        setStatus('复制失败 — 请用「生成注入代码」或「下载 HTML」', 'err');
      }
    } catch (e) {
      setStatus('复制异常: ' + e.message + ' — 请改用注入代码', 'err');
    }
  }

  function doDetect() {
    var snippet = WeChatClipboard.buildDetectAccountSnippet();
    els.snippetText.value = snippet;
    els.snippetBox.classList.remove('hidden');
    try {
      navigator.clipboard.writeText(snippet);
      setStatus('检测代码已复制 — 请切到 mp.weixin.qq.com 后台标签页 → F12 → Console 粘贴（勿贴本地页）', 'ok');
    } catch (e) {
      setStatus('检测代码已生成，请手动复制到 mp.weixin.qq.com 的 Console', 'warn');
    }
  }

  function doOpenMp() {
    window.open('https://mp.weixin.qq.com/', 'mp-weixin-home', 'noopener');
    setStatus('已在新标签打开公众号首页 — 登录后：内容与互动 → 图文消息 → 新的创作', 'ok');
  }

  function doOpenArticle() {
    var snippet = WeChatClipboard.buildOpenNewArticleSnippet();
    els.snippetText.value = snippet;
    els.snippetBox.classList.remove('hidden');
    try {
      navigator.clipboard.writeText(snippet);
      setStatus('打开新建图文代码已复制 — 在公众号后台 Console 粘贴运行', 'ok');
    } catch (e) {
      setStatus('代码已生成，请复制到公众号后台 Console 运行', 'warn');
    }
  }

  function doCopySnippet() {
    if (!state.convertedHtml) {
      setStatus('请先转换', 'warn');
      return;
    }
    var title = (els.metaTitle && els.metaTitle.value ? els.metaTitle.value : '').trim() || guessTitleFromHtml(state.convertedHtml);
    var author = (els.metaAuthor && els.metaAuthor.value ? els.metaAuthor.value : '').trim();
    var snippet = WeChatClipboard.buildInjectSnippet(state.convertedHtml, title, author);
    els.snippetText.value = snippet;
    els.snippetBox.classList.remove('hidden');
    try {
      navigator.clipboard.writeText(snippet);
      setStatus('文章注入代码已复制 — 在文章编辑页 F12 Console 粘贴（先允许粘贴），可填标题/作者/正文', 'ok');
    } catch (e) {
      setStatus('注入代码已生成，请手动从下方复制', 'warn');
    }
  }

  function doDownload() {
    if (!state.convertedHtml) {
      setStatus('请先转换', 'warn');
      return;
    }
    WeChatClipboard.downloadHtml(state.convertedHtml, 'wechat-' + state.themeId + '.html');
    setStatus('已下载 HTML 文件', 'ok');
  }

  function doEmbedImages() {
    var src = (els.input.value || '').trim();
    if (!src) {
      setStatus('请先粘贴或上传 MD/HTML', 'warn');
      return;
    }
    setStatus('正在通过本机服务下载外链图并转 base64…', 'warn');
    fetch('http://127.0.0.1:8765/embed-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: src })
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (!data || !data.ok) {
          setStatus((data && data.message) || '转内嵌失败', 'err');
          return;
        }
        els.input.value = data.text;
        convert();
        var s = data.stats || {};
        setStatus(
          '外链图处理完成：成功 ' + (s.ok || 0) + '，失败 ' + (s.fail || 0) +
            '，跳过 ' + (s.skipped || 0) +
            (s.errors && s.errors.length ? '。失败例：' + s.errors[0] : ''),
          s.fail ? 'warn' : 'ok'
        );
      })
      .catch(function (e) {
        setStatus('未检测到本机服务 — 请先启动「启动半自动服务.cmd」再点本按钮', 'err');
      });
  }

  function guessTitleFromHtml(html) {
    var m = String(html || '').match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (!m) m = String(html || '').match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (!m) return '';
    return m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim().slice(0, 64);
  }

  function doSemiAuto() {
    if (!state.convertedHtml) {
      setStatus('请先转换', 'warn');
      return;
    }
    var title = (els.metaTitle && els.metaTitle.value ? els.metaTitle.value : '').trim() || guessTitleFromHtml(state.convertedHtml);
    var author = (els.metaAuthor && els.metaAuthor.value ? els.metaAuthor.value : '').trim();
    var payload = JSON.stringify({
      html: state.convertedHtml,
      title: title,
      author: author
    });
    setStatus('正在连接本地半自动服务 http://127.0.0.1:8765 …', 'warn');

    // 1) 优先一键：POST 到本机 serve
    fetch('http://127.0.0.1:8765/inject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    })
      .then(function (r) {
        return r.json().catch(function () {
          return { ok: false, message: '服务返回非 JSON' };
        });
      })
      .then(function (data) {
        if (data && (data.ok || data.accepted)) {
          setStatus('已触发文章注入（标题/作者/正文）— 请在弹出的编辑页人工预览/发布', 'ok');
          return;
        }
        setStatus((data && data.message) || '注入服务拒绝请求', 'err');
      })
      .catch(function () {
        // 2) 服务未启动：下载 HTML + 可双击 bat
        fallbackSemiAutoFiles();
      });
  }

  function fallbackSemiAutoFiles() {
    var theme = state.themeId;
    var fileName = 'wechat-' + theme + '.html';
    WeChatClipboard.downloadHtml(state.convertedHtml, fileName);

    var py = 'C:\\Users\\18751994637\\AppData\\Local\\Programs\\Python\\Python312\\python.exe';
    var bat = [
      '@echo off',
      'chcp 650001 >nul',
      'cd /d "%~dp0"',
      'echo [半自动] 正在启动本地服务，然后请回到 index.html 再点一次「半自动注入」…',
      'echo 若从未登录过，请另开窗口先执行:',
      'echo   ' + py + ' scripts\\auto_inject.py login',
      'echo.',
      py + ' scripts\\auto_inject.py serve',
      'pause'
    ].join('\r\n');
    // 修正 chcp 笔误
    bat = bat.replace('chcp 650001', 'chcp 65001');

    try {
      var blob = new Blob([bat], { type: 'application/octet-stream' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '启动半自动注入服务.bat';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      }, 1000);
    } catch (e) {}

    var lines = [
      '本地服务未启动，已下载：',
      '1) HTML 文件: ' + fileName,
      '2) 启动脚本: 启动半自动注入服务.bat',
      '',
      '请双击「启动半自动注入服务.bat」保持窗口打开，',
      '然后回到本页再点一次「半自动注入」即可自动打开图文并写入。',
      '',
      '首次还需在终端执行一次登录：',
      py + ' scripts\\auto_inject.py login'
    ].join('\n');
    els.snippetText.value = lines;
    els.snippetBox.classList.remove('hidden');
    setStatus('未检测到半自动服务 — 已下载启动 bat 与 HTML，双击 bat 后再点一次「半自动注入」', 'warn');
  }

  function loadSample() {
    if (state.mode === 'markdown') {
      els.input.value = SAMPLE_MD;
    } else {
      els.input.value = SAMPLE_HTML;
    }
    convert();
  }

  function clearAll() {
    els.input.value = '';
    state.source = '';
    state.convertedHtml = '';
    els.imgCount.textContent = '0';
    els.linkCount.textContent = '0';
    els.charCount.textContent = '0';
    els.warnings.innerHTML = '';
    els.snippetBox.classList.add('hidden');
    var doc = els.preview.contentDocument || els.preview.contentWindow.document;
    doc.open();
    doc.write('<!DOCTYPE html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:400px;color:#999;font-family:sans-serif;">预览区</body></html>');
    doc.close();
    setStatus('已清空', 'ok');
  }

  function onFile(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var name = file.name.toLowerCase();
    if (name.endsWith('.md') || name.endsWith('.markdown')) {
      setMode('markdown');
    } else if (name.endsWith('.html') || name.endsWith('.htm')) {
      setMode('html');
    }
    var reader = new FileReader();
    reader.onload = function () {
      els.input.value = String(reader.result || '');
      convert();
      setStatus('已加载文件: ' + file.name, 'ok');
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  }

  var SAMPLE_MD = [
    '# 公众号排版示例',
    '',
    '这是一篇用于验证 **Markdown → 公众号** 转换效果的示例文章。',
    '支持 *斜体*、~~删除线~~ 和 `inline code`。',
    '',
    '## 二级标题',
    '',
    '> 这是一段引用。适合用来强调结论或金句，视觉上会形成独立色块。',
    '',
    '### 列表',
    '',
    '1. 有序列表第一项',
    '2. 有序列表第二项',
    '3. 有序列表第三项',
    '',
    '- 无序列表 A',
    '- 无序列表 B',
    '- 无序列表 C',
    '',
    '### 代码块',
    '',
    '```javascript',
    'function hello() {',
    '  console.log("Hello WeChat!");',
    '}',
    '```',
    '',
    '### 表格',
    '',
    '| 特性 | 支持 | 说明 |',
    '|------|------|------|',
    '| 标题 | 是 | H1-H4 |',
    '| 引用 | 是 | 左侧色条 |',
    '| 代码 | 是 | 等宽字体 |',
    '',
    '---',
    '',
    '正文结束。外链示例：[百度](https://www.baidu.com) 在公众号中可能被拦截，建议改用「阅读原文」。',
    '',
    '图片示例（需上传素材库后替换）：',
    '![示意图](https://picsum.photos/800/400)'
  ].join('\n');

  var SAMPLE_HTML = [
    '<h1>HTML 转公众号示例</h1>',
    '<p>这是一段<strong>加粗</strong>与<em>斜体</em>混排的正文。</p>',
    '<blockquote>HTML 会被清洗并套用当前主题的内联样式。</blockquote>',
    '<ul><li>项目一</li><li>项目二</li></ul>',
    '<pre><code>const x = 1;</code></pre>'
  ].join('\n');

  document.addEventListener('DOMContentLoaded', init);
})();
