(function () {
    // 将 panel 变量定义在外面，方便后续函数访问
    let panel;

    /**
     * 使一个HTML元素可以被拖动的函数
     * @param {HTMLElement} element - 需要被拖动的元素
     * @param {HTMLElement} handle - 鼠标需要按住的拖动区域 (通常是面板头部)
     */
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标按下时的初始位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 当鼠标松开时，停止拖动
            document.onmouseup = closeDragElement;
            // 当鼠标移动时，调用拖动函数
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算鼠标移动的距离
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // 鼠标松开，清除事件监听
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 主逻辑：等待SillyTavern页面加载完成后执行
    $(document).ready(function () {
        // --- 1. 创建并添加扩展按钮 ---
        const menuButton = $('<div id="theme-editor-button" class="menu_button"><i class="fa-solid fa-palette"></i> 主题编辑器</div>');
        $('#extensionsMenu').append(menuButton);

        // --- 2. 创建面板的HTML结构 ---
        const panelHTML = `
            <div id="theme-editor-panel">
                <div id="theme-editor-panel-header">
                    <span>可视化主题编辑器</span>
                    <i id="theme-editor-close-button" class="fa-solid fa-times"></i>
                </div>
                <div id="theme-editor-content">
                    <!-- 面板的所有功能和控件将放在这里 -->
                    <p>面板功能开发中...</p>
                    <p>您可以长按顶部区域拖动此面板。</p>
                    <p>也可以长按右下角缩放此面板。</p>
                </div>
            </div>
        `;

        // --- 3. 将面板添加到页面中 ---
        // 我们将其添加到 #chat 元素中，使其能覆盖在聊天界面上
        $('#chat').append(panelHTML);
        panel = $('#theme-editor-panel'); // 获取面板的jQuery对象，方便后续操作

        // --- 4. 实现面板的显示/隐藏逻辑 ---
        menuButton.on('click', function () {
            panel.fadeToggle(); // 点击菜单按钮时，淡入/淡出面板
        });
        
        $('#theme-editor-close-button').on('click', function() {
            panel.fadeOut(); // 点击面板上的关闭按钮时，淡出面板
        });

        // --- 5. 启用面板的拖动功能 ---
        // 需要将jQuery对象转换为原生DOM对象 (panel[0])
        makeDraggable(panel[0], document.getElementById('theme-editor-panel-header'));

        console.log("主题编辑器扩展加载成功！面板已创建。");
    });
})();
