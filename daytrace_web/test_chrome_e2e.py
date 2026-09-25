import asyncio
from playwright.async_api import async_playwright
import os

SCREENSHOTS_DIR = "/home/valtooy/.gemini/antigravity-ide/brain/f8415b28-1dc8-4b3e-a071-79e31dbeb249/screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

async def test_daytrace():
    print("Launching Chrome browser...")
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

        print("1. Loading http://localhost:5173/ ...")
        await page.goto("http://localhost:5173/", wait_until="networkidle")
        await asyncio.sleep(1)

        # 1. Today Page Screenshot
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/01_today_screen.png")
        print("Captured: 01_today_screen.png")

        # 2. Toggle Hydration Habit
        print("2. Toggling habit...")
        habits = await page.query_selector_all("section div.cursor-pointer")
        if len(habits) >= 3:
            await habits[2].click()
            await asyncio.sleep(0.5)
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/02_habit_toggled.png")
            print("Captured: 02_habit_toggled.png")

        # 3. Add Activity in Quick Log modal
        print("3. Opening Quick Log Modal...")
        log_btn = await page.query_selector("nav button.group") or await page.query_selector("nav button:has-text('Log')")
        if log_btn:
            await log_btn.click()
            await asyncio.sleep(0.6)
            
            # Click and fill title
            inp = await page.wait_for_selector("form input[type='text']")
            await inp.click()
            await inp.fill("Build Full Chrome Verified Flow")
            await asyncio.sleep(0.3)
            
            # Submit
            submit_btn = await page.query_selector("button:has-text('Log Activity')")
            await submit_btn.click()
            await asyncio.sleep(1.2)
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/03_activity_saved.png")
            print("Captured: 03_activity_saved.png")

        # 4. Navigate to Money tab
        print("4. Navigating to Money Hub...")
        money_tab = await page.query_selector("nav button:has-text('Money')")
        if money_tab:
            await money_tab.click()
            await asyncio.sleep(0.8)
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/04_money_screen.png")
            print("Captured: 04_money_screen.png")

        # 5. Switch Currency to INR (₹)
        print("5. Switching Currency to Indian Rupee (INR)...")
        curr_picker = await page.query_selector("button[title='Change Currency']")
        if curr_picker:
            await curr_picker.click()
            await asyncio.sleep(0.4)
            inr_opt = await page.wait_for_selector("button:has-text('INR')")
            await inr_opt.click()
            await asyncio.sleep(0.5)
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/05_money_inr_currency.png")
            print("Captured: 05_money_inr_currency.png")

        # 6. Add Expense in Money Hub
        print("6. Adding Expense...")
        top_log_btn = await page.query_selector("main button:has-text('Log')")
        if top_log_btn:
            await top_log_btn.click()
            await asyncio.sleep(0.5)
            
            amt_input = await page.wait_for_selector("input[type='number']")
            await amt_input.click()
            await amt_input.fill("850.50")
            
            desc_input = await page.wait_for_selector("input[placeholder*='Merchant']")
            await desc_input.click()
            await desc_input.fill("Taj Chai & Samosa")
            
            submit_tx = await page.wait_for_selector("button:has-text('Log Transaction')")
            await submit_tx.click()
            await asyncio.sleep(1.2)
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/06_expense_added_inr.png")
            print("Captured: 06_expense_added_inr.png")

        # 7. Open Share / Paper Report Modal in Money Hub
        print("7. Testing Share / Paper Report Modal...")
        share_btn = await page.query_selector("header button[title*='Report']")
        if share_btn:
            await share_btn.click()
            await asyncio.sleep(0.6)
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/07_money_paper_report.png")
            print("Captured: 07_money_paper_report.png")
            
            # Close modal
            close_btn = await page.query_selector("button:has-text('close')")
            if close_btn:
                await close_btn.click()
                await asyncio.sleep(0.4)

        # 8. Navigate to Timeline Hub
        print("8. Navigating to Timeline...")
        timeline_tab = await page.query_selector("nav button:has-text('Timeline')")
        if timeline_tab:
            await timeline_tab.click()
            await asyncio.sleep(0.8)
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/08_timeline_screen.png")
            print("Captured: 08_timeline_screen.png")

        # 9. Navigate to Memories Hub
        print("9. Navigating to Memories...")
        memories_tab = await page.query_selector("nav button:has-text('Memories')")
        if memories_tab:
            await memories_tab.click()
            await asyncio.sleep(0.8)
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/09_memories_screen.png")
            print("Captured: 09_memories_screen.png")

        # 10. Open Settings
        print("10. Navigating to Settings...")
        settings_btn = await page.query_selector("header button[title*='Settings']")
        if settings_btn:
            await settings_btn.click()
            await asyncio.sleep(0.8)
            await page.screenshot(path=f"{SCREENSHOTS_DIR}/10_settings_screen.png")
            print("Captured: 10_settings_screen.png")

        await browser.close()
        print("COMPLETE: All Chrome browser tests executed successfully!")

if __name__ == "__main__":
    asyncio.run(test_daytrace())
