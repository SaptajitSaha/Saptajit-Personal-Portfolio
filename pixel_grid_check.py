from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def sample_grid(page, x, y):
    return page.evaluate(
        """({ x, y }) => {
          const canvas = document.querySelector('.hero-pixel-grid__canvas');
          const bounds = canvas.getBoundingClientRect();
          const context = canvas.getContext('2d');
          const ratio = canvas.width / bounds.width;
          const px = Math.max(0, Math.min(canvas.width - 1, Math.floor((x - bounds.left) * ratio)));
          const py = Math.max(0, Math.min(canvas.height - 1, Math.floor((y - bounds.top) * ratio)));
          let red = 0;
          let green = 0;
          let samples = 0;
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
          const hero = document.querySelector('.hero').getBoundingClientRect();
          const grid = document.querySelector('.hero-pixel-grid').getBoundingClientRect();
          const canvas = document.querySelector('.hero-pixel-grid__canvas');
          return {
            hero: { width: hero.width, height: hero.height, left: hero.left, top: hero.top },
            grid: { width: grid.width, height: grid.height },
            canvasCount: document.querySelectorAll('.hero-pixel-grid__canvas').length,
            oldShaderCount: document.querySelectorAll('.hero-shader').length,
            fallbackCount: document.querySelectorAll('.hero-pixel-grid__fallback').length,
            pointerEvents: getComputedStyle(canvas).pointerEvents,
            layers: {
              grid: getComputedStyle(document.querySelector('.hero-pixel-grid')).zIndex,
              copy: getComputedStyle(document.querySelector('.hero-copy')).zIndex,
              stage: getComputedStyle(document.querySelector('.hero > .stage-wrap')).zIndex,
            },
          };
        }"""
    )
    assert metrics["canvasCount"] == 1 and metrics["oldShaderCount"] == 0 and metrics["fallbackCount"] == 1, metrics
    assert metrics["grid"] == {"width": metrics["hero"]["width"], "height": metrics["hero"]["height"]}, metrics
    assert metrics["pointerEvents"] == "none", metrics
    assert int(metrics["layers"]["grid"]) < int(metrics["layers"]["copy"]) and int(metrics["layers"]["grid"]) < int(metrics["layers"]["stage"]), metrics

    point_one = {"x": metrics["hero"]["left"] + metrics["hero"]["width"] * 0.3, "y": metrics["hero"]["top"] + metrics["hero"]["height"] * 0.37}
    point_two = {"x": metrics["hero"]["left"] + metrics["hero"]["width"] * 0.52, "y": metrics["hero"]["top"] + metrics["hero"]["height"] * 0.55}
    base = sample_grid(page, **point_one)
    page.mouse.move(point_one["x"], point_one["y"])
    page.wait_for_timeout(80)
    lit = sample_grid(page, **point_one)
    assert lit["red"] > base["red"] + 18 and lit["red"] > lit["green"] * 1.45, {"base": base, "lit": lit}
    page.mouse.move(point_two["x"], point_two["y"])
    page.wait_for_timeout(180)
    trailing = sample_grid(page, **point_one)
    assert trailing["red"] > base["red"] + 3, {"base": base, "trailing": trailing}
    page.wait_for_timeout(950)
    faded = sample_grid(page, **point_one)
    assert faded["red"] < trailing["red"], {"trailing": trailing, "faded": faded}


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        for width in (1440, 1024, 768, 390):
            page = browser.new_page(viewport={"width": width, "height": 900})
            assert_grid(page)
            assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), width
            page.close()

        reduced = browser.new_page(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
        reduced.goto(URL, wait_until="networkidle")
        metrics = reduced.evaluate("""() => {
          const canvas = document.querySelector('.hero-pixel-grid__canvas');
          return { before: canvas.toDataURL(), rect: canvas.getBoundingClientRect() };
        }""")
        reduced.mouse.move(metrics["rect"]["x"] + 90, metrics["rect"]["y"] + 90)
        reduced.wait_for_timeout(320)
        after = reduced.locator(".hero-pixel-grid__canvas").evaluate("canvas => canvas.toDataURL()")
        assert metrics["before"] == after
        reduced.close()
        browser.close()
        print("pixel_grid_check: PASS")


if __name__ == "__main__":
    main()
