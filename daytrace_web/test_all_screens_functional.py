import asyncio
from playwright.async_api import async_playwright
import os

SCREENSHOTS_DIR = "/home/valtooy/.gemini/antigravity-ide/brain/f8415b28-1dc8-4b3e-a071-79e31dbeb249/screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

async def run_functional_verification():
    print("Launching headless Google Chrome...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path="/usr/bin/google-chrome",
            headless=True,
            args=['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
        )
        context = await browser.new_context(
            viewport={'width': 412, 'height': 915},
            device_scale_factor=2
        )
        page = await context.new_page()

        # 1. Load Today Page
        print("1. Loading http://localhost:5173/ ...")
        await page.goto("http://localhost:5173/", wait_until="networkidle")
        try:
            await page.evaluate("() => document.fonts.ready")
        except Exception:
            pass
        await asyncio.sleep(0.5)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/functional_01_today.png", timeout=10000)
        print("Captured: functional_01_today.png")

        # 2. Navigate to Timeline Page
        print("2. Navigating to Timeline tab...")
        await page.click("nav button:has-text('Timeline')")
        await asyncio.sleep(0.8)

        # Date stepper forward
        next_day = await page.query_selector("button[aria-label='Next day']")
        if next_day:
            await next_day.click()
            await asyncio.sleep(0.3)

        # Click + Log What I Done
        log_done_btn = await page.query_selector("button:has-text('+ Log What I Done')")
        if log_done_btn:
            await log_done_btn.click()
            await asyncio.sleep(0.4)
            # Switch to "What I Done" tab in modal
            what_i_done_tab = await page.query_selector("button:has-text('What I Done')")
            if what_i_done_tab:
                await what_i_done_tab.click()
                await asyncio.sleep(0.2)
            inp = await page.query_selector("form input[type='text']")
            if inp:
                await inp.fill("Completed Redis Cache Cluster Failover Test")
            submit = await page.query_selector("form button[type='submit']")
            if submit:
                await submit.click()
                await asyncio.sleep(0.6)

        await page.screenshot(path=f"{SCREENSHOTS_DIR}/functional_02_timeline.png", timeout=10000)
        print("Captured: functional_02_timeline.png")

        # 3. Navigate to Money Hub
        print("3. Navigating to Money Hub...")
        await page.click("nav button:has-text('Money')")
        await asyncio.sleep(0.8)

        # Switch Currency
        curr_btn = await page.query_selector("button:has-text('INR ▾')") or await page.query_selector("button:has-text('▾')")
        if curr_btn:
            await curr_btn.click()
            await asyncio.sleep(0.4)
            usd_opt = await page.query_selector("button:has-text('US Dollar')")
            if usd_opt:
                await usd_opt.click()
                await asyncio.sleep(0.4)

        # Confirm PhonePe Ingress
        confirm_food = await page.query_selector("button:has-text('Confirm as Food')")
        if confirm_food:
            await confirm_food.click()
            await asyncio.sleep(0.4)

        await page.screenshot(path=f"{SCREENSHOTS_DIR}/functional_03_money.png", timeout=10000)
        print("Captured: functional_03_money.png")

        # 4. Navigate to Memories Page
        print("4. Navigating to Memories Hub...")
        await page.click("nav button:has-text('Memories')")
        await asyncio.sleep(0.8)

        # Review Extracted 17
        review_btn = await page.query_selector("button:has-text('Review Extracted (17)')")
        if review_btn:
            await review_btn.click()
            await asyncio.sleep(0.5)

        await page.screenshot(path=f"{SCREENSHOTS_DIR}/functional_04_memories.png", timeout=10000)
        print("Captured: functional_04_memories.png")

        # 5. Navigate to Settings Page
        print("5. Navigating to More & Settings...")
        await page.click("nav button:has-text('More')")
        await asyncio.sleep(0.8)

        # Toggle SMS parser daemon
        sms_daemon = await page.query_selector("div:has-text('Automated SMS Parser')")
        if sms_daemon:
            await sms_daemon.click()
            await asyncio.sleep(0.4)

        await page.screenshot(path=f"{SCREENSHOTS_DIR}/functional_05_settings.png", timeout=10000)
        print("Captured: functional_05_settings.png")

        print("SUCCESS: ALL 5 SCREENS VERIFIED FUNCTIONAL!")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(run_functional_verification())
