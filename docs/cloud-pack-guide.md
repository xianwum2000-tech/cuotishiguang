# 错题拾光 — 云打包指南

本文档供 AI 助手和开发者参考，描述如何使用 HBuilderX CLI 进行 Android 云打包并发布到 GitHub Releases。

## 环境

| 项目 | 说明 |
|------|------|
| 项目路径 | `E:\data\考研\1\错题拾光\错题拾光` |
| HBuilderX 安装路径 | `E:\Software\HBuilderX` |
| HBuilderX CLI | `E:\Software\HBuilderX\cli.exe` |
| GitHub CLI | `gh`（需已登录） |
| GitHub 仓库 | `xianwum2000-tech/cuotishiguang` |
| 包名 | `com.cuotishiguang.app` |
| AppID | `__UNI__9F74044` |

## 关键文件

| 文件 | 作用 |
|------|------|
| `manifest.json` | 版本号 versionName / versionCode，包名 |
| `utils/version.js` | **应用内显示的版本号**（APP_VERSION.name/code），必须同步更新 |
| `release/update.json` | 更新配置，含版本号、apkUrl、changelog |
| `pack-config.json` | 云打包参数（项目路径、包名、证书类型），可用 --config 传入 |
| `unpackage/release/apk/` | 云打包完成后 APK 的存放目录 |

## 打包前置条件

1. **HBuilderX 必须正在运行**。CLI 通过已运行的 HBuilderX 实例通信，打包前确认 `HBuilderX.exe` 进程存在。
2. CLI 版本必须与运行的 HBuilderX 版本匹配。如果 CLI 报错「版本不匹配」，说明 CLI 路径不对，换成与运行中 HBuilderX 同目录的 cli.exe。
3. DCloud 账号需已登录（通过 HBuilderX GUI 登录）。

## 打包流程

### 1. 更新版本号

同时编辑三个文件，递增 `versionName` 和 `versionCode`：

1. `manifest.json` — 包含版本号和包名
2. `utils/version.js` — 应用内显示的版本号（`APP_VERSION.name` 和 `APP_VERSION.code`）
3. `release/update.json` — 更新配置，含版本号、`apkUrl`、`changelog`、`publishedAt`

```json
{
  "versionName": "1.4.1",
  "versionCode": 141,
  "packageName": "com.cuotishiguang.app",
  "apkUrl": "https://github.com/xianwum2000-tech/cuotishiguang/releases/download/v1.4.1/cuotishiguang-1.4.1.apk",
  "changelog": "更新内容...",
  "force": false,
  "publishedAt": "2026-05-10"
}
```

### 2. 执行云打包

使用云端证书（`--android.androidpacktype 3`）。公用证书（类型 1）已被 DCloud 禁用。

```bash
"E:/Software/HBuilderX/cli.exe" pack \
  --project "E:/data/考研/1/错题拾光/错题拾光" \
  --platform android \
  --android.androidpacktype 3 \
  --android.packagename com.cuotishiguang.app
```

也可以用 `--config` 传入配置文件：

```bash
"E:/Software/HBuilderX/cli.exe" pack \
  --config "E:/data/考研/1/错题拾光/错题拾光/pack-config.json" \
  --platform android
```

`pack-config.json` 内容：

```json
{
    "project": "E:\\data\\考研\\1\\错题拾光\\错题拾光",
    "android.packagename": "com.cuotishiguang.app",
    "android.androidpacktype": 3
}
```

### 3. 等待云打包完成

CLI 输出关键节点：

```
正在编译资源...           → 本地编译阶段
项目 '错题拾光' 编译成功    → 编译通过
压缩打包资源...           → 压缩上传
项目 '错题拾光' 打包成功    → 云端打包完成
下载地址: https://app.liuyingyong.cn/build/download/xxx
```

云端打包通常在 **1-3 分钟** 内完成。CLI 会持续输出打包状态直至完成。

注意：输出编码为 **GBK**，在 UTF-8 终端中会显示乱码。用以下方式可正确解码：

```bash
bash -c '"E:/Software/HBuilderX/cli.exe" pack ... 2>&1' > output.txt
# 然后用 GBK 编码打开 output.txt
```

或者用 Python 捕获并解码：

```python
import subprocess
result = subprocess.run([...], capture_output=True)
print(result.stdout.decode('gbk'))
```

### 4. 下载 APK

云打包返回的下载地址是临时的（只能下载 5 次），需立即下载到本地：

```bash
curl -L -o cuotishiguang-1.4.1.apk "https://app.liuyingyong.cn/build/download/xxx"
```

### 5. 创建 GitHub Release

```bash
gh release create v1.4.1 \
  cuotishiguang-1.4.1.apk \
  release/update.json \
  --title "v1.4.1: 简短描述" \
  --notes "更新内容逐条说明"
```

## 证书类型说明

| 类型 | 参数值 | 状态 |
|------|--------|------|
| 自有证书 | 0 | 需自备 keystore |
| 公用证书 | 1 | **已被 DCloud 禁用** |
| DCloud 老版证书 | 2 | 不推荐 |
| 云端证书 | 3 | **推荐使用** |

## 版本号规则

- `versionCode` 必须递增，是整数。覆盖安装靠它判断新旧。
- `versionName` 是展示给用户的版本号，格式 `x.y.z`。
- 每次打包前必须同时更新 `manifest.json` 和 `release/update.json`。

## 常见问题

**Q: CLI 报错「当前运行的 cli 版本与正在运行的 HBuilderX 不匹配」**
A: 多个 HBuilderX 版本共存时 CLI 路径可能不对。确认当前运行中的 HBuilderX 路径，使用同一目录下的 cli.exe。

**Q: 云打包报错「Android 公用证书存在安全风险」**
A: 证书类型需改为云端证书（`--android.androidpacktype 3`），公用证书（类型 1）已被禁用。

**Q: 中文输出乱码**
A: CLI 输出是 GBK 编码，需在 GBK 终端中查看或用 Python `decode('gbk')` 解码。
