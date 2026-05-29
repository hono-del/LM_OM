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
    elements.topicFrame.srcdoc = window.siteData.topics[id] || '<p>コンテンツが見つかりません。</p>';
    
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
    
    Object.keys(window.siteData.topics).forEach(id => {
      const content = window.siteData.topics[id];
      const text = content.replace(/<[^>]*>/g, '').toLowerCase();
      
      if (text.includes(query)) {
        const index = text.indexOf(query);
        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + query.length + 50);
        const context = '...' + text.substring(start, end) + '...';
        
        const treeNode = findNodeById(window.siteData.tree, id);
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
      const content = window.siteData.topics[state.currentTopic];
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

  // 初期化
  function init() {
    if (window.siteData) {
      buildTree(window.siteData.tree, elements.treeRoot);
      if (window.siteData.tree.length > 0) {
        const firstTopic = window.siteData.tree[0];
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
