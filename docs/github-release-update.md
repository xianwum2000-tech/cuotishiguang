# GitHub Releases 更新流程

## 固定规则

- Android 包名固定为 `com.cuotishiguang.app`。
- 每次打包必须继续使用同一个签名证书。
- `manifest.json` 的 `versionCode` 必须递增，`versionName` 只负责展示。
- 用户必须覆盖安装新版 APK，不能先卸载旧版。

满足以上规则时，`uni.setStorageSync` 中的错题数据和 `uni.saveFile` 保存的错题图片会保留。

## 第一次配置

1. 在 GitHub 创建仓库。
2. 打开 `utils/version.js`。
3. 把 `UPDATE_CONFIG.manifestUrl` 改成：

```text
https://github.com/你的用户名/你的仓库名/releases/latest/download/update.json
```

4. 重新打包 APK，并手动安装一次。之后 App 才拥有内置更新能力。

## 发布新版

1. 修改 `manifest.json` 和 `utils/version.js` 中的版本号。
2. 打包 APK，例如 `cuotishiguang-1.0.3.apk`。
3. 复制 `release/update.example.json` 为 `update.json`。
4. 修改 `update.json`：

```json
{
  "versionName": "1.0.3",
  "versionCode": 103,
  "packageName": "com.cuotishiguang.app",
  "apkUrl": "https://github.com/你的用户名/你的仓库名/releases/download/v1.0.3/cuotishiguang-1.0.3.apk",
  "changelog": "本次更新说明",
  "force": false,
  "publishedAt": "2026-05-04"
}
```

5. 在 GitHub Releases 新建 `v1.0.3`，上传 APK 和 `update.json`。
6. 手机 App 点击“我的 → 检查更新”，或下次打开 App 时自动检查更新。
