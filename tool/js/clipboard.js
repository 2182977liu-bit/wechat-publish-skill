/**
 * Clipboard + injection helpers.
 */

const WeChatClipboard = (function () {
  /**
   * Copy rich HTML to system clipboard so Ctrl+V into WeChat editor keeps styles.
   * file:// 页面上 Clipboard API 常失败，必须有 execCommand 兜底；大体积 base64 也要处理。
   */
  async function copyRichHtml(html) {
    var size = (html || '').length;
    // 1) 现代 API（需安全上下文 + 用户手势；超大 HTML 可能被拒）
    if (navigator.clipboard && window.ClipboardItem) {
      try {
        var blob = new Blob([html], { type: 'text/html' });
        var item = new ClipboardItem({ 'text/html': blob });
        await navigator.clipboard.write([item]);
        return { ok: true, method: 'clipboard-api', size: size };
      } catch (e1) {
        console.warn('[copy] ClipboardItem 失败，改用 execCommand', e1);
      }
    }

    // 2) 兼容：隐藏可编辑节点 + execCommand（file:// 更可靠）
    var host = document.createElement('div');
    host.setAttribute('contenteditable', 'true');
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:fixed;left:-99999px;top:0;opacity:0;pointer-events:none;';
    host.innerHTML = html;
    document.body.appendChild(host);

    var ok = false;
    try {
      var range = document.createRange();
      range.selectNodeContents(host);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      ok = document.execCommand('copy');
    } catch (e2) {
      console.warn('[copy] execCommand 失败', e2);
      ok = false;
    } finally {
      document.body.removeChild(host);
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    }
    return { ok: ok, method: 'execCommand', size: size };
  }

  /**
   * Shared detect logic embedded into Console snippets.
   * Must run on mp.weixin.qq.com. Does NOT rely on HttpOnly cookies.
   */
  function detectCoreLines(prefix) {
    var p = prefix || '';
    return [
      p + '  function readCookie(name){',
      p + '    var m = document.cookie.match(new RegExp("(?:^|;\\\\s*)"+name+"=([^;]+)"));',
      p + '    return m ? decodeURIComponent(m[1]) : "";',
      p + '  }',
      p + '  function detectAccount(){',
      p + '    var host = location.hostname;',
      p + '    var href = location.href;',
      p + '    var title = document.title || "";',
      p + '    var onMp = /(^|\\.)weixin\\.qq\\.com$/.test(host) || host === "mp.weixin.qq.com";',
      p + '    var isLoginUrl = /loginpage|login\\?|\\/cgi-bin\\/loginpage|scanlogin|login_form/i.test(href) || /登录|扫码/.test(title);',
      p + '    var nick = "";',
      p + '    var sels = [',
      p + '      ".weui-desktop-account__nickname",',
      p + '      ".public-account-info__nickname",',
      p + '      ".weui-desktop-account__nickname__inner",',
      p + '      "#js_name",',
      p + '      ".weui-desktop-account__title",',
      p + '      ".title-wrap .title",',
      p + '      "[class*=account] [class*=name]",',
      p + '      "[class*=nickname]"',
      p + '    ];',
      p + '    for (var i=0;i<sels.length;i++){',
      p + '      var el = document.querySelector(sels[i]);',
      p + '      if (el && el.textContent && el.textContent.trim()){ nick = el.textContent.trim().slice(0,40); break; }',
      p + '    }',
      p + '    // UI signals that appear after login (not cookie-based)',
      p + '    var uiHits = [];',
      p + '    var uiSels = [',
      p + '      ".weui-desktop-header",',
      p + '      "#js_leftBar",',
      p + '      "#js_frame_container",',
      p + '      ".weui-desktop-account",',
      p + '      "[class*=mass-send]",',
      p + '      ".new-creation__menu",',
      p + '      "#__menu_item",',
      p + '      ".weui-desktop-account__nickname"',
      p + '    ];',
      p + '    uiSels.forEach(function(s){ if (document.querySelector(s)) uiHits.push(s); });',
      p + '    var bodyText = (document.body && document.body.innerText || "").slice(0, 4000);',
      p + '    var hasMpChrome = /公众号|图文消息|新建图文|内容与互动|首页|素材管理|用户管理/.test(bodyText);',
      p + '    var cookieNames = document.cookie.split(";").map(function(c){ return c.split("=")[0].trim(); }).filter(Boolean);',
      p + '    var cookieHints = cookieNames.filter(function(n){',
      p + '      return /slave|bizuin|token|uin|session|wxuin|rand_info|slave_bizuin|data_bizuin|slave_user/i.test(n);',
      p + '    });',
      p + '    var bizuin = readCookie("data_bizuin") || readCookie("slave_bizuin") || readCookie("bizuin");',
      p + '    var wechatId = readCookie("slave_user") || readCookie("slave_sid");',
      p + '    var score = 0;',
      p + '    if (onMp) score += 1;',
      p + '    if (!isLoginUrl) score += 1;',
      p + '    if (nick) score += 2;',
      p + '    if (uiHits.length) score += 2;',
      p + '    if (hasMpChrome) score += 1;',
      p + '    if (cookieHints.length) score += 1;',
      p + '    if (bizuin || wechatId) score += 1;',
      p + '    // token is often HttpOnly — absence is NOT a logout signal',
      p + '    var loggedIn = onMp && !isLoginUrl && (score >= 4);',
      p + '    return {',
      p + '      loggedIn: loggedIn,',
      p + '      score: score,',
      p + '      reason: !onMp ? "当前页面不是 mp.weixin.qq.com（请在公众号后台标签页的 Console 运行）"',
      p + '        : isLoginUrl ? "当前在登录页，请先完成登录" ',
      p + '        : loggedIn ? "检测到后台界面/账号相关信号"',
      p + '        : "信号不足：可能未登录，或页面结构已变",',
      p + '      nickname: nick,',
      p + '      wechatId: wechatId,',
      p + '      bizuin: bizuin,',
      p + '      // token 多为 HttpOnly，JS 读不到属正常',
      p + '      tokenReadable: !!readCookie("token"),',
      p + '      uiHits: uiHits,',
      p + '      hasMpChrome: hasMpChrome,',
      p + '      cookieHints: cookieHints,',
      p + '      allCookieNames: cookieNames,',
      p + '      host: host,',
      p + '      url: href.split("?")[0],',
      p + '      pageTitle: title',
      p + '    };',
      p + '  }'
    ].join('\n');
  }

  /**
   * Cookie / DOM probe for the currently logged-in Official Account.
   * Only works on mp.weixin.qq.com (Console), not from file:// pages.
   */
  function buildDetectAccountSnippet() {
    return [
      '(function(){',
      detectCoreLines(''),
      '  var info = detectAccount();',
      '  console.log("%c[公众号账号检测]", "color:#07c160;font-weight:bold");',
      '  console.log(JSON.stringify(info, null, 2));',
      '  var msg;',
      '  if (!info.loggedIn){',
      '    msg = "未确认登录态\\n" + info.reason + "\\n\\n请这样操作：\\n1) 先打开并登录 mp.weixin.qq.com\\n2) 停留在后台首页或图文编辑页\\n3) 在【该标签页】按 F12 → Console\\n4) 粘贴本代码运行（不要贴在本地工具页）\\n\\n详情见 Console";',
      '  } else {',
      '    msg = "检测到登录态\\n" + info.reason + "\\n昵称: " + (info.nickname || "(DOM 未读到)") + "\\nID: " + (info.wechatId || info.bizuin || "(Cookie 受 HttpOnly 限制)") + "\\n信号分: " + info.score + "\\n详情见 Console";',
      '  }',
      '  alert(msg);',
      '})();'
    ].join('\n');
  }

  /**
   * Generate a browser-console snippet for the open article editor.
   * Fills 标题 / 作者 / 正文 using new WeChat editor placeholders.
   */
  function buildInjectSnippet(wechatHtml, title, author) {
    var payloadHtml = JSON.stringify(wechatHtml || '');
    var payloadTitle = JSON.stringify(title || '');
    var payloadAuthor = JSON.stringify(author || '');
    return [
      '(function(){',
      '  var html = ' + payloadHtml + ';',
      '  var metaTitle = ' + payloadTitle + ';',
      '  var metaAuthor = ' + payloadAuthor + ';',
      '',
      '  function fire(el) {',
      '    ["input","change","blur","keyup"].forEach(function(t){ el.dispatchEvent(new Event(t,{bubbles:true})); });',
      '  }',
      '  function setVal(el, val) {',
      '    if (!el || !val) return false;',
      '    try { el.focus(); } catch(e){}',
      '    if ("value" in el && el.tagName !== "BUTTON" && el.tagName !== "DIV" && el.tagName !== "SECTION") {',
      '      el.value = val;',
      '    } else if (el.isContentEditable || el.getAttribute("contenteditable") === "true") {',
      '      el.innerText = val;',
      '    } else {',
      '      try { el.value = val; } catch(e) { el.innerText = val; }',
      '    }',
      '    fire(el);',
      '    return true;',
      '  }',
      '  function findByPlaceholder(words) {',
      '    var all = document.querySelectorAll("input, textarea, [contenteditable=true], [contenteditable=]");',
      '    for (var i=0;i<all.length;i++) {',
      '      var el = all[i];',
      '      var ph = el.getAttribute("placeholder") || el.getAttribute("data-placeholder") || el.getAttribute("data-tip") || el.getAttribute("aria-label") || "";',
      '      var txt = (el.innerText || el.value || "").trim();',
      '      for (var j=0;j<words.length;j++) {',
      '        if (ph.indexOf(words[j]) !== -1 || txt === words[j]) return el;',
      '      }',
      '    }',
      '    return null;',
      '  }',
      '  var titleEl = findByPlaceholder(["标题","请在这里输入标题"]) || document.querySelector("#title, .title_input, [class*=title] [contenteditable], [class*=title] input");',
      '  var authorEl = findByPlaceholder(["作者","请输入作者"]) || document.querySelector("#js_author, [class*=author] input, [class*=author] [contenteditable]");',
      '  var bodyEl = findByPlaceholder(["从这里开始写正文","正文","开始写"]);',
      '  if (!bodyEl) {',
      '    var eds = document.querySelectorAll("[contenteditable=true]");',
      '    var best=null, bestArea=0;',
      '    eds.forEach(function(ed){',
      '      if (ed===titleEl || ed===authorEl) return;',
      '      var r = ed.getBoundingClientRect();',
      '      var area = r.width*r.height;',
      '      if (area>bestArea){ bestArea=area; best=ed; }',
      '    });',
      '    if (best && bestArea>20000) bodyEl = best;',
      '  }',
      '',
      '  var tOk=false, aOk=false, bOk=false;',
      '  if (metaTitle) tOk = setVal(titleEl, metaTitle);',
      '  if (metaAuthor) aOk = setVal(authorEl, metaAuthor);',
      '  if (bodyEl) {',
      '    if (bodyEl.tagName === "IFRAME") {',
      '      var doc = bodyEl.contentDocument;',
      '      if (doc && doc.body) { doc.body.innerHTML = html; fire(doc.body); bOk=true; }',
      '    } else {',
      '      bodyEl.innerHTML = html;',
      '      fire(bodyEl);',
      '      bOk=true;',
      '    }',
      '  }',
      '  var diag = {title:tOk, author:aOk, body:bOk, titleEl:!!titleEl, authorEl:!!authorEl, bodyEl:!!bodyEl};',
      '  console.log("%c[公众号文章注入]", "color:#07c160;font-weight:bold", diag);',
      '  if (bOk) {',
      '    alert("文章注入完成\\n标题: " + (tOk ? "已填" : (metaTitle? "失败":"未填")) + "\\n作者: " + (aOk ? "已填" : (metaAuthor? "失败":"未填")) + "\\n正文: 已写入\\n请预览后保存为草稿/发表");',
      '  } else {',
      '    alert("未找到正文编辑区。请确认当前就是「文章编辑页」（有标题/作者/正文）。\\n诊断: " + JSON.stringify(diag));',
      '  }',
      '})();'
    ].join('\n');
  }

  /** Snippet: only try to open new article editor with current token */
  function buildOpenNewArticleSnippet() {
    return [
      '(function(){',
      '  function getToken(){',
      '    var m = location.search.match(/(?:^|[&?])token=([0-9]+)/);',
      '    if (m) return m[1];',
      '    m = document.cookie.match(/(?:^|;\\s*)token=([0-9]+)/);',
      '    if (m) return m[1];',
      '    try {',
      '      if (window.cgiData && window.cgiData.token) return String(window.cgiData.token);',
      '    } catch(e){}',
      '    return "";',
      '  }',
      '  var token = getToken();',
      '  console.log("[打开新建图文] token=", token || "(未读到，token 可能是 HttpOnly)", " url=", location.href);',
      '  if (!token){',
      '    alert("未能从当前页读到 token。\\n请先进入任意公众号后台页面（URL 上常带 token= 数字），\\n或手动点击：左侧菜单 → 内容与互动 → 图文消息 → 新的创作");',
      '    return;',
      '  }',
      '  var url = "https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&isMul=1&isNew=1&token=" + token + "&lang=zh_CN";',
      '  var go = confirm("将打开新建图文编辑页：\\n" + url + "\\n\\n确定打开？");',
      '  if (go) location.href = url;',
      '})();'
    ].join('\n');
  }

  /**
   * Download converted HTML as a file (backup / manual paste source).
   */
  function downloadHtml(html, filename) {
    var blob = new Blob(['<!DOCTYPE html><html><head><meta charset="utf-8"><title>WeChat HTML</title></head><body>' + html + '</body></html>'], {
      type: 'text/html;charset=utf-8'
    });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename || 'wechat-article.html';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    }, 1000);
  }

  return {
    copyRichHtml: copyRichHtml,
    buildInjectSnippet: buildInjectSnippet,
    buildDetectAccountSnippet: buildDetectAccountSnippet,
    buildOpenNewArticleSnippet: buildOpenNewArticleSnippet,
    downloadHtml: downloadHtml
  };
})();
