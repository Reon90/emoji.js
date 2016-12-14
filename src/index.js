const emojiRanges = [
    '(?:_uD83C[_uDDE6-_uDDFF]){2}', // flags
    '_uD83C_uDFF3_u200D_uD83C_uDF08', // rainbow flag
    '[_u0023-_u0039]_u20E3', // numbers
    '_uD83D[_uDC68_uDC69](_uD83C[_uDFFB-_uDFFF])?[_u200D_u200C]([_u2708_u2696_u2695]|[_uD83D_uD83C][_uDFA8_uDE80_uDCBB_uDFEB_uDF93_uDFA4_uDD2C_uDCBC_uDD27_uDE92_uDF3E_uDFED_uDF73])', // jobs
    '([_uD83D_uD83C_uD83E][_uDC00-_uDFFF]|[_u270A-_u270D_u261D_u26F9])(_uD83C[_uDFFB-_uDFFF])?[_u200D_u200C][_u2640_u2642]', // gender
    '(?:[_uD83D_uD83C_uD83E][_uDC00-_uDFFF]|[_u270A-_u270D_u261D_u26F9])_uD83C[_uDFFB-_uDFFF]', // skin color
    '_uD83D[_uDC68_uDC69][_u200D_u200C].*?_uD83D[_uDC66-_uDC69](?![_u200D_u200C])', // family
    '_uD83D_uDC41_u200D_uD83D_uDDE8', // eye
    '[_uD83D_uD83C_uD83E][_uDC00-_uDFFF]', // surrogate pair
    '[_u3297_u3299_u303D_u2B50_u2B55_u2B1B_u27BF_u27A1_u24C2_u25B6_u25C0_u2600_u2705_u21AA_u21A9]', // simple
    '[_u203C_u2049_u2122_u2328_u2601_u260E_u261d_u2620_u2626_u262A_u2638_u2639_u263a_u267B_u267F_u2702_u2708]',
    '[_u2194-_u2199]',
    '[_u2B05-_u2B07]',
    '[_u2934-_u2935]',
    '[_u2795-_u2797]',
    '[_u2709-_u2764]',
    '[_u2622-_u2623]',
    '[_u262E-_u262F]',
    '[_u231A-_u231B]',
    '[_u23E9-_u23EF]',
    '[_u23F0-_u23F4]',
    '[_u23F8-_u23FA]',
    '[_u25AA-_u25AB]',
    '[_u25FB-_u25FE]',
    '[_u2602-_u2618]',
    '[_u2648-_u2653]',
    '[_u2660-_u2668]',
    '[_u26A0-_u26FA]',
    '[_u2692-_u269C]',
    '[_u26FD_u2139_u2640_u2642_u27B0_u3030_u00A9_u00AE_u23CF_u2B1C]'
];

const tpl = '<img class="emoji emoji--{code} js-smile-insert" src="{src}" srcset="{src} 1x, {src_x2} 2x" unselectable="on">';

const emojiRegex = new RegExp(emojiRanges.join('|').replace(/_/g, '\\'), 'g');
const htmlToEmojiRegex = /<img.*?class="emoji\semoji--(.+?)\sjs-smile-insert".*?>/gi;
const tagRegex = /<[^>]+>/gim;
const styleTagRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gim;
const validTagsRegex = /<br[\s/]*>|<img\s+class="emoji\semoji[-\w\s]+"\s+((src|srcset|unselectable)="[^"]*"\s*)+>/i;

function $tpl(tpl, dict) {
    return tpl.replace(/\{([\w-]+)\}/g, (str, key) => dict[key]);
}

class Emoji {
    constructor(url, url2x) {
        this.url = `${url}/{code}.png`;
        this.url2x = `${url2x}/{code}.png`;
    }
    
    static getEmoji(str) {
        str = str.replace(/\uFE0F/g, '');
        return str.match(emojiRegex);
    }
    
    emojiToHtml(str) {
        str = str.replace(/\uFE0F/g, '');
        return str.replace(emojiRegex, emoji => this.buildImgFromEmoji(emoji));
    }
    
    buildImgFromEmoji(emoji) {
        let codePoint = this.extractEmojiToCodePoint(emoji);
        return $tpl(tpl, {
            code: codePoint,
            src: $tpl(this.url, {
                code: codePoint
            }),
            src_x2: $tpl(this.url2x, {
                code: codePoint
            })
        });
    }
    
    extractEmojiToCodePoint(emoji) {
        return emoji
            .split('')
            .map((symbol, index) => emoji.codePointAt(index).toString(16))
            .filter(codePoint => !this.isSurrogatePair(codePoint), this)
            .join('-');
    }
    
    isSurrogatePair(codePoint) {
        codePoint = parseInt(codePoint, 16);
        return codePoint >= 0xD800 && codePoint <= 0xDFFF;
    }

    htmlToEmoji(html) {
        return html.replace(htmlToEmojiRegex, (imgTag, codesStr) => {
            let codesInt = codesStr.split('-').map(codePoint => parseInt(codePoint, 16));

            let emoji = String.fromCodePoint.apply(null, codesInt);

            return emoji.match(emojiRegex) ? emoji : '';
        });
    }

    cleanUp(text) {
        return text
            .replace(styleTagRegex, '')
            .replace(tagRegex, tag => tag.match(validTagsRegex) ? tag : '')
            .replace(/\n/g, '');
    }
    
    restoreCaret(el) {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

export default Emoji;
