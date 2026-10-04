"""
ETC (Ethical Coders) - Multi-Device Playwright Automated Test Suite
Validates Desktop (1920x1080), Tablet (768x1024), Mobile Large (390x844), and Mobile Small (360x640).
"""
import os
import time
from playwright.sync_api import sync_playwright

def test_all_devices():
    os.makedirs('tests/screenshots', exist_ok=True)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # 1. Desktop Viewport (1920x1080)
        print("=== Test 1: Desktop Viewport (1920x1080) ===")
        context_desktop = browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            permissions=['clipboard-read', 'clipboard-write']
        )
        page_desk = context_desktop.new_page()
        page_desk.goto('http://localhost:8000/webpage/', wait_until='networkidle')
        
        # Verify Title & Brand
        title = page_desk.title()
        print(f"Page Title: {title}")
        assert "ETC" in title
        
        # Check brand logo
        logo = page_desk.locator('.brand-logo-img')
        assert logo.is_visible(), "Brand logo is visible"
        
        # Verify Headline
        headline = page_desk.locator('.hero-headline').inner_text()
        print(f"Headline: {headline}")
        assert "Where Challenges" in headline
        assert "Become Skills" in headline
        
        # Verify Navigation links are clean and have MEMBERS
        nav_text = page_desk.locator('.nav-links').inner_text()
        print(f"Nav Links: {nav_text.replace(chr(10), ' | ')}")
        assert "ABOUT" in nav_text
        assert "MEMBERS" in nav_text
        assert "[01]" not in nav_text
        
        # Check 6 team members
        member_cards = page_desk.locator('.member-card')
        assert member_cards.count() == 6, f"Expected 6 members, got {member_cards.count()}"
        print(f"Verified {member_cards.count()} team members!")
        
        # Check Writeup Modal Reader
        writeup_cards = page_desk.locator('.writeup-card')
        assert writeup_cards.count() >= 3
        writeup_cards.first.click()
        time.sleep(0.4)
        modal = page_desk.locator('#writeup-modal')
        assert modal.is_visible(), "Writeup modal should open"
        page_desk.locator('#btn-close-modal').click()
        time.sleep(0.3)
        assert not modal.is_visible(), "Writeup modal closed"
        print("Writeup modal reader verified!")
        
        page_desk.screenshot(path='tests/screenshots/desktop_portfolio.png', full_page=True)
        print("Saved Desktop screenshot.")

        # 2. Tablet Viewport (768x1024)
        print("\n=== Test 2: Tablet Viewport (768x1024) ===")
        context_tab = browser.new_context(viewport={'width': 768, 'height': 1024})
        page_tab = context_tab.new_page()
        page_tab.goto('http://localhost:8000/webpage/', wait_until='networkidle')
        scroll_w_tab = page_tab.evaluate('document.documentElement.scrollWidth')
        assert scroll_w_tab <= 768 + 1, f"Tablet horizontal overflow: {scroll_w_tab}px"
        page_tab.screenshot(path='tests/screenshots/tablet_portfolio.png', full_page=True)
        print("Tablet layout verified (0 horizontal overflow).")

        # 3. Mobile Large Viewport (390x844 - iPhone 14)
        print("\n=== Test 3: Mobile Large Viewport (390x844) ===")
        context_mobile = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        page_mob = context_mobile.new_page()
        page_mob.goto('http://localhost:8000/webpage/', wait_until='networkidle')
        
        scroll_w_mob = page_mob.evaluate('document.documentElement.scrollWidth')
        assert scroll_w_mob <= 390 + 1, f"Mobile horizontal overflow: {scroll_w_mob}px"
        
        # Test Mobile Menu
        menu_btn = page_mob.locator('#btn-mobile-menu')
        assert menu_btn.is_visible()
        menu_btn.click()
        time.sleep(0.3)
        drawer = page_mob.locator('#mobile-nav-drawer')
        assert 'is-open' in drawer.get_attribute('class')
        page_mob.locator('.mobile-nav-link').first.click()
        time.sleep(0.3)
        print("Mobile navigation drawer verified!")
        
        page_mob.screenshot(path='tests/screenshots/mobile_portfolio.png', full_page=True)
        print("Saved Mobile Large screenshot.")

        # 4. Mobile Small Viewport (360x640)
        print("\n=== Test 4: Mobile Small Viewport (360x640) ===")
        context_mob_small = browser.new_context(viewport={'width': 360, 'height': 640}, is_mobile=True, has_touch=True)
        page_mob_small = context_mob_small.new_page()
        page_mob_small.goto('http://localhost:8000/webpage/', wait_until='networkidle')
        scroll_w_sm = page_mob_small.evaluate('document.documentElement.scrollWidth')
        assert scroll_w_sm <= 360 + 1, f"Small mobile horizontal overflow: {scroll_w_sm}px"
        print("Small mobile layout verified (0 horizontal overflow).")
        
        browser.close()
        print("\n ALL MULTI-DEVICE PLAYWRIGHT TESTS PASSED WITH 100% SUCCESS!")

if __name__ == '__main__':
    test_all_devices()
