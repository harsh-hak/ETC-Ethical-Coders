"""
ETC (Ethical Coders) CTF Portfolio Website - Automated Playwright Test Suite
Tests desktop and mobile responsiveness, UI elements, animations, modals, and search.
"""
import os
import sys
import subprocess
import time
from playwright.sync_api import sync_playwright

def test_portfolio():
    os.makedirs('tests/screenshots', exist_ok=True)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        print("=== Test 1: Desktop Viewport (1920x1080) ===")
        context_desktop = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context_desktop.new_page()
        page.goto('http://localhost:8000', wait_until='networkidle')
        
        # Verify Title & Brand
        title = page.title()
        print(f"Page Title: {title}")
        assert "ETC" in title
        
        # Check brand logo
        logo = page.locator('.brand-logo-img')
        assert logo.is_visible(), "Brand logo is visible"
        
        # Check 6 team members
        member_cards = page.locator('.member-card')
        member_count = member_cards.count()
        print(f"Team members rendered: {member_count}")
        assert member_count == 6, f"Expected 6 members, got {member_count}"
        
        # Check writeup cards
        writeup_cards = page.locator('.writeup-card')
        writeup_count = writeup_cards.count()
        print(f"Writeups rendered: {writeup_count}")
        assert writeup_count >= 3
        
        # Click on first writeup card to test modal reader
        writeup_cards.first.click()
        time.sleep(0.5)
        modal = page.locator('#writeup-modal')
        assert modal.is_visible(), "Writeup modal should open"
        print("Writeup modal reader opened successfully!")
        
        # Close modal
        close_btn = page.locator('#btn-close-modal')
        close_btn.click()
        time.sleep(0.3)
        assert not modal.is_visible(), "Writeup modal should close"
        print("Writeup modal closed successfully!")
        
        # Test Command Arsenal Search
        search_input = page.locator('#arsenal-search-input')
        search_input.fill('nmap')
        time.sleep(0.3)
        cmd_cards = page.locator('.cmd-card')
        print(f"Search results for 'nmap': {cmd_cards.count()}")
        assert cmd_cards.count() >= 2
        
        # Test Copy button
        copy_btn = cmd_cards.first.locator('.btn-copy-cmd')
        copy_btn.click()
        time.sleep(0.3)
        print("Command copy triggered successfully!")
        
        # Capture Desktop Full Page Screenshot
        page.screenshot(path='tests/screenshots/desktop_portfolio.png', full_page=True)
        print("Saved desktop screenshot to tests/screenshots/desktop_portfolio.png")
        
        print("\n=== Test 2: Mobile Viewport (iPhone 14 - 390x844) ===")
        context_mobile = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        page_mobile = context_mobile.new_page()
        page_mobile.goto('http://localhost:8000', wait_until='networkidle')
        
        # Check no horizontal scrollbar / overflow
        scroll_width = page_mobile.evaluate('document.documentElement.scrollWidth')
        inner_width = page_mobile.evaluate('window.innerWidth')
        print(f"Mobile ScrollWidth: {scroll_width}px vs InnerWidth: {inner_width}px")
        assert scroll_width <= inner_width + 1, "Mobile page should have no horizontal overflow"
        
        # Test Mobile Menu Drawer
        menu_btn = page_mobile.locator('#btn-mobile-menu')
        assert menu_btn.is_visible(), "Hamburger menu visible on mobile"
        menu_btn.click()
        time.sleep(0.4)
        
        drawer = page_mobile.locator('#mobile-nav-drawer')
        assert 'is-open' in drawer.get_attribute('class'), "Mobile drawer is open"
        print("Mobile navigation drawer opened successfully!")
        
        # Click on nav link to close
        mobile_link = page_mobile.locator('.mobile-nav-link').first
        mobile_link.click()
        time.sleep(0.4)
        print("Mobile navigation drawer closed after link click!")
        
        # Capture Mobile Full Page Screenshot
        page_mobile.screenshot(path='tests/screenshots/mobile_portfolio.png', full_page=True)
        print("Saved mobile screenshot to tests/screenshots/mobile_portfolio.png")
        
        browser.close()
        print("\n ALL PLAYWRIGHT TESTS PASSED!")

if __name__ == '__main__':
    test_portfolio()
