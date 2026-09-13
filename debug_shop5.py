import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(record_video_dir="videos/")
        page = await context.new_page()

        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

        print("Navigating to landing page...")
        await page.goto("http://localhost:4173")
        await page.wait_for_timeout(2000)

        # Click login link
        print("Clicking login nav link...")
        await page.click("a.login-nav-link >> visible=true")
        await page.wait_for_timeout(2000)

        # We need to make sure testbuyer123 actually works, let's create a new unique one to be 100% sure
        import uuid
        uid = str(uuid.uuid4())[:8]
        username = f"buyer_{uid}"

        print("Creating account...")
        await page.click("button:has-text('Create an account')")
        await page.wait_for_timeout(500)
        await page.fill("#auth-username", username)
        await page.fill("#auth-email", f"{username}@test.com")
        await page.fill("#auth-password", "password")
        await page.select_option("#auth-role", "BUYER")
        await page.click("button:has-text('Create account now')")
        await page.wait_for_timeout(2000)

        print(f"Logging in as {username}...")
        await page.fill("#auth-username", username)
        await page.fill("#auth-password", "password")
        await page.click("button:has-text('Sign in now')")
        await page.wait_for_timeout(4000)

        await page.screenshot(path="debug_landing_after_login.png")

        print("Clicking Shop CTA...")
        await page.click("a.cta-button >> visible=true")
        await page.wait_for_timeout(2000)

        await page.screenshot(path="debug_shop_page.png")

        print("Input elements:")
        inputs = await page.locator("input").element_handles()
        for i in inputs:
            placeholder = await i.get_attribute("placeholder")
            print(f"Placeholder: {placeholder}")

        await context.close()
        await browser.close()
        print("Done!")

if __name__ == "__main__":
    asyncio.run(main())
