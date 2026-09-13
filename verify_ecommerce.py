import asyncio
from playwright.async_api import async_playwright
import uuid

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(record_video_dir="videos/")
        page = await context.new_page()

        print("Navigating to landing page...")
        await page.goto("http://localhost:4173")
        await page.wait_for_timeout(2000)

        await page.screenshot(path="landing.png")
        print("Landing page loaded.")

        # Click login to register
        print("Navigating to login to register...")
        await page.click("a.login-nav-link >> visible=true")
        await page.wait_for_timeout(2000)

        print("At login page. Registering user...")
        # Toggle to Register
        if await page.locator("button:has-text('Create an account')").count() > 0:
            await page.click("button:has-text('Create an account')")
            await page.wait_for_timeout(1000)

        # Generate unique user for test
        uid_buyer = str(uuid.uuid4())[:8]
        buyer_user = f"buyer_{uid_buyer}"

        await page.fill("#auth-username", buyer_user)
        await page.fill("#auth-email", f"{buyer_user}@example.com")
        await page.fill("#auth-password", "password")
        await page.select_option("#auth-role", "BUYER")
        await page.screenshot(path="register.png")

        await page.click("button:has-text('Create account now')")
        await page.wait_for_timeout(2000)

        print(f"Logging in as {buyer_user}...")
        await page.fill("#auth-username", buyer_user)
        await page.fill("#auth-password", "password")
        await page.click("button:has-text('Sign in now')")
        await page.wait_for_timeout(4000)

        print("Navigating to Shop page via CTA...")
        await page.click("a.cta-button >> visible=true")
        await page.wait_for_timeout(2000)

        print("Checking if on shop page...")
        await page.screenshot(path="shop.png")

        if await page.locator("input[placeholder='Search cuts...']").count() > 0:
            await page.fill("input[placeholder='Search cuts...']", "Beef")
            await page.wait_for_timeout(1000)
            await page.screenshot(path="shop_search.png")
            print("Found search bar and searched.")
        else:
            print("Search bar not found!")
            raise Exception("Search bar not found! Shop page failed to load.")

        await context.close()
        await browser.close()
        print("Done!")

if __name__ == "__main__":
    asyncio.run(main())
