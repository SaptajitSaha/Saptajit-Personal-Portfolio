from playwright.sync_api import sync_playwright


import os

URL = os.environ.get("PORTFOLIO_URL", "http://localhost:5173")


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.add_init_script("sessionStorage.setItem('signal-field-intro-seen', 'true')")
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(520)

        nav_work = page.locator(".liquid-nav a").nth(1)
        nav_learning = page.locator(".liquid-nav a").nth(2)
        nav_work.hover()
        assert nav_work.evaluate("element => element.matches(':hover')")
        page.wait_for_function("element => Number.parseFloat(getComputedStyle(element, '::before').opacity) >= .69", arg=nav_work.element_handle(), timeout=1000)
        nav_hover = nav_work.evaluate("element => ({transform: getComputedStyle(element).transform, highlight: getComputedStyle(element, '::before').opacity, indicator: getComputedStyle(element, '::after').opacity, fontSize: getComputedStyle(element).fontSize})")
        untouched_nav_item = nav_learning.evaluate("element => ({transform: getComputedStyle(element).transform, highlight: getComputedStyle(element, '::before').opacity})")
        assert nav_hover["transform"] != "none", nav_hover
        assert float(nav_hover["highlight"]) >= .69, nav_hover
        assert float(nav_hover["indicator"]) >= .39, nav_hover
        assert float(nav_hover["fontSize"].removesuffix("px")) >= 12, nav_hover
        assert untouched_nav_item["transform"] == "matrix(1, 0, 0, 1, 0, 0)", untouched_nav_item
        assert float(untouched_nav_item["highlight"]) == 0, untouched_nav_item

        nav_home = page.locator(".liquid-nav a").nth(0)
        nav_home.hover()
        page.wait_for_timeout(240)
        assert nav_home.evaluate("element => getComputedStyle(element).transform") != "none"

        orbit = page.locator(".stage-scene")
        orbit_card = page.locator(".role-planet").first
        orbit.hover()
        page.wait_for_timeout(80)
        hover_transform = orbit_card.evaluate("element => element.style.transform")
        page.wait_for_timeout(320)
        assert orbit_card.evaluate("element => element.style.transform") != hover_transform
        page.locator(".hero-copy").hover()
        post_hover_transform = orbit_card.evaluate("element => element.style.transform")
        page.wait_for_timeout(220)
        assert orbit_card.evaluate("element => element.style.transform") != post_hover_transform

        case_study = page.locator(".case-study").first
        case_study.scroll_into_view_if_needed()
        trigger = case_study.locator(".case-study__trigger")
        trigger.click()
        page.wait_for_timeout(80)
        assert trigger.get_attribute("aria-expanded") == "true"
        assert case_study.locator(".case-study__dropdown").count() == 1
        case_transition = case_study.locator(".case-study__dropdown").evaluate("element => getComputedStyle(element).transitionDuration")
        assert case_study.locator(".case-study__dropdown").evaluate("element => getComputedStyle(element).display") == "block"
        assert all(float(value.strip().removesuffix("s")) <= .01 for value in case_transition.split(",")), case_transition
        assert case_study.locator(".case-study__trigger .interaction-ripple").count() == 0
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
        learning_dropdown = first_learning_item.locator(".learning-card__dropdown")
        first_learning_item.locator(".learning-card__dropdown[data-motion-ready]").wait_for(state="attached", timeout=1000)
        page.wait_for_function("element => Number.parseFloat(getComputedStyle(element).height) > 0", arg=learning_dropdown.element_handle(), timeout=1000)
        learning_detail = first_learning_item.locator(".learning-card__detail")
        learning_transition = learning_detail.evaluate("element => getComputedStyle(element).transitionDuration")
        learning_motion = learning_dropdown.evaluate("element => ({property: getComputedStyle(element).transitionProperty, duration: getComputedStyle(element).transitionDuration, opacity: Number(getComputedStyle(element).opacity), height: Number.parseFloat(getComputedStyle(element).height), maxHeight: getComputedStyle(element).maxHeight, contentHeight: element.scrollHeight})")
        assert learning_dropdown.evaluate("element => getComputedStyle(element).display") == "block"
        assert all(float(value.strip().removesuffix("s")) <= .01 for value in learning_transition.split(",")), learning_transition
        assert learning_motion["property"] == "max-height, opacity", learning_motion
        assert learning_motion["duration"] == "0.48s, 0.32s", learning_motion
        assert 0 < learning_motion["height"] < learning_motion["contentHeight"], learning_motion
        assert first_learning_item.locator(".learning-card__dropdown").get_attribute("data-motion-ready") == "true"
        assert learning_motion["maxHeight"].endswith("px") and learning_motion["maxHeight"] != "0px", learning_motion
        assert 0 < learning_motion["opacity"] < 1, learning_motion
        assert first_learning_item.locator(".learning-card__trigger .interaction-ripple").count() == 0
        second_learning.scroll_into_view_if_needed()
        second_learning.click()
        page.wait_for_timeout(60)
        assert first_learning.get_attribute("aria-expanded") == "false"
        assert second_learning.get_attribute("aria-expanded") == "true"
        second_learning.press("Enter")
        assert second_learning.get_attribute("aria-expanded") == "false"
        second_learning.press("Enter")
        page.wait_for_timeout(20)
        keyboard_motion = page.locator(".learning-card").nth(1).locator(".learning-card__dropdown").evaluate("element => ({height: getComputedStyle(element).height, transition: getComputedStyle(element).transitionDuration})")
        assert keyboard_motion["height"] != "0px", keyboard_motion
        assert all(float(value.strip().removesuffix("s")) <= .01 for value in keyboard_motion["transition"].split(",")), keyboard_motion
        page.wait_for_timeout(360)
        assert page.locator(".learning-card").nth(1).locator(".learning-card__dropdown").get_attribute("data-state") == "open"

        action = page.locator(".project-live-link").first
        action.scroll_into_view_if_needed()
        action.hover()
        assert action.locator("svg").evaluate("element => getComputedStyle(element).transform") != "none"
        page.close()

        mobile = browser.new_page(viewport={"width": 390, "height": 900})
        mobile.add_init_script("sessionStorage.setItem('signal-field-intro-seen', 'true')")
        mobile.goto(URL, wait_until="networkidle")
        mobile_nav = mobile.locator(".liquid-nav")
        mobile_nav_item = mobile.locator(".liquid-nav a").nth(2)
        mobile_nav_box = mobile_nav.bounding_box()
        mobile_nav_font_size = mobile_nav_item.evaluate("element => Number.parseFloat(getComputedStyle(element).fontSize)")
        assert mobile_nav_box is not None and mobile_nav_box["width"] <= 390, mobile_nav_box
        assert mobile_nav_font_size >= 11.25, mobile_nav_font_size
        carousel = mobile.locator(".phone-carousel")
        carousel.scroll_into_view_if_needed()
        assert carousel.locator(".phone-carousel__autoplay").count() == 0
        assert carousel.locator(".phone-carousel__progress").count() == 0
        mobile.wait_for_timeout(110)
        assert carousel.locator(".phone-carousel__dot-ring").count() == 1
        circular_progress = carousel.locator(".phone-carousel__dot-ring-progress")
        assert circular_progress.evaluate("element => getComputedStyle(element).strokeLinecap") == "round"
        assert circular_progress.evaluate("element => Number.parseFloat(getComputedStyle(element).strokeWidth)") >= 2.45
        assert "drop-shadow" in circular_progress.evaluate("element => getComputedStyle(element).filter")
        assert 0 < circular_progress.evaluate("element => Number.parseFloat(getComputedStyle(element).strokeDashoffset)") < 75
        carousel.locator(".phone-carousel__dot").nth(0).click()
        mobile.wait_for_timeout(50)
        assert carousel.locator(".phone-carousel__status").inner_text().upper().startswith("1 OF")
        carousel.locator(".phone-carousel__dot").nth(1).hover()
        mobile.wait_for_timeout(200)
        assert carousel.locator(".phone-carousel__dot").nth(1).evaluate("element => getComputedStyle(element).transform") != "matrix(1, 0, 0, 1, 0, 0)"
        carousel.dispatch_event("pointerdown", {"pointerId": 1, "pointerType": "touch", "clientX": 250, "clientY": 250, "bubbles": True})
        carousel.dispatch_event("pointerup", {"pointerId": 1, "pointerType": "touch", "clientX": 150, "clientY": 250, "bubbles": True})
        mobile.wait_for_timeout(50)
        assert carousel.locator(".phone-carousel__status").inner_text().upper().startswith("2 OF")
        assert carousel.locator(".phone-carousel__dot-ring").count() == 1
        carousel.dispatch_event("pointerdown", {"pointerId": 2, "pointerType": "touch", "clientX": 150, "clientY": 250, "bubbles": True})
        carousel.dispatch_event("pointerup", {"pointerId": 2, "pointerType": "touch", "clientX": 250, "clientY": 250, "bubbles": True})
        mobile.wait_for_timeout(50)
        assert carousel.locator(".phone-carousel__status").inner_text().upper().startswith("1 OF")
        carousel.dispatch_event("pointerdown", {"pointerId": 3, "pointerType": "touch", "clientX": 220, "clientY": 280, "bubbles": True})
        carousel.dispatch_event("pointerup", {"pointerId": 3, "pointerType": "touch", "clientX": 214, "clientY": 170, "bubbles": True})
        mobile.wait_for_timeout(50)
        assert carousel.locator(".phone-carousel__status").inner_text().upper().startswith("1 OF")
        assert carousel.evaluate("element => getComputedStyle(element).touchAction") == "pan-y"
        carousel.focus()
        carousel.press("ArrowRight")
        mobile.wait_for_timeout(50)
        assert carousel.locator(".phone-carousel__status").inner_text().upper().startswith("2 OF")
        carousel.locator(".phone-carousel__dot").last.click()
        mobile.wait_for_timeout(50)
        last_status = carousel.locator(".phone-carousel__status").inner_text().split(":")[0]
        carousel.dispatch_event("pointerdown", {"pointerId": 4, "pointerType": "touch", "clientX": 250, "clientY": 250, "bubbles": True})
        carousel.dispatch_event("pointerup", {"pointerId": 4, "pointerType": "touch", "clientX": 150, "clientY": 250, "bubbles": True})
        mobile.wait_for_timeout(100)
        assert carousel.locator(".phone-carousel__status").inner_text().startswith(last_status)
        assert carousel.locator(".phone-carousel__stage").evaluate("element => getComputedStyle(element).transform") != "none"
        mobile.wait_for_timeout(320)
        assert carousel.locator(".phone-carousel__stage").evaluate("element => getComputedStyle(element).transform") == "none"
        mobile.close()

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
