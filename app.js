function loadScript(a, c) {
  var b = document.getElementsByTagName("script")[0],
    d = document.createElement("script");
  d.src = a;
  d.addEventListener ? d.addEventListener("load", function() {
    c && c()
  }, !1) : d.onreadystatechange = function() {
    if (d.readyState in {
      loaded: 1,
      complete: 1
    }) d.onreadystatechange = null, c && c()
  };
  b.parentNode.insertBefore(d, b)
}(function(a) {
  a.fn.hoverIntent = function(c, b) {
    var d = {
      sensitivity: 7,
      interval: 100,
      timeout: 0
    },
      d = a.extend(d, b ? {
        over: c,
        out: b
      } : c),
      i, e, f, h, g = function(a) {
        i = a.pageX;
        e = a.pageY
      },
      j = function(c, b) {
        b.hoverIntent_t = clearTimeout(b.hoverIntent_t);
        if (Math.abs(f - i) + Math.abs(h - e) < d.sensitivity) return a(b).unbind("mousemove", g), b.hoverIntent_s = 1, d.over.apply(b, [c]);
        else f = i, h = e, b.hoverIntent_t = setTimeout(function() {
          j(c, b)
        }, d.interval)
      },
      o = function(c) {
        var b = jQuery.extend({}, c),
          e = this;
        if (e.hoverIntent_t) e.hoverIntent_t = clearTimeout(e.hoverIntent_t);
        if (c.type == "mouseenter") {
          if (f = b.pageX, h = b.pageY, a(e).bind("mousemove", g), e.hoverIntent_s != 1) e.hoverIntent_t = setTimeout(function() {
            j(b, e)
          }, d.interval)
        } else if (a(e).unbind("mousemove", g), e.hoverIntent_s == 1) e.hoverIntent_t = setTimeout(function() {
          e.hoverIntent_t = clearTimeout(e.hoverIntent_t);
          e.hoverIntent_s = 0;
          d.out.apply(e, [b])
        }, d.timeout)
      };
    return this.bind("mouseenter", o).bind("mouseleave", o)
  }
})(jQuery);

function JSZip(a) {
  this.compression = (a || "STORE").toUpperCase();
  this.files = [];
  this.root = "";
  this.d = {
    base64: !1,
    binary: !1,
    dir: !1,
    date: null
  };
  if (!JSZip.compressions[this.compression]) throw a + " is not a valid compression method !";
}
JSZip.prototype.add = function(a, c, b) {
  b = b || {};
  a = this.root + a;
  if (b.base64 === !0 && b.binary == null) b.binary = !0;
  for (var d in this.d) b[d] = b[d] || this.d[d];
  b.date = b.date || new Date;
  var i;
  d = b.date.getHours();
  d <<= 6;
  d |= b.date.getMinutes();
  d <<= 5;
  d |= b.date.getSeconds() / 2;
  i = b.date.getFullYear() - 1980;
  i <<= 4;
  i |= b.date.getMonth() + 1;
  i <<= 5;
  i |= b.date.getDate();
  b.base64 === !0 && (c = JSZipBase64.decode(c));
  b.binary === !1 && (c = this.utf8encode(c));
  var e = JSZip.compressions[this.compression],
    f = e.compress(c),
    h = "";
  h += "\n\x00";
  h += "\x00\x00";
  h += e.magic;
  h += this.decToHex(d, 2);
  h += this.decToHex(i, 2);
  h += this.decToHex(this.crc32(c), 4);
  h += this.decToHex(f.length, 4);
  h += this.decToHex(c.length, 4);
  h += this.decToHex(a.length, 2);
  h += "\x00\x00";
  this.files[a] = {
    header: h,
    data: f,
    dir: b.dir
  };
  return this
};
JSZip.prototype.folder = function(a) {
  a.substr(-1) != "/" && (a += "/");
  typeof this.files[a] === "undefined" && this.add(a, "", {
    dir: !0
  });
  var c = this.clone();
  c.root = this.root + a;
  return c
};
JSZip.prototype.find = function(a) {
  var c = [],
    a = typeof a === "string" ? RegExp("^" + a + "$") : a,
    b;
  for (b in this.files) if (a.test(b)) {
    var d = this.files[b];
    c.push({
      name: b,
      data: d.data,
      dir: !! d.dir
    })
  }
  return c
};
JSZip.prototype.remove = function(a) {
  var c = this.files[a];
  c || (a.substr(-1) != "/" && (a += "/"), c = this.files[a]);
  if (c) if (a.match("/") === null) delete this.files[a];
  else for (var c = this.find(RegExp("^" + a)), b = 0; b < c.length; b++) c[b].name == a ? delete this.files[a] : this.remove(c[b].name);
  return this
};
JSZip.prototype.generate = function(a) {
  var a = a || !1,
    c = [],
    b = [],
    d = 0,
    i;
  for (i in this.files) if (this.files.hasOwnProperty(i)) {
    var e = "",
      f = "",
      e = "PK\u0003\u0004" + this.files[i].header + i + this.files[i].data,
      f = "PK\u0001\u0002\u0014\x00" + this.files[i].header + "\x00\x00\x00\x00\x00\x00" + (this.files[i].dir === !0 ? "\u0010\x00\x00\x00" : "\x00\x00\x00\x00") + this.decToHex(d, 4) + i;
    d += e.length;
    b.push(e);
    c.push(f)
  }
  d = b.join("");
  c = c.join("");
  i = "";
  i = "PK\u0005\u0006\x00\x00\x00\x00" + this.decToHex(b.length, 2) + this.decToHex(b.length, 2) + this.decToHex(c.length, 4) + this.decToHex(d.length, 4) + "\x00\x00";
  b = d + c + i;
  return a ? b : JSZipBase64.encode(b)
};
JSZip.compressions = {
  STORE: {
    magic: "\x00\x00",
    compress: function(a) {
      return a
    }
  }
};
JSZip.prototype.decToHex = function(a, c) {
  for (var b = "", d = 0; d < c; d++) b += String.fromCharCode(a & 255), a >>>= 8;
  return b
};
JSZip.prototype.crc32 = function(a, c) {
  if (a === "") return "\x00\x00\x00\x00";
  typeof c == "undefined" && (c = 0);
  var b = 0,
    b = 0;
  c ^= -1;
  for (var d = 0, i = a.length; d < i; d++) b = (c ^ a.charCodeAt(d)) & 255, b = "0x" + "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D".substr(b * 9, 8), c = c >>> 8 ^ b;
  return c ^ -1
};
JSZip.prototype.clone = function() {
  var a = new JSZip,
    c;
  for (c in this) typeof this[c] !== "function" && (a[c] = this[c]);
  return a
};
JSZip.prototype.utf8encode = function(a) {
  a = encodeURIComponent(a);
  return a = a.replace(/%.{2,2}/g, function(a) {
    a = a.substring(1);
    return String.fromCharCode(parseInt(a, 16))
  })
};
var JSZipBase64 = function() {
    return {
      encode: function(a) {
        for (var c = "", b, d, i, e, f, h, g = 0; g < a.length;) b = a.charCodeAt(g++), d = a.charCodeAt(g++), i = a.charCodeAt(g++), e = b >> 2, b = (b & 3) << 4 | d >> 4, f = (d & 15) << 2 | i >> 6, h = i & 63, isNaN(d) ? f = h = 64 : isNaN(i) && (h = 64), c = c + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(e) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(b) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(f) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(h);
        return c
      },
      decode: function(a) {
        for (var c = "", b, d, i, e, f, h = 0, a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ""); h < a.length;) b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(h++)), d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(h++)), e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(h++)), f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(h++)), b = b << 2 | d >> 4, d = (d & 15) << 4 | e >> 2, i = (e & 3) << 6 | f, c += String.fromCharCode(b), e != 64 && (c += String.fromCharCode(d)), f != 64 && (c += String.fromCharCode(i));
        return c
      }
    }
  }();
try {
  if (!Blob.constructor) var BlobBuilder = BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder ||
  function(a) {
    var c = function(a) {
        return Object.prototype.toString.call(a).match(/^\[object\s(.*)\]$/)[1]
      },
      b = function() {
        this.data = []
      },
      d = function(a, c, b) {
        this.data = a;
        this.size = a.length;
        this.type = c;
        this.encoding = b
      },
      i = b.prototype,
      e = d.prototype,
      f = a.FileReaderSync,
      h = function(a) {
        this.code = this[this.name = a]
      },
      g = "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR".split(" "),
      j = g.length,
      o = a.URL || a.webkitURL || a,
      m = o,
      k = a.btoa,
      l = a.atob,
      n = !1,
      p = a.ArrayBuffer,
      v = a.Uint8Array;
    for (b.fake = e.fake = !0; j--;) h.prototype[g[j]] = j + 1;
    try {
      v &&
      function(a) {
        n = !a
      }.apply(0, new v(1))
    } catch (q) {}
    if (!o.createObjectURL) m = a.URL = {};
    m.createObjectURL = function(a) {
      var c = a.type;
      c === null && (c = "application/octet-stream");
      if (a instanceof d) {
        c = "data:" + c;
        if (a.encoding === "base64") return c + ";base64," + a.data;
        else if (a.encoding === "URI") return c + "," + decodeURIComponent(a.data);
        return k ? c + ";base64," + k(a.data) : c + "," + encodeURIComponent(a.data)
      } else if (real_create_object_url) return real_create_object_url.call(o, a)
    };
    m.revokeObjectURL = function(a) {
      a.substring(0, 5) !== "data:" && real_revoke_object_url && real_revoke_object_url.call(o, a)
    };
    i.append = function(a) {
      var b = this.data;
      if (v && a instanceof p) if (n) b.push(String.fromCharCode.apply(String, new v(a)));
      else for (var b = "", a = new v(a), e = 0, g = a.length; e < g; e++) b += String.fromCharCode(a[e]);
      else if (c(a) === "Blob" || c(a) === "File") if (f) e = new f, b.push(e.readAsBinaryString(a));
      else throw new h("NOT_READABLE_ERR");
      else a instanceof d ? a.encoding === "base64" && l ? b.push(l(a.data)) : a.encoding === "URI" ? b.push(decodeURIComponent(a.data)) : a.encoding === "raw" && b.push(a.data) : (typeof a !== "string" && (a += ""), b.push(unescape(encodeURIComponent(a))))
    };
    i.getBlob = function(a) {
      arguments.length || (a = null);
      return new d(this.data.join(""), a, "raw")
    };
    i.toString = function() {
      return "[object BlobBuilder]"
    };
    e.slice = function(a, c, b) {
      var f = arguments.length;
      f < 3 && (b = null);
      return new d(this.data.slice(a, f > 1 ? c : this.data.length), b, this.encoding)
    };
    e.toString = function() {
      return "[object Blob]"
    };
    return b
  }(self)
} catch (e$$7) {}
var saveAs = saveAs ||
function(a) {
  var c = a.document,
    b = a.URL || a.webkitURL || a,
    d = c.createElementNS("http://www.w3.org/1999/xhtml", "a"),
    i = "download" in d,
    e = function(b) {
      var f = c.createEvent("MouseEvents");
      f.initMouseEvent("click", !0, !1, a, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null);
      return b.dispatchEvent(f)
    },
    f = a.webkitRequestFileSystem,
    h = a.requestFileSystem || f || a.mozRequestFileSystem,
    g = function(c) {
      (a.setImmediate || a.setTimeout)(function() {
        throw c;
      }, 0)
    },
    j = 0,
    o = [],
    m = function(a, c, b) {
      for (var c = [].concat(c), f = c.length; f--;) {
        var d = a["on" + c[f]];
        if (typeof d === "function") try {
          d.call(a, b || a)
        } catch (e) {
          g(e)
        }
      }
    },
    k = function(c, b) {
      var g = this,
        l = c.type,
        k = !1,
        u, w, x = function() {
          var b = (a.URL || a.webkitURL || a).createObjectURL(c);
          o.push(b);
          return b
        },
        y = function() {
          m(g, "writestart progress write writeend".split(" "))
        },
        s = function() {
          if (k || !u) u = x(c);
          w.location.href = u;
          g.readyState = g.DONE;
          y()
        },
        t = function(a) {
          return function() {
            if (g.readyState !== g.DONE) return a.apply(this, arguments)
          }
        },
        z = {
          create: !0,
          exclusive: !1
        },
        A;
      g.readyState = g.INIT;
      b || (b = "download");
      if (i && (u = x(c), d.href = u, d.download = b, e(d))) {
        g.readyState = g.DONE;
        y();
        return
      }
      a.chrome && l && l !== "application/octet-stream" && (A = c.slice || c.webkitSlice, c = A.call(c, 0, c.size, "application/octet-stream"), k = !0);
      f && b !== "download" && (b += ".download");
      w = l === "application/octet-stream" || f ? a : a.open();
      h ? (j += c.size, h(a.TEMPORARY, j, t(function(a) {
        a.root.getDirectory("saved", z, t(function(a) {
          var f = function() {
              a.getFile(b, z, t(function(a) {
                a.createWriter(t(function(b) {
                  b.onwriteend = function(c) {
                    w.location.href = a.toURL();
                    o.push(a);
                    g.readyState = g.DONE;
                    m(g, "writeend", c)
                  };
                  b.onerror = function() {
                    var a = b.error;
                    a.code !== a.ABORT_ERR && s()
                  };
                  "writestart progress write abort".split(" ").forEach(function(a) {
                    b["on" + a] = g["on" + a]
                  });
                  b.write(c);
                  g.abort = function() {
                    b.abort();
                    g.readyState = g.DONE
                  };
                  g.readyState = g.WRITING
                }), s)
              }), s)
            };
          a.getFile(b, {
            create: !1
          }, t(function(a) {
            a.remove();
            f()
          }), t(function(a) {
            a.code === a.NOT_FOUND_ERR ? f() : s()
          }))
        }), s)
      }), s)) : s()
    },
    l = k.prototype;
  l.abort = function() {
    this.readyState = this.DONE;
    m(this, "abort")
  };
  l.readyState = l.INIT = 0;
  l.WRITING = 1;
  l.DONE = 2;
  l.error = l.onwritestart = l.onprogress = l.onwrite = l.onabort = l.onerror = l.onwriteend = null;
  a.addEventListener("unload", function() {
    for (var a = o.length; a--;) {
      var c = o[a];
      typeof c === "string" ? b.revokeObjectURL(c) : c.remove()
    }
    o.length = 0
  }, !1);
  return function(a, c) {
    return new k(a, c)
  }
}(self), saveFile = function(a, c, b) {
  if (Modernizr.adownload) {
    var d = function(a) {
        var c, b, f = [],
          d, e = 0;
        for (d = 0; d < a.length; d++) if (c = a.charCodeAt(d), c < 256) f[e++] = c & 255;
        else {
          b = [];
          do b.push(c & 255), c >>= 8;
          while (c);
          b = b.reverse();
          for (c = 0; c < b.length; ++c) f[e++] = b[c]
        }
        return f
      }(c.match(/\.zip$/) ? a.generate(!0) : a),
      i, e, f = d.length,
      a = new Uint8Array(f);
    for (e = 0; e < f; e += 1) a[e] = d[e];
    Blob.constructor ? i = new Blob([a.buffer]) : BlobBuilder && (bb = new BlobBuilder, bb.append(a.buffer), i = bb.getBlob());
    i.encoding = "base64";
    saveAs(i, c)
  } else {
    if (b) {
      if (b.hasClass("disabled")) return;
      var h = $("<div>").html("&#x231b;");
      h.attr("data-icon", b.attr("data-icon"));
      b.attr("data-icon", h.text()).attr("disabled", "disabled")
    }
    $.post("http://icomoon.io/fileMirror/mirror.php", {
      file: c.match(/\.zip$/) ? a.generate() : JSZipBase64.encode(a),
      ext: c.match(/\.(\w+)$/)[1]
    }, function(a) {
      location.href = a.match(/dlLink: (.*)/)[1];
      b && b.attr("data-icon", h.attr("data-icon")).removeAttr("disabled")
    })
  }
}, svgPath = function(a) {
  function c(a) {
    return String(a.toFixed(3)).replace(/(\.\d*)0+$/, function(a, c) {
      return c
    })
  }
  function b(a, b, d) {
    return a.replace(/([MLHVCSQTA])([\d\.\,\-\seE\+]+)/gm, function(a, f, m) {
      return f === "A" ? a.replace(e, function(a, f, e, i, j) {
        j = Number(j);
        i === "-" && (j = -j);
        j += d;
        return f + c(Number(e) + b) + (j >= 0 ? "," : "") + j
      }) : f === "H" ? "H" + m.replace(/-?\d*\.?\d+/gm, function(a) {
        return c(Number(a) + b)
      }) : f === "V" ? "V" + m.replace(/-?\d*\.?\d+/gm, function(a) {
        return c(Number(a) + d)
      }) : f + m.replace(i, function(a, f, e, i, j) {
        e = Number(e) + b;
        j = Number(j) + d;
        f === "" && e > 0 && (f = " ");
        return f + c(e) + (j >= 0 ? "," : "") + c(j)
      })
    })
  }
  var d = [],
    i = /(\s*)(\-?(?:\d*\.?\d+(?:e[\+\-]?\d+)?))(\s*\,?\s*)(\-?(?:\d*\.?\d+(?:e[\+\-]?\d+)?))/gim,
    e = /(\s*[aA]\s*(?:(?:-?\d*\.?\d+(?:e[\+\-]?\d+)?)(?:-|\s+|,)){5})(-?\d*\.?\d+(?:e[\+\-]?\d+)?)(-|\s+|,)(-?\d*\.?\d+(?:e[\+\-]?\d+)?)/gm;
  return {
    setPathData: function(c) {
      a = c;
      /^\s*m/.test(a) && (a = a.replace(/^\s*m((?:\s*(?:[\-\+]?[\.\d]+(?:e[\+\-]\d+)?\s*\,?)){2})/im, function(a, c) {
        return "M" + c + " m0 0,"
      }))
    },
    getPathData: function() {
      return a
    },
    ellipse: function(c, b, d, e, i) {
      i = i || 0;
      a = "M" + (c - d) + "," + b + "A" + d + "," + e + " " + i + " 1,0 " + (c + d) + "," + b + "A" + d + "," + e + " " + i + " 1,0 " + (c - d) + "," + b + "z";
      return this
    },
    polygon: function(c) {
      a = c.replace(i, function(a, c, b, d, f) {
        return "L" + b + (f >= 0 ? "," : "") + f
      });
      a = "M" + a.substr(1) + "z";
      return this
    },
    translate: function(c, d) {
      a = b(a, c, d);
      return this
    },
    transform: function(d) {
      var h = 0,
        g = 0;
      a = a.replace(/([MLHVCSQTA])([\d\.\,\-\seE\+]+)/gim, function(a, b, m) {
        var k, l, n, p;
        return b.match(/a/i) ? a.replace(e, function(a, b, e, j, n) {
          n = Number(n);
          j === "-" && (n = -n);
          h = e = Number(e);
          g = n;
          k = d.a * e + d.c * n;
          l = d.b * e + d.d * n;
          j = l >= 0 ? "," : "";
          b = b.replace(/(\s*[aA]\s*(?:-?\d*\.?\d+)(?:-|\s+|,)(?:-?\d*\.?\d+)(?:\s+|,))(-?\d*\.?\d+)(?:\s+|,)(1|0)(?:\s+|,)(1|0)/m, function(a, b, e, g, h) {
            b = b.replace(i, function(a, b, e, i, g) {
              e = Number(e) * Math.sqrt(d.a * d.a + d.c * d.c);
              g = Number(g) * Math.sqrt(d.b * d.b + d.d * d.d);
              return c(e) + "," + c(g)
            });
            d.a === 1 && d.b === 0 && d.c === 0 && d.d === -1 && (h = 1 - Number(h));
            return b + c(Math.atan2(d.b, d.d) * 180 / Math.PI + Number(e)) + " " + g + " " + h
          });
          return b + c(k) + j + c(l)
        }) : b.match(/v|h/i) ? (b.match(/v|h/) ? "l" : "L") + m.replace(/-?\d*\.?\d+/gm, function(a) {
          p = n = 0;
          b.match(/h/i) ? (n = Number(a), b.match(/H/) ? (h = n, p = g) : h += n) : (p = Number(a), b.match(/V/) ? (g = p, n = h) : g += p);
          k = d.a * n + d.c * p;
          l = d.b * n + d.d * p;
          return c(k) + "," + c(l) + " "
        }) : (m = m.replace(i, function(a, b, e, g, i) {
          n = Number(e);
          p = Number(i);
          k = d.a * n + d.c * p;
          l = d.b * n + d.d * p;
          g = l >= 0 ? "," : "";
          b === "" && k > 0 && (b = " ");
          return b + c(k) + g + c(l)
        }), b.match(/[A-Z]/) ? (h = n, g = p) : (h += n, g += p), b + m)
      });
      if (d.e || d.f) a = b(a, d.e, d.f);
      return this
    },
    orient: function() {
      var b = normalizePath(a),
        c = b.replace(/M/g, "|M").split("|"),
        e;
      if (d.length && !/NaN|undefined/i.test(b)) {
        c.splice(0, 1);
        for (b = 0; b < d.length; b += 1) if (!d[b].getOrientation()) return;
        for (b = 0; b < c.length; b += 1) e = c[b], /Z/.test(e) || (e += " Z"), e && (e = reverseNormalizedPath(e.trim()), c[b] = e);
        a = c.join(" ")
      }
    }
  }
};
$.fn.tinySVG = function(a) {
  var c = function(a) {
      var b = /(\-?(?:\d*\.?\d+))(?:(?:\s*\,?\s*)(\-?(?:\d*\.?\d+))?)/gm,
        c = [],
        f = [],
        h, g;
      (a.attr("transform") || "").replace(/(\w+)\s*\(([\d\s\.\,\-]+)\)/gm, function(a, d, m) {
        d === "matrix" ? (m.replace(b, function(a, b, c) {
          f.push(b);
          f.push(c)
        }), f.length === 6 && c.push({
          a: Number(f[0]),
          b: Number(f[1]),
          c: Number(f[2]),
          d: Number(f[3]),
          e: Number(f[4]),
          f: Number(f[5])
        })) : d === "scale" || d === "translate" ? m.replace(b, function(a, b, i) {
          b = Number(b);
          i = Number(i);
          d === "scale" ? (b = b || 1, c.push({
            a: b,
            b: 0,
            c: 0,
            d: i || b
          })) : c.push({
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: b || 0,
            f: i || 0
          })
        }) : d === "rotate" && m.replace(b, function(a, b) {
          b = Number(b) / 180 * Math.PI;
          h = Math.cos(b);
          g = Math.sin(b);
          c.push({
            a: h,
            b: g,
            c: -g,
            d: h
          })
        })
      });
      a.removeAttr("transform");
      return c
    },
    b = function(a, b) {
      var c;
      for (c = b.length - 1; c > -1; c -= 1) a.transform(b[c])
    };
  return this.each(function() {
    var d = $(this),
      i = "",
      e;
    if (d.is("path")) e = svgPath(d.attr("d")), b(e, c(d)), d.attr("d", e.getPathData());
    else if (d.is("svg")) {
      d.find("pattern").remove();
      var f = d.children();
      if (!f.eq(0).is("g") || f.length > 1) {
        var h = document.createElementNS("http://www.w3.org/2000/svg", "g");
        f.each(function() {
          var a = $(this);
          a.is("polygon, path, circle, rect, ellipse, g") ? h.appendChild(a[0]) : a.find("polygon, path, circle, rect, ellipse, g").length ? h.appendChild($("<g>").append(a.children())[0]) : a.remove()
        });
        d[0].appendChild(h)
      }
      d.find("g").each(function() {
        var d = $(this),
          e = d.attr("transform") || "",
          h = c(d),
          m;
        if (d.attr("display") === "none") d.remove();
        else if (i = "", f = d.children(), d.removeAttr("class id"), f.each(function() {
          var d = $(this),
            f = svgPath(),
            g, k, q, r;
          g = d.attr("fill");
          k = d.attr("style");
          if (!((g === "none" || g === "transparent") && !d.is("g") || d.attr("display") === "none" || d.attr("visibility") === "none" || d.attr("opacity") === "0" || k && (/fill\s*:\s*none/.test(k) || /display\s*:\s*none/.test(k)))) {
            if (d.is("rect")) g = Number(d.attr("x")) || 0, k = Number(d.attr("y")) || 0, q = Number(d.attr("width")) || 0, r = Number(d.attr("height")) || 0, q = g + q, r = k + r, f.polygon(g + "," + k + " " + q + "," + k + " " + q + "," + r + " " + g + "," + r);
            else if (d.is("circle")) g = Number(d.attr("cx")) || 0, k = Number(d.attr("cy")) || 0, q = Number(d.attr("r")) || 0, f.ellipse(g, k, q, q);
            else if (d.is("ellipse")) g = Number(d.attr("cx")) || 0, k = Number(d.attr("cy")) || 0, q = Number(d.attr("rx")) || 0, r = Number(d.attr("ry")) || 0, f.ellipse(g, k, q, r);
            else if (d.is("polygon") || d.is("polyline")) f.polygon(d.attr("points"));
            else if (d.is("path")) f.setPathData(d.attr("d"));
            else {
              d.is("g") ? d.attr("transform", e + " " + d.attr("transform")) : d.remove();
              return
            }
            m = h.concat(c(d));
            b(f, m);
            g = f.getPathData();
            a && (i += g);
            f = document.createElementNS("http://www.w3.org/2000/svg", "path");
            f.setAttributeNS(null, "d", g);
            d.after(f)
          }
          d.remove()
        }), a && i) {
          var k = document.createElementNS("http://www.w3.org/2000/svg", "path");
          k.setAttributeNS(null, "d", i);
          d.children(":not(g)").remove();
          d.append(k)
        }
      });
      a && (d.find("g").each(function() {
        $(this).children().unwrap()
      }), i = "", f = d.children("path").each(function(a) {
        var b = $(this);
        i += b.attr("d");
        a && b.remove()
      }), f.eq(0).attr("d", i))
    }
  })
};
$.fn.dropDown = function(a, c) {
  var b = this.add(c);
  $("html").on("click", function() {
    b.children("div, ul").addClass(a)
  }).on("keydown", function(c) {
    c.which === 27 && b.children("div, ul").addClass(a)
  });
  return this.each(function() {
    var c = $(this);
    c.data("dropDownTrigger", !0);
    c.children("div, ul").addClass(a).on("click", function(a) {
      $(a.target).is("div, ul") && a.stopPropagation()
    });
    c.on("click", function(c) {
      b.not($(this)).children("div, ul").addClass(a);
      $(this).children("div, ul").toggleClass(a);
      c.stopPropagation();
      $(c.target).parent().data("dropDownTrigger") && c.preventDefault()
    })
  })
};
$.fn.progress = function() {
  return this.each(function() {
    var a = $(this),
      c = $("<div>");
    a.after($('<div class="progress ' + a.attr("data-class") + '">').append(c)).addClass("hidden")
  })
};
$.fn.presets = function() {
  return this.each(function() {
    var a = $(this),
      c = $(a.attr("data-presets")),
      b = a.attr("data-tip");
    a.on("focus", function() {
      a.attr("data-tip", "");
      c.removeClass("hidden")
    }).on("blur", function() {
      c.css("opacity", 0);
      setTimeout(function() {
        c.addClass("hidden").removeAttr("style");
        a.attr("data-tip", b)
      }, 300)
    });
    c.find("a").each(function() {
      $(this).on("click", function() {
        a.val($(this).attr("href").substr(1)).change();
        return !1
      })
    })
  })
};
$.fn.checkbox = function(a, c) {
  return !a ? this : this.each(function() {
    var b = $(this),
      d = b.find("input").eq(0);
    if (d.length && (d.prop("checked") ? b.addClass(a) : b.removeClass(a), d.on("change", function() {
      d.attr("type") === "radio" ? (b.addClass(a), d.prop("checked", !0), b.siblings().each(function() {
        var b = $(this),
          c = b.find('[type="radio"]');
        c.length && (b.removeClass(a), c.prop("checked"))
      })) : b.toggleClass(a)
    }), c)) d.on("focus", function() {
      b.addClass(c)
    }).on("blur", function() {
      b.removeClass(c)
    })
  })
};
(function(a) {
  function c(b) {
    var c = b || window.event,
      d = [].slice.call(arguments, 1),
      h = 0,
      g = 0,
      j = 0;
    return b = a.event.fix(c), b.type = "mousewheel", c.wheelDelta && (h = c.wheelDelta / 120), c.detail && (h = -c.detail / 3), j = h, c.axis !== void 0 && c.axis === c.HORIZONTAL_AXIS && (j = 0, g = -1 * h), c.wheelDeltaY !== void 0 && (j = c.wheelDeltaY / 120), c.wheelDeltaX !== void 0 && (g = -1 * c.wheelDeltaX / 120), d.unshift(b, h, g, j), (a.event.dispatch || a.event.handle).apply(this, d)
  }
  var b = ["DOMMouseScroll", "mousewheel"];
  if (a.event.fixHooks) for (var d = b.length; d;) a.event.fixHooks[b[--d]] = a.event.mouseHooks;
  a.event.special.mousewheel = {
    setup: function() {
      if (this.addEventListener) for (var a = b.length; a;) this.addEventListener(b[--a], c, !1);
      else this.onmousewheel = c
    },
    teardown: function() {
      if (this.removeEventListener) for (var a = b.length; a;) this.removeEventListener(b[--a], c, !1);
      else this.onmousewheel = null
    }
  };
  a.fn.extend({
    mousewheel: function(a) {
      return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
    },
    unmousewheel: function(a) {
      return this.unbind("mousewheel", a)
    }
  })
})(jQuery);

function zeroPad(a, c) {
  for (a = String(a); a.length < c;) a = "0" + a;
  return a
}
$.fn.numberInput = function(a, c, b, d, i) {
  return this.each(function() {
    $(this).on("change", function() {
      var e = $(this),
        f = !1,
        h = e.val(),
        g, j;
      if (h === "" || isNaN(d ? parseInt(h, 16) : Number(h))) {
        if (isNaN(a)) {
          e.val("");
          return
        }
        d && (a = a.toString(16));
        e.val(a);
        h = a;
        f = !0
      }
      h = d ? parseInt(e.val(), 16) : Number(e.val());
      j = parseInt(d, 10);
      g = h.toString(16);
      j && (g = zeroPad(g, j));
      d && g !== e.val() && (e.val(g), f = !0);
      !isNaN(b) && h > b && (e.val(d ? b.toString(16) : b), f = !0);
      !isNaN(c) && h < c && (e.val(d ? c.toString(16) : c), f = !0);
      f && !i && (e.addClass("error1"), setTimeout(function() {
        e.removeClass("error1").change()
      }, 300))
    }).on("focus", function() {
      $(this).data("focused", !0)
    }).on("blur", function() {
      $(this).data("focused", !1)
    }).on("keydown mousewheel", function(a, f) {
      var h = $(this);
      if (h.data("focused")) {
        var g = d ? parseInt(h.val(), 16) : Number(h.val()),
          i, o;
        a.shiftKey ? (i = isNaN(b) ? 10 : Math.min(10, b - g), o = isNaN(c) ? 10 : Math.min(10, g - c)) : i = o = 1;
        if (a.which === 38 || f > 0) {
          if (!isNaN(g) && (isNaN(b) || g + i <= b)) g += 1 * i, d && (g = g.toString(16)), h.val(g), h.change()
        } else if (a.which === 40 || f < 0) if (!isNaN(g) && (isNaN(c) || g - o >= c)) g -= 1 * o, d && (g = g.toString(16)), h.val(g), h.change();
        a.type === "mousewheel" && a.preventDefault()
      }
    })
  })
};
Storage.prototype.setObject = function(a, c) {
  this.setItem(a, JSON.stringify(c));
  if (!localStorage.stateID) localStorage.stateID = 0;
  localStorage.stateID = parseInt(localStorage.stateID, 10) + 1
};
Storage.prototype.getObject = function(a) {
  return JSON.parse(this.getItem(a))
};
$.fn.cacheInput = function() {
  function a(a, b) {
    var d = a.attr("id");
    b.match(/text|select|url/i) ? cache[d] = a.val() : b.match(/checkbox/) && (cache[d] = a.prop("checked") || !1);
    localStorage.setObject("inputCache", cache)
  }
  cache = localStorage.getObject("inputCache") || {};
  return this.each(function() {
    var c = $(this),
      b = c.is("input") ? c.attr("type") : "",
      d = cache[c.attr("id")];
    c.is("select") && (b = "select");
    d !== void 0 ? b.match(/text|select|url/i) ? c.val(d) : b.match(/checkbox/) && (d || d === "checked" ? c.prop("checked", !0) : c.prop("checked", !1)) : a(c, b);
    c.on("change", function() {
      a(c, b)
    })
  })
};
var icomoonCache = function() {
    var a = {};
    if (window.indexedDB) {
      var c = function() {},
        b = {},
        d = [],
        i = !1;
      loadScript("js/libs/idbstore.min.js", function() {
        b = new IDBStore({
          dbVersion: 1,
          storeName: "storage",
          keyPath: "storeKey",
          onStoreReady: function() {
            i = !0;
            var a;
            for (a = 0; a < d.length; a += 1) d[a]()
          }
        })
      });
      a.save = function(a, f, h, g) {
        var j = function() {
            b.put({
              storeKey: a,
              obj: f
            }, h || c, g || c)
          };
        i ? j() : d.push(j)
      };
      a.load = function(a, f, h) {
        if (!(!a && isNaN(a) || typeof f !== "function")) {
          var g = function() {
              b.get(a, function(a) {
                f(a && a.obj)
              }, h || c)
            };
          i ? g() : d.push(g)
        }
      };
      a.clear = function(a, d) {
        b.clear(a, d || c)
      }
    } else a.save = function(a, b, c) {
      setTimeout(function() {
        localStorage.setItem(a, JSON.stringify(b));
        c && c()
      }, 0)
    }, a.load = function(a, b) {
      !a && isNaN(a) || typeof b !== "function" || setTimeout(function() {
        b(JSON.parse(localStorage.getItem(a)))
      }, 0)
    }, a.clear = function(a) {
      setTimeout(function() {
        localStorage.clear();
        a && a()
      }, 0)
    };
    return a
  };
if (!String.prototype.trim) String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, "")
};
String.prototype.idfy = function() {
  return this.trim().replace(/\s|\./g, "-").replace(/[^a-z0-9\-\_]+/ig, "")
};
$(document).ready(function() {
  function w(a, b) {
    z === -1 ? setTimeout(function() {
      w(a, b)
    }, 50) : z === 1 ? a && a() : z === 0 ? b && b() : (z = -1, $.ajax({
      type: "POST",
      url: "http://i.icomoon.io/authstat",
      xhrFields: {
        withCredentials: !0
      },
      success: function(d) {
        d = JSON.parse(d);
        d.auth ? (z = 1, j.user = {
          email: d.mail,
          newsletter: !d.optout,
          secret: d.secret,
          uid: d.uid
        }, a && a()) : (z = 0, b && b())
      },
      error: function() {
        z = 0;
        b && b()
      }
    }))
  }
  function B(a) {
    if (typeof a === "string") a = "x" + a;
    else if (a < 65536) return String.fromCharCode(a);
    return $("<div>").html("&#" + a + ";").text()
  }

  function U(a, b) {
    if (!a) return "";
    for (var b = b || "x", d = "", c = 0, e; c < a.length; c += 1) a.charCodeAt(c) >= 55296 && a.charCodeAt(c) <= 56319 ? (e = (65536 + 1024 * (Number(a.charCodeAt(c)) - 55296) + Number(a.charCodeAt(c + 1)) - 56320).toString(16), c += 1) : e = a.charCodeAt(c).toString(16), d += b + e;
    return d.substr(b.length)
  }
  function ea(a, b) {
    var d, c;
    if (a && !isNaN(b)) {
      a = a.trim().split(/\s*\,\s*/);
      for (c = 0; c < a.length; c++) a[c] && ((d = G[a[c]]) ? d.push && d.push(b) : G[a[c]] = [b])
    }
  }
  function fa(a, b) {
    var d, c;
    if (a && !isNaN(b)) {
      a = a.trim().split(/\s*\,\s*/);
      for (d = 0; d < a.length; d++) if (a && (c = G[a[d]])) c = c.indexOf(b), c >= 0 && G[a[d]].splice(c, 1)
    }
  }
  function O(a, b, d, c) {
    a = a.concat ? $(a) : a;
    if (isNaN(b)) {
      for (b = 0; j.IDs.indexOf(b) > -1;) b += 1;
      j.IDs.push(b)
    }
    var e = U(a.attr("data-du")),
      f = d.hasClass("metadata") ? ' data-metadata="#' + d.attr("id") + '"' : "",
      h = $('<div id="icon' + b + '" class="icon"' + f + '><label><input type="checkbox" class="checkbox-icon hidden"' + (e ? ' data-unicode="' + e + '"' : "") + '" /></label></div>'),
      e = a.children("path:first"),
      m, n, f = $("#prev_size").val(),
      k, o, u, s, q, p, E, ga, r, l, v, C, A;
    h.children("label").append(a);
    d.prepend(h);
    ea(a.attr("data-tags"), b);
    c || t.save("icomoon0", j);
    try {
      k = a[0].width.baseVal.value;
      o = a[0].height.baseVal.value;
      u = Number(a[0].getAttribute("width").match(/\d+/));
      s = Number(a[0].getAttribute("height").match(/\d+/));
      u !== k && (a[0].setAttributeNS(null, "width", u), k = u);
      s !== o && (a[0].setAttributeNS(null, "height", s), o = s);
      n = Math.max(k, o);
      q = a[0].getAttribute("viewBox");
      a[0].setAttributeNS(null, "viewBox", "0 0 " + k + " " + o);
      q || (q = "viewBox");
      q = q.trim().split(/\s*[\,\s]\s*/);
      ga = Number(q[0]);
      r = Number(q[1]);
      p = Number(q[2]);
      E = Number(q[3]);
      if (p < 0 || E < 0) throw Error("Invalid viewBox.");
      if (k >= o && p >= E || k <= o && p >= E) l = v = k / p, C = 0;
      else if (k <= o && p <= E || k >= o && p <= E) v = l = o / E;
      if (l && (A = (o - v * E) / 2, C = (k - l * p) / 2, C -= ga, A -= r, l !== 1 || C || A)) e.attr("transform", "translate(" + C + " " + A + ") scale(" + l + " " + v + ")"), a.tinySVG(1), e = a.children("path:first")
    } catch (x) {
      try {
        m = e[0].getBBox(), k = m.width, o = m.height, n = Math.max(k, o), a[0].setAttributeNS(null, "width", n + "px"), a[0].setAttributeNS(null, "height", n + "px"), a[0].setAttributeNS(null, "viewBox", "0 0 " + n + " " + n)
      } catch (Aa) {}
    }
    if (n && n < 64) {
      d = 1;
      do d += 1;
      while (n * d < 64);
      e[0].setAttributeNS(null, "transform", "scale(" + d + " " + d + ")");
      k *= d;
      o *= d;
      a[0].setAttributeNS(null, "viewBox", "0 0 " + k + " " + o);
      a[0].setAttributeNS(null, "width", k + "px");
      a[0].setAttributeNS(null, "height", o + "px");
      a.tinySVG(!0)
    }
    F(a, f);
    return b
  }
  function ha(a) {
    var b, d, c, e;
    if (a.metadata.id) / icomoon / i.test(a.metadata.id) && /Royalty Free|Arbitrary/i.test(a.metadata.license) && (d = $("#smiley"), d.attr("data-icon", d.attr("data-icon2")).attr("data-tip", "Thank You!")), d = $("#" + a.metadata.id), d.length ? (K(d.children(".icon")), b = d, d = d.parent()) : (b = $('<div id="' + a.metadata.id + '" class="iconset metadata">'), d = $('<section class="clearfix">').append($("#hdr_tmpl").clone().removeAttr("id")), d.append(b), $("#iconSets").prepend(d), c = d.find("input").attr("id", "hdr-" + a.metadata.id).prop("checked", !0).cacheInput(), e = c.parent(), c.prop("checked") ? e.addClass("selected") : ($("#" + a.metadata.id).addClass("invisible"), e.removeClass("selected"))), d.find("span").html(a.metadata.name || a.metadata.id || "Untitled Set"), a.metadata.link ? d.find("a").attr("href", a.metadata.link).addClass("icon-b") : d.find("a").removeClass("icon-b"), a.metadata.author ? (c = a.metadata.authorLink ? '<a target="_blank" href="' + a.metadata.authorLink + '" class="fgc1">' + a.metadata.author + "</a>" : a.metadata.author, d.find(".authorInfo").html("(By " + c + ")")) : d.find(".authorInfo").html("");
    else {
      b = 0;
      for (d = "#untitledSet" + b; $(d).length;) b += 1;
      b = $('<div class="iconset metadata">');
      d = $("#imported");
      d.prepend(b.removeClass("iconset"));
      d = d.parent()
    }
    a.metadata.name && b.attr("data-name", a.metadata.name);
    a.metadata.author && b.attr("data-author", a.metadata.author);
    a.metadata.authorLink && b.attr("data-authorLink", a.metadata.authorLink);
    a.metadata.license && b.attr("data-license", a.metadata.license);
    a.metadata.licenseLink && b.attr("data-licenseLink", a.metadata.licenseLink);
    a.metadata.link && b.attr("data-link", a.metadata.link);
    !isNaN(Number(a.metadata.grid)) && b.attr("data-grid", a.metadata.grid);
    d.removeClass("invisible");
    return {
      wrapper: b,
      container: d
    }
  }

  function ia(a) {
    var b = a.find("metadata iconset"),
      d = a.find("metadata author"),
      a = a.find("metadata license");
    return {
      id: b.attr("id"),
      name: b.attr("name"),
      link: b.attr("href"),
      grid: b.attr("grid"),
      author: d.attr("name"),
      authorLink: d.attr("href"),
      license: a.attr("name"),
      licenseLink: a.attr("href"),
      defaultunicode: b.attr("defaultunicode") === "false" ? !1 : !0
    }
  }
  function ja() {
    j.selected = [];
    r = [];
    $(".icon").find(".selected").removeClass("selected").children("input").prop("checked", !1);
    $(this).children("span").html("0000");
    $("#glyphs").html("");
    t.save("icomoon0", j)
  }
  function V(a, b, d, c) {
    var e, f = $(a.replace(/(\r|.|\n)+<svg/im, "<svg").replace(/<\/svg>(\r|.|\n)+/im, "</svg>")),
      h = f.find("glyph"),
      m = /data-tags/.test(a) && !/iconset[^>]*\sid=/.test(a);
    x = x || 1;
    var n = function(a) {
        if (x < 1) {
          Q();
          $("#loading").remove();
          var c = $("#import").children("div").removeClass("loading");
          c.children("span:first").removeClass("invisible");
          c.children("span:last").addClass("invisible");
          e && e.removeClass("hidden");
          if (a) W(d.attr("data-grid")), $("#library").addClass("hidden"), $("#browse").removeClass("hidden"), location.hash = "#browse", $(window).scrollTop(d.offset().top - $("#panel-top").outerHeight() - 16)
        }
        b && b();
        t.save("icomoon0", j);
        m && H(!0)
      };
    if (!window.indexedDB && j.IDs.length + h.length > 2700) D("Too many icons loaded.<br>Please remove some of the imported icons and try again."), x = 0, n(0);
    else if (h.length) {
      m && ja();
      var k = parseInt(f.find("font").attr("horiz-adv-x"), 10),
        c = f.find("font-face"),
        o = parseInt(c.attr("ascent"), 10),
        c = parseInt(c.attr("descent"), 10),
        u = o - c,
        s, q, p, l = [];
      x += h.length - 1;
      p = {
        metadata: ia(f),
        svgs: []
      };
      e = ha(p);
      d = e.wrapper;
      e = e.container;
      e.addClass("hidden");
      s = h.length - 1;
      var r = function(a, d) {
          var b = a.attr("d");
          if (b && b.length > 9) {
            var c = document.createElementNS(J, "svg"),
              e = document.createElementNS(J, "path"),
              f = a.attr("horiz-adv-x") || k,
              h = a.attr("data-tags") || a.attr("glyph-name");
            c.setAttributeNS(null, "width", f);
            c.setAttributeNS(null, "height", u);
            c.setAttributeNS(null, "viewBox", "0 0 " + f + " " + u);
            e.setAttributeNS(null, "d", b);
            e.setAttributeNS(null, "transform", "matrix(1 0 0 -1 0 " + (o - (d || 0)) + ")");
            c.appendChild(e);
            p.metadata.defaultunicode && c.setAttributeNS(null, "data-du", a.attr("unicode"));
            h && c.setAttributeNS(null, "data-tags", h);
            return $(c)
          }
          return !1
        },
        c = $("body"),
        P, w;
      for (q = 1; q < 20; q += 1) if (a = r(h.eq(h.length - q))) if (c.append(a), P = a[0].getBBox(), a.remove(), P.height === u) if (w === P.y) break;
      else w = P.y;
      var v = function() {
          var a;
          for (q = 0; q < 10 && s > -1; q++) if (a = h.eq(s), x -= 1, s -= 1, !a.hasClass("hidden") && (f = r(a, w))) a = O(f.tinySVG(!0), NaN, d, x), p.svgs.push($("<div>").append(f.clone()).html()), m && l.unshift($("#icon" + a).find("input"));
          if (s > -1) setTimeout(v, 1);
          else {
            delete p.defaultunicode;
            j.customIcons.push(p);
            for (q = 0; q < l.length; q += 1) L(l[q], !0);
            n(!0)
          }
        };
      v()
    } else x -= 1, a = ia(f), c && c.match(/[a-z][\w\-_]/i) && f.attr("data-tags", c.match(/[a-z][\w\-_].*/i)[0]), a.author && (f.attr("data-author", a.author), a.authorLink && f.attr("data-authorLink", a.authorLink), f.attr("class", "metadata")), a.license && (f.attr("data-license", a.license), a.licenseLink && f.attr("data-licenseLink", a.licenseLink), f.attr("class", "metadata")), f.tinySVG(!0, !0).find("path").length ? (O(f, NaN, d, x), d.parent().removeClass("invisible"), j.customIcons.push($("<div>").append(f.clone()).html())) : D('<div class="talign-left"><p>Error parsing your file(s). Consider the following guidelines:</p><ul><li>Strokes get ignored. Convert/Expand them to fills.</li><li>Unite/Combine your fills.</li></ul><p>If you still have problems importing your vector, <a href="https://github.com/Keyamoon/IcoMoon-App/issues">open a new issue</a>.</p></div>'), n(!0)
  }
  function ka(a) {
    function b(a) {
      e[d].type.match(/image.svg/) && V(a.target.result, !1, f, e[d].name.match(/(.+)(\..+$)/)[1]);
      c = new FileReader;
      c.onload = b;
      d += 1;
      c.readAsText(e[d]);
      d === e.length && $("#import")[0].reset()
    }
    var d, c, e = a.target.files,
      f = $("#imported"),
      h;
    h = !1;
    if (!e) e = a.dataTransfer.files, a.preventDefault(), a.stopPropagation(), $("#drop_zone").addClass("hidden");
    x = e.length;
    for (d = 0; a = e[d]; d++) a.type.match(/image.svg/) ? h = !0 : x -= 1;
    h ? (h = $("#import").children("div").addClass("loading"), h.children("span:first").addClass("invisible"), h.children("span:last").removeClass("invisible"), d = 0, c = new FileReader, c.onload = b, c.readAsText(e[d])) : ($("#import")[0].reset(), D("Please select an SVG image or font."))
  }
  function R(a, b) {
    var d, c, e, f;
    for (d = a || 0; d < X.length; d++) {
      e = X[d];
      for (c = e[0]; c <= e[1]; c++) if (f = c.toString(16), r.indexOf(f) < 0) return b || r.push(f), f
    }
    return 0
  }
  function H(a) {
    $("#num_selected").children("span").html(zeroPad(j.selected.length, 4));
    a || t.save("icomoon0", j)
  }
  function L(a, b, d) {
    if (a.length) {
      var c, e = a.parent(),
        f, h = e.parent().attr("id"),
        h = e.parent().attr("id").substr(4);
      svg = a.next("svg").clone();
      c = a.attr("data-unicode");
      !c || r.indexOf(c) > -1 ? c = R(parseInt(r[r.length - 1], 16) < 126 ? 2 : 0) : r.push(c);
      f = $('<div id="glyph' + c + '" class="glyph-wrapper unit"><div class="hdr"><button type="button" class="btn4 rmGlyph icon-b" data-icon="&#x2612;"><span class="visuallyhidden">Remove Glyph</span></button><input type="text" class="unicode code" value="&#x' + c.replace(/x/g, ";&#x") + ';" /><button type="button" class="btn4 showOptions icon-b" data-icon="&#8661;"><span class="visuallyhidden">encoding</span></button></div><div class="glyph draggable" draggable="true"></div><div class="ftr"><input class="code unicode-hex" type="text" value="' + (c.match(/x/) ? "" : "U+" + zeroPad(c, 4)) + '" /></div></div>');
      F(svg, 32);
      f.children(".glyph").append(svg.attr("data-idx", h));
      f.children(".ftr").children("input").numberInput(NaN, 32, 1114111, !0, !0);
      $("#glyphs").append(f);
      a.attr("data-unicode", c);
      d || j.selected.push({
        idx: h,
        unicode: c
      });
      b || H();
      e.addClass("selected");
      a.prop("checked", !0)
    }
  }
  function M(a, b) {
    var d, c = a.attr("data-unicode"),
      e = a.parent(),
      f = $("#glyph" + c);
    d = r.indexOf(c);
    d > -1 && r.splice(d, 1);
    for (d = 0; d < j.selected.length; d++) if (j.selected[d].unicode === c) {
      j.selected.splice(d, 1);
      break
    }
    f.remove();
    e.removeClass("selected");
    a.removeAttr("checked");
    b || H()
  }
  function I(a, b) {
    var d = a,
      a = b ? a.next() : a.prev();
    a.length || (d = d.parent(), d.hasClass("metadata") && (a = b ? d.next() : d.prev()));
    a.hasClass("metadata") ? a = a.children(b ? ":first" : ":last") : a.hasClass("invisible") && (a = I(a, b));
    return a
  }
  function la(a, b) {
    a.each(function() {
      var a = $(this),
        b = a.hasClass("submitting"),
        e = a.attr("data-icon");
      a.addClass("hidden");
      e = $('<div class="select size1of1"><button type="button" class="btn2 plm prs size1of1' + (e ? ' icon-b icon-t" data-icon="' + e + '" > ' : '" >') + a.children('option[value=""]').eq(0).html() + '<span class="icon-a icon-t mlm" data-icon="&#8661;"></span></button></div>');
      a.hasClass("tip-trigger") && e.children("button").addClass("tip-trigger").attr("data-tip", a.attr("data-tip"));
      var f = $('<ul class="' + a.attr("data-class") + '"></ul>');
      a.children("option").each(function(e) {
        var m = $(this);
        if (m.attr("value")) {
          var n = $("<li></li>");
          n.append($('<a href="#' + e + '" data-icon="&#10004;" class="' + (m.prop("selected") && !b ? "icon-b icon-absl" : "") + '">' + m.html() + "</a>").on("click", function(e) {
            f.find(".icon-b").removeClass("icon-b icon-absl");
            a.children("option").eq($(this).attr("href").substr(1)).prop("selected", !0);
            b ? (a.change(), a.submit()) : ($(this).addClass("icon-b icon-absl"), a.change());
            e.preventDefault()
          }));
          f.append(n)
        }
      });
      e.append(f);
      a.after(e)
    });
    a.next().dropDown("hidden", b)
  }
  function F(a, b) {
    var d = a[0].width.baseVal.value,
      c = a[0].height.baseVal.value,
      e = Math.max(d, c),
      e = b / e;
    d > c && d * e < 64 && (e = b / c);
    d = ((32 - e * d) / 2).toFixed() + "px";
    c = ((32 - e * c) / 2).toFixed() + "px";
    a.children("path").attr("transform", "scale(" + e + " " + e + ")");
    a.css({
      "margin-left": d,
      "margin-top": c
    })
  }
  function W(a, b) {
    var d = Number(a || $("#prev_size").val()),
      b = b || $("#icons");
    b.find("svg").each(function() {
      F($(this), d)
    });
    $("#cellStyles").html(".icon label {padding: " + d / 2 + "px;");
    a && $("#prev_size").val(d)
  }
  function ma(a) {
    var b = a.width,
      d = a.height,
      c = a.size,
      e = a.stroke ? a.stroke : d / 300,
      f = document.createElementNS(J, "line"),
      h = c = d / c,
      m = c,
      n = document.createElementNS(J, "rect"),
      k = document.createElementNS(J, "g");
    f.setAttributeNS(null, "stroke-width", e);
    for (a.color && f.setAttributeNS(null, "stroke", a.color); h < b;) f = f.cloneNode(!1), f.setAttributeNS(null, "x1", h), f.setAttributeNS(null, "x2", h), f.setAttributeNS(null, "y1", "0"), f.setAttributeNS(null, "y2", d), k.appendChild(f), h += c;
    for (; m < d;) f = f.cloneNode(!1), f.setAttributeNS(null, "y1", m), f.setAttributeNS(null, "y2", m), f.setAttributeNS(null, "x1", "0"), f.setAttributeNS(null, "x2", b), k.appendChild(f), m += c;
    n.setAttributeNS(null, "x", 0);
    n.setAttributeNS(null, "y", 0);
    n.setAttributeNS(null, "width", b);
    n.setAttributeNS(null, "height", d);
    n.setAttributeNS(null, "fill", "none");
    n.setAttributeNS(null, "stroke-width", e);
    a.color && n.setAttributeNS(null, "stroke", a.color);
    k.appendChild(n);
    k.setAttributeNS(null, "class", "svgGrid" + ($("#showGrid").prop("checked") ? "" : " invisible"));
    k.setAttributeNS(null, "id", "svgGrid");
    return k
  }
  function Y(a) {
    var b = $("#details_svg");
    if (a.hasClass("icon")) {
      var d = a.attr("id"),
        c = a.children("label").children("svg"),
        e, f, h;
      e = c[0].height.baseVal.value;
      f = c[0].width.baseVal.value;
      var m;
      h = $("#details");
      (m = h.hasClass("hidden")) && h.removeClass("hidden");
      h = $(a.attr("data-metadata"));
      c = c.clone();
      c.find("path").removeAttr("transform");
      b.html(c);
      c[0].removeAttributeNS(null, "width");
      c[0].removeAttributeNS(null, "height");
      c[0].setAttributeNS(null, "style", "width:100%;height:" + Math.min(parseInt($(window).outerHeight() / 2, 10), 480) + "px;max-height:50%");
      c.attr("data-id", d);
      $("#details_svg").data("w", f).data("h", e);
      a = parseInt(h.attr("data-grid"), 10);
      m || (a = $("#gridSize").val());
      if (isNaN(a)) for (a = 31; a > 4; a--) if (e % a === 0) break;
      $("#gridSize").val(a);
      c[0].appendChild(ma({
        width: f,
        height: e,
        size: a
      }));
      if (e = h.attr("data-author")) {
        if (f = h.attr("data-authorLink")) f = $('<a href="' + f + '">'), e = f.append(e);
        $("#details_author").removeClass("hidden").html(e).prev().removeClass("hidden")
      } else $("#details_author").addClass("hidden").prev().addClass("hidden");
      if (e = h.attr("data-license")) {
        if (h = h.attr("data-licenseLink")) f = $('<a href="' + h + '">'), e = f.append(e);
        $("#details_license").html(e).removeClass("hidden").prev().removeClass("hidden")
      } else $("#details_license").addClass("hidden").prev().addClass("hidden");
      $("#details_tags").val(c.attr("data-tags") || "");
      $("#details_save").attr("disabled", "disabled").html("Saved")
    } else b.addClass("transparent-full");
    (function() {
      setTimeout(function() {
        b.removeClass("transparent-full")
      }, 200)
    })()
  }
  function K(a) {
    var b, d, c = 0,
      e = [],
      f = [],
      h;
    a.each(function() {
      var a = $(this),
        d = a.children();
      M(d.children("input"), !0);
      b = parseInt(a.attr("id").substr(4), 10);
      e.push(b);
      fa(d.children("svg").attr("data-tags"), b);
      a.remove()
    });
    for (b = 0; b < j.customIcons.length; b++) if (a = j.customIcons[b], a.metadata) {
      h = [];
      for (d = 0; d < a.svgs.length; d++) e.indexOf(j.IDs[c]) < 0 && h.push(a.svgs[d]), c += 1;
      h.length ? (a.svgs = h, f.push(a)) : (a = a.metadata.id) ? (d = localStorage.getObject("inputCache"), delete d["hdr-" + a], localStorage.setObject("inputCache", d), a = $("#" + a), a.html(""), a.parent().addClass("invisible")) : (a = $("#imported"), a.find(".metadata").each(function() {
        $(this).children().length || $(this).remove()
      }), a.children().length || a.parent().addClass("invisible"))
    } else e.indexOf(j.IDs[c]) < 0 && f.push(j.customIcons[b]), c += 1;
    j.customIcons = f;
    f = [];
    for (b = 0; b < j.IDs.length; b++) e.indexOf(j.IDs[b]) < 0 && f.push(j.IDs[b]);
    j.IDs = f;
    H();
    a = $("#imported");
    a.children().length || a.parent().addClass("invisible")
  }
  function S() {
    var a = $("#lib"),
      b = [];
    $("#iconSets").find(".iconset").each(function() {
      $(this).children().length && b.push($(this).attr("data-name"))
    });
    a.find("section").each(function() {
      var a = $(this),
        c = a.find(".btn2"),
        e;
      b.indexOf(a.attr("data-name")) >= 0 ? (c.is("a") && (c.after('<button data-fontID="' + c.attr("data-fontID") + '" data-href="' + c.attr("href") + '" class="btn2"><span class="icon-b"></span><span class="caption"></span></button>'), e = c.next(), c.remove(), c = e), c.removeClass("js-add").addClass("js-remove"), c.find(".caption").html("Remove"), c.find(".icon-b").attr("data-icon", "-"), a.find(".corner1").removeClass("hidden")) : (a.find(".corner1").addClass("hidden"), c.is("a") || ((a = c.attr("data-href")) ? (c.after('<a class="btn2" data-fontID="' + c.attr("data-fontID") + '" href="' + a + '">' + c.html() + "</a>"), e = c.next(), c.remove(), c = e) : c.addClass("js-add"), c.find(".caption").html(a ? "Purchase" : "Add"), c.find(".icon-b").attr("data-icon", a ? B(57348) : "+")))
    })
  }
  function va(a, b) {
    $.ajax({
      type: "POST",
      url: "http://i.icomoon.io/purchases",
      xhrFields: {
        withCredentials: !0
      },
      success: function(d) {
        var c, e = {},
          d = JSON.parse(d);
        for (c = 0; c < d.length; c += 1) e[d[c].name] = {
          svgLink: d[c].svglink
        };
        a.find("a[data-fontID]").each(function() {
          $this = $(this);
          var a = $this.attr("data-fontID"),
            d = e[a];
          d && ($this.after('<button data-fontID="' + a + '" data-href2="' + d.svgLink + '" class="btn2"><span class="icon-b" data-icon="+"></span><span class="caption">Add</span></button>'), $this.remove())
        });
        b && b()
      }
    })
  }
  function na() {
    var a = location.hash,
      b;
    $(".section").addClass("hidden");
    b = $(a);
    b.length || (b = $("#browse"));
    b.removeClass("hidden");
    if (a === "#library") {
      var d = $("#lib");
      d.children().length === 1 ? $.get("iconfonts/lib.html?16", function(a) {
        var b = $(a);
        w(function() {
          va(b, function() {
            d.html(b);
            S()
          })
        }, function() {
          d.html(b);
          S()
        })
      }) : S()
    } else if (a === "#font") {
      $("#manualMetrics").prop("checked") || Z(!0);
      a = $("#glyphs");
      b = a.children().length;
      var c = a.prev();
      b === 0 ? (c.removeClass("hidden").children(".js-msg").html("You have not selected any icons for your font."), c.children(".icon-b").removeClass("hidden fgc-warning2").addClass("fgc-warning")) : (b = a.find("svg").not("[data-tags]").length || a.find('[data-tags=""]').length) ? (c.children(".js-msg").html((b === 1 ? "One of the selected icons has no name. " : "Some of the selected icons have no names. ") + "The first tag given to an icon is used for its name. You can edit tags in the previous step."), c.children(".icon-b").removeClass("hidden fgc-warning2").addClass("fgc-warning")) : (c.children(".js-msg").html("The first tag given to an icon is used for its name. You can edit tags in the previous step."), c.children(".icon-b").addClass("hidden"));
      $("#ligatures").prop("checked") ? $(".unicode").removeAttr("maxlength") : $(".unicode").attr("maxlength", 1)
    }
  }
  function T(a) {
    var b = a.val();
    b.length > 1 && ((b = b.replace(/[\s\-\_]/g, "")) || (b = " "), a.val(b));
    var d = a.parents(".glyph-wrapper").children(".ftr").children(),
      c = d.parents(".glyph-wrapper"),
      e = c.attr("id").substr(5),
      f = !! b.match(/^[!-~\s]+$/),
      b = U(b);
    if (b !== e) if (r.indexOf(b) > -1 || !f && b.match(/x/g) || !b) b = $("<div>"), b.html("&#x" + e.replace(/x/g, ";&#x") + ";"), a.val(b.text()), d.val(e.match(/x/) ? "" : e.toString(16)).blur(), a.addClass("error1"), setTimeout(function() {
      a.removeClass("error1");
      a.select()
    }, 400);
    else {
      r.splice(r.indexOf(e), 1);
      r.push(b);
      b.match(/x/) ? d.val("") : d.val(d.val().match(/U\+|^$/) ? "U+" + zeroPad(b, 4) : b);
      c.attr("id", "glyph" + b);
      $("#icon" + c.find("svg").attr("data-idx")).children().children("input").attr("data-unicode", b);
      for (d = 0; d < j.selected.length; d++) if (j.selected[d].unicode === e) {
        j.selected[d].unicode = b;
        break
      }
      t.save("icomoon0", j)
    }
  }
  function oa() {
    N = [];
    $(".icon").removeClass("invisible")
  }

  function Q(a) {
    oa();
    $("#searchCount").addClass("hidden");
    a || $("#search").val("");
    $(".iconset").each(function() {
      set = $(this);
      set.children().length && set.parent().removeClass("invisible")
    })
  }
  function wa(a, b) {
    if (a.length) {
      b.size = Number(b.size);
      var b = b || {},
        d, c, e, f = a.eq(0).clone(),
        h, m = 0,
        n = 0,
        k, o, j = "",
        s = [];
      maxDiffW = 0;
      maxDiffH = 0;
      addcssclass = function(a, d, c) {
        var e;
        try {
          d = d.clone(), $("body").append(d), F(d, b.size), e = d[0].getBBox(), d.remove()
        } catch (f) {}
        k = "-" + m + "px -" + n + "px;\n";
        e && (d = Number(e.width.toFixed()), e = Number(e.height.toFixed()), d > b.size && (k += "\twidth: " + d + "px;\n", c === b.cols - 1 && (maxDiffW = Math.max(d, maxDiffW))), e > b.size && (k += "\theight: " + d + "px;\n", c === b.cols - 1 && (maxDiffH = Math.max(e, maxDiffH))));
        o = "icon-" + a.replace(/\(|\)|\s/g, "");
        j += "." + o + " {\n\tbackground-position: " + k + "}\n";
        s.push('<div class="cell"><span class="' + o + '"></span> ' + o + "</div>")
      };
      b.cols = Math.min(b.cols, a.length);
      b.rows = Math.ceil(a.length / b.cols);
      F(f, b.size);
      c = b.cols * b.size * 2 - b.size;
      e = b.rows * b.size * 2 - b.size;
      if (b.names) {
        for (d = 0; d < b.names.length; d += 1) d && (j += ", "), j += ".icon-" + b.names[d];
        j = j.replace(/\(|\)|\s/g, "");
        j += " {\n\tdisplay: inline-block;\n\twidth: " + b.size + "px;\n\theight: " + b.size + "px;\n\tbackground-image: url(sprites.png);\n\tbackground-repeat: no-repeat;\n}\n";
        addcssclass(b.names[0], a.eq(0), 0)
      }
      for (d = 1; d < a.length; d += 1) h = a.eq(d).clone(), F(h, b.size), h.tinySVG(1), m = d % b.cols * b.size * 2, n = Math.floor(d / b.cols) * b.size * 2, h.find("path").attr("transform", "translate(" + m + "," + n + ")"), b.names && addcssclass(b.names[d], a.eq(d), d), h.tinySVG(1), f.append(h.find("path"));
      f.tinySVG(1);
      c += maxDiffW;
      e += maxDiffH;
      f[0].setAttributeNS(null, "width", c);
      f[0].setAttributeNS(null, "height", e);
      f[0].setAttributeNS(null, "viewBox", "0 0 " + c + " " + e);
      b.color && f[0].setAttributeNS(null, "fill", b.color);
      return {
        sprites: f,
        width: c,
        height: e,
        css: j.replace(/\-0px/g, "0"),
        html: '<!doctype html>\n<html>\n<head>\n\t<title>CSS Sprite</title>\n\t<link href="sprites.css" rel="stylesheet">\n</head>\n<style>\n\tbody {\n\t\tfont-family: sans-serif;\n\t\tcolor: #555;\n\t\tmargin: 2em;\n\t\tline-height: 1.5;\n\t}\n\ta, a:visited {\n\t\tcolor: #B35047;\n\t\ttext-decoration: none;\n\t}\n\ta:hover {\n\t\tbox-shadow: 0 1px;\n\t}\n\theader {\n\t\tpadding-bottom: .5em;\n\t\tmargin-bottom: 2em;\n\t\tbox-shadow: 0 1px #ccc;\n\t}\n\t.cell {\n\t\tfloat: left;\n\t\tmargin-right: 1.5em;\n\t\tfont-size: $fontSizeem;\n\t\tcolor: #$color;\n\t\twidth: 17em;\n\t\toverflow: hidden;\n\t}\n</style>\n<body>\n<header>\n\t<p>CSS Sprite Generated by <a href="http://icomoon.io/app">IcoMoon.io</a></p>\n</header>\n$cells\n</body>\n</html>'.replace(/\$cells/, s.join("\n")).replace(/\$fontSize/, b.size / 16).replace(/\$color/, b.color)
      }
    }
  }
  function pa(a, b, d) {
    b.add(d + ".png", a.toDataURL().replace(/.*,/m, ""), {
      base64: !0
    })
  }
  function aa(a, b, d, c) {
    var e = a ? a.children().children("svg") : b,
      f, h, m = e.attr("data-tags"),
      n = 2,
      k;
    if (c.name) m = c.name;
    m = m ? m.match(/^([^,]+)/)[1] : a.attr("id");
    m = m.trim().replace(/\s+/g, "-");
    e = e.clone();
    c.png && F(e, c.png);
    e.children("path").attr("d", b.children("path").attr("d"));
    e.removeAttr("class style data-du data-tags");
    e.attr("xmlns", J).attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
    c.grid && e.prepend(c.grid);
    c.color && e.attr("fill", "#" + c.color.toString(16));
    a = m;
    k = '<?xml version="1.0" encoding="utf-8"?>\n<\!-- Generator: IcoMoon.io  --\>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + $("<div>").append(e).html();
    if (d) {
      for (; d.files[(c.png ? "SVG/" : "") + a + ".svg"];) a = m + n, n += 1;
      c.namePrefix && (a = c.namePrefix + a);
      if (c.png) {
        e = b.clone();
        try {
          f = document.createElement("canvas");
          try {
            $("body").append(e), F(e, c.png), h = e[0].getBBox(), e.remove(), f.width = Math.max(h.width, c.width || c.png), f.height = Math.max(h.height, c.height || c.png)
          } catch (j) {
            f.width = f.height = c.png
          }
          canvg(f, k, {
            ignoreDimensions: !0
          });
          pa(f, d, c.name || "PNG/" + a);
          a = c.name || "SVG/" + a
        } catch (u) {}
      }
      k = k.replace(/transform\s*=\s*['"]?[^'"]*['"]?/gm, "").replace(/\s+/g, " ");
      d.add(a + ".svg", k)
    }
    return {
      str: k,
      name: a
    }
  }
  function qa(a) {
    var b = $("#details_svg").children().clone().tinySVG(1),
      d = b.attr("data-id"),
      c = 0,
      e;
    e = $("#" + d).children();
    var f = e.children("svg"),
      h;
    e = e.hasClass("selected") ? $("#glyph" + e.children("input").attr("data-unicode")).children(".glyph").children("svg") : !1;
    h = b.children("path").attr("d");
    f.children("path").attr("d", h);
    e && e.children("path").attr("d", h);
    a && ($("#details").addClass("hidden"), h = f.parent(), $(window).scrollTop(h.offset().top - h.outerHeight() - 16), h.css("background-color", "#fff"), setTimeout(function() {
      h.removeAttr("style")
    }, 400));
    d = Number(d.substr(4));
    a = j.IDs.indexOf(d);
    for (b = 0; b < j.customIcons.length; b++) if (e = j.customIcons[b], e.metadata) for (d = 0; d < e.svgs.length; d++) {
      if (c === a) {
        j.customIcons[b].svgs[d] = $("<div>").append(f.clone()).html();
        t.save("icomoon0", j);
        return
      }
      c += 1
    } else {
      if (c === a) {
        j.customIcons[b] = $("<div>").append(f.clone()).html();
        t.save("icomoon0", j);
        break
      }
      c += 1
    }
  }
  function D(a) {
    var b = $("#modal_alert");
    $("#alert_msg").html(/<p>/.test(a) ? a : "<p>" + a + "</p>");
    b.removeClass("hidden");
    b.find("button").focus()
  }
  function ra(a) {
    var b = $("#modal_confirm"),
      d = $("#confirm_yes"),
      c = $("#confirm_no"),
      e = function() {
        b.addClass("hidden")
      };
    b.find("p:first").html(a.msg);
    d.off("click");
    c.off("click");
    a.yes = a.yes || e;
    a.no = a.no || e;
    d.on("click", a.yes);
    c.on("click", a.no);
    a.focus = a.focus ? d : c;
    b.removeClass("hidden");
    a.focus.focus()
  }
  function xa(a) {
    var b = $("#modal_proj");
    if (!a.noUpdate) {
      var d = b.find("select"),
        c, e;
      b.find("p").html(a.msg);
      if (a.projects) {
        d.children().not(":first-child").remove();
        for (c = 0; c < a.projects.length; c += 1) e = (e = a.projects[c].name) || "untitled", d.append('<option value="' + c + '">' + (e.trim() || "unititled") + "</option>")
      }
      b.find(".select").remove();
      la(d);
      d.off("change");
      d.on("change", function() {
        a.callback($(this).val());
        b.addClass("hidden")
      })
    }
    b.removeClass("hidden")
  }
  function ba() {
    localStorage.clear();
    t.clear(function() {
      window.location.reload()
    })
  }
  function sa(a, b) {
    try {
      a = JSON.parse(a), localStorage.clear(), localStorage.setObject("inputCache", JSON.parse(a.inputCache)), localStorage.iconsVersion = a.iconsVersion, localStorage.share = a.share, j = a.icomoon.length ? JSON.parse(a.icomoon) : a.icomoon, t.save("icomoon0", j, b)
    } catch (d) {}
  }
  function l(a, b, d) {
    b ? (a.addClass("loading").attr("disabled", "disabled"), d && d.loading && a.html(d.loading)) : (a.removeClass("loading").removeAttr("disabled"), d && d.normal && (a.html(d.normal), /saved|cleared/i.test(d.normal) ? a.attr("disabled", "disabled") : a.removeAttr("disabled")))
  }
  function Z(a) {
    var b = {
      20: 5,
      16: 6.25,
      14: 200 / 14
    },
      d = {},
      c, e = Number($("#designGrid").val());
    if (!e || a) for (c in e = e || 16, $("[data-grid]").each(function() {
      var a = $(this),
        b = a.attr("data-grid");
      (a = a.find(".selected").length) && (d[b] = a)
    }), count = 0, d) d[c] > count && (e = c, count = d[c]);
    if (!isNaN(e)) {
      $("#emSize").val(Math.min(e * 32, 2048)).change();
      (a = b[e] || 100 / e) || (a = 4);
      for (b = a; a < 4;) a += b;
      $("#baseline").val(a).change();
      $("#designGrid").val(e)
    }
    $("#whitespace").val(50).change();
    $("#glyph_widths").val(100).change()
  }
  function ta(a) {
    if (j.selected.length) {
      var b = $("#base64").prop("checked"),
        d = parseInt($("#emSize").val(), 10) || 512,
        c = $("#baseline"),
        e, f, h, c = Number(c.val());
      (c = isNaN(c) ? 6.25 : c) || (c = 4);
      for (f = c; c < 4;) c += f;
      c /= 100;
      e = Number($("#designGrid").val() || (1 / c).toFixed(0));
      h = Number(e);
      if (h < 10) for (; h < 10;) h += e;
      else h = e > 9 && e < 25 ? e : e / 2;
      h = h < 48 ? h : 48;
      var c = -(c * d).toFixed(),
        m = d + c,
        n = 1,
        k = d * 1,
        o = $("#fi_id").val() || $("#fi_name").val(),
        u = $("#fi_class").val().idfy(),
        s, q, p, l = [],
        t = [];
      h = '<!doctype html>\n<html>\n<head>\n<title>Your Font/Glyphs</title>\n<link rel="stylesheet" href="style.css" />\n<\!--[if lte IE 7]><script src="lte-ie7.js"><\/script><![endif]--\>\n<style>\n\tsection, header, footer {display: block;}\n\tbody {\n\t\tfont-family: sans-serif;\n\t\tcolor: #444;\n\t\tline-height: 1.5;\n\t\tfont-size: 1em;\n\t}\n\t* {\n\t\t-moz-box-sizing: border-box;\n\t\t-webkit-box-sizing: border-box;\n\t\tbox-sizing: border-box;\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t}\n\t.glyph {\n\t\tfont-size: ' + h + 'px;\n\t\tfloat: left;\n\t\ttext-align: center;\n\t\tbackground: #eee;\n\t\tpadding: .75em;\n\t\tmargin: .75em 1.5em .75em 0;\n\t\twidth: 7.5em;\n\t\tborder-radius: .25em;\n\t\tbox-shadow: inset 0 0 0 1px #f8f8f8, 0 0 0 1px #CCC;\n\t}\n\t.glyph input {\n\t\tfont-family: consolas, monospace;\n\t\tfont-size: 13px;\n\t\twidth: 100%;\n\t\ttext-align: center;\n\t\tborder: 0;\n\t\tbox-shadow: 0 0 0 1px #ccc;\n\t\tpadding: .125em;\n\t}\n\t.w-main {\n\t\twidth: 80%;\n\t}\n\t.centered {\n\t\tmargin-left: auto;\n\t\tmargin-right: auto;\n\t}\n\t.fs1 {\n\t\tfont-size: 2em;\n\t}\n\theader {\n\t\tmargin: 2em 0;\n\t\tpadding-bottom: .5em;\n\t\tcolor: #666;\n\t\tbox-shadow: 0 2px #eee;\n\t}\n\theader h1 {\n\t\tfont-size: 2em;\n\t\tfont-weight: normal;\n\t}\n\t.clearfix:before, .clearfix:after { content: ""; display: table; }\n\t.clearfix:after, .clear { clear: both; }\n\tfooter {\n\t\tmargin-top: 2em;\n\t\tpadding: .5em 0;\n\t\tbox-shadow: 0 -2px #eee;\n\t}\n\ta, a:visited {\n\t\tcolor: #B35047;\n\t\ttext-decoration: none;\n\t}\n\ta:hover, a:focus {color: #000;}\n\t.box1 {\n\t\tfont-size: ' + h + 'px;\n\t\tdisplay: inline-block;\n\t\twidth: 15em;\n\t\tpadding: .25em .5em;\n\t\tbackground: #eee;\n\t\tmargin: .5em 1em .5em 0;\n\t}\n</style>\n</head>\n<body>\n\t<div class="w-main centered">\n\t<section class="mtm clearfix" id="glyphs">\n\t<header>\n\t\t<h1>Your font contains the following glyphs</h1>\n\t\t<p>The generated SVG font can be imported back to <a href="http://icomoon.io/app">IcoMoon</a> for modification.</p>\n\t</header>GLYPHS\n\t</section>\n\t<div class="clear"></div>\n\t<section class="mtm clearfix" id="glyphs">\n\t<header>\n\t\t<h1>Class Names</h1>\n\t</header>NAMES\n\t</section>\n\t<footer>\n\t\t<p>Generated by <a href="http://icomoon.io">IcoMoon.io</a></p>\n\t</footer>\n\t</div>\n\t<script>\n\tdocument.getElementById("glyphs").addEventListener("click", function(e) {\n\t\tvar target = e.target;\n\t\tif (target.tagName === "INPUT") {\n\t\t\ttarget.select();\n\t\t}\n\t});\n\t<\/script>\n</body>\n</html>';
      var w = "",
        x = "",
        v = "",
        C = "",
        A = "",
        z = "",
        B = [],
        y;
      includeMetadata = $("#include_metadata").prop("checked");
      i = 0;
      arr1 = [];
      arr2 = [];
      liga = !1;
      font_face = "@font-face {\n\tfont-family: 'fontID';\n\tsrc:url('fonts/fontID.eot');\n\tsrc:url('fonts/fontID.eot?#iefix') format('embedded-opentype'),\n\t\turl('fonts/fontID.woff') format('woff'),\n\t\turl('fonts/fontID.ttf') format('truetype'),\n\t\turl('fonts/fontID.svg#fontID') format('svg');\n\tfont-weight: normal;\n\tfont-style: normal;\n}\n";
      f = "";
      if (isNaN(n) || n < 0) n = 1;
      k *= n;
      f = 0;
      $("#iconSets").find(".iconset").each(function() {
        var a = $(this),
          d, b, c, e;
        a.children().children(".selected").length && (e = a.attr("data-name"), d = a.attr("data-license"), b = a.attr("data-licenselink"), c = a.attr("data-link"), e && (f || (y = a.attr("id")), f += 1), e && d && b && (z += (z ? "\n\n\n" : "") + "Icon Set:\t" + e + (c ? " -- " + c : "") + "\nLicense:\t" + d + " -- " + b))
      });
      if (f > 1 || !y) y = "icomoon";
      y = o || y;
      y = y.idfy();
      y = a && a.fontID || y;
      f = '<iconset grid="' + e + '"></iconset>';
      if (includeMetadata) {
        o && (s = $("<iconset>"), s.attr("id", o), (f = $("#fi_name").val()) && s.attr("name", f), (f = $("#fi_link").val()) && s.attr("href", f), s.attr("grid", e));
        if (f = $("#fi_author").val()) q = $("<author>"), q.attr("name", f), (f = $("#fi_authorLink").val()) && q.attr("href", f);
        if (f = $("#fi_license").val()) p = $("<license>"), p.attr("name", f), (f = $("#fi_licenseLink").val()) && p.attr("href", f);
        f = $("<div>").append(s).append(q).append(p).html()
      }
      for (i = 0; i < r.length; i++) r[i].match(/x/) ? arr1 = arr1.concat(r[i].split(/x/)) : arr2.push(r[i]);
      liga = arr1.length;
      a = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >\n<svg xmlns="http://www.w3.org/2000/svg">\n<metadata>\nThis is a custom SVG font generated byIcoMoon.\n' + f + '\n</metadata>\n<defs>\n<font id="' + y + '" horiz-adv-x="' + k + '" >\n<font-face units-per-em="' + d + '" ascent="' + m + '" descent="' + c + '" />\n<missing-glyph horiz-adv-x="' + k + '" />\n';
      $("#glyphs").find(".glyph").each(function() {
        var a = $(this),
          b = a.children("svg").clone(),
          c = d / b[0].height.baseVal.value,
          e = b[0].width.baseVal.value * c * n,
          a = "&#x" + U(a.prev().children("input").val()).replace(/x/g, ";&#x") + ";",
          h = b.attr("data-tags"),
          j = "untitled",
          o;
        h && (j = h.trim().split(/\s*\,\s*/)[0].replace(/\s+/g, "-").replace(/[^\w\d\-_]/gi, "") || "untitled");
        o = j;
        for (f = 2; B.indexOf(j) >= 0;) j = o + "-" + f, f += 1;
        B.push(j);
        h = h ? ' data-tags="' + h + '"' : "";
        c = "scale(" + c + " " + c + ")";
        b.children("path").attr("transform", "matrix(1 0 0 -1 0 " + m + ") " + c);
        b.tinySVG(!0);
        t.push({
          unicodeLength: a.length,
          str: '<glyph unicode="' + a + '" d="' + b.children("path").attr("d") + (e !== k ? '" horiz-adv-x="' + e : "") + '"' + h + " />\n"
        });
        w += '\n\t<div class="glyph">\n\t\t<div class="fs1" aria-hidden="true" data-icon="' + a + '"></div>\n\t\t<input type="text" readonly="readonly" value="' + (a.match(/x/g).length > 1 ? a : a.replace(/&/g, "&amp;")) + '" />\n\t</div>';
        x += '\n\t<span class="box1">\n\t\t<span aria-hidden="true" class="' + u + j + '"></span>\n\t\t&nbsp;' + u + j + "\n\t</span>";
        v += "." + u + j + ':before {\n\tcontent: "' + a.replace(/&#x/g, "\\").replace(/;/g, "") + '";\n}\n';
        C += "." + u + j + ", ";
        A += "\t\t\t'" + u + j + "' : '" + a + "',\n"
      });
      C = C.substr(0, C.length - 2);
      A = A.substr(0, A.length - 2);
      A = ("/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */\n\nwindow.onload = function() {\n\tfunction addIcon(el, entity) {\n\t\tvar html = el.innerHTML;\n\t\tel.innerHTML = '<span style=\"font-family: \\'" + y + "\\'\">' + entity + '</span>' + html;\n\t}\n\tvar icons = {\n//\n\t\t},\n\t\tels = document.getElementsByTagName('*'),\n\t\ti, attr, html, c, el;\n\tfor (i = 0; ; i += 1) {\n\t\tel = els[i];\n\t\tif(!el) {\n\t\t\tbreak;\n\t\t}\n\t\tattr = el.getAttribute('data-icon');\n\t\tif (attr) {\n\t\t\taddIcon(el, attr);\n\t\t}\n\t\tc = el.className;\n\t\tc = c.match(/" + u + "[^\\s'\"]+/);\n\t\tif (c && icons[c[0]]) {\n\t\t\taddIcon(el, icons[c[0]]);\n\t\t}\n\t}\n};").replace(/\/\//, A);
      r.indexOf("20") < 0 && (e = Number($("#whitespace").val() / 100), !isNaN(e) && e >= 0 && t.push({
        unicodeLength: 6,
        str: '<glyph unicode="&#x20;" horiz-adv-x="' + e * d + '" />\n'
      }));
      liga && t.sort(function(a, d) {
        return d.unicodeLength - a.unicodeLength
      });
      for (i = 0; i < t.length; i += 1) l.push(t[i].str);
      l = l.join("");
      f = [];
      for (i = 0; i < arr1.length; i++) arr2.indexOf(arr1[i]) < 0 && f.indexOf(arr1[i]) < 0 && (l += '<glyph unicode="&#x' + arr1[i] + ';" d="M0 0" horiz-adv-x="0" />\n', f.push(arr1[i]));
      l += '<glyph class="hidden" unicode="&#x' + R(1, !0) + ';" d="M0,' + m + "L " + k + " " + c + "L0 " + c + ' z" horiz-adv-x="0" />\n';
      c = a + l + "</font></defs></svg>";
      h = h.replace(/GLYPHS/, w).replace(/NAMES/, x);
      f = (b ? font_face.replace(/eot[^}]+/, "eot');\n}\n@font-face {\n\tfont-family: 'fontID';\n\tsrc: url(data:application/x-font-woff;charset=utf-8;base64,WOFF) format('woff'),\n\t\t url(data:application/x-font-ttf;charset=utf-8;base64,TTF) format('truetype');\n\tfont-weight: normal;\n\tfont-style: normal;\n") : font_face) + "\n/* Use the following CSS code if you want to use data attributes for inserting your icons */\n[data-icon]:before {\n\tfont-family: 'fontID';\n\tcontent: attr(data-icon);\n\tspeak: none;\n\tfont-weight: normal;\n\tfont-variant: normal;\n\ttext-transform: none;\n\tline-height: 1;\n\t-webkit-font-smoothing: antialiased;\n}\n\n/* Use the following CSS code if you want to have a class per icon */\n/*\nInstead of a list of all class selectors,\nyou can use the generic selector below, but it's slower:\n[class*=\"" + (u || "your-class-prefix") + "\"] {\n*/\nclassList {\n\tfont-family: 'fontID';\n\tspeak: none;\n\tfont-style: normal;\n\tfont-weight: normal;\n\tfont-variant: normal;\n\ttext-transform: none;\n\tline-height: 1;\n\t-webkit-font-smoothing: antialiased;\n}\n";
      v = f.replace(/fontID/g, y).replace(/classList/, C) + v;
      liga && (v = v.replace(/speak: none;\n/g, '\tspeak: none;\n\t/* Enable Ligatures */\n\t-webkit-font-feature-settings:"liga","dlig";-moz-font-feature-settings:"liga=1, dlig=1";-moz-font-feature-settings:"liga","dlig";-ms-font-feature-settings:"liga","dlig";-o-font-feature-settings:"liga","dlig";\n\tfont-feature-settings:"liga","dlig";\n\ttext-rendering:optimizeLegibility;\n\t'), v = "/* WARNING:\tYour are using ligatures for your icon font.\n\t\t\tLigatures are not supported in IE 9 (and older).\n\t\t\tUse the Private Use Area encoding for best browser support.\n==================================================================== */\n" + v);
      return {
        svg: c,
        html: h,
        css: v,
        lteie7: A,
        txt: z,
        txt2: "To modify your generated font, use the *dev.svg* file, located in the *fonts* folder in this package. You can import this dev.svg file to the IcoMoon app. All the tags (class names) and the Unicode points of your glyphs are saved in this file.\n\nSee the documentation for more info on how to use this package: http://icomoon.io/#docs/font-face",
        name: y,
        base64: b
      }
    } else D("You have not selected any icons for your font.")
  }
  function ua() {
    imported = $("#imported");
    if (imported.children().length) {
      imported.parent().removeClass("invisible");
      var a = $("#hdr-imported"),
        b = a.parent();
      a.cacheInput();
      a.prop("checked") ? (b.addClass("selected"), imported.removeClass("invisible")) : (b.removeClass("selected"), imported.addClass("invisible"))
    }
    count = j.selected.length;
    for (i = 0; i < count; i++) if (g = $("#icon" + j.selected[i].idx).children().children("input")) g.attr("data-unicode", j.selected[i].unicode), L(g, !0, !0);
    H(!0);
    $("#loading").remove();
    ya();
    za();
    na();
    $("#icons").removeClass("hidden");
    W();
    if (Number(localStorage.iconsVersion) !== ca) ra({
      msg: "There is an update availabe for the free icons. Would you like to reset the app? All unsaved data will be lost if you choose <b>Yes</b>.<br/>You may reset the app later using the button at the bottom&nbsp;right&nbsp;hand&nbsp;corner.",
      yes: ba
    }), localStorage.iconsVersion = ca;
    var d = document.getElementById("drop_zone"),
      a = $(document.body),
      c = 0,
      e = !1;
    d.addEventListener("dragover", function(a) {
      a.stopPropagation();
      a.preventDefault();
      a.dataTransfer.dropEffect = "copy";
      d.css("box-shadow", "0 0 0 2px #555")
    }, !1);
    d.addEventListener("drop", function(a) {
      e = !1;
      ka(a);
      d.removeAttr("style")
    }, !1);
    d.addEventListener("dragleave", function() {
      d.removeAttr("style")
    });
    d = $(d);
    a.on("click", ".js-overlay", function() {
      $(this).addClass("hidden");
      $("html").removeClass("overflow-hidden")
    }).on("mouseenter", function() {
      d.addClass("hidden");
      c = 0
    });
    $(".overlay_content").parent().on("click", function(a) {
      $(a.target).hasClass("js-close") || a.stopPropagation()
    });
    a[0].addEventListener("dragenter", function() {
      d.hasClass("hidden ")&&!e&&(c=0,d.removeClass("
hidden "));c+=1},!1);a[0].addEventListener("
dragleave ",function(){c-=1;c||d.addClass("
hidden ")},!1);a[0].addEventListener("
dragstart ",function(){e=!0},!1)}function da(a){t.load("
icomoon0 ",function(b){j=j||b;var d,c,e=0,b=$("#imported "),f=j.customIcons.length,h,m,n=[],k=a.next(),k=k.hasClass("
progress ")?k.children():!1;for(d=0;d<f;d++)if(h=j.customIcons[d],
h.metadata){m=ha(h).wrapper;for(c=0;c<h.svgs.length;c++)n.push({icon:h.svgs[c],id:j.IDs[e],wrapper:m}),e+=1}else n.push({icon:h,id:j.IDs[e],wrapper:b}),e+=1;d=0;setTimeout(function u(){var b=d+20;try{c=b/e;c=c>1?1:c;a.val(c);for(k&&k.css("
width ",c>0.95?"
inherit ":c*100+" % ");d<b&&d<e;d+=1)O(n[d].icon,n[d].id,n[d].wrapper,!0);d<e?setTimeout(u,1):ua()}catch(h){ba()}},100)})}function za(){$("#prev_size ").on("
change ",function(){var a=$(this).val();a>64||a<12||W(a)}).presets();(function(){$("#mode ").on("
change ",
"
input ",function(){var a=$(this);$("#icons ").attr("
data - mode ",a.attr("
id "))}).children().checkbox("
selected ")})();(function(){var a,b=$("#icons "),d,c,e,f;b.on("
click ",".checkbox - icon ",function(d){var b=$(this);if($("#mode_select ").prop("
checked ")){if(d.shiftKey)return!1;b.prop("
checked ")?L(b):M(b)}else if($("#mode_delete ").prop("
checked ")){if(d.shiftKey)return!1;d=b.parents(".icon ");b=I(d,!0);b.length||(b=I(d,!1));a.id=b.attr("
id ");K(d);return!1}else if($("#mode_edit ").prop("
checked "))return Y(b.parents(".icon ")),
!1}).on("
mousedown ",function(a){if(a.which===1)d=a.pageX,c=a.pageY,e=!0}).on("
mousedown ",".icon ",function(d){d.preventDefault();var b=$(this),c=b.offset(),e,f=b.attr("
id "),j=$("#mode_delete ").prop("
checked "),l=$();if(a&&d.shiftKey&&a.id!==b.attr("
id ")){d=c.top>a.y||c.left>=a.x&&c.top===a.y?!0:!1;b=$("#"+a.id);for(j&&d&&b.is(".icon ")&&(l=l.add(b));;)if(b=I(b,d),j?l=l.add(b):(e=b.find("
input "),e.prop("
checked ")?M(e,!0):L(e,!0)),b.attr("
id ")===f||!b.is(".icon, .iconset "))break;j?K(l):H()}a={x:c.left,
y:c.top,id:f}}).on("
mousemove ",function(a){if(!e)return!1;var m=b.find(".iconset ").not(".invisible ").find(".icon ").not(".invisible "),j=Math.min(d,a.pageX),k=Math.max(d,a.pageX),o=Math.min(c,a.pageY),l=Math.max(c,a.pageY),s=m.eq(0).outerWidth(),q=m.eq(0).outerHeight(),p;contains=function(a,b){var d=a.offset();return d.left<=k&&d.left+s>=j&&d.top<=l&&d.top+q>=o?(isNaN(f)&&(f=b),!0):!1};if(!(k-j<10&&l-o<10)){b.find(".selected0 ").removeClass("
selected0 ");for(a=f||0;a<m.length;a+=1)if(p=m.eq(a),contains(p,
a)&&p.find("
label ").addClass("
selected0 "),p.offset().left>k&&p.offset().top>l)break;for(a=f||m.length-1;a>-1;a-=1)if(p=m.eq(a),contains(p,a)&&p.find("
label ").addClass("
selected0 "),p.offset().left+s<j&&p.offset().top+q<o)break}}).on("
mouseup ",function(){var a=$("#mode_delete ").prop("
checked ");e=!1;f=NaN;selection=b.find(".selected0 ");a?K(selection.parent()):(selection.each(function(){var a=$(this);a.is(".selected ")?M(a.find("
input "),!0):L(a.find("
input "),!0);a.removeClass("
selected0 ")}),H())})})();
$("#num_selected ").on("
click ",ja);$("#transform ").on("
click ","
button ",function(){var a=$("#details_svg "),b=parseInt($("#gridSize ").val(),10),b=a.data("
h ")/b,d,c=$(this).attr("
id "),e,a=a.children();e=a.children("
path ");if(!c.match(/move/)){d=a;var f=d.children("
path ")[0].getBBox(),a=f.x+f.width/2,f=f.y+f.height/2,h=d.children("
path ").attr("
transform ")||"";d.children("
path ").attr("
transform ","
translate("+-a+""+-f+")"+h);d="
translate("+a+""+f+")"}a=e.attr("
transform ")||"";if(c==="
rotate_ccw ")a=d+"
rotate(-90)"+
a;else if(c==="
rotate_cw ")a=d+"
rotate(90)"+a;else if(c==="
flip_vertical ")a=d+"
scale(1 - 1)"+a;else if(c==="
flip_horizontal ")a=d+"
scale(-1 1)"+a;else if(c==="
move_down ")a="
translate(0 "+b+")"+a;else if(c==="
move_up ")a="
translate(0 - "+b+")"+a;else if(c==="
move_right ")a="
translate("+b+", 0)"+a;else if(c==="
move_left ")a="
translate(-"+b+", 0)"+a;else if(c==="
scale_down "||c==="
scale_up ")e.tinySVG(),a=e[0].getBBox(),a=Math.max(a.width,a.height),a=c==="
scale_up "?(a+b*2)/a:(a-b*2)/a,a=d+"
scale("+
a+""+a+")";e.attr("
transform ",a);e.tinySVG();$("#details_save ").removeAttr("
disabled ").html("
Save ")});$(".nav ").on("
click ",function(){$(window).scrollTop(0)});window.onhashchange=na;$("#glyphs ").on("
click ",".showOptions ",function(){var a=$(this),b=a.parents(".glyph - wrapper ");a.hasClass("
active ")?(b.children(".options ").remove(),b.children(".glyph ").removeClass("
invisible2 "),a.removeClass("
active ")):(b.append('<ul class="
options linkList2 darkbg "><li><a href="#">Symbols</a></li><li><a href="#">PUA</a></li><li><a href="#">Custom</a></li></ul>').children(".glyph ").addClass("
invisible2 "),
a.addClass("
active "))}).on("
click ",".rmGlyph ",function(){M($("#icon "+$(this).parents(".glyph - wrapper ").find("
svg ").attr("
data - idx ")).children().children("
input "))}).on("
click ",".options a ",function(a){var b=$(this),d=b.parents(".glyph - wrapper "),b=b.html(),c,e;d.children(".glyph ").removeClass("
invisible2 ");d.children(".options ").remove();d.find(".showOptions ").removeClass("
active ");if(b==="
Symbols "){if($("
html ").addClass("
overflow - hidden "),c=$("#uSymbols_c ").removeClass("
hidden ").attr("
data - id ",d.attr("
id ")),
c.hasClass("
empty ")){c.removeClass("
empty ");c=c.find(".symbols ");e=0;var f=function(){e<c.length&&(function(a){function d(){for(var a=j+10;j<a&&j<e;j+=1)l+='<button type="
button " class="
js - ubtn btn6 w2 mrs mbs ">&#'+j+"; < /button>";j<=e?(j+=1,setTimeout(d,50)):(b.html($(l)),f())}var b=c.eq(a),a=parseInt(b.attr("data-first"),16),e=parseInt(b.attr("data-last"),16),j=a,l="";d()}(e),e+=1)};f()}}else b==="PUA"?(b=R(0,!0),T(d.children(".hdr").children("input").val(B(b)))):d.children(".ftr").children().focus();
a.preventDefault()}).on("click",".unicode",function(){$(this).select()}).on("change",".unicode",function(){T($(this))}).on("change",".unicode-hex",function(){var a=$(this),b=a.parents(".glyph-wrapper"),d=b.find(".unicode"),c=parseInt(a.val(),16);isNaN(c)?(d=b.attr("id").substr(5),a.val(d.match(/x / ) ? "" : d)): (d.val(B(c)), T(d))
}).on("blur", ".unicode-hex", function() {
  var a = $(this).val();
  a !== "" && (a = "U+" + zeroPad(a, 4).replace(/U\+/, ""));
  $(this).val(a)
}).on("focus", ".unicode-hex", function() {
  var a = $(this).val();
  a.match(/U\+/) && $(this).val(a.substr(2).replace(/^0+/, ""))
});
$("#uSymbols").on("click", ".js-ubtn", function() {
  var a = $("#uSymbols_c");
  T($("#" + a.attr("data-id")).children(".hdr").children("input").val($(this).html()));
  a.click()
});
(function() {
  var a, b = document.getElementById("glyphs");
  b.addEventListener("dragstart", function(b) {
    var c = b.target,
      e = $(c);
    if (!e.attr("draggable") && !e.parents(".draggable").length) return !1;
    a = c;
    e.addClass("ptrn-squares-small");
    b.dataTransfer.EffectAllowed = "move";
    b.dataTransfer.setData("text/html", $(this).html())
  }, !1);
  b.addEventListener("dragend", function(a) {
    var b = $(a.target);
    if (!b.attr("draggable") && !b.parents(".draggable").length) return !1;
    a.stopPropagation && a.stopPropagation();
    $(".draggable").removeClass("ptrn-squares-small droppable")
  }, !1);
  b.addEventListener("dragleave", function(a) {
    a = $(a.target);
    if (!a.attr("draggable") && (a = a.parents(".draggable"), !a.length)) return !1;
    a.removeClass("droppable")
  }, !1);
  b.addEventListener("dragover", function(a) {
    var b = $(a.target);
    if (!b.attr("draggable") && (b = b.parents(".draggable"), !b.length)) return !1;
    b.addClass("droppable");
    a.preventDefault && a.preventDefault();
    a.dataTransfer.dropEffect = "move";
    return !1
  }, !1);
  b.addEventListener("drop", function(b) {
    var c = b.target,
      e = $(c);
    if (!e.attr("draggable") && (e = e.parents(".draggable"), !e.length)) return !1;
    b.stopPropagation && b.stopPropagation();
    if (a != c) {
      c = $(a);
      b = c.children("svg").clone();
      c.hide();
      e.hide();
      c.html(e.html());
      e.html(b);
      e.fadeIn("fast");
      c.fadeIn("fast");
      var e = e.children("svg").attr("data-idx"),
        c = c.children("svg").attr("data-idx"),
        f, h = 0,
        m;
      f = $("#icon" + e).children().children("input");
      m = $("#icon" + c).children().children("input");
      b = f.attr("data-unicode");
      f.attr("data-unicode", m.attr("data-unicode"));
      m.attr("data-unicode", b);
      for (f = 0; f < j.selected.length; f++) {
        b = j.selected[f];
        if (b.idx === e) b.idx = c, h += 1;
        else if (b.idx === c) b.idx = e, h += 1;
        if (h === 2) break
      }
      t.save("icomoon0", j)
    }
    return !1
  }, !1)
})();
$("#saveFont").on("click", function() {
  var a = ta(),
    b = $(this);
  if (a && !b.attr("disabled")) {
    l(b, !0);
    var d = function(d) {
        a.svg = a.svg.replace(/.+horiz-adv-x="0".+/g, "");
        zip = new JSZip;
        a.html = a.html.replace(/<\/h1>\n/, '</h1>\n\t\t<p><strong>Notice: </strong>Font conversion was canceled. You either selected too many icons or IcoMoon&rsquo;s servers could not be accessed. You may do the font conversion yourself (using <a target="_blank" href="http://www.freefontconverter.com/">this</a> and <a target="_blank" href="http://www.fontsquirrel.com/fontface/generator">this</a>). This page can be viewed properly in <a target="_blank" href="http://caniuse.com/#search=svg font">browsers that support SVG fonts</a>.</p>\n');
        zip.add("fonts/" + a.name + ".svg", a.svg);
        d || zip.add("Notice.txt", "Font conversion was canceled. You either selected too many icons (more than 1500), or IcoMoon's servers could not be accessed.");
        zip.add("index.html", a.html);
        zip.add("lte-ie7.js", a.lteie7);
        if (a.base64) a.css = a.css.replace(/@font-face[^}]+\}\n/g, ""), a.css = font_face + a.css, a.css = a.css.replace(/fontID/g, a.name);
        zip.add("style.css", a.css);
        zip.add("license.txt", a.txt);
        saveFile(zip, "IcoMoon.zip");
        l(b, !1)
      };
    if (j.selected.length > 1500) d();
    else try {
      $.post("http://icomoon.io/FontConverter/convert.php", a, function(a) {
        location.href = a.match(/dlLink: (.*)/)[1];
        l(b, !1)
      }).error(function(a) {
        a.status === 413 && D("Font Conversion Failed. Your font is too large.");
        d()
      })
    } catch (c) {
      console && console.log && console.log(c)
    }
  }
});
$("#resetEncoding").on("submit", function() {
  var a = X[Number($(this).val())],
    b, d = $("#glyphs").find(".glyph-wrapper"),
    c, e;
  r = [];
  for (b = 0; b < d.length; b++) e = a[0] + b, e <= a[1] ? (e = e.toString(16), r.push(e)) : e = R(), c = d.eq(b), c.children(".hdr").children("input").val(B(e)), c.children(".ftr").children().val("U+" + zeroPad(e, 4)), j.selected[b].unicode = e, c.attr("id", "glyph" + e), $("#icon" + c.children(".glyph").children("svg").attr("data-idx")).children().children("input").attr("data-unicode", e);
  t.save("icomoon0", j)
});
$("#js-cancel-search").on("click", function() {
  Q()
});
(function() {
  var a;
  $("#search").on("input", function() {
    clearTimeout(a);
    var b = $(this),
      d;
    a = setTimeout(function() {
      var a = b.val(),
        e, f = 0;
      if (a.length > 1) {
        oa();
        $(".icon").addClass("invisible");
        a = RegExp("^" + a, "i");
        d = G[a];
        for (var h in G) if (a.test(h)) {
          d = G[h];
          for (e = 0; e < d.length; e++) N.indexOf(d[e]) < 0 && N.push(d[e])
        }
        f = N.length;
        for (e = 0; e < f; e++) $("#icon" + N[e]).removeClass("invisible");
        $(".iconset").each(function() {
          var a = $(this);
          a.find(".icon").not(".invisible").length ? a.parent().removeClass("invisible") : (a = a.parent(), a.hasClass("iconset") || a.addClass("invisible"))
        });
        a = $("#searchCount").removeClass("hidden").find("span");
        f === 0 ? a.html("No icons ") : f === 1 ? a.html("1 icon was") : a.html(f + " icons were");
        $(window).scrollTop(0)
      } else Q(!0)
    }, 300)
  })
})();
(function() {
  var a = $("#panel-top"),
    b = a.parent(),
    d = $("#panel-top-c"),
    c = a.outerHeight(),
    e = d.outerHeight() - c,
    f = d.offset().top;
  $(window).on("scroll", function() {
    $(window).scrollTop() > f ? a.hasClass("panel-top") || (a.addClass("panel-top").css("top", e + "px"), b.css("padding-top", c + "px")) : a.hasClass("panel-top") && (a.removeClass("panel-top"), a.add(b).removeAttr("style"))
  }).on("resize", function() {
    if (!$("#browse").hasClass("hidden")) a.removeClass("panel-top"), a.removeAttr("style").parent().removeAttr("style"), c = a.outerHeight(), e = d.outerHeight() - c, f = d.offset().top
  })
})();
$("#details_download").on("click", function() {
  var a = new JSZip,
    b = $("#details_svg").children().clone().tinySVG(1),
    d = b.attr("data-id"),
    c = $("#showGrid").prop("checked") && $("#svgGrid").clone().removeAttr("class id");
  c && c.children("line, rect").attr("stroke", "#B35047").removeAttr("stroke-width");
  aa($("#" + d), b, a, {
    grid: c
  });
  saveFile(a, "IcoMoon.zip", $(this))
});
$("#images").on("click", function() {
  $("#img-settings").removeClass("hidden").find("#images-dl").focus()
});
(function() {
  var a = -1,
    b, d, c, e = $("#cloudModal"),
    f = {
      1: {
        lmt: 128
      },
      8: {
        lmt: 256
      }
    };
  getProjects = function(a) {
    w(function() {
      $("#loginout").attr("data-icon", String.fromCharCode(57354)).attr("data-tip", "Sign Out").attr("href", "http://i.icomoon.io/logout").children("span").html("Sign Out");
      $.ajax({
        type: "POST",
        url: "http://i.icomoon.io/projectpath",
        xhrFields: {
          withCredentials: !0
        },
        success: function(c) {
          c = JSON.parse(c);
          if (c.projects.length) b = c.meta.uid, d = c.projects, a && a()
        }
      })
    })
  };
  updateCSS = function(a) {
    return a.replace(/fonts\//g, "http://d53xc6gg1gd7c.cloudfront.net/" + (b + "/" + c.pid + "/")).replace(/\/[^\/]+\.(ttf|svg|woff|eot)/gim, "/f.$1")
  };
  updateProjects = function(e) {
    var f, j, k;
    if (d && !(c && c.pid === e)) isNaN(e) ? getProjects(function() {
      updateProjets()
    }) : (c = d[e], c.idx = e, f = b + "/" + c.pid + "/", j = $("#css-prod"), k = $("#css-dev"), k.add(j).val("Loading..."), $.get("http://s3.amazonaws.com/icomoonfonts/" + f + "f.css?" + (Math.random() * 1E3).toFixed(), function(a) {
      j.val(a);
      k.val(a.replace(RegExp("http://d53xc6gg1gd7c.cloudfront.net/", "g"), "http://s3.amazonaws.com/icomoonfonts/"))
    }).error(function() {
      k.add(j).val("/* Gets generated on first upload. */")
    }), e = c.name || "unititled", $("#projName").val(e), $("#switchProj").prev().html(e), $("#devFiles").children("a").each(function() {
      var a = $(this);
      a.attr("href", "http://s3.amazonaws.com/icomoonfonts/" + f + "f." + a.attr("data-type"))
    }), $("#prodFiles").children("a").each(function() {
      var a = $(this);
      a.attr("href", "http://d53xc6gg1gd7c.cloudfront.net/" + f + "f." + a.attr("data-type"))
    }), l($("#uploadFont"), !1, {
      normal: "Upload Font"
    }), a = -1)
  };
  uploadProj = function(a, b) {
    a.purchaseid = c.pid;
    $.ajax({
      type: "POST",
      url: "http://i.icomoon.io/upload",
      data: a,
      xhrFields: {
        withCredentials: !0
      },
      success: function(a) {
        a = JSON.parse(a);
        c.name = a.projectname;
        d[c.idx] = c;
        b && b(a)
      }
    })
  };
  selectProj = function() {
    e.addClass("hidden");
    xa({
      msg: "Select a hosting slot to upload your font pack to.",
      projects: d,
      callback: function(a) {
        a = parseInt(a, 10);
        updateProjects(a);
        e.removeClass("hidden")
      }
    })
  };
  $("#cloud").on("click", function() {
    if (j.selected.length) {
      var b = $(this),
        f = function() {
          d.length === 1 ? (updateProjects(0), e.removeClass("hidden")) : c ? e.removeClass("hidden") : (selectProj(), $("#switchProj").on("click", function() {
            selectProj();
            return !1
          }).parent().removeClass("hidden").next().remove());
          a !== localStorage.stateID && (l($("#uploadFont"), !1, {
            normal: "Upload Font"
          }), l($("#clearCache"), !1, {
            normal: "Clear Cache"
          }))
        };
      d ? (f(), a === localStorage.stateID && l(b, !1)) : (l(b, !0), getProjects(function() {
        l(b, !1);
        f()
      }))
    } else D("You have not selected any icons for your font.")
  });
  $("#uploadFont").on("click", function() {
    var b = f[c.productid].lmt;
    if (j.selected.length > f[c.productid].lmt) return e.addClass("hidden"), D("This hosting plan does not allow uploading<br/> fonts with more than " + b + " glyphs."), !1;
    var d = $(this),
      b = ta({
        fontID: "icomoon"
      });
    b.css = updateCSS(b.css);
    b.projectname = $("#projName").val();
    b.pid = c.pid;
    l(d, !0, {
      loading: "Uploading..."
    });
    uploadProj(b, function() {
      updateProjects(c.idx);
      l(d, !1, {
        normal: "Saved"
      });
      a = localStorage.stateID
    })
  });
  $("#clearCache").on("click", function() {
    var a = $(this);
    l(a, !0, {
      loading: "working..."
    });
    uploadProj({
      purge: !0
    }, function(b) {
      b.purged ? l(a, !1, {
        normal: "Cache Cleared"
      }) : l(a, !1, {
        normal: "Clear Cache"
      })
    })
  });
  $("#projName").on("change", function() {
    var a = $(this),
      b = a.next();
    b.html("renaming...").removeClass("transparent-full");
    uploadProj({
      projectname: a.val()
    }, function() {
      b.html("saved");
      setTimeout(function() {
        b.addClass("transparent-full")
      }, 2E3)
    })
  });
  getProjects(function() {
    if (d.length) {
      var a = $("#showCloudLinks"),
        b = $("#links-code"),
        c, e = function() {
          a.prop("checked") ? b.removeClass("hidden") : b.addClass("hidden")
        };
      $("#cloudLinksType").children().checkbox("selected", "focused").find("input").on("change", function() {
        c = b.children("div").addClass("hidden");
        c = $("#links-dev").prop("checked") ? c.eq(0) : c.eq(1);
        c.removeClass("hidden")
      });
      a.cacheInput().parent().checkbox("selected");
      a.on("change", e);
      e();
      $("#cloud").removeClass("hidden")
    }
  })
})();
$("#images-dl").on("click", function() {
  var a = $(".icon .selected"),
    b = new JSZip,
    d = $(this),
    c = $("#img-color").val(),
    e = $("#img-height").val(),
    f, h = $("#include_sprites").prop("checked");
  $("#prev_size").val();
  var j = [],
    n = function() {
      l(d, !1);
      $("#img-settings").addClass("hidden")
    },
    k = function() {
      var k, l;
      a.each(function() {
        var a = $(this);
        aa(a.parent(), a.children("svg"), b, {
          png: $("#include_png").prop("checked") && e,
          color: c
        })
      });
      for (k in b.files)(k = k.match(/(SVG\/)?(.*)\.svg/i)) && k.length === 3 && j.push(k[2]);
      h && (f = $("#sprites-cols").val(), k = wa(a.children("svg"), {
        size: e,
        cols: f,
        color: c,
        names: j
      }), aa(!1, k.sprites, b, {
        png: !1,
        name: "Sprites/sprites",
        color: c
      }), l = document.createElement("canvas"), canvg(l, $("<div>").append(k.sprites).html()), pa(l, b, "Sprites/sprites"), b.add("Sprites/sprites.css", k.css), b.add("Sprites/index.html", k.html));
      saveFile(b, "IcoMoon.zip", d);
      n()
    };
  a.length ? (l(d, !0), d.data("js-loaded") ? k() : (d.data("js-loaded", !0), loadScript("js/libs/canvg.js", k))) : (D("You have not selected any icons for downloading."), n())
});
$("#details_savecopy").on("click", function() {
  var a = $("#details_svg").children().clone(),
    b = $("#" + a.attr("data-id")).children().children("svg").clone(),
    d = $("#imported"),
    c;
  a.tinySVG(1);
  b.children("path").attr("d", a.children("path").attr("d"));
  b = $("<div>").append(b).html();
  j.customIcons.push(b);
  O(b, NaN, d);
  d.parent().removeClass("invisible");
  a = d.children(":first").children().children("svg");
  b = $("#details_license");
  b.children().length && (b = b.children(), a.attr("data-licenseLink", b.attr("href")));
  (b = b.html()) && a.attr("data-license", b);
  b = $("#details_author");
  b.children().length && (b = b.children(), a.attr("data-authorLink", b.attr("href")));
  (b = b.html()) && a.attr("data-author", b);
  a.attr("class", "metadata");
  $("#details").addClass("hidden");
  c = a.parent();
  Q();
  $(window).scrollTop(c.offset().top - c.outerHeight() - 16);
  c.css("background-color", "#fff");
  setTimeout(function() {
    c.removeAttr("style")
  }, 400)
});
$("#details_tags").on("change", function() {
  var a = $("#details_svg").children(),
    b = parseInt(a.attr("data-id").substr(4), 10),
    d = $("#icon" + b).children(),
    c = null,
    e = $(this).val(),
    a = a.attr("data-tags"),
    e = e.replace(/[^a-z0-9\-\_,\s]+/ig, "").replace(/\s*,\s*/g, ",").replace(/,+/g, ", ").trim().replace(/^,+|,+$/, "");
  $(this).val(e);
  fa(a, b);
  e ? ea(e, b) : e = "";
  d.hasClass("selected") && (c = $("#glyph" + d.children("input").attr("data-unicode")).children(".glyph").children());
  d.children("svg").add(c).attr("data-tags", e);
  qa()
});
$("#details_save").on("click", function() {
  qa(!0);
  $(this).attr("disabled", "disabled").html("Saved")
});
(function() {
  var a, b = function(a) {
      /s/i.test(a) ? $("#mode_select").change() : /e/i.test(a) ? $("#mode_edit").change() : /d/i.test(a) && $("#mode_delete").change()
    };
  $(document).on("keydown", function(d) {
    d.altKey ? (a || (a = $("#mode").children(".selected")), d.altKey && d.metaKey ? b("d") : b("e")) : a = !1;
    if (d.which === 27) $(".js-overlay").addClass("hidden"), $("html").removeClass("overflow-hidden"), $("#icons").find(".selected0").removeClass("selected0");
    else {
      var c = $("#details");
      if (!c.hasClass("hidden") && !$(d.target).is("input, textarea")) {
        var e = $("#" + $("#details_svg").children("svg").attr("data-id"));
        d.which === 39 ? c = I(e, !0) : d.which === 37 && (c = I(e, !1));
        (d.which === 39 || d.which === 37) && Y(c)
      }
    }
  }).on("keyup", function() {
    a && a.find("input").change()
  })
})();
$("#icon-next, #icon-prev").on("click", function() {
  var a = $("#" + $("#details_svg").children("svg").attr("data-id")),
    b = $(this).is("#icon-next"),
    a = I(a, b);
  Y(a)
});
$("#btn-metadata").on("click", function() {
  $("#fileinfo").removeClass("hidden");
  $("#fi_name").focus()
});
$("#btn-metrics").on("click", function() {
  $("#font-metrics").removeClass("hidden")
});
$("#fi_id, #fi_class").on("change", function() {
  var a = $(this);
  a.val(a.val().idfy())
});
$("#icons-all").on("change", ".js-showhide", function() {
  var a = $(this),
    b = $("#" + a.attr("id").substr(4));
  a.prop("checked") ? (a.parent().addClass("selected"), b.removeClass("invisible")) : (a.parent().removeClass("selected"), b.addClass("invisible"), $(window).scrollTop($(window).scrollTop()))
}).on("focus", ".js-showhide", function() {
  $(this).parent().addClass("focused")
}).on("blur", ".js-showhide", function() {
  $(this).parent().removeClass("focused")
});
$("#reset").on("click", function() {
  ra({
    msg: "Do you want to reset IcoMoon? All unsaved data will be lost.",
    yes: ba
  })
});
$("#js-dontshow").on("click", function() {
  localStorage.share = 2;
  $("#modal_share").addClass("hidden");
  return !1
});
$("#library").on("click", ".js-add", function() {
  var a = $(this),
    b = a.attr("data-fontID");
  _gaq.push(["_trackPageview", "lib: " + a.attr("data-fontID")]);
  z && (b = a.attr("data-href2") || b);
  /\//.test(b) || (b = "iconfonts/" + b + ".svg");
  l(a, !0);
  $.ajax({
    type: "GET",
    dataType: "text",
    xhrFields: {
      withCredentials: !0
    },
    url: b,
    success: function(b) {
      V(b, function() {
        a.prev().removeClass("hidden");
        a.removeClass("js-add").addClass("js-remove").find(".icon-b").attr("data-icon", "-");
        a.find(".caption").html("Remove");
        l(a, !1);
        S()
      })
    }
  });
  return !1
}).on("click", ".js-remove", function() {
  var a = $(this),
    b, d = a.attr("data-fontID").toLowerCase();
  b = a.attr("data-href");
  K($("#" + d).children(".icon"));
  a.find(".caption").html(b ? "Purchase" : "Add");
  a.find(".icon-b").attr("data-icon", b ? B(57348) : "+");
  a.prev().addClass("hidden");
  b ? (a.after($('<a target="_blank" href="' + b + '" class="btn2" data-fontID="' + d + '">').html(a.html())), a.remove()) : a.removeClass("js-remove").addClass("js-add");
  return !1
});
$("input, textarea").on("keydown", function(a) {
  a.stopPropagation()
})
}
function ya() {
  if (navigator.onLine) $("#share").on("click", function() {
    $("#modal_share").removeClass("hidden").find("#js-dontshow").parent().addClass("hidden");
    return !1
  });
  else $("#share").remove();
  Modernizr.adownload ? ($("#session_io").dropDown("hidden", $("#prev_size").next()), $("#json-store").on("click", function() {
    var a = new JSZip;
    saveFile(a.utf8encode('{"share":' + JSON.stringify(localStorage.share) + ', "iconsVersion":' + JSON.stringify(localStorage.iconsVersion) + ', "icomoon":' + JSON.stringify(j) + ',"inputCache":' + JSON.stringify(localStorage.inputCache) + "}"), ($("#fi_name").val().idfy() || "IcoMoon Session") + ".json")
  }), document.getElementById("json-load").addEventListener("change", function(a) {
    var b = a.target.files[0];
    b.name.match(/\.json$/i) ? (a = new FileReader, a.onload = function(a) {
      a = a.target.result;
      a.match(/icomoon/) && a.match(/inputCache/) ? sa(a, function() {
        window.location.reload()
      }) : D("Error: Invalid JSON file.")
    }, a.readAsText(b)) : D("Please select a JSON file generated by IcoMoon.")
  }, !1)) : $("#session_io").remove();
  $(".tip-trigger").tooltip();
  $("#designGrid").numberInput(16, 4).cacheInput();
  $("#baseline").numberInput(6.25, 4, 100).cacheInput();
  $("#whitespace").numberInput(50, 0).cacheInput();
  $("#glyph_widths").numberInput(100, 0).cacheInput();
  $("#emSize").numberInput(512, 100).cacheInput();
  $("#prev_size").numberInput(32, 12, 64).cacheInput();
  $("#img-height").numberInput(32, 12, 512).cacheInput();
  $("#img-color").numberInput(0, 0, 16777215, 6, !0).cacheInput();
  $("#sprites-cols").numberInput(16, 1, 16777215).cacheInput();
  $("#hdr-imported, #showGrid, #include_png, #include_sprites, #manualMetrics").add($("#fileinfo").find("input")).cacheInput();
  $("#showGrid, #include_metadata, #base64, #ligatures, #include_png, #include_sprites, #manualMetrics").parent().checkbox("selected", "focused");
  la($("select.styled"), $("#session_io"));
  (function() {
    var a = $("#metadata"),
      b = $("#include_metadata");
    b.prop("checked") && a.removeClass("hidden");
    b.on("change", function() {
      a.toggleClass("hidden")
    });
    var d = $("#sprites-settings"),
      b = $("#include_sprites");
    b.prop("checked") && d.removeClass("hidden");
    b.on("change", function() {
      d.toggleClass("hidden")
    });
    var c = function() {
        $("#ligatures").prop("checked") ? $(".unicode").removeAttr("maxlength") : $(".unicode").attr("maxlength", 1)
      };
    c();
    $("#ligatures").on("change", c);
    b = $("#manualMetrics");
    c = function() {
      b.prop("checked") ? ($("#designGrid").val("").attr("readonly", "readonly").parent().addClass("transparent-more"), b.parent().next().removeClass("hidden")) : (b.parent().next().addClass("hidden"), Z(), $("#designGrid").removeAttr("readonly").parent().removeClass("transparent-more"))
    };
    c();
    b.on("change", c);
    $("#designGrid").on("change", function() {
      Z()
    })
  })();
  $("#showGrid").on("change", function() {
    document.getElementById("svgGrid").setAttributeNS(null, "class", "svgGrid" + ($(this).prop("checked") ? "" : " invisible"))
  });
  $("#gridSize").numberInput(16, 1, 64).on("change", function() {
    var a = $("#details_svg");
    $("#svgGrid").after(ma({
      width: a.data("w"),
      height: a.data("h"),
      size: parseInt($(this).val(), 10)
    })).remove()
  })
}
var j, J = "http://www.w3.org/2000/svg",
  z = !1,
  r = [],
  t = icomoonCache(),
  X = [
    [57344, 61439],
    [61440, 65535],
    [33, 126],
    [983040, 1048575],
    [1048576, 1114111]
  ],
  G = {},
  N = [],
  x = 0,
  ca = 1.5;
window.File && window.FileReader ? document.getElementById("files").addEventListener("change", ka, !1) : function() {
  var a = $("#files");
  a.prev().addClass("disabled");
  $("#msg").append($('<p id="msg2">Your browser does not support the <a target="_blank" href="http://caniuse.com/#feat=filereader">FileReader API</a>. You can&rsquo;t import icons. </p>').append($('<button type="button" class="btn5 icon-b fs7 mlm" data-icon="&#10006;"> Dismiss</button>').on("click", function() {
    $("#msg2").remove();
    $(window).resize()
  }))).prev().find("span").remove();
  a.remove()
}();
$.fn.tooltip = function() {
  return this.each(function() {
    $(this).hoverIntent(function() {
      var a = $(this),
        b, d = "arrow-b",
        c = 0,
        e = 0;
      if (b = a.attr("data-tip")) $("body").append($('<span class="tip noDisplay">' + b.replace(/\s/g, "&nbsp;") + "</span>")), b = $(".tip"), a.hasClass("tip-btm") ? (d = "arrow-t2", c = a.offset().left + a.outerWidth() / 2 - b.outerWidth() / 2, e = a.offset().top + a.outerHeight() + 12) : (d = "arrow-b", c = a.offset().left + a.outerWidth() / 2 - b.outerWidth() / 2, e = a.offset().top - b.outerHeight() - 12), c + b.outerWidth() > $(window).outerWidth() && (c = c - b.outerWidth() / 2 + a.outerWidth() / 2, d = ""), b.addClass(d).css("left", c + "px").css("top", e + "px").removeClass("noDisplay")
    }, function() {
      $(".tip").remove()
    }).on("click", function() {
      $(".tip").remove()
    })
  })
};
$("#progress").progress();
t.load("icomoon0", function(a) {
  a ? da($("#progress")) : localStorage.icomoon && window.indexedDB ? (j = localStorage.getObject("icomoon"), delete localStorage.icomoon, t.save("icomoon0", j, function() {
    da($("#progress"))
  })) : $.get("iconfonts/session.js", function(a) {
    sa(a, function() {
      da($("#progress"))
    })
  }, "text").error(function() {
    localStorage.iconsVersion = ca;
    j = {
      selected: [],
      customIcons: [],
      IDs: []
    };
    (function() {
      for (var a = ["entypo", "iconic", "meteocons", "icomoon"], d = 0, c = 0; c < a.length; c++) $.get("iconfonts/" + a[c] + ".svg", function(c) {
        return function(f) {
          d += 1;
          a[c] = f;
          if (d === a.length) {
            for (c = 0; c < a.length; c++) V(a[c], c === a.length - 1 ?
            function() {
              $("#icons, #iconSets>.hidden").removeClass("hidden");
              ua()
            } : 0);
            $(window).scrollTop(0)
          }
        }
      }(c), "text").error(function() {
        !d && c === a.length && $("#loading").remove()
      })
    })()
  })
})
});
var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-26981823-1"]);
_gaq.push(["_trackPageview"]);
(function() {
  var w = document.createElement("script");
  w.type = "text/javascript";
  w.async = !0;
  w.src = "https://ssl.google-analytics.com/ga.js";
  var B = document.getElementsByTagName("script")[0];
  B.parentNode.insertBefore(w, B)
})();