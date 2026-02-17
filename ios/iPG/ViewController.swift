//
//  ViewController.swift
//  iPG
//
//  Full-screen WKWebView loading bundled web app.
//

import UIKit
import WebKit

extension UIImage {
    static func solid(color: UIColor, size: CGSize) -> UIImage {
        let format = UIGraphicsImageRendererFormat.default()
        format.opaque = true
        let renderer = UIGraphicsImageRenderer(size: size, format: format)
        return renderer.image { ctx in
            color.setFill()
            ctx.fill(CGRect(origin: .zero, size: size))
        }
    }
}

class ViewController: UIViewController {

    private var webView: WKWebView!
    private var refreshControl = UIRefreshControl()

    override func loadView() {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.defaultWebpagePreferences.preferredContentMode = .mobile
        config.allowsAirPlayForMediaPlayback = true
        config.suppressesIncrementalRendering = false
        config.limitsNavigationsToAppBoundDomains = false

        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.scrollView.contentInsetAdjustmentBehavior = .always
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.backgroundColor = .clear

        let container = UIView()
        container.backgroundColor = UIColor.systemBackground
        container.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: container.safeAreaLayoutGuide.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: container.safeAreaLayoutGuide.trailingAnchor),
            webView.topAnchor.constraint(equalTo: container.safeAreaLayoutGuide.topAnchor),
            webView.bottomAnchor.constraint(equalTo: container.safeAreaLayoutGuide.bottomAnchor)
        ])
        view = container
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        webView.scrollView.alwaysBounceVertical = true
        refreshControl.addTarget(self, action: #selector(handleRefresh), for: .valueChanged)
        if #available(iOS 10.0, *) {
            webView.scrollView.refreshControl = refreshControl
        } else {
            webView.scrollView.addSubview(refreshControl)
        }

        loadApp()

        DispatchQueue.global(qos: .utility).async { [weak self] in
            self?.exportOrangeIconIfNeeded()
        }
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return traitCollection.userInterfaceStyle == .dark ? .lightContent : .darkContent
    }

    @objc private func handleRefresh() {
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.impactOccurred()
        if webView.url != nil {
            webView.reload()
        } else {
            loadApp()
        }
    }

    private func loadApp() {
        let bundleRoot = Bundle.main.resourceURL!
        // Web files may be at bundle root or in Web/ depending on Xcode copy
        let webURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Web")
            ?? Bundle.main.url(forResource: "index", withExtension: "html")
        guard let url = webURL else {
            showLoadError()
            return
        }
        let readAccess = url.deletingLastPathComponent()
        webView.loadFileURL(url, allowingReadAccessTo: readAccess)
    }

    private func showLoadError() {
        let label = UILabel()
        label.text = "Could not load app."
        label.textColor = .white
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(label)
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }

    private func exportOrangeIconIfNeeded() {
        let key = "didExportOrangeIcon"
        let defaults = UserDefaults.standard
        guard defaults.bool(forKey: key) == false else { return }

        let orange = UIColor(named: "AppOrange") ?? UIColor(red: 1.0, green: 0.498, blue: 0.0, alpha: 1.0)
        let image = UIImage.solid(color: orange, size: CGSize(width: 1024, height: 1024))
        guard let data = image.pngData() else { return }
        do {
            let docs = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
            let url = docs.appendingPathComponent("SolidOrange1024.png")
            try data.write(to: url)
            defaults.set(true, forKey: key)
            print("Exported solid orange icon to: \(url.path)")
        } catch {
            print("Failed to export icon: \(error)")
        }
    }
}

// MARK: - WKNavigationDelegate
extension ViewController: WKNavigationDelegate {

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }
        // Open external HTTP/HTTPS links in Safari unless it's a file or app-internal URL
        if navigationAction.navigationType == .linkActivated,
           (url.scheme == "https" || url.scheme == "http"),
           url.host != nil {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        if refreshControl.isRefreshing { refreshControl.endRefreshing() }
        setNeedsStatusBarAppearanceUpdate()
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        if refreshControl.isRefreshing { refreshControl.endRefreshing() }
    }
}

