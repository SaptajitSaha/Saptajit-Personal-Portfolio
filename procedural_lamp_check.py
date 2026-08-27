import os

from playwright.sync_api import sync_playwright


URL = os.environ.get("PORTFOLIO_URL", "http://localhost:5173")


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.add_init_script("sessionStorage.setItem('signal-field-intro-seen', 'true')")
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(URL, wait_until="networkidle")
        study = page.locator(".procedural-study")
        study.scroll_into_view_if_needed()
        canvas = study.locator(".lamp-study__canvas")
        canvas.wait_for(state="visible", timeout=5000)
        page.wait_for_timeout(900)
        page.screenshot(path="/home/ubuntu/saptajit-portfolio/lamp-study-browser-check.png", full_page=True)
        assert canvas.evaluate("element => element.width") > 0
        assert canvas.evaluate("element => element.height") > 0
        assert canvas.evaluate("element => getComputedStyle(element).touchAction") == "pan-y"
        assert canvas.get_attribute("data-rendered") == "true", "The Three.js render lifecycle did not complete"
        assert study.locator(".lamp-study__hud").count() == 1

        explode = study.get_by_role("button", name="Explode assembly")
        explode.click()
        page.wait_for_timeout(80)
        assert study.get_by_role("button", name="Reassemble").get_attribute("aria-pressed") == "true"
        study.get_by_role("button", name="Reassemble").click()
        assert study.get_by_role("button", name="Explode assembly").get_attribute("aria-pressed") == "false"

        study.get_by_role("button", name="Hide shade").click()
        assert study.get_by_role("button", name="Show shade").get_attribute("aria-pressed") == "true"
        study.get_by_role("button", name="Show shade").click()
        study.get_by_role("button", name="Reset").click()

        canvas.focus()
        canvas.press("ArrowRight")
        page.wait_for_timeout(40)
        page.screenshot(path="/home/ubuntu/saptajit-portfolio/lamp-study-browser-check.png", full_page=True)
        assert not errors, errors

        mobile = browser.new_page(viewport={"width": 390, "height": 844})
        mobile.add_init_script("sessionStorage.setItem('signal-field-intro-seen', 'true')")
        mobile.goto(URL, wait_until="networkidle")
        mobile_study = mobile.locator(".procedural-study")
        mobile_study.scroll_into_view_if_needed()
        mobile_canvas = mobile_study.locator(".lamp-study__canvas")
        mobile_canvas.wait_for(state="visible", timeout=5000)
        mobile.wait_for_timeout(420)
        mobile_box = mobile_study.bounding_box()
        assert mobile_box is not None and mobile_box["width"] <= 390, mobile_box
        assert mobile_canvas.get_attribute("data-rendered") == "true"
        assert mobile_study.locator(".lamp-study__controls button").count() == 3
        mobile.screenshot(path="/home/ubuntu/saptajit-portfolio/lamp-study-mobile-browser-check.png", full_page=True)
        mobile.close()

        reduced = browser.new_page(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        reduced.add_init_script("sessionStorage.setItem('signal-field-intro-seen', 'true')")
        reduced.goto(URL, wait_until="networkidle")
        reduced_study = reduced.locator(".procedural-study")
        reduced_study.scroll_into_view_if_needed()
        reduced_study.locator(".lamp-study__canvas").wait_for(state="visible", timeout=5000)
        reduced.wait_for_timeout(200)
        reduced_study.get_by_role("button", name="Explode assembly").click()
        assert reduced_study.get_by_role("button", name="Reassemble").get_attribute("aria-pressed") == "true"
        reduced.close()
        browser.close()
        print("procedural_lamp_check: PASS")


if __name__ == "__main__":
    main()
