/**
  * @fileoverview Garbles text in real-time and resolves it back to its true value on demand.
  * @author Liam Elgie
  * @version 0.10.5
  * @module Waizsatsu
  */
'use strict';
// Arrays of characters to reference when garbling text
const ALPHABET = (() => {
  const caps = [...Array(26)].map((val, i) => String.fromCharCode(i + 65));
  return caps.concat(caps.map(letter => letter.toLowerCase()));
})();
/** @const */
const AUTO = "AUTO";
/** @const */
const EMOJI = ["✌","😂","😝","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄",
"🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌",
"❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾",
"🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘","😜",
"😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸",
"🐰","🐷","🐍","🐫","🔫","👄","🚲","🍉","💛","💚","🤬"];
/** @const */
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
/** @const */
const BINARY = ["0", "1"];
/** @const */
const SYMBOLS = ["`", "¬", "\\", "|", "!", "\"", "£", "$", "¢", "#", "¡", "™",
"#", "∞", "%", "^", "§", "&", "¶", "*", "•", "ª", "(", ")", "º", "-", "_", "≠",
"+", "=", "[", "]", "{", "}", ":", ";", "'", "@", "~", "<", ">", ",", ".", "/",
"?", "≥", "≤", "÷"];
/** @const */
const CHINESE = ["増", "給", "像", "再", "西", "窓", "愛", "封", "犯", "検", "掲",
"東", "紙", "金", "語", "毎", "米", "資", "承", "都", "設", "正", "膳", "記", "暮",
"護", "間", "格", "税", "市", "聞", "付", "十", "新", "進", "式", "職", "掲", "性",
"勝", "経", "参", "初", "毎", "仲", "国", "経", "一", "抜", "氏", "管", "欧", "典",
"童", "規", "継", "情", "始", "場", "害", "埋", "購", "田", "北", "切", "山", "救",
"習", "珈", "先", "責", "着", "会", "固", "題", "日", "度", "就", "冷", "数", "究",
"真", "愛", "終", "南", "滞", "再", "見", "公", "薄", "趣", "却", "相", "男", "敗",
"啓", "軍", "貞", "金", "全", "校", "浮", "後", "稿", "防", "夜", "集", "含", "毎",
"手", "少", "属", "市", "二", "時", "線", "暑", "週", "支", "盗", "来", "訃", "談",
"朝", "画", "見", "開", "米", "催", "日", "歩", "議", "対", "協", "議", "福", "疑",
"約", "古", "家", "禁", "噛", "校", "来", "持"];
/** @const */
const JAPANESE = ["以", "ユ", "ル", "ン", "メ", "オ", "他", "鵜", "阿", "シ", "フ",
"保", "鵜", "保", "擢", "野", "も", "き", "ほ", "は", "お", "無", "差", "課", "つ",
"せ", "ょ", "に", "無", "二", "巣", "と", "樹", "名", "屋", "二", "他", "模", "夜",
"模", "ひ", "い", "ゅ", "ゆ", "て", "は", "魔", "擢", "く", "ま", "都", "樹", "樹",
"ち", "せ", "ふ", "根", "等", "知", "名", "日", "派", "舳", "列", "絵", "素", "ね",
"み", "や", "絵", "く", "む", "の", "鵜", "目", "ヨ", "ク", "モ", "ネ", "む", "ね",
"派", "屋", "尾", "他", "他", "ほ", "て", "差", "手", "魔", "擢", "魔", "ん", "手",
"他", "舳", "野", "カ", "レ", "ミ", "野", "差", "区", "れ", "し", "せ", "れ", "の",
"シ", "ト", "ミ", "カ", "離", "魔", "そ", "ち", "ゆ", "手", "名", "雲", "夜", "ア",
"ヌ", "ル", "ー", "以", "野", "っ", "み", "つ", "瀬", "屋", "御", "模", "舳", "素",
"ひ", "な", "ぬ", "セ", "ラ", "ス", "チ", "カ", "け", "れ", "よ", "か", "え", "ら",
"こ", "野", "よ", "な", "り", "ゅ", "ゅ", "夜", "え", "ょ", "あ", "も", "ね"];
/** @const */
const KOREAN = ["百", "실", "로", "주", "며", "그", "들", "에", "게", "더", "운", "지",
"라", "가", "지", "에", "예", "가", "놀", "이", "있", "으", "랴", "심", "장", "의", "청",
"춘", "의", "살", "용", "기", "가", "설", "산", "에", "서", "위", "하", "여", "광", "야",
"에", "서", "평", "화", "스", "러", "운", "보", "라", "수", "끓", "는", "우", "는", "사",
"막", "이", "다", "있", "다", "이", "상", "은", "있", "는", "소", "리", "다", "속", "잎",
"나", "고", "속", "잎", "나", "고", "온", "갖", "인", "간", "의", "역", "사", "를", "뜨",
"거", "운", "지", "라"];
/** @const */
const CJK = CHINESE.concat(JAPANESE, KOREAN);

class TextGarbler {
  /**
    * @param {string} base The text that will be garbled.
    * @param {Object} [options] Options that control how the class will perform.
    * @param {boolean} [options.caseSensitive=false] Whether the garbled text should maintain the base string's case.
    * @param {string|Array} [options.characterSet="alphabet"] The set of characters that will be used to garble the text.
    * @param {Array} [options.customCharacterSet=[]] A set of custom characters that can be used to garble the text.
    * @param {number} [options.refreshEvery=50] The frequency at which the text will scramble. Lower values will increase resource usage but improve smoothness
    */
  constructor(base, options) {
    // Merge defaults with given options
    options = Object.assign({}, {
      caseSensitive: false,
      characterSet: "alphabet",
      customCharacterSet: [],
      refreshEvery: 50,
    }, options);

    /** @private */
    this.value;
    /** @private */
    this.base = base;
    /** @private */
    this.caseSensitive = options.caseSensitive;
    // The custom character set given by the user
    /** @const */
    const CUSTOM = options.customCharacterSet;
    // The character set to be referenced when garbling text
    /** @private */
    this.characterSet = (() => {
      if (options.characterSet) {
        if (typeof options.characterSet === "object") {
          let combinedSet = [];
          for (let set of options.characterSet) {
            if (["AUTO", "ALPHABET", "NUMBERS", "EMOJI", "BINARY", "SYMBOLS", "CHINESE", "JAPANESE", "KOREAN", "CUSTOM"].includes(set.toUpperCase())) {
              if (set === "AUTO") return AUTO;
              return combinedSet.concat((set.toUpperCase()));
            }
          }
        } else if (typeof options.characterSet === "string") {
          if (!["AUTO", "ALPHABET", "NUMBERS", "EMOJI", "BINARY", "SYMBOLS", "CHINESE", "JAPANESE", "KOREAN", "CUSTOM"].includes(options.characterSet.toUpperCase())) {
            console.error(`${options.characterSet} is not a valid character set. Use one of the following: \n
            AUTO, ALPHABET, NUMBERS, EMOJI, BINARY, SYMBOLS, CHINESE, JAPANESE, KOREAN or CUSTOM.`);
            // Fallback to ALPHABET
            return ALPHABET;
          } else {
            return (options.characterSet.toUpperCase());
          }
        }
      }
    })();

    // Initialise events object
    /** @private */
    this.events = {
      onGarble: () => {},
      onRepeaterStart: () => {},
      onRepeaterStop: () => {},
      onTransitionBegin: () => {},
      onTransitionEnd: () => {}
    }

    /** Contains the methods and properties for the controlling of the repeater feature.
      * This feature repeatedly garbles the text at a given interval.
      */
    /** @public */
    this.repeater = {
      isActive: false,
      milliseconds: options.refreshEvery,
      /** Starts the repeater. */
      start: () => {
        if (this.events.onRepeaterStart) this.events.onRepeaterStart();
        if (this.repeater.isActive) clearInterval(this.repeater.interval);
        // Signify that the text is currently being garbled
        this.repeater.isActive = true;
        // Start an interval to garble the text
        this.repeater.interval = setInterval(() => {
          this.garble();
        }, this.repeater.milliseconds);
        return;
      },
      /** Stops the repeater. */
      stop: () => {
        if (this.repeater.isActive) {
          if (this.events.onRepeaterStop) this.events.onRepeaterStop();
          // Clear the interval to prevent the string from being garbled indefinitely
          clearInterval(this.repeater.interval);
          /* Transition from garbled text to the base string. The transitionEnd event
           * is fired once the promise is resolved.
           */
          this.repeater.transition()
          .then(() => {
            // Signify that the text is no longer being garbled
            this.repeater.isActive = false;
            if (this.events.onTransitionEnd) this.events.onTransitionEnd();
            return true;
          });
        } else {
          return false;
        }
      },
      /** Smoothly transitions between the garbled and base string */
      transition: () => {
        return new Promise(function(resolve, reject) {
          // Fire the transitionBegin event
          if (this.events.onTransitionBegin) this.events.onTransitionBegin();
          // Track how many characters we have revealed so far
          let charactersRevealed = 0;
          // Set a loop to resolve the garbled string to it's true value progressively
          this.repeater.interval = setInterval(() => {
            const splitbase = this.base.split('');
            const splitGarbledString = this.garble(true, "array");
            // Overwrite the garbled characters with the true character for those
            // that have been itterated through
            for (let i = 0; i < charactersRevealed; i++) {
              splitGarbledString[i] = splitbase[i];
            }
            // Assign the joined string and fire the garble event
            this.value = splitGarbledString.join('');
            if (this.events.onGarble) this.events.onGarble();
            // Increment
            charactersRevealed++;
            // Once the entire string has been itterated through, clear the interval
            // and resolve the promise
            if (charactersRevealed > this.base.length) {
              clearInterval(this.repeater.interval);
              this.value = this.base;
              // Fire the garble event
              if (this.events.onGarble) this.events.onGarble();
              resolve();
            }
          }, this.repeater.milliseconds);
        }.bind(this));
      }
    }

    // Garble the string once so that value does not equal the base string
    this.garble();
  }

  /** Assigns a method to be called once a specified event is fired.
    * @param {string} event The event that will trigger the callback.
    * @param {function} callback The method that will be called.
    */
  on(event, callback) {
    if (typeof event != "string" || typeof callback != "function") {
      if (typeof event != "string") console.error(`Invalid parameter: ${event} must be a string but is instead a ${typeof event}`);
      if (typeof callback != "function") console.error(`Invalid parameter: ${callback} must be a function but is instead a ${typeof callback}`);
    }
    switch(event) {
    case "garble":
      // Returns the garbled text so that it can be manipulated
      this.events.onGarble = () => {
        callback(this.value);
      };
      break;
    case "repeaterStart":
      this.events.onRepeaterStart = callback;
      break;
    case "repeaterStop":
      this.events.onRepeaterStop = callback;
      break;
    case "transitionBegin":
      this.events.onTransitionBegin = callback;
      break;
    case "transitionEnd":
      this.events.onTransitionEnd = callback;
      break;
    default:
      console.error(`${event} is not a valid event. The following events are valid:
        garble, repeaterStart, repeaterStop, transitionBegin, transitionEnd.`);
      return false;
    }
    return true;
  }

  /** Garble the string using the chosen character set and return it as either a
    * string or array (as determined by the returnArray parameter).
    * Fires the 'garble' event before returning.
    * If the characterSet is set to AUTO, each character will be replaced with a
    * character of the same type. i.e. a number will be replaced with a random
    * number, a symbol will be replaced by a random symbol, a CJK character will
    * be replaced by a random CJK character.
    * Due to issues with language detection, any Chinese, Japanese or Korean
    * character will be replaced by any CJK character.
    * @param {string} string The string that will be garbled.
    * @param {boolean} returnArray Return the garbled text split into an array.
    * Otherwise, return it as a string.
    * @return {string|Array} The garbled text, either as a string or split into
    * an array.
    */
  garble(returnValue=false, returnAs="string") {
    const splitString = this.base.split('');
    const splitGarbledString = [];

    for (let character of splitString) {
      let garbledCharacter;
      if (this.characterSet === AUTO) {
        // Generate a random character for every character in the given string from
        // the character set that matches the character
        if (/\s/.test(character)) {
          garbledCharacter = ' ';
        } else if (/[0-1]/.test(character)) {
          garbledCharacter = generateRandomCharacter(BINARY);
        } else if (/[0-9]/.test(character)) {
          garbledCharacter = generateRandomCharacter(NUMBERS);
        } else if (/[-!$%^&*()_+|~=`{}\[\]:";'<>@?,.\/]/.test(character)) {
          garbledCharacter = generateRandomCharacter(SYMBOLS);
        } else if (/[^-!$%^&*()_+|~=`{}\[\]:";'<>@?,.\/\w\d\s]/.test(character)) {
          garbledCharacter = generateRandomCharacter(CJK);
        } else {
          garbledCharacter = generateRandomCharacter(ALPHABET);
        }
      } else {
        // Generate a random character for every character in the given string
        garbledCharacter = generateRandomCharacter(this.characterSet);
      }
      // If the caseSensitive flag was given, test the case of the original character
      // and match it.
      if (this.caseSensitive) {
        if (/[a-z]/.test(character)) {
          garbledCharacter = garbledCharacter.toLowerCase();
        } else if (/[A-Z]/.test(character)) {
          garbledCharacter = garbledCharacter.toUpperCase();
        }
      }
      // Push the garbled character into the array
      splitGarbledString.push(garbledCharacter);
    }
    // Update the value to the new string
    this.value = splitGarbledString.join('');
    // If asked to return the garbled text, return it as the given type
    if (returnValue && returnAs.toLowerCase() === "string") {
      return splitGarbledString.join('');
    } else if (returnValue && returnAs.toLowerCase() === "array") {
      return splitGarbledString;
    } else if (returnValue && returnAs.toLowerCase() != ("array" || "string")) {
      console.error(`Cannot return the garbled data as the following type: ${returnAs}.
        Use either 'string' or 'array'.`);
    }
    // Fire the garble event
    if (this.events.onGarble) this.events.onGarble();
    return;
  }
}

/**
  * Returns a string containing a random character. This character is selected
  * from the chosen characterSet at a random index.
  * @param {Array} characterSet The character set that should be used to generate
  * a random value.
  * @return {string} A single random character.
  */
function generateRandomCharacter(characterSet) {
  return characterSet[generateRandomInteger(characterSet.length)];
}

/**
  * Returns a random number between zero and the given max value.
  * @param {number} max The maximum value that can be generated.
  * @return {number} A random number.
  */
function generateRandomInteger(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
