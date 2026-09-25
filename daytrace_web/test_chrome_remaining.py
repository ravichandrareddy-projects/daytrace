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

        # 4. Navigate to Money tab
        print("4. Navigating to Money Hub...")
        money_tab = await page.wait_for_selector("nav button:has-text('Money')")
        await money_tab.click()
        await asyncio.sleep(0.8)

        # 5. Switch Currency to INR (₹)
        print("5. Switching Currency to Indian Rupee (INR)...")
        curr_picker = await page.wait_for_selector("button[title='Change Currency']")
        await curr_picker.click()
        await asyncio.sleep(0.4)
        inr_opt = await page.wait_for_selector("button:has-text('INR')")
        await inr_opt.click()
        await asyncio.sleep(0.5)

        # 6. Add Expense in Money Hub
        print("6. Adding Expense in INR...")
        # Open Quick Log via central '+' button
        plus_btn = await page.wait_for_selector("nav button.group")
        await plus_btn.click()
        await asyncio.sleep(0.6)

        # Click Money tab in modal
        money_pill = await page.wait_for_selector(".animate-slideUp button:has-text('Money')")
        await money_pill.click()
        await asyncio.sleep(0.5)

        # Fill amount and title
        amt_input = await page.wait_for_selector("form input[type='number']")
        await amt_input.click()
        await amt_input.fill("1450.00")

        title_input = await page.wait_for_selector("form input[type='text']")
        await title_input.click()
        await title_input.fill("Taj Chai & Street Delicacies")

        # Submit expense
        submit_tx = await page.wait_for_selector("button:has-text('Log Transaction')")
        await submit_tx.click()
        await asyncio.sleep(1.2)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/06_money_expense_added_inr.png")
        print("Captured: 06_money_expense_added_inr.png")

        # 7. Open Share / Paper Report Modal in Money Hub
        print("7. Testing Share / Paper Report Modal in Money Hub...")
        share_btn = await page.wait_for_selector("header button[title*='Report']")
        await share_btn.click()
        await asyncio.sleep(0.6)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/07_money_paper_report.png")
        print("Captured: 07_money_paper_report.png")

        # Close report modal
        close_btn = await page.wait_for_selector("button:has-text('close')")
        await close_btn.click()
        await asyncio.sleep(0.5)

        # 8. Navigate to Timeline Hub
        print("8. Navigating to Timeline...")
        timeline_tab = await page.wait_for_selector("nav button:has-text('Timeline')")
        await timeline_tab.click()
        await asyncio.sleep(0.8)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/08_timeline_screen.png")
        print("Captured: 08_timeline_screen.png")

        # 9. Navigate to Memories Hub
        print("9. Navigating to Memories...")
        memories_tab = await page.wait_for_selector("nav button:has-text('Memories')")
        await memories_tab.click()
        await asyncio.sleep(0.8)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/09_memories_screen.png")
        print("Captured: 09_memories_screen.png")

        # 10. Open Settings
        print("10. Navigating to Settings...")
        settings_btn = await page.wait_for_selector("header button[title*='Settings']")
        await settings_btn.click()
        await asyncio.sleep(0.8)
        await page.screenshot(path=f"{SCREENSHOTS_DIR}/10_settings_screen.png")
        print("Captured: 10_settings_screen.png")

        await browser.close()
        print("ALL TESTS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(test_daytrace())
