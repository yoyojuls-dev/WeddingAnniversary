# Anniversary Website - Setup Guide

## 📁 File Structure

Create a folder with these 4 files:

```
anniversary-website/
├── index.html      (Main HTML structure)
├── styles.css      (All styling)
├── data.js         (YOUR CONTENT - Edit this!)
├── script.js       (Functions - Don't edit unless needed)
└── README.md       (This file)
```

## 🚀 Quick Start

1. **Download all 4 files** and place them in the same folder
2. **Open `index.html`** in your web browser
3. That's it! No server needed.

## ✏️ How to Customize Your Content

### Edit `data.js` - This is where you change everything!

**Three main arrays to edit:**

#### 1. `diaryEntries` - Daily moments and feelings
```javascript
{
    title: "Your Title",
    date: "January 15, 2024",
    emoji: "💕",
    description: "Short preview text",
    content: "Full story goes here..."
}
```

#### 2. `journeyMilestones` - Important relationship moments
```javascript
{
    title: "Milestone Name",
    date: "June 10, 2024",
    emoji: "🏠",
    description: "Brief description",
    content: "Detailed story..."
}
```

#### 3. `specialMemories` - Fun and memorable moments
```javascript
{
    title: "Memory Title",
    date: "March 25, 2024",
    emoji: "🎂",
    description: "What happened",
    content: "Full memory..."
}
```

## 🎨 How to Customize Styling

### Edit `styles.css` to change:

- **Colors**: Look for `#e50914` (Netflix red) - change to any color
- **Fonts**: Change `'Helvetica Neue'` to your preferred font
- **Sizes**: Modify `font-size` values throughout

### Common customizations:

**Change main color theme:**
```css
/* Find and replace #e50914 with your color, e.g., #ff6b9d */
```

**Change loading text:**
```css
.logo {
    /* Edit the text in index.html instead */
}
```

**Adjust card sizes:**
```css
.cards-container {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    /* Change 280px to make cards bigger/smaller */
}
```

## 🛠️ Advanced Customizations

### Change Loading Time
In `script.js`, find:
```javascript
setTimeout(() => {
    // ...
}, 2500); // Change 2500 to milliseconds you want
```

### Add More Sections
1. Add HTML in `index.html`:
```html
<div class="section" id="newsection">
    <h2 class="section-title">New Section</h2>
    <div class="cards-container" id="newsectionCards"></div>
</div>
```

2. Add data array in `data.js`:
```javascript
const newSectionData = [ /* your items */ ];
```

3. Generate cards in `script.js`:
```javascript
document.getElementById('newsectionCards').innerHTML = 
    newSectionData.map(item => createCard(item)).join('');
```

## 📝 Tips

- **Emojis**: Use any emoji! Copy from [Emojipedia](https://emojipedia.org/)
- **Dates**: Use any format you like (e.g., "Jan 15, 2024" or "2024-01-15")
- **Content**: Write as much or as little as you want in the `content` field
- **Testing**: Refresh browser (F5) after each change to see updates

## 🐛 Troubleshooting

**Cards not showing up?**
- Check that all files are in the same folder
- Make sure `data.js` is loaded before `script.js` in `index.html`
- Open browser console (F12) to see any errors

**Loading screen not disappearing?**
- Wait 2.5 seconds
- Check browser console for JavaScript errors

**Styling looks broken?**
- Make sure `styles.css` is in the same folder as `index.html`
- Check that the `<link>` tag in `index.html` points to the right file

## 🎉 That's It!

You now have a beautiful Netflix-style anniversary website. Just edit `data.js` with your story and you're done!

Happy Anniversary! 💕