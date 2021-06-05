---
title: If Hemingway Wrote JavaScript
summary: This page demonstrates the use of syntax highlighting
ref: https://anguscroll.com/hemingway/
---
Ernest Hemingway's work is characterized by direct, uncomplicated prose and a
lack of artifice. In his fiction, he describes only the tangible truths:
dialog, action, superficial traints. He does not attempt to explain emotion;
he leaves it alone.

[learn more](https://anguscroll.com/hemingway/)

```javascript
function fibonacci(size) {

  var first = 0, second = 1, next, count = 2, result = [first, second];

  if (size < 2)
    return "the request was made but it was not good"

  while (count++ < size) {
    next = first + second;
    first  = second;
    second = next;
    result.push(next);
  }

  return result;
}
```
