import events from "events";
import sax from "sax";

// Define the bom module
const bom = {
  stripBOM: function (str) {
    if (str[0] === "\uFEFF") {
      return str.substring(1);
    } else {
      return str;
    }
  },
};

// Define the default options and processors
const defaults = {
  0.1: {
    explicitCharkey: false,
    trim: true,
    normalize: true,
    normalizeTags: false,
    attrkey: "@",
    charkey: "#",
    explicitArray: false,
    ignoreAttrs: false,
    mergeAttrs: false,
    explicitRoot: false,
    validator: null,
    xmlns: false,
    explicitChildren: false,
    childkey: "@@",
    charsAsChildren: false,
    includeWhiteChars: false,
    async: false,
    strict: true,
    attrNameProcessors: null,
    attrValueProcessors: null,
    tagNameProcessors: null,
    valueProcessors: null,
    emptyTag: "",
  },
  0.2: {
    explicitCharkey: false,
    trim: false,
    normalize: false,
    normalizeTags: false,
    attrkey: "$",
    charkey: "_",
    explicitArray: true,
    ignoreAttrs: false,
    mergeAttrs: false,
    explicitRoot: true,
    validator: null,
    xmlns: false,
    explicitChildren: false,
    preserveChildrenOrder: false,
    childkey: "$$",
    charsAsChildren: false,
    includeWhiteChars: false,
    async: false,
    strict: true,
    attrNameProcessors: null,
    attrValueProcessors: null,
    tagNameProcessors: null,
    valueProcessors: null,
    rootName: "root",
    xmldec: {
      version: "1.0",
      encoding: "UTF-8",
      standalone: true,
    },
    doctype: null,
    renderOpts: {
      pretty: true,
      indent: "  ",
      newline: "\n",
    },
    headless: false,
    chunkSize: 10000,
    emptyTag: "",
    cdata: false,
  },
};

const processors = {
  normalize: (name) => name.toLowerCase(),
};

// Helper functions
const defineProperty = (obj, key, value) => {
  Object.defineProperty(obj, key, { value: value, enumerable: true });
};

const processItem = (processors, value, key) => {
  // Process value according to processors
  return value;
};

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Define the Parser class
class Parser extends events.EventEmitter {
  constructor(opts) {
    super();
    this.parseString = this.parseString.bind(this);
    this.reset = this.reset.bind(this);
    this.assignOrPush = this.assignOrPush.bind(this);
    this.processAsync = this.processAsync.bind(this);

    this.options = { ...defaults["0.2"], ...opts };
    if (this.options.xmlns) {
      this.options.xmlnskey = this.options.attrkey + "ns";
    }
    if (this.options.normalizeTags) {
      if (!this.options.tagNameProcessors) {
        this.options.tagNameProcessors = [];
      }
      this.options.tagNameProcessors.unshift(processors.normalize);
    }
    this.reset();
  }

  processAsync() {
    let chunk, err;
    try {
      if (this.remaining.length <= this.options.chunkSize) {
        chunk = this.remaining;
        this.remaining = "";
        this.saxParser = this.saxParser.write(chunk);
        this.saxParser.close();
      } else {
        chunk = this.remaining.substr(0, this.options.chunkSize);
        this.remaining = this.remaining.substr(this.options.chunkSize);
        this.saxParser = this.saxParser.write(chunk);
        setImmediate(this.processAsync);
      }
    } catch (error) {
      if (!this.saxParser.errThrown) {
        this.saxParser.errThrown = true;
        this.emit("error", error);
      }
    }
  }

  assignOrPush(obj, key, newValue) {
    if (!(key in obj)) {
      if (!this.options.explicitArray) {
        defineProperty(obj, key, newValue);
      } else {
        defineProperty(obj, key, [newValue]);
      }
    } else {
      if (!(obj[key] instanceof Array)) {
        defineProperty(obj, key, [obj[key]]);
      }
      obj[key].push(newValue);
    }
  }

  reset() {
    this.removeAllListeners();
    this.saxParser = sax.parser(this.options.strict, {
      trim: false,
      normalize: false,
      xmlns: this.options.xmlns,
    });
    this.saxParser.errThrown = false;
    this.saxParser.onerror = (error) => {
      this.saxParser.resume();
      if (!this.saxParser.errThrown) {
        this.saxParser.errThrown = true;
        this.emit("error", error);
      }
    };
    this.saxParser.onend = () => {
      if (!this.saxParser.ended) {
        this.saxParser.ended = true;
        this.emit("end", this.resultObject);
      }
    };
    this.saxParser.ended = false;
    this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
    this.resultObject = null;
    const stack = [];
    const { attrkey, charkey, childkey } = this.options;

    this.saxParser.onopentag = (node) => {
      const obj = { [charkey]: "" };
      if (!this.options.ignoreAttrs) {
        for (const key in node.attributes) {
          if (Object.hasOwn(node.attributes, key)) {
            const processedKey = this.options.attrNameProcessors
              ? processItem(this.options.attrNameProcessors, key)
              : key;
            let newValue = node.attributes[key];
            if (this.options.attrValueProcessors) {
              newValue = processItem(
                this.options.attrValueProcessors,
                newValue,
                key
              );
            }
            if (this.options.mergeAttrs) {
              this.assignOrPush(obj, processedKey, newValue);
            } else {
              obj[attrkey] = obj[attrkey] || {};
              defineProperty(obj[attrkey], processedKey, newValue);
            }
          }
        }
      }
      obj["#name"] = this.options.tagNameProcessors
        ? processItem(this.options.tagNameProcessors, node.name)
        : node.name;
      if (this.options.xmlns) {
        obj[this.options.xmlnskey] = { uri: node.uri, local: node.local };
      }
      stack.push(obj);
    };

    this.saxParser.onclosetag = () => {
      let obj = stack.pop();
      const nodeName = obj["#name"];
      let emptyStr = ""; // Initialize emptyStr
      if (
        !this.options.explicitChildren ||
        !this.options.preserveChildrenOrder
      ) {
        delete obj["#name"];
      }
      let cdata;
      if (obj.cdata === true) {
        cdata = obj.cdata;
        delete obj.cdata;
      }
      const s = stack[stack.length - 1];
      if (obj[charkey].match(/^\s*$/) && !cdata) {
        emptyStr = obj[charkey];
        delete obj[charkey];
      } else {
        if (this.options.trim) {
          obj[charkey] = obj[charkey].trim();
        }
        if (this.options.normalize) {
          obj[charkey] = obj[charkey].replace(/\s{2,}/g, " ").trim();
        }
        obj[charkey] = this.options.valueProcessors
          ? processItem(this.options.valueProcessors, obj[charkey], nodeName)
          : obj[charkey];
        if (
          Object.keys(obj).length === 1 &&
          charkey in obj &&
          !this.EXPLICIT_CHARKEY
        ) {
          obj = obj[charkey];
        }
      }
      if (isEmpty(obj)) {
        obj =
          typeof this.options.emptyTag === "function"
            ? this.options.emptyTag()
            : this.options.emptyTag || emptyStr;
      }
      if (this.options.validator) {
        const xpath =
          "/" +
          stack
            .map((node) => node["#name"])
            .concat(nodeName)
            .join("/");
        try {
          obj = this.options.validator(xpath, s && s[nodeName], obj);
        } catch (error) {
          this.emit("error", error);
        }
      }
      if (
        this.options.explicitChildren &&
        !this.options.mergeAttrs &&
        typeof obj === "object"
      ) {
        if (!this.options.preserveChildrenOrder) {
          const node = {};
          if (this.options.attrkey in obj) {
            node[this.options.attrkey] = obj[this.options.attrkey];
            delete obj[this.options.attrkey];
          }
          if (!this.options.charsAsChildren && this.options.charkey in obj) {
            node[this.options.charkey] = obj[this.options.charkey];
            delete obj[this.options.charkey];
          }
          if (Object.getOwnPropertyNames(obj).length > 0) {
            node[childkey] = obj;
          }
          obj = node;
        } else if (s) {
          s[childkey] = s[childkey] || [];
          const objClone = { ...obj };
          s[childkey].push(objClone);
          delete obj["#name"];
          if (
            Object.keys(obj).length === 1 &&
            charkey in obj &&
            !this.EXPLICIT_CHARKEY
          ) {
            obj = obj[charkey];
          }
        }
      }
      if (stack.length > 0) {
        this.assignOrPush(s, nodeName, obj);
      } else {
        if (this.options.explicitRoot) {
          const old = obj;
          obj = {};
          defineProperty(obj, nodeName, old);
        }
        this.resultObject = obj;
        this.saxParser.ended = true;
        this.emit("end", this.resultObject);
      }
    };

    this.saxParser.ontext = (text) => {
      const s = stack[stack.length - 1];
      if (s) {
        s[charkey] += text;
        if (
          this.options.explicitChildren &&
          this.options.preserveChildrenOrder &&
          this.options.charsAsChildren &&
          (this.options.includeWhiteChars ||
            text.replace(/\\n/g, "").trim() !== "")
        ) {
          s[childkey] = s[childkey] || [];
          const charChild = { "#name": "__text__" };
          charChild[charkey] = text;
          if (this.options.normalize) {
            charChild[charkey] = charChild[charkey]
              .replace(/\s{2,}/g, " ")
              .trim();
          }
          s[childkey].push(charChild);
        }
      }
    };

    this.saxParser.oncdata = (text) => {
      const s = this.saxParser.ontext(text);
      if (s) {
        s.cdata = true;
      }
    };
  }

  parseString(str, cb) {
    if (cb && typeof cb === "function") {
      this.on("end", (result) => {
        this.reset();
        cb(null, result);
      });
      this.on("error", (err) => {
        this.reset();
        cb(err);
      });
    }
    try {
      str = str.toString();
      if (str.trim() === "") {
        this.emit("end", null);
        return true;
      }
      str = bom.stripBOM(str);
      if (this.options.async) {
        this.remaining = str;
        setImmediate(this.processAsync);
        return this.saxParser;
      }
      return this.saxParser.write(str).close();
    } catch (err) {
      if (!(this.saxParser.errThrown || this.saxParser.ended)) {
        this.emit("error", err);
        this.saxParser.errThrown = true;
      } else if (this.saxParser.ended) {
        throw err;
      }
    }
  }

  parseStringPromise(str) {
    return new Promise((resolve, reject) => {
      this.parseString(str, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }
}

// Export the parseString function
const parseString = (str, optionsOrCallback, callback) => {
  let cb;
  let options = {};
  if (callback != null) {
    if (typeof callback === "function") {
      cb = callback;
    }
    if (typeof optionsOrCallback === "object") {
      options = optionsOrCallback;
    }
  } else {
    if (typeof optionsOrCallback === "function") {
      cb = optionsOrCallback;
    }
  }
  const parser = new Parser(options);
  return parser.parseString(str, cb);
};

export { parseString };
