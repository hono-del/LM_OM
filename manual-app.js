// アプリケーションメイン
(function() {
  'use strict';

  const state = {
    currentTopic: null,
    searchMode: 'tree',
    sidebarOpen: false
  };

  // DOM要素
  const elements = {
    treeRoot: document.getElementById('tree-root'),
    topicFrame: document.getElementById('topic-frame'),
    currentTitle: document.getElementById('current-title'),
    treeSearch: document.getElementById('tree-search'),
    treeSearchClear: document.getElementById('tree-search-clear'),
    searchResults: document.getElementById('search-results'),
    searchModeTree: document.getElementById('search-mode-tree'),
    searchModeFulltext: document.getElementById('search-mode-fulltext'),
    mobileTreeToggle: document.getElementById('mobile-tree-toggle'),
    sidebarBackdrop: document.getElementById('sidebar-backdrop'),
    sidebar: document.querySelector('.sidebar'),
    openTopic: document.getElementById('open-topic'),
    printTopic: document.getElementById('print-topic'),
    downloadPdf: document.getElementById('download-pdf'),
    imageModal: document.getElementById('image-modal'),
    imageModalClose: document.getElementById('image-modal-close'),
    imageModalPreview: document.getElementById('image-modal-preview')
  };

  // ツリーの構築
  function buildTree(nodes, container) {
    nodes.forEach(node => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'tree-node';
      
      const headerEl = document.createElement('div');
      headerEl.className = 'tree-node-header';
      headerEl.dataset.id = node.id;
      
      if (node.children && node.children.length > 0) {
        const toggleEl = document.createElement('button');
        toggleEl.className = 'tree-node-toggle collapsed';
        toggleEl.type = 'button';
        toggleEl.setAttribute('aria-label', 'Toggle');
        toggleEl.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleNode(nodeEl, toggleEl);
        });
        headerEl.appendChild(toggleEl);
      } else {
        const spacerEl = document.createElement('span');
        spacerEl.style.width = '16px';
        spacerEl.style.marginRight = '8px';
        headerEl.appendChild(spacerEl);
      }
      
      const labelEl = document.createElement('span');
      labelEl.className = 'tree-node-label';
      labelEl.textContent = node.label;
      headerEl.appendChild(labelEl);
      
      headerEl.addEventListener('click', () => {
        loadTopic(node.id, node.label);
      });
      
      nodeEl.appendChild(headerEl);
      
      if (node.children && node.children.length > 0) {
        const childrenEl = document.createElement('div');
        childrenEl.className = 'tree-node-children';
        childrenEl.hidden = true;
        buildTree(node.children, childrenEl);
        nodeEl.appendChild(childrenEl);
      }
      
      container.appendChild(nodeEl);
    });
  }

  // ノードの開閉
  function toggleNode(nodeEl, toggleEl) {
    const childrenEl = nodeEl.querySelector('.tree-node-children');
    if (childrenEl) {
      const isExpanded = !childrenEl.hidden;
      childrenEl.hidden = isExpanded;
      toggleEl.className = isExpanded ? 'tree-node-toggle collapsed' : 'tree-node-toggle expanded';
    }
  }

  // トピックの読み込み
  function loadTopic(id, label) {
    state.currentTopic = id;
    elements.currentTitle.textContent = label;
    
    // アクティブ状態の更新
    document.querySelectorAll('.tree-node-header').forEach(el => {
      el.classList.toggle('active', el.dataset.id === id);
    });
    
    // トピックコンテンツの読み込み
    elements.topicFrame.srcdoc = window.manualData.topics[id] || '<p>コンテンツが見つかりません。</p>';
    
    // モバイルでサイドバーを閉じる
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  }

  // 検索
  function performSearch(query) {
    if (!query.trim()) {
      elements.searchResults.hidden = true;
      elements.treeRoot.hidden = false;
      return;
    }
    
    if (state.searchMode === 'tree') {
      filterTree(query.toLowerCase());
    } else {
      performFullTextSearch(query.toLowerCase());
    }
  }

  // ツリーフィルタ
  function filterTree(query) {
    const nodes = elements.treeRoot.querySelectorAll('.tree-node-header');
    let hasResults = false;
    
    nodes.forEach(node => {
      const label = node.querySelector('.tree-node-label').textContent.toLowerCase();
      const matches = label.includes(query);
      node.parentElement.style.display = matches ? '' : 'none';
      if (matches) hasResults = true;
    });
    
    if (!hasResults) {
      elements.treeRoot.innerHTML = '<p style="padding: 16px; color: var(--text-muted);">検索結果がありません。</p>';
    }
  }

  // 全文検索
  function performFullTextSearch(query) {
    elements.treeRoot.hidden = true;
    elements.searchResults.hidden = false;
    elements.searchResults.innerHTML = '';
    
    const results = [];
    
    Object.keys(window.manualData.topics).forEach(id => {
      const content = window.manualData.topics[id];
      const text = content.replace(/<[^>]*>/g, '').toLowerCase();
      
      if (text.includes(query)) {
        const index = text.indexOf(query);
        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + query.length + 50);
        const context = '...' + text.substring(start, end) + '...';
        
        const treeNode = findNodeById(window.manualData.tree, id);
        if (treeNode) {
          results.push({
            id: id,
            label: treeNode.label,
            context: context
          });
        }
      }
    });
    
    if (results.length === 0) {
      elements.searchResults.innerHTML = '<p style="color: var(--text-muted);">検索結果がありません。</p>';
    } else {
      results.forEach(result => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
          <div class="search-result-title">${result.label}</div>
          <div class="search-result-context">${result.context}</div>
        `;
        item.addEventListener('click', () => {
          loadTopic(result.id, result.label);
        });
        elements.searchResults.appendChild(item);
      });
    }
  }

  // ツリーからノードを検索
  function findNodeById(nodes, id) {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  // サイドバーの開閉
  function openSidebar() {
    state.sidebarOpen = true;
    elements.sidebar.classList.add('open');
    elements.sidebarBackdrop.hidden = false;
  }

  function closeSidebar() {
    state.sidebarOpen = false;
    elements.sidebar.classList.remove('open');
    elements.sidebarBackdrop.hidden = true;
  }

  // イベントリスナー
  elements.treeSearch.addEventListener('input', (e) => {
    const query = e.target.value;
    elements.treeSearchClear.hidden = !query;
    performSearch(query);
  });

  elements.treeSearchClear.addEventListener('click', () => {
    elements.treeSearch.value = '';
    elements.treeSearchClear.hidden = true;
    performSearch('');
  });

  elements.searchModeTree.addEventListener('click', () => {
    state.searchMode = 'tree';
    elements.searchModeTree.classList.add('search-mode-button-active');
    elements.searchModeFulltext.classList.remove('search-mode-button-active');
    elements.treeRoot.hidden = false;
    elements.searchResults.hidden = true;
    performSearch(elements.treeSearch.value);
  });

  elements.searchModeFulltext.addEventListener('click', () => {
    state.searchMode = 'fulltext';
    elements.searchModeFulltext.classList.add('search-mode-button-active');
    elements.searchModeTree.classList.remove('search-mode-button-active');
    performSearch(elements.treeSearch.value);
  });

  elements.mobileTreeToggle.addEventListener('click', () => {
    if (state.sidebarOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  elements.sidebarBackdrop.addEventListener('click', closeSidebar);

  elements.openTopic.addEventListener('click', () => {
    if (state.currentTopic) {
      const content = window.manualData.topics[state.currentTopic];
      const newWindow = window.open('', '_blank');
      newWindow.document.write(content);
      newWindow.document.close();
    }
  });

  elements.printTopic.addEventListener('click', () => {
    if (state.currentTopic) {
      elements.topicFrame.contentWindow.print();
    }
  });

  function collectTopicsInOrder(nodes, result) {
    nodes.forEach(node => {
      result.push({ id: node.id, label: node.label });
      if (node.children) {
        collectTopicsInOrder(node.children, result);
      }
    });
    return result;
  }

  function escapeHtml(text) {
    const el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML;
  }

  function resolveManualAssetPaths(html) {
    return html.replace(/src="([^"]+)"/g, (match, src) => {
      if (/^(https?:|data:|blob:)/i.test(src)) {
        return match;
      }
      try {
        return `src="${new URL(src, window.location.href).href}"`;
      } catch (e) {
        return match;
      }
    });
  }

  function getPdfExportStyles() {
    return `
      .pdf-export-root {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
        color: #0f172a;
        line-height: 1.6;
        background: #ffffff;
        padding: 16px;
      }
      .pdf-section {
        margin-bottom: 32px;
      }
      .pdf-section-title {
        font-size: 22px;
        margin: 0 0 16px;
        color: #2d2d2d;
        border-bottom: 2px solid #4a4a4a;
        padding-bottom: 8px;
      }
      .pdf-page-break {
        page-break-before: always;
        break-before: page;
        height: 0;
      }
      .topic-content {
        max-width: 100%;
        margin: 0;
        padding: 0;
      }
      .topic-content h1 { font-size: 28px; margin-bottom: 20px; color: #2d2d2d; border-bottom: 3px solid #4a4a4a; padding-bottom: 10px; }
      .topic-content h2 { font-size: 22px; margin: 28px 0 14px; color: #4a4a4a; border-left: 4px solid #4a4a4a; padding-left: 10px; }
      .topic-content h3 { font-size: 18px; margin: 20px 0 10px; color: #0f172a; }
      .topic-content p { margin-bottom: 14px; line-height: 1.8; }
      .topic-content ul, .topic-content ol { margin-bottom: 14px; padding-left: 24px; }
      .topic-content li { margin-bottom: 6px; }
      .topic-content table { width: 100%; border-collapse: collapse; margin: 16px 0; }
      .topic-content th, .topic-content td { padding: 10px; border: 1px solid #e2e8f0; text-align: left; }
      .topic-content th { background: #f8fafc; font-weight: 600; }
      .topic-content img { max-width: 100%; height: auto; display: block; margin: 16px auto; }
      .topic-content .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px; margin: 16px 0; }
      .topic-content .caution { background: #fee2e2; border-left: 4px solid #ef4444; padding: 14px; margin: 16px 0; }
      .topic-content .note { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 14px; margin: 16px 0; }
    `;
  }

  function buildFullManualHtml() {
    const sections = collectTopicsInOrder(window.manualData.tree, []);
    const parts = [`<style>${getPdfExportStyles()}</style>`];

    sections.forEach((section, index) => {
      const content = window.manualData.topics[section.id];
      if (!content) return;
      if (index > 0) {
        parts.push('<div class="pdf-page-break"></div>');
      }
      parts.push(
        `<section class="pdf-section">` +
          `<h2 class="pdf-section-title">${escapeHtml(section.label)}</h2>` +
          resolveManualAssetPaths(content) +
        `</section>`
      );
    });

    return parts.join('');
  }

  function waitForImages(container) {
    const images = Array.from(container.querySelectorAll('img'));
    if (images.length === 0) {
      return Promise.resolve();
    }
    return Promise.all(images.map(img => new Promise(resolve => {
      if (img.complete) {
        resolve();
        return;
      }
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    })));
  }

  async function downloadManualPdf() {
    if (!window.manualData || typeof html2pdf === 'undefined') {
      alert('PDFの生成に必要なデータを読み込めませんでした。');
      return;
    }

    const button = elements.downloadPdf;
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'PDF生成中...';

    const container = document.createElement('div');
    container.className = 'pdf-export-root';
    container.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#fff;';
    container.innerHTML = buildFullManualHtml();
    document.body.appendChild(container);

    try {
      await waitForImages(container);
      await html2pdf().set({
        margin: [12, 12, 12, 12],
        filename: 'Lean3_取扱説明書.pdf',
        image: { type: 'jpeg', quality: 0.92 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], before: '.pdf-page-break' }
      }).from(container).save();
    } catch (error) {
      console.error(error);
      alert('PDFの生成に失敗しました。時間をおいて再度お試しください。');
    } finally {
      document.body.removeChild(container);
      button.disabled = false;
      button.textContent = originalLabel;
    }
  }

  elements.downloadPdf.addEventListener('click', downloadManualPdf);

  // 画像モーダル
  elements.imageModalClose.addEventListener('click', () => {
    elements.imageModal.hidden = true;
  });

  elements.imageModal.addEventListener('click', (e) => {
    if (e.target === elements.imageModal) {
      elements.imageModal.hidden = true;
    }
  });

  // トピックフレーム内の画像クリック処理
  elements.topicFrame.addEventListener('load', () => {
    const iframeDoc = elements.topicFrame.contentDocument;
    if (iframeDoc) {
      iframeDoc.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', () => {
          elements.imageModalPreview.src = img.src;
          elements.imageModal.hidden = false;
        });
      });
    }
  });

  // スプリッター
  let isResizing = false;
  const splitter = document.getElementById('splitter');
  
  splitter.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        document.documentElement.style.setProperty('--sidebar-width', newWidth + 'px');
      }
    }
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
    }
  });

  // ツリーからトピックIDでノードを検索
  function findTopicInTree(nodes, id) {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findTopicInTree(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  // 初期化
  function init() {
    if (window.manualData) {
      buildTree(window.manualData.tree, elements.treeRoot);

      // URLパラメータ ?topic=xxx で指定トピックを開く
      const topicId = new URLSearchParams(window.location.search).get('topic');
      if (topicId) {
        const topic = findTopicInTree(window.manualData.tree, topicId);
        if (topic) {
          loadTopic(topic.id, topic.label);
          return;
        }
      }

      if (window.manualData.tree.length > 0) {
        const firstTopic = window.manualData.tree[0];
        loadTopic(firstTopic.id, firstTopic.label);
      }
    }
  }

  // DOMContentLoaded後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
