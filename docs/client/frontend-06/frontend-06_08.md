---
title: 不同的环境,控制console
---

```javascript
class ConsoleSilencer {
  constructor() {
    this.enabled = true;
    this.backup = {};
  }

  disable() {
    if (!this.enabled) return;

    this.enabled = false;
    // const methods = ['log', 'warn', 'error', 'info', 'debug'];
    const methods = [];
    for (const consoleMethod of Object.keys(window.console)) {
      if (typeof window.console[consoleMethod] == 'function') {
        methods.push(consoleMethod);
      }
    }
    methods.forEach((method) => {
      this.backup[method] = console[method];
      console[method] = () => {};
    });
  }

  enable() {
    if (this.enabled) return;

    this.enabled = true;
    for (const method in this.backup) {
      console[method] = this.backup[method];
    }
  }
}

const silencer = new ConsoleSilencer();

silencer.disable(); // 关闭console
silencer.enable(); // 开启console
```
