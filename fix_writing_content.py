#!/usr/bin/env python3
"""Extract ALL article content from writing HTML files"""

import os
import glob
import re

def extract_content_from_html(filepath):
    """Extract content from HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            html_content = f.read()

        title = None

        # Try new structure first (content-body div)
        content_match = re.search(r'<div class="content-body">(.*?)</div>\s*</main>', html_content, re.DOTALL)

        if not content_match:
            # Try old structure (content directly in main)
            # Extract everything from main class="content"
            main_match = re.search(r'<main class="content">(.*?)</main>', html_content, re.DOTALL)
            if main_match:
                main_content = main_match.group(1).strip()
                # Extract the title from the main content h1
                title_in_main = re.search(r'<h1[^>]*>([^<]+)</h1>', main_content)
                if title_in_main:
                    title = title_in_main.group(1).strip()
                # Remove the h1 title from content
                content = re.sub(r'<h1[^>]*>.*?</h1>', '', main_content, count=1).strip()
            else:
                print(f"⚠️  Could not extract content from {filepath}")
                return None, ""
        else:
            # For new structure, try to find title
            title_match = re.search(r'<h1[^>]*class="page-title"[^>]*>([^<]+)</h1>', html_content)
            if title_match:
                title = title_match.group(1).strip()
            content = content_match.group(1).strip()

        # Fallback to filename if no title found
        if not title:
            title = os.path.basename(filepath).replace('.html', '').replace('-', ' ').title()

        # Clean up the content
        content = content.replace('`', '\\`').replace('${', '\\${')
        return title, content
    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")
        return None, None

def main():
    print("📚 Extracting all writing content from HTML files...\n")

    # Define all article files
    articles = {
        'annual-retro': 'annual-retro.html',
        'asset-classes': 'asset-classes.html',
        'business-operating-systems': 'business-operating-systems.html',
        'communities-of-practice': 'communities-of-practice.html',
        'culture': 'culture.html',
        'entropy-golf': 'entropy-golf.html',
        'family-strategy': 'family-strategy.html',
        'growth-strategies': 'growth-strategies.html',
        'health-and-wellness-gear': 'health-and-wellness-gear.html',
        'latticework': 'latticework.html',
        'leadership': 'leadership.html',
        'metrics': 'metrics.html',
        'seven-basic-plots': 'seven-basic-plots.html',
        'talent-investing': 'talent-investing.html',
        'therapy': 'therapy.html',
        'truth': 'truth.html',
        'user-manual': 'user-manual.html',
    }

    # Start building JS content
    js_content = """/**
 * Writing Content Data
 * Contains all writing articles for the SPA
 */

window.writingContent = {
"""

    for key, filename in articles.items():
        filepath = f'/Users/hamin/Documents/GitHub/site/writing/{filename}'

        if os.path.exists(filepath):
            title, content = extract_content_from_html(filepath)
            if title and content:
                js_content += f"""    '{key}': {{
        title: '{title}',
        content: `
{content}
        `
    }},
"""
                print(f"✅ Extracted: {title}")
            else:
                print(f"⚠️  Empty content for {filename}")
        else:
            print(f"❌ File not found: {filepath}")

    # Close the JS object
    js_content = js_content.rstrip(',\n') + '\n};'

    # Write to file
    output_path = '/Users/hamin/Documents/GitHub/site/js/writing-content.js'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"\n✨ Successfully updated {output_path}")
    print("📊 All article content has been extracted!")

if __name__ == "__main__":
    main()