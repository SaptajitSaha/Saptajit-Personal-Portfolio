import json
from pathlib import Path

from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"
OUTPUT = Path(__file__).with_name("saptajit-portfolio-2026-08-24-runtime.json")


def collect(page, viewport_name):
    page.add_init_script("sessionStorage.setItem('signal-field-intro-seen', 'true')")
    page.goto(URL, wait_until="networkidle")
    nav = page.locator(".liquid-nav")
    nav_box = nav.bounding_box()
    nidarr_trigger = page.locator(".case-study").first.locator(".case-study__trigger")
    nidarr_trigger_box = nidarr_trigger.bounding_box()
    carousel_box = page.locator(".phone-carousel__stage").bounding_box()
    first_case = page.locator(".case-study").nth(1)
    first_case.evaluate("el => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150 })")
    trigger = first_case.locator(".case-study__trigger")
    trigger.click()
    page.wait_for_timeout(80)
    case_state = {
        "expanded": trigger.get_attribute("aria-expanded"),
        "content_state": first_case.locator(".case-study__dropdown").get_attribute("data-state"),
        "animation": first_case.locator(".case-study__dropdown").evaluate("el => getComputedStyle(el).animationName"),
    }
    trigger.press("Enter")
    learning = page.locator(".learning-card__trigger").first
    learning_item = page.locator(".learning-card").first
    learning.evaluate("el => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150 })")
    learning.click()
    page.wait_for_timeout(80)
    learning_state = {
        "expanded": learning.get_attribute("aria-expanded"),
        "animation": learning_item.locator(".learning-card__dropdown").evaluate("el => getComputedStyle(el).animationName"),
    }
    return {
        "viewport": viewport_name,
        "nav_box": nav_box,
        "nav_computed": nav.evaluate("el => ({position:getComputedStyle(el).position, top:getComputedStyle(el).top, bottom:getComputedStyle(el).bottom, zIndex:getComputedStyle(el).zIndex})"),
        "nidarr_trigger_box": nidarr_trigger_box,
        "nidarr_carousel_box": carousel_box,
        "interactive_metrics": page.evaluate(
            """() => [...document.querySelectorAll('button, a[href]')]
              .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
              .map(el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return {
                text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 56),
                className: el.className?.toString() || '',
                width: Math.round(r.width), height: Math.round(r.height),
                fontSize: s.fontSize, letterSpacing: s.letterSpacing,
                transition: s.transitionDuration, position: s.position
              }; })"""
        ),
        "case_study": case_state,
        "learning": learning_state,
    }


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
        mobile = browser.new_page(viewport={"width": 390, "height": 844})
        result = {"desktop": collect(desktop, "desktop"), "mobile": collect(mobile, "mobile")}
        OUTPUT.write_text(json.dumps(result, indent=2), encoding="utf-8")
        desktop.close()
        mobile.close()
        browser.close()
        print(OUTPUT)


if __name__ == "__main__":
    main()
