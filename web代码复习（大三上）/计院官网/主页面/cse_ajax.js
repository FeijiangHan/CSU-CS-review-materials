function createXMLHttpRequest() {
  var xmlHttp = null;
  try {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
  } catch(e) {
    try {
      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP")
    } catch(e) {
      try {
        xmlHttp = new XMLHttpRequest()
      } catch(e) {}
    }
  }
  return xmlHttp
}
function startRequest(url, fun, xmlHttp) {
  xmlHttp.onreadystatechange = fun;
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null)
}
function getXmlChild(father, name) {
  var es = father.getElementsByTagName(name);
  if (es.length == 0) {
    return null
  } else {
    return es[0]
  }
}
String.prototype.trim = function() {
  var t = this.replace(/(^\s*)|(\s*$)/g, "");
  return t.replace(/(^　*)|(　*$)/g, "")
};
function getXmlData(father, name, defaultvalue) {
  var es = father.getElementsByTagName(name);
  if (es.length == 0) {
    return defaultvalue
  } else {
    if (es[0].firstChild == null) {
      return defaultvalue
    } else {
      for (var i = 0; i < es[0].childNodes.length; i++) {
        var node = es[0].childNodes[i];
        if (node.nodeValue != null && node.nodeValue.trim() != "") {
          return node.nodeValue
        }
      }
      return defaultvalue
    }
  }
}
function escapeForValue(str) {
  return str.replace(/\"/g, "&quot;")
}
function getClickTimes(newsid, owner, type, randomid) {
  var url = "/system/resource/code/news/click/clicktimes.jsp";
  if (!type) {
    type = "wbnews"
  }
  if (!randomid) {
    randomid = "n"
  } else {
    randomid = "n" + randomid
  }
  var xmlHttp = createXMLHttpRequest();
  var url = url + "?wbnewsid=" + newsid + "&owner=" + owner + "&type=" + type + "&randomid=" + randomid;
  xmlHttp.open("GET", url, true);
  xmlHttp.onreadystatechange = function() {
    onGetClickTimes(xmlHttp)
  };
  xmlHttp.send(null)
}
function _getBatchClickTimes(newsid, owner, type, randomid) {
  var url = "/system/resource/code/news/click/batchclicktimes.jsp";
  if (!type) {
    type = "wbnews"
  }
  if (!randomid) {
    randomid = "n"
  } else {
    randomid = "n" + randomid
  }
  var wbnewsids = newsid.split(",");
  var isshow = false;
  for (var i = 0; i < wbnewsids.length; i++) {
    var obj = document.getElementById(randomid + wbnewsids[i]);
    if (obj != null) {
      isshow = true
    }
  }
  if (isshow) {
    var xmlHttp = createXMLHttpRequest();
    var url = url + "?wbnewsid=" + newsid + "&owner=" + owner + "&type=" + type + "&randomid=" + randomid;
    xmlHttp.open("GET", url, true);
    xmlHttp.onreadystatechange = function() {
      _onGetBatchClickTimes(xmlHttp)
    };
    xmlHttp.send(null)
  }
}
function _onGetBatchClickTimes(originalRequest) {
  if (originalRequest.readyState == 4 && originalRequest.status == 200) {
    var str = originalRequest.responseText;
    var json = eval("(" + str + ")");
    for (var i = 0; json != null && i < (json.length ? json.length: 1); i++) {
      var objid = json.length ? (json[i].randomid + json[i].wbnewsid) : (json.randomid + json.wbnewsid);
      var spanobj = document.getElementsByName(objid);
      if (spanobj.length > 0) {
        for (var j = 0; j < spanobj.length; j++) {
          spanobj[j].innerHTML = json[i].clicktime
        }
      }
    }
  }
}
function onGetClickTimes(originalRequest) {
  if (originalRequest.readyState == 4 && originalRequest.status == 200) {
    var str = originalRequest.responseText;
    var json = eval("(" + str + ")");
    for (var i = 0; json != null && i < (json.length ? json.length: 1); i++) {
      var objid = json.length ? (json[i].randomid + json[i].wbnewsid) : (json.randomid + json.wbnewsid);
      var objs = document.getElementsByTagName("span");
      if (objs.length > 0) {
        for (var j = 0; j < objs.length; j++) {
          if (objid == objs[j].id) {
            objs[j].innerHTML = json.length ? json[i].wbshowtimes: json.wbshowtimes
          }
        }
      }
    }
  }
}
function addClickTimes(urlid, owner, type) {
  var url = "/system/resource/code/news/click/addclicktimes.jsp";
  var xmlHttp = createXMLHttpRequest();
  var url = url + "?wburlid=" + urlid + "&owner=" + owner + "&type=" + type;
  xmlHttp.open("GET", url, true);
  xmlHttp.onreadystatechange = function() {};
  xmlHttp.send(null)
}
loadXML = function(xmlString) {
  var xmlDoc = null;
  if (!window.DOMParser && window.ActiveXObject) {
    var xmlDomVersions = ["MSXML.2.DOMDocument.6.0", "MSXML.2.DOMDocument.3.0", "Microsoft.XMLDOM"];
    for (var i = 0; i < xmlDomVersions.length; i++) {
      try {
        xmlDoc = new ActiveXObject(xmlDomVersions[i]);
        xmlDoc.async = false;
        xmlDoc.loadXML(xmlString);
        break
      } catch(e) {}
    }
  } else {
    if (window.DOMParser && document.implementation && document.implementation.createDocument) {
      try {
        domParser = new DOMParser();
        xmlDoc = domParser.parseFromString(xmlString, "text/xml")
      } catch(e) {}
    } else {
      return null
    }
  }
  return xmlDoc
};