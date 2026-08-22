from math import sqrt

from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def sample_grid(page, x, y):
    return page.evaluate(
        """({ x, y }) => {
          const canvas = document.querySelector('.site-pixel-grid__canvas');
          const bounds = canvas.getBoundingClientRect();
          const context = canvas.getContext('2d');
          const ratio = canvas.width / bounds.width;
          const px = Math.max(0, Math.min(canvas.width - 1, Math.floor((x - bounds.left) * ratio)));
          const py = Math.max(0, Math.min(canvas.height - 1, Math.floor((y - bounds.top) * ratio)));
          let red = 0; let green = 0; let samples = 0;
          for (let dy = -8; dy <= 8; dy += 2) for (let dx = -8; dx <= 8; dx += 2) {
            const pixel = context.getImageData(Math.max(0, Math.min(canvas.width - 1, px + dx)), Math.max(0, Math.min(canvas.height - 1, py + dy)), 1, 1).data;
            red += pixel[0]; green += pixel[1]; samples += 1;
          }
          return { red: red / samples, green: green / samples, blue: (() => {
            let blue = 0;
            for (let dy = -8; dy <= 8; dy += 2) for (let dx = -8; dx <= 8; dx += 2) {
              blue += context.getImageData(Math.max(0, Math.min(canvas.width - 1, px + dx)), Math.max(0, Math.min(canvas.height - 1, py + dy)), 1, 1).data[2];
            }
            return blue / samples;
          })() };
        }""",
        {"x": x, "y": y},
    )


def section_point(page, selector):
    return page.evaluate(
        """selector => {
          const bounds = document.querySelector(selector).getBoundingClientRect();
          return {
            x: Math.max(72, Math.min(innerWidth - 72, bounds.left + bounds.width * .62)),
            y: Math.max(110, Math.min(innerHeight - 120, bounds.top + Math.min(bounds.height * .22, 220))),
          };
        }""",
        selector,
    )


def color_distance(sample, target):
    return abs(sample["red"] - target[0]) + abs(sample["green"] - target[1]) + abs(sample["blue"] - target[2])


def color_alignment(sample, target):
    base = (23, 20, 26)
    observed = (sample["red"] - base[0], sample["green"] - base[1], sample["blue"] - base[2])
    expected = tuple(channel - base[index] for index, channel in enumerate(target))
    observed_norm = sqrt(sum(channel * channel for channel in observed))
    expected_norm = sqrt(sum(channel * channel for channel in expected))
    return sum(observed[index] * expected[index] for index in range(3)) / (observed_norm * expected_norm)


def assert_grid(page):
    page.goto(URL, wait_until="networkidle")
    metrics = page.evaluate(
        """() => {
          const canvas = document.querySelector('.site-pixel-grid__canvas');
          const grid = document.querySelector('.site-pixel-grid');
          const mesh = document.querySelector('.hero-mesh');
          return {
            viewport: { width: innerWidth, height: innerHeight },
            grid: grid.getBoundingClientRect().toJSON(),
            canvasCount: document.querySelectorAll('.site-pixel-grid__canvas').length,
            gridFallbackCount: document.querySelectorAll('.site-pixel-grid__fallback').length,
            meshCount: document.querySelectorAll('.hero-mesh__canvas').length,
            meshFallbackCount: document.querySelectorAll('.hero-mesh__fallback').length,
            pointerEvents: getComputedStyle(canvas).pointerEvents,
            layers: {
              grid: getComputedStyle(grid).zIndex,
              mesh: getComputedStyle(mesh).zIndex,
              copy: getComputedStyle(document.querySelector('.hero-copy')).zIndex,
              stage: getComputedStyle(document.querySelector('.hero > .stage-wrap')).zIndex,
            },
          };
        }"""
    )
    assert metrics["canvasCount"] == 1 and metrics["gridFallbackCount"] == 1, metrics
    assert metrics["meshCount"] == 1 and metrics["meshFallbackCount"] == 1, metrics
    assert abs(metrics["grid"]["width"] - metrics["viewport"]["width"]) <= 1, metrics
    assert abs(metrics["grid"]["height"] - metrics["viewport"]["height"]) <= 1, metrics
    assert metrics["pointerEvents"] == "none", metrics
    assert int(metrics["layers"]["grid"]) < int(metrics["layers"]["copy"]) and int(metrics["layers"]["mesh"]) < int(metrics["layers"]["stage"]), metrics

    point_one = {"x": metrics["viewport"]["width"] * 0.3, "y": metrics["viewport"]["height"] * 0.38}
    point_two = {"x": metrics["viewport"]["width"] * 0.52, "y": metrics["viewport"]["height"] * 0.58}
    base = sample_grid(page, **point_one)
    page.mouse.move(point_one["x"], point_one["y"])
    page.wait_for_timeout(280)
    lit = sample_grid(page, **point_one)
    assert color_distance(lit, (232, 76, 53)) < 110, {"base": base, "lit": lit}
    page.mouse.move(point_two["x"], point_two["y"])
    page.wait_for_timeout(180)
    trailing = sample_grid(page, **point_one)
    assert trailing["red"] > base["red"] + 3, {"base": base, "trailing": trailing}

    accents = [("#work", (157, 119, 255)), ("#learning", (76, 202, 181)), ("#about", (226, 178, 84)), (".toolbox-section", (85, 163, 255)), ("#contact", (236, 103, 157))]
    lower_lit = None
    lower_point = None
    for selector, expected in accents:
        page.locator(selector).scroll_into_view_if_needed()
        page.wait_for_timeout(120)
        point = section_point(page, selector)
        page.mouse.move(point["x"], point["y"])
        page.wait_for_timeout(280)
        sample = sample_grid(page, **point)
        assert color_alignment(sample, expected) > .96, {"selector": selector, "expected": expected, "sample": sample}
        assert color_alignment(sample, expected) > color_alignment(sample, (232, 76, 53)) + .08, {"selector": selector, "sample": sample}
        lower_lit, lower_point = sample, point
    assert page.evaluate("window.scrollY > 0"), "Expected lower-section scroll coverage"

    page.evaluate("window.dispatchEvent(new PointerEvent('pointermove', { clientX: -40, clientY: -40, pointerType: 'mouse' }))")
    page.wait_for_timeout(950)
    faded = sample_grid(page, **lower_point)
    assert faded["red"] < lower_lit["red"], {"lower_lit": lower_lit, "faded": faded}


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        for width in (1440, 390):
            page = browser.new_page(viewport={"width": width, "height": 900})
            assert_grid(page)
            assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), width
            page.close()

        reduced = browser.new_page(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
        reduced.goto(URL, wait_until="networkidle")
        before = reduced.locator(".site-pixel-grid__canvas").evaluate("canvas => canvas.toDataURL()")
        reduced.mouse.move(240, 260)
        reduced.wait_for_timeout(320)
        after = reduced.locator(".site-pixel-grid__canvas").evaluate("canvas => canvas.toDataURL()")
        assert before == after
        reduced.close()
        browser.close()
        print("pixel_grid_check: PASS")


if __name__ == "__main__":
    main()
