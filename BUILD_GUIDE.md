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

## 📊 CI/CD 集成与 GitHub Releases

### ✅ 已配置的 GitHub Actions 工作流

项目已包含完整的 GitHub Actions 配置 (`.github/workflows/build-and-release.yml`)，支持：

#### 🚀 **自动化构建流程**
- **多平台构建**: macOS、Windows、Linux 同时构建
- **缓存优化**: Rust 缓存加速构建
- **依赖管理**: 自动安装系统依赖
- **Claude Code 集成**: 自动构建嵌入式 CLI 二进制文件

#### 📦 **支持的发布格式**
- **macOS**: `.dmg` (安装镜像) + `.app` (应用包)
- **Windows**: `.msi` (安装包) + `.exe` (NSIS 安装程序)
- **Linux**: `.deb` (Debian/Ubuntu) + `.rpm` (Red Hat/Fedora) + `.AppImage` (通用)

#### 🎯 **触发条件**
- **标签推送**: `v*` 格式标签自动触发发布构建
- **Pull Request**: 验证构建但不发布
- **手动触发**: 支持 workflow_dispatch

### 🚀 **发布新版本**

#### 方法 1: 使用发布脚本（推荐）
```bash
# 使用提供的发布脚本
./scripts/release.sh 0.1.1

# 脚本将自动：
# 1. 更新所有配置文件中的版本号
# 2. 创建 Git commit 和 tag
# 3. 推送到远程仓库
# 4. 触发 GitHub Actions 构建
```

#### 方法 2: 手动发布
```bash
# 1. 更新版本号
npm version 0.1.1 --no-git-tag-version

# 2. 手动更新 Tauri 配置
sed -i 's/"version": ".*"/"version": "0.1.1"/' src-tauri/tauri.conf.json
sed -i 's/version = ".*"/version = "0.1.1"/' src-tauri/Cargo.toml

# 3. 提交更改
git add .
git commit -m "chore: bump version to v0.1.1"

# 4. 创建标签
git tag v0.1.1

# 5. 推送（触发构建）
git push origin main
git push origin v0.1.1
```

### 📋 **GitHub Actions 工作流详情**

```yaml
# 已包含在 .github/workflows/build-and-release.yml
name: Build and Release

on:
  push:
    tags: ['v*']          # 标签推送触发发布
  pull_request:           # PR 触发测试构建
    branches: [main]
  workflow_dispatch:      # 手动触发

jobs:
  build:                  # 多平台构建任务
    strategy:
      fail-fast: false   # 不因单平台失败而停止
      matrix:
        platform: [macos-latest, ubuntu-latest, windows-latest]
    
    steps:
      - Checkout 代码
      - 设置 Bun 和 Rust 环境
      - 缓存 Rust 依赖
      - 安装系统依赖 (Linux)
      - 构建 Claude Code 二进制文件
      - 构建 Tauri 应用
      - 上传构建产物

  release:                # 发布任务（仅标签推送时）
    needs: build
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v')
    
    steps:
      - 下载所有构建产物
      - 创建 GitHub Release
      - 上传安装包到 Release
```

## 🎯 GitHub Releases 分发策略

### ✅ **已配置的自动发布流程**

#### 📦 **发布包格式和下载**
每次发布都会自动创建包含以下安装包的 GitHub Release：

**macOS 用户：**
- `Claudia_X.X.X_aarch64.dmg` - Apple Silicon (M1/M2) 推荐
- `Claudia_X.X.X_x64.dmg` - Intel Mac 推荐
- `Claudia.app.tar.gz` - 应用包归档（高级用户）

**Windows 用户：**
- `Claudia_X.X.X_x64_en-US.msi` - Windows 安装包（推荐）
- `Claudia_X.X.X_x64-setup.exe` - NSIS 安装程序

**Linux 用户：**
- `claudia_X.X.X_amd64.deb` - Debian/Ubuntu 系统
- `claudia-X.X.X-1.x86_64.rpm` - Red Hat/Fedora 系统
- `claudia_X.X.X_amd64.AppImage` - 通用 Linux（推荐）

#### 🚀 **发布流程**
1. **开发完成** → 本地测试构建
2. **版本标记** → 使用 `./scripts/release.sh X.X.X`
3. **自动构建** → GitHub Actions 多平台构建
4. **自动发布** → 创建 GitHub Release
5. **用户下载** → 从 Releases 页面下载对应平台安装包

#### 📊 **发布页面功能**
- **多语言说明**: 中英文发布说明
- **系统要求**: 明确的兼容性信息
- **安装指南**: 每个平台的安装说明
- **更新日志**: 自动生成的变更摘要
- **下载统计**: GitHub 提供的下载数据

### 🔧 **用户安装体验**

#### macOS 安装
```bash
# 下载 DMG 文件后
1. 双击 .dmg 文件
2. 拖拽 Claudia.app 到 Applications 文件夹
3. 首次运行时需要在系统偏好设置中允许运行

# 或使用 Homebrew Cask（如果发布到 brew）
brew install --cask claudia
```

#### Windows 安装
```bash
# MSI 安装包（推荐）
1. 双击 .msi 文件
2. 跟随安装向导
3. 从开始菜单启动 Claudia

# NSIS 安装程序
1. 双击 .exe 文件
2. 选择安装位置
3. 完成安装
```

#### Linux 安装
```bash
# Debian/Ubuntu
sudo dpkg -i claudia_X.X.X_amd64.deb
sudo apt install -f  # 解决依赖问题

# Red Hat/Fedora
sudo rpm -i claudia-X.X.X-1.x86_64.rpm

# AppImage（通用，推荐）
chmod +x claudia_X.X.X_amd64.AppImage
./claudia_X.X.X_amd64.AppImage
```

### 📈 **发布后续操作**

#### 发布检查清单
- [ ] 验证所有平台的安装包都已生成
- [ ] 测试下载链接可用性
- [ ] 验证安装包完整性和签名
- [ ] 更新项目 README 中的下载链接
- [ ] 在社交媒体/社区宣布新版本
- [ ] 收集用户反馈和问题报告

#### 版本管理最佳实践
- **语义版本控制**: 遵循 SemVer (X.Y.Z)
- **预发布版本**: 使用 `v1.0.0-beta.1` 格式
- **热修复版本**: 及时发布 patch 版本
- **发布频率**: 建议每月一个稳定版本

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