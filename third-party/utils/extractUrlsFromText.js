"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUrlsFromText = void 0;
const URL_REGEX = /\b(?:https?:\/\/|www\.)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+\b|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?=\b|\s|$|\])/gi;
const extractUrlsFromText = (text) => {
    const urls = [];
    const textParts = [];
    let lastIndex = 0;
    const matches = [...text.matchAll(URL_REGEX)];
    matches.forEach(match => {
        const url = match[0];
        const index = match.index !== undefined ? match.index : -1;
        if (lastIndex < index) {
            textParts.push(text.slice(lastIndex, index));
        }
        urls.push(url);
        lastIndex = index + url.length;
    });
    if (lastIndex < text.length) {
        textParts.push(text.slice(lastIndex));
    }
    if (textParts.length === 0 && urls.length > 0) {
        textParts.push('');
    }
    return { textParts, urls };
};
exports.extractUrlsFromText = extractUrlsFromText;
//# sourceMappingURL=extractUrlsFromText.js.map