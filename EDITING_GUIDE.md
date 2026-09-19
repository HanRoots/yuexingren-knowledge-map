# 阅星人学识地图编辑说明

## 编辑内容

1. 打开学识地图并输入访问密码。
2. 点击筛选栏中的“编辑内容”。
3. 找到目标书目，点击“编辑此书”。
4. 修改书名、学识目标、价值观、能力目标或书籍类型。
5. 点击“保存修改”。

修改会先保存在当前浏览器中。刷新页面后仍会保留，但不会自动同步到其他设备。

## 发布到云端

发布功能会更新 GitHub 仓库中的 `data.js`，然后由 GitHub Pages 自动部署。

首次使用前，需要在 GitHub 创建一个 Fine-grained personal access token：

1. 打开 [GitHub Fine-grained tokens 设置页面](https://github.com/settings/personal-access-tokens/new)。
2. Repository access 选择“Only select repositories”。
3. 仅选择 `HanRoots/yuexingren-knowledge-map`。
4. Repository permissions 中将 Contents 设置为“Read and write”。
5. 其他权限保持默认，不需要 Pages 或 Workflows 写入权限。
6. 生成令牌并妥善保存。GitHub 通常只显示一次完整令牌。

回到学识地图，点击“发布到云端”，粘贴令牌并确认发布。令牌只用于当次请求，不会保存在网页代码、本地存储或导出的 JSON 文件中。

## 备份与恢复

- “导出修改”：下载当前浏览器中所有本地修改的 JSON 备份。
- “恢复线上内容”：清除当前浏览器中的本地修改，重新读取线上版本。
- 发布后 GitHub Pages 通常需要几分钟完成部署。在部署完成前，不要立即恢复线上内容。

## 安全说明

- 不要使用 GitHub 登录密码，发布时只能使用细粒度令牌。
- 令牌只授权一个仓库，并只授予 Contents 读写权限。
- 如果令牌意外泄露，应立即在 GitHub 设置中撤销并重新生成。
