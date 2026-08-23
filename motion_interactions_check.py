from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto(URL, wait_until="networkidle")

        case_study = page.locator(".case-study").first
        case_study.scroll_into_view_if_needed()
        case_study.locator("summary").click()
        assert case_study.evaluate("element => element.open")
        assert case_study.locator(".case-study__body").evaluate("element => getComputedStyle(element).animationName") == "case-study-reveal"

        learning = page.locator(".learning-card").first
        learning.scroll_into_view_if_needed()
        learning.locator("summary").click()
        assert learning.evaluate("element => element.open")
        assert learning.locator(".learning-card__detail").evaluate("element => getComputedStyle(element).animationName") == "learning-detail-reveal"

        action = page.locator(".project-live-link").first
        action.scroll_into_view_if_needed()
        action.hover()
        assert action.locator("svg").evaluate("element => getComputedStyle(element).transform") != "none"
        page.close()

        reduced = browser.new_page(viewport={"width": 390, "height": 900}, reduced_motion="reduce")
        reduced.goto(URL, wait_until="networkidle")
        reduced_case = reduced.locator(".case-study").nth(1)
        reduced_case.scroll_into_view_if_needed()
        reduced_case.locator("summary").click()
        duration = reduced_case.locator(".case-study__body").evaluate("element => getComputedStyle(element).animationDuration")
        assert float(duration.removesuffix("s")) <= .001, duration
        reduced.close()
        browser.close()
        print("motion_interactions_check: PASS")


if __name__ == "__main__":
    main()
