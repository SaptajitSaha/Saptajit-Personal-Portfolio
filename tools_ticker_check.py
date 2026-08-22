from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.goto(URL, wait_until="networkidle")

        assert page.locator(".toolbox-motion-toggle").count() == 0
        assert page.locator(".toolbox-ticker[data-paused]").count() == 0
        assert page.locator(".toolbox-ticker__row").count() == 3
        page.hover(".toolbox-ticker__row:nth-child(3)")
        states = page.evaluate("[...document.querySelectorAll('.toolbox-ticker__track')].map(track => getComputedStyle(track).animationPlayState)")
        assert states == ["running", "paused", "running"], states

        mobile = browser.new_page(viewport={"width": 375, "height": 812})
        mobile.goto(URL, wait_until="networkidle")
        assert mobile.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
        assert mobile.locator(".toolbox-motion-toggle").count() == 0
        browser.close()
        print("tools_ticker_check: PASS")


if __name__ == "__main__":
    main()
