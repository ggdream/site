# Sanic基础

## 一、安装配置

~~~bash
$ pip install sanic
~~~



## 二、Hello World

1. 写一个最简单的应用

~~~python
# main.py

from sanic import Sanic
from sanic.response import text

app = Sanic()

@app.get('/')
async def root(request):
    return text('hello, world')
~~~

2. 使用命令行运行它

~~~bash
$ sanic main.app

# 你将会看到以下输出
[2021-07-21 17:30:48 +0800] [13864] [INFO] Goin' Fast @ http://127.0.0.1:8000
[2021-07-21 17:30:48 +0800] [13864] [INFO] Starting worker [13864]
~~~

3. 用你喜欢的方式访问`http://127.0.0.1:8000/`

~~~bash
# 你将得到响应
hello, world
~~~



## 三、视图函数

每个HTTP请求都会被交给对应的Handler（视图函数）进行处理，我们写代码本质就是在定义视图函数。视图函数最终要被框架注册，所以我们必须遵循**某种规则**。

### 1. 选择`async def`还是`def`

- 前者为异步函数，利用IO多路复用
- 后者为同步函数，程序阻塞运行

总之，高并发场景下，异步比同步快。不明白的原理话可以找资料或联系我，这里不做解释。

坚定地使用`async def`定义视图函数就对了

### 2. 必须定义形参`request`

- 名字可任何，但必须有
- 它的类型为：`sanic.request.Request`

~~~python
from sanic.request import Request

async def root(req: Request):
    pass

# 类型注解根据自己需要选择是否添加
# 建议添加，好处：1.类型安全；2.IDE智能提示
~~~

### 3. 返回值为`BaseHTTPResponse`类型

~~~python
from sanic.response import HTTPResponse, StreamHTTPResponse, text

async def root(req) -> HTTPResponse:
    return text('hello')
~~~

### 4. 良好健壮的视图函数示例

~~~python
from sanic.request import Request
from sanic.response import HTTPResponse, text

async def root(req: Request) -> HTTPResponse:
    return text('hello')
~~~



## 四、请求参数

### 1. Query

> 一般叫做查询参数

发送网络请求

~~~bash
$ curl http://127.0.0.1:8000/?name=王思若颖&age=18&age=21
~~~

接收方式

- `request.args`

~~~python
>>> print(request.args)
{'name': ['王思若颖'], 'age': ['18', '21']}

>>> print(request.args.get('age'))
18

>>> print(request.args.getlist('age'))
['18', '21']
~~~

- `query_args`

~~~python
>>> print(request.query_qrgs)
[('name', '王思若颖'), ('age', '18'), ('age', '21')]
~~~

- `query_string`

~~~python
>>> print(request.query_string)
name=王思若颖&age=18&age=21
~~~

### 2. Param

> 一般叫做动态参数

1. 基本使用

~~~python
@app.get('/<name>')
async def root(request, name):
    return text(f'{name}')
~~~

2. 格式约束

例如：

~~~python
@app.get('/<name:str>')
async def root(request, name: str):
    return text(f'{name}')
~~~

| 路由中的声明类型 | 对应的Python类型 | 备注                       |
| ---------------- | ---------------- | -------------------------- |
| str              | str              |                            |
| int              | int              |                            |
| float            | float            |                            |
| alpha            | str              | 前面字母大写，后面字母小写 |
| slug             | str              |                            |
| path             | str              | 从`/`开始匹配              |
| ymd              | datetime.date    | 日期：2021-07-21           |
| uuid             | UUID             |                            |
| 自定义正则表达式 | str              |                            |



### 3. Body

> 一般叫做请求体参数

根据数据发送格式和需求选择

- JSON类型：`request.json`
- Form类型：`request.form`
- File类型：`request.files`
- Raw类型：`request.body`



## 五、响应函数

> 响应必须为`HTTPResponse`类型，`HTTPResponse`是提供的子类的父类

类签名

~~~python
# 除了stream、file_stream的其他子类的父类
class sanic.response.HTTPResponse(body=None, status=200, headers=None, content_type=None)

# stream和file_stream的父类
class sanic.response.StreamingHTTPResponse(streaming_fn, status=200, headers=None, content_type='text/plain; charset=utf-8', ignore_deprecation_notice=False)
~~~

- 普通文本：text
- HTML：html
- JSON：json
- 文件：file（前加async关键字，不是流，加载文件所有内容到内存后，一次性响应客户端）
- 流：stream

~~~python
from sanic.response import stream

@app.route("/")
async def handler(request):
    return stream(streaming_fn)

async def streaming_fn(response):
    await response.write('foo')
    await response.write('bar')
~~~

- 文件流：file_stream

- 二进制：raw
- 重定向：redirect（status默认为302）
- 空：empty（status默认为204）



## 六、路由

### 1. 添加路由

- 函数式

~~~python
async def handler(request):
    return text('OK')

app.add_route(handler, '/test', methods=["POST", "PUT"])
~~~

- 装饰器

~~~python
@app.route('/test', methods=["POST", "PUT"])
async def handler(request):
    return text('OK')
~~~

### 2. 编程式路由生成

~~~python
@app.route('/')
async def index(request):
    # generate a URL for the endpoint `post_handler`
    url = app.url_for('post_handler', post_id=5)
    
    # Redirect to `/posts/5`
    return redirect(url)

@app.route('/posts/<post_id>'， name="post")
async def post_handler(request, post_id):
    ...
~~~

- 如果传递的参数没有被定义，则会被当作Query参数进行传递
- 其他参数一般用不到，不再说明
- 可以用`name`参数给路由起名，`url_for`通过该参数找到对应的视图函数

### 3. Websocket路由

~~~python
async def handler(request, ws):
    messgage = "Start"
    while True:
        await ws.send(message)
        message = ws.recv()

app.add_websocket_route(handler, "/test")
~~~

~~~python
@app.websocket("/test")
async def handler(request, ws):
    messgage = "Start"
    while True:
        await ws.send(message)
        message = ws.recv()
~~~

### 4. 静态资源

~~~python
app.static("/static", "/path/to/directory")
app.static("/", "/path/to/index.html")
~~~

### 5. 对`/`的精确匹配

默认开启，防止蓝图组冲突



## 七、生命周期钩子

- Sanic的Web服务是基于事件循环运作的，所以最好将其他中间件`例如数据库、消息队列`放到Web App事件循环中。事件循环的支配权在Sanic手上，而且中间件的操作`例如连接、断开连接`需要在特定时间点执行，所以Sanic应该提供一些Hooks API，对应Sanic官网的`Listeners`
- 特别说明：正因为Python的问题，使其必须以多进程的方式运行才能发挥多核优势。所以Sanic的钩子分为`主进程`和`服务进程`两类

### 1. Hooks列表

- `main_process_start`：程序将要开始运行时
- `main_process_end`：程序将要停止运行时
- `before_server_start`：服务将要启动时
- `after_server_start`：服务启动完成后
- `before_server_stop`：服务将要停止时
- `after_server_stop`：服务停止完成后

<div style="width: 100%;"><svg id="mermaid_382ee1ab" width="100%" xmlns="http://www.w3.org/2000/svg" height="1487" style="max-width: 960px;" viewBox="-50 -10 960 1487"><style>#mermaid_382ee1ab{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;fill:#333;}#mermaid_382ee1ab .error-icon{fill:#552222;}#mermaid_382ee1ab .error-text{fill:#552222;stroke:#552222;}#mermaid_382ee1ab .edge-thickness-normal{stroke-width:2px;}#mermaid_382ee1ab .edge-thickness-thick{stroke-width:3.5px;}#mermaid_382ee1ab .edge-pattern-solid{stroke-dasharray:0;}#mermaid_382ee1ab .edge-pattern-dashed{stroke-dasharray:3;}#mermaid_382ee1ab .edge-pattern-dotted{stroke-dasharray:2;}#mermaid_382ee1ab .marker{fill:#333333;stroke:#333333;}#mermaid_382ee1ab .marker.cross{stroke:#333333;}#mermaid_382ee1ab svg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;}#mermaid_382ee1ab .actor{stroke:hsl(259.6261682243,59.7765363128%,87.9019607843%);fill:#ECECFF;}#mermaid_382ee1ab text.actor &gt; tspan{fill:black;stroke:none;}#mermaid_382ee1ab .actor-line{stroke:grey;}#mermaid_382ee1ab .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#333;}#mermaid_382ee1ab .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#333;}#mermaid_382ee1ab #arrowhead path{fill:#333;stroke:#333;}#mermaid_382ee1ab .sequenceNumber{fill:white;}#mermaid_382ee1ab #sequencenumber{fill:#333;}#mermaid_382ee1ab #crosshead path{fill:#333;stroke:#333;}#mermaid_382ee1ab .messageText{fill:#333;stroke:#333;}#mermaid_382ee1ab .labelBox{stroke:hsl(259.6261682243,59.7765363128%,87.9019607843%);fill:#ECECFF;}#mermaid_382ee1ab .labelText,#mermaid_382ee1ab .labelText &gt; tspan{fill:black;stroke:none;}#mermaid_382ee1ab .loopText,#mermaid_382ee1ab .loopText &gt; tspan{fill:black;stroke:none;}#mermaid_382ee1ab .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:hsl(259.6261682243,59.7765363128%,87.9019607843%);fill:hsl(259.6261682243,59.7765363128%,87.9019607843%);}#mermaid_382ee1ab .note{stroke:#aaaa33;fill:#fff5ad;}#mermaid_382ee1ab .noteText,#mermaid_382ee1ab .noteText &gt; tspan{fill:black;stroke:none;}#mermaid_382ee1ab .activation0{fill:#f4f4f4;stroke:#666;}#mermaid_382ee1ab .activation1{fill:#f4f4f4;stroke:#666;}#mermaid_382ee1ab .activation2{fill:#f4f4f4;stroke:#666;}#mermaid_382ee1ab:root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}</style><g></g><g><line id="actor0" x1="75" y1="5" x2="75" y2="1476" class="actor-line" stroke-width="0.5px" stroke="#999"></line><rect x="0" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="75" y="32.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="75" dy="0">Process</tspan></text></g><g><line id="actor1" x1="289" y1="5" x2="289" y2="1476" class="actor-line" stroke-width="0.5px" stroke="#999"></line><rect x="214" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="289" y="32.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="289" dy="0">Worker</tspan></text></g><g><line id="actor2" x1="554" y1="5" x2="554" y2="1476" class="actor-line" stroke-width="0.5px" stroke="#999"></line><rect x="479" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="554" y="32.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="554" dy="0">Listener</tspan></text></g><g><line id="actor3" x1="785" y1="5" x2="785" y2="1476" class="actor-line" stroke-width="0.5px" stroke="#999"></line><rect x="710" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="785" y="32.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="785" dy="0">Handler</tspan></text></g><defs><marker id="arrowhead" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs><defs><marker id="crosshead" markerWidth="15" markerHeight="8" orient="auto" refX="16" refY="4"><path fill="black" stroke="#000000" stroke-width="1px" d="M 9,2 V 6 L16,4 Z" style="stroke-dasharray: 0, 0;"></path><path fill="none" stroke="#000000" stroke-width="1px" d="M 0,1 L 6,7 M 6,1 L 0,7" style="stroke-dasharray: 0, 0;"></path></marker></defs><defs><marker id="filled-head" refX="18" refY="7" markerWidth="20" markerHeight="28" orient="auto"><path d="M 18,7 L9,13 L14,7 L9,1 Z"></path></marker></defs><defs><marker id="sequencenumber" refX="15" refY="15" markerWidth="60" markerHeight="40" orient="auto"><circle cx="15" cy="15" r="6"></circle></marker></defs><g><rect x="0" y="75" fill="#EDF2AE" stroke="#666" width="150" height="36" rx="0" ry="0" class="note"></rect><text x="75" y="80" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="noteText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 14px; font-weight: 400;"><tspan x="75">sanic server.app</tspan></text></g><text x="315" y="151" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">@app.main_process_start</text><line x1="75" y1="188" x2="554" y2="188" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="75" y="192" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">1</text><text x="670" y="203" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Invoke event handler</text><line x1="554" y1="240" x2="785" y2="240" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="554" y="244" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">2</text><g><line x1="65" y1="121" x2="795" y2="121" class="loopLine"></line><line x1="795" y1="121" x2="795" y2="250" class="loopLine"></line><line x1="65" y1="250" x2="795" y2="250" class="loopLine"></line><line x1="65" y1="121" x2="65" y2="250" class="loopLine"></line><polygon points="65,121 115,121 115,134 106.6,141 65,141" class="labelBox"></polygon><text x="90" y="134" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="labelText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">loop</text><text x="455" y="139" text-anchor="middle" class="loopText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;"><tspan x="455"></tspan></text></g><text x="182" y="265" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Run workers</text><line x1="75" y1="302" x2="289" y2="302" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="75" y="306" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">3</text><text x="422" y="388" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">@app.before_server_start</text><line x1="289" y1="425" x2="554" y2="425" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="289" y="429" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">4</text><text x="670" y="440" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Invoke event handler</text><line x1="554" y1="477" x2="785" y2="477" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="554" y="481" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">5</text><g><line x1="279" y1="358" x2="795" y2="358" class="loopLine"></line><line x1="795" y1="358" x2="795" y2="487" class="loopLine"></line><line x1="279" y1="487" x2="795" y2="487" class="loopLine"></line><line x1="279" y1="358" x2="279" y2="487" class="loopLine"></line><polygon points="279,358 329,358 329,371 320.6,378 279,378" class="labelBox"></polygon><text x="304" y="371" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="labelText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">loop</text><text x="562" y="376" text-anchor="middle" class="loopText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;"><tspan x="562"></tspan></text></g><g><rect x="209" y="497" fill="#EDF2AE" stroke="#666" width="160" height="36" rx="0" ry="0" class="note"></rect><text x="289" y="502" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="noteText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 14px; font-weight: 400;"><tspan x="289">Server status: started</tspan></text></g><text x="422" y="573" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">@app.after_server_start</text><line x1="289" y1="610" x2="554" y2="610" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="289" y="614" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">6</text><text x="670" y="625" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Invoke event handler</text><line x1="554" y1="662" x2="785" y2="662" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="554" y="666" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">7</text><g><line x1="279" y1="543" x2="795" y2="543" class="loopLine"></line><line x1="795" y1="543" x2="795" y2="672" class="loopLine"></line><line x1="279" y1="672" x2="795" y2="672" class="loopLine"></line><line x1="279" y1="543" x2="279" y2="672" class="loopLine"></line><polygon points="279,543 329,543 329,556 320.6,563 279,563" class="labelBox"></polygon><text x="304" y="556" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="labelText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">loop</text><text x="562" y="561" text-anchor="middle" class="loopText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;"><tspan x="562"></tspan></text></g><g><rect x="213.5" y="682" fill="#EDF2AE" stroke="#666" width="151" height="36" rx="0" ry="0" class="note"></rect><text x="289" y="687" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="noteText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 14px; font-weight: 400;"><tspan x="289">Server status: ready</tspan></text></g><g><line x1="199" y1="312" x2="805" y2="312" class="loopLine"></line><line x1="805" y1="312" x2="805" y2="728" class="loopLine"></line><line x1="199" y1="728" x2="805" y2="728" class="loopLine"></line><line x1="199" y1="312" x2="199" y2="728" class="loopLine"></line><polygon points="199,312 249,312 249,325 240.6,332 199,332" class="labelBox"></polygon><text x="224" y="325" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="labelText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">loop</text><text x="527" y="330" text-anchor="middle" class="loopText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;"><tspan x="527">[Start each worker]</tspan></text></g><text x="182" y="743" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Graceful shutdown</text><line x1="75" y1="780" x2="289" y2="780" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="75" y="784" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">8</text><text x="422" y="866" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">@app.before_server_stop</text><line x1="289" y1="903" x2="554" y2="903" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="289" y="907" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">9</text><text x="670" y="918" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Invoke event handler</text><line x1="554" y1="955" x2="785" y2="955" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="554" y="959" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">10</text><g><line x1="279" y1="836" x2="795" y2="836" class="loopLine"></line><line x1="795" y1="836" x2="795" y2="965" class="loopLine"></line><line x1="279" y1="965" x2="795" y2="965" class="loopLine"></line><line x1="279" y1="836" x2="279" y2="965" class="loopLine"></line><polygon points="279,836 329,836 329,849 320.6,856 279,856" class="labelBox"></polygon><text x="304" y="849" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="labelText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">loop</text><text x="562" y="854" text-anchor="middle" class="loopText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;"><tspan x="562"></tspan></text></g><g><rect x="204.5" y="975" fill="#EDF2AE" stroke="#666" width="169" height="36" rx="0" ry="0" class="note"></rect><text x="289" y="980" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="noteText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 14px; font-weight: 400;"><tspan x="289">Server status: stopped</tspan></text></g><text x="422" y="1051" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">@app.after_server_stop</text><line x1="289" y1="1088" x2="554" y2="1088" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="289" y="1092" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">11</text><text x="670" y="1103" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Invoke event handler</text><line x1="554" y1="1140" x2="785" y2="1140" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="554" y="1144" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">12</text><g><line x1="279" y1="1021" x2="795" y2="1021" class="loopLine"></line><line x1="795" y1="1021" x2="795" y2="1150" class="loopLine"></line><line x1="279" y1="1150" x2="795" y2="1150" class="loopLine"></line><line x1="279" y1="1021" x2="279" y2="1150" class="loopLine"></line><polygon points="279,1021 329,1021 329,1034 320.6,1041 279,1041" class="labelBox"></polygon><text x="304" y="1034" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="labelText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">loop</text><text x="562" y="1039" text-anchor="middle" class="loopText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;"><tspan x="562"></tspan></text></g><g><rect x="211" y="1160" fill="#EDF2AE" stroke="#666" width="156" height="36" rx="0" ry="0" class="note"></rect><text x="289" y="1165" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="noteText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 14px; font-weight: 400;"><tspan x="289">Server status: closed</tspan></text></g><g><line x1="194.5" y1="790" x2="805" y2="790" class="loopLine"></line><line x1="805" y1="790" x2="805" y2="1206" class="loopLine"></line><line x1="194.5" y1="1206" x2="805" y2="1206" class="loopLine"></line><line x1="194.5" y1="790" x2="194.5" y2="1206" class="loopLine"></line><polygon points="194.5,790 244.5,790 244.5,803 236.1,810 194.5,810" class="labelBox"></polygon><text x="220" y="803" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="labelText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">loop</text><text x="524.75" y="808" text-anchor="middle" class="loopText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;"><tspan x="524.75">[Stop each worker]</tspan></text></g><text x="315" y="1246" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">@app.main_process_stop</text><line x1="75" y1="1283" x2="554" y2="1283" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="75" y="1287" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">13</text><text x="670" y="1298" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Invoke event handler</text><line x1="554" y1="1335" x2="785" y2="1335" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="554" y="1339" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">14</text><g><line x1="65" y1="1216" x2="795" y2="1216" class="loopLine"></line><line x1="795" y1="1216" x2="795" y2="1345" class="loopLine"></line><line x1="65" y1="1345" x2="795" y2="1345" class="loopLine"></line><line x1="65" y1="1216" x2="65" y2="1345" class="loopLine"></line><polygon points="65,1216 115,1216 115,1229 106.6,1236 65,1236" class="labelBox"></polygon><text x="90" y="1229" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="labelText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">loop</text><text x="455" y="1234" text-anchor="middle" class="loopText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;"><tspan x="455"></tspan></text></g><g><rect x="0" y="1355" fill="#EDF2AE" stroke="#666" width="150" height="36" rx="0" ry="0" class="note"></rect><text x="75" y="1360" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="noteText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 14px; font-weight: 400;"><tspan x="75">exit</tspan></text></g><g><rect x="0" y="1411" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="75" y="1443.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="75" dy="0">Process</tspan></text></g><g><rect x="214" y="1411" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="289" y="1443.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="289" dy="0">Worker</tspan></text></g><g><rect x="479" y="1411" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="554" y="1443.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="554" dy="0">Listener</tspan></text></g><g><rect x="710" y="1411" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="785" y="1443.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="785" dy="0">Handler</tspan></text></g></svg></div>

### 2. 注册方式

推荐`装饰器2`方式，字面量方式有时候不太靠谱

- 函数式

~~~python
async def setup_db(app, loop):
    app.ctx.db = await db_setup()

app.register_listener(setup_db, "before_server_start")
~~~

- 装饰器1

~~~python
@app.listener("before_server_start")
async def setup_db(app, loop):
    app.ctx.db = await db_setup()
~~~

- 装饰器2

~~~python
@app.before_server_start
async def setup_db(app, loop):
    app.ctx.db = await db_setup()
~~~



## 八、中间件

通俗来说，就是在真正的处理函数之前或之后做一些事情。

不过我个人觉得Sanic设计的不好，或者说我不习惯，他把处理前和处理后分成两个Handler处理了，不过也情有可原，因为Sanic的设计模式为：函数返回值为响应内容（Python的Web框架大多都是这样...）

<div style="width: 100%;"><svg id="mermaid_1a962853" width="100%" xmlns="http://www.w3.org/2000/svg" height="769" style="max-width: 960.5px;" viewBox="-64 -10 960.5 769"><rect x="65" y="312" fill="rgba(255, 13, 104, .1)" width="716.5" height="124" class="rect"></rect><style>#mermaid_1a962853{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;fill:#333;}#mermaid_1a962853 .error-icon{fill:#552222;}#mermaid_1a962853 .error-text{fill:#552222;stroke:#552222;}#mermaid_1a962853 .edge-thickness-normal{stroke-width:2px;}#mermaid_1a962853 .edge-thickness-thick{stroke-width:3.5px;}#mermaid_1a962853 .edge-pattern-solid{stroke-dasharray:0;}#mermaid_1a962853 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid_1a962853 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid_1a962853 .marker{fill:#333333;stroke:#333333;}#mermaid_1a962853 .marker.cross{stroke:#333333;}#mermaid_1a962853 svg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;}#mermaid_1a962853 .actor{stroke:hsl(259.6261682243,59.7765363128%,87.9019607843%);fill:#ECECFF;}#mermaid_1a962853 text.actor &gt; tspan{fill:black;stroke:none;}#mermaid_1a962853 .actor-line{stroke:grey;}#mermaid_1a962853 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#333;}#mermaid_1a962853 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#333;}#mermaid_1a962853 #arrowhead path{fill:#333;stroke:#333;}#mermaid_1a962853 .sequenceNumber{fill:white;}#mermaid_1a962853 #sequencenumber{fill:#333;}#mermaid_1a962853 #crosshead path{fill:#333;stroke:#333;}#mermaid_1a962853 .messageText{fill:#333;stroke:#333;}#mermaid_1a962853 .labelBox{stroke:hsl(259.6261682243,59.7765363128%,87.9019607843%);fill:#ECECFF;}#mermaid_1a962853 .labelText,#mermaid_1a962853 .labelText &gt; tspan{fill:black;stroke:none;}#mermaid_1a962853 .loopText,#mermaid_1a962853 .loopText &gt; tspan{fill:black;stroke:none;}#mermaid_1a962853 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:hsl(259.6261682243,59.7765363128%,87.9019607843%);fill:hsl(259.6261682243,59.7765363128%,87.9019607843%);}#mermaid_1a962853 .note{stroke:#aaaa33;fill:#fff5ad;}#mermaid_1a962853 .noteText,#mermaid_1a962853 .noteText &gt; tspan{fill:black;stroke:none;}#mermaid_1a962853 .activation0{fill:#f4f4f4;stroke:#666;}#mermaid_1a962853 .activation1{fill:#f4f4f4;stroke:#666;}#mermaid_1a962853 .activation2{fill:#f4f4f4;stroke:#666;}#mermaid_1a962853:root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}</style><g></g><g><line id="actor4" x1="75" y1="5" x2="75" y2="758" class="actor-line" stroke-width="0.5px" stroke="#999"></line><rect x="0" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="75" y="32.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="75" dy="0">Worker</tspan></text></g><g><line id="actor5" x1="291" y1="5" x2="291" y2="758" class="actor-line" stroke-width="0.5px" stroke="#999"></line><rect x="216" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="291" y="32.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="291" dy="0">Middleware</tspan></text></g><g><line id="actor6" x1="570" y1="5" x2="570" y2="758" class="actor-line" stroke-width="0.5px" stroke="#999"></line><rect x="493.5" y="0" fill="#eaeaea" stroke="#666" width="153" height="65" rx="3" ry="3" class="actor"></rect><text x="570" y="32.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="570" dy="0">MiddlewareHandler</tspan></text></g><g><line id="actor7" x1="771.5" y1="5" x2="771.5" y2="758" class="actor-line" stroke-width="0.5px" stroke="#999"></line><rect x="696.5" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="771.5" y="32.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="771.5" dy="0">RouteHandler</tspan></text></g><defs><marker id="arrowhead" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs><defs><marker id="crosshead" markerWidth="15" markerHeight="8" orient="auto" refX="16" refY="4"><path fill="black" stroke="#000000" stroke-width="1px" d="M 9,2 V 6 L16,4 Z" style="stroke-dasharray: 0, 0;"></path><path fill="none" stroke="#000000" stroke-width="1px" d="M 0,1 L 6,7 M 6,1 L 0,7" style="stroke-dasharray: 0, 0;"></path></marker></defs><defs><marker id="filled-head" refX="18" refY="7" markerWidth="20" markerHeight="28" orient="auto"><path d="M 18,7 L9,13 L14,7 L9,1 Z"></path></marker></defs><defs><marker id="sequencenumber" refX="15" refY="15" markerWidth="60" markerHeight="40" orient="auto"><circle cx="15" cy="15" r="6"></circle></marker></defs><g><rect x="-14" y="75" fill="#EDF2AE" stroke="#666" width="178" height="36" rx="0" ry="0" class="note"></rect><text x="75" y="80" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="noteText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 14px; font-weight: 400;"><tspan x="75">Incoming HTTP request</tspan></text></g><text x="183" y="151" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">@app.on_request</text><line x1="75" y1="188" x2="291" y2="188" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="75" y="192" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">1</text><text x="431" y="203" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Invoke middleware handler</text><line x1="291" y1="240" x2="570" y2="240" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="291" y="244" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">2</text><text x="323" y="255" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Return response (optional)</text><line x1="570" y1="292" x2="75" y2="292" class="messageLine1" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="stroke-dasharray: 3, 3; fill: none;"></line><text x="570" y="296" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">3</text><g><line x1="65" y1="121" x2="580" y2="121" class="loopLine"></line><line x1="580" y1="121" x2="580" y2="302" class="loopLine"></line><line x1="65" y1="302" x2="580" y2="302" class="loopLine"></line><line x1="65" y1="121" x2="65" y2="302" class="loopLine"></line><polygon points="65,121 115,121 115,134 106.6,141 65,141" class="labelBox"></polygon><text x="90" y="134" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="labelText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">loop</text><text x="347.5" y="139" text-anchor="middle" class="loopText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;"><tspan x="347.5"></tspan></text></g><text x="423" y="337" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Invoke route handler</text><line x1="75" y1="374" x2="771.5" y2="374" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="75" y="378" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">4</text><text x="423" y="389" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Return response</text><line x1="771.5" y1="426" x2="75" y2="426" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="771.5" y="430" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">5</text><text x="183" y="476" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">@app.on_response</text><line x1="75" y1="513" x2="291" y2="513" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="75" y="517" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">6</text><text x="431" y="528" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Invoke middleware handler</text><line x1="291" y1="565" x2="570" y2="565" class="messageLine0" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="fill: none;"></line><text x="291" y="569" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">7</text><text x="323" y="580" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="messageText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">Return response (optional)</text><line x1="570" y1="617" x2="75" y2="617" class="messageLine1" stroke-width="2" stroke="none" marker-end="url(#arrowhead)" marker-start="url(#sequencenumber)" style="stroke-dasharray: 3, 3; fill: none;"></line><text x="570" y="621" font-family="sans-serif" font-size="12px" text-anchor="middle" textLength="16px" class="sequenceNumber">8</text><g><line x1="65" y1="446" x2="580" y2="446" class="loopLine"></line><line x1="580" y1="446" x2="580" y2="627" class="loopLine"></line><line x1="65" y1="627" x2="580" y2="627" class="loopLine"></line><line x1="65" y1="446" x2="65" y2="627" class="loopLine"></line><polygon points="65,446 115,446 115,459 106.6,466 65,466" class="labelBox"></polygon><text x="90" y="459" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="labelText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;">loop</text><text x="347.5" y="464" text-anchor="middle" class="loopText" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 16px; font-weight: 400;"><tspan x="347.5"></tspan></text></g><g><rect x="0" y="637" fill="#EDF2AE" stroke="#666" width="150" height="36" rx="0" ry="0" class="note"></rect><text x="75" y="642" text-anchor="middle" dominant-baseline="middle" alignment-baseline="middle" class="noteText" dy="1em" style="font-family: &quot;trebuchet ms&quot;, verdana, arial, sans-serif; font-size: 14px; font-weight: 400;"><tspan x="75">Deliver response</tspan></text></g><g><rect x="0" y="693" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="75" y="725.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="75" dy="0">Worker</tspan></text></g><g><rect x="216" y="693" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="291" y="725.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="291" dy="0">Middleware</tspan></text></g><g><rect x="493.5" y="693" fill="#eaeaea" stroke="#666" width="153" height="65" rx="3" ry="3" class="actor"></rect><text x="570" y="725.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="570" dy="0">MiddlewareHandler</tspan></text></g><g><rect x="696.5" y="693" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="771.5" y="725.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle; font-size: 14px; font-weight: 400; font-family: Open-Sans, sans-serif;"><tspan x="771.5" dy="0">RouteHandler</tspan></text></g></svg></div>

### 注册方式

- 函数式

~~~python
async def extract_user(request):
    request.ctx.user = await extract_user_from_request(request)

app.register_middleware(extract_user, "request")
~~~

- 装饰器1

~~~python
@app.middleware("request")
async def extract_user(request):
    request.ctx.user = await extract_user_from_request(request)

@app.middleware('response')
async def prevent_xss(request, response):
    response.headers["x-xss-protection"] = "1; mode=block"
~~~

- 装饰器2

~~~python
@app.on_request
async def extract_user(request):
    ...

@app.on_response
async def prevent_xss(request, response):
    ...
~~~



## 九、标头

请求头和响应头分别靠Request和HTTPResponse进行数据传递和处理

### 1. 请求头

- 约定俗称类别：例如`Auth...`，用的地方较少，不再赘述
- 普适类别：`request.headers`。这是一个`dict`，调用对应方法即可

### 2. 响应头

- 视图函数：`sanic.response.HTTPResponse`有一个为`dict`类型的`headers`参数，用此参数设置响应头

- 响应中间件：第二个参数为`HTTPResponse`，直接`response.headers`修改参数属性



## 十、Cookies

- 请求：使用`request.cookies`接受，`dict`类型

- 响应：只能先用`HTTPResponse`的子类生成实例，再修改其`headers`属性，`dict`类型

如下方式设置响应Cookies的相关参数

~~~python
@app.route("/cookie")
async def test(request):
    response = text("There's a cookie up in this response")
    response.cookies["test"] = "It worked!"
    response.cookies["test"]["domain"] = ".yummy-yummy-cookie.com"
    response.cookies["test"]["httponly"] = True
    return response
~~~

- `expires: datetime` - The time for the cookie to expire on the client’s browser.
- `path: str` - The subset of URLs to which this cookie applies. Defaults to `/`.
- `comment: str` - A comment (metadata).
- `domain: str` - Specifies the domain for which the cookie is valid. An explicitly specified domain must always start with a dot.
- `max-age: int` - Number of seconds the cookie should live for.
- `secure: bool` - Specifies whether the cookie will only be sent via HTTPS.
- `httponly: bool` - Specifies whether the cookie cannot be read by JavaScript.
- `samesite: str` - Default is browser dependent, specification states (Lax, Strict, and None) are valid values.



## 十一、后台任务

~~~python
app.add_task(func)
~~~

- 一般任务：传协程函数`app.add_task(func)`，或传协程对象`app.add_task(func())`。同时被调用的函数可以接受app实例
- 在`app.run`前的任务：只能传写成函数。大白话讲，你不能把函数'加上括号'再放进去



## 十二、基于类的视图

这个不讲了，因为咱们一般都不遵守RESTful API规范..... 用不到，学了没有意义

你看，它是这样滴.... 约定的规则，也就是个`'填空题'`

~~~python
from sanic.views import HTTPMethodView

class FooBar(HTTPMethodView):
    async def get(self, request):
        ...
        
    async def post(self, request):
        ...
        
    async def put(self, request):
        ...

app.add_route(FooBar.as_view(), "/foobar")
~~~



## 十三、代理设置

我们可以通过系统API获取到的客户端的IP，但在生产环境下，我们的Web应用不可能单纯地面向公网。在客户端和真正的服务器之间还会有提供例如`反向代理、负载均衡`的服务器，它们相对真正的Web服务器而言是客户端，所以调用API获取到的是这些`'客户端'`的IP。我们只能在HTTP协议上做些`约定`，Sanic为此提供API供我们填写`约定`的`配置`

~~~python
app.config.FORWARDED_SECRET = "super-duper-secret"
app.config.REAL_IP_HEADER = "x-real-ip"
app.config.PROXIES_COUNT = 2
~~~

- FORWARDED_SECRET：约定好的密码
- REAL_IP_HEADER：约定请求头的名字
- PROXIES_COUNT：最多向前查看的个数

Sanic如果发现有以下请求头字段的存在，则会解析并使用它们

- x-forwarded-proto
- x-forwarded-host
- x-forwarded-port
- x-forwarded-path
- x-scheme



## 十四、流

Stream一般会为了处理`比较大`的数据而使用。其中，接收客户端的文件居多

### 1. 请求流

~~~python
@app.post('/stream', stream=True)
async def handler(req):
    res = ''
    while True:
        body = await req.stream.read()
        if body is None:
            break
           res += body.decode()
    return text(res)
~~~

### 2. 响应流

- 一般流

`response.eof`等同于`response.send("", True)`，代表在此之后没有东西要响应给客户端了

~~~python
from sanic.response import stream

@app.route("/")
async def test(request):
    async def sample_streaming_fn(response):
        await response.write("foo,")
        await response.write("bar")

    return stream(sample_streaming_fn, content_type="text/csv")

@app.route("/text")
async def test(request):
    response = await request.respond(content_type="text/csv")
    await response.send("foo,")
    await response.send("bar")
    await response.eof()
    return response
~~~

- 文件流

Sanic采用分块编码机制，所以响应头里不会自动添加`Content-Length`字段（即使你关闭此机制，也同样不会添加）

如果你需要它，就只能手动添加

~~~python
from aiofiles import os as async_os
from sanic.response import file_stream

@app.route("/mp4")
async def handler_file_stream(request):
    return await response.file_stream(
        "/path/to/sample.mp4",
        chunk_size=1024,
        mime_type="application/metalink4+xml",
        headers={
            "Content-Disposition": 'Attachment; filename="nicer_name.meta4"',
            "Content-Type": "application/metalink4+xml",
        },
    )

@app.route("/")
async def index(request):
    file_path = "/srv/www/whatever.png"

    file_stat = await async_os.stat(file_path)
    headers = {"Content-Length": str(file_stat.st_size)}

    return await file_stream(
        file_path,
        headers=headers,
        chunked=False,
    )

~~~



## 十五、Websocket

- 路由及Handler：见`六、路由 -> 3.Websocket路由`
- 相关全局配置

~~~python
app.config.WEBSOCKET_MAX_SIZE = 2 ** 20
app.config.WEBSOCKET_MAX_QUEUE = 32
app.config.WEBSOCKET_READ_LIMIT = 2 ** 16
app.config.WEBSOCKET_WRITE_LIMIT = 2 ** 16
app.config.WEBSOCKET_PING_INTERVAL = 20
app.config.WEBSOCKET_PING_TIMEOUT = 20
~~~



## 十六、路由组

在Python的Web框架里一般叫蓝图（Blueprint）。我个人觉得语义不清晰，容易给新手带来疑惑，所以我就直接叫它路由组了

为了大家看我的和看官网的能保持统一，这部分内容用`蓝图`这一名称板书

### 1. 路由分组规则

- 蓝图：言简意赅，有着同一路由前缀的路由集合

~~~python
bp = Blueprint("test", url_prefix="/foo", version=1)

# /v1/foo/html
@bp.route("/html")
def handle_request1(request):
    return response.html("<p>Hello world!</p>")

# /v1/foo/text
@bp.route("/text")
def handle_request2(request):
    return response.text("Hello world!")
~~~

- 蓝图组：多个蓝图的集合

~~~python
from sanic.blueprints import Blueprint
from sanic.response import json

bp1 = Blueprint(
    name="blueprint-1",
    url_prefix="/bp1",
    version=1.25,
)
bp2 = Blueprint(
    name="blueprint-2",
    url_prefix="/bp2",
)

group = Blueprint.group(
    [bp1, bp2],
    url_prefix="/bp-group",
    version="v2",
)

# GET /v1.25/bp-group/bp1/endpoint-1
@bp1.get("/endpoint-1")
async def handle_endpoint_1_bp1(request):
    return json({"Source": "blueprint-1/endpoint-1"})

# GET /v2/bp-group/bp2/endpoint-2
@bp2.get("/endpoint-1")
async def handle_endpoint_1_bp2(request):
    return json({"Source": "blueprint-2/endpoint-1"})

# GET /v1/bp-group/bp2/endpoint-2
@bp2.get("/endpoint-2", version=1)
async def handle_endpoint_2_bp2(request):
    return json({"Source": "blueprint-2/endpoint-2"})
~~~

### 2. 版本号前缀

一个应用里应尽量做到`高内聚，低耦合`，所以`视图函数`和`路由器`模块应该分开

`路由器`模块通过划分文件来划分路由组，在各自的路由组里导入对应的视图函数，将版本号分离。利用`蓝图`和`蓝图组`的`url_prefix`进行版本号管理。因此，我个人不推荐使用Sanic官方提供的API进行版本管理

当然，你可以按官方的教程来做API版本控制。[Sanic API 版本控制](https://sanicframework.org/en/guide/advanced/versioning.html#version-prefix)



## 十七、运行与部署

### 1. 全局配置

1. 基础配置

~~~python
app = Sanic("myapp")
app.config.DB_NAME = "appdb"
app.config["DB_USER"] = "appuser"
~~~

~~~python
db_settings = {
    'DB_HOST': 'localhost',
    'DB_NAME': 'appdb',
    'DB_USER': 'appuser'
}
app.config.update(db_settings)

# 使用`update`是为了覆盖掉一些原本配置，不要直接`app.config = {...}`，否则内置设置会丢失
~~~

2. 加载变量

- 环境变量

Sanic默认加载以`SANIC_`开头的环境变量，可以通过`load_env`参数更改这个前缀

~~~python
app = Sanic(__name__, load_env='MYAPP_')
~~~

设置不读取环境变量

~~~python
app = Sanic(__name__, load_env=False)
~~~

- 万能加载

`app.update_config`可以加载文件、目录、类和Object集合

3. 内置配置

| **Variable**              | **Default**     | **Description**                                              |
| ------------------------- | --------------- | ------------------------------------------------------------ |
| ACCESS_LOG                | True            | Disable or enable access log                                 |
| FALLBACK_ERROR_FORMAT     | html            | Format of error response if an exception is not caught and handled |
| FORWARDED_FOR_HEADER      | X-Forwarded-For | The name of "X-Forwarded-For" HTTP header that contains client and proxy ip |
| FORWARDED_SECRET          | None            | Used to securely identify a specific proxy server (see below) |
| GRACEFUL_SHUTDOWN_TIMEOUT | 15.0            | How long to wait to force close non-idle connection (sec)    |
| KEEP_ALIVE                | True            | Disables keep-alive when False                               |
| KEEP_ALIVE_TIMEOUT        | 5               | How long to hold a TCP connection open (sec)                 |
| PROXIES_COUNT             | None            | The number of proxy servers in front of the app (e.g. nginx; see below) |
| REAL_IP_HEADER            | None            | The name of "X-Real-IP" HTTP header that contains real client ip |
| REGISTER                  | True            | Whether the app registry should be enabled                   |
| REQUEST_BUFFER_QUEUE_SIZE | 100             | Request streaming buffer queue size                          |
| REQUEST_BUFFER_SIZE       | 65536           | Request buffer size before request is paused, default is 64 Kib |
| REQUEST_ID_HEADER         | X-Request-ID    | The name of "X-Request-ID" HTTP header that contains request/correlation ID |
| REQUEST_MAX_SIZE          | 100000000       | How big a request may be (bytes), default is 100 megabytes   |
| REQUEST_TIMEOUT           | 60              | How long a request can take to arrive (sec)                  |
| RESPONSE_TIMEOUT          | 60              | How long a response can take to process (sec)                |
| WEBSOCKET_MAX_QUEUE       | 32              | Maximum length of the queue that holds incoming messages     |
| WEBSOCKET_MAX_SIZE        | 2^20            | Maximum size for incoming messages (bytes)                   |
| WEBSOCKET_PING_INTERVAL   | 20              | A Ping frame is sent every ping_interval seconds.            |
| WEBSOCKET_PING_TIMEOUT    | 20              | Connection is closed when Pong is not received after ping_timeout seconds |
| WEBSOCKET_READ_LIMIT      | 2^16            | High-water limit of the buffer for incoming bytes            |
| WEBSOCKET_WRITE_LIMIT     | 2^16            | High-water limit of the buffer for outgoing bytes            |

4. 超时配置

| 名称（单位：秒）   | 介绍                    | 说明                |
| ------------------ | ----------------------- | ------------------- |
| REQUEST_TIMEOUT    | 请求超时时长            | 超时则响应状态码408 |
| RESPONSE_TIMEOUT   | 响应超时时长            | 超时则响应状态码503 |
| KEEP_ALIVE_TIMEOUT | 保持TCP连接不断开的时长 |                     |

### 2. 开发配置

Debug模式，自动重加载

~~~python
from sanic import Sanic
from sanic.response import json

app = Sanic(__name__)

@app.route("/")
async def hello_world(request):
    return json({"hello": "world"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1234, debug=True, auto_reload=True)
~~~

### 3. 运行配置

|      参数      |     默认值     | 描述                     |
| :------------: | :------------: | :----------------------- |
|    **host**    | `"127.0.0.1"`  | 监听的网络地址           |
|    **port**    |     `8000`     | 监听的本地端口           |
|    **unix**    |     `None`     | 使用UNIX socket以代替TCP |
|   **debug**    |    `False`     | 调试模式                 |
|    **ssl**     |     `None`     | 使用SSL                  |
|    **sock**    |     `None`     |                          |
|  **workers**   |      `1`       | 进程数                   |
|    **loop**    |     `None`     |                          |
|  **protocol**  | `HttpProtocol` |                          |
| **access_log** |     `True`     | 服务器日志               |

#### a. Sanic Server

CPU核心使用数设置

~~~python
import multiprocessing
workers = multiprocessing.cpu_count()
app.run(..., workers=workers)

# server.py
app = Sanic("My App")
~~~

1. 编程式启动

~~~python
# server.py
app.run(host='0.0.0.0', port=1337, access_log=False)
~~~

~~~bash
$ python server.py
~~~

2. Sanic CLI启动

~~~bash
$ sanic server.app --host=0.0.0.0 --port=1337 --workers=4
~~~

Sanic CLI帮助文档

~~~bash
$ sanic --help
usage: sanic [-h] [-v] [--factory] [-s] [-H HOST] [-p PORT] [-u UNIX]
             [--cert CERT] [--key KEY] [--access-logs | --no-access-logs]
             [-w WORKERS] [-d] [-r] [-R PATH]
             module

                 Sanic
         Build Fast. Run Fast.

positional arguments:
  module                         Path to your Sanic app. Example: path.to.server:app
                                 If running a Simple Server, path to directory to serve. Example: ./

optional arguments:
  -h, --help                     show this help message and exit
  -v, --version                  show program's version number and exit
  --factory                      Treat app as an application factory, i.e. a () -> &lt;Sanic app> callable
  -s, --simple                   Run Sanic as a Simple Server (module arg should be a path)
                                  
  -H HOST, --host HOST           Host address [default 127.0.0.1]
  -p PORT, --port PORT           Port to serve on [default 8000]
  -u UNIX, --unix UNIX           location of unix socket
                                  
  --cert CERT                    Location of certificate for SSL
  --key KEY                      location of keyfile for SSL
                                  
  --access-logs                  display access logs
  --no-access-logs               no display access logs
                                  
  -w WORKERS, --workers WORKERS  number of worker processes [default 1]
                                  
  -d, --debug
  -r, --reload, --auto-reload    Watch source directory for file changes and reload on changes
  -R PATH, --reload-dir PATH     Extra directories to watch and reload on changes
~~~

#### b. ASGI Server

当使用 ASGI 时，您需要关注以下几件事情：

1. 当使用 Sanic 服务器，websocket 功能将使用 `websockets` 包来实现。在 ASGI 模式中，将不会使用该第三方包，因为 ASGI 服务器将会管理 websocket 链接。
2. [ASGI 生命周期协议](https://asgi.readthedocs.io/en/latest/specs/lifespan.html)中规定 ASGI 只支持两种服务器事件：启动和关闭。而 Sanic 则有四个事件：启动前、启动后、关闭前和关闭后。因此，在ASGI模式下，启动和关闭事件将连续运行，并不是根据服务器进程的实际状态来运行（因为此时是由 ASGI 服务器控制状态）。因此，最好使用 `after_server_start` 和 `before_server_stop`

这里只提广为流传的`uvicorn`，他的[官方文档](https://www.uvicorn.org/)

~~~bash
uvicorn server:app # 参数与Sanic Server类型，详情看它的官网
~~~



