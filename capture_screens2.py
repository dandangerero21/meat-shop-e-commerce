import asyncio
from playwright.async_api import async_playwright
import uuid

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # Capture Buyer flow
        context1 = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page1 = await context1.new_page()

        print("Capturing Landing Page...")
        await page1.goto("http://localhost:4173")
        await page1.wait_for_timeout(2000)
        await page1.screenshot(path="screenshot_landing.png", full_page=True)

        print("Capturing Login Page...")
        await page1.click("a.login-nav-link >> visible=true")
        await page1.wait_for_timeout(2000)
        await page1.screenshot(path="screenshot_login.png", full_page=True)

        print("Creating Buyer Account...")
        uid_buyer = str(uuid.uuid4())[:8]
        buyer_user = f"buyer_{uid_buyer}"

        await page1.click("button:has-text('Create an account')")
        await page1.wait_for_timeout(500)
        await page1.fill("#auth-username", buyer_user)
        await page1.fill("#auth-email", f"{buyer_user}@test.com")
        await page1.fill("#auth-password", "password")
        await page1.select_option("#auth-role", "BUYER")
        await page1.click("button:has-text('Create account now')")
        await page1.wait_for_timeout(2000)

        print(f"Logging in as {buyer_user}...")
        await page1.fill("#auth-username", buyer_user)
        await page1.fill("#auth-password", "password")
        await page1.click("button:has-text('Sign in now')")
        await page1.wait_for_timeout(4000)

        print("Capturing Shop Page...")
        await page1.click("a.cta-button >> visible=true")
        await page1.wait_for_timeout(2000)
        await page1.screenshot(path="screenshot_shop.png", full_page=True)

        await context1.close()

        # Capture Seller flow
        context2 = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page2 = await context2.new_page()

        print("Navigating to login page for Seller...")
        await page2.goto("http://localhost:4173")
        await page2.wait_for_timeout(2000)
        await page2.click("a.login-nav-link >> visible=true")
        await page2.wait_for_timeout(2000)

        print("Creating Seller Account...")
        uid_seller = str(uuid.uuid4())[:8]
        seller_user = f"seller_{uid_seller}"

        await page2.click("button:has-text('Create an account')")
        await page2.wait_for_timeout(500)
        await page2.fill("#auth-username", seller_user)
        await page2.fill("#auth-email", f"{seller_user}@test.com")
        await page2.fill("#auth-password", "password")
        await page2.select_option("#auth-role", "SELLER")
        await page2.click("button:has-text('Create account now')")
        await page2.wait_for_timeout(2000)

        print(f"Logging in as {seller_user}...")
        await page2.fill("#auth-username", seller_user)
        await page2.fill("#auth-password", "password")
        await page2.click("button:has-text('Sign in now')")
        await page2.wait_for_timeout(4000)

        print("Capturing Seller Dashboard...")
        await page2.screenshot(path="screenshot_seller_dashboard.png", full_page=True)

        await context2.close()
        await browser.close()
        print("Done!")

if __name__ == "__main__":
    asyncio.run(main())
