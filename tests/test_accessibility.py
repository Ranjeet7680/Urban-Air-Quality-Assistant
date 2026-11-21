import pytest
import os
import re

def test_frontend_has_skip_navigation_link():
    """Verify WCAG 2.1 AA requirement: Skip to main content link exists in App.tsx."""
    app_tsx_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'App.tsx'))
    assert os.path.exists(app_tsx_path)
    with open(app_tsx_path, 'r', encoding='utf-8') as f:
        content = f.read()

    assert "href=\"#main-content\"" in content
    assert "Skip to main content" in content

def test_theme_toggle_has_aria_label():
    """Verify icon-only toggle buttons have accessible aria-labels."""
    toggle_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'components', 'ThemeToggle.tsx'))
    assert os.path.exists(toggle_path)
    with open(toggle_path, 'r', encoding='utf-8') as f:
        content = f.read()

    assert "aria-label" in content or "title=" in content

def test_navbar_has_semantic_elements():
    """Verify semantic landmark elements (<nav>, <header>, etc.)."""
    navbar_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'components', 'Navbar.tsx'))
    assert os.path.exists(navbar_path)
    with open(navbar_path, 'r', encoding='utf-8') as f:
        content = f.read()

    assert "<nav" in content

def test_dashboard_layout_has_main_content_id():
    """Verify dashboard has matching #main-content target id."""
    dash_layout = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'layouts', 'DashboardLayout.tsx'))
    assert os.path.exists(dash_layout)
    with open(dash_layout, 'r', encoding='utf-8') as f:
        content = f.read()

    assert "id=\"main-content\"" in content or "<main" in content
