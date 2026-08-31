# @all3cn/dsh-better-sidebar-n23

一个服务化的侧边栏框架 + 一套开箱即用的 DSH 完整工作台。本包是开源插件
[dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)（MIT）的社区
fork，在 `@all3cn` 作用域下独立发版；上游致谢见 [UPSTREAM.md](./UPSTREAM.md)。

[English](./README_EN.md) | 中文

## 功能一览

- **文件工作台**：资源管理器（懒加载目录树、软链接按目标类型展示）+ CodeMirror
  编辑器；图片 / Markdown / HTML / PDF / Office 内联预览
- **真实终端**：xterm.js + node-pty 真实 shell，断线重连回放；可选为模型注入
  `terminal_*` 工具
- **Git 面板**：真 diff + VSCode 式 diff tab、历史、右键暂存 / 提交 / 还原
- **内嵌浏览器**：多开网页 tab，后退 / 前进 / 刷新；内容运行在沙箱 iframe
- **后台任务页**：subagent 拓扑 + 后台任务（退出码 / 实时输出 / 强制终止）
- **双工作区**：右侧栏 + 底部面板，拖 Tab 拆分 / 合并分栏（可跨面板）
- **外壳重构**：全宽 48px 顶栏 + VSCode 式活动栏（activity rail）+ 全局控制区，
  对话与工作台并存的 IDE 布局
- **服务化 API**：通过 `ctx.betterSidebar` 开放给所有插件——
  `registerTab` / `registerFileViewer` 注册侧边栏页面与文件预览器，内置 tab 与
  第三方插件走同一套注册接口，能力完全对等
- **会话隔离**：布局 / Tab / 面板按会话持久化；多语言（zh / en）跟随 DSH 语言

## 兼容性

针对 DSH（DeepSeek Harness）`0.1.1-rc.2` 验证；peer 依赖声明为
`@deepseek-ai/* >= 0.1.0-rc.6 < 0.2.0`。要求 Node.js >= 20。

## 安装

前置：已装好 DSH（`dsh web` 可正常运行）。

```sh
dsh plugin --profile web add @all3cn/dsh-better-sidebar-n23
```

包内声明了 `dsh.bundle.patch`（[cordis.patch.yml](./cordis.patch.yml)），CLI 的
bundle 协调会自动把它加入 profile 的 bundle 栈，无需手动改 profile 文件。若
profile 中残留旧的 `dsh-better-sidebar`（上游或本地 fork）手动挂载行，请先移除
以免双挂载。卸载：`dsh plugin --profile web remove @all3cn/dsh-better-sidebar-n23`。

也可用包内一键脚本（处理 pnpm 11 构建许可与 minimumReleaseAge 放行）：

```sh
bash scripts/install.sh            # macOS / Linux / Git Bash
powershell -File scripts/install.ps1   # Windows
```

## 其他插件接入

```ts
// 任一 DSH 插件的 client 半区
ctx.betterSidebar.registerTab({ id: "my-tab", title: "My Tab", render: ... });
ctx.betterSidebar.registerFileViewer({ pattern: "**/*.xyz", render: ... });
```

## 版本记录

### 0.1.0（fork 首版）

- 基于 upstream `dsh-better-sidebar@0.12.3`，在 `@all3cn` 作用域下独立发版
- 面板拖拽不再逐帧写 CSS 变量，中央对话只在落点提交时重排一次
- 完整工作台：Explorer / 编辑器 / 预览 / 终端 / Git / 浏览器 / 任务，侧栏 +
  底部面板可拆分
- 外壳重构：全宽 48px 顶栏、活动栏、全局控制区
- 兼容新 DSH 内核的模块系统加载（懒加载 chunk 修复），在 `0.1.1-rc.2` 验证

## 发布与打包

- npm 发布流程见 [docs/RELEASE.md](./docs/RELEASE.md)（tag `v*` 触发
  Trusted Publishing + provenance）
- 免构建的注册表打包（manifest + npm 风格 tarball 审计）：
  `npm run package:registry -- --dry-run`
- 本仓库直接跟踪已构建的 `lib/`；`src/` 与 `lib/` 手工保持同步（见
  [UPSTREAM.md](./UPSTREAM.md)）

## 许可

[MIT](./LICENSE)。fork 自 omdsh-dev/DSH-better-sidebar（MIT），与 DeepSeek 及
上游作者无隶属关系。
