(function () {
    // 扩展的名称，需要和 manifest.json 中的 name 一致
    const extensionName = "自定义主题美化";

    // 获取扩展的根路径
    const extensionFolderPath = `extensions/${extensionName}/`;

    // 异步加载函数
    async function loadExtension() {
        // 确保 SillyTavern 的核心功能已加载
        await SillyTavern.getContext().getApi().waitForUi();

        // 加载扩展的 CSS 样式
        jQuery.get(`${extensionFolderPath}style.css`, function (data) {
            $('<style id="theme-editor-style"></style>').html(data).appendTo('head');
        });

        // 加载并执行扩展的主脚本
        jQuery.getScript(`${extensionFolderPath}script.js`);

        console.log("自定义主题美化已加载。");
    }

    // 运行加载函数
    loadExtension();
})();
