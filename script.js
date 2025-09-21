// 使用IIFE（立即调用函数表达式）来避免污染全局作用域
(async function () {
    // 等待SillyTavern的API和UI准备就绪
    await SillyTavern.getContext().getApi().waitForUi();
    const context = SillyTavern.getContext();

    // ---------------------------------
    // 1. 创建和添加扩展按钮到菜单
    // ---------------------------------
    const menuButton = document.createElement('div');
    menuButton.classList.add('menu_button');
    menuButton.id = 'theme-editor-menu-button';
    menuButton.innerHTML = `<i class="fa-solid fa-palette"></i> 自定义主题美化`;

    // 将按钮添加到 #extensionsMenu
    document.querySelector('#extensionsMenu').append(menuButton);


    // ---------------------------------
    // 2. 创建扩展面板HTML
    // ---------------------------------
    const panelHtml = `
        <div id="theme-editor-panel">
            <div class="panel-header">
                <span class="title">自定义主题美化</span>
                <span class="close-button fa-solid fa-times"></span>
            </div>
            <div class="panel-content">
                <p>这里是你的设置区域。</p>
                <p>所有对元素的修改将在这里进行。</p>
                <hr>
                <div>
                    <h4>主题管理</h4>
                    <button id="theme-editor-new-theme">新建主题</button>
                    <select id="theme-editor-switch-theme"></select>
                    <button id="theme-editor-save">保存设置</button>
                    <button id="theme-editor-export">导出为CSS文件</button>
                </div>
                <hr>
                <div>
                    <h4>示例：头像样式</h4>
                    <label for="avatar-border-radius">头像圆角 (%)</label>
                    <input type="range" id="avatar-border-radius" min="0" max="50" value="50">
                    
                    <label for="avatar-margin-top">上外边距 (px)</label>
                    <input type="number" id="avatar-margin-top" value="0">
                </div>
            </div>
        </div>
    `;

    // 将面板添加到页面中
    document.body.insertAdjacentHTML('beforeend', panelHtml);
    const panel = document.getElementById('theme-editor-panel');


    // ---------------------------------
    // 3. 实现面板的交互功能
    // ---------------------------------
    
    // 开关面板
    const closeButton = panel.querySelector('.close-button');
    menuButton.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    });
    closeButton.addEventListener('click', () => {
        panel.style.display = 'none';
    });

    // 拖动面板
    const header = panel.querySelector('.panel-header');
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        // 确保点击的不是关闭按钮
        if (e.target.classList.contains('close-button')) return;
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        panel.style.left = `${e.clientX - offsetX}px`;
        panel.style.top = `${e.clientY - offsetY}px`;
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // 注意：面板的缩放功能已通过 style.css 中的 `resize: both;` 实现，无需JS。

    // ---------------------------------
    // 4. 实时更新、保存和导出功能
    // ---------------------------------
    // 创建一个专用于我们主题的 <style> 标签
    const themeStyleTag = document.createElement('style');
    themeStyleTag.id = 'visual-theme-editor-styles';
    document.head.appendChild(themeStyleTag);
    
    // 存储当前设置的对象
    let currentSettings = {};

    // 当设置改变时，应用样式
    function applyStyles() {
        let cssString = '';
        
        // 示例：处理头像圆角
        if (currentSettings.avatarBorderRadius !== undefined) {
            cssString += `.avatar { border-radius: ${currentSettings.avatarBorderRadius}% !important; }\n`;
        }

        // 示例：处理头像上外边距
        if (currentSettings.avatarMarginTop !== undefined) {
             cssString += `.mes .avatar { margin-top: ${currentSettings.avatarMarginTop}px !important; }\n`;
        }
        
        // ... 在这里添加所有其他元素的CSS生成逻辑 ...

        themeStyleTag.textContent = cssString;
    }

    // 导出为CSS文件
    document.getElementById('theme-editor-export').addEventListener('click', () => {
        const cssContent = themeStyleTag.textContent;
        const blob = new Blob([cssContent], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-sillytavern-theme.css';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toastr.success('主题CSS文件已导出！');
    });

    // 为示例控件添加事件监听器
    const avatarBorderRadiusInput = document.getElementById('avatar-border-radius');
    const avatarMarginTopInput = document.getElementById('avatar-margin-top');

    avatarBorderRadiusInput.addEventListener('input', () => {
        currentSettings.avatarBorderRadius = avatarBorderRadiusInput.value;
        applyStyles();
    });
    
    avatarMarginTopInput.addEventListener('input', () => {
        currentSettings.avatarMarginTop = avatarMarginTopInput.value;
        applyStyles();
    });


    // ---------------------------------
    // 5. 主题管理（保存、加载）
    // SillyTavern 扩展有自己的设置存储区域，我们将用它来保存主题
    // ---------------------------------
    const settingsKey = 'visualThemeEditorThemes';

    // 保存设置到酒馆
    async function saveThemesToSillyTavern() {
        // 从 context.extensions.settings 中获取所有主题
        const allThemes = context.extensions.settings[settingsKey] || {};
        const currentThemeName = 'Default'; // 后面我们会实现多主题切换
        
        // 更新当前主题的设置
        allThemes[currentThemeName] = currentSettings;

        // 保存回去
        context.extensions.settings[settingsKey] = allThemes;
        await context.extensions.save();
        toastr.success(`主题 "${currentThemeName}" 已保存!`);
    }
    
    // 从酒馆加载设置
    function loadThemesFromSillyTavern() {
        const allThemes = context.extensions.settings[settingsKey] || {};
        const currentThemeName = 'Default'; // 同样，先用默认
        
        currentSettings = allThemes[currentThemeName] || {};

        // 更新面板上的输入框值
        avatarBorderRadiusInput.value = currentSettings.avatarBorderRadius || 50;
        avatarMarginTopInput.value = currentSettings.avatarMarginTop || 0;

        // 应用加载的样式
        applyStyles();
    }
    
    // 绑定保存按钮事件
    document.getElementById('theme-editor-save').addEventListener('click', saveThemesToSillyTavern);
    
    // 初始加载
    loadThemesFromSillyTavern();


    console.log("自定义主题美化初始化完成。");
})();
