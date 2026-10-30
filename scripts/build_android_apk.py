import os
import sys
import shutil
import subprocess
from PIL import Image

ANDROID_SDK = r"C:\Users\biruk\AppData\Local\Android\Sdk"
BUILD_TOOLS = os.path.join(ANDROID_SDK, "build-tools", "34.0.0")
PLATFORM_JAR = os.path.join(ANDROID_SDK, "platforms", "android-34", "android.jar")
JAVA_HOME = r"C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"

AAPT2 = os.path.join(BUILD_TOOLS, "aapt2.exe")
D8 = os.path.join(BUILD_TOOLS, "d8.bat")
ZIPALIGN = os.path.join(BUILD_TOOLS, "zipalign.exe")
APKSIGNER = os.path.join(BUILD_TOOLS, "apksigner.bat")
JAVAC = os.path.join(JAVA_HOME, "bin", "javac.exe")
JARSIGNER = os.path.join(JAVA_HOME, "bin", "jarsigner.exe")
KEYTOOL = os.path.join(JAVA_HOME, "bin", "keytool.exe")

BUILD_DIR = os.path.abspath("build-android")
WORKSPACE = os.path.abspath("tibeb-app")
OUTPUT_DIR = os.path.join(WORKSPACE, "public", "downloads")

def run(cmd, cwd=None):
    print("RUN:", " ".join(cmd) if isinstance(cmd, list) else cmd)
    res = subprocess.run(cmd, cwd=cwd, shell=True if isinstance(cmd, str) else False, capture_output=True, text=True)
    if res.returncode != 0:
        print("ERROR:", res.stderr)
        print("OUT:", res.stdout)
        raise RuntimeError(f"Command failed with code {res.returncode}")
    if res.stdout.strip():
        print("OUT:", res.stdout.strip()[:300])
    return res

def main():
    if os.path.exists(BUILD_DIR):
        shutil.rmtree(BUILD_DIR)
    os.makedirs(BUILD_DIR, exist_ok=True)

    res_dir = os.path.join(BUILD_DIR, "res")
    values_dir = os.path.join(res_dir, "values")
    os.makedirs(values_dir, exist_ok=True)

    # Strings
    with open(os.path.join(values_dir, "strings.xml"), "w", encoding="utf-8") as f:
        f.write('''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Tibeb</string>
</resources>
''')

    # Styles
    with open(os.path.join(values_dir, "styles.xml"), "w", encoding="utf-8") as f:
        f.write('''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.NoTitleBar">
        <item name="android:windowBackground">@android:color/white</item>
    </style>
</resources>
''')

    # Icons
    icon_source = os.path.join(WORKSPACE, "public", "icon-192.png")
    im = Image.open(icon_source)
    icon_sizes = {
        "mipmap-mdpi": (48, 48),
        "mipmap-hdpi": (72, 72),
        "mipmap-xhdpi": (96, 96),
        "mipmap-xxhdpi": (144, 144),
        "mipmap-xxxhdpi": (192, 192),
        "drawable": (96, 96),
    }
    for folder, size in icon_sizes.items():
        dirpath = os.path.join(res_dir, folder)
        os.makedirs(dirpath, exist_ok=True)
        resized = im.resize(size, Image.Resampling.LANCZOS)
        resized.save(os.path.join(dirpath, "ic_launcher.png"))

    # AndroidManifest.xml
    manifest_path = os.path.join(BUILD_DIR, "AndroidManifest.xml")
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write('''<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.tibeb.app"
    android:versionCode="120"
    android:versionName="1.2.0">

    <uses-sdk
        android:minSdkVersion="24"
        android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:theme="@style/AppTheme"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true"
        android:allowBackup="true"
        android:supportsRtl="true">

        <activity
            android:name="com.tibeb.app.MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
''')

    # Source code
    src_dir = os.path.join(BUILD_DIR, "src", "com", "tibeb", "app")
    os.makedirs(src_dir, exist_ok=True)
    java_file = os.path.join(src_dir, "MainActivity.java")
    with open(java_file, "w", encoding="utf-8") as f:
        f.write('''package com.tibeb.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView webView;
    private ProgressBar progressBar;
    private FrameLayout rootLayout;
    private ValueCallback<Uri[]> filePathCallback;
    private final static int FILE_CHOOSER_RESULT_CODE = 1001;

    // Default connection endpoints
    private static final String DEFAULT_URL = "http://192.168.100.25:3000";
    private static final String CLOUD_URL = "https://tibeb.vercel.app";
    private static final String PREF_KEY_URL = "tibeb_server_url";

    public class NativeBridge {
        @JavascriptInterface
        public void setServerUrl(final String url) {
            if (url != null && !url.trim().isEmpty()) {
                String clean = url.trim();
                if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
                    clean = "http://" + clean;
                }
                SharedPreferences prefs = getPreferences(Context.MODE_PRIVATE);
                prefs.edit().putString(PREF_KEY_URL, clean).apply();
                final String target = clean;
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        webView.loadUrl(target);
                    }
                });
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        rootLayout = new FrameLayout(this);
        rootLayout.setBackgroundColor(0xFF083D28);

        webView = new WebView(this);
        webView.setBackgroundColor(0xFF083D28);

        WebSettings ws = webView.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setDatabaseEnabled(true);
        ws.setAllowFileAccess(true);
        ws.setAllowContentAccess(true);
        ws.setUseWideViewPort(true);
        ws.setLoadWithOverviewMode(true);
        ws.setSupportZoom(true);
        ws.setBuiltInZoomControls(false);
        ws.setDisplayZoomControls(false);
        ws.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        ws.setCacheMode(WebSettings.LOAD_DEFAULT);
        ws.setRenderPriority(WebSettings.RenderPriority.HIGH);
        ws.setEnableSmoothTransition(true);
        ws.setUserAgentString(ws.getUserAgentString() + " TibebMobileApp/1.2.0 Android FastMobile");

        webView.addJavascriptInterface(new NativeBridge(), "TibebNative");

        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        progressBar.setVisibility(View.GONE);
        FrameLayout.LayoutParams pbParams = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, 12
        );
        progressBar.setLayoutParams(pbParams);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                                            WebChromeClient.FileChooserParams fileChooserParams) {
                MainActivity.this.filePathCallback = filePathCallback;
                Intent intent = fileChooserParams.createIntent();
                try {
                    startActivityForResult(intent, FILE_CHOOSER_RESULT_CODE);
                } catch (Exception e) {
                    MainActivity.this.filePathCallback = null;
                    return false;
                }
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                return handleUrl(view, url);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleUrl(view, url);
            }

            private boolean handleUrl(WebView view, String url) {
                if (url.startsWith("tel:") || url.startsWith("mailto:") ||
                    url.startsWith("tg:") || url.startsWith("https://t.me/") ||
                    url.startsWith("intent:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        Toast.makeText(MainActivity.this, "Cannot open external application", Toast.LENGTH_SHORT).show();
                        return true;
                    }
                }
                return false;
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                handler.proceed(); // Allow local IP network & self-signed certs
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    showConnectionPortal(view, request.getUrl().toString());
                }
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                showConnectionPortal(view, failingUrl);
            }
        });

        rootLayout.addView(webView, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT
        ));
        rootLayout.addView(progressBar);

        setContentView(rootLayout);

        SharedPreferences prefs = getPreferences(Context.MODE_PRIVATE);
        String targetUrl = prefs.getString(PREF_KEY_URL, DEFAULT_URL);
        webView.loadUrl(targetUrl);
    }

        private void showConnectionPortal(WebView view, String attemptedUrl) {
        String safeUrl = (attemptedUrl != null) ? attemptedUrl.replace("'", "") : DEFAULT_URL;
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        sb.append("<style>");
        sb.append("body{background:#083D28;color:#FFFFFF;font-family:sans-serif;margin:0;padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:92vh;box-sizing:border-box;text-align:center;}");
        sb.append(".logo{width:68px;height:68px;border-radius:20px;background:#0B5D3B;color:#FFD700;font-size:32px;font-weight:bold;line-height:68px;margin:0 auto 16px auto;box-shadow:0 8px 20px rgba(0,0,0,0.4);border:2px solid #FFD700;}");
        sb.append("h1{color:#FFFFFF;font-size:22px;font-weight:bold;margin:0 0 6px 0;}");
        sb.append("p{color:#A7F3D0;font-size:13px;line-height:1.5;margin:0 0 20px 0;}");
        sb.append(".card{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:20px;width:100%;max-width:340px;box-sizing:border-box;margin-bottom:16px;}");
        sb.append(".btn{width:100%;background:#FFD700;color:#083D28;font-weight:bold;font-size:14px;padding:14px 18px;border-radius:14px;border:none;cursor:pointer;margin-bottom:10px;box-sizing:border-box;display:block;}");
        sb.append(".btn-alt{background:transparent;color:#A7F3D0;border:1px solid #A7F3D0;font-size:12px;font-weight:bold;padding:10px 14px;}");
        sb.append("input{width:100%;background:rgba(0,0,0,0.3);border:1px solid #FFD700;color:#FFFFFF;font-size:13px;padding:12px 14px;border-radius:12px;box-sizing:border-box;margin-bottom:10px;text-align:center;font-family:monospace;}");
        sb.append(".status{font-size:11px;color:#FCA5A5;margin-bottom:12px;word-break:break-all;}");
        sb.append("</style></head><body>");
        sb.append("<div class='logo'>T.</div>");
        sb.append("<h1>Tibeb Mobile</h1>");
        sb.append("<p>Higher Education Study Platform</p>");
        sb.append("<div class='card'>");
        sb.append("<div class='status'>Offline or Server Unreachable:<br><strong>").append(safeUrl).append("</strong></div>");
        sb.append("<button class='btn' id='btnWifi'>Connect to Wi-Fi (192.168.100.25)</button>");
        sb.append("<button class='btn btn-alt' id='btnCloud'>Connect to Cloud (tibeb.vercel.app)</button>");
        sb.append("<div style='margin:14px 0 6px 0;font-size:11px;color:#A7F3D0;font-weight:bold;'>CUSTOM SERVER URL:</div>");
        sb.append("<input id='cUrl' type='text' value='").append(safeUrl).append("'>");
        sb.append("<button class='btn btn-alt' id='btnCustom'>Save and Connect</button>");
        sb.append("</div>");
        sb.append("<script>");
        sb.append("function goUrl(u){ if(window.TibebNative){ window.TibebNative.setServerUrl(u); } else { location.href=u; } }");
        sb.append("document.getElementById('btnWifi').onclick = function() { goUrl('").append(DEFAULT_URL).append("'); };");
        sb.append("document.getElementById('btnCloud').onclick = function() { goUrl('").append(CLOUD_URL).append("'); };");
        sb.append("document.getElementById('btnCustom').onclick = function() { var v = document.getElementById('cUrl').value; goUrl(v); };");
        sb.append("</script>");
        sb.append("</body></html>");
        view.loadDataWithBaseURL(null, sb.toString(), "text/html", "utf-8", null);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_RESULT_CODE) {
            if (filePathCallback != null) {
                Uri[] results = null;
                if (resultCode == Activity.RESULT_OK && data != null) {
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    }
                }
                filePathCallback.onReceiveValue(results);
                filePathCallback = null;
            }
        }
        super.onActivityResult(requestCode, resultCode, data);
    }
}
''')

    # Step 1: Compile resources
    compiled_res = os.path.join(BUILD_DIR, "compiled_res.zip")
    run([AAPT2, "compile", "--dir", res_dir, "-o", compiled_res])

    # Step 2: Link resources
    base_apk = os.path.join(BUILD_DIR, "base.apk")
    run([
        AAPT2, "link",
        "-o", base_apk,
        "-I", PLATFORM_JAR,
        "--manifest", manifest_path,
        compiled_res,
        "--java", os.path.join(BUILD_DIR, "src"),
        "--auto-add-overlay"
    ])

    # Step 3: Compile Java
    bin_dir = os.path.join(BUILD_DIR, "bin")
    os.makedirs(bin_dir, exist_ok=True)
    r_java = os.path.join(BUILD_DIR, "src", "com", "tibeb", "app", "R.java")
    run([
        JAVAC,
        "-encoding", "utf-8",
        "-cp", PLATFORM_JAR,
        "-d", bin_dir,
        r_java,
        java_file
    ])

    # Step 4: D8 dexing
    class_files = [os.path.join(bin_dir, "com", "tibeb", "app", f) for f in os.listdir(os.path.join(bin_dir, "com", "tibeb", "app")) if f.endswith(".class")]
    run([D8, "--output", bin_dir, "--min-api", "24", "--lib", PLATFORM_JAR] + class_files)

    # Step 5: Add classes.dex into base.apk
    dex_path = os.path.join(bin_dir, "classes.dex")
    import zipfile
    with zipfile.ZipFile(base_apk, "a") as z:
        z.write(dex_path, "classes.dex")

    # Step 6: Create keystore if needed
    keystore_path = os.path.join(BUILD_DIR, "tibeb.keystore")
    if not os.path.exists(keystore_path):
        run([
            KEYTOOL, "-genkeypair",
            "-v",
            "-keystore", keystore_path,
            "-alias", "tibeb",
            "-keyalg", "RSA",
            "-keysize", "2048",
            "-validity", "10000",
            "-storepass", "tibeb123",
            "-keypass", "tibeb123",
            "-dname", "CN=Tibeb, OU=Mobile, O=Tibeb Education, L=Addis Ababa, C=ET"
        ])

    # Step 6b: Sign v1 scheme using jarsigner
    run([
        JARSIGNER,
        "-keystore", keystore_path,
        "-storepass", "tibeb123",
        "-keypass", "tibeb123",
        "-sigalg", "SHA256withRSA",
        "-digestalg", "SHA-256",
        base_apk,
        "tibeb"
    ])

    # Step 7: Zipalign 4-byte boundaries
    aligned_apk = os.path.join(BUILD_DIR, "tibeb-aligned.apk")
    run([ZIPALIGN, "-f", "-p", "4", base_apk, aligned_apk])

    # Step 8: apksigner (v2, v3)
    final_apk = os.path.join(BUILD_DIR, "tibeb-signed.apk")
    run([
        APKSIGNER, "sign",
        "--ks", keystore_path,
        "--ks-pass", "pass:tibeb123",
        "--ks-key-alias", "tibeb",
        "--key-pass", "pass:tibeb123",
        "--v1-signing-enabled", "true",
        "--v2-signing-enabled", "true",
        "--v3-signing-enabled", "true",
        "--out", final_apk,
        aligned_apk
    ])

    # Step 9: Verify signature
    run([APKSIGNER, "verify", "--verbose", final_apk])

    # Step 10: Verify badging
    dump_res = run([AAPT2, "dump", "badging", final_apk])
    print("DUMP BADGING:\n", dump_res.stdout[:500])

    # Copy to downloads
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    target1 = os.path.join(OUTPUT_DIR, "tibeb.apk")
    target2 = os.path.join(OUTPUT_DIR, "tibeb-v1.2.0.apk")
    shutil.copyfile(final_apk, target1)
    shutil.copyfile(final_apk, target2)

    apk_size = os.path.getsize(target1)
    print(f"SUCCESS! Built genuine Android APK: {target1} ({apk_size} bytes)")

if __name__ == "__main__":
    main()
