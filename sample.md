# Sample Markdown Document

## Math Formulas

Inline math: $E = mc^2$

Block math:
$$
\frac{d}{dx}e^x = e^x
$$

Matrix:
$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$

## Code Blocks

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
for i in range(10):
    print(f"fibonacci({i}) = {fibonacci(i)}")
```

```javascript
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Test the function
for (let i = 0; i < 10; i++) {
    console.log(`factorial(${i}) = ${factorial(i)}`);
}
```

## Task Lists

### Daily Tasks
- [ ] Wake up early
- [ ] Exercise for 30 minutes
- [ ] Read a book
- [x] Drink water

### Project Tasks
- [ ] Set up development environment
- [ ] Write documentation
- [x] Create initial prototype
- [ ] Test with users

### Shopping List
- [ ] Buy groceries
  - [ ] Milk
  - [ ] Eggs
  - [ ] Bread
- [x] Order new headphones
- [ ] Pick up dry cleaning

## Notes
You can check/uncheck these items and the state will be saved automatically!

## Links and Images

[Visit GitHub](https://github.com)

![Sample Image](https://via.placeholder.com/150)

## Tables

| Name | Age | Occupation |
|------|-----|------------|
| John | 30  | Developer  |
| Jane | 25  | Designer   |
| Bob  | 35  | Manager    |

## Blockquotes

> This is a blockquote
> 
> It can span multiple lines
> 
> > And can be nested

## Horizontal Rule

---

## Text Formatting

*Italic text* and **bold text** and ***bold italic text***

~~Strikethrough text~~

`inline code`

## Lists

### Unordered List
- Item 1
- Item 2
  - Nested item 1
  - Nested item 2
- Item 3

### Ordered List
1. First item
2. Second item
   1. Nested item 1
   2. Nested item 2
3. Third item 