//
//  ViewController.swift
//  iPG
//
//  Full-screen WKWebView loading bundled web app.
//

import UIKit
import WebKit

class ViewController: UIViewController {

    private var webView: WKWebView!

    override func loadView() {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.isOpaque = false
        webView.backgroundColor = .black
        webView.scrollView.backgroundColor = .black
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        loadApp()
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        .lightContent
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
}

// MARK: - WKNavigationDelegate
extension ViewController: WKNavigationDelegate {

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }
        // Open external links (e.g. GitHub) in Safari
        if navigationAction.navigationType == .linkActivated, url.host != nil, url.scheme == "https" || url.scheme == "http" {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }
}
