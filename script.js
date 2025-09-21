(function () {
    let panel; // 将panel变量提升到外部，方便访问

    // 使面板可拖动的函数
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标光标的起始位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 每次移动鼠标时调用elementDrag函数
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算光标的新位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // 停止移动时，移除事件监听
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 主逻辑
    $(document).ready(function () {
        // --- 1. 创建扩展菜单中的按钮 ---
        const menuButton = $('<div id="theme-editor-button" class="menu_button"><i class="fa-solid fa-palette"></i> 自定义主题美化</div>');
        $('#extensionsMenu').append(menuButton);

        // --- 2. 创建面板 ---
        // 面板的HTML结构
        const panelHTML = `
            <div id="theme-editor-panel">
                <div id="theme-editor-panel-header">
                    <span>自定义主题美化</span>
                    <i id="theme-editor-close-button" class="fa-solid fa-times"></i>
                </div>
                <div id="theme-editor-content">
                    <!-- 面板内容将放在这里 -->
                    <p>欢迎使用自定义主题美化！</p>
                    <p>功能正在开发中...</p>
                </div>
            </div>
        `;

        // 将面板添加到 #chat 界面中，这样它才会显示
        $('#chat').append(panelHTML);
        panel = $('#theme-editor-panel'); // 获取面板的jQuery对象

        // --- 3. 为按钮和面板添加交互功能 ---
        // 点击菜单按钮，显示/隐藏面板
        menuButton.on('click', function () {
            panel.fadeToggle(); // 使用淡入淡出效果切换显示
        });
        
        // 点击面板上的关闭按钮，隐藏面板
        $('#theme-editor-close-button').on('click', function() {
            panel.fadeOut(); // 淡出效果
        });

        // --- 4. 让面板可以被拖动 ---
        // 注意：jQuery对象需要转为原生DOM对象来传递
        makeDraggable(panel[0], document.getElementById('theme-editor-panel-header'));

        console.log("【自定义主题美化】扩展加载成功！");
    });
})();
