from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def shader_metrics(page):
    return page.evaluate(
        """() => {
          const hero = document.querySelector('.hero').getBoundingClientRect();
          const shader = document.querySelector('.hero-shader').getBoundingClientRect();
          const canvas = document.querySelector('.hero-shader__canvas');
          const grid = document.querySelector('.hero-gridlines');
          const copy = document.querySelector('.hero-copy');
          const stage = document.querySelector('.hero > .stage-wrap');
          return {
            canvasCount: document.querySelectorAll('.hero-shader__canvas').length,
            hero: { width: hero.width, height: hero.height },
            shader: { width: shader.width, height: shader.height },
            webgl: canvas.dataset.webgl || 'available',
            pointerEvents: getComputedStyle(canvas).pointerEvents,
            layers: {
              shader: getComputedStyle(document.querySelector('.hero-shader')).zIndex,
              grid: getComputedStyle(grid).zIndex,
              copy: getComputedStyle(copy).zIndex,
              stage: getComputedStyle(stage).zIndex,
            },
            pixelSize: { width: canvas.width, height: canvas.height },
          };
        }"""
    )


def assert_shader(page):
    page.goto(URL, wait_until="networkidle")
    metrics = shader_metrics(page)
    assert metrics["canvasCount"] == 1, metrics
    assert metrics["shader"]["width"] == metrics["hero"]["width"], metrics
    assert metrics["shader"]["height"] == metrics["hero"]["height"], metrics
    assert metrics["pointerEvents"] == "none", metrics
    assert int(metrics["layers"]["shader"]) < int(metrics["layers"]["grid"]) < int(metrics["layers"]["copy"]), metrics
    assert int(metrics["layers"]["shader"]) < int(metrics["layers"]["stage"]), metrics
    assert metrics["pixelSize"]["width"] > 1 and metrics["pixelSize"]["height"] > 1, metrics


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        for width in (1440, 1024, 768, 390):
            page = browser.new_page(viewport={"width": width, "height": 900})
            assert_shader(page)
            assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), width
            page.close()

        reduced = browser.new_page(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
        assert_shader(reduced)
        image_before = reduced.locator(".hero-shader__canvas").evaluate("canvas => canvas.toDataURL()")
        reduced.wait_for_timeout(280)
        image_after = reduced.locator(".hero-shader__canvas").evaluate("canvas => canvas.toDataURL()")
        assert image_before == image_after
        reduced.close()

        fallback = browser.new_page(viewport={"width": 1280, "height": 900})
        fallback.goto(URL, wait_until="networkidle")
        assert fallback.locator(".hero-shader__fallback").count() == 1
        assert fallback.locator(".hero-shader__fallback").evaluate("element => getComputedStyle(element).backgroundImage !== 'none'")
        fallback.close()
        browser.close()
        print("shader_background_check: PASS")


if __name__ == "__main__":
    main()
