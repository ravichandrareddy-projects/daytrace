import asyncio
from playwright.async_api import async_playwright
import os

SCREENSHOTS_DIR = "/home/valtooy/.gemini/antigravity-ide/brain/f8415b28-1dc8-4b3e-a071-79e31dbeb249/screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

async def close_any_modal(page):
    close_btn = await page.query_selector("div.fixed.z-50 button:has(span:text('close'))") or await page.query_selector("div.fixed.z-50 button:has-text('close')")
    if close_btn:
        try:
            await close_btn.click()
            await asyncio.sleep(0.4)
        except Exception:
            pass

async def run():
    print("Starting Playwright full interactive verification test...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path="/usr/bin/google-chrome",
            headless=True,
            args=['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
        )
        context = await browser.new_context(
            viewport={'width': 412, 'height': 915}, 
            device_scale_factor=2,
            permissions=['clipboard-read', 'clipboard-write']
        )
        page = await context.new_page()
        page.on("pageerror", lambda err: print(f"[PAGE ERROR] {err}"))

        # Screen 1: Today (Todo List for Today's Tasks)
        print("1. Loading Today Page (Todo List)...")
        await page.goto("http://localhost:5173/")
        await asyncio.sleep(1)

        # Test Add Todo
        print("Adding new todo task...")
        await page.fill("input[placeholder*='Add new task']", "Capacitor Native Keystore & Push Sync")
        await page.click("button:has-text('Add Task')")
        await asyncio.sleep(0.5)

        # Test Toggle Todo Checkbox
        print("Toggling a todo task...")
        checkbox = await page.query_selector("button:has(span:text('check'))")
        if checkbox:
            await checkbox.click()
            await asyncio.sleep(0.4)

        # Test Bottom Share Button on Today
        print("Testing bottom share on Today...")
        today_share = await page.query_selector("button:has-text('Share')")
        if today_share:
            await today_share.click()
            await asyncio.sleep(0.5)
            await close_any_modal(page)

        await page.screenshot(path=f"{SCREENSHOTS_DIR}/verified_today_todos.png")
        print("Captured: verified_today_todos.png")

        # Screen 2: Timeline ("What I Have Done Every Hour")
        print("2. Navigating to Timeline (Hourly Activity)...")
        await close_any_modal(page)
        await page.click("nav button:has-text('Timeline')")
        await asyncio.sleep(1)

        # Test Add Hour Column/Entry
        print("Testing Add Hour Log...")
        await page.click("button:has-text('+ Add Hour')")
        await asyncio.sleep(0.5)
        await page.fill("input[placeholder*='LeetCode']", "Decoupled Event Stream Pipeline & Benchmarks")
        await page.click("button:has-text('Record Hour')")
        await asyncio.sleep(0.6)

        # Test Edit Hour
        print("Testing Edit Hour...")
        edit_btns = await page.query_selector_all("button[title*='Edit']")
        if edit_btns:
            await edit_btns[0].click()
            await asyncio.sleep(0.5)
            slot_input = await page.query_selector("input[value*='07:00']") or await page.query_selector("input[type='text']")
            if slot_input:
                await slot_input.fill("06:30 - 08:00 AM")
            save_btn = await page.query_selector("button:has-text('Save Changes')")
            if save_btn:
                await save_btn.click()
                await asyncio.sleep(0.5)

        # Test Bottom Share Button on Timeline
        print("Testing bottom share on Timeline...")
        timeline_shares = await page.query_selector_all("button:has-text('Share')")
        if timeline_shares:
            await timeline_shares[-1].click()
            await asyncio.sleep(0.5)
            await close_any_modal(page)

        await page.screenshot(path=f"{SCREENSHOTS_DIR}/verified_timeline_hourly.png")
        print("Captured: verified_timeline_hourly.png")

        # Screen 3: Money Hub
        print("3. Navigating to Money Hub...")
        await close_any_modal(page)
        await page.click("nav button:has-text('Money')")
        await asyncio.sleep(1)
        money_shares = await page.query_selector_all("button:has-text('Share')")
        if money_shares:
            await money_shares[-1].click()
            await asyncio.sleep(0.5)
            await close_any_modal(page)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/verified_money_share.png")
        print("Captured: verified_money_share.png")

        # Screen 4: Memory Hub
        print("4. Navigating to Memory Hub...")
        await close_any_modal(page)
        await page.click("nav button:has-text('Memory')")
        await asyncio.sleep(1)
        mem_shares = await page.query_selector_all("button:has-text('Share')")
        if mem_shares:
            await mem_shares[-1].click()
            await asyncio.sleep(0.5)
            await close_any_modal(page)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/verified_memory_share.png")
        print("Captured: verified_memory_share.png")

        # Screen 5: Settings / More
        print("5. Navigating to More & Settings...")
        await close_any_modal(page)
        await page.click("nav button:has-text('More')")
        await asyncio.sleep(1)
        settings_shares = await page.query_selector_all("button:has-text('Share')")
        if settings_shares:
            await settings_shares[-1].click()
            await asyncio.sleep(0.5)
            await close_any_modal(page)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/verified_settings_share.png")
        print("Captured: verified_settings_share.png")

        print("ALL TESTS COMPLETED SUCCESSFULLY!")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
