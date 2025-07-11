# 🚀 Claudia 发布指南

## 📦 发布新版本

### 快速发布（推荐）

使用提供的发布脚本：

```bash
# 发布新版本 (例如 0.1.1)
./scripts/release.sh 0.1.1
```

脚本会自动：
1. ✅ 更新 `package.json` 版本号
2. ✅ 更新 `src-tauri/tauri.conf.json` 版本号  
3. ✅ 更新 `src-tauri/Cargo.toml` 版本号
4. ✅ 创建 Git commit
5. ✅ 创建 Git tag (`v0.1.1`)
6. ✅ 推送到远程仓库
7. ✅ 触发 GitHub Actions 自动构建

### 手动发布

如果需要更精细的控制：

```bash
# 1. 更新版本号
npm version 0.1.1 --no-git-tag-version

# 2. 更新 Tauri 配置文件
sed -i 's/"version": ".*"/"version": "0.1.1"/' src-tauri/tauri.conf.json
sed -i 's/version = ".*"/version = "0.1.1"/' src-tauri/Cargo.toml

# 3. 提交更改
git add .
git commit -m "chore: bump version to v0.1.1"

# 4. 创建和推送标签
git tag v0.1.1
git push origin main
git push origin v0.1.1
```

## 🏗️ 构建流程

### GitHub Actions 自动构建

推送标签后，GitHub Actions 将：

1. **多平台构建**:
   - 🍎 macOS (Intel + Apple Silicon)
   - 🪟 Windows (x64)
   - 🐧 Linux (x64)

2. **生成安装包**:
   - macOS: `.dmg` + `.app`
   - Windows: `.msi` + `.exe`
   - Linux: `.deb` + `.rpm` + `.AppImage`

3. **创建 GitHub Release**:
   - 自动生成发布说明
   - 上传所有安装包
   - 支持中英文描述

### 查看构建状态

```bash
# 查看 GitHub Actions 构建状态
# https://github.com/YOUR_USERNAME/claudia/actions

# 查看发布页面
# https://github.com/YOUR_USERNAME/claudia/releases
```

## 📁 发布产物

每个发布版本包含：

### macOS
- `Claudia_X.X.X_aarch64.dmg` - Apple Silicon 优化版本
- `Claudia_X.X.X_x64.dmg` - Intel Mac 版本
- `Claudia.app.tar.gz` - 应用包归档

### Windows  
- `Claudia_X.X.X_x64_en-US.msi` - Windows 安装包（推荐）
- `Claudia_X.X.X_x64-setup.exe` - NSIS 安装程序

### Linux
- `claudia_X.X.X_amd64.deb` - Debian/Ubuntu 包
- `claudia-X.X.X-1.x86_64.rpm` - Red Hat/Fedora 包  
- `claudia_X.X.X_amd64.AppImage` - 通用 Linux 应用（推荐）

## ✅ 发布检查清单

发布新版本前：

- [ ] 完成所有功能开发和测试
- [ ] 更新 CHANGELOG.md（如果有）
- [ ] 本地测试构建: `bun run tauri build`
- [ ] 确认所有测试通过
- [ ] 检查国际化文件完整性
- [ ] 验证 Claude Code CLI 兼容性

发布后：

- [ ] 验证 GitHub Actions 构建成功
- [ ] 测试下载的安装包
- [ ] 验证应用在各平台正常运行
- [ ] 更新文档中的下载链接
- [ ] 通知用户新版本发布

## 🐛 故障排除

### 构建失败

1. **检查 GitHub Actions 日志**:
   ```
   https://github.com/YOUR_USERNAME/claudia/actions
   ```

2. **常见问题**:
   - Rust 编译错误 → 检查 `src-tauri/Cargo.toml` 依赖
   - TypeScript 错误 → 运行 `bunx tsc --noEmit`
   - Claude Code 二进制缺失 → 检查 `scripts/fetch-and-build.js`

3. **重新触发构建**:
   ```bash
   # 删除并重新创建标签
   git tag -d v0.1.1
   git push origin :refs/tags/v0.1.1
   git tag v0.1.1
   git push origin v0.1.1
   ```

### 发布问题

1. **Release 创建失败**:
   - 检查 `GITHUB_TOKEN` 权限
   - 确认仓库设置允许 Actions 创建 Release

2. **安装包缺失**:
   - 检查构建日志中的错误
   - 验证 `src-tauri/tauri.conf.json` 配置

## 📚 相关文档

- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - 完整构建指南
- [GitHub Actions 工作流](./.github/workflows/build-and-release.yml)
- [Tauri 配置](./src-tauri/tauri.conf.json)

## 🆘 获取帮助

遇到问题？

1. 查看 [BUILD_GUIDE.md](./BUILD_GUIDE.md) 故障排除部分
2. 检查 [GitHub Issues](https://github.com/YOUR_USERNAME/claudia/issues)
3. 查看 [Tauri 官方文档](https://tauri.app/v1/guides/building/)