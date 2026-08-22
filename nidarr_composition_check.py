from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def inspect_nidarr(page):
    return page.evaluate(
        """() => {
          const card = document.querySelector('.nidarr-card').getBoundingClientRect();
          const media = document.querySelector('.nidarr-media').getBoundingClientRect();
          const primary = document.querySelector('.phone-mockup--primary').getBoundingClientRect();
          const report = document.querySelector('.phone-mockup--report').getBoundingClientRect();
          const map = document.querySelector('.phone-mockup--map').getBoundingClientRect();
          const contained = (device) => device.left >= media.left - 1 && device.right <= media.right + 1 && device.top >= media.top - 1 && device.bottom <= media.bottom + 1;
          return {
            cardHeight: card.height,
            mediaHeight: media.height,
            deviceCount: document.querySelectorAll('.nidarr-media .phone-mockup').length,
            primaryLargest: primary.width > report.width && primary.width > map.width,
            allContained: [primary, report, map].every(contained),
            livePrototypeCount: [...document.querySelectorAll('.nidarr-actions a')].filter(link => link.textContent.includes('Open live prototype')).length,
            tourTextCount: [...document.querySelectorAll('a')].filter(link => link.textContent.includes('Watch product tour')).length,
          };
        }"""
    )


def assert_composition(page):
    details = inspect_nidarr(page)
    assert details["deviceCount"] == 3, details
    assert details["primaryLargest"], details
    assert details["allContained"], details
    assert details["livePrototypeCount"] == 1, details
    assert details["tourTextCount"] == 0, details
    assert details["mediaHeight"] / details["cardHeight"] >= 0.4, details


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        desktop = browser.new_page(viewport={"width": 1280, "height": 900})
        desktop.goto(URL, wait_until="networkidle")
        assert_composition(desktop)

        mobile = browser.new_page(viewport={"width": 420, "height": 900})
        mobile.goto(URL, wait_until="networkidle")
        assert mobile.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
        assert_composition(mobile)
        browser.close()
        print("nidarr_composition_check: PASS")


if __name__ == "__main__":
    main()
