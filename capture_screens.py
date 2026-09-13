import asyncio
from playwright.async_api import async_playwright
import uuid

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        print("Capturing Landing Page...")
        await page.goto("http://localhost:4173")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="screenshot_landing.png", full_page=True)

        print("Capturing Login Page...")
        await page.click("a.login-nav-link >> visible=true")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="screenshot_login.png", full_page=True)

        # Create Seller Account
        print("Creating Seller Account...")
        uid_seller = str(uuid.uuid4())[:8]
        seller_user = f"seller_{uid_seller}"

        await page.click("button:has-text('Create an account')")
        await page.wait_for_timeout(500)
        await page.fill("#auth-username", seller_user)
        await page.fill("#auth-email", f"{seller_user}@test.com")
        await page.fill("#auth-password", "password")
        await page.select_option("#auth-role", "SELLER")
        await page.click("button:has-text('Create account now')")
        await page.wait_for_timeout(2000)

        print(f"Logging in as {seller_user}...")
        await page.fill("#auth-username", seller_user)
        await page.fill("#auth-password", "password")
        await page.click("button:has-text('Sign in now')")
        await page.wait_for_timeout(4000)

        print("Capturing Seller Dashboard...")
        # Since seller redirects to seller-dashboard
        await page.screenshot(path="screenshot_seller_dashboard.png", full_page=True)

        print("Logging out...")
        await page.click("button:has-text('Logout')")
        await page.wait_for_timeout(2000)

        # Create Buyer Account
        print("Creating Buyer Account...")
        await page.click("a.login-nav-link >> visible=true")
        await page.wait_for_timeout(2000)

        uid_buyer = str(uuid.uuid4())[:8]
        buyer_user = f"buyer_{uid_buyer}"

        await page.click("button:has-text('Create an account')")
        await page.wait_for_timeout(500)
        await page.fill("#auth-username", buyer_user)
        await page.fill("#auth-email", f"{buyer_user}@test.com")
        await page.fill("#auth-password", "password")
        await page.select_option("#auth-role", "BUYER")
        await page.click("button:has-text('Create account now')")
        await page.wait_for_timeout(2000)

        print(f"Logging in as {buyer_user}...")
        await page.fill("#auth-username", buyer_user)
        await page.fill("#auth-password", "password")
        await page.click("button:has-text('Sign in now')")
        await page.wait_for_timeout(4000)

        print("Capturing Shop Page...")
        await page.click("a.cta-button >> visible=true")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="screenshot_shop.png", full_page=True)

        await context.close()
        await browser.close()
        print("Done!")

if __name__ == "__main__":
    asyncio.run(main())
