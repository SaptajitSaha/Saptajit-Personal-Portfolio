from playwright.sync_api import sync_playwright


URL = "http://localhost:5173"


def assert_no_portrait_collisions(page):
    for phase in (0, 0.25, 0.5, 0.75):
        collisions = page.evaluate(
            """(fraction) => {
              const portrait = document.querySelector('.portrait-orb').getBoundingClientRect();
              const paths = [...document.querySelectorAll('.orbit-label-path')];
              paths.forEach((path) => {
                const label = path.querySelector('.role-planet');
                const duration = parseFloat(getComputedStyle(path).animationDuration);
                path.style.animationDelay = `-${duration * fraction}s`;
                label.style.animationDelay = `-${duration * fraction}s`;
                path.style.animationPlayState = 'paused';
                label.style.animationPlayState = 'paused';
              });
              const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
              return paths.map((path) => overlaps(path.querySelector('.role-planet').getBoundingClientRect(), portrait));
            }""",
            phase,
        )
        assert collisions == [False, False, False], f"Orbit label collision at phase {phase}: {collisions}"


def assert_labels_stay_in_stage(page):
    for phase in (0, 0.25, 0.5, 0.75):
        containment = page.evaluate(
            """(fraction) => {
              const stage = document.querySelector('.stage-scene').getBoundingClientRect();
              const paths = [...document.querySelectorAll('.orbit-label-path')];
              paths.forEach((path) => {
                const label = path.querySelector('.role-planet');
                const duration = parseFloat(getComputedStyle(path).animationDuration);
                path.style.animationDelay = `-${duration * fraction}s`;
                label.style.animationDelay = `-${duration * fraction}s`;
                path.style.animationPlayState = 'paused';
                label.style.animationPlayState = 'paused';
              });
              return paths.map((path) => {
                const label = path.querySelector('.role-planet').getBoundingClientRect();
                return label.left >= stage.left - 2 && label.right <= stage.right + 2 && label.top >= stage.top - 2 && label.bottom <= stage.bottom + 2;
              });
            }""",
            phase,
        )
        assert containment == [True, True, True], f"Orbit label escaped the stage at phase {phase}: {containment}"


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path="/usr/bin/chromium")
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.goto(URL, wait_until="networkidle")

        assert page.locator(".orbit-foreground").count() == 1
        assert page.locator(".orbit-label-path").count() == 3
        z_layers = page.evaluate(
            """() => ({
              foreground: getComputedStyle(document.querySelector('.orbit-foreground')).zIndex,
              portrait: getComputedStyle(document.querySelector('.portrait-orb')).zIndex,
            })"""
        )
        assert int(z_layers["foreground"]) > int(z_layers["portrait"])
        assert_no_portrait_collisions(page)
        assert_labels_stay_in_stage(page)

        page.hover(".stage-scene")
        states = page.locator(".orbit-label-path").evaluate_all("nodes => nodes.map(node => getComputedStyle(node).animationPlayState)")
        assert states == ["paused", "paused", "paused"], states

        hero_credential = page.locator(".kicker").text_content() or ""
        about_copy = page.locator(".about-copy").inner_text()
        assert "IIT Madras" in hero_credential and "Indian Institute" not in hero_credential, hero_credential
        assert "Indian Institute of Technology Madras" in about_copy
        assert page.locator('img[src*="iitm-madras-supplied-logo"]').count() == 1

        learning_titles = page.locator(".learning-card h3").all_text_contents()
        assert learning_titles == ["AI / ML", "DSA / CP", "System Design", "Cloud Architecture"], learning_titles

        mobile = browser.new_page(viewport={"width": 375, "height": 812})
        mobile.goto(URL, wait_until="networkidle")
        assert mobile.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
        assert_no_portrait_collisions(mobile)
        assert_labels_stay_in_stage(mobile)

        reduced = browser.new_page(viewport={"width": 1280, "height": 900})
        reduced.emulate_media(reduced_motion="reduce")
        reduced.goto(URL, wait_until="networkidle")
        durations = reduced.locator(".orbit-label-path").evaluate_all("nodes => nodes.map(node => getComputedStyle(node).animationDuration)")
        assert all(duration in {"0.01ms", "1e-05s"} for duration in durations), durations

        browser.close()
        print("hero_refinement_check: PASS")


if __name__ == "__main__":
    main()
