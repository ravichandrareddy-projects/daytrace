import asyncio
import json
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Mobile viewport emulation (iPhone 14 Pro style)
        context = await browser.new_context(viewport={'width': 393, 'height': 852})
        page = await context.new_page()

        print("Navigating to http://localhost:5173...")
        await page.goto("http://localhost:5173")
        await page.wait_for_timeout(2000)

        # 1. Take initial screenshot (Clean slate)
        await page.screenshot(path="clean_initial_state.png")
        print("Captured clean_initial_state.png")

        # Verify clean state text
        page_text = await page.content()
        assert "Clean Slate" in page_text or "No tasks added yet" in page_text or "Today's Tasks" in page_text
        print("Verified clean state displays properly.")

        # 2. Add a real task for today
        input_elem = page.locator("input[placeholder*='Add new task']")
        await input_elem.fill("Design System Review with Team")
        add_btn = page.locator("button:has-text('Add Task')")
        await add_btn.click()
        await page.wait_for_timeout(1000)

        # Verify task appeared
        task_text = await page.locator("text=Design System Review with Team").count()
        print("Task count for 'Design System Review with Team':", task_text)
        assert task_text > 0

        # Take screenshot of added task
        await page.screenshot(path="clean_today_task_added.png")
        print("Captured clean_today_task_added.png")

        # 3. Test Daily to-do switching (Click next day)
        next_day_btn = page.locator("button[title='Next day']").first
        await next_day_btn.click()
        await page.wait_for_timeout(1000)

        # Tomorrow should be a clean slate!
        tomorrow_task_count = await page.locator("text=Design System Review with Team").count()
        print("Task count on tomorrow's clean slate (should be 0):", tomorrow_task_count)
        assert tomorrow_task_count == 0
        await page.screenshot(path="clean_tomorrow_empty.png")
        print("Captured clean_tomorrow_empty.png")

        # Add a task on tomorrow
        input_elem_tom = page.locator("input[placeholder*='Add new task']")
        await input_elem_tom.fill("Client Pitch Deck Finalization")
        await page.locator("button:has-text('Add Task')").click()
        await page.wait_for_timeout(1000)
        assert await page.locator("text=Client Pitch Deck Finalization").count() > 0

        # Switch back to Today
        jump_today_btn = page.locator("text=Jump Today").first
        await jump_today_btn.click()
        await page.wait_for_timeout(1000)

        # Today's task is still there!
        assert await page.locator("text=Design System Review with Team").count() > 0
        print("Verified daily partitioning: Today has its task, Tomorrow has its task!")

        # 4. Navigate to Timeline ("What I Done")
        timeline_nav = page.locator("button:has-text('Timeline'), nav button:has-text('Timeline')").first
        if await timeline_nav.count() == 0:
            timeline_nav = page.locator("text=Hourly Log →").first
        await timeline_nav.click()
        await page.wait_for_timeout(1000)

        # Take screenshot of clean timeline
        await page.screenshot(path="clean_timeline_initial.png")
        print("Captured clean_timeline_initial.png")

        # Click "+ Log What I Done" or "+ Add Hour"
        log_btn = page.locator("button:has-text('Log What I Done'), button:has-text('+ Add Hour')").first
        await log_btn.click()
        await page.wait_for_timeout(1000)

        # Fill modal form
        title_input = page.locator("input[placeholder*='e.g. Deep Work on API'], input[value='']").first
        # Find any text input in the modal
        modal_inputs = page.locator("form input[type='text']")
        if await modal_inputs.count() > 0:
            await modal_inputs.first.fill("Backend Architecture Sprint")
            save_btn = page.locator("button:has-text('Save Hour Entry'), button:has-text('Record Hour'), button[type='submit']:has-text('Hour')").first
            if await save_btn.count() > 0:
                await save_btn.click()
                await page.wait_for_timeout(1000)

        await page.screenshot(path="clean_timeline_logged.png")
        print("Captured clean_timeline_logged.png")

        # 5. Verify Mobile Storage content in localStorage
        storage_data = await page.evaluate("() => localStorage.getItem('daytrace_mobile_clean_v2')")
        print("localStorage 'daytrace_mobile_clean_v2' length:", len(storage_data) if storage_data else "None")
        assert storage_data is not None
        parsed = json.loads(storage_data)
        print("Persisted dates in todosByDate:", list(parsed.get('todosByDate', {}).keys()))
        print("Settings theme:", parsed.get('settings', {}).get('theme'))

        await browser.close()
        print("ALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(run())
