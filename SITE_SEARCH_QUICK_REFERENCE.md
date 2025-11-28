# Live Map Site Search - Quick Reference Guide

## Feature Summary

Added a **site search box** to the Live Map that lets users:
- Search for sites by ID, name, or area
- See real-time dropdown results
- Click any result to zoom the map to that site

## Location

**Top-left corner of the Live Map**
- Search box positioned at: `top-4 left-4`
- Non-intrusive: doesn't block existing legend

## Search Types

### 1. By Site ID
```
Input: "W4572"  → Shows sites with "W4572" in their ID
Input: "W45"    → Shows W4572, W4571, W4570, etc. (partial match)
```

### 2. By Site Name
```
Input: "Hub"         → Shows all sites with "hub" in name
Input: "western hub" → Shows sites matching this name
```

### 3. By Site Area
```
Input: "Western"  → Shows all sites in "Western Region", "Western Area", etc.
Input: "Central"  → Shows all sites in central areas
```

## How It Works

1. **User types in search box**
   - Real-time filtering as they type
   - Case-insensitive (lowercase, uppercase doesn't matter)

2. **Dropdown appears with results**
   - Shows matching sites below search box
   - Each result shows: Site ID (blue) | Name (gray) | Area (small gray)
   - Up to 192px height (scrollable if many results)

3. **User clicks a result**
   - Map zooms to that site (level 14)
   - Dropdown closes automatically
   - Search box clears

4. **If no results**
   - Shows "No sites found" message
   - User can try different search term

## UI Elements

### Search Input
- **Placeholder text:** "Search by ID, name, or area..."
- **Width:** 264px (w-64)
- **Style:** White background, rounded corners, shadow
- **Focus state:** Blue border

### Dropdown Results
- **Position:** Directly below search box
- **Background:** White with border
- **Max height:** 192px (scrollable)
- **Hover effect:** Light blue background on each result

### Empty State
- Message: "No sites found"
- Displayed when search has no matches

## Keyboard Behavior

- **Type:** Filters sites in real-time
- **Focus input:** Opens dropdown
- **Blur input:** Keeps dropdown visible if there's text
- **Click result:** Selects site and closes

## Map Behavior

### Before Selection
- Map shows all sites, NFOs, and connection lines
- Legend visible in top-right
- Search box visible in top-left

### After Selection
- Map centers on selected site
- Zoom level set to 14 (single site view)
- Can still see nearby sites and NFOs
- Users can interact normally after

## Technical Details

### Component Name
`SiteSearch` - Located in `app/components/LiveMapInner.tsx`

### Dependencies
- React hooks: `useState`, `useMemo`, `useCallback`
- Leaflet: `useMap` hook from react-leaflet
- Helper functions: `hasValidLocation` from nfoHelpers

### Performance
- Uses `useMemo` to optimize filtering
- Only re-filters when search term or sites change
- Minimal performance impact

### Validation
- Only zooms to sites with valid coordinates (lat/lng)
- Silently ignores sites without coordinates

## Integration Points

### In Live Map
```tsx
<MapContainer>
  <TileLayer ... />
  <Polyline ... /> {/* Connection lines */}
  <Marker ... /> {/* NFO markers */}
  <Marker ... /> {/* Site markers */}
  
  <SiteSearch sitesWithCoords={sitesWithCoords} /> {/* NEW */}
  <MapLegend ... /> {/* Existing legend */}
</MapContainer>
```

## Common Use Cases

### Use Case 1: Find specific site by ID
```
1. Type "W4572"
2. See result in dropdown
3. Click to zoom to that site
```

### Use Case 2: Find all sites in a region
```
1. Type "Western"
2. See all sites in Western Region
3. Browse results
4. Click any to view
```

### Use Case 3: Find site by partial name
```
1. Type "Hub"
2. See all sites with "Hub" in name
3. Pick the one you want
```

### Use Case 4: Explore nearby sites after search
```
1. Search for "W4572"
2. Click result to zoom there
3. Can now see nearby sites
4. Use legend to filter if needed
```

## Troubleshooting

### Search not showing results
- Check spelling and case (case-insensitive, but typos won't match)
- Try different field (ID, name, or area)
- Verify sites have valid coordinates

### Dropdown won't open
- Click in the search input box
- Start typing a search term
- Should open automatically

### Can't see dropdown results
- Verify sites are loaded (check Network tab)
- Try a more specific search term
- Check if scroll height needs adjustment

### Map doesn't zoom to selected site
- Ensure site has valid latitude/longitude
- Check console for error messages
- Verify map is responsive

## Browser Compatibility

- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support
- Mobile browsers: ✓ Works (may need to tap to open dropdown)

## Accessibility

- Input is keyboard accessible
- Dropdown items are clickable buttons
- Semantic HTML used
- ARIA labels recommended for future enhancement

## Future Enhancements

Possible improvements (not yet implemented):
- Keyboard arrow navigation in dropdown
- Remember last search
- Search history
- Favorite/bookmarked sites
- Filter by site status (active, inactive)
- Distance-based sorting
- Advanced search operators

## Files Modified

- `app/components/LiveMapInner.tsx` (+80 lines)

## Related Features

- **Legend:** Top-right corner - zoom to marker categories
- **Connection Lines:** Yellow lines to show NFO-to-site assignments
- **Site Markers:** Blue markers for all sites
- **NFO Markers:** Colored by status (green=free, red=busy, grey=off-shift)

---

**Version:** 1.0  
**Status:** Production Ready  
**Last Updated:** November 28, 2025
