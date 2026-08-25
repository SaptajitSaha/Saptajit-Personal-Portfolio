from playwright.sync_api import sync_playwright


import os

URL = os.environ.get("PORTFOLIO_URL", "http://localhost:5173")


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.add_init_script("sessionStorage.setItem('signal-field-intro-seen', 'true')")
        page.goto(URL, wait_until="networkidle")

        orbit = page.locator(".stage-scene")
        orbit_card = page.locator(".role-planet").first
        orbit.hover()
        page.wait_for_timeout(80)
        assert orbit.get_attribute("data-orbit-paused") == "true"
        paused_transform = orbit_card.evaluate("element => element.style.transform")
        page.wait_for_timeout(180)
        assert orbit_card.evaluate("element => element.style.transform") == paused_transform
        page.locator(".hero-copy").hover()
        page.wait_for_timeout(160)
        assert orbit.get_attribute("data-orbit-paused") == "false"
        assert orbit_card.evaluate("element => element.style.transform") != paused_transform

        case_study = page.locator(".case-study").first
        case_study.scroll_into_view_if_needed()
        trigger = case_study.locator(".case-study__trigger")
        trigger.click()
        page.wait_for_timeout(80)
        assert trigger.get_attribute("aria-expanded") == "true"
        assert case_study.locator(".case-study__dropdown").count() == 1
        case_transition = case_study.locator(".case-study__dropdown").evaluate("element => getComputedStyle(element).transitionDuration")
        assert case_study.locator(".case-study__dropdown").evaluate("element => getComputedStyle(element).display") == "grid"
        assert any(float(value.strip().removesuffix("s")) > .01 for value in case_transition.split(",")), case_transition
        first_ripple = case_study.locator(".case-study__trigger .interaction-ripple")
        assert first_ripple.count() == 1
        assert first_ripple.evaluate("element => element.style.getPropertyValue('--ripple-x')")
        page.wait_for_timeout(900)
        assert first_ripple.count() == 0
        trigger.click()
        assert trigger.get_attribute("aria-expanded") == "false"
        trigger.click()
        page.wait_for_timeout(48)
        assert trigger.get_attribute("aria-expanded") == "true"
        trigger.press("Enter")
        assert trigger.get_attribute("aria-expanded") == "false"
        page.wait_for_timeout(420)
        assert case_study.locator(".case-study__dropdown").get_attribute("data-state") == "closed"

        learning_triggers = page.locator(".learning-card__trigger")
        first_learning = learning_triggers.nth(0)
        second_learning = learning_triggers.nth(1)
        first_learning.scroll_into_view_if_needed()
        first_learning.click()
        page.wait_for_timeout(80)
        assert first_learning.get_attribute("aria-expanded") == "true"
        first_learning_item = page.locator(".learning-card").nth(0)
        learning_transition = first_learning_item.locator(".learning-card__dropdown").evaluate("element => getComputedStyle(element).transitionDuration")
        assert first_learning_item.locator(".learning-card__dropdown").evaluate("element => getComputedStyle(element).display") == "grid"
        assert any(float(value.strip().removesuffix("s")) > .01 for value in learning_transition.split(",")), learning_transition
        assert first_learning_item.locator(".learning-card__trigger .interaction-ripple").count() == 1
        page.wait_for_timeout(900)
        second_learning.click()
        page.wait_for_timeout(60)
        assert first_learning.get_attribute("aria-expanded") == "false"
        assert second_learning.get_attribute("aria-expanded") == "true"
        second_learning.press("Enter")
        assert second_learning.get_attribute("aria-expanded") == "false"
        page.wait_for_timeout(360)
        assert page.locator(".learning-card").nth(1).locator(".learning-card__dropdown").get_attribute("data-state") == "closed"

        action = page.locator(".project-live-link").first
        action.scroll_into_view_if_needed()
        action.hover()
        assert action.locator("svg").evaluate("element => getComputedStyle(element).transform") != "none"
        page.close()

        reduced = browser.new_page(viewport={"width": 390, "height": 900}, reduced_motion="reduce")
        reduced.add_init_script("sessionStorage.setItem('signal-field-intro-seen', 'true')")
        reduced.goto(URL, wait_until="networkidle")
        reduced_case = reduced.locator(".case-study").first
        reduced_case.scroll_into_view_if_needed()
        reduced_trigger = reduced_case.locator(".case-study__trigger")
        reduced_trigger.click()
        reduced_case_content = reduced_case.locator(".case-study__dropdown")
        duration = reduced_case_content.evaluate("element => getComputedStyle(element).transitionDuration")
        assert all(float(part.removesuffix("s")) <= .01 for part in duration.split(", ")), duration
        assert reduced_case.locator(".case-study__trigger .interaction-ripple").count() == 0
        reduced_learning = reduced.locator(".learning-card").first
        reduced_learning.scroll_into_view_if_needed()
        reduced_learning_trigger = reduced_learning.locator(".learning-card__trigger")
        reduced_learning_trigger.click()
        learning_duration = reduced_learning.locator(".learning-card__dropdown").evaluate("element => getComputedStyle(element).transitionDuration")
        assert all(float(part.removesuffix("s")) <= .01 for part in learning_duration.split(", ")), learning_duration
        assert reduced_learning.locator(".learning-card__trigger .interaction-ripple").count() == 0
        reduced.close()
        browser.close()
        print("motion_interactions_check: PASS")


if __name__ == "__main__":
    main()
