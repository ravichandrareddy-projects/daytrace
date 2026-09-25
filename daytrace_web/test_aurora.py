import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 412, 'height': 884},
            device_scale_factor=2
        )
        page = await context.new_page()

        print("Navigating to app...")
        await page.goto("http://localhost:5173/", wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # 1. Capture Today in initial state
        os.makedirs("/home/valtooy/DAYTRACE/daytrace_web/test_screenshots", exist_ok=True)
        await page.screenshot(path="/home/valtooy/DAYTRACE/daytrace_web/test_screenshots/01_today_aurora.png")
        print("Captured 01_today_aurora.png")

        # 2. Navigate to Settings / More
        await page.click('button[aria-label="More"]')
        await page.wait_for_timeout(1500)
        await page.screenshot(path="/home/valtooy/DAYTRACE/daytrace_web/test_screenshots/02_settings_aurora.png")
        print("Captured 02_settings_aurora.png")

        # 3. Click Rainbow White theme
        print("Clicking Rainbow White theme...")
        await page.click('#btn-theme-rainbow')
        await page.wait_for_timeout(1500)
        await page.screenshot(path="/home/valtooy/DAYTRACE/daytrace_web/test_screenshots/03_settings_switched_to_rainbow.png")
        print("Captured 03_settings_switched_to_rainbow.png")

        # 4. Click Aurora Black theme back!
        print("Clicking Aurora Black theme back...")
        await page.click('#btn-theme-aurora')
        await page.wait_for_timeout(1500)
        await page.screenshot(path="/home/valtooy/DAYTRACE/daytrace_web/test_screenshots/04_settings_switched_to_aurora.png")
        print("Captured 04_settings_switched_to_aurora.png")

        # 5. Check Timeline Page with Aurora theme
        await page.click('button[aria-label="Timeline"]')
        await page.wait_for_timeout(1500)
        await page.screenshot(path="/home/valtooy/DAYTRACE/daytrace_web/test_screenshots/05_timeline_aurora.png")
        print("Captured 05_timeline_aurora.png")

        # 6. Check Money Page with Aurora theme
        await page.click('button[aria-label="Money"]')
        await page.wait_for_timeout(1500)
        await page.screenshot(path="/home/valtooy/DAYTRACE/daytrace_web/test_screenshots/06_money_aurora.png")
        print("Captured 06_money_aurora.png")

        # 7. Check Today Page with Aurora theme
        await page.click('button[aria-label="Today"]')
        await page.wait_for_timeout(1500)
        await page.screenshot(path="/home/valtooy/DAYTRACE/daytrace_web/test_screenshots/07_today_aurora_final.png")
        print("Captured 07_today_aurora_final.png")

        # 8. Scroll Today to view Todos & Share Card
        await page.evaluate("window.scrollTo(0, 500)")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="/home/valtooy/DAYTRACE/daytrace_web/test_screenshots/08_today_todos_aurora.png")
        print("Captured 08_today_todos_aurora.png")

        # 9. Open Paper Report Modal on Today
        print("Opening Paper Report Modal...")
        await page.click('button[aria-label="Share today report"]')
        await page.wait_for_timeout(1000)
        await page.screenshot(path="/home/valtooy/DAYTRACE/daytrace_web/test_screenshots/09_paper_report_modal_aurora.png")
        print("Captured 09_paper_report_modal_aurora.png")

        await browser.close()
        print("All extended tests and screenshots complete!")

asyncio.run(main())
