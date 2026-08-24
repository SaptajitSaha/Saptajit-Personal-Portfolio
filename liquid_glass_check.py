from playwright.sync_api import sync_playwright


import os

URL = os.environ.get("PORTFOLIO_URL", "http://localhost:5173")


def prepare(page):
    page.add_init_script("sessionStorage.setItem('signal-field-intro-seen', 'true')")
    page.goto(URL, wait_until="networkidle")


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        desktop = browser.new_page(viewport={"width": 1440, "height": 900})
        prepare(desktop)
        nav = desktop.locator(".liquid-nav")
        assert nav.count() == 1 and desktop.locator(".site-header").count() == 0
        desktop_nav = nav.locator(".liquid-nav__surface")
        assert desktop_nav.evaluate("element => getComputedStyle(element).position") == "relative"
        assert "blur" in desktop_nav.evaluate("element => getComputedStyle(element).backdropFilter")
        top = nav.bounding_box()["y"]
        desktop.locator("#contact").scroll_into_view_if_needed()
        assert abs(nav.bounding_box()["y"] - top) < 1
        nav.get_by_role("link", name="About").click()
        desktop.wait_for_timeout(180)
        assert desktop.locator("#about").evaluate("element => element.getBoundingClientRect().top < innerHeight")
        assert nav.get_by_role("link", name="About").get_attribute("aria-current") == "location"

        card = desktop.locator(".project-card.nidarr-card")
        assert card.count() == 1
        assert card.evaluate("element => getComputedStyle(element).getPropertyValue('--glass-tilt-x').trim()") == "0deg"
        desktop.close()

        mobile = browser.new_page(viewport={"width": 390, "height": 812})
        prepare(mobile)
        assert mobile.locator(".liquid-nav").evaluate("element => getComputedStyle(element).bottom") != "auto"
        assert mobile.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
        mobile.close()

        reduced = browser.new_page(viewport={"width": 1280, "height": 800}, reduced_motion="reduce")
        prepare(reduced)
        reduced_card = reduced.locator(".project-card.nidarr-card")
        assert reduced_card.evaluate("element => getComputedStyle(element).getPropertyValue('--glass-tilt-x').trim()") == "0deg"
        assert reduced.locator(".liquid-nav__surface").evaluate("element => getComputedStyle(element).transitionDuration") == "0s"
        reduced.close()
        browser.close()
        print("liquid_glass_check: PASS")


if __name__ == "__main__":
    main()
