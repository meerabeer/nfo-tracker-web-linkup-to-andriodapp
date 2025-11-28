# Debug Logging Setup Complete

## Summary of Changes

Two debug logs have been added to track ZAMEBIR's distance calculation:

### 1. Dashboard Debug Log (app/page.tsx, line 368-380)
```typescript
if (nfo.username === "ZAMEBIR") {
  console.log("[Dashboard DISTANCE DEBUG]", {
    username: nfo.username,
    status: nfo.status,
    site_id: nfo.site_id,
    nfoLat: nfo.lat,
    nfoLng: nfo.lng,
    nearestSiteId: nearestSiteId ?? null,
    nearestSiteDistanceKm,
  });
}
```

### 2. LiveMap Debug Log (app/components/LiveMapInner.tsx, line 259-270)
```typescript
if (nfo.username === "ZAMEBIR") {
  console.log("[LiveMap DISTANCE DEBUG]", {
    username: nfo.username,
    status: nfo.status,
    site_id: nfo.site_id,
    nfoLat: nfo.lat,
    nfoLng: nfo.lng,
    selectedSiteId,
    selectedSiteDistanceKm,
  });
}
```

## How to Capture Console Output

1. **Open Browser DevTools:**
   - Press `F12` or right-click → "Inspect" → "Console" tab
   - Clear any existing logs with `console.clear()`

2. **Navigate to Dashboard:**
   - Go to http://localhost:3000
   - Wait for data to load (should see ZAMEBIR in the table)
   - Check the Console tab for `[Dashboard DISTANCE DEBUG]` output
   - Copy the exact output

3. **Navigate to Live Map:**
   - Click the "Live Map" button at the top
   - Wait for the map to render
   - Check the Console tab for `[LiveMap DISTANCE DEBUG]` output
   - Copy the exact output

4. **Screenshot or Copy the Values:**
   - For Dashboard output, capture:
     - nearestSiteId value
     - nearestSiteDistanceKm value
   - For LiveMap output, capture:
     - selectedSiteId value
     - selectedSiteDistanceKm value

## What the Logs Will Tell Us

Based on the output, I can diagnose:

- **If nearestSiteId is null:**
  - W4572 is not being found in the sites array
  - Site lookup (getSiteById) is failing
  - Sites might not be loaded from Supabase

- **If nearestSiteId is "W4572" but distance is null:**
  - Site exists but has null/invalid latitude/longitude
  - The site coordinates are missing in Supabase

- **If both nearestSiteId and distance have valid values:**
  - Distance calculation is working correctly
  - The issue is likely in the rendering/display logic

## Additional Debugging Info

The following logs have also been added to trace site data loading:

From app/page.tsx (lines 93-100):
- "Site rows from Supabase:" - shows how many site records are retrieved
- "First site row:" - shows the raw data from Supabase
- "Parsed site records:" - shows how many sites are parsed
- "First parsed site:" - shows the parsed site object

Check these in the console to verify:
- How many sites are loaded
- If latitude/longitude are present
- If coordinate parsing is working correctly

## Next Steps

1. Open http://localhost:3000 in your browser
2. Open DevTools Console (F12)
3. Visit Dashboard → copy [Dashboard DISTANCE DEBUG] output
4. Visit Live Map → copy [LiveMap DISTANCE DEBUG] output
5. Share the console output with me

The logs are not yet removed - they will stay in the code until we confirm the issue is diagnosed.
