from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def carousel_metrics(page):
    return page.evaluate(
        """() => {
          const showcase = document.querySelector('.nidarr-showcase').getBoundingClientRect();
          const carousel = document.querySelector('.phone-carousel').getBoundingClientRect();
          const phones = [...document.querySelectorAll('.phone-carousel__phone')];
          const active = document.querySelector('.phone-carousel__phone[data-slot="active"]');
          return {
            showcase: { left: showcase.left, right: showcase.right, top: showcase.top, bottom: showcase.bottom, width: showcase.width, height: showcase.height },
            carousel: { left: carousel.left, right: carousel.right, top: carousel.top, bottom: carousel.bottom, width: carousel.width, height: carousel.height },
            phoneCount: phones.length,
            activeCount: document.querySelectorAll('.phone-carousel__phone[data-slot="active"]').length,
            activeSrc: active?.querySelector('img')?.getAttribute('src'),
            visibleCount: phones.filter(phone => phone.dataset.slot !== 'hidden').length,
            dots: document.querySelectorAll('.phone-carousel__dot').length,
            activeDots: document.querySelectorAll('.phone-carousel__dot[data-active]').length,
            prototype: document.querySelectorAll('.nidarr-showcase__prototype').length,
            status: document.querySelector('.phone-carousel__status')?.textContent,
            decodedImages: phones.filter(phone => phone.querySelector('img')?.naturalWidth > 0).length,
          };
        }"""
    )


def verify(page, check_autoplay=False):
    page.goto(URL, wait_until="networkidle")
    page.locator(".nidarr-showcase").scroll_into_view_if_needed()
    metrics = carousel_metrics(page)
    assert metrics["phoneCount"] == 5 and metrics["activeCount"] == 1 and metrics["decodedImages"] == 5, metrics
    assert metrics["visibleCount"] == 3 and metrics["dots"] == 5 and metrics["activeDots"] == 1, metrics
    assert metrics["prototype"] == 1 and metrics["status"] == "1 of 5: Safety overview", metrics
    assert metrics["showcase"]["width"] > 0 and metrics["carousel"]["width"] <= metrics["showcase"]["width"] + 1, metrics

    if check_autoplay:
        page.wait_for_timeout(5100)
        autoplay_metrics = carousel_metrics(page)
        assert autoplay_metrics["activeSrc"] != metrics["activeSrc"], autoplay_metrics
        page.locator(".phone-carousel").hover()
        paused_src = carousel_metrics(page)["activeSrc"]
        page.wait_for_timeout(5100)
        assert carousel_metrics(page)["activeSrc"] == paused_src
        page.mouse.move(0, 0)

    first_src = metrics["activeSrc"]
    page.get_by_role("button", name="Show next screen: Incident report").click()
    page.wait_for_timeout(460)
    next_metrics = carousel_metrics(page)
    assert next_metrics["status"].startswith("2 of 5: Incident report") and next_metrics["activeSrc"] != first_src, next_metrics

    page.get_by_role("button", name="Show Profile").click()
    page.wait_for_timeout(460)
    assert carousel_metrics(page)["status"].startswith("5 of 5: Profile")

    page.locator(".phone-carousel").focus()
    page.keyboard.press("ArrowLeft")
    page.wait_for_timeout(460)
    assert carousel_metrics(page)["status"].startswith("4 of 5: Walk with me")
    focused_src = carousel_metrics(page)["activeSrc"]
    page.wait_for_timeout(5100)
    assert carousel_metrics(page)["activeSrc"] == focused_src


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        for width in (1440, 1024, 768, 430, 390, 320):
            page = browser.new_page(viewport={"width": width, "height": 900})
            verify(page, check_autoplay=width == 1440)
            assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), width
            page.close()

        reduced = browser.new_page(viewport={"width": 390, "height": 900}, reduced_motion="reduce")
        verify(reduced)
        reduced_start = carousel_metrics(reduced)["activeSrc"]
        reduced.wait_for_timeout(5100)
        assert carousel_metrics(reduced)["activeSrc"] == reduced_start
        assert reduced.locator(".phone-carousel__phone[data-slot='active']").count() == 1
        reduced.close()
        browser.close()
        print("nidarr_showcase_check: PASS")


if __name__ == "__main__":
    main()
