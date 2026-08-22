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
          return { red: red / samples, green: green / samples };
        }""",
        {"x": x, "y": y},
    )


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
    page.wait_for_timeout(90)
    lit = sample_grid(page, **point_one)
    assert lit["red"] > base["red"] + 18 and lit["red"] > lit["green"] * 1.45, {"base": base, "lit": lit}
    page.mouse.move(point_two["x"], point_two["y"])
    page.wait_for_timeout(180)
    trailing = sample_grid(page, **point_one)
    assert trailing["red"] > base["red"] + 3, {"base": base, "trailing": trailing}

    page.locator("#about").scroll_into_view_if_needed()
    page.wait_for_timeout(120)
    lower_point = {"x": metrics["viewport"]["width"] * 0.68, "y": metrics["viewport"]["height"] * 0.52}
    lower_base = sample_grid(page, **lower_point)
    page.mouse.move(lower_point["x"], lower_point["y"])
    page.wait_for_timeout(90)
    lower_lit = sample_grid(page, **lower_point)
    assert lower_lit["red"] > lower_base["red"] + 18 and lower_lit["red"] > lower_lit["green"] * 1.45, {"lower_base": lower_base, "lower_lit": lower_lit}
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
