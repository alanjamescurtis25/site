# Google Analytics Setup Guide

## Current Implementation

Your site now has Google Analytics (G-BFD7WNPCNP) installed with internal traffic filtering capabilities.

---

## How to Block Your Own Traffic

### Method 1: Use Debug Mode Parameter (Easiest)

When browsing your own site, add `?ga_debug=1` to the URL:

```
https://your-domain.com?ga_debug=1
https://your-domain.com/bio.html?ga_debug=1
```

This will mark your traffic as "internal" and you can filter it out in GA4 (see setup below).

**Tip**: Bookmark these debug URLs for your regular browsing!

---

### Method 2: Install Browser Extension

Install the **Google Analytics Opt-out Browser Extension**:

- **Chrome/Edge**: https://chrome.google.com/webstore/detail/google-analytics-opt-out/fllaojicojecljbmefodhfapmkghcbnh
- **Firefox**: https://addons.mozilla.org/en-US/firefox/addon/google-analytics-opt-out/

This completely blocks GA tracking in that browser.

---

### Method 3: Set Up Internal Traffic Filter in GA4 (Recommended for Debug Mode)

If you use the `?ga_debug=1` method, follow these steps to filter out that traffic in your GA4 reports:

#### Step 1: Define Internal Traffic

1. Go to https://analytics.google.com
2. Click **Admin** (gear icon in bottom left)
3. Under **Data collection and modification**, click **Data Streams**
4. Click on your web data stream
5. Scroll down and click **Configure tag settings**
6. Click **Show more** (if needed)
7. Click **Define internal traffic**
8. Click **Create**
9. Configure as follows:
   - **Rule name**: "Debug Mode Traffic"
   - **traffic_type parameter value equals**: `internal`
   - **IP address** section: Leave empty or add your home/office IP
10. Click **Create**

#### Step 2: Create Internal Traffic Filter

1. Go back to **Admin**
2. Under **Data Settings**, click **Data Filters**
3. Find "Internal Traffic" filter (should be there by default)
4. If not, click **Create Filter**:
   - **Filter name**: "Internal Traffic"
   - **Filter type**: "Internal traffic"
   - **Filter operation**: "Exclude"
   - **Parameter name**: `traffic_type`
   - **Parameter value**: `internal`
5. Change **Filter State** to **Active**
6. Click **Save**

#### Step 3: Test It

1. Visit your site with `?ga_debug=1` in the URL
2. Go to GA4 → **Reports** → **Realtime**
3. You should NOT see your traffic (it's being filtered)
4. Visit without `?ga_debug=1`
5. You SHOULD see your traffic in Realtime

---

## How to Verify GA is Working

### Quick Check:
1. Visit your site (without `?ga_debug=1`)
2. Open Developer Tools (F12)
3. Go to **Network** tab
4. Filter by "gtag" or "collect"
5. You should see requests to `googletagmanager.com`

### Real-time Check:
1. Go to https://analytics.google.com
2. Select property **G-BFD7WNPCNP**
3. Go to **Reports** → **Realtime**
4. Visit your site - you should appear within 30 seconds

### Test Page:
Visit `https://your-domain.com/ga-test.html` for interactive debugging tools.

---

## Troubleshooting

**Not seeing any data?**
- Make sure changes are deployed to production
- Check if ad blocker is enabled (disable it)
- Wait 24-48 hours for new GA4 properties to activate
- Verify the property G-BFD7WNPCNP exists in your GA account

**Still seeing your own traffic?**
- Make sure you're using `?ga_debug=1` in the URL
- Verify the internal traffic filter is set to **Active** in GA4
- Clear your browser cache and cookies

**Traffic filter not working?**
- Check that the filter state is "Active" not "Testing"
- Verify the rule matches `traffic_type` equals `internal`
- Wait a few minutes for changes to propagate

---

## Additional Configuration

### Add Your IP Address (Optional)

If you want to filter by IP address instead of using `?ga_debug=1`:

1. Find your IP address: https://whatismyipaddress.com
2. In GA4 → Admin → Data Streams → Configure tag settings → Define internal traffic
3. Edit your rule and add your IP address
4. Use format like: `123.456.789.0` or IP range like `123.456.789.0/24`

**Note**: This only works if you have a static IP address.

---

## Summary

**Current Status**: ✅ Google Analytics installed with internal traffic detection

**To block your traffic**:
1. **Easiest**: Browse with `?ga_debug=1` + set up GA4 filter
2. **Complete blocking**: Install browser extension
3. **IP-based**: Add your IP to internal traffic rules (if static IP)

**Next Steps**:
1. Merge this PR and deploy to production
2. Set up the internal traffic filter in GA4 (see Method 3 above)
3. Test with Realtime reports
4. Bookmark your site URLs with `?ga_debug=1` for regular use
