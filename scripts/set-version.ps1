param(
    [Parameter(Mandatory = $true)]
    [string]$VersionName,

    [Parameter(Mandatory = $true)]
    [int]$VersionCode
)

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$manifestPath = Join-Path $root 'manifest.json'
$versionPath = Join-Path $root 'utils/version.js'
$releasePath = Join-Path $root 'release/update.example.json'
$utf8 = [System.Text.UTF8Encoding]::new($false)

$manifest = [System.IO.File]::ReadAllText($manifestPath, $utf8)
$manifest = $manifest -replace '"versionName"\s*:\s*"[^"]+"', ('"versionName" : "' + $VersionName + '"')
$manifest = $manifest -replace '"versionCode"\s*:\s*"[^"]+"', ('"versionCode" : "' + $VersionCode + '"')
[System.IO.File]::WriteAllText($manifestPath, $manifest, $utf8)

$version = [System.IO.File]::ReadAllText($versionPath, $utf8)
$version = [regex]::Replace($version, "(?m)^(\s*name:\s*)'[^']+'", {
    param($match)
    $match.Groups[1].Value + "'" + $VersionName + "'"
})
$version = [regex]::Replace($version, '(?m)^(\s*code:\s*)\d+', {
    param($match)
    $match.Groups[1].Value + $VersionCode
})
[System.IO.File]::WriteAllText($versionPath, $version, $utf8)

$release = [System.IO.File]::ReadAllText($releasePath, $utf8)
$release = $release -replace '"versionName":\s*"[^"]+"', ('"versionName": "' + $VersionName + '"')
$release = $release -replace '"versionCode":\s*\d+', ('"versionCode": ' + $VersionCode)
$release = $release -replace '/v[^/]+/cuotishiguang-[^"]+\.apk', ('/v' + $VersionName + '/cuotishiguang-' + $VersionName + '.apk')
[System.IO.File]::WriteAllText($releasePath, $release, $utf8)

Write-Host "Version updated to $VersionName ($VersionCode)."
