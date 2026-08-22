from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def screen_metrics(page):
    return page.evaluate(
        """() => {
          const showcase = document.querySelector('.nidarr-showcase').getBoundingClientRect();
          const screen = (id) => document.querySelector(`.nidarr-showcase__screen--${id}`).getBoundingClientRect();
          const dashboard = screen('dashboard');
          const report = screen('report');
          const map = screen('map');
          const center = (box) => box.left + box.width / 2;
          return {
            showcase: { left: showcase.left, right: showcase.right, top: showcase.top, bottom: showcase.bottom, width: showcase.width },
            dashboard: { left: dashboard.left, right: dashboard.right, top: dashboard.top, bottom: dashboard.bottom, width: dashboard.width, center: center(dashboard) },
            report: { left: report.left, right: report.right, top: report.top, bottom: report.bottom, width: report.width, center: center(report) },
            map: { left: map.left, right: map.right, top: map.top, bottom: map.bottom, width: map.width, center: center(map) },
            zIndex: {
              dashboard: getComputedStyle(document.querySelector('.nidarr-showcase__screen--dashboard')).zIndex,
              report: getComputedStyle(document.querySelector('.nidarr-showcase__screen--report')).zIndex,
              map: getComputedStyle(document.querySelector('.nidarr-showcase__screen--map')).zIndex,
            },
            phoneMockups: document.querySelectorAll('.phone-mockup').length,
            images: document.querySelectorAll('.nidarr-showcase__screen img').length,
          };
        }"""
    )


def assert_compact(metrics):
    assert metrics["phoneMockups"] == 0, metrics
    assert metrics["images"] == 3, metrics
    assert int(metrics["zIndex"]["dashboard"]) > int(metrics["zIndex"]["report"]), metrics
    assert int(metrics["zIndex"]["dashboard"]) > int(metrics["zIndex"]["map"]), metrics
    midpoint = metrics["showcase"]["left"] + metrics["showcase"]["width"] / 2
    assert abs(metrics["dashboard"]["center"] - midpoint) < metrics["showcase"]["width"] * 0.08, metrics


def assert_expanded(before, after):
    assert after["report"]["center"] < before["report"]["center"] - 8, (before, after)
    assert after["map"]["center"] > before["map"]["center"] + 8, (before, after)
    assert abs(after["dashboard"]["center"] - before["dashboard"]["center"]) < 8, (before, after)


def verify(page):
    page.goto(URL, wait_until="networkidle")
    assert page.locator(".nidarr-showcase__control").count() == 1
    compact = screen_metrics(page)
    assert_compact(compact)
    page.get_by_role("button", name="Expand Nidarr product screens").click()
    page.wait_for_timeout(820)
    assert page.locator(".nidarr-showcase.is-expanded").count() == 1
    assert_expanded(compact, screen_metrics(page))


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        for width in (1440, 1280, 1024, 768, 430, 390, 375, 320):
            page = browser.new_page(viewport={"width": width, "height": 900})
            verify(page)
            assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), width
            page.close()

        reduced = browser.new_page(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
        reduced.goto(URL, wait_until="networkidle")
        assert reduced.locator(".nidarr-showcase.is-expanded").count() == 1
        assert screen_metrics(reduced)["images"] == 3
        browser.close()
        print("nidarr_showcase_check: PASS")


if __name__ == "__main__":
    main()
