# Claudia 代码库技术文档

## 项目概览

**项目名称**: Claudia - GUI Toolkit for Claude Code  
**描述**: 为 Claude Code 提供强大的桌面应用程序，具有美观的 GUI 界面，用于管理 Claude Code 会话、创建自定义 AI 代理、跟踪使用情况等功能。  
**当前版本**: 0.1.0  
**主要功能**: 作为 Claude Code 的命令中心，在命令行工具和可视化体验之间架起桥梁。

### 技术栈

**前端技术栈**:
- **React 18** + **TypeScript** - 现代化的用户界面框架
- **Vite 6** - 快速的构建工具和开发服务器
- **Tailwind CSS v4** - 实用优先的 CSS 框架
- **shadcn/ui** - 基于 Radix UI 的组件库
- **Framer Motion** - 流畅的动画和过渡效果
- **React Hook Form** + **Zod** - 表单处理和验证

**后端技术栈**:
- **Rust** - 高性能、内存安全的系统级编程语言
- **Tauri 2** - 安全的跨平台桌面应用框架
- **SQLite** (via rusqlite) - 轻量级嵌入式数据库
- **Tokio** - 异步运行时
- **Serde** - 数据序列化和反序列化

**开发工具**:
- **Bun** - 快速的 JavaScript 包管理器和运行时
- **TypeScript** - 类型安全的 JavaScript 超集
- **Cargo** - Rust 包管理器和构建工具

## 项目架构

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                      用户界面层 (React)                      │
├─────────────────────────────────────────────────────────────┤
│                    组件层 (UI Components)                   │
├─────────────────────────────────────────────────────────────┤
│                   API 客户端层 (Tauri API)                  │
├─────────────────────────────────────────────────────────────┤
│                 命令处理层 (Tauri Commands)                  │
├─────────────────────────────────────────────────────────────┤
│               业务逻辑层 (Rust Backend Services)             │
├─────────────────────────────────────────────────────────────┤
│                数据持久化层 (SQLite Database)                │
├─────────────────────────────────────────────────────────────┤
│            外部集成层 (Claude CLI, File System)             │
└─────────────────────────────────────────────────────────────┘
```

### 前端架构 (src/)

```
src/
├── components/          # React 组件
│   ├── ui/             # 基础 UI 组件 (shadcn/ui)
│   ├── AgentExecution.tsx    # Agent 执行界面
│   ├── ClaudeCodeSession.tsx # Claude Code 会话管理
│   ├── MCPManager.tsx        # MCP 服务器管理
│   ├── UsageDashboard.tsx    # 使用情况分析
│   └── ...
├── lib/                # 工具函数和 API 客户端
│   ├── api.ts          # Tauri API 封装
│   ├── utils.ts        # 通用工具函数
│   └── ...
├── assets/             # 静态资源
├── App.tsx             # 主应用组件
└── main.tsx           # 应用入口点
```

### 后端架构 (src-tauri/)

```
src-tauri/
├── src/
│   ├── commands/       # Tauri 命令处理器
│   │   ├── agents.rs   # Agent 管理命令
│   │   ├── claude.rs   # Claude Code 集成命令
│   │   ├── mcp.rs      # MCP 服务器命令
│   │   ├── storage.rs  # 数据库操作命令
│   │   └── usage.rs    # 使用统计命令
│   ├── checkpoint/     # 时间线检查点管理
│   ├── process/        # 进程管理
│   ├── lib.rs          # 库入口
│   └── main.rs         # 应用入口
├── Cargo.toml          # Rust 依赖配置
└── tauri.conf.json     # Tauri 应用配置
```

## 核心功能模块

### 1. 项目和会话管理

**功能描述**: 提供可视化的项目浏览器，管理 `~/.claude/projects/` 目录下的所有项目，支持会话历史记录和恢复。

**核心组件**:
- `ProjectList.tsx` - 项目列表显示
- `SessionList.tsx` - 会话列表管理
- `ClaudeCodeSession.tsx` - 交互式会话界面

**API 接口**:
```typescript
// 列出所有项目
async listProjects(): Promise<Project[]>

// 获取项目会话
async getProjectSessions(projectId: string): Promise<Session[]>

// 打开新会话
async openNewSession(path?: string): Promise<string>

// 加载会话历史
async loadSessionHistory(sessionId: string, projectId: string): Promise<any[]>
```

**使用示例**:
```typescript
// 加载所有项目
const projects = await api.listProjects();

// 获取特定项目的会话
const sessions = await api.getProjectSessions('project-id');

// 打开新的 Claude Code 会话
const sessionId = await api.openNewSession('/path/to/project');
```

### 2. CC Agents (自定义 AI 代理)

**功能描述**: 创建和管理专门用途的 AI 代理，支持自定义系统提示词、后台执行和执行历史跟踪。

**核心组件**:
- `CCAgents.tsx` - 代理管理主界面
- `CreateAgent.tsx` - 代理创建表单
- `AgentExecution.tsx` - 代理执行界面
- `AgentRunsList.tsx` - 执行历史列表

**数据模型**:
```typescript
interface Agent {
  id?: number;
  name: string;          // 代理名称
  icon: string;          // 图标标识符
  system_prompt: string; // 系统提示词
  default_task?: string; // 默认任务
  model: string;         // 使用的模型
  created_at: string;    // 创建时间
  updated_at: string;    // 更新时间
}

interface AgentRun {
  id?: number;
  agent_id: number;
  task: string;
  project_path: string;
  status: string;        // 'pending', 'running', 'completed', 'failed'
  session_id: string;
  pid?: number;
  created_at: string;
  completed_at?: string;
}
```

**API 接口**:
```typescript
// 代理管理
async createAgent(name: string, icon: string, system_prompt: string, 
                 default_task?: string, model?: string): Promise<Agent>
async updateAgent(id: number, ...): Promise<Agent>
async deleteAgent(id: number): Promise<void>
async listAgents(): Promise<Agent[]>

// 代理执行
async executeAgent(agentId: number, projectPath: string, 
                  task: string, model?: string): Promise<number>
async listAgentRuns(agentId?: number): Promise<AgentRunWithMetrics[]>
async killAgentSession(runId: number): Promise<boolean>
```

### 3. 使用情况分析仪表板

**功能描述**: 实时监控 Claude API 使用情况和成本，提供详细的令牌分析和可视化图表。

**核心组件**:
- `UsageDashboard.tsx` - 主仪表板界面
- 集成 Recharts 进行数据可视化

**数据模型**:
```typescript
interface UsageStats {
  total_cost: number;
  total_tokens: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cache_creation_tokens: number;
  total_cache_read_tokens: number;
  total_sessions: number;
  by_model: ModelUsage[];
  by_date: DailyUsage[];
  by_project: ProjectUsage[];
}

interface ModelUsage {
  model: string;
  total_cost: number;
  total_tokens: number;
  session_count: number;
}
```

**API 接口**:
```typescript
// 使用统计
async getUsageStats(): Promise<UsageStats>
async getUsageByDateRange(startDate: string, endDate: string): Promise<UsageStats>
async getUsageDetails(limit?: number): Promise<UsageEntry[]>
async getSessionStats(since?: string, until?: string, order?: "asc" | "desc"): Promise<ProjectUsage[]>
```

### 4. MCP 服务器管理

**功能描述**: 管理 Model Context Protocol 服务器，提供从中央 UI 进行服务器注册、配置和连接测试。

**核心组件**:
- `MCPManager.tsx` - 服务器管理主界面
- `MCPServerList.tsx` - 服务器列表
- `MCPAddServer.tsx` - 添加服务器表单

**数据模型**:
```typescript
interface MCPServer {
  name: string;
  transport: string;     // "stdio" 或 "sse"
  command?: string;      // stdio 传输的命令
  args: string[];        // 命令参数
  env: Record<string, string>; // 环境变量
  url?: string;          // SSE 传输的 URL
  scope: string;         // "local", "project", 或 "user"
  is_active: boolean;
  status: ServerStatus;
}
```

**API 接口**:
```typescript
// MCP 服务器管理
async mcpAdd(name: string, transport: string, command?: string, 
            args: string[], env: Record<string, string>, 
            url?: string, scope: string): Promise<AddServerResult>
async mcpList(): Promise<MCPServer[]>
async mcpRemove(name: string): Promise<string>
async mcpTestConnection(name: string): Promise<string>
async mcpAddFromClaudeDesktop(scope: string): Promise<ImportResult>
```

### 5. 时间线和检查点

**功能描述**: 会话版本控制和检查点创建，支持可视化时间线导航和即时恢复。

**核心组件**:
- `TimelineNavigator.tsx` - 时间线导航器
- `CheckpointSettings.tsx` - 检查点设置

**数据模型**:
```typescript
interface Checkpoint {
  id: string;
  sessionId: string;
  projectId: string;
  messageIndex: number;
  timestamp: string;
  description?: string;
  parentCheckpointId?: string;
  metadata: CheckpointMetadata;
}

interface SessionTimeline {
  sessionId: string;
  rootNode?: TimelineNode;
  currentCheckpointId?: string;
  autoCheckpointEnabled: boolean;
  checkpointStrategy: CheckpointStrategy;
  totalCheckpoints: number;
}
```

**API 接口**:
```typescript
// 检查点管理
async createCheckpoint(sessionId: string, projectId: string, 
                      projectPath: string, messageIndex?: number, 
                      description?: string): Promise<CheckpointResult>
async restoreCheckpoint(checkpointId: string, sessionId: string, 
                       projectId: string, projectPath: string): Promise<CheckpointResult>
async listCheckpoints(sessionId: string, projectId: string, 
                     projectPath: string): Promise<Checkpoint[]>
async forkFromCheckpoint(checkpointId: string, sessionId: string, 
                        projectId: string, projectPath: string, 
                        newSessionId: string, description?: string): Promise<CheckpointResult>
```

### 6. CLAUDE.md 管理

**功能描述**: 内置 Markdown 编辑器，实时预览，项目扫描器查找所有 CLAUDE.md 文件。

**核心组件**:
- `MarkdownEditor.tsx` - Markdown 编辑器主界面
- `ClaudeFileEditor.tsx` - 专门的 CLAUDE.md 文件编辑器
- 集成 `@uiw/react-md-editor` 进行编辑和预览

**API 接口**:
```typescript
// CLAUDE.md 文件管理
async findClaudeMdFiles(projectPath: string): Promise<ClaudeMdFile[]>
async readClaudeMdFile(filePath: string): Promise<string>
async saveClaudeMdFile(filePath: string, content: string): Promise<string>
async getSystemPrompt(): Promise<string>
async saveSystemPrompt(content: string): Promise<string>
```

## 安装和配置

### 环境要求

**系统要求**:
- **操作系统**: Windows 10/11, macOS 11+, 或 Linux (Ubuntu 20.04+)
- **内存**: 最小 4GB (推荐 8GB)
- **存储**: 至少 1GB 可用空间

**必需工具**:
1. **Rust** (1.70.0 或更高版本)
2. **Bun** (最新版本)
3. **Git**
4. **Claude Code CLI** - 需要在 PATH 中可用

### 平台特定依赖

**Linux (Ubuntu/Debian)**:
```bash
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  patchelf \
  build-essential \
  libssl-dev \
  libxdo-dev \
  libsoup-3.0-dev \
  libjavascriptcoregtk-4.1-dev
```

**macOS**:
```bash
# 安装 Xcode 命令行工具
xcode-select --install

# 可选：通过 Homebrew 安装额外依赖
brew install pkg-config
```

**Windows**:
- 安装 Microsoft C++ Build Tools
- 安装 WebView2 (Windows 11 通常预装)

### 安装步骤

1. **克隆仓库**:
```bash
git clone https://github.com/getAsterisk/claudia.git
cd claudia
```

2. **安装前端依赖**:
```bash
bun install
```

3. **开发模式启动**:
```bash
bun run tauri dev
```

4. **生产构建**:
```bash
bun run tauri build
```

## 使用指南

### 快速开始

1. **启动应用**: 安装后打开 Claudia 应用
2. **欢迎界面**: 选择 CC Agents 或 CC Projects
3. **首次设置**: Claudia 会自动检测您的 `~/.claude` 目录

### 基本用法

**管理项目**:
```
CC Projects → 选择项目 → 查看会话 → 恢复或开始新会话
```

**创建代理**:
```
CC Agents → 创建代理 → 配置 → 执行
```

**跟踪使用情况**:
```
菜单 → Usage Dashboard → 查看分析
```

### 高级用法

**时间线检查点**:
- 在会话的任意点创建检查点
- 使用可视化时间线导航历史
- 一键跳转到任何检查点
- 从现有检查点创建新分支

**MCP 服务器配置**:
- 手动添加服务器或通过 JSON 配置
- 从 Claude Desktop 配置导入
- 使用前测试连接

## 开发者文档

### 代码规范

**TypeScript 规范**:
- 启用严格模式
- 适当的类型声明
- 使用函数式组件和 hooks
- 遵循 ESLint 和 Prettier 配置

**React 组件规范**:
```typescript
// 组件示例
interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export function ExampleComponent({ title, onAction }: ComponentProps) {
  const [state, setState] = useState<string>('');
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{title}</h1>
      {/* 组件内容 */}
    </div>
  );
}
```

**Rust 代码规范**:
- 标准格式化 `cargo fmt`
- 遵循 Rust 官方风格指南
- 使用 `#[tauri::command]` 标注命令函数
- 适当的错误处理和结果类型

### 测试指南

**前端测试**:
- 使用 React Testing Library 进行组件测试
- Jest 进行单元测试
- 端到端测试使用 Tauri 的测试工具

**后端测试**:
```bash
cd src-tauri
cargo test
```

**运行完整测试套件**:
```bash
# 类型检查
bunx tsc --noEmit

# Rust 测试
cd src-tauri && cargo test

# 格式化检查
cd src-tauri && cargo fmt --check
```

### 构建和部署

**开发命令**:
```bash
# 开发服务器 (热重载)
bun run tauri dev

# 仅前端开发
bun run dev

# 类型检查
bunx tsc --noEmit

# 代码格式化
cd src-tauri && cargo fmt
```

**生产构建**:
```bash
# 构建应用
bun run tauri build

# 调试构建 (更快编译，更大二进制文件)
bun run tauri build --debug

# 不打包构建 (仅创建可执行文件)
bun run tauri build --no-bundle

# macOS 通用二进制 (Intel + Apple Silicon)
bun run tauri build --target universal-apple-darwin
```

**构建产物**:
构建过程会创建多个产物：
- **可执行文件**: 主 Claudia 应用程序
- **安装程序** (使用 `tauri build` 时):
  - `.deb` 包 (Linux)
  - `.AppImage` (Linux)
  - `.dmg` 安装程序 (macOS)
  - `.msi` 安装程序 (Windows)
  - `.exe` 安装程序 (Windows)

所有产物位于 `src-tauri/target/release/bundle/`。

## 性能考虑

### 前端性能优化

**虚拟滚动**: 对于长列表使用 `@tanstack/react-virtual`
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: any[] }) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} className="overflow-auto h-64">
      {virtualizer.getVirtualItems().map((virtualItem) => (
        <div key={virtualItem.index} className="absolute">
          {items[virtualItem.index]}
        </div>
      ))}
    </div>
  );
}
```

**懒加载**: 对大型组件实现代码分割
```typescript
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

**输出缓存**: 使用 `OutputCacheProvider` 缓存会话输出
```typescript
const { getCachedOutput, setCachedOutput } = useOutputCache();
```

### 后端性能优化

**异步操作**: 所有 I/O 操作使用 `async/await`
```rust
#[tauri::command]
async fn async_operation() -> Result<String, String> {
    tokio::time::sleep(Duration::from_millis(100)).await;
    Ok("完成".to_string())
}
```

**数据库连接池**: SQLite 连接通过 Mutex 保护
```rust
pub struct AgentDb(pub Mutex<Connection>);
```

**进程管理**: 独立进程执行确保性能隔离
```rust
// 进程注册表管理运行中的代理
let mut registry = process_registry.lock().await;
registry.register_process(run_id, process_info);
```

## 安全性

### 安全特性

1. **进程隔离**: 代理在独立进程中运行
2. **权限控制**: 每个代理可配置文件和网络访问权限
3. **本地存储**: 所有数据保存在本地机器上
4. **无遥测**: 不收集数据或跟踪
5. **开源透明**: 通过开源代码完全透明

### Tauri 安全配置

**文件系统权限** (`tauri.conf.json`):
```json
{
  "plugins": {
    "fs": {
      "scope": ["$HOME/**"],
      "allow": [
        "readFile", "writeFile", "readDir", 
        "copyFile", "createDir", "removeDir", 
        "removeFile", "renameFile", "exists"
      ]
    }
  }
}
```

**内容安全策略**:
```json
{
  "security": {
    "csp": "default-src 'self'; img-src 'self' asset: https://asset.localhost blob: data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; connect-src 'self' ipc: https://ipc.localhost"
  }
}
```

## 故障排除

### 常见问题

1. **"cargo not found" 错误**:
   - 确保 Rust 已安装且 `~/.cargo/bin` 在 PATH 中
   - 运行 `source ~/.cargo/env` 或重启终端

2. **Linux: "webkit2gtk not found" 错误**:
   - 安装上述列出的 webkit2gtk 开发包
   - 在较新的 Ubuntu 版本上，可能需要 `libwebkit2gtk-4.0-dev`

3. **Windows: "MSVC not found" 错误**:
   - 安装支持 C++ 的 Visual Studio Build Tools
   - 安装后重启终端

4. **"claude command not found" 错误**:
   - 确保 Claude Code CLI 已安装并在 PATH 中
   - 使用 `claude --version` 测试

5. **内存不足导致构建失败**:
   - 尝试减少并行作业数：`cargo build -j 2`
   - 关闭其他应用程序释放内存

### 构建验证

构建后，可以验证应用程序是否正常工作：

```bash
# 直接运行构建的可执行文件
# Linux/macOS
./src-tauri/target/release/claudia

# Windows
./src-tauri/target/release/claudia.exe
```

## 配置文件

### 重要配置文件

- **package.json**: 前端依赖和脚本
- **tauri.conf.json**: Tauri 配置和权限
- **Cargo.toml**: Rust 依赖和元数据
- **vite.config.ts**: Vite 构建配置
- **tsconfig.json**: TypeScript 配置

### 代码分割配置

Vite 配置中的手动分块优化：
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-*'],
          'editor-vendor': ['@uiw/react-md-editor'],
          'tauri': ['@tauri-apps/api', '@tauri-apps/plugin-*'],
          'utils': ['date-fns', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
});
```

## 许可证和贡献

**许可证**: AGPL License (见 LICENSE 文件)

**贡献领域**:
- 🐛 Bug 修复和改进
- ✨ 新功能和增强
- 📚 文档改进
- 🎨 UI/UX 增强
- 🧪 测试覆盖率
- 🌐 国际化

**贡献指南**: 请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细信息。

---

**制作者**: [Asterisk](https://asterisk.so/) 团队  
**技术支持**: [报告问题](https://github.com/getAsterisk/claudia/issues) | [请求功能](https://github.com/getAsterisk/claudia/issues)