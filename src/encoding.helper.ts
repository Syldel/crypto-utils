/**
 * Encode et décode en Base64URL sans dépendance à Buffer (Universal JS)
 */
export const EncodingHelper = {
  // Texte -> Base64
  toBase64: (str: string): string => {
    return btoa(unescape(encodeURIComponent(str)));
  },

  // Base64 -> Texte
  fromBase64: (base64: string): string => {
    return decodeURIComponent(escape(atob(base64)));
  },

  // Base64 -> Base64URL (pour JWT)
  toBase64Url: (base64: string): string => {
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  },

  // Object -> Base64URL
  objToBase64Url: (obj: object): string => {
    const str = JSON.stringify(obj);
    return EncodingHelper.toBase64Url(EncodingHelper.toBase64(str));
  },
};
