console.log('Loader', 'start')

var protocol = typeof PROTOCOL !== 'undefined' ? PROTOCOL : 'http'

var base_url = protocol + '://vokino25.github.io/vokino/'

var api_url = protocol + '://api.vokino.pro'
var proxy_url = 'proxy.vokino.pro'
var socket_url = (protocol === 'https' ? 'wss' : 'ws') + '://vokino.pro:2096/'

//var base_url = protocol + '://192.168.1.9:3050/';
//var base_url = protocol + '://localhost:3050/';

console.log('Loader', 'protocol', protocol)

function httpGetAsync(theUrl, callback, error) {
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText)
  }
  xmlHttp.onerror = function () {
    if (error) error()
  }
  xmlHttp.open('GET', theUrl, true) // true for asynchronous
  xmlHttp.send(null)
}

function putStyle(url, call) {
  var trys = 0
  var head = document.getElementsByTagName('head')[0]

  var createStyle = function () {
    console.log('Loader', 'add-style', url)

    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.media = 'all'
    link.onload = function () {
      if (call) call()
    }
    link.onerror = function () {
      trys++

      if (trys < 3) {
        createStyle()
      } else {
        if (call) call()
      }
    }

    link.href = url

    head.appendChild(link)
  }

  createStyle()
}

function putScript(scripts) {
  var add = function (obj, done) {
    console.log('Loader', 'try-load-script', obj.url)

    var trys = 0

    var sreateScript = function () {
      var script = document.createElement('script')

      script.type = 'text/javascript'

      script.onload = script.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState == 'loaded' ||
          this.readyState == 'complete'
        ) {
          done()
        }
      }

      script.onerror = function () {
        trys++

        console.log('Loader', 'error-load-script', obj.url)

        if (trys < 3) {
          sreateScript()
        } else {
          done()
        }
      }

      if (obj.async) script.async = true

      script.src = obj.url

      document.getElementsByTagName('body')[0].appendChild(script)
    }

    sreateScript()
  }

  var p = 0,
    put = function () {
      p++

      if (scripts[p]) add(scripts[p], put)
    }

  add(scripts[p], put)
}

document.getElementsByTagName('html')[0].style.background = '#000000'
document.getElementsByTagName('body')[0].style.opacity = 0

console.log('Loader', 'put-style')

putStyle(base_url + 'packed/vendor.css?v=1.34')
putStyle(base_url + 'css/style.css?v=' + Math.random(), function () {
  console.log('Loader', 'main-style-load')

  document.getElementsByTagName('body')[0].style.opacity = 1
})

console.log('Loader', 'load-html')

httpGetAsync(
  base_url + 'template/_loader.html?v=' + Math.random(),
  function (html) {
    console.log('Loader', 'html-loaded')

    document.getElementsByTagName('body')[0].innerHTML = html

    var scripts_array = [
      /*{
                url: 'https://www.youtube.com/iframe_api',
                async: true
            },*/
      {
        url: base_url + 'packed/vendor.js?v=1.39'
      },
      {
        url: base_url + 'js/snow.min.js?v=' + Math.random()
      },
      {
        url: base_url + 'js/app.min.js?v=' + Math.random()
      },
      {
        url: base_url + 'js/hls.min.js?v=' + Math.random()
      }
    ]
    if (
      navigator.userAgent.toLowerCase().indexOf('webos') > -1 ||
      navigator.userAgent.toLowerCase().indexOf('web0s') > -1
    ) {
      scripts_array.unshift({
        url: './webos/webOSTV.js'
      })
    }

    putScript(scripts_array)
  },
  function () {
    document.getElementsByTagName('body')[0].innerHTML =
      '<div style="height: 100vh; display: flex; align-items: center; justify-content: center;"><img src="' +
      base_url +
      '/vokino/img/icons/tv-broken.svg" style="width: 18%" /></div>'
  }
)
