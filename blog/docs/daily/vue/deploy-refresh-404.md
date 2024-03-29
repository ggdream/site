# 部署 Vue 应用后，直接访问子路由或在子路由下刷新出现 404 空白的原因分析及对应的解决方法

> 事故案例：小魔初学前端的时候，做了个小博客，激动地把自己打包好的 SPA 部署到了自己的 GitHub 上。它开始尝试用浏览器访问自己的 GitHub Pages，强迫症迫使它从根路由打开了网站，除了网络不太好之外，小魔觉得其他都挺好。
>
> 这时，有个图片有点大所以没有加载出来，小魔急了：怎么能不完美呢？！！于是下意识地按下了`F5`刷新了页面。小魔心想：...咦~~它怎么就 404 了？？不对呀，我记得`npm run serve`的时候这样就没问题呀......
>
> 随后，它百度了一下午.....未果（请大家原谅它，这个时候的小魔手上只有百度....）
> 它只好把这个搁置一边了，初学知识有限，没人带路，看不懂 Vue 官网说的啥...
>
> 不知道过了多久..
>
> 有一天，小魔查找资料的时候，碰巧进到了别人的 GitHub Pages 里，又想起了之前的那件事...这次它并没有去看网上的帖子，而是直接去官网看 docs，看到了`history需要后端服务器支持`就瞬间明白了（因为在中间这段时间里，小魔又吸收了很多知识）

## 一、预备知识

### 1.前后端分离下的前端路由和后端路由

- 前端路由：不会向服务器发送网络请求，只是浏览器端的监听变化
- 后端路由：会向服务器发送网络请求，提供数据的 API 接口

### 2.前端路由模式
- Hash：以锚点`#`为标识，浏览器本身的设计决定了锚点后的内容不会发送至后端服务器
- History：跟后端路由看起来没区别(URL 是 REST 风格的)，所以 URL 会被完全发送至后端服务器

举个例子

```html
<!-- Hash模式下：-->
https://www.uparty.top/#/collect?id=2819914042 => /

<!-- History模式下：-->
https://www.uparty.top/collect?id=2819914042 => /collect?id=2819914042
```

### 3.默认访问的文件

如果大家有人用过 nginx，应该对`index index.html index.htm`有印象。这个是在配置默认的访问文件

我再举个例子
1. 浏览器输入地址`https://www.uparty.top/collect/`，按回车
2. 他是 History 形式的路由，所以整个 URL 都会被发送至服务器
3. 对一般服务器来说，路由对应的要么是文件资源 Handler，要么是与中间件打交道的 Handler（后者不是本文重点，不展开）
4. 对于文件资源 Handler，服务器会按照先前配置的路径下查找，可是这个网址没有指向具体的文件，所以就需要指定默认的 index。现在服务器框架一般都内置默认 index.html。Nginx 就是靠写配置来用的，所以它没有写死
5. 如果你指定的是 index.html，那么上面的地址等同于`https://www.uparty.top/collect/index.html`
6. 我们经常访问的`https://www.uparty.top`，按照 HTTP 协议的规范，浏览器会将网址处理为`https://www.uparty.top/`。我们再按照刚才的规则进行分析，就会得出一个结论，实际访问的地址为：`https://www.uparty.top/index.html`

### 4.GitHub Pages 404页面
如果你访问了不存在的资源地址，那么GitHub会帮你跳转到`404.html`文件。为什么？原因是这是GitHub为我们设定的规则，我们需要把这个`404.html`放置到根路径下


## 二、原因分析
> 当你地址栏输入`https://www.uparty.top/collect/`后，会发生什么?
1. 你写的是SPA应用，所以这是前端路由
2. 它是History形式的，会被完整的发送至后台（被浏览器当做后端路由处理了！！！）
3. 你部署到了静态资源服务器，实际访问的是文件，而且路径为`https://www.uparty.top/collect/index.html`，可是对SPA来说，这个文件一定不存在，所以会404


## 三、解决方法
通过以上分析和SPA的特点，我们所需要做的就是让服务器返回`/index.html`的内容。浏览器加载完文件后再根据路由展示出对应的视图。
**这也就是Vue官网说的`需要服务器的配合`！！！**
1. 如果你依旧看不懂我在说啥，建议直接换Hash模式
2. 如果你在使用与GitHub Pages类似的站点，放置一份与`index.html`内容一致的`404.html`即可（不要写死，尽量cp，因为Vue打包的文件名是哈希值，每次打包完都不同）
3. 如果你在使用与Nginx类似的服务器，设置404指向根路径下的`index.html`
4. 如果你在使用的是服务器框架，添加一个中间件，监听拦截前端路由，强制返回`index.html`的内容
