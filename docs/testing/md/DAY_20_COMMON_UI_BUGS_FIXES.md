# **DAY 20: COMMON UI BUGS & FIXES GUIDE**

## **🐛 RESPONSIVE DESIGN BUGS**

### **Bug #1: Content Overflows Viewport on Mobile**

**Symptom:**

- Horizontal scrolling appears
- Content extends beyond screen edge
- Tailwind breakpoint not working

**Common Causes:**

1. Fixed width set (e.g., `w-[1200px]`)
2. No padding on sides
3. Overflow hidden not applied to parent
4. Deep nested divs without width control

**Fix:**

```jsx
// ❌ Wrong
<div className="w-[1200px] mx-auto">
  <h1 className="text-4xl">Title</h1>
</div>

// ✅ Correct
<div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
  <h1 className="text-4xl">Title</h1>
</div>
```

**Prevention:**

```jsx
// Use container pattern
<div className="container mx-auto px-4 sm:px-6">{/* Content */}</div>
```

---

### **Bug #2: Navbar Hamburger Not Closing on Mobile**

**Symptom:**

- Hamburger menu doesn't close after clicking
- Mobile menu overlay stuck on screen
- Backdrop not clickable

**Common Causes:**

1. Missing `onClick` on link click
2. No state update in handler
3. Event not preventing propagation

**Fix:**

```jsx
// ❌ Wrong
<Link to="/path">Link</Link>

// ✅ Correct
<Link to="/path" onClick={() => setIsOpen(false)}>
  Link
</Link>
```

**For Backdrop:**

```jsx
// ✅ Always include
<motion.div onClick={onClose} className="fixed inset-0 z-40 bg-black/50" />
```

---

### **Bug #3: Images Not Responsive on Mobile**

**Symptom:**

- Images stay original size
- Overflow container
- Layout breaks on mobile

**Causes:**

1. Missing `w-full` class
2. Fixed width/height set
3. Image aspect ratio not maintained

**Fix:**

```jsx
// ❌ Wrong
<img src={img} alt="" style={{ width: "800px" }} />

// ✅ Correct
<img src={img} alt="description" className="w-full h-auto object-cover" />

// ✅ For containers
<div className="w-full aspect-video">
  <img src={img} alt="" className="w-full h-full object-cover" />
</div>
```

---

### **Bug #4: Grid/Flex Layout Not Stacking on Mobile**

**Symptom:**

- Columns overflow on mobile
- Grid not responsive
- Content squeezed

**Causes:**

1. Missing responsive classes
2. No gap between items
3. Hard-coded column count

**Fix:**

```jsx
// ❌ Wrong
<div className="grid grid-cols-4 gap-4">

// ✅ Correct
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

---

### **Bug #5: Text Overflow on Mobile**

**Symptom:**

- Long text breaks layout
- Content extends beyond container
- Text not wrapping

**Causes:**

1. No break-words class
2. Long URL or unbreakable text
3. White-space: nowrap applied

**Fix:**

```jsx
// ✅ Solutions for different scenarios

// Wrap text naturally
<p className="break-words">Text</p>

// Truncate with ellipsis
<h3 className="truncate">Long title here</h3>

// Limit to 2 lines
<p className="line-clamp-2">Text</p>

// Break words (for very long words)
<p className="break-all">verylongwordwithoutspaces</p>
```

---

## **🎨 STYLING & ANIMATION BUGS**

### **Bug #6: Animation Causing Layout Shift**

**Symptom:**

- Content shifts when animating
- Janky animation
- Poor performance (dropped frames)

**Causes:**

1. Animating width/height instead of scale/transform
2. No hardware acceleration
3. Too many simultaneous animations

**Fix:**

```jsx
// ❌ Wrong - causes reflow
<motion.div
  animate={{ width: "100%" }}
>

// ✅ Correct - GPU accelerated
<motion.div
  animate={{ scale: 1.1 }}
  style={{ willChange: "transform" }}
>
```

---

### **Bug #7: Hover Effects Not Working on Mobile**

**Symptom:**

- Hover effects visible on desktop
- No interaction on mobile
- Click happens but no feedback

**Causes:**

1. Using hover styles only
2. No touch feedback
3. Framer Motion `whileHover` only

**Fix:**

```jsx
// ❌ Wrong
<button className="hover:bg-blue-600">

// ✅ Correct - includes both
<motion.button
  whileHover={{ backgroundColor: "#1e40af" }}
  whileTap={{ scale: 0.98 }}
>

// ✅ Or with Tailwind + active state
<button className="hover:bg-blue-600 active:scale-95">
```

---

### **Bug #8: Modal/Drawer Not Closing on Escape**

**Symptom:**

- ESC key doesn't close modal
- Only close button works
- Backdrop click doesn't close

**Causes:**

1. No keydown listener
2. Listener not cleaned up
3. Event propagation issue

**Fix:**

```jsx
useEffect(() => {
  if (!isOpen) return;

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [isOpen, onClose]);
```

---

### **Bug #9: Z-Index Stacking Issues**

**Symptom:**

- Modal behind navbar
- Dropdown covered by content
- Menu hidden behind images

**Causes:**

1. Lower z-index value
2. Stacking context created by transform/opacity
3. Parent overflow: hidden

**Fix:**

```jsx
// ✅ Z-Index scale
// Navbar: z-40
// Modals/Drawers: z-50
// Dropdowns: z-30
// Default content: auto

<div className="fixed z-50"> {/* Modal */}
  <div className="z-40"> {/* Navbar */}
  <div className="z-30"> {/* Dropdown */}
```

---

## **📱 MOBILE TOUCH & UX BUGS**

### **Bug #10: Touch Targets Too Small**

**Symptom:**

- Hard to tap buttons on mobile
- Accidental clicks on wrong element
- Frustrating user experience

**Causes:**

1. Buttons < 44x44 pixels (Apple standard)
2. No padding around touch targets
3. Inline buttons too close together

**Fix:**

```jsx
// ❌ Wrong
<button className="h-8 px-2 text-xs">Small</button>

// ✅ Correct
<button className="h-11 px-4 text-sm">
  // min 44px height (h-11)
</button>

// ✅ Add spacing between
<div className="flex gap-2">
  <button className="flex-1 h-11">Button 1</button>
  <button className="flex-1 h-11">Button 2</button>
</div>
```

---

### **Bug #11: Mobile Keyboard Hiding Input**

**Symptom:**

- Keyboard covers input field
- Can't see what you're typing
- Submit button hidden by keyboard

**Causes:**

- Fixed positioning of elements
- No padding-bottom for keyboard space
- Viewport height issues

**Fix:**

```jsx
// ✅ For form in modal
<motion.div className="fixed bottom-0 sm:bottom-auto">
  {/* Form will adjust when keyboard opens */}
</motion.div>

// ✅ Add bottom padding on mobile
<div className="pb-6 sm:pb-0">
  <form>...</form>
</div>
```

---

### **Bug #12: List Items Not Scrollable on Mobile**

**Symptom:**

- Table or list overflows screen
- Content cut off
- No scrolling available

**Causes:**

1. No overflow-x-auto
2. Parent has overflow: hidden
3. Fixed width on child items

**Fix:**

```jsx
// ❌ Wrong
<table>...</table>

// ✅ Correct
<div className="overflow-x-auto">
  <table className="w-full">...</table>
</div>

// ✅ For lists
<div className="overflow-y-auto max-h-96">
  {items.map(item => <Item key={item.id} />)}
</div>
```

---

## **📊 DATA DISPLAY BUGS**

### **Bug #13: Chart Not Responsive**

**Symptom:**

- Recharts charts overflow
- Chart labels cut off
- Pie chart too large on mobile

**Causes:**

1. No ResponsiveContainer in Recharts
2. Fixed width/height
3. Container overflow: hidden

**Fix:**

```jsx
// ❌ Wrong
<BarChart width={800} height={400}>

// ✅ Correct (using Recharts)
<ResponsiveContainer width="100%" height={400}>
  <BarChart>
    {/* Chart content */}
  </BarChart>
</ResponsiveContainer>

// ✅ Or with custom sizing
<div className="w-full h-96">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart>...</BarChart>
  </ResponsiveContainer>
</div>
```

---

### **Bug #14: Skeleton Loading Forever**

**Symptom:**

- Skeleton shows but content never loads
- User stuck on loading screen
- No error message

**Causes:**

1. API call hanging
2. State not updating
3. Loading flag never set to false

**Fix:**

```jsx
// ❌ Wrong - catches only success
try {
  const data = await api.fetch();
  setData(data);
} finally {
  // Missing: setLoading(false) here
}

// ✅ Correct
try {
  const data = await api.fetch();
  setData(data);
} catch (error) {
  setError(error);
} finally {
  setLoading(false); // Always called
}
```

---

### **Bug #15: Empty State Not Showing**

**Symptom:**

- List empty but no message shown
- Confusing for user
- Looks broken

**Causes:**

1. Missing empty check
2. Loading state never cleared
3. Data fetch not handled

**Fix:**

```jsx
// ❌ Wrong
{queues && queues.map(...)}

// ✅ Correct
{loading ? (
  <Skeleton />
) : error ? (
  <ErrorState />
) : queues.length === 0 ? (
  <EmptyState icon={Search} title="No Queues" />
) : (
  queues.map(...)
)}
```

---

## **🔐 ACCESSIBILITY BUGS**

### **Bug #16: No Focus Ring on Buttons**

**Symptom:**

- Can't see where focus is
- Keyboard navigation confusing
- Fails accessibility audit

**Causes:**

1. Focus ring removed (`:outline-none`)
2. No focus styles applied
3. Tailwind focus classes missing

**Fix:**

```jsx
// ❌ Wrong
<button className="focus:outline-none">

// ✅ Correct
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">

// ✅ In Button component
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
```

---

### **Bug #17: Icon Buttons Not Labeled**

**Symptom:**

- Screen reader says "button" with no description
- Confusing for accessibility users
- Fails WCAG audit

**Causes:**

1. Missing aria-label
2. Icon only, no text
3. title attribute missing

**Fix:**

```jsx
// ❌ Wrong
<button onClick={logout}>
  <LogOut size={20} />
</button>

// ✅ Correct
<button
  onClick={logout}
  aria-label="Logout from your account"
  title="Logout"
>
  <LogOut size={20} />
</button>
```

---

### **Bug #18: Low Color Contrast**

**Symptom:**

- Text hard to read
- Fails accessibility audit
- Not WCAG AA compliant

**Causes:**

1. Text color too light
2. Background too dark
3. Poor color choices

**Fix:**

```jsx
// ❌ Wrong - #999 text on #f3f4f6 bg (contrast 4:1)
<p className="text-gray-400">Text</p>

// ✅ Correct - #374151 text on #f3f4f6 bg (contrast 8:1)
<p className="text-gray-700">Text</p>

// ✅ Check contrast
// Use WebAIM contrast checker
// Target: 4.5:1 for normal text, 3:1 for large text
```

---

## **⚡ PERFORMANCE BUGS**

### **Bug #19: Unnecessary Re-renders**

**Symptom:**

- Page sluggish
- Animations laggy
- Poor lighthouse scores

**Causes:**

1. Missing useCallback
2. Inline function props
3. No React.memo on expensive components

**Fix:**

```jsx
// ❌ Wrong - creates new function every render
const handleClick = () => setOpen(!open);
<Button onClick={handleClick} />

// ✅ Correct - memoized callback
const handleClick = useCallback(() => setOpen(!open), []);
<Button onClick={handleClick} />

// ✅ Or memoize component
const ExpensiveCard = React.memo(({ data }) => ...);
```

---

### **Bug #20: Large Bundle Size**

**Symptom:**

- Lighthouse performance score low
- Page loads slowly
- High initial download

**Causes:**

1. Unused imports
2. No code splitting
3. Large dependencies

**Fix:**

```jsx
// ❌ Wrong - imports all at once
import * from "chart-library";

// ✅ Correct - lazy load
const ChartDashboard = lazy(() => import("./ChartDashboard"));

// ✅ Use dynamic imports for heavy components
const AnalyticsDashboard = dynamic(() => import("./AnalyticsDashboard"), {
  loading: () => <Skeleton />
});
```

---

## **🔧 TESTING FOR BUGS**

### **Quick Bug Check Checklist**

```javascript
// Test in browser console

// 1. Check for layout shift
document.documentElement.scrollWidth === document.documentElement.clientWidth;
// Should be true (no horizontal scroll)

// 2. Check for overflow
const overflow = document.body.scrollWidth > window.innerWidth;
console.log("Has horizontal scroll:", overflow);
// Should be false

// 3. Check button sizes
document.querySelectorAll("button").forEach((btn) => {
  const height = btn.offsetHeight;
  if (height < 44) console.warn(`Small button: ${height}px`);
});

// 4. Check focus rings
document.querySelectorAll("button").forEach((btn) => {
  console.log(getComputedStyle(btn, ":focus").outline);
});

// 5. Check image loading
document.querySelectorAll("img").forEach((img) => {
  console.log(`${img.src}: ${img.complete ? "loaded" : "loading"}`);
});
```

---

## **🎯 COMMON MISTAKES TO AVOID**

| Mistake                   | Impact                      | Fix                             |
| ------------------------- | --------------------------- | ------------------------------- |
| `w-[1200px]` fixed width  | Horizontal scroll on mobile | Use `max-w-[1200px] w-full`     |
| `hover:` only             | No mobile feedback          | Add `active:scale-95`           |
| `focus:outline-none`      | Accessibility issue         | Add `focus-visible:ring-2`      |
| No `px-4 sm:px-6` padding | Content touches edges       | Always add horizontal padding   |
| `h-8` button              | Hard to tap                 | Use at least `h-11` (44px)      |
| No `alt` on images        | SEO & accessibility         | Always add descriptive alt text |
| Fixed `z-index: 999`      | Stacking chaos              | Use scale: 30/40/50             |
| No error handling         | White screen crashes        | Always add try/catch            |
| `isLoading` stuck true    | Forever loading             | Use finally block               |
| Inline arrow functions    | Performance leak            | Use useCallback hook            |

---

## **🚀 BEFORE SHIPPING CHECKLIST**

- [ ] No console errors
- [ ] Horizontal scroll test passed
- [ ] Mobile tested on real device
- [ ] Lighthouse ≥ 85
- [ ] Focus rings visible
- [ ] Buttons ≥ 44px
- [ ] Images responsive
- [ ] Charts responsive
- [ ] Tables scrollable
- [ ] Modals closable with ESC
- [ ] Empty states display
- [ ] Error states display
- [ ] Animations smooth (60 FPS)
- [ ] No unused imports
- [ ] No console.log() left
- [ ] Alt text on all images
- [ ] Contrast ratio ≥ 4.5:1

---

**Status: READY TO DEBUG** ✅

Use this guide to catch and fix common UI bugs before they reach production!
