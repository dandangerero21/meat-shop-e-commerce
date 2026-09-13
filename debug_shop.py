import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:4173")
        await page.wait_for_timeout(2000)

        await page.click(".cta-button")
        await page.wait_for_timeout(2000)

        content = await page.content()
        with open("shop_page.html", "w") as f:
            f.write(content)

        print("Input elements:")
        inputs = await page.locator("input").element_handles()
        for i in inputs:
            placeholder = await i.get_attribute("placeholder")
            print(f"Placeholder: {placeholder}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
