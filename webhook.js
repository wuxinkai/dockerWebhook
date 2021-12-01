let http = require('http');

//签名密码
let SECRET = '123456';
//签名算法
function sign(body) {
  return `sha1=` + crypto.createHmac('sha1', SECRET).update(body).digest('hex');
}

let server = http.createServer(function (req, res) {
  console.log(req.method, req.url);
  if (req.method == 'POST' && req.url == '/webhook') {
    //获取请求体
    let buffers = []
    //分次接收客户端传过来的请全体
    req.on('data', function (buffer) {

      buffers.push(buffer)
    })
    //获取所有的请求体后连接成一个大buffer
    req.on('end', function () {
      let body = Buffer.concat(buffers)
      //验证签名 服务器会发三个请求头过来
      let event = req.headers['x-github-event'];//event=push
      //github请求来的时候，要传递请求体body,另外还会传一个signature过来，你需要验证签名对不对
      let signature = req.headers['x-hub-signature'];
      //判断签名是否一样
      if (signature !== sign(body)) {
        return res.end('Not Allowed');
      }
      //请求服务器，给服务器发送回应
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true }));

    })

  } else {
    res.end('Not Found');
  }
})


server.listen(4000, () => {
  console.log('webhook服务已经在4000端口上启动')
});