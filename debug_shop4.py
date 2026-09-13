import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(record_video_dir="videos/")
        page = await context.new_page()

        print("Navigating to landing page...")
        await page.goto("http://localhost:4173")
        await page.wait_for_timeout(2000)

        await page.screenshot(path="debug_landing1.png")

        # Click login link since header has "Log In" explicitly if guest
        print("Clicking login nav link...")
        await page.click("a.login-nav-link >> visible=true")
        await page.wait_for_timeout(2000)

        await page.screenshot(path="debug_login1.png")

        # We know testbuyer123 was registered in the previous run. Let's try logging in
        print("Logging in...")
        await page.fill("#auth-username", "testbuyer123")
        await page.fill("#auth-password", "password")
        await page.click("button:has-text('Sign in now')")
        await page.wait_for_timeout(3000)

        await page.screenshot(path="debug_post_login.png")

        print("Clicking CTA...")
        # Now click CTA
        await page.click("a.cta-button >> visible=true")
        await page.wait_for_timeout(2000)

        await page.screenshot(path="debug_shop_page.png")

        content = await page.content()
        with open("shop_page_logged_in.html", "w") as f:
            f.write(content)

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
