from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto(URL, wait_until="domcontentloaded")

        loader = page.locator(".first-load")
        assert loader.count() == 1
        assert loader.get_attribute("role") == "status"
        assert page.locator(".first-load__progress-fill").count() == 1
        page.wait_for_timeout(700)
        progress = page.locator(".first-load__progress-fill").evaluate("element => getComputedStyle(element).transform")
        assert progress != "none", progress
        assert page.locator("#main-content").evaluate("element => element.closest('[inert]') !== null")

        page.locator(".first-load__skip").focus()
        page.keyboard.press("Enter")
        page.wait_for_timeout(260)
        assert loader.count() == 0
        assert not page.locator("#main-content").evaluate("element => element.closest('[inert]') !== null")
        assert page.locator(".site-header").count() == 1

        page.reload(wait_until="networkidle")
        assert page.locator(".first-load").count() == 0

        automatic_context = browser.new_context(viewport={"width": 1280, "height": 800})
        automatic = automatic_context.new_page()
        automatic.goto(URL, wait_until="domcontentloaded")
        assert automatic.locator(".first-load").count() == 1
        automatic.wait_for_timeout(2700)
        assert automatic.locator(".first-load").count() == 0
        assert not automatic.locator("#main-content").evaluate("element => element.closest('[inert]') !== null")
        automatic_context.close()

        reduced = browser.new_page(viewport={"width": 390, "height": 812}, reduced_motion="reduce")
        reduced.goto(URL, wait_until="networkidle")
        assert reduced.locator(".first-load").count() == 0
        assert not reduced.locator("#main-content").evaluate("element => element.closest('[inert]') !== null")
        assert reduced.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")

        reduced.close()
        page.close()
        browser.close()
        print("first_load_check: PASS")


if __name__ == "__main__":
    main()
