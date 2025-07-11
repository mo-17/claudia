#!/bin/bash

# Claudia Release Script
# 用于创建新版本发布的脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 帮助信息
show_help() {
    echo "Claudia Release Script"
    echo ""
    echo "Usage: $0 [版本号]"
    echo ""
    echo "示例:"
    echo "  $0 0.1.1    # 发布版本 v0.1.1"
    echo "  $0 1.0.0    # 发布版本 v1.0.0"
    echo ""
    echo "此脚本将:"
    echo "  1. 更新 package.json 中的版本号"
    echo "  2. 更新 src-tauri/tauri.conf.json 中的版本号"
    echo "  3. 更新 src-tauri/Cargo.toml 中的版本号"
    echo "  4. 创建 git commit"
    echo "  5. 创建 git tag"
    echo "  6. 推送到远程仓库，触发 GitHub Actions 构建"
}

# 检查参数
if [ $# -eq 0 ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

VERSION=$1

# 验证版本号格式
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}❌ 错误: 版本号格式无效${NC}"
    echo "版本号必须是 X.Y.Z 格式 (例如: 1.0.0)"
    exit 1
fi

echo -e "${BLUE}🚀 准备发布 Claudia v$VERSION${NC}"

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ 错误: 当前目录不是 git 仓库${NC}"
    exit 1
fi

# 检查工作目录是否干净
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ 错误: 工作目录有未提交的更改${NC}"
    echo "请先提交或暂存所有更改"
    exit 1
fi

# 检查是否在主分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo -e "${YELLOW}⚠️  警告: 当前不在主分支 (当前分支: $CURRENT_BRANCH)${NC}"
    read -p "是否继续? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "发布已取消"
        exit 1
    fi
fi

# 检查标签是否已存在
if git tag -l | grep -q "^v$VERSION$"; then
    echo -e "${RED}❌ 错误: 标签 v$VERSION 已存在${NC}"
    exit 1
fi

echo -e "${YELLOW}📝 更新版本号...${NC}"

# 更新 package.json
if [ -f "package.json" ]; then
    sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json
    echo "✅ 已更新 package.json"
else
    echo -e "${RED}❌ 找不到 package.json${NC}"
    exit 1
fi

# 更新 src-tauri/tauri.conf.json
if [ -f "src-tauri/tauri.conf.json" ]; then
    sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" src-tauri/tauri.conf.json
    echo "✅ 已更新 src-tauri/tauri.conf.json"
else
    echo -e "${RED}❌ 找不到 src-tauri/tauri.conf.json${NC}"
    exit 1
fi

# 更新 src-tauri/Cargo.toml
if [ -f "src-tauri/Cargo.toml" ]; then
    sed -i '' "s/version = \".*\"/version = \"$VERSION\"/" src-tauri/Cargo.toml
    echo "✅ 已更新 src-tauri/Cargo.toml"
else
    echo -e "${RED}❌ 找不到 src-tauri/Cargo.toml${NC}"
    exit 1
fi

# 显示更改
echo -e "${YELLOW}📋 版本更新摘要:${NC}"
git diff --name-only

echo ""
echo -e "${YELLOW}🔍 确认更改:${NC}"
git diff

echo ""
read -p "确认创建版本 v$VERSION 的发布? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "发布已取消"
    git checkout -- package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml
    exit 1
fi

echo -e "${YELLOW}📦 创建提交和标签...${NC}"

# 创建提交
git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml
git commit -m "chore: bump version to v$VERSION"

# 创建标签
git tag "v$VERSION" -m "Release v$VERSION"

echo -e "${GREEN}✅ 本地版本 v$VERSION 创建成功!${NC}"

# 推送到远程
echo -e "${YELLOW}🚀 推送到远程仓库...${NC}"
read -p "是否推送到远程仓库以触发构建? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "已跳过推送。你可以稍后手动推送:"
    echo "  git push origin $CURRENT_BRANCH"
    echo "  git push origin v$VERSION"
else
    git push origin "$CURRENT_BRANCH"
    git push origin "v$VERSION"
    
    echo ""
    echo -e "${GREEN}🎉 发布完成!${NC}"
    echo ""
    echo "GitHub Actions 正在构建发布包..."
    echo "查看构建状态: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
    echo ""
    echo "构建完成后，发布将在这里可用:"
    echo "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/releases/tag/v$VERSION"
fi

echo -e "${BLUE}🎯 下一步:${NC}"
echo "1. 等待 GitHub Actions 构建完成"
echo "2. 检查发布页面上的安装包"
echo "3. 测试下载的安装包"
echo "4. 如需要，可编辑发布说明"