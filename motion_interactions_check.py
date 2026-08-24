from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.add_init_script("sessionStorage.setItem('signal-field-intro-seen', 'true')")
        page.goto(URL, wait_until="networkidle")

        case_study = page.locator(".case-study").nth(1)
        case_study.scroll_into_view_if_needed()
        trigger = case_study.locator(".case-study__trigger")
        trigger.click()
        page.wait_for_timeout(150)
        assert trigger.get_attribute("aria-expanded") == "true"
        assert case_study.locator(".case-study__dropdown").count() == 1
        body = case_study.locator(".case-study__body")
        assert "clip-path" in body.evaluate("element => getComputedStyle(element).transitionProperty")
        first_ripple = case_study.locator(".case-study__trigger .interaction-ripple")
        assert first_ripple.count() == 1
        assert first_ripple.evaluate("element => element.style.getPropertyValue('--ripple-x')")
        page.wait_for_timeout(900)
        assert first_ripple.count() == 0
        trigger.click()
        assert trigger.get_attribute("aria-expanded") == "false"
        assert case_study.locator(".case-study__dropdown").count() == 1
        trigger.click()
        page.wait_for_timeout(120)
        assert trigger.get_attribute("aria-expanded") == "true"
        page.wait_for_timeout(320)
        assert case_study.locator(".case-study__dropdown").count() == 1
        trigger.press("Enter")
        assert trigger.get_attribute("aria-expanded") == "false"
        page.wait_for_timeout(320)
        assert case_study.locator(".case-study__dropdown").count() == 0

        learning = page.locator(".learning-card").first
        learning.scroll_into_view_if_needed()
        learning_trigger = learning.locator(".learning-card__trigger")
        learning_trigger.click()
        page.wait_for_timeout(150)
        assert learning_trigger.get_attribute("aria-expanded") == "true"
        detail = learning.locator(".learning-card__detail")
        assert "clip-path" in detail.evaluate("element => getComputedStyle(element).transitionProperty")
        assert learning.locator(".learning-card__trigger .interaction-ripple").count() == 1
        page.wait_for_timeout(900)
        learning_trigger.click()
        assert learning_trigger.get_attribute("aria-expanded") == "false"
        learning_trigger.click()
        page.wait_for_timeout(120)
        assert learning_trigger.get_attribute("aria-expanded") == "true"
        learning_trigger.press("Enter")
        assert learning_trigger.get_attribute("aria-expanded") == "false"
        page.wait_for_timeout(300)
        assert learning.locator(".learning-card__dropdown").count() == 0

        action = page.locator(".project-live-link").first
        action.scroll_into_view_if_needed()
        action.hover()
        assert action.locator("svg").evaluate("element => getComputedStyle(element).transform") != "none"
        page.close()

        reduced = browser.new_page(viewport={"width": 390, "height": 900}, reduced_motion="reduce")
        reduced.add_init_script("sessionStorage.setItem('signal-field-intro-seen', 'true')")
        reduced.goto(URL, wait_until="networkidle")
        reduced_case = reduced.locator(".case-study").nth(1)
        reduced_case.scroll_into_view_if_needed()
        reduced_trigger = reduced_case.locator(".case-study__trigger")
        reduced_trigger.click()
        duration = reduced_case.locator(".case-study__body").evaluate("element => getComputedStyle(element).transitionDuration")
        assert all(float(part.removesuffix("s")) <= .001 for part in duration.split(", ")), duration
        assert reduced_case.locator(".case-study__trigger .interaction-ripple").count() == 0
        reduced_learning = reduced.locator(".learning-card").first
        reduced_learning.scroll_into_view_if_needed()
        reduced_learning_trigger = reduced_learning.locator(".learning-card__trigger")
        reduced_learning_trigger.click()
        learning_duration = reduced_learning.locator(".learning-card__detail").evaluate("element => getComputedStyle(element).transitionDuration")
        assert all(float(part.removesuffix("s")) <= .001 for part in learning_duration.split(", ")), learning_duration
        assert reduced_learning.locator(".learning-card__trigger .interaction-ripple").count() == 0
        reduced.close()
        browser.close()
        print("motion_interactions_check: PASS")


if __name__ == "__main__":
    main()
