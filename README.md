# Emoji.js

Get emoji from string, convert emoji to image. [4kb]

Support latest emoji set from iOS 10.2 and Android 7.1.1 [2418 emoji]

[EN] https://techblog.badoo.com/blog/2016/11/17/emoji-no-never-heard-of-it/

[RU] https://habrahabr.ru/company/badoo/blog/282113/

## Browser support

IE8 with polyfill

## Usage
[Demo](https://reon90.github.io/emoji.js/example/index.html)

```js
let instance = new emoji('../public/1/', '../public/2/');
textarea.addEventListener('keyup', onKeyup);
textarea.addEventListener('paste', onPaste);
button.addEventListener('click', onSend);

function onKeyup() {
    let html = instance.cleanUp(textarea.innerHTML);
    let proccesedHTML = instance.emojiToHtml(html);

    if (html !== proccesedHTML) {
        textarea.innerHTML = proccesedHTML;
        instance.restoreCaret(textarea);
    }
}

function onPaste(e) {
    e.preventDefault();
    var clp = e.clipboardData;

    if (clp !== undefined || window.clipboardData !== undefined) {
        var text;

        if (clp !== undefined) {
            text = clp.getData('text/html') || clp.getData('text/plain') || '';
        } else {
            text = window.clipboardData.getData('text') || '';
        }

        if (text) {
            text = instance.cleanUp(text);
            text = instance.emojiToHtml(text);
            var el = document.createElement('span');
            el.innerHTML = text;
            el.innerHTML = el.innerHTML.replace(/\n/g, '');
            textarea.appendChild(el);
            instance.restoreCaret(textarea);
        }
    }
}

function onSend() {
    message.innerHTML = instance.htmlToEmoji(textarea.innerHTML);
}
```

or

```js
emoji.getEmoji('Hello 😃'); // return 😃
```
