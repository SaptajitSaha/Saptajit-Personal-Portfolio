from time import sleep

from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def orbit_sample(page, selector):
    return page.evaluate(
        """(selector) => {
          const stage = document.querySelector('.stage-scene').getBoundingClientRect();
          const ellipse = document.querySelector('.orbit-svg__ring');
          const element = document.querySelector(selector).getBoundingClientRect();
          const cx = Number(ellipse.getAttribute('cx'));
          const cy = Number(ellipse.getAttribute('cy'));
          const rx = Number(ellipse.getAttribute('rx'));
          const ry = Number(ellipse.getAttribute('ry'));
          const x = element.left - stage.left + element.width / 2;
          const y = element.top - stage.top + element.height / 2;
          return { x, y, value: ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 };
        }""",
        selector,
    )


def distance(first, second):
    return ((first["x"] - second["x"]) ** 2 + (first["y"] - second["y"]) ** 2) ** 0.5


def assert_shared_geometry(page):
    selectors = [
        '[data-orbit-card="data"]',
        '[data-orbit-card="ai"]',
        '[data-orbit-card="code"]',
        '[data-orbit-particle="data"]',
        '[data-orbit-particle="ai"]',
        '[data-orbit-particle="code"]',
    ]
    for selector in selectors:
        sample = orbit_sample(page, selector)
        assert abs(sample["value"] - 1) < 0.025, (selector, sample)

    checks = page.evaluate(
        """() => {
          const stage = document.querySelector('.stage-scene').getBoundingClientRect();
          const portrait = document.querySelector('.portrait-orb').getBoundingClientRect();
          const ellipse = document.querySelector('.orbit-svg__ring');
          const cards = [...document.querySelectorAll('[data-orbit-card]')].map(card => card.getBoundingClientRect());
          const cx = Number(ellipse.getAttribute('cx'));
          const cy = Number(ellipse.getAttribute('cy'));
          const rx = Number(ellipse.getAttribute('rx'));
          const ry = Number(ellipse.getAttribute('ry'));
          const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
          return {
            portraitCenter: [portrait.left - stage.left + portrait.width / 2, portrait.top - stage.top + portrait.height / 2],
            orbitCenter: [cx, cy],
            horizontal: rx > ry * (stage.width < 480 ? 1.08 : 1.25),
            cardSafety: cards.map(card => ({
              portraitCollision: overlaps(card, portrait),
              contained: card.left >= stage.left && card.right <= stage.right && card.top >= stage.top && card.bottom <= stage.bottom,
            })),
          };
        }"""
    )
    assert abs(checks["portraitCenter"][0] - checks["orbitCenter"][0]) < 0.75, checks
    assert abs(checks["portraitCenter"][1] - checks["orbitCenter"][1]) < 0.75, checks
    assert checks["horizontal"], checks
    assert all(not card["portraitCollision"] and card["contained"] for card in checks["cardSafety"]), checks


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.goto(URL, wait_until="networkidle")

        assert page.locator(".orbit-svg__ring").count() == 1
        assert page.locator("[data-orbit-card]").count() == 3
        assert page.locator("[data-orbit-particle]").count() == 3
        assert page.locator(".orbit-motion-toggle").count() == 0
        assert_shared_geometry(page)

        moving_before = orbit_sample(page, '[data-orbit-card="data"]')
        sleep(0.45)
        moving_after = orbit_sample(page, '[data-orbit-card="data"]')
        assert distance(moving_before, moving_after) > 1, (moving_before, moving_after)
        assert_shared_geometry(page)

        page.hover(".stage-scene")
        paused_before = orbit_sample(page, '[data-orbit-card="data"]')
        sleep(0.25)
        paused_after = orbit_sample(page, '[data-orbit-card="data"]')
        assert distance(paused_before, paused_after) < 0.25, (paused_before, paused_after)

        mobile = browser.new_page(viewport={"width": 375, "height": 812})
        mobile.goto(URL, wait_until="networkidle")
        assert mobile.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
        assert_shared_geometry(mobile)

        reduced = browser.new_page(viewport={"width": 1280, "height": 900})
        reduced.emulate_media(reduced_motion="reduce")
        reduced.goto(URL, wait_until="networkidle")
        static_before = orbit_sample(reduced, '[data-orbit-card="data"]')
        sleep(0.25)
        static_after = orbit_sample(reduced, '[data-orbit-card="data"]')
        assert distance(static_before, static_after) < 0.25, (static_before, static_after)
        assert_shared_geometry(reduced)

        browser.close()
        print("hero_refinement_check: PASS")


if __name__ == "__main__":
    main()
