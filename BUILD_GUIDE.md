# 📦 Claudia 应用打包指南

> 完整的 Tauri 2 桌面应用程序构建与打包指南

## 🏗️ 项目架构概述

- **前端**: React 18 + TypeScript + Vite 6
- **后端**: Rust + Tauri 2
- **UI框架**: Tailwind CSS v4 + shadcn/ui
- **国际化**: React i18next (支持英文/中文)
- **包管理器**: Bun
- **构建工具**: Tauri CLI + Vite

## 🚀 快速开始

### 开发环境运行
```bash
# 安装依赖
bun install

# 开发模式运行（带热重载）
bun run tauri dev
```

### 生产环境打包
```bash
# 一键完整打包
bun run tauri build
```

## 🔧 详细打包步骤

### 步骤 1: 环境准备

#### 系统要求
- **Node.js**: >= 18.x
- **Bun**: 最新版本
- **Rust**: >= 1.70.0
- **Tauri CLI**: v2.x

#### 安装必要工具
```bash
# 安装 Bun（如果未安装）
curl -fsSL https://bun.sh/install | bash

# 安装 Rust（如果未安装）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# 验证安装
bun --version
cargo --version
```

#### 平台特定要求

**macOS:**
```bash
# 安装 Xcode Command Line Tools
xcode-select --install

# 验证安装
xcode-select -p
```

**Windows:**
- 安装 [Microsoft Visual C++ Build Tools 2019+](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- 或安装 Visual Studio 2019+ with C++ workload

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget \
  libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

**Linux (Fedora):**
```bash
sudo dnf install webkit2gtk4.1-devel openssl-devel gtk3-devel \
  libappindicator-gtk3-devel librsvg2-devel
```

### 步骤 2: 项目依赖安装

```bash
# 克隆项目（如果需要）
git clone <repository-url>
cd claudia

# 安装前端依赖
bun install

# 验证 Tauri CLI
bunx tauri --version
```

### 步骤 3: Claude Code 二进制文件准备

项目需要 Claude Code CLI 二进制文件才能正常运行：

```bash
# 自动获取当前平台的 Claude Code 二进制文件
bun run build:executables:current

# 或针对特定平台构建
bun run build:executables:linux    # Linux x86_64
bun run build:executables:macos    # macOS (Intel + Apple Silicon)
bun run build:executables:windows  # Windows x86_64

# 构建所有平台（如果有相应工具链）
bun run build:executables
```

### 步骤 4: 前端构建

```bash
# TypeScript 类型检查 + Vite 构建
bun run build

# 预览构建结果（可选）
bun run preview
```

### 步骤 5: Tauri 应用打包

```bash
# 打包桌面应用
bun run tauri build

# 显示详细构建信息
bun run tauri build --verbose

# 调试模式构建（包含调试信息）
bun run tauri build --debug
```

## 📁 构建输出

构建完成后，应用程序将位于 `src-tauri/target/release/bundle/` 目录下：

### macOS 输出
```
src-tauri/target/release/bundle/
├── dmg/                           # .dmg 安装包
│   └── Claudia_0.1.0_x64.dmg
├── macos/                         # .app 应用包
│   └── Claudia.app
└── updater/                       # 自动更新包
    └── Claudia.app.tar.gz
```

### Windows 输出
```
src-tauri/target/release/bundle/
├── msi/                           # .msi 安装包
│   └── Claudia_0.1.0_x64_en-US.msi
├── nsis/                          # .exe 安装程序
│   └── Claudia_0.1.0_x64-setup.exe
└── updater/                       # 自动更新包
```

### Linux 输出
```
src-tauri/target/release/bundle/
├── deb/                           # Debian/Ubuntu 包
│   └── claudia_0.1.0_amd64.deb
├── rpm/                           # Red Hat/Fedora 包
│   └── claudia-0.1.0-1.x86_64.rpm
├── appimage/                      # AppImage 格式
│   └── claudia_0.1.0_amd64.AppImage
└── updater/                       # 自动更新包
```

## ⚙️ 高级配置

### 自定义打包配置

编辑 `src-tauri/tauri.conf.json` 来自定义打包设置：

```json
{
  "productName": "Claudia",
  "version": "0.1.0",
  "identifier": "claudia.asterisk.so",
  "bundle": {
    "active": true,
    "targets": "all",                // 或指定: ["dmg", "msi", "deb"]
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/icon.icns",
      "icons/icon.png"
    ],
    "externalBin": [
      "binaries/claude-code"          // 捆绑的 Claude Code 二进制文件
    ],
    "resources": [],                 // 额外资源文件
    "copyright": "Copyright © 2024",
    "category": "DeveloperTool",
    "shortDescription": "GUI Toolkit for Claude Code",
    "longDescription": "A powerful desktop application that provides a beautiful GUI for managing Claude Code sessions, creating custom agents, and tracking usage."
  }
}
```

### 特定平台打包

```bash
# 仅打包当前平台
bun run tauri build --target current

# 交叉编译到其他平台（需要相应工具链）
bun run tauri build --target x86_64-pc-windows-msvc      # Windows 64-bit
bun run tauri build --target i686-pc-windows-msvc        # Windows 32-bit
bun run tauri build --target x86_64-apple-darwin         # macOS Intel
bun run tauri build --target aarch64-apple-darwin        # macOS Apple Silicon
bun run tauri build --target x86_64-unknown-linux-gnu    # Linux 64-bit
bun run tauri build --target aarch64-unknown-linux-gnu   # Linux ARM64
```

### 环境变量配置

在构建前设置环境变量来自定义构建行为：

```bash
# 启用详细日志
export RUST_LOG=debug

# 设置并行编译任务数
export CARGO_BUILD_JOBS=8

# 使用 sccache 加速编译（需要先安装）
export RUSTC_WRAPPER=sccache

# 然后执行构建
bun run tauri build
```

## 🔒 代码签名和公证

### macOS 代码签名

为了在 macOS 上分发应用，需要进行代码签名：

```bash
# 设置签名相关环境变量
export APPLE_CERTIFICATE="Developer ID Application: Your Name (TEAM_ID)"
export APPLE_CERTIFICATE_PASSWORD="your-keychain-password"
export APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name (TEAM_ID)"

# 可选：设置公证相关变量
export APPLE_ID="your-apple-id@example.com"
export APPLE_PASSWORD="app-specific-password"
export APPLE_TEAM_ID="your-team-id"

# 构建并自动签名
bun run tauri build
```

**设置步骤：**
1. 从 Apple Developer Portal 下载开发者证书
2. 将证书安装到 Keychain Access
3. 生成应用特定密码（App-Specific Password）
4. 设置上述环境变量

### Windows 代码签名

```bash
# 设置 Windows 签名相关环境变量
export TAURI_SIGNING_CERTIFICATE="path/to/certificate.p12"
export TAURI_SIGNING_CERTIFICATE_PASSWORD="certificate-password"

# 构建并自动签名
bun run tauri build
```

## 🚀 发布工作流

### 1. 版本管理

在发布前更新版本号：

```bash
# 更新 package.json
sed -i 's/"version": ".*"/"version": "0.2.0"/' package.json

# 更新 Tauri 配置
sed -i 's/"version": ".*"/"version": "0.2.0"/' src-tauri/tauri.conf.json

# 更新 Cargo.toml
sed -i 's/version = ".*"/version = "0.2.0"/' src-tauri/Cargo.toml
```

### 2. 完整发布构建

```bash
# 清理之前的构建
bun run tauri clean
rm -rf node_modules dist

# 重新安装依赖
bun install

# 获取最新的 Claude Code 二进制文件
bun run build:executables

# 构建前端
bun run build

# 打包应用
bun run tauri build --verbose
```

### 3. 质量检查

```bash
# TypeScript 类型检查
bunx tsc --noEmit

# Rust 代码检查
cd src-tauri
cargo check
cargo clippy
cargo test
cd ..
```

### 4. 测试安装包

**macOS:**
```bash
# 测试 DMG 安装
open src-tauri/target/release/bundle/dmg/Claudia_0.1.0_x64.dmg

# 验证代码签名
codesign -dv --verbose=4 src-tauri/target/release/bundle/macos/Claudia.app
```

**Windows:**
```bash
# 测试安装程序
./src-tauri/target/release/bundle/nsis/Claudia_0.1.0_x64-setup.exe

# 验证签名（如果已签名）
signtool verify /pa /v src-tauri/target/release/bundle/nsis/Claudia_0.1.0_x64-setup.exe
```

**Linux:**
```bash
# 测试 DEB 包安装
sudo dpkg -i src-tauri/target/release/bundle/deb/claudia_0.1.0_amd64.deb

# 测试 AppImage
chmod +x src-tauri/target/release/bundle/appimage/claudia_0.1.0_amd64.AppImage
./src-tauri/target/release/bundle/appimage/claudia_0.1.0_amd64.AppImage
```

## 🐛 故障排除

### 常见构建错误

**1. Rust 编译错误**
```bash
# 更新 Rust 工具链
rustup update stable

# 清理 Rust 缓存
cargo clean

# 重新构建
bun run tauri build
```

**2. 前端构建错误**
```bash
# 清理 Node.js 缓存
rm -rf node_modules bun.lock dist

# 重新安装依赖
bun install

# 检查 TypeScript 错误
bunx tsc --noEmit
```

**3. Tauri 配置错误**
```bash
# 验证 Tauri 配置
bunx tauri config

# 检查配置语法
bunx tauri dev --help
```

**4. 缺少系统依赖**
```bash
# macOS: 安装 Xcode Command Line Tools
xcode-select --install

# Linux: 安装 WebKit 和开发工具
sudo apt install libwebkit2gtk-4.1-dev build-essential

# Windows: 确保安装了 Visual C++ Build Tools
```

### 性能优化建议

**1. 编译加速**
```bash
# 安装并配置 sccache
cargo install sccache
export RUSTC_WRAPPER=sccache

# 增加并行编译任务
export CARGO_BUILD_JOBS=8

# 使用 LLD 链接器（Linux/Windows）
export RUSTFLAGS="-C link-arg=-fuse-ld=lld"
```

**2. 构建缓存**
```bash
# 保持 target 目录进行增量编译
# 避免频繁 cargo clean

# 使用 Docker 进行一致的构建环境
docker build -t claudia-builder .
docker run --rm -v $(pwd):/app claudia-builder bun run tauri build
```

## 📊 CI/CD 集成

### GitHub Actions 示例

创建 `.github/workflows/build.yml`：

```yaml
name: Build and Release

on:
  push:
    tags: ['v*']
  pull_request:

jobs:
  build:
    strategy:
      matrix:
        platform: [macos-latest, ubuntu-latest, windows-latest]
    
    runs-on: ${{ matrix.platform }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        
      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
        
      - name: Install dependencies (Ubuntu)
        if: matrix.platform == 'ubuntu-latest'
        run: |
          sudo apt update
          sudo apt install libwebkit2gtk-4.1-dev build-essential libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
          
      - name: Install dependencies
        run: bun install
        
      - name: Build Claude Code binaries
        run: bun run build:executables:current
        
      - name: Build app
        run: bun run tauri build
        
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: app-${{ matrix.platform }}
          path: src-tauri/target/release/bundle/
```

## 🎯 部署建议

### 1. 分发策略
- **GitHub Releases**: 适合开源项目
- **自建下载站**: 提供更好的用户体验
- **应用商店**: macOS App Store, Microsoft Store

### 2. 自动更新配置
```json
// tauri.conf.json
{
  "updater": {
    "active": true,
    "endpoints": [
      "https://your-domain.com/api/releases/{{target}}/{{current_version}}"
    ],
    "dialog": true,
    "pubkey": "your-public-key"
  }
}
```

### 3. 错误报告和分析
- 集成 Sentry 或类似服务
- 添加用户反馈收集
- 监控应用性能和崩溃

### 4. 用户文档
- 创建安装指南
- 提供故障排除文档
- 准备更新说明

---

## 📝 注意事项

1. **首次构建**可能需要较长时间，因为需要下载和编译所有依赖
2. **交叉编译**需要额外的工具链配置
3. **代码签名**对于公开分发是必需的，特别是 macOS 和 Windows
4. **测试**在目标平台上验证安装包的功能完整性
5. **文档**保持构建文档与项目同步更新

---

**构建愉快！** 🚀

如果遇到问题，请查看 [Tauri 官方文档](https://tauri.app/v1/guides/building/) 或提交 Issue。