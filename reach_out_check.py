from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def verify(page):
    page.goto(URL, wait_until="networkidle")
    page.locator(".reach-out").scroll_into_view_if_needed()
    metrics = page.evaluate(
        """() => {
          const panel = document.querySelector('.reach-out');
          const calendar = document.querySelector('.booking-calendar');
          return {
            panel: panel.getBoundingClientRect().toJSON(),
            messageButtons: document.querySelectorAll('.reach-out__message').length,
            calendarHref: calendar?.getAttribute('href'),
            calendarDays: document.querySelectorAll('.booking-calendar__days > span').length,
            emailHref: document.querySelector('.reach-out__email')?.getAttribute('href'),
            socialHrefs: [...document.querySelectorAll('.reach-out__socials a')].map(link => link.getAttribute('href')),
            socialCount: document.querySelectorAll('.reach-out__socials a').length,
          };
        }"""
    )
    assert metrics["panel"]["width"] > 0 and metrics["messageButtons"] == 1, metrics
    assert metrics["calendarHref"].startswith("mailto:sahasaptajit@gmail.com?subject=30-minute"), metrics
    assert metrics["calendarDays"] >= 35 and metrics["emailHref"] == "mailto:sahasaptajit@gmail.com", metrics
    assert metrics["socialCount"] == 3 and "https://www.linkedin.com/in/saptajitsaha/" in metrics["socialHrefs"] and "https://github.com/SaptajitSaha" in metrics["socialHrefs"], metrics

    page.get_by_role("button", name="Direct message Start a conversation Send a note through the portfolio.").click()
    page.wait_for_selector(".contact-dialog")
    assert page.locator(".contact-form input[name='name']").count() == 1


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        for width in (1440, 768, 390, 320):
            page = browser.new_page(viewport={"width": width, "height": 900})
            verify(page)
            assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), width
            page.close()

        reduced = browser.new_page(viewport={"width": 390, "height": 900}, reduced_motion="reduce")
        reduced.goto(URL, wait_until="networkidle")
        transition = reduced.locator(".reach-out__message").evaluate("element => getComputedStyle(element).transitionDuration")
        assert all(float(value.strip().removesuffix("s")) <= .001 for value in transition.split(",")), transition
        reduced.close()
        browser.close()
        print("reach_out_check: PASS")


if __name__ == "__main__":
    main()
