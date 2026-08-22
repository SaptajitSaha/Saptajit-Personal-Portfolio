from math import atan2, pi
from time import sleep

from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def orbit_sample(page, selector):
    return page.evaluate(
        """(selector) => {
          const ellipse = document.querySelector('.orbit-svg__ring--primary');
          const element = document.querySelector(selector);
          const stage = document.querySelector('.stage-scene').getBoundingClientRect();
          const rect = element.getBoundingClientRect();
          const cx = Number(ellipse.getAttribute('cx'));
          const cy = Number(ellipse.getAttribute('cy'));
          const rx = Number(ellipse.getAttribute('rx'));
          const ry = Number(ellipse.getAttribute('ry'));
          const rotation = Number((ellipse.getAttribute('transform').match(/rotate\\(([-\\d.]+)/) || [])[1]);
          const radians = rotation * Math.PI / 180;
          const x = rect.left + rect.width / 2 - stage.left;
          const y = rect.top + rect.height / 2 - stage.top;
          const dx = x - cx;
          const dy = y - cy;
          const localX = dx * Math.cos(radians) + dy * Math.sin(radians);
          const localY = -dx * Math.sin(radians) + dy * Math.cos(radians);
          const value = (localX / rx) ** 2 + (localY / ry) ** 2;
          const angle = Math.atan2(localY / ry, localX / rx);
          return { value, angle, x, y };
        }""",
        selector,
    )


def assert_orbit_fidelity(page):
    card_selectors = [
        '[data-orbit-card="data"]',
        '[data-orbit-card="ai"]',
        '[data-orbit-card="code"]',
    ]
    particle_selectors = [
        '[data-orbit-particle="data"]',
        '[data-orbit-particle="ai"]',
        '[data-orbit-particle="code"]',
    ]
    samples = [orbit_sample(page, selector) for selector in card_selectors + particle_selectors]
    for sample in samples:
        assert abs(sample["value"] - 1) < 0.035, sample

    card_angles = [sample["angle"] for sample in samples[:3]]
    gaps = sorted(((card_angles[(index + 1) % 3] - card_angles[index]) % (2 * pi)) for index in range(3))
    assert all(abs(gap - (2 * pi / 3)) < 0.08 for gap in gaps), gaps


def assert_safe_and_contained(page):
    result = page.evaluate(
        """() => {
          const portrait = document.querySelector('.portrait-orb').getBoundingClientRect();
          const stage = document.querySelector('.stage-scene').getBoundingClientRect();
          const cards = [...document.querySelectorAll('[data-orbit-card]')].map((node) => node.getBoundingClientRect());
          const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
          return cards.map((card) => ({
            portraitCollision: overlaps(card, portrait),
            contained: card.left >= stage.left - 2 && card.right <= stage.right + 2 && card.top >= stage.top - 2 && card.bottom <= stage.bottom + 2,
          }));
        }"""
    )
    assert all(not item["portraitCollision"] and item["contained"] for item in result), result


def coordinate_distance(first, second):
    return ((first["x"] - second["x"]) ** 2 + (first["y"] - second["y"]) ** 2) ** 0.5


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.goto(URL, wait_until="networkidle")

        assert page.locator(".orbit-svg__ring--primary").count() == 1
        assert page.locator("[data-orbit-card]").count() == 3
        assert page.locator("[data-orbit-particle]").count() == 3
        assert_orbit_fidelity(page)
        assert_safe_and_contained(page)

        before = orbit_sample(page, '[data-orbit-card="data"]')
        sleep(0.45)
        after = orbit_sample(page, '[data-orbit-card="data"]')
        assert coordinate_distance(before, after) > 1, (before, after)
        assert_orbit_fidelity(page)

        page.hover(".stage-scene")
        paused_before = orbit_sample(page, '[data-orbit-card="data"]')
        sleep(0.25)
        paused_after = orbit_sample(page, '[data-orbit-card="data"]')
        assert coordinate_distance(paused_before, paused_after) < 0.25, (paused_before, paused_after)

        page.mouse.move(1, 1)
        page.locator(".orbit-motion-toggle").click()
        assert page.locator(".orbit-motion-toggle").get_attribute("aria-pressed") == "true"
        sleep(0.1)
        toggle_before = orbit_sample(page, '[data-orbit-card="data"]')
        sleep(0.25)
        toggle_after = orbit_sample(page, '[data-orbit-card="data"]')
        assert coordinate_distance(toggle_before, toggle_after) < 0.4, (toggle_before, toggle_after)

        hero_credential = page.locator(".kicker").text_content() or ""
        about_copy = page.locator(".about-copy").inner_text()
        assert "IIT Madras" in hero_credential and "Indian Institute" not in hero_credential, hero_credential
        assert "Indian Institute of Technology Madras" in about_copy
        assert page.locator(".education-note svg").count() == 1

        mobile = browser.new_page(viewport={"width": 375, "height": 812})
        mobile.goto(URL, wait_until="networkidle")
        assert mobile.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
        assert_orbit_fidelity(mobile)
        assert_safe_and_contained(mobile)

        reduced = browser.new_page(viewport={"width": 1280, "height": 900})
        reduced.emulate_media(reduced_motion="reduce")
        reduced.goto(URL, wait_until="networkidle")
        reduced_before = orbit_sample(reduced, '[data-orbit-card="data"]')
        sleep(0.3)
        reduced_after = orbit_sample(reduced, '[data-orbit-card="data"]')
        assert coordinate_distance(reduced_before, reduced_after) < 0.25, (reduced_before, reduced_after)
        assert_orbit_fidelity(reduced)

        browser.close()
        print("hero_refinement_check: PASS")


if __name__ == "__main__":
    main()
